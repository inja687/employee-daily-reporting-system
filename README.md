# Employee Daily Reporting System

A full-stack daily reporting application for employees, managers, and administrators. It uses React, Bootstrap, Express, MySQL, and JWT authentication.

## Features

- Employees submit one daily report per date and review report history and feedback.
- Managers view assigned employee reports, add comments, and approve or reject reports.
- Administrators create, disable, and delete employee/manager accounts and assign employees to managers.
- API authorization enforces role permissions and team ownership.
- Responsive Bootstrap interface works on desktop and mobile.

## Project Structure

```text
frontend/             React + Vite application
backend/              Express REST API
backend/database/     MySQL schema
```

## Prerequisites

- Node.js 20 or newer
- npm 10 or newer
- MySQL 8 or newer

## Setup

1. Install all dependencies:

   ```bash
   npm run install:all
   ```

2. Create the environment files:

   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

   On Windows PowerShell, use `Copy-Item` instead of `cp`. Update `backend/.env` with your MySQL credentials and a strong `JWT_SECRET`.

3. Start the backend. It creates the configured database and any missing tables from `backend/database/schema.sql` automatically:

   ```bash
   npm run dev:backend
   ```

4. Seed the initial administrator:

   ```bash
   npm run seed:admin
   ```

   The default credentials from `.env.example` are `admin@example.com` / `Admin@123`. Change them before seeding any non-development environment.

5. Start the frontend in a second terminal:

   ```bash
   npm run dev:frontend
   ```

6. Open `http://localhost:5173`.

## API Summary

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/login` | Public | Authenticate and receive a JWT |
| GET | `/api/auth/me` | Authenticated | Current user profile |
| GET | `/api/dashboard` | Authenticated | Role-specific statistics |
| POST | `/api/reports` | Employee | Submit a report |
| GET | `/api/reports/mine` | Employee | Own report history |
| GET | `/api/reports/team` | Manager | Assigned team reports |
| PATCH | `/api/reports/:id/status` | Manager | Approve or reject a report |
| GET | `/api/reports/:id/comments` | Authorized report users | List report comments |
| POST | `/api/reports/:id/comments` | Manager | Add manager feedback |
| GET | `/api/admin/users` | Admin | List users |
| POST | `/api/admin/users` | Admin | Create an employee or manager |
| PATCH | `/api/admin/users/:id` | Admin | Update user details/status |
| DELETE | `/api/admin/users/:id` | Admin | Delete a user |
| PATCH | `/api/admin/employees/:id/manager` | Admin | Assign or unassign a manager |

## Validation

```bash
npm run lint
npm run build
```

The frontend production output is written to `frontend/dist`. The backend requires a live MySQL connection when started, but syntax validation does not.

## Security Notes

- Passwords are hashed with bcrypt using 12 rounds.
- JWTs expire according to `JWT_EXPIRES_IN`.
- Helmet, CORS, input validation, parameterized SQL, role checks, and ownership checks are enabled.
- Use HTTPS, a secrets manager, restricted database credentials, and a strong JWT secret in production.
