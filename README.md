# Thermostat Control Dashboard

This is a project my engineer roommates and I are collaborating on to create a thermostat control system that can be managed remotely. This project will utilize Node.js, Express, MongoDB, and Adafruit IO to put together a web application that allows us to securely control a thermostat, set schedules, and handle user authentication. 

## Features

### 1. User Management
- **User Registration and Login**: Users can create accounts and log in to access the thermostat controls.
- **Password Security**: Passwords are hashed with `bcryptjs` for secure storage in MongoDB.
- **Session Management**: We use `express-session` to keep track of user sessions and allow authenticated access.

### 2. Thermostat Control
- **Manual Control**: Users can remotely set the thermostat to "cool" or "off."
- **Adafruit IO Integration**: Commands are sent to the thermostat using Adafruit IO feeds, so we can control it from anywhere.

### 3. Future Enhancements
- **Scheduling Functionality**: We plan to add the ability to set a schedule for automatic thermostat control.
- **User Dashboard**: A more interactive dashboard for easier control, schedule management, and real-time status updates is on our list too.

### 4. Security Features
- **Environment Variables**: Sensitive info like API keys and database credentials are managed with `.env` files.
- **Protected Routes**: Only authenticated users can control the thermostat or access sensitive features.
- **Hashing**: Passwords are hashed and salted using bcryptjs for secure storage in MongoDB.

## Technologies Used
- **Node.js** and **Express.js**: Backend development for the server and API.
- **MongoDB** and **Mongoose**: Database to store user data, thermostat settings, and schedules.
- **Adafruit IO**: Integration for remote thermostat control via IoT feeds.
- **bcryptjs**: Password hashing for secure user authentication.
- **express-session**: Session management for logged-in users.
- **HTML, CSS, JavaScript**: Front-end for user interactions.

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd thermostat-control/web_interface/backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create a `.env` File
- Create a `.env` file in the backend directory and add the following:
  ```env
  MONGODB_URI=your_mongodb_uri
  AIO_USERNAME=your_adafruit_username
  AIO_KEY=your_adafruit_key
  PORT=3000
  ```

### 4. Run the Application
```bash
npm start
```
- The server will run on `http://localhost:3000`.

## Future Enhancements
- **User Dashboard**: We'll be adding a full dashboard for interacting with the thermostat, scheduling, and monitoring.
- **Cloud Deployment**: Plan to deploy the application to a cloud provider so we can manage the thermostat from anywhere in the world.

## Learning Outcomes
- **Full-Stack Development**: This project has been a great opportunity for us to learn full-stack development with Node.js, Express, and MongoDB.
- **IoT Integration**: We learned how to integrate with IoT services like Adafruit IO for remote device control.
- **User Authentication**: Implemented secure user authentication and session management.
- **RESTful API Development**: Created RESTful APIs for user interactions and thermostat control.

