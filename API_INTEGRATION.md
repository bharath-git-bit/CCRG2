# API Integration Guide

Complete guide for connecting the Smart Queue Management System frontend to your backend API.

## Table of Contents
1. [API Overview](#api-overview)
2. [Authentication](#authentication)
3. [Endpoint Specifications](#endpoint-specifications)
4. [Error Handling](#error-handling)
5. [Code Examples](#code-examples)
6. [WebSocket Integration](#websocket-integration)

## API Overview

### Base URL
```
Production: https://api.yourcompany.com/v1
Staging: https://staging-api.yourcompany.com/v1
Development: http://localhost:3000/api/v1
```

### Common Headers
```
Content-Type: application/json
Authorization: Bearer {token}
X-Request-ID: {uuid}
Accept: application/json
```

### Response Format
All responses follow this format:

```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation successful",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Authentication

### JWT Token Flow

1. **Login Request**
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure_password"
}
```

2. **Response**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600,
    "user": {
      "id": "user123",
      "name": "John Doe",
      "role": "staff"
    }
  }
}
```

3. **Token Storage** (Client-side)
```javascript
// Store token in localStorage
localStorage.setItem('authToken', response.data.token);

// Store expiration time
const expiresAt = new Date().getTime() + (response.data.expiresIn * 1000);
localStorage.setItem('tokenExpiresAt', expiresAt);
```

4. **Token Usage**
```javascript
const token = localStorage.getItem('authToken');
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
};
```

## Endpoint Specifications

### Customer Endpoints

#### 1. Get Queue Status
```
GET /queue/status
Authorization: Required (Optional - can be public)
Rate Limit: 60 requests/minute

Response:
{
  "success": true,
  "data": {
    "queueId": "queue_001",
    "currentPosition": 3,
    "totalInQueue": 12,
    "averageWaitTime": 18,
    "estimatedWaitTime": 15,
    "lastUpdate": "2024-01-15T10:30:00Z"
  }
}
```

#### 2. Book Appointment
```
POST /appointments/book
Authorization: Not required
Rate Limit: 10 requests/minute
Content-Type: application/json

Request Body:
{
  "customerName": "John Smith",
  "phoneNumber": "+1-555-123-4567",
  "email": "john@example.com",
  "appointmentDate": "2024-01-15",
  "appointmentTime": "10:30",
  "serviceType": "consultation", // optional
  "notes": "First time patient", // optional
  "preferredCounter": 2 // optional
}

Response:
{
  "success": true,
  "data": {
    "appointmentId": "apt_12345",
    "confirmationCode": "ABC123",
    "customerId": "cust_001",
    "appointmentDate": "2024-01-15",
    "appointmentTime": "10:30",
    "status": "confirmed",
    "estimatedWaitTime": 45,
    "qrCode": "data:image/png;base64,..."
  }
}
```

#### 3. Get Appointment Details
```
GET /appointments/{appointmentId}
Authorization: Not required
Rate Limit: 30 requests/minute

Response:
{
  "success": true,
  "data": {
    "appointmentId": "apt_12345",
    "customerId": "cust_001",
    "customerName": "John Smith",
    "status": "waiting", // waiting, in-progress, completed, cancelled
    "appointmentDate": "2024-01-15",
    "appointmentTime": "10:30",
    "queuePosition": 3,
    "estimatedWaitTime": 15,
    "serviceType": "consultation",
    "notes": "First time patient",
    "createdAt": "2024-01-15T09:00:00Z"
  }
}
```

#### 4. Cancel Appointment
```
PUT /appointments/{appointmentId}/cancel
Authorization: Optional
Rate Limit: 10 requests/minute

Request Body:
{
  "reason": "Change of plans" // optional
}

Response:
{
  "success": true,
  "data": {
    "appointmentId": "apt_12345",
    "status": "cancelled",
    "cancelledAt": "2024-01-15T10:30:00Z"
  }
}
```

### Staff/Admin Endpoints

#### 1. Get All Queue Entries
```
GET /staff/queue
Authorization: Required (Role: staff or admin)
Rate Limit: 60 requests/minute
Query Parameters:
  - status: waiting|in-progress|completed (optional)
  - limit: 50 (default)
  - offset: 0 (default)
  - sort: position|name|time (default: position)

Response:
{
  "success": true,
  "data": {
    "queue": [
      {
        "queueId": "q_001",
        "appointmentId": "apt_001",
        "position": 1,
        "customerName": "Sarah Johnson",
        "phoneNumber": "+1-555-987-6543",
        "appointmentTime": "09:20",
        "status": "in-progress",
        "duration": 20,
        "serviceType": "dental",
        "assignedCounter": 1,
        "checkedInAt": "2024-01-15T09:20:00Z"
      },
      {
        "queueId": "q_002",
        "appointmentId": "apt_002",
        "position": 2,
        "customerName": "Mike Davis",
        "phoneNumber": "+1-555-456-7890",
        "appointmentTime": "09:45",
        "status": "waiting",
        "duration": 15,
        "serviceType": "consultation",
        "assignedCounter": null,
        "checkedInAt": null
      }
    ],
    "total": 12,
    "offset": 0,
    "limit": 50
  }
}
```

#### 2. Call Next Customer
```
PUT /staff/queue/{queueId}/call
Authorization: Required (Role: staff or admin)
Rate Limit: 120 requests/minute

Request Body:
{
  "counterNumber": 1, // or counterId
  "staffId": "staff_001" // optional
}

Response:
{
  "success": true,
  "data": {
    "queueId": "q_002",
    "customerName": "Mike Davis",
    "appointmentId": "apt_002",
    "status": "in-progress",
    "counterNumber": 1,
    "calledAt": "2024-01-15T10:30:00Z",
    "displayMessage": "Please call: Mike Davis to counter 1"
  }
}
```

#### 3. Complete Appointment
```
PUT /staff/queue/{queueId}/complete
Authorization: Required (Role: staff or admin)
Rate Limit: 120 requests/minute

Request Body:
{
  "duration": 18, // actual duration in minutes
  "staffId": "staff_001",
  "notes": "Service completed successfully" // optional
}

Response:
{
  "success": true,
  "data": {
    "queueId": "q_001",
    "appointmentId": "apt_001",
    "status": "completed",
    "completedAt": "2024-01-15T09:38:00Z",
    "duration": 18,
    "nextCustomer": {
      "queueId": "q_002",
      "customerName": "Mike Davis",
      "appointmentId": "apt_002"
    }
  }
}
```

#### 4. Get Daily Statistics
```
GET /staff/reports/daily
Authorization: Required (Role: staff or admin)
Rate Limit: 30 requests/minute
Query Parameters:
  - date: 2024-01-15 (optional, defaults to today)
  - serviceType: consultation (optional)

Response:
{
  "success": true,
  "data": {
    "date": "2024-01-15",
    "totalAppointments": 45,
    "completedAppointments": 14,
    "cancelledAppointments": 2,
    "averageWaitTime": 18,
    "averageServiceTime": 20,
    "peakHour": "14:00",
    "busyPercentage": 85,
    "staffUtilization": {
      "staff_001": 90,
      "staff_002": 85,
      "staff_003": 80
    },
    "serviceBreakdown": {
      "consultation": 25,
      "dental": 12,
      "vaccination": 8
    }
  }
}
```

#### 5. Refresh Queue
```
POST /staff/queue/refresh
Authorization: Required (Role: admin)
Rate Limit: 5 requests/minute

Response:
{
  "success": true,
  "data": {
    "message": "Queue refreshed successfully",
    "queueCount": 12,
    "refreshedAt": "2024-01-15T10:30:00Z"
  }
}
```

## Error Handling

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": [
      {
        "field": "phoneNumber",
        "message": "Invalid phone number format"
      }
    ]
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### HTTP Status Codes
- `200 OK` - Request successful
- `201 Created` - Resource created
- `400 Bad Request` - Invalid parameters
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Permission denied
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource conflict (e.g., duplicate)
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error
- `503 Service Unavailable` - Service down for maintenance

### Common Error Codes
```
VALIDATION_ERROR      - Invalid request data
AUTH_REQUIRED         - Authentication token missing
AUTH_INVALID          - Invalid/expired token
PERMISSION_DENIED     - Insufficient permissions
RESOURCE_NOT_FOUND    - Requested resource not found
CONFLICT              - Resource conflict/duplicate
RATE_LIMIT_EXCEEDED   - Too many requests
SERVER_ERROR          - Internal server error
SERVICE_UNAVAILABLE   - Service maintenance
```

## Code Examples

### React Integration

#### Setup API Client
```javascript
// api/client.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1';

class APIClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = this.getAuthHeaders();

    try {
      const response = await fetch(url, {
        ...options,
        headers: { ...headers, ...options.headers }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'API Error');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Queue endpoints
  getQueueStatus() {
    return this.request('/queue/status');
  }

  // Appointment endpoints
  bookAppointment(appointmentData) {
    return this.request('/appointments/book', {
      method: 'POST',
      body: JSON.stringify(appointmentData)
    });
  }

  getAppointment(appointmentId) {
    return this.request(`/appointments/${appointmentId}`);
  }

  cancelAppointment(appointmentId, reason) {
    return this.request(`/appointments/${appointmentId}/cancel`, {
      method: 'PUT',
      body: JSON.stringify({ reason })
    });
  }

  // Staff endpoints
  getQueueList(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/staff/queue?${params}`);
  }

  callNextCustomer(queueId, counterNumber) {
    return this.request(`/staff/queue/${queueId}/call`, {
      method: 'PUT',
      body: JSON.stringify({ counterNumber })
    });
  }

  completeAppointment(queueId, duration) {
    return this.request(`/staff/queue/${queueId}/complete`, {
      method: 'PUT',
      body: JSON.stringify({ duration })
    });
  }

  getDailyStats(date) {
    return this.request(`/staff/reports/daily?date=${date}`);
  }
}

export default new APIClient();
```

#### Using in Components
```javascript
// CustomerView.jsx
import { useState, useEffect } from 'react';
import APIClient from './api/client';

export function CustomerView() {
  const [queueStatus, setQueueStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQueueStatus = async () => {
      try {
        setLoading(true);
        const response = await APIClient.getQueueStatus();
        setQueueStatus(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQueueStatus();
    
    // Poll for updates every 10 seconds
    const interval = setInterval(fetchQueueStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleBookAppointment = async (appointmentData) => {
    try {
      const response = await APIClient.bookAppointment(appointmentData);
      alert('Appointment booked successfully!');
      // Handle success
    } catch (err) {
      alert('Failed to book appointment: ' + err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Current Queue Position: {queueStatus?.currentPosition}</h2>
      <p>Total in Queue: {queueStatus?.totalInQueue}</p>
      {/* Booking form */}
    </div>
  );
}
```

### Vanilla JavaScript Integration
```javascript
// queue-client.js
const API_BASE = 'http://localhost:3000/api/v1';

async function getQueueStatus() {
  try {
    const response = await fetch(`${API_BASE}/queue/status`);
    const data = await response.json();
    
    if (data.success) {
      document.getElementById('position').textContent = data.data.currentPosition;
      document.getElementById('queue-length').textContent = data.data.totalInQueue;
      document.getElementById('wait-time').textContent = data.data.averageWaitTime + 'm';
    }
  } catch (error) {
    console.error('Error fetching queue status:', error);
  }
}

async function bookAppointment(formData) {
  try {
    const response = await fetch(`${API_BASE}/appointments/book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    const data = await response.json();
    
    if (data.success) {
      alert(`Appointment confirmed! Confirmation Code: ${data.data.confirmationCode}`);
      return data.data;
    } else {
      alert('Error: ' + data.error.message);
    }
  } catch (error) {
    console.error('Error booking appointment:', error);
  }
}

// Poll for updates every 10 seconds
setInterval(getQueueStatus, 10000);
```

## WebSocket Integration

### Real-time Queue Updates

```javascript
// ws-client.js
class QueueWebSocketClient {
  constructor(url = 'ws://localhost:3000/ws/queue') {
    this.url = url;
    this.listeners = {};
    this.connect();
  }

  connect() {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.emit('connected');
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.emit(data.type, data.payload);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.emit('error', error);
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.emit('disconnected');
      // Reconnect after 3 seconds
      setTimeout(() => this.connect(), 3000);
    };
  }

  subscribe(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }

  send(type, data) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, data }));
    }
  }

  disconnect() {
    this.ws.close();
  }
}

// Usage
const wsClient = new QueueWebSocketClient();

wsClient.subscribe('queue_updated', (data) => {
  console.log('Queue updated:', data);
  document.getElementById('position').textContent = data.currentPosition;
});

wsClient.subscribe('appointment_called', (data) => {
  console.log('Customer called:', data.customerName);
  playAudio('/sounds/notification.mp3');
});
```

## Rate Limiting

The API implements rate limiting on a per-endpoint basis:

```javascript
// Handle rate limit errors
async function makeRequest(url, options) {
  const response = await fetch(url, options);
  
  if (response.status === 429) {
    const retryAfter = response.headers.get('Retry-After');
    console.warn(`Rate limited. Retry after ${retryAfter} seconds`);
    
    // Exponential backoff
    await new Promise(resolve => 
      setTimeout(resolve, parseInt(retryAfter) * 1000)
    );
    
    return makeRequest(url, options); // Retry
  }
  
  return response;
}
```

## Testing API Endpoints

### Using curl
```bash
# Get queue status
curl -X GET http://localhost:3000/api/v1/queue/status

# Book appointment
curl -X POST http://localhost:3000/api/v1/appointments/book \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "John Smith",
    "phoneNumber": "+1-555-123-4567",
    "appointmentDate": "2024-01-15",
    "appointmentTime": "10:30"
  }'
```

### Using Postman
1. Create new request
2. Set method to GET/POST/PUT
3. Enter endpoint URL
4. Add headers: `Content-Type: application/json`
5. Add authorization token if required
6. Send request and view response

## Production Checklist

- [ ] Implement proper error handling and user feedback
- [ ] Add request/response logging
- [ ] Implement retry logic with exponential backoff
- [ ] Add request timeouts
- [ ] Validate all API responses
- [ ] Implement proper authentication flow
- [ ] Add HTTPS/TLS encryption
- [ ] Implement rate limit handling
- [ ] Add monitoring and alerting
- [ ] Document API response caching strategy
- [ ] Implement offline fallback
- [ ] Add security headers

---

For questions or issues with API integration, refer to your backend documentation or contact your API provider.
