// NotificationList.jsx
// Component for displaying list of notifications

import React from 'react';

const NotificationList = ({ notifications, isLoading, error }) => {
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Get status color class
  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'sent':
      case 'delivered':
        return 'status-success';
      case 'pending':
      case 'processing':
        return 'status-pending';
      case 'failed':
      case 'bounced':
        return 'status-failed';
      default:
        return 'status-unknown';
    }
  };

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
      case 'payment_success':
        return 'Payment Successful';
      case 'payment_failed':
        return 'Payment Failed';
      case 'appointment_confirmed':
        return 'Appointment Confirmed';
      case 'refund_processed':
        return 'Refund Processed';
      default:
        return eventType || 'Unknown Event';
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="notification-list">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading notifications...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="notification-list">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h3>Error Loading Notifications</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!notifications || notifications.length === 0) {
    return (
      <div className="notification-list">
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No Notifications</h3>
          <p>You don't have any notifications yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="notification-list">
      <div className="list-header">
        <h3>Notifications ({notifications.length})</h3>
      </div>
      
      <div className="notifications-grid">
        {notifications.map((notification) => (
          <div key={notification.id || notification._id} className="notification-item">
            <div className="notification-header">
              <div className="event-info">
                <span className="channel-icon">
                  {getChannelIcon(notification.channel)}
                </span>
                <div className="event-details">
                  <h4 className="event-type">
                    {getEventTypeDisplay(notification.eventType)}
                  </h4>
                  <span className="channel">{notification.channel || 'Unknown'}</span>
                </div>
              </div>
              <div className={`status-badge ${getStatusClass(notification.status)}`}>
                {notification.status || 'Unknown'}
              </div>
            </div>
            
            <div className="notification-content">
              {notification.content && (
                <p className="message">{notification.content}</p>
              )}
              
              {notification.recipient && (
                <div className="recipient-info">
                  <strong>To:</strong> {notification.recipient}
                </div>
              )}
            </div>
            
            <div className="notification-timestamps">
              <div className="timestamp">
                <strong>Sent:</strong> {formatDate(notification.sentAt)}
              </div>
              <div className="timestamp">
                <strong>Delivered:</strong> {formatDate(notification.deliveredAt)}
              </div>
            </div>
            
            {notification.errorMessage && (
              <div className="error-details">
                <strong>Error:</strong> {notification.errorMessage}
              </div>
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        .notification-list {
          max-width: 800px;
          margin: 0 auto;
        }

        .list-header {
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

        .notifications-grid {
          display: grid;
          gap: 20px;
        }

        .notification-item {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          border-left: 4px solid #667eea;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .notification-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }

        .notification-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 15px;
        }

        .event-info {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .channel-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .event-details {
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

        .status-success {
          background-color: #d4edda;
          color: #155724;
        }

        .status-pending {
          background-color: #fff3cd;
          color: #856404;
        }

        .status-failed {
          background-color: #f8d7da;
          color: #721c24;
        }

        .status-unknown {
          background-color: #e2e3e5;
          color: #383d41;
        }

        .notification-content {
          margin-bottom: 15px;
        }

        .message {
          color: #555;
          margin: 0 0 10px 0;
          line-height: 1.5;
        }

        .recipient-info {
          color: #666;
          font-size: 0.9rem;
        }

        .notification-timestamps {
          display: flex;
          gap: 20px;
          margin-bottom: 10px;
        }

        .timestamp {
          font-size: 0.85rem;
          color: #666;
        }

        .timestamp strong {
          color: #495057;
        }

        .error-details {
          padding: 10px;
          background-color: #f8d7da;
          color: #721c24;
          border-radius: 6px;
          font-size: 0.9rem;
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
          .notification-list {
            margin: 0 15px;
          }

          .list-header, .notification-item {
            padding: 15px;
          }

          .notification-header {
            flex-direction: column;
            gap: 10px;
          }

          .event-info {
            gap: 10px;
          }

          .notification-timestamps {
            flex-direction: column;
            gap: 5px;
          }
        }

        @media (max-width: 480px) {
          .notification-list {
            margin: 0 10px;
          }

          .list-header, .notification-item {
            padding: 12px;
          }

          .event-type {
            font-size: 1rem;
          }

          .channel {
            font-size: 0.85rem;
          }
        }
      `}</style>
    </div>
  );
};

export default NotificationList;
