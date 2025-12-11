import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Form, Row, Col, Card, Alert, Tabs, Tab } from "react-bootstrap";
import axios from "axios";
import baseURL from "../ApiUrl/Apiurl";
import Swal from "sweetalert2";
import { FaEdit } from "react-icons/fa";


const ServiceRequestItemHistory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { serviceRequest, serviceItemDetails, engineerStatus, customerName, userId, editItemId } = location.state || {};
  console.log("Service Request from state:", serviceRequest);

  const [serviceRequestHistory, setServiceRequestHistory] = useState([]);
  const [items, setItems] = useState([{
    component: '',
    pm_schedule: '',
    old_comp_serial_no: '',
    new_comp_serial_no: '',
    task_type: '',
    warranty_start_date: '',
    warranty_end_date: '',
    action_taken: '',
    remarks: ''
  }]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [componentsList, setComponentsList] = useState([]);
  const [pmSchedulesList, setPmSchedulesList] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(serviceRequest?.company || "");
  const [activeTab, setActiveTab] = useState('items');
  const [updating, setUpdating] = useState(false);
  const [assignedEngineerData, setAssignedEngineerData] = useState(null);
  const [loadingEngineer, setLoadingEngineer] = useState(false);
  const [editingItemId, setEditingItemId] = useState(editItemId || null);
  const [isEditMode, setIsEditMode] = useState(!!editItemId);

  // Completion data state
  const [completionData, setCompletionData] = useState({
    act_start_datetime: '',
    act_end_datetime: '',
    act_material_cost: '',
    act_labour_hours: '',
    act_labour_cost: '',
    completion_notes: ''
  });

  // Task type options
  const taskTypeOptions = [
    'Replace',
    'Clean',
    'Top-up',
    'Repair',
    'Inspect',
    'Other'
  ];

  // Fetch assigned engineer data with hourly rate
  const fetchAssignedEngineerData = async () => {
    if (!serviceRequest?.assigned_engineer || !userId || !selectedCompany) {
      return;
    }

    setLoadingEngineer(true);
    try {
      const response = await axios.get(`${baseURL}/resources/`, {
        params: {
          user_id: userId,
          company_id: selectedCompany
        }
      });

      if (response.data.status === "success" && response.data.data) {
        const engineer = response.data.data.find(
          resource => resource.resource_id === serviceRequest.assigned_engineer
        );
        
        if (engineer) {
          setAssignedEngineerData(engineer);
          console.log("Found assigned engineer:", engineer);
        } else {
          console.warn("Assigned engineer not found in resources:", serviceRequest.assigned_engineer);
        }
      }
    } catch (error) {
      console.error("Error fetching assigned engineer data:", error);
    } finally {
      setLoadingEngineer(false);
    }
  };

  // Fetch dropdown data
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [componentsRes, pmSchedulesRes] = await Promise.all([
          axios.get(`${baseURL}/components/`),
          axios.get(`${baseURL}/service-item-pm-schedules/?user_id=${userId}&company_id=${selectedCompany}`)
        ]);
        
        setComponentsList(componentsRes.data.data || []);
        setPmSchedulesList(pmSchedulesRes.data.data || []);
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
      }
    };

    if (userId && selectedCompany) {
      fetchDropdownData();
      fetchAssignedEngineerData();
    }
  }, [userId, selectedCompany, serviceRequest?.assigned_engineer]);

  const isEngineerMissing = !serviceRequest?.assigned_engineer;


  // Calculate labour hours and cost when dates change
  useEffect(() => {
    if (completionData.act_start_datetime && completionData.act_end_datetime) {
      const start = new Date(completionData.act_start_datetime);
      const end = new Date(completionData.act_end_datetime);
      
      if (end > start) {
        const diffMs = end - start;
        const diffHours = (diffMs / (1000 * 60 * 60)).toFixed(2);
        const hourlyRate = parseFloat(assignedEngineerData?.hourly_rate) || 0;
        const labourCost = (parseFloat(diffHours) * hourlyRate).toFixed(2);
        
        setCompletionData(prev => ({
          ...prev,
          act_labour_hours: diffHours,
          act_labour_cost: labourCost
        }));
      }
    }
  }, [completionData.act_start_datetime, completionData.act_end_datetime, assignedEngineerData]);

  // Calculate labour cost when labour hours change manually
  useEffect(() => {
    if (completionData.act_labour_hours && !completionData.act_start_datetime && !completionData.act_end_datetime) {
      const hourlyRate = parseFloat(assignedEngineerData?.hourly_rate) || 0;
      const labourCost = (parseFloat(completionData.act_labour_hours) * hourlyRate).toFixed(2);
      
      setCompletionData(prev => ({
        ...prev,
        act_labour_cost: labourCost
      }));
    }
  }, [completionData.act_labour_hours, assignedEngineerData]);

  // Fetch service request history
  const fetchServiceRequestHistory = async () => {
    if (!serviceRequest?.request_id) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`${baseURL}/service-req-items-history/`, {
        params: {
          service_request: serviceRequest.request_id
        }
      });
      
      if (response.data && response.data.length > 0) {
        setServiceRequestHistory(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch service request history", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch single item for editing
  const fetchItemForEditing = async (itemId) => {
    if (!itemId) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`${baseURL}/service-req-items-history/${itemId}/`, {
        params: {
          user_id: userId,
          company_id: selectedCompany
        }
      });
      
      if (response.data && response.data.data) {
        const itemData = response.data.data;
        
        // Pre-fill the form with the item data
        setItems([{
          component: itemData.component || '',
          pm_schedule: itemData.pm_schedule || '',
          old_comp_serial_no: itemData.old_comp_serial_no || '',
          new_comp_serial_no: itemData.new_comp_serial_no || '',
          task_type: itemData.task_type || '',
          warranty_start_date: itemData.warranty_start_date ? itemData.warranty_start_date.split('T')[0] : '',
          warranty_end_date: itemData.warranty_end_date ? itemData.warranty_end_date.split('T')[0] : '',
          action_taken: itemData.action_taken || '',
          remarks: itemData.remarks || ''
        }]);
        
        setEditingItemId(itemId);
        setIsEditMode(true);
        setActiveTab('items');
      }
    } catch (error) {
      console.error("Failed to fetch item for editing", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load item data for editing',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (serviceRequest?.request_id) {
      fetchServiceRequestHistory();
      
      // If editItemId is passed in state, fetch that item for editing
      if (editItemId) {
        fetchItemForEditing(editItemId);
      }
    }
  }, [serviceRequest?.request_id, editItemId]);

  // Handle completion form field changes
  const handleCompletionDataChange = (field, value) => {
    setCompletionData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle completion form submission
  const handleCompletionSubmit = async () => {
    // Validate completion form
    if (!completionData.act_start_datetime || !completionData.act_end_datetime) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fill in both Actual Start Date Time and Actual End Date Time.',
      });
      return;
    }

    const start = new Date(completionData.act_start_datetime);
    const end = new Date(completionData.act_end_datetime);
    
    if (end <= start) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Actual End Date Time must be after Actual Start Date Time.',
      });
      return;
    }

    setUpdating(true);

    try {
      const updatePayload = {
        ...serviceRequest,
        ...completionData,
        user_id: userId,
        company_id: selectedCompany
      };

      console.log("Updating service with payload:", JSON.stringify(updatePayload, null, 2));

      await axios.put(`${baseURL}/service-pools/${serviceRequest.request_id}/`, updatePayload);

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Service completion details have been updated successfully.',
      });

      // Reset form or navigate back
      navigate(-1);

    } catch (error) {
      console.error('Error updating service completion details:', error);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: error.response?.data?.message || error.message || 'Failed to update service completion details',
      });
    } finally {
      setUpdating(false);
    }
  };

  // Handle item form changes
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  // Add new item form
  const addNewItem = () => {
    setItems([...items, {
      component: '',
      pm_schedule: '',
      old_comp_serial_no: '',
      new_comp_serial_no: '',
      task_type: '',
      warranty_start_date: '',
      warranty_end_date: '',
      action_taken: '',
      remarks: ''
    }]);
  };

  // Remove item form
  const removeItem = (index) => {
    if (items.length > 1) {
      const updatedItems = items.filter((_, i) => i !== index);
      setItems(updatedItems);
    }
  };

  // Handle form submission for all items
  const handleSubmitItems = async () => {
    // Validation
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.component || !item.task_type || !item.action_taken) {
        Swal.fire({
          icon: 'error',
          title: 'Validation Error',
          text: `Please fill in all required fields for item ${i + 1} (Component, Task Type, and Action Taken are required)`,
        });
        return;
      }
    }

    setSubmitting(true);


    try {
      if (isEditMode && editingItemId) {
        // Update existing item
        const updatePayload = {
          ...items[0],
          user_id: userId,
          company_id: selectedCompany,
          updated_by: userId
        };

        console.log("Updating service item with payload:", JSON.stringify(updatePayload, null, 2));

        await axios.put(`${baseURL}/service-req-items-history/${editingItemId}/`, updatePayload);

        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Service item has been updated successfully.',
        });

         // Navigate after successful PUT operation
      navigate(-1);


      } else {
        // Create new items
        const payload = {
          user_id: userId,
          company_id: selectedCompany,
          items: items.map(item => ({
            service_request: serviceRequest.request_id,
            component: item.component,
            pm_schedule: item.pm_schedule || null,
            old_comp_serial_no: item.old_comp_serial_no || '',
            new_comp_serial_no: item.new_comp_serial_no || '',
            task_type: item.task_type,
            warranty_start_date: item.warranty_start_date || null,
            warranty_end_date: item.warranty_end_date || null,
            action_taken: item.action_taken,
            remarks: item.remarks || '',
            serviced_by: serviceRequest.assigned_engineer,
            created_by: userId,
            updated_by: userId,
            company: selectedCompany
          }))
        };
        
        console.log("Submitting service items history with payload:", JSON.stringify(payload, null, 2));

        await axios.post(`${baseURL}/service-req-items-history/`, payload);

        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: `Service items history has been submitted successfully for ${items.length} item(s).`,
        });
      }

      // Refresh history data
      fetchServiceRequestHistory();
      
      // Reset form to one empty item and exit edit mode
      setItems([{
        component: '',
        pm_schedule: '',
        old_comp_serial_no: '',
        new_comp_serial_no: '',
        task_type: '',
        warranty_start_date: '',
        warranty_end_date: '',
        action_taken: '',
        remarks: ''
      }]);
      setIsEditMode(false);
      setEditingItemId(null);

    } catch (error) {
      console.error('Error submitting service items history:', error);
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: error.response?.data?.message || error.message || 'Failed to submit service items history',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle edit button click
  const handleEditItem = (itemId) => {
    navigate(`/servicemanager/service-request-item-history/${serviceRequest.request_id}`, {
      state: {
        serviceRequest: serviceRequest,
        serviceItemDetails: serviceItemDetails,
        engineerStatus: engineerStatus,
        customerName: customerName,
        userId: userId,
        editItemId: itemId
      },
      replace: true
    });
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditingItemId(null);
    setItems([{
      component: '',
      pm_schedule: '',
      old_comp_serial_no: '',
      new_comp_serial_no: '',
      task_type: '',
      warranty_start_date: '',
      warranty_end_date: '',
      action_taken: '',
      remarks: ''
    }]);
  };

  // Handle back button click
  const handleBack = () => {
    navigate(-1);
  };

  if (!serviceRequest) {
    return (
      <div className="container-fluid">
        <Alert variant="danger">No service request data found. Please go back and try again.</Alert>
        <Button onClick={handleBack} variant="secondary">Go Back</Button>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="pm-title">
            {isEditMode ? 'Edit Service Request Item' : 'Service Request Item History'}
          </h2>
          <p className="pm-subtitle">Request ID: {serviceRequest.request_id}</p>
          <p className="pm-subtitle">
            Assigned Engineer: {serviceRequest.assigned_engineer}
            {assignedEngineerData && (
              <span className="text-muted ms-2">
                ({assignedEngineerData.full_name}) - Hourly Rate: ₹{assignedEngineerData.hourly_rate}
              </span>
            )}
            {loadingEngineer && (
              <span className="text-muted ms-2">Loading engineer data...</span>
            )}
          </p>
          {!serviceRequest.assigned_engineer && (
  <p className="text-danger fw-bold">
    ⚠ Cannot submit items until an engineer is assigned.
  </p>
)}

          {isEditMode && (
            <Alert variant="info" className="mt-2">
              <strong>Editing Mode:</strong> You are currently editing an existing service item.
            </Alert>
          )}
        </div>
        <Button onClick={handleBack} variant="outline-secondary">
          ← Back to Service Pool
        </Button>
      </div>

      <Tabs
        activeKey={activeTab}
        onSelect={(tab) => setActiveTab(tab)}
        className="mb-4"
      >
        {/* Tab 1: Add/Edit Service Items */}
        <Tab eventKey="items" title={isEditMode ? "Edit Service Item" : "Request Service Items"}>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">
                {isEditMode ? 'Edit Service Item' : 'Add Service Items'}
                {isEditMode && (
                  <span className="text-primary ms-2">(Editing: {editingItemId})</span>
                )}
              </h5>
              {!isEditMode && (
                <Button
                  variant="success"
                  size="sm"
                  onClick={addNewItem}
                >
                  + Add Another Item
                </Button>
              )}
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <Form>
                  {items.map((item, index) => (
                    <div key={index} className="border-bottom pb-4 mb-4">
                      {items.length > 1 && (
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h6 className="text-primary mb-0">Item #{index + 1}</h6>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => removeItem(index)}
                          >
                            Remove
                          </Button>
                        </div>
                      )}
                      
                      <Row>
                        <Col xs={12} md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Service Request</Form.Label>
                            <Form.Control
                              type="text"
                              value={serviceRequest.request_id}
                              disabled
                            />
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>Component *</Form.Label>
                            <Form.Select 
                              value={item.component}
                              onChange={(e) => handleItemChange(index, 'component', e.target.value)}
                              required
                            >
                              <option value="">Select Component</option>
                              {Array.isArray(componentsList) && componentsList.map(comp => (
                                <option key={comp.id || comp.component_id} value={comp.id || comp.component_id}>
                                  {comp.component_id} - {comp.component_name}
                                </option>
                              ))}
                            </Form.Select>
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>PM Schedule</Form.Label>
                            <Form.Select 
                              value={item.pm_schedule}
                              onChange={(e) => handleItemChange(index, 'pm_schedule', e.target.value)}
                            >
                              <option value="">Select PM Schedule</option>
                              {Array.isArray(pmSchedulesList) && pmSchedulesList.map(schedule => (
                                <option key={schedule.id || schedule.pm_schedule_id} value={schedule.id || schedule.pm_schedule_id}>
                                  {schedule.pm_schedule_id} - {schedule.description}
                                </option>
                              ))}
                            </Form.Select>
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>Old Component Serial No</Form.Label>
                            <Form.Control
                              type="text"
                              value={item.old_comp_serial_no}
                              onChange={(e) => handleItemChange(index, 'old_comp_serial_no', e.target.value)}
                              placeholder="Enter old serial number"
                            />
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>New Component Serial No</Form.Label>
                            <Form.Control
                              type="text"
                              value={item.new_comp_serial_no}
                              onChange={(e) => handleItemChange(index, 'new_comp_serial_no', e.target.value)}
                              placeholder="Enter new serial number"
                            />
                          </Form.Group>
                        </Col>

                        <Col xs={12} md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Task Type *</Form.Label>
                            <Form.Select 
                              value={item.task_type}
                              onChange={(e) => handleItemChange(index, 'task_type', e.target.value)}
                              required
                            >
                              <option value="">Select Task Type</option>
                              {taskTypeOptions.map(type => (
                                <option key={type} value={type}>{type}</option>
                              ))}
                            </Form.Select>
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>Warranty Start Date</Form.Label>
                            <Form.Control
                              type="date"
                              value={item.warranty_start_date}
                              onChange={(e) => handleItemChange(index, 'warranty_start_date', e.target.value)}
                            />
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>Warranty End Date</Form.Label>
                            <Form.Control
                              type="date"
                              value={item.warranty_end_date}
                              onChange={(e) => handleItemChange(index, 'warranty_end_date', e.target.value)}
                            />
                          </Form.Group>
                        </Col>

                        <Col xs={12}>
                          <Form.Group className="mb-3">
                            <Form.Label>Action Taken *</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={3}
                              value={item.action_taken}
                              onChange={(e) => handleItemChange(index, 'action_taken', e.target.value)}
                              placeholder="Describe the action taken"
                              required
                            />
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>Remarks</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={2}
                              value={item.remarks}
                              onChange={(e) => handleItemChange(index, 'remarks', e.target.value)}
                              placeholder="Enter any additional remarks"
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </div>
                  ))}

                  <div className="d-flex gap-2">
                    {isEditMode ? (
                      <>
                        <Button
                          variant="secondary"
                          onClick={handleCancelEdit}
                        >
                          Cancel Edit
                        </Button>
                       <Button
  variant="warning"
  onClick={handleSubmitItems}
  disabled={submitting || isEngineerMissing}
>
  {submitting ? (
    <>
      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
      Updating Item...
    </>
  ) : (
    'Update Item'
  )}
</Button>

                      </>
                    ) : (
                      <>
                        <Button
                          variant="secondary"
                          onClick={handleBack}
                        >
                          Cancel
                        </Button>
                       <Button
  variant="primary"
  onClick={handleSubmitItems}
  disabled={submitting || isEngineerMissing}
>
  {submitting ? (
    <>
      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
      Submitting {items.length} Item(s)...
    </>
  ) : (
    `Submit ${items.length} Item(s)`
  )}
</Button>

                      </>
                    )}
                  </div>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Tab>

        
        {/* <Tab eventKey="completion" title="Update Completion Details">
                  <Card>
                    <Card.Header>
                      <h5 className="card-title mb-0">Service Completion Details</h5>
                    </Card.Header>
                    <Card.Body>
                      {loadingEngineer ? (
                        <div className="text-center">
                          <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading engineer data...</span>
                          </div>
                          <p className="mt-2">Loading engineer hourly rate...</p>
                        </div>
                      ) : (
                        <Form>
                          <Row>
                            <Col xs={12} md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Actual Start Date Time *</Form.Label>
                                <Form.Control
                                  type="datetime-local"
                                  value={completionData.act_start_datetime}
                                  onChange={(e) => handleCompletionDataChange('act_start_datetime', e.target.value)}
                                />
                              </Form.Group>
        
                              <Form.Group className="mb-3">
                                <Form.Label>Actual End Date Time *</Form.Label>
                                <Form.Control
                                  type="datetime-local"
                                  value={completionData.act_end_datetime}
                                  onChange={(e) => handleCompletionDataChange('act_end_datetime', e.target.value)}
                                />
                              </Form.Group>
        
                              <Form.Group className="mb-3">
                                <Form.Label>Material Cost (₹)</Form.Label>
                                <Form.Control
                                  type="number"
                                  step="0.01"
                                  value={completionData.act_material_cost}
                                  onChange={(e) => handleCompletionDataChange('act_material_cost', e.target.value)}
                                  placeholder="Enter material cost"
                                />
                              </Form.Group>
                            </Col>
        
                            <Col xs={12} md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Labour Hours</Form.Label>
                                <Form.Control
                                  type="number"
                                  step="0.01"
                                  value={completionData.act_labour_hours}
                                  onChange={(e) => handleCompletionDataChange('act_labour_hours', e.target.value)}
                                  placeholder="Auto-calculated"
                                  readOnly={!!completionData.act_start_datetime && !!completionData.act_end_datetime}
                                />
                                <Form.Text className="text-muted">
                                  {completionData.act_start_datetime && completionData.act_end_datetime 
                                    ? 'Auto-calculated from dates' 
                                    : 'Manual entry allowed if dates not set'}
                                </Form.Text>
                              </Form.Group>
        
                              <Form.Group className="mb-3">
                                <Form.Label>Labour Cost (₹)</Form.Label>
                                <Form.Control
                                  type="number"
                                  step="0.01"
                                  value={completionData.act_labour_cost}
                                  onChange={(e) => handleCompletionDataChange('act_labour_cost', e.target.value)}
                                  placeholder="Auto-calculated"
                                  readOnly
                                />
                                <Form.Text className="text-muted">
                                  {assignedEngineerData ? (
                                    `Hourly Rate: ₹${assignedEngineerData.hourly_rate} × ${completionData.act_labour_hours || '0'} hours`
                                  ) : (
                                    'Engineer hourly rate not available'
                                  )}
                                </Form.Text>
                              </Form.Group>
        
                              {assignedEngineerData && (
                                <Alert variant="info" className="mt-3">
                                  <strong>Engineer Information:</strong><br />
                                  Name: {assignedEngineerData.full_name}<br />
                                  Hourly Rate: ₹{assignedEngineerData.hourly_rate}<br />
                                  Mobile: {assignedEngineerData.mobile_no}
                                </Alert>
                              )}
                            </Col>
        
                            <Col xs={12}>
                              <Form.Group className="mb-3">
                                <Form.Label>Completion Notes</Form.Label>
                                <Form.Control
                                  as="textarea"
                                  rows={3}
                                  value={completionData.completion_notes}
                                  onChange={(e) => handleCompletionDataChange('completion_notes', e.target.value)}
                                  placeholder="Enter completion notes and remarks"
                                />
                              </Form.Group>
                            </Col>
                          </Row>
        
                          <div className="d-flex gap-2">
                            <Button
                              variant="secondary"
                              onClick={handleBack}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="primary"
                              onClick={handleCompletionSubmit}
                              disabled={updating || !assignedEngineerData}
                            >
                              {updating ? (
                                <>
                                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                  Updating...
                                </>
                              ) : (
                                'Update Completion Details'
                              )}
                            </Button>
                          </div>
                        </Form>
                      )}
                    </Card.Body>
                  </Card>
          </Tab> */}
                
      </Tabs>

      {/* Existing History Records */}
      {serviceRequestHistory.length > 0 && (
        <Card>
          <Card.Header className="d-flex justify-content-between align-items-center">
            <h5 className="card-title mb-0">Existing History Records</h5>
            <span className="text-muted">Total: {serviceRequestHistory.length} records</span>
          </Card.Header>
          <Card.Body>
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>SR Item ID</th>
                    <th>Component</th>
                    <th>Task Type</th>
                    <th>Action Taken</th>
                    <th>Serviced By</th>
                    <th>Serviced At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {serviceRequestHistory.map((history) => (
                    <tr key={history.sr_item_id}>
                      <td>{history.sr_item_id}</td>
                      <td>{history.component}</td>
                      <td>{history.task_type}</td>
                      <td>{history.action_taken}</td>
                      <td>{history.serviced_by}</td>
                      <td>{new Date(history.serviced_at).toLocaleString()}</td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleEditItem(history.sr_item_id)}
                          title="Edit this item"
                        >
                          <FaEdit />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default ServiceRequestItemHistory;