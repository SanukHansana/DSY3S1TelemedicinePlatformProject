// TemplateList.jsx
// Component for displaying list of notification templates

import React from 'react';
import notificationApi from '../services/notificationApi';

const TemplateList = ({ templates, isLoading, error, onEdit, onRefresh }) => {
  // Get channel icon
  const getChannelIcon = (channel) => {
    switch (channel?.toLowerCase()) {
      case 'email':
        return '📧';
      case 'sms':
        return '💬';
      case 'push':
        return '🔔';
      default:
        return '📢';
    }
  };

  // Get event type display
  const getEventTypeDisplay = (eventType) => {
    switch (eventType?.toLowerCase()) {
      case 'appointment_reminder':
        return 'Appointment Reminder';
      case 'appointment_cancelled':
        return 'Appointment Cancelled';
      case 'appointment_confirmed':
        return 'Appointment Confirmed';
      case 'payment_success':
        return 'Payment Successful';
      case 'payment_failed':
        return 'Payment Failed';
      case 'refund_processed':
        return 'Refund Processed';
      case 'appointment_completed':
        return 'Appointment Completed';
      default:
        return eventType || 'Unknown Event';
    }
  };

  // Handle template deletion
  const handleDelete = async (templateId) => {
    if (!window.confirm('Are you sure you want to delete this template?')) {
      return;
    }

    try {
      await notificationApi.deleteTemplate(templateId);
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error deleting template:', error);
      alert('Failed to delete template');
    }
  };

  // Handle template toggle (active/inactive)
  const handleToggleActive = async (template) => {
    try {
      const updatedTemplate = { ...template, isActive: !template.isActive };
      await notificationApi.updateTemplate(template.id || template._id, updatedTemplate);
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error toggling template:', error);
      alert('Failed to update template status');
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="template-list">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading templates...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="template-list">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h3>Error Loading Templates</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!templates || templates.length === 0) {
    return (
      <div className="template-list">
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>No Templates</h3>
          <p>No notification templates found. Create your first template to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="template-list">
      <div className="list-header">
        <h3>Templates ({templates.length})</h3>
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="btn btn-outline refresh-btn"
        >
          Refresh
        </button>
      </div>
      
      <div className="templates-grid">
        {templates.map((template) => (
          <div key={template.id || template._id} className="template-item">
            <div className="template-header">
              <div className="template-info">
                <span className="channel-icon">
                  {getChannelIcon(template.channel)}
                </span>
                <div className="template-details">
                  <h4 className="event-type">
                    {getEventTypeDisplay(template.eventType)}
                  </h4>
                  <span className="channel">{template.channel || 'Unknown'}</span>
                </div>
              </div>
              <div className="template-status">
                <div className={`status-badge ${template.isActive ? 'status-active' : 'status-inactive'}`}>
                  {template.isActive ? 'Active' : 'Inactive'}
                </div>
              </div>
            </div>
            
            <div className="template-content">
              {template.subject && (
                <div className="subject">
                  <strong>Subject:</strong> {template.subject}
                </div>
              )}
              
              <div className="body-preview">
                <strong>Body:</strong>
                <p>
                  {template.bodyTemplate || template.body ? 
                    (template.bodyTemplate || template.body).substring(0, 150) + 
                    ((template.bodyTemplate || template.body).length > 150 ? '...' : '')
                    : 'No body content'
                  }
                </p>
              </div>
            </div>
            
            <div className="template-actions">
              <button
                onClick={() => onEdit(template)}
                className="btn btn-sm btn-primary"
              >
                Edit
              </button>
              
              <button
                onClick={() => handleToggleActive(template)}
                className={`btn btn-sm ${template.isActive ? 'btn-warning' : 'btn-success'}`}
              >
                {template.isActive ? 'Deactivate' : 'Activate'}
              </button>
              
              <button
                onClick={() => handleDelete(template.id || template._id)}
                className="btn btn-sm btn-danger"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .template-list {
          max-width: 1000px;
          margin: 0 auto;
        }

        .list-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
          padding: 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .list-header h3 {
          margin: 0;
          color: #333;
          font-size: 1.3rem;
          font-weight: 600;
        }

        .refresh-btn {
          padding: 8px 16px;
          font-size: 0.9rem;
        }

        .templates-grid {
          display: grid;
          gap: 20px;
        }

        .template-item {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          border-left: 4px solid #667eea;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .template-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }

        .template-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 15px;
        }

        .template-info {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .channel-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .template-details {
          flex: 1;
        }

        .event-type {
          margin: 0 0 5px 0;
          color: #333;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .channel {
          color: #666;
          font-size: 0.9rem;
          text-transform: capitalize;
        }

        .status-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .status-active {
          background-color: #d4edda;
          color: #155724;
        }

        .status-inactive {
          background-color: #f8d7da;
          color: #721c24;
        }

        .template-content {
          margin-bottom: 20px;
        }

        .subject {
          color: #555;
          margin-bottom: 10px;
          font-size: 0.95rem;
        }

        .body-preview {
          color: #555;
        }

        .body-preview strong {
          display: block;
          margin-bottom: 5px;
          color: #495057;
        }

        .body-preview p {
          margin: 0;
          line-height: 1.5;
          font-size: 0.9rem;
        }

        .template-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .btn {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 600;
          transition: all 0.2s;
        }

        .btn-sm {
          padding: 6px 12px;
          font-size: 0.8rem;
        }

        .btn-primary {
          background-color: #667eea;
          color: white;
        }

        .btn-primary:hover {
          background-color: #5a67d8;
        }

        .btn-success {
          background-color: #28a745;
          color: white;
        }

        .btn-success:hover {
          background-color: #218838;
        }

        .btn-warning {
          background-color: #ffc107;
          color: #333;
        }

        .btn-warning:hover {
          background-color: #e0a800;
        }

        .btn-danger {
          background-color: #dc3545;
          color: white;
        }

        .btn-danger:hover {
          background-color: #c82333;
        }

        .btn-outline {
          background-color: transparent;
          color: #667eea;
          border: 2px solid #667eea;
        }

        .btn-outline:hover {
          background-color: #667eea;
          color: white;
        }

        .loading-state, .error-state, .empty-state {
          text-align: center;
          padding: 60px 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-icon, .empty-icon {
          font-size: 3rem;
          margin-bottom: 20px;
        }

        .error-state h3, .empty-state h3 {
          color: #333;
          margin-bottom: 15px;
        }

        .error-state p, .empty-state p {
          color: #666;
          margin: 0;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .template-list {
            margin: 0 15px;
          }

          .list-header {
            flex-direction: column;
            gap: 15px;
            text-align: center;
          }

          .template-item {
            padding: 15px;
          }

          .template-header {
            flex-direction: column;
            gap: 10px;
          }

          .template-info {
            gap: 10px;
          }

          .template-actions {
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .template-list {
            margin: 0 10px;
          }

          .list-header, .template-item {
            padding: 12px;
          }

          .event-type {
            font-size: 1rem;
          }

          .channel {
            font-size: 0.85rem;
          }

          .template-actions {
            flex-direction: column;
          }

          .btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default TemplateList;
