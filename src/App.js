import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";

import ServiceManagerLogin from "./Login/Login";
import NewCustomer from "./Customer/NewCustomer";
import PreventiveMaintainanceChart from "./PreventiveMaintainanceChart/PreventiveMaintainanceChart";
import PreventiveMaintainance from "./PreventiveMaintainanceGroup/PreventiveMaintainance";
import ServiceItemComponents from "./ServiceItemComponents/ServiceItemComponentsTable";
import ServiceItemComponentsForm from "./ServiceItemComponents/ServiceItemComponentForm";
import NewServiceItem from "./ServiceItems/NewServiceItem";
import ServicePool from "./ServicePool/ServicePool";
import AuthProvider from "./AuthContext/AuthContext";
import CustomerComplaints from "./CustomerComplaints/Complaints";
import ServiceOrders from "./ServiceOrders/ServiceOrders";
import ServiceRequestDetail from './ServicePool/ServiceRequestDetail';
import SignUpScreen from "./Login/SignUpScreen";
import SignupSetPassword from "./Login/SignupSetPassword";
import PanelLayout from "./Navbar/PanelLayout"
import ContactPage from "./Customer/ContactPage";
import CustomerSatisfactionSurvey from "./CustomerSurvey/CustomerSatisfactionSurvey";
import ServiceContractForm from './ServiceItems/ServiceContractForm';
import ServiceRenewalForm from './ServiceItems/ServiceRenewalForm';
import PreventiveMaintainanceSchedule from "./PreventiveMaintainanceSchedule/PreventiveMaintainanceSchedule";
import ServiceTableHistory from "./ServicePool/ServiceHistoryTable";
import ServiceRequestItemHistory from "./ServicePool/ServiceRequestItemHistory"; // Add this import
import ErrorLogs from "./ErrorLogs/ErrorLogs";
import ServiceItemFormComponent from "./"
import ServiceRequestForm from './ErrorLogs/ServiceRequestForm';
import CustomerView from "./Customer/CustomerView";
import ServiceItemDetails from "./ServiceItems/ServiceItemDetails";
import ServiceItemMachineDetails from "./ServiceItems/ServiceItemMachineDetails";
import RequestItemHistory from "./ServicePool/RequestItemHistory";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/contact-api" element={<ContactPage />} />
          <Route path="/" element={<ServiceManagerLogin />} />
          <Route path="/signup" element={<SignUpScreen />} />
          <Route path="/signupset-password-screen" element={<SignupSetPassword />} />
          
          <Route
            path="/servicemanager/new-customer"
            element={
              <PanelLayout>
                <NewCustomer />
              </PanelLayout>
            }
          />
           <Route path="/servicemanager/customers/:customerId" element={
              <PanelLayout>
                 <CustomerView />
              </PanelLayout>
           
          } 
            />
          <Route
            path="/servicemanager/preventive-maintainance-chart"
            element={
              <PanelLayout>
                <PreventiveMaintainanceChart />
              </PanelLayout>
            }
          />
           <Route
            path="/servicemanager/request-item-history/:request_id"
            element={
              <PanelLayout>
                <RequestItemHistory />
              </PanelLayout>
            }
          />
          <Route
            path="/servicemanager/preventive-maintainance-group"
            element={
              <PanelLayout>
                <PreventiveMaintainance />
              </PanelLayout>
            }
          />
          <Route
            path="/servicemanager/preventive-maintainance-schedule"
            element={
              <PanelLayout>
                <PreventiveMaintainanceSchedule />
              </PanelLayout>
            }
          />
          <Route
            path="/servicemanager/service-item-components"
            element={
              <PanelLayout>
                <ServiceItemComponents />
              </PanelLayout>
            }
          />
                      <Route
              path="/servicemanager/service-item-components/add"
              element={
                <PanelLayout>
                  <ServiceItemComponentsForm />
                </PanelLayout>
              }
            />
            <Route
              path="/servicemanager/service-item-components/edit"
              element={
                <PanelLayout>
                  <ServiceItemComponentsForm />
                </PanelLayout>
              }
            />
             <Route
              path="/servicemanager/service-item-machine-details/:pcbSerialNumber"
              element={
                <PanelLayout>
                  <ServiceItemMachineDetails />
                </PanelLayout>
              }
            />
          <Route
            path="/servicemanager/new-service-item"
            element={
              <PanelLayout>
                <NewServiceItem />
              </PanelLayout>
            }
          />
          <Route
            path="/servicemanager/service-item-details/:serviceItemId"
            element={
              <PanelLayout>
                <ServiceItemDetails />
              </PanelLayout>
            }
          />
           <Route
            path="/servicemanager/error-logs"
            element={
              <PanelLayout>
                <ErrorLogs />
              </PanelLayout>
            }
          />
           <Route
            path="/servicemanager/error-logs/request-form"
            element={
              <PanelLayout>
                <ServiceRequestForm />
              </PanelLayout>
            }
          />
          <Route
            path="/servicemanager/service-contract"
            element={
              <PanelLayout>
                <ServiceContractForm />
              </PanelLayout>
            }
          />
          <Route 
            path="/servicemanager/service-renewal" 
            element={<PanelLayout><ServiceRenewalForm /></PanelLayout>} 
          />
          <Route
            path="/servicemanager/customer-complaints"
            element={
              <PanelLayout>
                <CustomerComplaints />
              </PanelLayout>
            }
          />
          <Route
            path="/servicemanager/service-pool"
            element={
              <PanelLayout>
                <ServicePool />
              </PanelLayout>
            }
          />
          {/* Add the new Service Table History route */}
          <Route
            path="/servicemanager/service-table-history"
            element={
              <PanelLayout>
                <ServiceTableHistory />
              </PanelLayout>
            }
          />
           <Route
path="/servicemanager/service-request-item-history/:requestId" 
            element={
              <PanelLayout>
                <ServiceRequestItemHistory />
              </PanelLayout>
            }
          />
          <Route
            path="/servicemanager/customer-feedback"
            element={
              <PanelLayout>
                <CustomerSatisfactionSurvey />
              </PanelLayout>
            }
          />
          <Route
            path="/servicemanager/service-orders"
            element={
              <PanelLayout>
                <ServiceOrders />
              </PanelLayout>
            }
          />
          <Route
            path="/servicemanager/service-requests/:requestId"
            element={
              <PanelLayout>
                <ServiceRequestDetail />
              </PanelLayout>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;