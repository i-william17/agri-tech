# AgTech ERP Platform

A full-stack Cooperative Management Web Application that allows Admins to manage farmers and their crops, while Farmers can manage their own profiles and crops.

## Features

- **Role-Based Access Control**: Admin and Farmer roles with appropriate permissions
- **Authentication**: JWT-based login/register system
- **Dashboard**: Role-specific dashboards with charts and statistics
- **Farmer Management**: Admin can CRUD farmers
- **Crop Management**: Both roles can manage crops with appropriate restrictions
- **Profile Management**: Farmers can update their own profiles
- **Responsive Design**: Bootstrap-based responsive layout

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **ORM**: Sequelize
- **Database**: PostgreSQL (Neon Cloud)
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express Validator
- **Password Hashing**: bcryptjs

### Frontend
- **Framework**: React.js
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Charts**: Chart.js with react-chartjs-2
- **UI Framework**: React Bootstrap
- **State Management**: React Context API

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL database (local or Neon Cloud)
- npm or yarn


### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/i-william17/agri-tech
   cd agri-tech/backend

### Install dependencies

npm install

Environment Configuration
### Environment Variables
# Neon Database - Connection String
DATABASE_URL='postgresql://neondb_owner:npg_85MWlZjNqTfH@ep-holy-mouse-ad3dwk51-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'

# JWT
JWT_SECRET = "2FxXT1NTf2K1Mo4i6AOvtdI"
JWT_EXPIRES = 7d

# Server
PORT=5000
NODE_ENV=production

ADMIN_EMAIL=admin@agtech.com
ADMIN_PASSWORD=admin123



The application will automatically create tables on startup

Admin user will be seeded automatically

Start the server

bash
# Command
npm run dev

### Frontend Setup
# Navigate to frontend directory

cd frontend

# Install dependencies

npm install

# Start the application

npm start


### DEMO CREDENTIALS
# Admin Account
Email: admin@agtech.com
Password: admin123

Permissions: Full access to all features

# Farmer Accounts
You can register new farmer accounts through the registration page