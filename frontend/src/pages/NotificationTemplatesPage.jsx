// NotificationTemplatesPage.jsx
// Admin page for managing notification templates

import React, { useState, useEffect } from 'react';
import TemplateForm from '../components/TemplateForm';
import TemplateList from '../components/TemplateList';
import notificationApi from '../services/notificationApi';

const NotificationTemplatesPage = () => {
  // State management
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch templates
  const fetchTemplates = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await notificationApi.getTemplates();
      setTemplates(response || []);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch templates';
      setError(errorMessage);
      console.error('Error fetching templates:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load templates on component mount
  useEffect(() => {
    fetchTemplates();
  }, []);

  // Handle template creation/update
  const handleTemplateSave = (savedTemplate) => {
    // Refresh the templates list
    fetchTemplates();
    // Hide form and reset editing state
    setShowForm(false);
    setEditingTemplate(null);
  };

  // Handle template editing
  const handleTemplateEdit = (template) => {
    setEditingTemplate(template);
    setShowForm(true);
  };

  // Handle form cancel
  const handleFormCancel = () => {
    setShowForm(false);
    setEditingTemplate(null);
  };

  // Handle new template creation
  const handleCreateNew = () => {
    setEditingTemplate(null);
    setShowForm(true);
  };

  return (
    <div className="notification-templates-page">
      <div className="container">
        <header className="page-header">
          <h1>Notification Templates</h1>
          <p>Manage notification templates for different events and channels</p>
        </header>

        {/* Action Bar */}
        <section className="action-bar">
          <div className="action-content">
            <div className="stats">
              <div className="stat-item">
                <span className="stat-number">{templates.length}</span>
                <span className="stat-label">Total Templates</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">
                  {templates.filter(t => t.isActive).length}
                </span>
                <span className="stat-label">Active</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">
                  {templates.filter(t => !t.isActive).length}
                </span>
                <span className="stat-label">Inactive</span>
              </div>
            </div>
            
            <div className="action-buttons">
              <button
                onClick={handleCreateNew}
                className="btn btn-primary"
              >
                + Create New Template
              </button>
              
              <button
                onClick={fetchTemplates}
                disabled={isLoading}
                className="btn btn-outline"
              >
                Refresh
              </button>
            </div>
          </div>
        </section>

        {/* Template Form */}
        {showForm && (
          <section className="form-section">
            <TemplateForm
              template={editingTemplate}
              onSave={handleTemplateSave}
              onCancel={handleFormCancel}
            />
          </section>
        )}

        {/* Templates List */}
        <section className="templates-section">
          <TemplateList
            templates={templates}
            isLoading={isLoading}
            error={error}
            onEdit={handleTemplateEdit}
            onRefresh={fetchTemplates}
          />
        </section>

        {/* Help Section */}
        <section className="help-section">
          <div className="help-card">
            <h3>Template Management Guide</h3>
            <div className="help-content">
              <div className="help-item">
                <h4>📝 Creating Templates</h4>
                <p>Click "Create New Template" to design notification templates for different events and channels.</p>
              </div>
              <div className="help-item">
                <h4>✏️ Editing Templates</h4>
                <p>Click the "Edit" button on any template to modify its content, settings, or status.</p>
              </div>
              <div className="help-item">
                <h4>🔄 Template Variables</h4>
                <p>Use variables like {`{patientName}`}, {`{appointmentDate}`}, {`{amount}`} to personalize messages.</p>
              </div>
              <div className="help-item">
                <h4>📊 Template Status</h4>
                <p>Active templates are used for sending notifications. Inactive templates are disabled.</p>
              </div>
            </div>
            
            <div className="best-practices">
              <h4>Best Practices:</h4>
              <ul>
                <li>Keep messages clear and concise</li>
                <li>Use appropriate variables for personalization</li>
                <li>Test templates before activating them</li>
                <li>Create separate templates for different channels (email, SMS, push)</li>
                <li>Include all necessary information in the message</li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        .notification-templates-page {
          min-height: 100vh;
          background-color: #f8f9fa;
          padding: 20px 0;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .page-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .page-header h1 {
          color: #333;
          margin-bottom: 10px;
          font-size: 2.5rem;
          font-weight: 600;
        }

        .page-header p {
          color: #666;
          font-size: 1.1rem;
          margin: 0;
        }

        .action-bar {
          margin-bottom: 30px;
        }

        .action-content {
          background: white;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
        }

        .stats {
          display: flex;
          gap: 30px;
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          display: block;
          font-size: 2rem;
          font-weight: 700;
          color: #667eea;
        }

        .stat-label {
          font-size: 0.9rem;
          color: #666;
          margin-top: 5px;
        }

        .action-buttons {
          display: flex;
          gap: 12px;
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

        .btn-outline {
          background-color: transparent;
          color: #667eea;
          border: 2px solid #667eea;
        }

        .btn-outline:hover {
          background-color: #667eea;
          color: white;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .form-section {
          margin-bottom: 30px;
        }

        .templates-section {
          margin-bottom: 40px;
        }

        .help-section {
          margin-bottom: 40px;
        }

        .help-card {
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .help-card h3 {
          color: #333;
          margin-bottom: 25px;
          font-size: 1.3rem;
        }

        .help-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 25px;
          margin-bottom: 30px;
        }

        .help-item h4 {
          color: #333;
          margin: 0 0 10px 0;
          font-size: 1.1rem;
        }

        .help-item p {
          color: #666;
          margin: 0;
          line-height: 1.5;
        }

        .best-practices {
          background-color: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #667eea;
        }

        .best-practices h4 {
          color: #333;
          margin: 0 0 15px 0;
          font-size: 1.1rem;
        }

        .best-practices ul {
          margin: 0;
          padding-left: 20px;
        }

        .best-practices li {
          color: #555;
          margin-bottom: 8px;
          line-height: 1.5;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .page-header h1 {
            font-size: 2rem;
          }

          .action-content {
            flex-direction: column;
            gap: 20px;
            text-align: center;
          }

          .stats {
            justify-content: center;
            gap: 20px;
          }

          .action-buttons {
            justify-content: center;
            width: 100%;
          }

          .help-content {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }

        @media (max-width: 480px) {
          .container {
            padding: 0 15px;
          }

          .page-header {
            margin-bottom: 30px;
          }

          .page-header h1 {
            font-size: 1.8rem;
          }

          .page-header p {
            font-size: 1rem;
          }

          .action-content {
            padding: 20px;
          }

          .stats {
            gap: 15px;
          }

          .stat-number {
            font-size: 1.5rem;
          }

          .action-buttons {
            flex-direction: column;
            width: 100%;
          }

          .btn {
            width: 100%;
          }

          .help-card {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default NotificationTemplatesPage;
