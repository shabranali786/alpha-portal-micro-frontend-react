// src/components/EventListener.jsx
import { useSocketEvents } from '../hooks/useSocketEvents';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

/**
 * EventListener component that handles all Socket.IO events
 * This component should be placed in the main layout (Master component)
 * to ensure it's always active when the user is authenticated
 */
export const EventListener = () => {
  const { user } = useSelector((state) => state.auth);

  // Define event handlers for different event types
  const eventHandlers = {
    // Handle notification events
    notification: (payload) => {
      const { message, title, type = 'info' } = payload;
      
      // Show toast notification based on type
      const toastMessage = title ? `${title}: ${message}` : message;
      
      switch (type) {
        case 'success':
          toast.success(toastMessage, {
            position: 'top-right',
          });
          break;
        case 'error':
          toast.error(toastMessage, {
            position: 'top-right',
          });
          break;
        case 'warning':
          toast(toastMessage, {
            position: 'top-right',
            icon: '⚠️',
          });
          break;
        case 'info':
        default:
          toast(toastMessage, {
            position: 'top-right',
          });
          break;
      }
    },

    // Handle new lead events
    new_lead: (payload) => {
      const { leadName, leadId, message } = payload;
      const notificationMessage = message || `New lead: ${leadName || `Lead #${leadId}`}`;
      
      toast.success(notificationMessage, {
        position: 'top-right',
      });
      
      // You can add additional logic here, such as:
      // - Refreshing the leads list
      // - Navigating to the lead details page
      // - Updating Redux state
    },

    // Handle invoice paid events
    invoice_paid: (payload) => {
      const { invoiceNumber, invoiceId, amount, message } = payload;
      const notificationMessage = 
        message || 
        `Invoice ${invoiceNumber || `#${invoiceId}`} has been paid${amount ? ` (${amount})` : ''}`;
      
      toast.success(notificationMessage, {
        position: 'top-right',
      });
      
      // You can add additional logic here, such as:
      // - Refreshing the invoices list
      // - Updating invoice status in Redux state
    },

    // Handle announcement events
    announcement: (payload) => {
      const { title, message, type = 'info' } = payload;
      const notificationMessage = title ? `${title}: ${message}` : message;
      
      // Announcements are typically important, so show them prominently
      toast(notificationMessage, {
        position: 'top-right',
        duration: 6000, // Longer duration for announcements
        icon: type === 'warning' ? '📢' : 'ℹ️',
      });
    },

    // Handle permission changes
    permissions: (payload) => {
      const { message, permissions } = payload;
      
      toast.success(message || 'Your permissions have been updated', {
        position: 'top-right',
      });
      
      // You can add additional logic here, such as:
      // - Refreshing user permissions in Redux state
      // - Reloading the page to reflect new permissions
      // - Updating UI based on new permissions
    },

    // Handle email events
    email: (payload) => {
      const { subject, message, type = 'info' } = payload;
      const notificationMessage = subject 
        ? `Email: ${subject}${message ? ` - ${message}` : ''}` 
        : message;
      
      toast(notificationMessage, {
        position: 'top-right',
        icon: '📧',
      });
    },

    // Handle connection errors
    connectError: (error) => {
      console.error('Socket.IO connection error:', error);
      // Optionally show a connection error notification
      // toast.error('Lost connection to event server. Attempting to reconnect...', {
      //   position: 'top-right',
      // });
    },

    // Handle general errors
    error: (error) => {
      console.error('Socket.IO error:', error);
      // Optionally show an error notification
      // toast.error('An error occurred with the event server', {
      //   position: 'top-right',
      // });
    },
  };

  // Use the socket events hook
  useSocketEvents(user, eventHandlers);

  // This component doesn't render anything
  return null;
};
