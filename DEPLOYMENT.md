# Deployment Guide

Complete instructions for deploying the Smart Queue Management System frontend to various hosting platforms.

## Table of Contents
1. [Quick Start](#quick-start)
2. [Standalone HTML Deployment](#standalone-html-deployment)
3. [React App Deployment](#react-app-deployment)
4. [Docker Deployment](#docker-deployment)
5. [Environment Configuration](#environment-configuration)
6. [Performance Optimization](#performance-optimization)

## Quick Start

### Easiest: Netlify Drag & Drop (< 5 minutes)
1. Go to [netlify.com](https://netlify.com)
2. Sign up or login
3. Drag and drop `index.html` to deployment area
4. Done! Your app is live

### Local Testing
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js
npx http-server

# Then visit http://localhost:8000
```

## Standalone HTML Deployment

### Option 1: Netlify (Free)
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=.

# Your site URL will be generated automatically
```

### Option 2: GitHub Pages (Free)
```bash
# 1. Create GitHub repository
git init
git add index.html
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/queue-system.git
git push -u origin main

# 2. Enable GitHub Pages
# Go to Settings > Pages > Select 'main' branch
# Your site will be live at: https://yourusername.github.io/queue-system/
```

### Option 3: AWS S3 + CloudFront
```bash
# 1. Create S3 bucket
aws s3 mb s3://queue-management-system

# 2. Upload files
aws s3 cp index.html s3://queue-management-system/

# 3. Enable public access
aws s3api put-bucket-acl --bucket queue-management-system --acl public-read

# 4. Enable static website hosting
aws s3api put-bucket-website \
  --bucket queue-management-system \
  --website-configuration '{
    "IndexDocument": {"Suffix": "index.html"},
    "ErrorDocument": {"Key": "index.html"}
  }'

# 5. Create CloudFront distribution for CDN
# (Use AWS Console for this)
```

### Option 4: Traditional Web Host
1. Login to your hosting control panel (cPanel, Plesk, etc.)
2. Upload `index.html` to public_html folder
3. Access via your domain name

## React App Deployment

### Setup React Project
```bash
# Create React app
npx create-react-app queue-management-system
cd queue-management-system

# Install dependencies (if using external packages)
npm install

# Copy SmartQueueFrontend.jsx to src/components/
cp SmartQueueFrontend.jsx src/components/

# Update src/App.jsx
```

### App.jsx
```jsx
import QueueSystem from './components/SmartQueueFrontend';

function App() {
  return (
    <div className="App">
      <QueueSystem />
    </div>
  );
}

export default App;
```

### Build for Production
```bash
# Create optimized build
npm run build

# Build folder is ready for deployment
# Size should be ~200KB after compression
```

### Deploy to Vercel (Recommended for React)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Connect GitHub for auto-deployment
# Follow CLI prompts
```

### Deploy to Netlify
```bash
# Install CLI
npm install -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=build
```

### Deploy to Heroku
```bash
# Install Heroku CLI
brew install heroku/brew/heroku

# Login
heroku login

# Create app
heroku create queue-management-system

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### Deploy to AWS Amplify
```bash
# Install AWS CLI
npm install -g @aws-amplify/cli

# Initialize
amplify init

# Add hosting
amplify add hosting

# Publish
amplify publish
```

## Docker Deployment

### Dockerfile for Standalone HTML
```dockerfile
FROM nginx:latest

# Copy HTML file
COPY index.html /usr/share/nginx/html/

# Copy nginx config
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Dockerfile for React App
```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/build ./build

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]
```

### docker-compose.yml
```yaml
version: '3.8'

services:
  queue-app:
    build: .
    ports:
      - "80:80"
    environment:
      - REACT_APP_API_URL=https://api.yourcompany.com
    restart: always
    networks:
      - queue-network

  nginx:
    image: nginx:latest
    ports:
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - queue-app
    networks:
      - queue-network

networks:
  queue-network:
    driver: bridge
```

### Build and Run Docker
```bash
# Build image
docker build -t queue-management-system:latest .

# Run container
docker run -p 80:80 queue-management-system:latest

# Using docker-compose
docker-compose up -d

# View logs
docker logs -f <container_id>

# Stop container
docker stop <container_id>
```

## Environment Configuration

### Environment Variables
Create `.env` file for configuration:

```env
# API Configuration
REACT_APP_API_URL=https://api.yourcompany.com/v1
REACT_APP_WS_URL=wss://api.yourcompany.com/ws

# Feature Flags
REACT_APP_ENABLE_NOTIFICATIONS=true
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_SMS=false

# Styling
REACT_APP_PRIMARY_COLOR=#378ADD
REACT_APP_SECONDARY_COLOR=#27500A

# Deployment
REACT_APP_VERSION=1.0.0
REACT_APP_ENVIRONMENT=production
```

### Load Environment Variables
```javascript
// config.js
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1';
const WS_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:3000/ws';
const VERSION = process.env.REACT_APP_VERSION || '1.0.0';

export { API_URL, WS_URL, VERSION };
```

### nginx.conf for Static Hosting
```nginx
server {
    listen 80;
    server_name queue.yourcompany.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name queue.yourcompany.com;

    # SSL Configuration
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Root directory
    root /usr/share/nginx/html;
    index index.html;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy
    location /api/ {
        proxy_pass https://api.yourcompany.com/v1/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket proxy
    location /ws {
        proxy_pass ws://api.yourcompany.com:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 86400;
    }
}
```

## Performance Optimization

### Build Optimization
```bash
# React build analysis
npm install --save-dev webpack-bundle-analyzer

# Create .env.local
ANALYZE=true npm run build
```

### Code Splitting
```javascript
import React, { lazy, Suspense } from 'react';

const StaffView = lazy(() => import('./components/StaffView'));
const CustomerView = lazy(() => import('./components/CustomerView'));

export default function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {/* Component loading */}
    </Suspense>
  );
}
```

### Image Optimization
- Use WebP format with PNG fallback
- Compress all images before deployment
- Use CDN for image delivery

### Caching Strategy
```javascript
// Service Worker registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js');
  });
}
```

### Content Security Policy
```nginx
add_header Content-Security-Policy "
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' data:;
  connect-src 'self' https://api.yourcompany.com wss://api.yourcompany.com;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
" always;
```

## Monitoring & Logging

### Google Analytics
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Error Tracking (Sentry)
```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://your-sentry-dsn@sentry.io/project-id",
  environment: process.env.REACT_APP_ENVIRONMENT,
  tracesSampleRate: 1.0,
});
```

### Health Check Endpoint
```javascript
// backend: /health
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});
```

## SSL/TLS Certificate

### Let's Encrypt (Free)
```bash
# Using Certbot
sudo apt-get install certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --nginx -d queue.yourcompany.com

# Auto-renewal
sudo certbot renew --dry-run
```

### Self-Signed Certificate (Development)
```bash
openssl req -x509 -newkey rsa:4096 -nodes -out cert.pem -keyout key.pem -days 365
```

## Backup & Recovery

### Automated Backups
```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/backups/queue-system"
DATE=$(date +%Y%m%d_%H%M%S)

# Backup database
mysqldump -u user -p database > $BACKUP_DIR/db_$DATE.sql

# Backup files
tar -czf $BACKUP_DIR/files_$DATE.tar.gz /var/www/html/queue-system

# Upload to S3
aws s3 cp $BACKUP_DIR/ s3://backups/queue-system/ --recursive

# Clean old backups (older than 30 days)
find $BACKUP_DIR -name "*.sql" -mtime +30 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
```

## Rollback Plan

### Version Management
```bash
# Tag releases
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# Rollback to previous version
git checkout v1.0.0
npm run build
netlify deploy --prod
```

## Monitoring Checklist

- [ ] Setup error tracking (Sentry/Rollbar)
- [ ] Configure uptime monitoring (Pingdom/UptimeRobot)
- [ ] Enable analytics (Google Analytics)
- [ ] Setup log aggregation (CloudWatch/ELK)
- [ ] Configure alerts for errors/downtime
- [ ] Monitor API response times
- [ ] Track user engagement
- [ ] Setup performance budgets
- [ ] Regular backup verification
- [ ] Security scanning (OWASP)

## Troubleshooting

### App not loading
```bash
# Check browser console for errors
# Verify API endpoint is correct
# Clear browser cache
# Check network tab in DevTools
```

### High memory usage
```bash
# Check for memory leaks
# Implement proper cleanup in useEffect
# Monitor bundle size
# Enable code splitting
```

### API connection issues
```bash
# Verify CORS headers
# Check API endpoint URL
# Verify authentication token
# Check network connectivity
```

## Production Deployment Checklist

- [ ] Environment variables configured
- [ ] API endpoints updated
- [ ] SSL certificates installed
- [ ] Cache headers configured
- [ ] Security headers added
- [ ] Monitoring tools enabled
- [ ] Backup system in place
- [ ] Error tracking configured
- [ ] Load testing completed
- [ ] Documentation updated
- [ ] Team trained on deployment
- [ ] Runbook prepared for incidents
- [ ] Performance optimized
- [ ] Accessibility tested
- [ ] Security audit passed

---

For deployment support, contact your infrastructure team or hosting provider.
