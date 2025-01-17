# Thermostat Control Dashboard

This is a project my engineer roommates and I are collaborating on to create a thermostat control system that can be managed remotely. This project utilizes **Node.js**, **Express**, **MongoDB**, and **Adafruit IO** to provide a secure web application for controlling a thermostat, managing schedules, and handling user authentication.

---

## Features

### 1. **User Management**
- **User Registration and Login**: Users can create accounts and log in to access the thermostat controls.
- **Password Security**: Passwords are hashed with `bcrypt` for secure storage in MongoDB.
- **Session Management**: JWT tokens are used for secure authentication, stored as HTTP-only cookies.
- **Test User Simulation**: Test users have restricted functionality, simulating command responses without executing real thermostat actions.

### 2. **Thermostat Control**
- **Manual Control**: Users can remotely set the thermostat to "cool" or "off."
- **Adafruit IO Integration**: Commands are sent to the thermostat using Adafruit IO feeds for IoT-based control.

### 3. **Security Features**
- **JWT Authentication**: 
  - Tokens are short-lived (30 minutes) and securely stored in HTTP-only cookies.
  - CSRF protection is implemented with CSRF tokens.
- **CSRF Protection**: 
  - A CSRF token is generated on login and validated on every sensitive request.
- **XSS Protection**: 
  - Sensitive tokens are stored in HTTP-only cookies, inaccessible to JavaScript.
- **Input Validation**: 
  - All user inputs are validated and sanitized to prevent NoSQL injection attacks.
- **Secure Cookie Handling**: 
  - Cookies are marked `secure` and `sameSite: 'strict'` to prevent misuse.
- **Logout Mechanism**: 
  - All tokens are cleared securely on logout.

### 4. **Technologies Used**
- **Node.js** and **Express.js**: Backend for server and API development.
- **MongoDB** and **Mongoose**: Database for storing user data and thermostat settings.
- **Adafruit IO**: IoT integration for remote thermostat control.
- **bcrypt**: For password hashing and security.
- **JSON Web Tokens (JWT)**: For stateless, secure user authentication.
- **CSRF Protection**: Using custom middleware for request validation.
- **HTML, CSS, JavaScript**: Front-end for user interaction.

---

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd thermostat-control
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create a `.env` File
- Add sensitive configuration in a `.env` file:
  ```env
  MONGODB_URI=your_mongodb_connection_string
  JWT_SECRET=your_jwt_secret
  AIO_USERNAME=your_adafruit_username
  AIO_KEY=your_adafruit_key
  FEED_KEY=your_adafruit_feed
  PORT=3000
  ```

### 4. Run the Application
```bash
npm start
```
- The server will start at `http://localhost:3000`.

---

## Cloud Deployment on Railway

This project is deployed on [Railway](https://railway.app) for cloud-based accessibility and management.

### **Deployment Steps**
1. **Connect Repository**:
   - Link your GitHub repository to Railway via the Railway dashboard.

2. **Environment Variables**:
   - Set up required environment variables in Railway under the **Settings** tab:
     ```
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     AIO_USERNAME=your_adafruit_username
     AIO_KEY=your_adafruit_key
     FEED_KEY=your_adafruit_feed
     PORT=3000
     ```

3. **Node.js Setup**:
   - Railway automatically detects the `package.json` file and uses the `start` script to run the app:
     ```json
     "scripts": {
       "start": "node server.js"
     }
     ```

4. **Build and Deploy**:
   - Trigger a deployment from the Railway dashboard or by pushing changes to your GitHub repository.

5. **Access the App**:
   - Once deployed, Railway provides a unique domain for your app (e.g., `https://your-app.up.railway.app`).

---

## Security Implementation

### **1. JWT Token Handling**
- Tokens are generated during login and stored securely in HTTP-only cookies.
- Tokens are validated for all protected routes via middleware.

### **2. CSRF Protection**
- A CSRF token is generated during login and sent as a cookie.
- Front-end includes the token in the `X-CSRF-Token` header for all sensitive requests.
- Back-end verifies the CSRF token to prevent unauthorized actions.

### **3. XSS and NoSQL Injection Prevention**
- Sensitive tokens (JWT) are stored in HTTP-only cookies, inaccessible to JavaScript.
- All user inputs are validated and sanitized to prevent malicious queries.

### **4. Secure Cookies**
- Cookies are marked `secure` and `sameSite: 'strict'` to protect against misuse.

### **5. Logging and Monitoring**
- Errors and failed authentication attempts are logged for monitoring and debugging.
- No sensitive details are exposed in error messages.

---

## Future Enhancements

### 1. **User Dashboard**
- A full-featured dashboard for setting schedules, monitoring thermostat status, and managing account settings.

### 2. **Token Rotation and Revocation**
- Implement token rotation for enhanced security.
- Add server-side token blacklisting for immediate revocation.

### 3. **Cloud Deployment**
- Continue refining the deployment pipeline for scalability and reliability.

---

## Learning Outcomes

### **1. Full-Stack Development**
- Implemented a secure, full-stack web application using Node.js, Express, and MongoDB.

### **2. IoT Integration**
- Integrated with Adafruit IO for remote device control via IoT feeds.

### **3. Secure Authentication**
- Designed a robust authentication system using JWT, bcrypt, and CSRF tokens.

### **4. RESTful API Development**
- Created secure RESTful APIs for user interactions and thermostat control.

---

## Contact
Try out the [website](https://thermostat.up.railway.app/)!
Feel free to reach out for any questions or contributions. 
