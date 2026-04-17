// NotificationsPage.jsx
// Page for displaying notifications for a recipient

import React, { useState, useEffect } from 'react';
import NotificationList from '../components/NotificationList';
import notificationApi from '../services/notificationApi';

const NotificationsPage = () => {
  // Test recipient ID - can be updated based on user context or routing
  const testRecipientId = 'user123@example.com';
  
  // State management
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recipientId, setRecipientId] = useState(testRecipientId);
  const [inputRecipientId, setInputRecipientId] = useState(testRecipientId);

  // Fetch notifications
  const fetchNotifications = async (recipient) => {
    if (!recipient) {
      setError('Please enter a recipient ID');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await notificationApi.getNotificationsByRecipient(recipient);
      setNotifications(response || []);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch notifications';
      setError(errorMessage);
      console.error('Error fetching notifications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    setRecipientId(inputRecipientId);
    fetchNotifications(inputRecipientId);
  };

  // Load notifications on component mount
  useEffect(() => {
    fetchNotifications(testRecipientId);
  }, []);

  // Handle refresh
  const handleRefresh = () => {
    fetchNotifications(recipientId);
  };

  // Handle clear search
  const handleClear = () => {
    setInputRecipientId('');
    setRecipientId('');
    setNotifications([]);
    setError(null);
  };

  return (
    <div className="notifications-page">
      <div className="container">
        <header className="page-header">
          <h1>Notifications</h1>
          <p>View your notifications and communication history</p>
        </header>

        {/* Search Section */}
        <section className="search-section">
          <div className="search-card">
            <h3>Search Notifications</h3>
            <form onSubmit={handleSearch} className="search-form">
              <div className="form-group">
                <label htmlFor="recipient-id">Recipient ID:</label>
                <input
                  id="recipient-id"
                  type="text"
                  value={inputRecipientId}
                  onChange={(e) => setInputRecipientId(e.target.value)}
                  placeholder="Enter email or user ID (e.g., user123@example.com)"
                  className="form-control"
                />
              </div>
              <div className="form-actions">
                <button
                  type="submit"
                  disabled={!inputRecipientId.trim()}
                  className="btn btn-primary"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="btn btn-secondary"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="btn btn-outline"
                >
                  Refresh
                </button>
              </div>
            </form>

            {/* Test data hint */}
            <div className="test-hint">
              <small>
                💡 Test with recipient ID: <strong>{testRecipientId}</strong>
              </small>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="results-section">
          <NotificationList 
            notifications={notifications}
            isLoading={isLoading}
            error={error}
          />
        </section>

        {/* Additional Information */}
        <section className="info-section">
          <div className="info-card">
            <h3>About Notifications</h3>
            <div className="info-content">
              <div className="info-item">
                <h4>📧 Email Notifications</h4>
                <p>Receive appointment reminders, payment confirmations, and updates via email.</p>
              </div>
              <div className="info-item">
                <h4>💬 SMS Notifications</h4>
                <p>Get instant text messages for urgent updates and appointment changes.</p>
              </div>
              <div className="info-item">
                <h4>🔔 Push Notifications</h4>
                <p>Receive real-time notifications on your device for important events.</p>
              </div>
            </div>
            
            <div className="status-legend">
              <h4>Status Indicators:</h4>
              <div className="legend-items">
                <div className="legend-item">
                  <span className="status-dot status-success"></span>
                  <span>Sent/Delivered</span>
                </div>
                <div className="legend-item">
                  <span className="status-dot status-pending"></span>
                  <span>Pending/Processing</span>
                </div>
                <div className="legend-item">
                  <span className="status-dot status-failed"></span>
                  <span>Failed/Bounced</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        .notifications-page {
          min-height: 100vh;
          background-color: #f8f9fa;
          padding: 20px 0;
        }

        .container {
          max-width: 1000px;
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

        .search-section {
          margin-bottom: 40px;
        }

        .search-card {
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .search-card h3 {
          margin: 0 0 20px 0;
          color: #333;
          font-size: 1.3rem;
        }

        .search-form {
          margin-bottom: 15px;
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
          font-size: 16px;
          transition: border-color 0.2s;
        }

        .form-control:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
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

        .test-hint {
          padding: 12px;
          background-color: #e3f2fd;
          border-radius: 6px;
          color: #1976d2;
          font-size: 0.9rem;
        }

        .results-section {
          margin-bottom: 40px;
        }

        .info-section {
          margin-bottom: 40px;
        }

        .info-card {
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .info-card h3 {
          margin: 0 0 25px 0;
          color: #333;
          font-size: 1.3rem;
        }

        .info-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 25px;
          margin-bottom: 30px;
        }

        .info-item h4 {
          color: #333;
          margin: 0 0 10px 0;
          font-size: 1.1rem;
        }

        .info-item p {
          color: #666;
          margin: 0;
          line-height: 1.5;
        }

        .status-legend h4 {
          color: #333;
          margin: 0 0 15px 0;
          font-size: 1.1rem;
        }

        .legend-items {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .status-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .status-success {
          background-color: #28a745;
        }

        .status-pending {
          background-color: #ffc107;
        }

        .status-failed {
          background-color: #dc3545;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .page-header h1 {
            font-size: 2rem;
          }

          .search-card, .info-card {
            padding: 20px;
          }

          .form-actions {
            flex-direction: column;
          }

          .btn {
            width: 100%;
          }

          .info-content {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .legend-items {
            flex-direction: column;
            gap: 10px;
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

          .search-card, .info-card {
            padding: 15px;
          }
        }
      `}</style>
    </div>
  );
};

export default NotificationsPage;
