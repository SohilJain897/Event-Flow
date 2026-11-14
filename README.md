# EventFlow – Smart Event Booking System

A full-stack event booking platform built using React, Node.js, Express.js, and MySQL/TiDB. EventFlow allows users to explore events, view event details, book tickets, and manage their bookings. Administrators can manage events and monitor bookings through a dedicated admin dashboard.

## Live Demo

- **Frontend:** https://event-flow-tau-five.vercel.app/
- **Backend API:** https://event-flow-oepk.onrender.com
- **GitHub Repository:** https://github.com/SohilJain897/Event-Flow
- **

## Features

### User Features
- Browse and explore available events.
- View individual event details.
- Book tickets for events.
- Manage the ticket booking experience.
- Generate and download PDF tickets with QR codes.

### Admin Features
- Secure admin login.
- Admin dashboard.
- Create, update, and delete events.
- View and manage bookings.
- Monitor event and booking information.

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, Vite |
| Backend | Node.js, Express.js |
| Database | MySQL / TiDB Cloud |
| API Requests | Axios |
| Database Driver | mysql2 |
| Deployment – Frontend | Vercel |
| Deployment – Backend | Render |

## Project Structure

```text
EventFlow/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── data/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vercel.json
│   ├── package.json
│   └── index.html
│
├── server/
│   ├── config/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── package.json
│
└── README.md
```

## Installation and Setup

### Prerequisites

- Node.js and npm
- MySQL Server or TiDB Cloud account
- Git

### 1. Clone the repository

```bash
git clone https://github.com/SohilJain897/Event-Flow.git
cd Event-Flow
```

### 2. Configure the database

Create a database named:

```sql
CREATE DATABASE event_booking;
```

Import the database SQL file. Refer to `DATABASE_INSTRUCTIONS.md` for detailed instructions.

### 3. Configure the backend

Navigate to the server folder:

```bash
cd server
npm install
```

Create a `.env` file inside the `server` folder:

```env
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=event_booking
DB_PORT=3306

ADMIN_KEY=your_secure_admin_key

CLIENT_URL=http://localhost:5173
```

For TiDB Cloud, use the cloud database credentials and configure the SSL certificate path using `DB_SSL_CA`.

Start the backend:

```bash
npm run dev
```

Backend runs at:

```text
http://localhost:5000
```

### 4. Configure the frontend

Open another terminal:

```bash
cd client
npm install
```

Create a `.env` file inside `client`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

## Application Routes

| Route | Description |
|---|---|
| `/` | Homepage |
| `/events` | Browse events |
| `/events/:id` | Event details |
| `/admin/login` | Admin login |
| `/admin/dashboard` | Admin dashboard |
| `/admin/events` | Manage events |
| `/admin/bookings` | Manage bookings |

## Deployment

- Frontend is deployed on Vercel.
- Backend is deployed on Render.
- Database is hosted on TiDB Cloud.

Configure the production environment variables in the respective hosting dashboards. Never commit `.env` files, database passwords, or admin secrets to GitHub.

## Future Enhancements

- Online payment gateway integration.
- Email booking confirmations.
- Advanced analytics for administrators.
- Improved authentication and authorization.
- User profiles and booking history.

## Author

**Sohil Jain**

Full Stack Developer

GitHub: https://github.com/SohilJain897

---

*EventFlow – Discover events. Book experiences. Create memories.*


------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# EventFlow – Database Setup Instructions

This document explains how to configure and connect the EventFlow database using MySQL locally or TiDB Cloud for production.

## 1. Database Information

| Property | Value |
|---|---|
| Database Name | `event_booking` |
| Database Engine | MySQL-compatible |
| Local Database | MySQL Server |
| Production Database | TiDB Cloud |
| Node.js Driver | mysql2 |
| Main Tables | `events`, `bookings` |

## 2. Local MySQL Setup

### Step 1: Install MySQL

Install MySQL Server and optionally MySQL Workbench.

### Step 2: Create the database

Open MySQL Workbench or MySQL Command Line Client and execute:

```sql
CREATE DATABASE event_booking;
USE event_booking;
```

### Step 3: Import the SQL file

If you have the supplied `event_booking.sql` database dump, import it into the newly created database.

Using MySQL Command Line on Windows:

```bash
mysql -u root -p event_booking < event_booking.sql
```

Replace the SQL file path if it is stored in a different directory.

Alternatively, use MySQL Workbench:

1. Open MySQL Workbench.
2. Connect to your local MySQL server.
3. Select Server → Data Import.
4. Choose Import from Self-Contained File.
5. Select `event_booking.sql`.
6. Choose `event_booking` as the target schema.
7. Click Start Import.

### Step 4: Verify database tables

Execute:

```sql
USE event_booking;

SHOW TABLES;
```

Expected tables:

```text
events
bookings
```

Check the records:

```sql
SELECT * FROM events;

SELECT * FROM bookings;
```

## 3. TiDB Cloud Production Setup

EventFlow uses TiDB Cloud as its production database.

### Step 1: Create a TiDB Cloud cluster

1. Create an account on TiDB Cloud.
2. Create a Serverless cluster.
3. Configure the database and connection credentials.
4. Create a database named `event_booking`.

### Step 2: Configure database connection

Obtain the following details from the TiDB Cloud connection panel:

- Host
- Port
- Username
- Password
- Database name
- CA certificate for TLS verification

### Step 3: Import database

Use the supplied `event_booking.sql` file to import the tables and records into the TiDB Cloud database.

Connect using a MySQL-compatible client with TLS verification enabled.

Example connection command:

```bash
mysql -u YOUR_TIDB_USERNAME \
-h YOUR_TIDB_HOST \
-P 4000 \
-D event_booking \
--ssl-mode=VERIFY_IDENTITY \
--ssl-ca="PATH_TO_CA_CERTIFICATE" \
-p
```

Replace placeholders with your actual credentials and certificate path. Enter the password when prompted.

### Step 4: Verify the imported data

```sql
SHOW TABLES;

SELECT COUNT(*) FROM events;

SELECT COUNT(*) FROM bookings;
```

## 4. Backend Environment Variables

Create a `.env` file inside the `server` directory.

For local MySQL:

```env
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=event_booking
DB_PORT=3306

ADMIN_KEY=your_secure_admin_key

CLIENT_URL=http://localhost:5173
```

For TiDB Cloud production:

```env
PORT=5000

DB_HOST=your_tidb_host
DB_USER=your_tidb_username
DB_PASSWORD=your_tidb_password
DB_NAME=event_booking
DB_PORT=4000

DB_SSL_CA=/path/to/isrgrootx1.pem

ADMIN_KEY=your_secure_admin_key

CLIENT_URL=https://your-vercel-domain.vercel.app
```

**Important:** Never upload your `.env` file or database credentials to GitHub.

## 5. Database Connection Configuration

The backend uses `mysql2/promise` to establish a database connection.

The connection configuration is maintained in:

```text
server/config/db.js
```

The configuration uses:

- Environment variables for database credentials.
- Connection pooling.
- SSL certificate verification when configured.
- A connection limit to manage database connections.

## 6. Database Health Check

Once the backend is running, open:

```text
http://localhost:5000/api/health
```

For production:

```text
https://event-flow-oepk.onrender.com/api/health
```

A successful response should look like:

```json
{
  "success": true,
  "message": "Backend and MySQL connected successfully!"
}
```

## 7. Troubleshooting

| Problem | Possible Solution |
|---|---|
| Access denied | Verify DB username and password |
| Unknown database | Create `event_booking` |
| Connection refused | Check MySQL service and port |
| TLS connection error | Verify CA certificate and SSL configuration |
| Tables not found | Import the SQL dump |
| Backend health check fails | Check Render environment variables and backend logs |

## 8. Security Recommendations

- Never share database passwords publicly.
- Keep admin keys private.
- Use TLS for production database connections.
- Do not commit `.env` files.
- Use strong credentials.
- Avoid exposing real customer booking data in public demos.

---

**Project:** EventFlow – Smart Event Booking System

**Database:** MySQL / TiDB Cloud

**Backend:** Node.js and Express.js
