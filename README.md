# EV Charging Station Management System 🔋

A full-stack web application for managing electric vehicle charging stations with real-time data, user authentication, and interactive map visualization.

## 🚀 Live Demo

- **Frontend**: https://ev-charging-app-frontend.onrender.com/
- **Backend API**: https://ev-charging-app-punn.onrender.com/
- **API Documentation**: [Your Swagger/Postman Collection URL]

## 📸 Screenshots

### Dashboard
![Dashboard](screenshots/dashboard.png)

### Charging Station List
![Charging Stations](screenshots/charging-stations.png)

### Map View
![Map View](screenshots/map-view.png)

### Login Screen
![Login](screenshots/login.png)

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (specify which one you used)
- **JWT** - Authentication
- **Mongoose** - ODM/ORM (specify which)
- **bcryptjs** - Password hashing
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables

### Frontend
- **Vue.js 3** - Frontend framework
- **Vue Router** - Client-side routing
- **Axios** - HTTP client
- **OpenStreetMap** - Map integration

### Deployment
- **Frontend**: Render
- **Backend**: Render
- **Database**: MongoDB Atlas

## ⚡ Features

### 🔐 Authentication
- User registration and login
- JWT-based authentication
- Protected routes and API endpoints
- Secure password hashing

### 🔌 Charging Station Management
- **Create** new charging stations
- **Read** and list all charging stations
- **Update** existing station details
- **Delete** charging stations
- Advanced filtering options (status, power output, connector type)

### 🗺️ Interactive Map
- Real-time map visualization of all charging stations
- Clickable markers with detailed station information
- Location-based search and filtering
- Responsive map interface

### 📊 Station Details
- Station name and location coordinates
- Power output specifications (kW)
- Connector type information
- Status tracking (Active/Inactive)
- Real-time availability updates

## 🚀 Getting Started

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ev-charging-management.git
   cd ev-charging-management
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```


## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Charging Stations
- `GET /api/stations` - Get all charging stations
- `GET /api/stations/:id` - Get specific charging station
- `POST /api/stations` - Create new charging station (Protected)
- `PUT /api/stations/:id` - Update charging station (Protected)
- `DELETE /api/stations/:id` - Delete charging station (Protected)

### Example API Request
```javascript
// Create a new charging station
POST /api/stations
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "Tesla Supercharger",
  "location": {
    "latitude": 37.7749,
    "longitude": -122.4194
  },
  "status": "Active",
  "powerOutput": 150,
  "connectorType": "CCS"
}
```

## 🔧 Key Features Implementation

### JWT Authentication
- Secure token-based authentication
- Middleware protection for sensitive routes
- Token expiration and refresh handling

### CRUD Operations
- Complete Create, Read, Update, Delete functionality
- Input validation and error handling
- Real-time data synchronization

### Map Integration
- Interactive map with custom markers
- Geolocation-based features
- Responsive design for mobile devices

### Filtering System
- Advanced search and filter options
- Real-time filtering without page reload
- Multiple filter criteria support

#

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn Profile]
- Email: your.email@example.com

⭐ Don't forget to star this repository if you found it helpful!
