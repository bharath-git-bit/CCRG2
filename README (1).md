# Smart Queue & Appointment Management System - Frontend

A modern, responsive web application for managing customer queues and appointments in real-time. Designed for healthcare, retail, government services, and hospitality industries.

## Features

### Customer Interface
- **Real-time queue status** - See current position in queue with live updates
- **Queue visualization** - Visual representation of queue progress
- **Appointment booking** - Book appointments with date, time, and customer information
- **Wait time estimation** - Get accurate estimated wait times
- **Responsive design** - Works seamlessly on mobile, tablet, and desktop

### Staff/Admin Interface
- **Active queue management** - View all customers in queue with their status
- **Appointment tracking** - Monitor ongoing and completed appointments
- **Quick actions** - Call next, refresh queue, export reports
- **Performance metrics** - Track daily completions and average wait times
- **Status updates** - Mark appointments as completed or in-progress

## Project Structure

```
├── SmartQueueFrontend.jsx    # React component (for React projects)
├── index.html                # Standalone HTML version (no build required)
├── README.md                 # This file
├── DEPLOYMENT.md             # Deployment guide
└── API_INTEGRATION.md        # Backend API integration guide
```

## Quick Start

### Option 1: Standalone HTML (No Setup Required)
1. Download `index.html`
2. Open in any modern web browser
3. Start using immediately

### Option 2: React Integration
1. Copy `SmartQueueFrontend.jsx` to your React project
2. Install dependencies:
   ```bash
   npm install react react-dom
   ```
3. Import and use the component:
   ```jsx
   import QueueSystem from './SmartQueueFrontend';
   
   export default function App() {
     return <QueueSystem />;
   }
   ```

## Technology Stack

### Frontend
- **React 18+** (Optional - works with or without)
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS variables
- **JavaScript (ES6+)** - Interactive features

### Design System
- **Claude Design System (CDS)** - Professional, accessible UI
- **Tabler Icons** - 5800+ icon library
- **Responsive Grid Layout** - Mobile-first approach
- **Dark mode support** - Automatic light/dark mode detection

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Key Components

### 1. Navigation Tabs
Switches between Customer and Staff views with visual indicators

### 2. Metrics Dashboard
Displays real-time KPIs:
- Current queue position
- Total customers in queue
- Average wait time
- Completed appointments

### 3. Queue Visualization
- Visual indicator of queue progression
- Color-coded status (completed, current, waiting)
- Live position updates

### 4. Appointment Booking Form
- Customer name input
- Phone number validation
- Date picker
- Time slot selection
- Success confirmation toast

### 5. Queue Management Table
- Customer name and appointment time
- Current status badge
- Duration tracking
- Quick action buttons

## Styling & Customization

### CSS Variables
All colors and sizing use CSS variables for easy customization:

```css
:root {
  --text-primary: #2c2c2a;
  --text-secondary: #5f5e5a;
  --fill-accent: #378add;
  --surface-0: #f1efe8;
  --surface-1: #f9f7f2;
  --surface-2: #ffffff;
}
```

### Dark Mode
Automatically adapts to system preference using `prefers-color-scheme` media query.

### Responsive Breakpoints
- Mobile: < 768px (single column layouts)
- Tablet: 768px - 1024px (2-column layouts)
- Desktop: > 1024px (full grid layouts)

## API Integration

The frontend expects a backend API with the following endpoints:

### Customer Endpoints
```
GET /api/queue/status           # Get current queue info
POST /api/appointments/book     # Book new appointment
GET /api/appointments/{id}      # Get appointment details
PUT /api/appointments/{id}/cancel  # Cancel appointment
```

### Staff Endpoints
```
GET /api/queue/all              # Get all queue entries
PUT /api/queue/{id}/call        # Call customer to counter
PUT /api/queue/{id}/complete    # Mark appointment complete
GET /api/reports/daily          # Get daily statistics
POST /api/queue/refresh         # Refresh queue order
```

See `API_INTEGRATION.md` for detailed endpoint specifications.

## Features Implementation Details

### Real-time Updates
- Uses `setInterval` for simulated real-time updates
- Ready for WebSocket integration
- Configurable update frequency

### Form Validation
- Required field validation
- Phone number format validation
- Date/time availability checking
- Error messages with clear guidance

### Status Management
- **Completed**: Customer service finished
- **In Progress**: Customer at service counter
- **Waiting**: Customer in queue

### Queue Optimization
- Automatic position updates
- Wait time estimation algorithm
- No-show tracking capability
- Priority customer handling (optional)

## Performance Optimization

- Minimal re-renders in React version
- CSS Grid for efficient layouts
- Event delegation for table actions
- Lazy loading ready for appointments

## Accessibility (WCAG 2.1 AA)

- Semantic HTML structure
- ARIA labels for screen readers
- Keyboard navigation support
- Color contrast compliance
- Focus indicators on interactive elements
- Icon labels and descriptions

## Security Considerations

**Note**: This frontend is demonstration-ready. For production:

1. **Data Protection**
   - Implement HTTPS/TLS
   - Validate all user inputs
   - Sanitize data before display
   - Use CSRF tokens

2. **Authentication**
   - Implement JWT or OAuth
   - Role-based access control (RBAC)
   - Secure token storage

3. **Privacy**
   - GDPR/privacy law compliance
   - Secure customer data handling
   - Audit logging
   - Data retention policies

## Customization Guide

### Change Brand Colors
Edit CSS variables in `index.html` or adjust theme in React component:

```css
--fill-accent: #your-color;
--text-primary: #your-color;
--bg-accent: #your-light-color;
```

### Add Custom Fields
Extend the appointment booking form:

```jsx
<div className="form-group">
  <label>Service type</label>
  <select value={serviceType} onChange={(e) => setServiceType(e.target.value)}>
    <option>Medical Consultation</option>
    <option>Lab Work</option>
  </select>
</div>
```

### Modify Table Columns
Update the table structure to show additional appointment details:

```jsx
<th>Service</th>
<th>Notes</th>
<th>Estimated Duration</th>
```

## Troubleshooting

### Queue position not updating
- Check browser console for errors
- Verify API endpoint is responding
- Ensure WebSocket connection (if implemented)

### Dark mode not working
- Check system preference setting
- Clear browser cache
- Verify CSS variables are loaded

### Form submission failing
- Validate all required fields are filled
- Check network tab in browser dev tools
- Verify API endpoint URL

## Performance Metrics

- Page load: < 1s
- First contentful paint: < 800ms
- Time to interactive: < 1.5s
- Lighthouse score target: 90+

## Testing

### Manual Testing Checklist
- [ ] Test on desktop (1920x1080)
- [ ] Test on tablet (768x1024)
- [ ] Test on mobile (375x667)
- [ ] Test form submission
- [ ] Test tab switching
- [ ] Test status updates
- [ ] Test dark mode toggle
- [ ] Test keyboard navigation

### Unit Tests (React)
Ready for integration with Jest/React Testing Library

### E2E Tests
Ready for integration with Cypress or Playwright

## Deployment

### Standalone HTML
1. Upload `index.html` to any web host
2. No build process required
3. Works with any server (static or dynamic)

### React App
1. Build: `npm run build`
2. Deploy build folder to CDN or server
3. Configure API endpoint URLs for production

See `DEPLOYMENT.md` for detailed deployment instructions.

## Browser DevTools Tips

### View/Edit CSS Variables
```javascript
// Get all CSS variables
const computed = getComputedStyle(document.documentElement);
console.log(computed.getPropertyValue('--fill-accent'));

// Change theme dynamically
document.documentElement.style.setProperty('--fill-accent', '#new-color');
```

### Simulate Queue Updates
```javascript
// Simulate customer position update
document.getElementById('position').textContent = '2';

// Simulate status change
document.querySelector('[data-status="status"]').textContent = 'Completed';
```

## Future Enhancements

- [ ] WebSocket for real-time synchronization
- [ ] SMS/Email notifications
- [ ] Customer analytics dashboard
- [ ] Multi-language support (i18n)
- [ ] Advanced filtering and search
- [ ] Appointment reminders
- [ ] Resource/counter management
- [ ] Predictive wait time estimation
- [ ] Customer feedback/ratings
- [ ] Integration with CRM systems

## License

This project is provided as-is for demonstration and development purposes.

## Support & Questions

For implementation questions or custom features, refer to:
- `API_INTEGRATION.md` - Backend integration guide
- `DEPLOYMENT.md` - Production deployment guide
- Code comments throughout the component files

## Changelog

### Version 1.0.0
- Initial release
- Customer booking interface
- Real-time queue visualization
- Staff queue management
- Responsive design
- Dark mode support

---

**Last Updated**: January 2024
**Maintainer**: Your Team Name
