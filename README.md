# Employee Manager System

## Overview
Employee Manager is a full-stack web application designed to help organisations efficiently manage employee records, leave requests, and internal notifications. It implements secure authentication, role-based access control, and user-friendly interfaces to provide a seamless experience for both administrators and employees.

This project was developed as part of the IFN636 Software Life Cycle Management course at QUT.

## Key Features
- **Secure Authentication & Role-Based Access Control**
  - Admins and employees have different access levels.
  - Admins manage sensitive operations like leave approvals and salary visibility.
- **Employee Management**
  - Admins can add, view, update, and delete employee records.
- **Leave Management**
  - Employees can submit leave requests.
  - Admins can approve or reject requests with notifications.
- **Profile Management**
  - Employees can update their own profiles.
- **Real-Time Notifications**
  - Supports email, SMS, and in-app notifications using Observer Pattern.

## Tech Stack
- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Deployment**: AWS EC2

## Installation

### Quick Start with Docker

1. Start the application using Docker Compose:
```bash
docker-compose up --build -d
```

2. Access the application:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5001
- Mongo Express GUI: http://localhost:8081
  - basic auth: admin:pass

3. Stop the application:
```bash
docker-compose down
```

### Manual Start

1. **npm install**
   ```bash
   npm install
   ```

2. **Configure Environment**
   - Create a `.env` file and define necessary variables (e.g., MongoDB connection string, JWT secret).

3. **Run the Application**
   ```bash
   npm run dev
   ```
