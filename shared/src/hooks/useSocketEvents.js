import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

// const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4001';
const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_URL || 'https://socket.digitechtictest.com';
const SOCKET_API_KEY = import.meta.env.VITE_SOCKET_API_KEY || '1jTNBJP2dcoNHsJSBKSQR85a9o2gLITz';

export const useSocketEvents = (user, eventHandlers = {}) => {
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    // Don't connect if user is not available or doesn't have an ID
    if (!user?.id) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setConnected(false);
      }
      return;
    }

    // Disconnect existing socket before creating a new one
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    // Get user IDs (support both camelCase and snake_case, arrays or single values)
    const userId = user.id;
    const unitIds = user.unit_ids || user.unitIds || user.unitId || user.unit_id || null;
    const teamIds = user.team_ids || user.teamIds || user.teamId || user.team_id || null;
    const brandIds = user.brand_ids || user.brandIds || user.brandId || user.brand_id || null;

    /**
     * Normalize ID values to comma-separated string for Socket.IO
     * Handles: null, empty array, single value, array, comma-separated string
     */
    const normalizeIds = (ids) => {
      // Return null for null or undefined
      if (ids === null || ids === undefined) {
        return null;
      }

      // Handle empty array
      if (Array.isArray(ids) && ids.length === 0) {
        return null;
      }

      // Handle array - convert to comma-separated string
      if (Array.isArray(ids)) {
        const filtered = ids.filter(id => id !== null && id !== undefined && id !== '');
        return filtered.length > 0 ? filtered.join(',') : null;
      }

      // Handle empty string
      if (typeof ids === 'string' && ids.trim() === '') {
        return null;
      }

      // Handle comma-separated string - use as-is
      if (typeof ids === 'string' && ids.includes(',')) {
        return ids;
      }

      // Handle single value (number or string) - convert to string
      if (ids !== null && ids !== undefined && ids !== '') {
        return String(ids);
      }

      return null;
    };

    // Normalize all IDs
    const normalizedUnitId = normalizeIds(unitIds);
    const normalizedTeamId = normalizeIds(teamIds);
    const normalizedBrandId = normalizeIds(brandIds);

    // Build query and auth objects
    const query = {
      userId: userId,
    };

    const auth = {
      userId: userId,
    };

    // Add normalized IDs only if they're not null
    if (normalizedUnitId !== null) {
      query.unitId = normalizedUnitId;
      auth.unitId = normalizedUnitId;
    }

    if (normalizedTeamId !== null) {
      query.teamId = normalizedTeamId;
      auth.teamId = normalizedTeamId;
    }

    if (normalizedBrandId !== null) {
      query.brandId = normalizedBrandId;
      auth.brandId = normalizedBrandId;
    }

    // ✅ ADD API KEY TO QUERY AND AUTH (NOT IN HEADERS)
    if (SOCKET_API_KEY) {
      query.apiKey = SOCKET_API_KEY;
      auth.apiKey = SOCKET_API_KEY;
    }

    // Create socket connection with required parameters
    const socket = io(SOCKET_SERVER_URL, {
      query: query,
      auth: auth,
      // ❌ REMOVE extraHeaders - Socket.IO doesn't use this for authentication
      // ❌ REMOVE transportOptions - Socket.IO doesn't use this for authentication
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    // Connection event handlers
    socket.on('connect', () => {
      console.log('Connected to Socket.IO event server');
      setConnected(true);
      
      // Send identify event after connection
      const identifyData = {
        userId: userId,
      };

      // Add IDs to identify event only if they're not null
      if (normalizedUnitId !== null) {
        identifyData.unitId = normalizedUnitId;
      }

      if (normalizedTeamId !== null) {
        identifyData.teamId = normalizedTeamId;
      }

      if (normalizedBrandId !== null) {
        identifyData.brandId = normalizedBrandId;
      }

      socket.emit('identify', identifyData);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO event server');
      setConnected(false);
    });

    socket.on('connected', (data) => {
      console.log('Connection confirmed:', data);
    });

    socket.on('identified', (data) => {
      console.log('User identified:', data);
    });

    // Main event listener - listens for all event types
    socket.on('event', (event) => {
      const { eventType, payload, timestamp, id } = event;
      
      // Find handler for this event type
      const handler = eventHandlers[eventType];
      
      if (handler) {
        // Call the handler with payload and full event object
        handler(payload, event);
      } else {
        // Log unhandled events
        console.log('Received unhandled event:', eventType, payload);
      }
    });

    // Error handlers
    socket.on('error', (error) => {
      console.error('Socket.IO error:', error);
      
      if (eventHandlers.error) {
        eventHandlers.error(error);
      }
    });

    socket.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error);
      
      if (eventHandlers.connectError) {
        eventHandlers.connectError(error);
      }
    });

    // Store socket reference
    socketRef.current = socket;

    // Cleanup function
    return () => {
      if (socket) {
        socket.disconnect();
        socketRef.current = null;
        setConnected(false);
      }
    };
  }, [
    user?.id,
    user?.unitId,
    user?.unit_id,
    user?.unitIds,
    user?.unit_ids,
    user?.teamId,
    user?.team_id,
    user?.teamIds,
    user?.team_ids,
    user?.brandId,
    user?.brand_id,
    user?.brandIds,
    user?.brand_ids,
  ]);

  return { 
    connected, 
    socket: socketRef.current 
  };
};