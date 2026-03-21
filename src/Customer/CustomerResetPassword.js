import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import baseURL from '../ApiUrl/Apiurl';

const SECURITY_QUESTION_CHOICES = [
  "What is your mother's maiden name?",
  "What was the name of your first pet?",
  "What was your first car?",
  "What is the name of the town where you were born?",
  "What was your childhood nickname?",
];

const CustomerResetPassword = () => {
  const { state }      = useLocation();
  const { customerId } = useParams();
  const navigate       = useNavigate();

  const customer = state?.customer || {};

  // ── All pre-filled as read-only from the customer record ──────────────────
  const mobile = customer.mobile              || '';
  const q1     = customer.security_question1  || '';
  const a1     = customer.answer1             || '';
  const q2     = customer.security_question2  || '';
  const a2     = customer.answer2             || '';
  // ─────────────────────────────────────────────────────────────────────────

  // Only field the manager types into
  const [newPassword,  setNewPassword]  = useState('');
  const [showNewPwd,   setShowNewPwd]   = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword) {
      Swal.fire({ icon: 'warning', title: 'Incomplete Form', text: 'Please enter a new password.' });
      return;
    }

    if (newPassword.length < 8) {
      Swal.fire({ icon: 'warning', title: 'Weak Password', text: 'Password must be at least 8 characters.' });
      return;
    }

    const payload = {
      mobile,
      security_question1: q1,
      answer1: a1,
      security_question2: q2,
      answer2: a2,
      new_password: newPassword,
    };

    setIsSubmitting(true);
    try {
      const response = await fetch(`${baseURL}/customer-forgot-password/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const rawText = await response.text();
      let result;
      try {
        result = JSON.parse(rawText);
      } catch {
        Swal.fire({ icon: 'error', title: 'Server Error', text: 'Server returned an invalid response.' });
        return;
      }

      if (!response.ok) {
        let msg = 'Please check your details and try again.';
        if (result?.error) msg = result.error;
        else if (result?.new_password && Array.isArray(result.new_password)) msg = result.new_password[0];
        Swal.fire({ icon: 'error', title: 'Reset Failed', text: msg });
        return;
      }

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: `Password for ${customer.full_name || customerId} reset successfully!`,
        confirmButtonColor: '#3085d6',
      }).then(() => navigate(-1));

    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Unable to connect to server. Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isSubmitting) return;
    Swal.fire({
      title: 'Cancel Reset?',
      text: 'Are you sure you want to cancel?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, cancel!',
      cancelButtonText: 'Continue',
    }).then((res) => { if (res.isConfirmed) navigate(-1); });
  };

  // Helper — find the label for a stored question value
  const questionLabel = (val) =>
    SECURITY_QUESTION_CHOICES.includes(val) ? val : val || '—';

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="container mt-4 service-request-form">
      <div className="card">

        {/* ── Header — same as CustomerForm ── */}
        <div className="card-header">
          <h2 style={{ color: 'white' }}>Reset Customer Password</h2>
          <p className="customer-subtitle">
            Resetting password for&nbsp;
            <strong>{customer.full_name || customer.username || customerId}</strong>
            &nbsp;·&nbsp;{customer.customer_id || customerId}
          </p>
        </div>

        <div className="card-body">
          <form onSubmit={handleFormSubmit}>

            {/* ── Customer Details (read-only) ── */}
            <div className="section-title">Customer Details</div>
            <div className="row mb-3">
              <div className="col-md-3">
                <label className="form-label">Customer ID</label>
                <input
                  type="text"
                  className="form-control"
                  value={customer.customer_id || customerId || '—'}
                  readOnly
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={customer.full_name || '—'}
                  readOnly
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Email</label>
                <input
                  type="text"
                  className="form-control"
                  value={customer.email || '—'}
                  readOnly
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">City</label>
                <input
                  type="text"
                  className="form-control"
                  value={customer.city || '—'}
                  readOnly
                />
              </div>
            </div>

            {/* ── Verification (read-only) ── */}
            <div className="section-title">Verification</div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Registered Mobile Number</label>
                <input
                  type="tel"
                  className="form-control"
                  value={mobile || '—'}
                  readOnly
                />
              </div>
            </div>

            {/* ── Security Question 1 (read-only) ── */}
            <div className="section-title">Security Question 1</div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Question</label>
                <input
                  type="text"
                  className="form-control"
                  value={questionLabel(q1)}
                  readOnly
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Answer</label>
                <input
                  type="text"
                  className="form-control"
                  value={a1 || '—'}
                  readOnly
                />
              </div>
            </div>

            {/* ── Security Question 2 (read-only) ── */}
            <div className="section-title">Security Question 2</div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Question</label>
                <input
                  type="text"
                  className="form-control"
                  value={questionLabel(q2)}
                  readOnly
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Answer</label>
                <input
                  type="text"
                  className="form-control"
                  value={a2 || '—'}
                  readOnly
                />
              </div>
            </div>

            {/* ── New Password (only editable field) ── */}
            <div className="section-title">New Password</div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">New Password</label>
                <div className="input-group">
                  <input
                    type={showNewPwd ? 'text' : 'password'}
                    className="form-control"
                    placeholder="Min. 8 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowNewPwd((v) => !v)}
                    tabIndex={-1}
                    title={showNewPwd ? 'Hide password' : 'Show password'}
                  >
                    {showNewPwd ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <small className="form-text text-muted">
                  At least 8 characters. Mix uppercase, numbers, and symbols for a stronger password.
                </small>
              </div>
            </div>

            {/* ── Action Buttons — same pattern as CustomerForm ── */}
            <div className="d-flex justify-content-center gap-2">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Resetting...' : 'Reset Password'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomerResetPassword;