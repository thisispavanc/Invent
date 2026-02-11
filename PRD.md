# Tanuh Inventory Management System - Product Requirements Document (PRD)

**Version:** 1.0  
**Date:** February 11, 2026  
**Document Owner:** Tanuh IT Department

---

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [Product Overview](#product-overview)
3. [User Roles & Permissions](#user-roles--permissions)
4. [Functional Requirements](#functional-requirements)
5. [Technical Architecture](#technical-architecture)
6. [Technology Stack](#technology-stack)
7. [Database Schema](#database-schema)
8. [Security Requirements](#security-requirements)
9. [Deployment Strategy](#deployment-strategy)
10. [Future Enhancements](#future-enhancements)

---

## 1. Executive Summary

**Product Name:** Tanuh Inventory  
**Purpose:** Internal inventory management system to track IT assets, employee assignments, device transfers, and compliance documentation.

**Key Objectives:**
- Centralized tracking of all IT assets (hardware, software licenses, accessories)
- Complete employee information management with photo and personal details
- Comprehensive audit trail for all system changes and device transfers
- Secure document management for consent forms
- Real-time dashboard with analytics and reporting capabilities

---

## 2. Product Overview

### 2.1 Problem Statement
Organizations need a centralized system to:
- Track IT asset inventory and assignments
- Monitor warranty expiration dates
- Maintain employee records securely
- Track device transfers and changes
- Store compliance documentation (consent forms)
- Audit all system changes for accountability

### 2.2 Target Users
- **Administrators (IT Staff):** Full system access, manage all assets, employees, and transfers
- **Employees:** View-only access to their assigned devices and personal information

### 2.3 Core Features
1. Inventory Management (devices/systems)
2. Employee Management with photo storage
3. Device Assignment & Transfer Management
4. Consent Form Management (joining + assignment forms)
5. Audit Logging & Session Tracking
6. Dashboard with Charts & Statistics
7. Export Reports (PDF/Excel)

---

## 3. User Roles & Permissions

### 3.1 Administrator Role
**Permissions:**
- ✅ View all inventory items
- ✅ Create, update, delete inventory items
- ✅ View all employee records
- ✅ Create, update, delete employee records
- ✅ Assign/unassign devices to employees
- ✅ Initiate device transfers
- ✅ Upload consent forms (joining & assignment)
- ✅ View complete audit logs
- ✅ Access dashboard and analytics
- ✅ Export reports (PDF/Excel)
- ✅ Manage user accounts

### 3.2 Employee Role
**Permissions:**
- ✅ View own profile information
- ✅ View devices assigned to them
- ✅ View own assignment history
- ✅ View own consent forms
- ❌ Cannot modify any data
- ❌ Cannot access other employees' data
- ❌ Cannot access admin features

---

## 4. Functional Requirements

### 4.1 Authentication & Authorization

#### FR-AUTH-001: User Login
- Users must authenticate with username and password
- Session-based authentication with secure cookies
- Session timeout after 30 minutes of inactivity
- Remember me option (optional, 7-day expiry)

#### FR-AUTH-002: Password Security
- Minimum password length: 8 characters
- Password hashing using bcrypt (cost factor 12)
- Password reset functionality via admin

#### FR-AUTH-003: Role-Based Access Control
- System enforces role-based permissions
- Automatic role assignment on user creation
- Employees can only access their own data

---

### 4.2 Inventory Management

#### FR-INV-001: Device Categories
System must support the following device types:
- Laptops
- Desktops
- Monitors
- Mobile Phones
- Tablets
- Accessories (keyboard, mouse, headphones, etc.)
- Software Licenses
- Other IT Equipment

#### FR-INV-002: Device Information Fields
Each inventory item must capture:
- **Basic Information:**
  - Device Name/Model
  - Device Category (from predefined list)
  - Serial Number
  - Asset Tag/ID (unique identifier)
  - Brand/Manufacturer
  - Specifications (text field)
  
- **Financial Information:**
  - Purchase Cost
  - Purchase Date
  - Warranty Expiry Date
  - Vendor/Supplier
  
- **Status Information:**
  - Current Status (Available, Assigned, In Repair, Retired)
  - Condition (New, Good, Fair, Poor)
  - Location (Office, Warehouse, Remote)
  
- **Assignment Information:**
  - Currently Assigned To (Employee ID)
  - Assignment Date
  - Assignment Notes

#### FR-INV-003: Inventory CRUD Operations
- **Create:** Add new inventory items with all required fields
- **Read:** View inventory list with filtering and search
- **Update:** Modify inventory details (admin only)
- **Delete:** Soft delete inventory items (mark as retired/deleted)

#### FR-INV-004: Inventory Search & Filtering
- Search by: Device name, serial number, asset tag, employee name
- Filter by: Category, status, assigned/unassigned, warranty status
- Sort by: Purchase date, cost, warranty expiry, assignment date

#### FR-INV-005: Warranty Tracking
- Display warranty status (Active, Expiring Soon, Expired)
- Visual indicators for items with expired warranties
- Note: Email alerts will be added in future phase

---

### 4.3 Employee Management

#### FR-EMP-001: Employee Information Fields
Each employee record must capture:
- **Personal Information:**
  - Full Name
  - Employee ID (unique)
  - Email Address
  - Phone Number
  - Date of Birth
  - Address (Street, City, State, ZIP, Country)
  
- **Professional Information:**
  - Department
  - Designation/Role
  - Date of Joining
  - Employment Status (Active, Inactive, Terminated)
  - Manager Name (optional)
  
- **Media:**
  - Profile Photo (stored in AWS S3/cloud storage)
  - Photo upload date

#### FR-EMP-002: Employee CRUD Operations
- **Create:** Add new employee with mandatory fields
- **Read:** View employee list and individual profiles
- **Update:** Modify employee details (admin only)
- **Delete:** Soft delete (mark as inactive, retain records)

#### FR-EMP-003: Employee Search & Filtering
- Search by: Name, employee ID, email, phone number
- Filter by: Department, employment status, devices assigned
- Sort by: Name, joining date, department

#### FR-EMP-004: Photo Management
- Upload employee photos (JPG, PNG formats)
- Maximum file size: 5MB
- Automatic image optimization/compression
- Store in cloud storage with CDN access
- Display thumbnail and full-size views

---

### 4.4 Device Assignment & Transfer Management

#### FR-ASSIGN-001: Device Assignment Process
Admin can assign devices to employees with:
- Selection of employee
- Selection of device(s) (multi-select supported)
- Assignment date (default: current date)
- Assignment notes/reason
- Assignment consent form upload (mandatory)

#### FR-ASSIGN-002: Device Transfer Process
Admin initiates transfers:
1. Select device currently assigned
2. View current assignee details
3. Select new assignee
4. Enter transfer reason/notes
5. Set transfer date
6. Upload new assignment consent form
7. System creates audit log entry
8. Previous assignment marked as completed
9. New assignment created

#### FR-ASSIGN-003: Device Unassignment
- Admin can unassign devices from employees
- Reason for unassignment required
- Updates device status to "Available"
- Creates audit log entry

#### FR-ASSIGN-004: Assignment History
- View complete assignment history for each device
- View complete assignment history for each employee
- Display: Assignment date, unassignment date, employee name, reason

---

### 4.5 Consent Form Management

#### FR-CONSENT-001: Consent Form Types
System supports two types of consent forms:
1. **Joining Consent Form:** Uploaded when employee joins (one per employee)
2. **Assignment Consent Forms:** Uploaded each time a device is assigned

#### FR-CONSENT-002: Consent Form Upload
- File formats: PDF, JPG, PNG, DOCX
- Maximum file size: 10MB
- Store in cloud storage (AWS S3 or similar)
- Generate unique filename to prevent conflicts
- Store metadata in database (filename, upload date, uploader, type)

#### FR-CONSENT-003: Consent Form Viewing
- Admins can view all consent forms
- Employees can view only their own consent forms
- Direct download link from cloud storage
- Display thumbnail preview for images

#### FR-CONSENT-004: Consent Form Validation
- Joining consent form required before first device assignment
- Assignment consent form mandatory for each new assignment
- System prevents assignment without consent form upload

---

### 4.6 Audit Logging & Session Tracking

#### FR-AUDIT-001: Activity Logging
System must log all significant actions:
- User login/logout
- Device creation, modification, deletion
- Employee creation, modification, deletion
- Device assignments, transfers, unassignments
- Consent form uploads
- Report exports
- Password changes

#### FR-AUDIT-002: Audit Log Data Structure
Each log entry must capture:
- Session ID (unique identifier)
- User ID and username
- Action type (enum: LOGIN, LOGOUT, CREATE, UPDATE, DELETE, ASSIGN, TRANSFER, etc.)
- Target entity type (DEVICE, EMPLOYEE, ASSIGNMENT, CONSENT_FORM)
- Target entity ID
- Timestamp (date and time)
- IP Address
- User Agent (browser/device info)
- Old values (JSON - before change)
- New values (JSON - after change)
- Additional notes/description

#### FR-AUDIT-003: Audit Log Viewing
- Admins can view complete audit logs
- Filter by: User, action type, entity type, date range
- Search by: Entity ID, description
- Export audit logs to Excel/PDF
- Display in chronological order (newest first)

#### FR-AUDIT-004: Session Tracking
- Generate unique session ID on login
- Track session duration
- Log all actions within a session
- Link all audit entries to session ID
- Display active sessions in admin dashboard

---

### 4.7 Dashboard & Analytics

#### FR-DASH-001: Admin Dashboard Components
**Overview Cards:**
- Total Devices (count)
- Total Employees (count)
- Assigned Devices (count & percentage)
- Available Devices (count)
- Devices with Expired Warranty (count)
- Devices Expiring in 30 Days (count)

**Charts & Visualizations:**
1. **Device Distribution by Category** (Pie Chart)
   - Shows breakdown by device type
   
2. **Device Status Distribution** (Donut Chart)
   - Available, Assigned, In Repair, Retired
   
3. **Devices by Cost Range** (Bar Chart)
   - Group by cost brackets (0-500, 500-1000, 1000-2000, 2000+)
   
4. **Assignment Trend** (Line Chart)
   - Assignments over time (last 12 months)
   
5. **Warranty Expiry Timeline** (Horizontal Bar Chart)
   - Devices expiring in next 3, 6, 12 months
   
6. **Top Employees by Device Count** (Bar Chart)
   - Employees with most assigned devices

**Recent Activity Feed:**
- Last 10 activities from audit log
- Display: Action, user, entity, timestamp

#### FR-DASH-002: Employee Dashboard
- Profile information card
- List of assigned devices with details
- Assignment history
- Quick links to consent forms

---

### 4.8 Reporting & Export

#### FR-REPORT-001: Inventory Report
Export inventory data with columns:
- Asset Tag, Device Name, Category, Serial Number
- Brand, Purchase Date, Cost, Warranty Expiry
- Status, Condition, Location
- Assigned To, Assignment Date

**Formats:** PDF, Excel (XLSX)  
**Filters:** Category, status, date range

#### FR-REPORT-002: Employee Report
Export employee data with columns:
- Employee ID, Name, Email, Phone
- Department, Designation, Joining Date
- Number of Assigned Devices
- Status

**Formats:** PDF, Excel (XLSX)  
**Filters:** Department, status

#### FR-REPORT-003: Assignment Report
Export assignment history with columns:
- Device Name, Asset Tag, Serial Number
- Employee Name, Employee ID
- Assignment Date, Unassignment Date
- Assignment Duration (days)
- Status

**Formats:** PDF, Excel (XLSX)  
**Filters:** Date range, employee, device category

#### FR-REPORT-004: Audit Log Report
Export audit logs with columns:
- Timestamp, Session ID
- User, Action Type
- Entity Type, Entity ID
- Description, Changes

**Formats:** PDF, Excel (XLSX)  
**Filters:** Date range, user, action type

---

## 5. Technical Architecture

### 5.1 Architecture Pattern
**Three-Tier Architecture:**

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│    (React Frontend - Port 5173)         │
│   - User Interface                      │
│   - Client-side validation              │
│   - State management (Redux/Context)    │
└─────────────────┬───────────────────────┘
                  │ REST API / HTTP
┌─────────────────▼───────────────────────┐
│         Application Layer               │
│    (Node.js/Express - Port 3000)        │
│   - Business logic                      │
│   - Authentication & Authorization      │
│   - API endpoints                       │
│   - Session management                  │
│   - File upload handling                │
└─────────────────┬───────────────────────┘
                  │ SQL Queries
┌─────────────────▼───────────────────────┐
│         Data Layer                      │
│    (MySQL Database - Port 3306)         │
│   - Data persistence                    │
│   - Transactions                        │
│   - Relationships                       │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│         External Services               │
│   - AWS S3 (File Storage)               │
│   - CDN (Image Delivery)                │
└─────────────────────────────────────────┘
```

### 5.2 Application Flow

#### User Authentication Flow:
```
1. User enters credentials → Frontend validation
2. POST /api/auth/login → Backend
3. Backend verifies credentials (bcrypt)
4. Generate session ID → Store in database
5. Set secure HTTP-only cookie
6. Return user data + role
7. Frontend redirects to dashboard
```

#### Device Assignment Flow:
```
1. Admin selects device + employee
2. Upload consent form → AWS S3
3. POST /api/assignments/create
4. Backend validates + creates assignment record
5. Update device status to "Assigned"
6. Create audit log entry
7. Return success response
8. Frontend updates UI
```

---

## 6. Technology Stack

### 6.1 Frontend Stack

#### Core Framework
- **React:** 18.3.1 (Latest stable)
  - Component-based architecture
  - Hooks for state management
  - Fast virtual DOM rendering

#### Build Tool
- **Vite:** 6.0.0
  - Ultra-fast HMR (Hot Module Replacement)
  - Optimized production builds
  - Native ES modules support

#### UI Framework & Styling
- **Tailwind CSS:** 3.4.16
  - Utility-first CSS framework
  - Responsive design out of the box
  - Custom theme configuration
  
- **shadcn/ui:** Latest (Component library)
  - Pre-built accessible components
  - Built on Radix UI primitives
  - Fully customizable

#### State Management
- **Redux Toolkit:** 2.5.0
  - Centralized state management
  - Redux DevTools integration
  - RTK Query for API calls

**Alternative (Simpler):** React Context API + useReducer
  - No external dependencies
  - Sufficient for small-medium apps

#### Routing
- **React Router:** 6.28.0
  - Client-side routing
  - Protected routes
  - Nested routing support

#### Form Management
- **React Hook Form:** 7.54.0
  - Performance-focused form library
  - Built-in validation
  - Minimal re-renders

#### Data Visualization
- **Recharts:** 2.15.0
  - Declarative charting library
  - Built on D3.js
  - Responsive charts

- **Chart.js:** 4.4.7 (Alternative)
  - Simple, flexible charting
  - Many chart types

#### HTTP Client
- **Axios:** 1.7.9
  - Promise-based HTTP client
  - Interceptors for auth tokens
  - Request/response transformation

#### File Upload
- **React Dropzone:** 14.3.5
  - Drag-and-drop file upload
  - File validation
  - Image preview

#### Date Handling
- **date-fns:** 4.1.0
  - Modern date utility library
  - Lightweight (modular)
  - Immutable

#### Notifications
- **React Hot Toast:** 2.4.1
  - Beautiful toast notifications
  - Customizable
  - Promise-based toasts

#### PDF Generation
- **jsPDF:** 2.5.2
  - Client-side PDF generation
  - Custom layouts

- **jsPDF-AutoTable:** 3.8.4
  - Table support for jsPDF

#### Excel Export
- **xlsx:** 0.18.5 (SheetJS)
  - Excel file generation
  - Multiple sheet support

### 6.2 Backend Stack

#### Runtime Environment
- **Node.js:** 20.18.0 LTS
  - JavaScript runtime
  - Non-blocking I/O
  - NPM ecosystem

#### Web Framework
- **Express.js:** 4.21.2
  - Minimalist web framework
  - Middleware support
  - RESTful API development

#### Database ORM
- **Sequelize:** 6.37.5
  - Promise-based ORM
  - Support for MySQL
  - Migrations & seeds
  - Model associations

**Alternative:** Prisma 6.0.0
  - Type-safe database client
  - Auto-generated types
  - Better developer experience

#### Database Driver
- **mysql2:** 3.11.5
  - MySQL client for Node.js
  - Promise support
  - Connection pooling

#### Authentication
- **bcryptjs:** 2.4.3
  - Password hashing
  - Secure salt generation
  - Cost factor: 12

- **express-session:** 1.18.1
  - Session middleware
  - Store sessions in MySQL
  - Secure cookie configuration

- **connect-session-sequelize:** 7.1.7
  - Sequelize session store
  - Automatic cleanup

#### Validation
- **Joi:** 17.13.3
  - Schema validation
  - Data sanitization
  - Custom error messages

**Alternative:** Zod 3.23.8
  - TypeScript-first validation
  - Better type inference

#### File Upload & Processing
- **Multer:** 1.4.5-lts.1
  - Multipart form data handling
  - File upload middleware
  - Memory storage for S3 upload

- **Sharp:** 0.33.5
  - Image processing
  - Resize, optimize images
  - Fast performance

#### Cloud Storage
- **AWS SDK v3:** Latest
  - **@aws-sdk/client-s3:** 3.713.0
  - **@aws-sdk/lib-storage:** 3.713.0
  - AWS S3 file storage
  - Multipart uploads
  - Pre-signed URLs

#### Environment Variables
- **dotenv:** 16.4.7
  - Load environment variables
  - Configuration management

#### Security
- **helmet:** 8.0.0
  - Security headers
  - XSS protection
  - CSRF protection

- **cors:** 2.8.5
  - Cross-Origin Resource Sharing
  - Configurable origins

- **express-rate-limit:** 7.4.1
  - Rate limiting
  - Prevent abuse

#### Logging
- **winston:** 3.17.0
  - Logging library
  - Multiple transports
  - Log levels

- **morgan:** 1.10.0
  - HTTP request logger
  - Custom formats

#### PDF Generation (Server-side)
- **puppeteer:** 24.1.0
  - Headless Chrome
  - HTML to PDF conversion
  - Server-side rendering

**Alternative:** PDFKit 0.15.0
  - Lightweight PDF generation
  - No browser needed

#### Excel Generation (Server-side)
- **exceljs:** 4.4.0
  - Create Excel files
  - Styling support
  - Formula support

#### Utilities
- **uuid:** 11.0.3
  - Generate unique identifiers
  - Session IDs, file names

- **moment:** 2.30.1 or **dayjs:** 1.11.13
  - Date manipulation
  - Formatting

### 6.3 Database

#### RDBMS
- **MySQL:** 8.0.40 (Latest LTS)
  - Community Edition
  - InnoDB storage engine
  - ACID compliance
  - Full-text search
  - JSON data type support

#### Database Management Tools
- **MySQL Workbench:** 8.0.40
  - Visual database design
  - Query development
  - Database administration

**Alternative:** DBeaver (Free, open-source)
  - Universal database tool
  - ER diagrams

### 6.4 Development Tools

#### Version Control
- **Git:** 2.47+
  - Source code management
  - Branching & merging

#### Code Editor
- **VS Code:** Latest
  - Extensions: ESLint, Prettier, MySQL, ES7+ snippets

#### API Testing
- **Postman:** Latest
  - API endpoint testing
  - Environment variables
  - Collection sharing

**Alternative:** Thunder Client (VS Code extension)
  - Lightweight REST client

#### Code Quality
- **ESLint:** 9.17.0
  - JavaScript linting
  - Code style enforcement

- **Prettier:** 3.4.2
  - Code formatting
  - Consistent style

#### Package Manager
- **npm:** 10+ (comes with Node.js)
  - Package management
  - Script runner

**Alternative:** pnpm 9.15.0
  - Faster, more efficient
  - Disk space savings

### 6.5 Deployment Stack (Local + Future Hosting)

#### Local Development
- **Localhost:** React (port 5173), Express (port 3000), MySQL (port 3306)
- **nodemon:** 3.1.9 - Auto-restart on changes

#### Future Production Hosting
- **Web Server:** Nginx 1.26+ (Reverse proxy, static file serving)
- **Process Manager:** PM2 5.4.0 (Node.js process management, auto-restart)
- **SSL Certificate:** Let's Encrypt (Free SSL/TLS)
- **Cloud Storage:** AWS S3 (File storage, CDN integration)

#### Containerization (Optional, Future)
- **Docker:** 27+ (Containerization)
- **Docker Compose:** 2.30+ (Multi-container orchestration)

---

## 7. Database Schema

### 7.1 Tables Overview

```
1. users - System users (admins & employees)
2. employees - Employee detailed information
3. devices - Inventory items
4. assignments - Device assignments to employees
5. consent_forms - Uploaded consent documents
6. audit_logs - Activity tracking
7. sessions - User session management
```

### 7.2 Detailed Schema

#### Table: users
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'employee') DEFAULT 'employee',
    employee_id INT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_login DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE SET NULL,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### Table: employees
```sql
CREATE TABLE employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    date_of_birth DATE,
    address_street VARCHAR(255),
    address_city VARCHAR(100),
    address_state VARCHAR(100),
    address_zip VARCHAR(20),
    address_country VARCHAR(100) DEFAULT 'India',
    department VARCHAR(100),
    designation VARCHAR(100),
    date_of_joining DATE NOT NULL,
    employment_status ENUM('active', 'inactive', 'terminated') DEFAULT 'active',
    manager_name VARCHAR(100),
    photo_url TEXT NULL,
    photo_uploaded_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_employee_id (employee_id),
    INDEX idx_email (email),
    INDEX idx_name (full_name),
    INDEX idx_department (department),
    INDEX idx_status (employment_status),
    FULLTEXT idx_fulltext_name (full_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### Table: devices
```sql
CREATE TABLE devices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    asset_tag VARCHAR(50) UNIQUE NOT NULL,
    device_name VARCHAR(200) NOT NULL,
    device_category ENUM(
        'laptop', 'desktop', 'monitor', 'mobile_phone', 
        'tablet', 'accessory', 'software_license', 'other'
    ) NOT NULL,
    serial_number VARCHAR(100) UNIQUE,
    brand VARCHAR(100),
    specifications TEXT,
    purchase_cost DECIMAL(10, 2),
    purchase_date DATE,
    warranty_expiry_date DATE,
    vendor VARCHAR(100),
    device_status ENUM('available', 'assigned', 'in_repair', 'retired') DEFAULT 'available',
    device_condition ENUM('new', 'good', 'fair', 'poor') DEFAULT 'good',
    location VARCHAR(100) DEFAULT 'Office',
    currently_assigned_to INT NULL,
    assignment_date DATE NULL,
    assignment_notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (currently_assigned_to) REFERENCES employees(id) ON DELETE SET NULL,
    INDEX idx_asset_tag (asset_tag),
    INDEX idx_serial (serial_number),
    INDEX idx_category (device_category),
    INDEX idx_status (device_status),
    INDEX idx_assigned_to (currently_assigned_to),
    INDEX idx_warranty (warranty_expiry_date),
    FULLTEXT idx_fulltext_device (device_name, brand)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### Table: assignments
```sql
CREATE TABLE assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    device_id INT NOT NULL,
    employee_id INT NOT NULL,
    assignment_date DATE NOT NULL,
    unassignment_date DATE NULL,
    assignment_reason TEXT,
    unassignment_reason TEXT,
    assignment_status ENUM('active', 'completed', 'transferred') DEFAULT 'active',
    assigned_by INT NOT NULL,
    unassigned_by INT NULL,
    consent_form_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (unassigned_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (consent_form_id) REFERENCES consent_forms(id) ON DELETE SET NULL,
    INDEX idx_device (device_id),
    INDEX idx_employee (employee_id),
    INDEX idx_status (assignment_status),
    INDEX idx_dates (assignment_date, unassignment_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### Table: consent_forms
```sql
CREATE TABLE consent_forms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    form_type ENUM('joining', 'assignment') NOT NULL,
    file_url TEXT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size INT NOT NULL,
    file_type VARCHAR(50),
    uploaded_by INT NOT NULL,
    upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    assignment_id INT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE SET NULL,
    INDEX idx_employee (employee_id),
    INDEX idx_form_type (form_type),
    INDEX idx_assignment (assignment_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### Table: audit_logs
```sql
CREATE TABLE audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(100) NOT NULL,
    user_id INT NOT NULL,
    username VARCHAR(50) NOT NULL,
    action_type ENUM(
        'LOGIN', 'LOGOUT', 'CREATE', 'UPDATE', 'DELETE', 
        'ASSIGN', 'UNASSIGN', 'TRANSFER', 'UPLOAD', 
        'EXPORT', 'PASSWORD_CHANGE'
    ) NOT NULL,
    entity_type ENUM(
        'USER', 'EMPLOYEE', 'DEVICE', 'ASSIGNMENT', 
        'CONSENT_FORM', 'REPORT'
    ),
    entity_id INT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    old_values JSON,
    new_values JSON,
    description TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_session (session_id),
    INDEX idx_user (user_id),
    INDEX idx_action (action_type),
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_timestamp (timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### Table: sessions
```sql
CREATE TABLE sessions (
    sid VARCHAR(255) PRIMARY KEY,
    sess JSON NOT NULL,
    expire DATETIME NOT NULL,
    
    INDEX idx_expire (expire)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 7.3 Relationships

```
users (1) ──── (0..1) employees
    │
    │ (created_by)
    └───────────┐
                │
employees (1) ──┴── (*) devices [currently_assigned_to]
    │
    │ (*) assignments
    │
    └── (*) consent_forms

devices (1) ──── (*) assignments
assignments (1) ──── (0..1) consent_forms

users (1) ──── (*) audit_logs
```

### 7.4 Indexes Strategy

**Primary Keys:** All tables use AUTO_INCREMENT INT primary keys  
**Unique Constraints:** username, email, asset_tag, serial_number, employee_id  
**Foreign Keys:** Enforce referential integrity with CASCADE/SET NULL  
**Regular Indexes:** On frequently queried columns (status, dates, IDs)  
**Fulltext Indexes:** On name fields for better search performance  
**Composite Indexes:** On date ranges for assignment queries

---

## 8. Security Requirements

### 8.1 Authentication Security

#### SEC-AUTH-001: Password Policy
- Minimum 8 characters
- Must contain: 1 uppercase, 1 lowercase, 1 number
- Passwords hashed using bcrypt (cost: 12)
- No password storage in plain text
- Password change requires old password verification

#### SEC-AUTH-002: Session Management
- Secure HTTP-only cookies
- Session timeout: 30 minutes inactivity
- Session ID regeneration after login
- Secure session storage in MySQL
- Auto-logout on browser close (no remember me)

#### SEC-AUTH-003: Brute Force Protection
- Rate limiting on login endpoint: 5 attempts per 15 minutes
- Account lockout after 10 failed attempts (admin unlock required)
- CAPTCHA after 3 failed attempts (future enhancement)

### 8.2 Authorization Security

#### SEC-AUTHZ-001: Role-Based Access Control
- Middleware checks user role on every protected route
- Employees can only access their own data
- Admins have full access
- No privilege escalation allowed

#### SEC-AUTHZ-002: Data Access Control
- Employee data queries filtered by user ID
- Assignment history filtered by employee
- Consent forms filtered by owner
- Audit logs accessible only to admins

### 8.3 Data Security

#### SEC-DATA-001: Input Validation
- Server-side validation for all inputs
- Joi/Zod schema validation
- SQL injection prevention (Sequelize parameterized queries)
- XSS prevention (input sanitization)
- File upload validation (type, size, extension)

#### SEC-DATA-002: File Upload Security
- Allowed file types: PDF, JPG, PNG, DOCX
- Maximum file size: 10MB (consent forms), 5MB (photos)
- Unique file naming (UUID + timestamp)
- Virus scanning (optional, future enhancement)
- Store in secure cloud storage (AWS S3) with private ACL

#### SEC-DATA-003: Database Security
- Prepared statements (ORM)
- Least privilege database user
- No root user in application
- Database credentials in environment variables
- Regular backups (daily)
- Connection pooling with max limits

### 8.4 Application Security

#### SEC-APP-001: HTTP Security Headers
Using Helmet.js:
- Content-Security-Policy
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Strict-Transport-Security (HSTS)
- X-XSS-Protection

#### SEC-APP-002: CORS Configuration
- Whitelist allowed origins
- Credentials enabled for authenticated requests
- Restrict HTTP methods

#### SEC-APP-003: Rate Limiting
- Global rate limit: 100 requests per 15 minutes per IP
- Login rate limit: 5 requests per 15 minutes per IP
- File upload rate limit: 10 uploads per hour per user

### 8.5 Audit & Monitoring

#### SEC-AUDIT-001: Comprehensive Logging
- Log all authentication attempts
- Log all data modifications
- Log all file uploads
- Store IP address and user agent
- Retain logs for 1 year

#### SEC-AUDIT-002: Error Handling
- No sensitive data in error messages
- Generic error messages to users
- Detailed errors logged server-side
- Stack traces only in development mode

---

## 9. Deployment Strategy

### 9.1 Local Development Setup

#### Prerequisites:
1. **Node.js 20.18.0 LTS** - JavaScript runtime
2. **MySQL 8.0.40** - Database server
3. **Git** - Version control
4. **VS Code** - Code editor (recommended)
5. **AWS Account** - For S3 storage (free tier available)

#### Setup Steps:

**Step 1: Database Setup**
```bash
# Install MySQL 8.0.40
# Create database
mysql -u root -p
CREATE DATABASE tanuh_inventory CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Create database user
CREATE USER 'tanuh_user'@'localhost' IDENTIFIED BY 'secure_password_here';
GRANT ALL PRIVILEGES ON tanuh_inventory.* TO 'tanuh_user'@'localhost';
FLUSH PRIVILEGES;
```

**Step 2: AWS S3 Setup**
1. Create AWS account (free tier)
2. Create S3 bucket: `tanuh-inventory-files`
3. Create IAM user with S3 access
4. Generate Access Key ID and Secret Access Key
5. Configure bucket CORS policy
6. Set bucket policy for private access

**Step 3: Backend Setup**
```bash
# Clone repository
git clone <repository-url>
cd tanuh-inventory/backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

**Environment Variables (.env):**
```env
# Server
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5173

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=tanuh_inventory
DB_USER=tanuh_user
DB_PASSWORD=secure_password_here

# Session
SESSION_SECRET=your-super-secret-session-key-min-32-chars

# AWS S3
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_S3_BUCKET=tanuh-inventory-files

# Application
BCRYPT_ROUNDS=12
SESSION_TIMEOUT=1800000
MAX_FILE_SIZE=10485760
```

```bash
# Run database migrations
npm run migrate

# Seed initial admin user
npm run seed

# Start development server
npm run dev
```

**Step 4: Frontend Setup**
```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env
nano .env
```

**Frontend Environment Variables (.env):**
```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Tanuh Inventory
```

```bash
# Start development server
npm run dev
```

**Step 5: Access Application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api
- Default Admin Credentials:
  - Username: admin
  - Password: Admin@123 (change immediately)

### 9.2 Production Deployment (Future)

#### Server Requirements:
- **OS:** Ubuntu 22.04 LTS or higher
- **RAM:** Minimum 4GB (8GB recommended)
- **CPU:** 2 cores minimum
- **Storage:** 50GB SSD
- **Network:** Static IP address

#### Deployment Stack:
```
Internet
    │
    ▼
Nginx (Port 80/443) - Reverse Proxy + SSL
    │
    ├─► Frontend (Static Files)
    │
    └─► Backend (Port 3000) - PM2
            │
            ▼
        MySQL (Port 3306)
        
AWS S3 ──► File Storage
```

#### Deployment Steps:

**1. Server Setup**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install MySQL 8.0
sudo apt install -y mysql-server

# Install Nginx
sudo apt install -y nginx

# Install PM2 globally
sudo npm install -g pm2

# Install Git
sudo apt install -y git
```

**2. Clone & Configure Application**
```bash
# Clone repository
cd /var/www
sudo git clone <repository-url> tanuh-inventory
sudo chown -R $USER:$USER tanuh-inventory

# Backend setup
cd tanuh-inventory/backend
npm install --production
cp .env.example .env
nano .env  # Configure production settings

# Run migrations
npm run migrate

# Frontend setup
cd ../frontend
npm install
nano .env  # Configure production API URL
npm run build  # Creates dist/ folder
```

**3. Configure PM2**
```bash
cd /var/www/tanuh-inventory/backend

# Start application with PM2
pm2 start npm --name "tanuh-api" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Run the command provided by PM2

# Monitor application
pm2 monit
```

**4. Configure Nginx**
```bash
sudo nano /etc/nginx/sites-available/tanuh-inventory
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;
    
    # SSL Configuration (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    # Frontend - Static files
    location / {
        root /var/www/tanuh-inventory/frontend/dist;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # Backend API - Proxy to Node.js
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    
    # File upload limit
    client_max_body_size 20M;
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/tanuh-inventory /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

**5. SSL Certificate (Let's Encrypt)**
```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal is configured automatically
# Test renewal
sudo certbot renew --dry-run
```

**6. Firewall Configuration**
```bash
# Enable UFW
sudo ufw enable

# Allow SSH
sudo ufw allow OpenSSH

# Allow HTTP & HTTPS
sudo ufw allow 'Nginx Full'

# Check status
sudo ufw status
```

**7. Database Backup**
```bash
# Create backup script
sudo nano /usr/local/bin/backup-tanuh-db.sh
```

**Backup Script:**
```bash
#!/bin/bash
BACKUP_DIR="/var/backups/tanuh-inventory"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

mysqldump -u tanuh_user -p'password' tanuh_inventory > $BACKUP_DIR/tanuh_db_$DATE.sql

# Keep only last 30 days
find $BACKUP_DIR -name "*.sql" -mtime +30 -delete
```

```bash
# Make executable
sudo chmod +x /usr/local/bin/backup-tanuh-db.sh

# Add to crontab (daily at 2 AM)
sudo crontab -e
0 2 * * * /usr/local/bin/backup-tanuh-db.sh
```

### 9.3 Monitoring & Maintenance

#### Application Monitoring:
```bash
# View PM2 logs
pm2 logs tanuh-api

# View PM2 status
pm2 status

# Restart application
pm2 restart tanuh-api

# View resource usage
pm2 monit
```

#### Nginx Monitoring:
```bash
# View access logs
sudo tail -f /var/log/nginx/access.log

# View error logs
sudo tail -f /var/log/nginx/error.log

# Check Nginx status
sudo systemctl status nginx
```

#### MySQL Monitoring:
```bash
# Connect to MySQL
mysql -u tanuh_user -p tanuh_inventory

# Check database size
SELECT 
    table_schema AS 'Database',
    ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
FROM information_schema.tables
WHERE table_schema = 'tanuh_inventory'
GROUP BY table_schema;

# View slow queries
SHOW VARIABLES LIKE 'slow_query_log';
```

### 9.4 Updating Application

```bash
# Navigate to application directory
cd /var/www/tanuh-inventory

# Pull latest changes
git pull origin main

# Backend update
cd backend
npm install --production
npm run migrate  # Run new migrations if any

# Frontend update
cd ../frontend
npm install
npm run build

# Restart application
pm2 restart tanuh-api

# Reload Nginx (if config changed)
sudo systemctl reload nginx
```

---

## 10. Future Enhancements

### Phase 2 Features (3-6 months)

#### FE-001: Email Notifications
- Automated email alerts for warranty expiry (30, 15, 7 days before)
- Email notifications on device assignment/transfer
- Weekly/monthly inventory reports via email
- Email on consent form upload
- Integration: Nodemailer + SendGrid/AWS SES

#### FE-002: Advanced Reporting
- Custom report builder with field selection
- Scheduled reports (daily, weekly, monthly)
- Report templates
- Comparison reports (month-over-month, year-over-year)

#### FE-003: Mobile Application
- Native mobile app (React Native)
- Scan QR codes to view device details
- Quick device assignment via mobile
- Push notifications
- Offline mode support

#### FE-004: Asset Lifecycle Management
- Maintenance schedule tracking
- Service history log
- Depreciation calculation
- Replacement recommendations
- Disposal/retirement workflow

### Phase 3 Features (6-12 months)

#### FE-005: Integration APIs
- REST API for third-party integrations
- Webhook support for events
- HRMS integration for employee sync
- Procurement system integration
- API documentation (Swagger/OpenAPI)

#### FE-006: Advanced Analytics
- Predictive analytics for asset replacement
- Cost analysis and budgeting
- Utilization metrics
- ROI calculations
- Machine learning for anomaly detection

#### FE-007: Approval Workflows
- Multi-level approval for device requests
- Budget approval for purchases
- Transfer approval workflow
- Custom workflow builder

#### FE-008: Enhanced Security
- Two-factor authentication (2FA)
- Single Sign-On (SSO) integration
- IP whitelisting
- Advanced audit log analysis
- Security compliance reports (SOC 2, ISO 27001)

#### FE-009: Multi-tenancy
- Support for multiple organizations
- Tenant isolation
- Shared resources option
- Tenant-specific branding

#### FE-010: IoT Integration
- IoT device tracking (location, usage)
- Real-time device status monitoring
- Automated alerts for device issues
- Integration with asset tracking devices (RFID, GPS)

---

## Appendix

### A. API Endpoint Summary

#### Authentication
- POST `/api/auth/login` - User login
- POST `/api/auth/logout` - User logout
- GET `/api/auth/me` - Get current user info
- POST `/api/auth/change-password` - Change password

#### Employees
- GET `/api/employees` - List all employees (admin) / Get own profile (employee)
- GET `/api/employees/:id` - Get employee details
- POST `/api/employees` - Create new employee (admin)
- PUT `/api/employees/:id` - Update employee (admin)
- DELETE `/api/employees/:id` - Delete employee (admin)
- POST `/api/employees/:id/photo` - Upload employee photo

#### Devices
- GET `/api/devices` - List all devices with filters
- GET `/api/devices/:id` - Get device details
- POST `/api/devices` - Create new device (admin)
- PUT `/api/devices/:id` - Update device (admin)
- DELETE `/api/devices/:id` - Delete device (admin)
- GET `/api/devices/:id/history` - Get device assignment history

#### Assignments
- GET `/api/assignments` - List all assignments
- GET `/api/assignments/:id` - Get assignment details
- POST `/api/assignments` - Create new assignment (admin)
- PUT `/api/assignments/:id/unassign` - Unassign device (admin)
- POST `/api/assignments/:id/transfer` - Transfer device (admin)
- GET `/api/assignments/employee/:employeeId` - Get employee's assignments

#### Consent Forms
- GET `/api/consent-forms` - List consent forms
- GET `/api/consent-forms/:id` - Get consent form details
- POST `/api/consent-forms` - Upload consent form
- DELETE `/api/consent-forms/:id` - Delete consent form (admin)
- GET `/api/consent-forms/employee/:employeeId` - Get employee's consent forms

#### Dashboard
- GET `/api/dashboard/stats` - Get dashboard statistics
- GET `/api/dashboard/charts` - Get chart data
- GET `/api/dashboard/recent-activity` - Get recent activities

#### Reports
- GET `/api/reports/inventory` - Generate inventory report
- GET `/api/reports/employees` - Generate employee report
- GET `/api/reports/assignments` - Generate assignment report
- GET `/api/reports/audit-logs` - Generate audit log report

#### Audit Logs
- GET `/api/audit-logs` - List audit logs (admin)
- GET `/api/audit-logs/:id` - Get audit log details (admin)

### B. Error Codes

| Code | Description |
|------|-------------|
| 400  | Bad Request - Invalid input data |
| 401  | Unauthorized - Authentication required |
| 403  | Forbidden - Insufficient permissions |
| 404  | Not Found - Resource doesn't exist |
| 409  | Conflict - Duplicate resource |
| 422  | Unprocessable Entity - Validation failed |
| 429  | Too Many Requests - Rate limit exceeded |
| 500  | Internal Server Error |
| 503  | Service Unavailable |

### C. Sample Data

#### Sample Admin User:
```json
{
  "username": "admin",
  "email": "admin@tanuh.com",
  "password": "Admin@123",
  "role": "admin"
}
```

#### Sample Employee:
```json
{
  "employee_id": "EMP001",
  "full_name": "Rahul Sharma",
  "email": "rahul.sharma@tanuh.com",
  "phone_number": "+91 98765 43210",
  "date_of_birth": "1995-06-15",
  "department": "Engineering",
  "designation": "Software Engineer",
  "date_of_joining": "2023-01-15"
}
```

#### Sample Device:
```json
{
  "asset_tag": "LT-2024-001",
  "device_name": "Dell Latitude 7420",
  "device_category": "laptop",
  "serial_number": "SN123456789",
  "brand": "Dell",
  "specifications": "Intel i7 11th Gen, 16GB RAM, 512GB SSD",
  "purchase_cost": 85000.00,
  "purchase_date": "2024-01-10",
  "warranty_expiry_date": "2027-01-10",
  "device_status": "available"
}
```

### D. Glossary

- **Asset Tag:** Unique identifier assigned to each device
- **Assignment:** The act of allocating a device to an employee
- **Audit Log:** Record of all system activities
- **Consent Form:** Document signed by employee for device usage
- **Device Category:** Classification of IT equipment
- **Employee ID:** Unique identifier for each employee
- **Session ID:** Unique identifier for user session
- **Soft Delete:** Marking records as deleted without removing from database
- **Transfer:** Moving a device from one employee to another
- **Warranty Expiry:** Date when device warranty ends
