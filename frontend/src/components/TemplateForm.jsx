// TemplateForm.jsx
// Component for creating and updating notification templates

import React, { useState, useEffect } from 'react';
import notificationApi from '../services/notificationApi';

const TemplateForm = ({ template, onSave, onCancel }) => {
  // Form state
  const [formData, setFormData] = useState({
    eventType: '',
    channel: 'email',
    subject: '',
    bodyTemplate: '',
    isActive: true
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('');

  // Available event types
  const eventTypes = [
    { value: 'appointment_reminder', label: 'Appointment Reminder' },
    { value: 'appointment_cancelled', label: 'Appointment Cancelled' },
    { value: 'appointment_confirmed', label: 'Appointment Confirmed' },
    { value: 'payment_success', label: 'Payment Successful' },
    { value: 'payment_failed', label: 'Payment Failed' },
    { value: 'refund_processed', label: 'Refund Processed' },
    { value: 'appointment_completed', label: 'Appointment Completed' }
  ];

  // Available channels
  const channels = [
    { value: 'email', label: 'Email' },
    { value: 'sms', label: 'SMS' },
    { value: 'push', label: 'Push Notification' }
  ];

  // Initialize form when template prop changes (for editing)
  useEffect(() => {
    if (template) {
      setFormData({
        eventType: template.eventType || '',
        channel: template.channel || 'email',
        subject: template.subject || '',
        bodyTemplate: template.bodyTemplate || template.body || '',
        isActive: template.isActive !== undefined ? template.isActive : true
      });
    } else {
      // Reset form for new template
      setFormData({
        eventType: '',
        channel: 'email',
        subject: '',
        bodyTemplate: '',
        isActive: true
      });
    }
  }, [template]);

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setMessageType('');

    // Basic validation
    if (!formData.eventType) {
      setMessage('Please select an event type');
      setMessageType('error');
      return;
    }

    if (!formData.channel) {
      setMessage('Please select a channel');
      setMessageType('error');
      return;
    }

    if (formData.channel === 'email' && !formData.subject.trim()) {
      setMessage('Subject is required for email templates');
      setMessageType('error');
      return;
    }

    if (!formData.bodyTemplate.trim()) {
      setMessage('Body template is required');
      setMessageType('error');
      return;
    }

    setIsLoading(true);

    try {
      const templateData = {
        eventType: formData.eventType,
        channel: formData.channel,
        subject: formData.subject,
        bodyTemplate: formData.bodyTemplate,
        isActive: formData.isActive
      };

      let response;
      if (template && template.id) {
        // Update existing template
        response = await notificationApi.updateTemplate(template.id, templateData);
        setMessage('Template updated successfully!');
      } else {
        // Create new template
        response = await notificationApi.createTemplate(templateData);
        setMessage('Template created successfully!');
      }
      
      setMessageType('success');
      
      // Notify parent component
      if (onSave) {
        onSave(response);
      }
      
      // Reset form after successful save
      setTimeout(() => {
        setFormData({
          eventType: '',
          channel: 'email',
          subject: '',
          bodyTemplate: '',
          isActive: true
        });
        setMessage(null);
      }, 2000);
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save template';
      setMessage(errorMessage);
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="template-form">
      <h3>{template && template.id ? 'Edit Template' : 'Create New Template'}</h3>
      
      <form onSubmit={handleSubmit} className="form">
        <div className="form-row">
          <div className="form-group half-width">
            <label htmlFor="eventType">Event Type:</label>
            <select
              id="eventType"
              name="eventType"
              value={formData.eventType}
              onChange={handleInputChange}
              disabled={isLoading}
              className="form-control"
            >
              <option value="">Select Event Type</option>
              {eventTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group half-width">
            <label htmlFor="channel">Channel:</label>
            <select
              id="channel"
              name="channel"
              value={formData.channel}
              onChange={handleInputChange}
              disabled={isLoading}
              className="form-control"
            >
              {channels.map((channel) => (
                <option key={channel.value} value={channel.value}>
                  {channel.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {formData.channel === 'email' && (
          <div className="form-group">
            <label htmlFor="subject">Subject:</label>
            <input
              id="subject"
              name="subject"
              type="text"
              value={formData.subject}
              onChange={handleInputChange}
              placeholder="Enter email subject"
              disabled={isLoading}
              className="form-control"
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="bodyTemplate">Body Template:</label>
          <textarea
            id="bodyTemplate"
            name="bodyTemplate"
            value={formData.bodyTemplate}
            onChange={handleInputChange}
            placeholder="Enter message body template. Use placeholders like {patientName}, {appointmentDate}, etc."
            disabled={isLoading}
            className="form-control textarea"
            rows="8"
            maxLength="2000"
          />
          <small className="char-count">
            {formData.bodyTemplate.length}/2000 characters
          </small>
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            Template is active
          </label>
        </div>

        {/* Template Variables Help */}
        <div className="template-help">
          <h4>Available Variables:</h4>
          <div className="variables-list">
            <span className="variable">{'{patientName}'}</span>
            <span className="variable">{'{doctorName}'}</span>
            <span className="variable">{'{appointmentDate}'}</span>
            <span className="variable">{'{appointmentTime}'}</span>
            <span className="variable">{'{amount}'}</span>
            <span className="variable">{'{paymentId}'}</span>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
          >
            {isLoading ? 'Saving...' : (template && template.id ? 'Update Template' : 'Create Template')}
          </button>
          
          <button
            type="button"
            onClick={handleCancel}
            disabled={isLoading}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Messages */}
      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}

      <style jsx>{`
        .template-form {
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          margin-bottom: 30px;
        }

        .template-form h3 {
          color: #333;
          margin-bottom: 25px;
          font-size: 1.3rem;
          font-weight: 600;
        }

        .form-row {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
        }

        .half-width {
          flex: 1;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #495057;
        }

        .form-control {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          font-size: 14px;
          transition: border-color 0.2s;
        }

        .form-control:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .textarea {
          resize: vertical;
          min-height: 120px;
        }

        .char-count {
          display: block;
          margin-top: 5px;
          color: #6c757d;
          font-size: 0.85rem;
          text-align: right;
        }

        .checkbox-group label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .checkbox-group input[type="checkbox"] {
          width: auto;
        }

        .template-help {
          background-color: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
          border-left: 4px solid #667eea;
        }

        .template-help h4 {
          color: #333;
          margin: 0 0 15px 0;
          font-size: 1rem;
        }

        .variables-list {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .variable {
          background-color: #e9ecef;
          padding: 4px 8px;
          border-radius: 4px;
          font-family: monospace;
          font-size: 0.85rem;
          color: #495057;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          margin-top: 25px;
        }

        .btn {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.2s;
        }

        .btn-primary {
          background-color: #667eea;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background-color: #5a67d8;
        }

        .btn-secondary {
          background-color: #6c757d;
          color: white;
        }

        .btn-secondary:hover {
          background-color: #5a6268;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .message {
          padding: 12px 16px;
          border-radius: 8px;
          margin-top: 20px;
          font-size: 14px;
          text-align: center;
        }

        .message.success {
          background-color: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        .message.error {
          background-color: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .template-form {
            padding: 20px;
          }

          .form-row {
            flex-direction: column;
            gap: 0;
          }

          .form-actions {
            flex-direction: column;
          }

          .btn {
            width: 100%;
          }

          .variables-list {
            flex-direction: column;
            gap: 5px;
          }
        }

        @media (max-width: 480px) {
          .template-form {
            padding: 15px;
          }

          .template-form h3 {
            font-size: 1.2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default TemplateForm;
