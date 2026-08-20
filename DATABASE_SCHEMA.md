# Database Schema Documentation

Complete database schema for Smart Queue Management System with implementations for MongoDB, MySQL, and PostgreSQL.

## Table of Contents
1. [Entity Relationship Diagram](#entity-relationship-diagram)
2. [MongoDB Schema](#mongodb-schema)
3. [MySQL Schema](#mysql-schema)
4. [PostgreSQL Schema](#postgresql-schema)

---

## Entity Relationship Diagram

```
┌─────────────────┐
│     Users       │
├─────────────────┤
│ id (PK)         │
│ email           │
│ password        │
│ name            │
│ role            │
│ createdAt       │
└─────────────────┘

┌──────────────────────────┐         ┌─────────────────────┐
│   Appointments           │         │   Customers         │
├──────────────────────────┤         ├─────────────────────┤
│ id (PK)                  │◄────────│ id (PK)             │
│ customerId (FK)          │         │ email               │
│ appointmentDate          │         │ phone               │
│ appointmentTime          │         │ name                │
│ serviceType              │         │ createdAt           │
│ status                   │         └─────────────────────┘
│ notes                    │
│ createdAt                │
│ completedAt              │
└──────────────────────────┘

┌─────────────────────────┐         ┌─────────────────────┐
│      Queue              │         │     Counters        │
├─────────────────────────┤         ├─────────────────────┤
│ id (PK)                 │         │ id (PK)             │
│ appointmentId (FK)      │◄────────│ name                │
│ position                │         │ status              │
│ status                  │         │ currentCustomerId   │
│ checkedInAt             │         │ createdAt           │
│ completedAt             │         └─────────────────────┘
│ duration                │
│ createdAt               │
└─────────────────────────┘

┌──────────────────────────┐
│   Services               │
├──────────────────────────┤
│ id (PK)                  │
│ name                     │
│ description              │
│ averageDuration          │
│ maxDaily                 │
│ isActive                 │
│ createdAt                │
└──────────────────────────┘

┌──────────────────────────┐
│   Statistics             │
├──────────────────────────┤
│ id (PK)                  │
│ date                     │
│ totalAppointments        │
│ completedAppointments    │
│ cancelledAppointments    │
│ averageWaitTime          │
│ averageServiceTime       │
│ peakHour                 │
│ createdAt                │
└──────────────────────────┘
```

---

## MongoDB Schema

### Collections Structure

```javascript
// Users Collection
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "password", "name", "role"],
      properties: {
        _id: { bsonType: "objectId" },
        email: { 
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
        },
        password: { bsonType: "string" },
        name: { bsonType: "string" },
        role: { 
          enum: ["customer", "staff", "admin"],
          description: "User role"
        },
        phone: { bsonType: "string" },
        isActive: { bsonType: "bool", default: true },
        lastLogin: { bsonType: "date" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});

db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ createdAt: -1 });
db.users.createIndex({ role: 1 });

// Customers Collection
db.createCollection("customers", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "phoneNumber", "name"],
      properties: {
        _id: { bsonType: "objectId" },
        email: { bsonType: "string" },
        phoneNumber: { bsonType: "string" },
        name: { bsonType: "string" },
        address: { bsonType: "string" },
        preferredService: { bsonType: "string" },
        totalAppointments: { bsonType: "int", default: 0 },
        totalCompleted: { bsonType: "int", default: 0 },
        totalCancelled: { bsonType: "int", default: 0 },
        notes: { bsonType: "string" },
        isActive: { bsonType: "bool", default: true },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});

db.customers.createIndex({ phoneNumber: 1 }, { unique: true });
db.customers.createIndex({ email: 1 });
db.customers.createIndex({ createdAt: -1 });

// Appointments Collection
db.createCollection("appointments", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["customerId", "appointmentDate", "appointmentTime", "status"],
      properties: {
        _id: { bsonType: "objectId" },
        customerId: { bsonType: "objectId" },
        appointmentDate: { bsonType: "date" },
        appointmentTime: { bsonType: "string" },
        serviceType: { bsonType: "string" },
        serviceId: { bsonType: "objectId" },
        notes: { bsonType: "string" },
        status: { 
          enum: ["scheduled", "confirmed", "in-progress", "completed", "cancelled", "no-show"],
          description: "Appointment status"
        },
        counterId: { bsonType: "objectId" },
        staffId: { bsonType: "objectId" },
        estimatedDuration: { bsonType: "int" },
        actualDuration: { bsonType: "int" },
        confirmationCode: { bsonType: "string" },
        qrCode: { bsonType: "string" },
        reminderSent: { bsonType: "bool", default: false },
        checkedInAt: { bsonType: ["date", "null"] },
        startedAt: { bsonType: ["date", "null"] },
        completedAt: { bsonType: ["date", "null"] },
        cancelledAt: { bsonType: ["date", "null"] },
        cancelReason: { bsonType: ["string", "null"] },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});

db.appointments.createIndex({ customerId: 1, appointmentDate: -1 });
db.appointments.createIndex({ appointmentDate: 1, status: 1 });
db.appointments.createIndex({ status: 1 });
db.appointments.createIndex({ createdAt: -1 });
db.appointments.createIndex({ confirmationCode: 1 }, { unique: true });

// Queue Collection
db.createCollection("queue", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["appointmentId", "position", "status"],
      properties: {
        _id: { bsonType: "objectId" },
        appointmentId: { bsonType: "objectId" },
        customerId: { bsonType: "objectId" },
        position: { bsonType: "int" },
        status: { 
          enum: ["waiting", "in-progress", "completed", "cancelled"],
          description: "Queue status"
        },
        waitTime: { bsonType: "int" },
        counterId: { bsonType: ["objectId", "null"] },
        calledAt: { bsonType: ["date", "null"] },
        completedAt: { bsonType: ["date", "null"] },
        duration: { bsonType: ["int", "null"] },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});

db.queue.createIndex({ position: 1 });
db.queue.createIndex({ status: 1 });
db.queue.createIndex({ appointmentId: 1 }, { unique: true });
db.queue.createIndex({ createdAt: -1 });

// Counters Collection
db.createCollection("counters", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "status"],
      properties: {
        _id: { bsonType: "objectId" },
        name: { bsonType: "string" },
        location: { bsonType: "string" },
        status: { 
          enum: ["available", "busy", "offline", "maintenance"],
          description: "Counter status"
        },
        currentCustomerId: { bsonType: ["objectId", "null"] },
        currentAppointmentId: { bsonType: ["objectId", "null"] },
        staffId: { bsonType: ["objectId", "null"] },
        totalServedToday: { bsonType: "int", default: 0 },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});

db.counters.createIndex({ status: 1 });

// Services Collection
db.createCollection("services");

db.services.insertMany([
  {
    _id: ObjectId(),
    name: "Consultation",
    description: "General consultation service",
    averageDuration: 20,
    maxDaily: 50,
    isActive: true,
    createdAt: new Date()
  },
  {
    _id: ObjectId(),
    name: "Dental",
    description: "Dental treatment service",
    averageDuration: 30,
    maxDaily: 30,
    isActive: true,
    createdAt: new Date()
  }
]);

// Statistics Collection
db.createCollection("statistics", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["date"],
      properties: {
        _id: { bsonType: "objectId" },
        date: { bsonType: "date" },
        totalAppointments: { bsonType: "int" },
        completedAppointments: { bsonType: "int" },
        cancelledAppointments: { bsonType: "int" },
        noShowAppointments: { bsonType: "int" },
        averageWaitTime: { bsonType: "double" },
        averageServiceTime: { bsonType: "double" },
        peakHour: { bsonType: "string" },
        busyPercentage: { bsonType: "int" },
        createdAt: { bsonType: "date" }
      }
    }
  }
});

db.statistics.createIndex({ date: -1 }, { unique: true });
```

---

## MySQL Schema

```sql
-- Create database
CREATE DATABASE IF NOT EXISTS queue_management
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE queue_management;

-- Users Table
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role ENUM('customer', 'staff', 'admin') NOT NULL DEFAULT 'customer',
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Customers Table
CREATE TABLE customers (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255),
  phone_number VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  preferred_service VARCHAR(100),
  total_appointments INT DEFAULT 0,
  total_completed INT DEFAULT 0,
  total_cancelled INT DEFAULT 0,
  notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_phone (phone_number),
  INDEX idx_email (email),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Services Table
CREATE TABLE services (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  average_duration INT NOT NULL DEFAULT 20,
  max_daily INT DEFAULT 50,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Appointments Table
CREATE TABLE appointments (
  id VARCHAR(36) PRIMARY KEY,
  customer_id VARCHAR(36) NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  service_type VARCHAR(100),
  service_id VARCHAR(36),
  notes TEXT,
  status ENUM('scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show') 
    NOT NULL DEFAULT 'scheduled',
  counter_id VARCHAR(36),
  staff_id VARCHAR(36),
  estimated_duration INT,
  actual_duration INT,
  confirmation_code VARCHAR(10) NOT NULL UNIQUE,
  qr_code LONGTEXT,
  reminder_sent BOOLEAN DEFAULT FALSE,
  checked_in_at TIMESTAMP NULL,
  started_at TIMESTAMP NULL,
  completed_at TIMESTAMP NULL,
  cancelled_at TIMESTAMP NULL,
  cancel_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (service_id) REFERENCES services(id),
  INDEX idx_customer_date (customer_id, appointment_date),
  INDEX idx_appointment_date_status (appointment_date, status),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Queue Table
CREATE TABLE queue (
  id VARCHAR(36) PRIMARY KEY,
  appointment_id VARCHAR(36) NOT NULL UNIQUE,
  customer_id VARCHAR(36),
  position INT NOT NULL,
  status ENUM('waiting', 'in-progress', 'completed', 'cancelled') NOT NULL,
  wait_time INT,
  counter_id VARCHAR(36),
  called_at TIMESTAMP NULL,
  completed_at TIMESTAMP NULL,
  duration INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (appointment_id) REFERENCES appointments(id),
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  INDEX idx_position (position),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Counters Table
CREATE TABLE counters (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  location VARCHAR(100),
  status ENUM('available', 'busy', 'offline', 'maintenance') NOT NULL DEFAULT 'available',
  current_customer_id VARCHAR(36),
  current_appointment_id VARCHAR(36),
  staff_id VARCHAR(36),
  total_served_today INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Statistics Table
CREATE TABLE statistics (
  id VARCHAR(36) PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  total_appointments INT DEFAULT 0,
  completed_appointments INT DEFAULT 0,
  cancelled_appointments INT DEFAULT 0,
  no_show_appointments INT DEFAULT 0,
  average_wait_time DECIMAL(5, 2),
  average_service_time DECIMAL(5, 2),
  peak_hour VARCHAR(5),
  busy_percentage INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_date (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample services
INSERT INTO services (id, name, description, average_duration) VALUES
  ('service_001', 'Consultation', 'General consultation service', 20),
  ('service_002', 'Dental', 'Dental treatment service', 30),
  ('service_003', 'Vaccination', 'Vaccination service', 15);
```

---

## PostgreSQL Schema

```sql
-- Create database
CREATE DATABASE queue_management
  ENCODING 'UTF8'
  LOCALE 'en_US.UTF-8'
  TEMPLATE template0;

-- Connect to database
\c queue_management;

-- Create ENUM types
CREATE TYPE user_role AS ENUM ('customer', 'staff', 'admin');
CREATE TYPE appointment_status AS ENUM ('scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show');
CREATE TYPE queue_status AS ENUM ('waiting', 'in-progress', 'completed', 'cancelled');
CREATE TYPE counter_status AS ENUM ('available', 'busy', 'offline', 'maintenance');

-- Users Table
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role user_role NOT NULL DEFAULT 'customer',
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Customers Table
CREATE TABLE customers (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255),
  phone_number VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  preferred_service VARCHAR(100),
  total_appointments INT DEFAULT 0,
  total_completed INT DEFAULT 0,
  total_cancelled INT DEFAULT 0,
  notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_customers_phone ON customers(phone_number);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_created_at ON customers(created_at);

-- Services Table
CREATE TABLE services (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  average_duration INT NOT NULL DEFAULT 20,
  max_daily INT DEFAULT 50,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_services_is_active ON services(is_active);

-- Appointments Table
CREATE TABLE appointments (
  id VARCHAR(36) PRIMARY KEY,
  customer_id VARCHAR(36) NOT NULL REFERENCES customers(id),
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  service_type VARCHAR(100),
  service_id VARCHAR(36) REFERENCES services(id),
  notes TEXT,
  status appointment_status NOT NULL DEFAULT 'scheduled',
  counter_id VARCHAR(36),
  staff_id VARCHAR(36),
  estimated_duration INT,
  actual_duration INT,
  confirmation_code VARCHAR(10) NOT NULL UNIQUE,
  qr_code TEXT,
  reminder_sent BOOLEAN DEFAULT FALSE,
  checked_in_at TIMESTAMP NULL,
  started_at TIMESTAMP NULL,
  completed_at TIMESTAMP NULL,
  cancelled_at TIMESTAMP NULL,
  cancel_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_appointments_customer_date ON appointments(customer_id, appointment_date);
CREATE INDEX idx_appointments_date_status ON appointments(appointment_date, status);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_created_at ON appointments(created_at);

-- Queue Table
CREATE TABLE queue (
  id VARCHAR(36) PRIMARY KEY,
  appointment_id VARCHAR(36) NOT NULL UNIQUE REFERENCES appointments(id),
  customer_id VARCHAR(36) REFERENCES customers(id),
  position INT NOT NULL,
  status queue_status NOT NULL,
  wait_time INT,
  counter_id VARCHAR(36),
  called_at TIMESTAMP NULL,
  completed_at TIMESTAMP NULL,
  duration INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_queue_position ON queue(position);
CREATE INDEX idx_queue_status ON queue(status);
CREATE INDEX idx_queue_created_at ON queue(created_at);

-- Counters Table
CREATE TABLE counters (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  location VARCHAR(100),
  status counter_status NOT NULL DEFAULT 'available',
  current_customer_id VARCHAR(36),
  current_appointment_id VARCHAR(36),
  staff_id VARCHAR(36),
  total_served_today INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_counters_status ON counters(status);

-- Statistics Table
CREATE TABLE statistics (
  id VARCHAR(36) PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  total_appointments INT DEFAULT 0,
  completed_appointments INT DEFAULT 0,
  cancelled_appointments INT DEFAULT 0,
  no_show_appointments INT DEFAULT 0,
  average_wait_time DECIMAL(5, 2),
  average_service_time DECIMAL(5, 2),
  peak_hour VARCHAR(5),
  busy_percentage INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_statistics_date ON statistics(date);

-- Insert sample services
INSERT INTO services (id, name, description, average_duration) VALUES
  ('service_001', 'Consultation', 'General consultation service', 20),
  ('service_002', 'Dental', 'Dental treatment service', 30),
  ('service_003', 'Vaccination', 'Vaccination service', 15);
```

---

## Indexing Strategy

### High-Priority Indexes
```sql
-- For appointment lookup
INDEX(appointment_date, status)
INDEX(customer_id, appointment_date DESC)

-- For queue operations
INDEX(position)
INDEX(status)

-- For statistics
INDEX(date DESC)
INDEX(created_at DESC)
```

### Query Optimization Tips
1. Always filter by date range for appointments
2. Use composite indexes for frequent multi-column filters
3. Archive statistics older than 1 year
4. Maintain monthly backups

## Backup Strategy

### Daily Backup
```bash
# MongoDB
mongodump --uri="mongodb://localhost:27017/queue-management" --out=/backups/daily

# MySQL
mysqldump -u root -p queue_management > /backups/queue-management.sql

# PostgreSQL
pg_dump queue_management > /backups/queue-management.sql
```

### Retention Policy
- Daily: Keep 7 days
- Weekly: Keep 4 weeks
- Monthly: Keep 12 months

---

**Choose your database based on:**
- **MongoDB**: Flexible schema, great for rapid development
- **MySQL**: Traditional relational, wide support
- **PostgreSQL**: Advanced features, JSON support, better for complex queries
