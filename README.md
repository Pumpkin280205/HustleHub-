# HustleHub+ — Secure Freelance Marketplace

## 1. System Overview

HustleHub+ is a secure freelance marketplace platform that allows freelancers to advertise their services and clients to browse, book, and pay for those services.

In addition to standard marketplace functionality, the platform records financial transactions generated through bookings. HustleHub+ also provides users with an indication of income earned and estimated tax obligations based on the financial information recorded by the system.

The application is designed with security as a primary concern because it processes sensitive information, including user credentials, booking information, financial transactions, and income-related data.

The system uses a full-stack architecture consisting of a frontend application, backend REST API, and database. The backend provides the main security boundary between users and the database.

---

## 2. Intended Users

HustleHub+ is intended for two primary categories of users: freelancers and clients.

### 2.1 Freelancers

Freelancers use the platform to advertise and manage the services they provide.

Typical functionality includes:

* Creating a freelancer account
* Creating and managing service listings
* Providing service descriptions and pricing
* Viewing bookings
* Tracking income generated from bookings
* Viewing estimated tax obligations
* Managing account information

### 2.2 Clients

Clients use HustleHub+ to find and book freelance services.

Typical functionality includes:

* Creating an account
* Logging into the platform
* Browsing available freelance services
* Viewing service information and pricing
* Booking services
* Recording transactions associated with bookings
* Viewing booking and transaction information

---

## 3. System Architecture

HustleHub+ follows a layered MERN web application architecture consisting of a React.js frontend, a Node.js and Express.js backend, and a MongoDB database. The frontend provides the user interface through which freelancers and clients interact with the system. The backend provides the REST API, authentication, authorisation, validation, and business logic, while MongoDB provides persistent data storage. (React, n.d.; Node.js, n.d.; Express.js, n.d.; MongoDB, n.d.)

The frontend communicates with the backend through RESTful API requests over HTTPS/TLS. The frontend does not communicate directly with the database. Instead, all database operations are performed by the backend after authentication, authorisation, and input validation have been applied. This creates a clear separation between the presentation layer, application layer, and data layer. (Express.js, n.d.; MongoDB, n.d.)

The architecture can be represented as follows:

```text
Users
   |
   v
React.js Frontend
   |
   | HTTPS / TLS
   v
Node.js + Express.js REST API
   |
   +--------------------------------+
   | Security Layer                 |
   |                                |
   | JWT Authentication             |
   | Authorisation                  |
   | Joi Validation                 |
   | bcrypt Password Hashing        |
   | Helmet Security Headers        |
   | Rate Limiting                  |
   +--------------------------------+
   |
   v
Business Logic
   |
   v
MongoDB
   |
   +-- Users
   +-- Services
   +-- Bookings
   +-- Transactions
   +-- Income / Tax Information
```

This architecture establishes a clear system boundary between users, the application server, and the database. It also ensures that sensitive operations are handled by the backend rather than being performed directly by the client.

---

## 4. Technology Stack

HustleHub+ uses the MERN technology stack, consisting of MongoDB, Express.js, React.js, and Node.js. Additional technologies are used to support authentication, password protection, input validation, and secure communication. (React, n.d.; Node.js, n.d.; MongoDB, n.d.)

MongoDB is responsible for persistent data storage, while Express.js provides the backend web framework and REST API functionality. Node.js provides the JavaScript runtime environment for the backend, and React.js provides the frontend user interface. JWT, bcrypt, Joi, and HTTPS/TLS provide additional authentication, security, validation, and communication controls.

| Technology | Purpose                                            |
| ---------- | -------------------------------------------------- |
| MongoDB    | Database and persistent data storage               |
| Express.js | Backend web framework and REST API                 |
| React.js   | Frontend user interface                            |
| Node.js    | Backend JavaScript runtime                         |
| JWT        | User authentication                                |
| bcrypt     | Password hashing                                   |
| Joi        | Input validation                                   |
| HTTPS/TLS  | Secure communication between the client and server |

---

## 5. Frontend Structure

The frontend of HustleHub+ is developed using React.js. It provides the user interface through which freelancers and clients interact with the system. React components are used to organise the application's interface and provide access to the functionality available to each type of user. (React, n.d.)

The frontend provides functionality including user registration, user login, freelancer dashboards, client dashboards, service browsing, service management, booking functionality, transaction information, income information, estimated tax information, and account management.

The frontend communicates with the backend using REST API requests. User input and requests involving sensitive operations are sent to the backend, where they are authenticated, validated, authorised, and processed. The frontend does not directly access MongoDB. (React, n.d.; Express.js, n.d.)

This separation ensures that sensitive business logic and database operations remain within the backend security boundary.

---

## 6. Backend Structure

The backend of HustleHub+ is developed using Node.js and Express.js. It provides the REST API and contains the application's main business logic. The backend is responsible for processing requests, authenticating users, applying authorisation rules, validating input, performing database operations, and returning appropriate responses to the frontend. (Node.js, n.d.; Express.js, n.d.)

The backend can be organised into separate configuration, controller, middleware, model, route, and utility components. A typical structure is:

```text
backend/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── serviceController.js
│   ├── bookingController.js
│   ├── transactionController.js
│   └── taxController.js
│
├── middleware/
│   ├── authMiddleware.js
│   ├── validationMiddleware.js
│   └── errorMiddleware.js
│
├── models/
│   ├── User.js
│   ├── Service.js
│   ├── Booking.js
│   ├── Transaction.js
│   └── Tax.js
│
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── serviceRoutes.js
│   ├── bookingRoutes.js
│   ├── transactionRoutes.js
│   └── taxRoutes.js
│
├── utils/
│   └── authentication.js
│
├── .env
├── server.js
└── package.json
```

The exact structure may differ depending on the final implementation. Separating these responsibilities improves maintainability and makes it easier to manage authentication, validation, error handling, and business logic.

---

## 7. Database

MongoDB is used as the persistent database for HustleHub+. The database stores the information required to operate the freelance marketplace, including user accounts, freelancer service listings, client bookings, financial transactions, income information, and estimated tax information. (MongoDB, n.d.)

The frontend does not directly access MongoDB. All database operations are performed through the backend REST API. This allows the application to apply authentication, authorisation, and validation controls before sensitive information is accessed or modified. (MongoDB, n.d.)

This approach helps protect the database from direct client-side access and ensures that database operations remain within the application's controlled backend environment.

---

## 8. Security Decisions

Security is a fundamental part of the HustleHub+ architecture because the platform processes sensitive information, including user credentials, account information, booking information, financial transactions, income information, and estimated tax information.

The main security decisions implemented or planned for the system include password hashing using bcrypt, JWT-based authentication, input validation using Joi, HTTPS/TLS communication, backend authorisation, secure configuration using environment variables, security headers using Helmet, and rate limiting. (OWASP Foundation, n.d.; Jones, Bradley and Sakimura, 2015; Joi, n.d.; MDN Web Docs, n.d.; Express.js, n.d.)

---

## 8.1 Password Hashing

User passwords are never stored as plaintext. HustleHub+ uses bcrypt to hash passwords before they are stored in MongoDB. Password hashing protects the original password from being directly exposed if the database is compromised. (OWASP Foundation, n.d.)

The registration process can be represented as follows:

```text
User enters password
       |
       v
Backend receives password
       |
       v
bcrypt hashes password
       |
       v
Password hash stored in MongoDB
```

During login, the password supplied by the user is compared against the stored bcrypt hash. The original password is not stored in the database. (OWASP Foundation, n.d.)

This approach reduces the risk of exposing users' actual passwords in the event of unauthorised database access.

---

## 8.2 JWT Authentication

HustleHub+ uses JSON Web Tokens (JWT) to authenticate users and control access to protected API resources. JWT is a standard for securely representing claims between parties and can be used to transmit authentication information between the client and server. (Jones, Bradley and Sakimura, 2015)

After successfully logging in, the backend generates an authentication token for the authenticated user. The authentication process can be represented as follows:

```text
User Login
   |
   v
Backend validates credentials
   |
   v
bcrypt verifies password
   |
   v
JWT generated
   |
   v
Token returned to authenticated client
   |
   v
Token included with protected API requests
   |
   v
JWT middleware verifies token
   |
   v
Request allowed or rejected
```

Protected API endpoints require a valid JWT. This prevents unauthenticated users from accessing restricted functionality such as managing services, viewing protected bookings, or accessing sensitive financial information.

---

## 8.3 Input Validation

HustleHub+ validates incoming data before it is processed by the application's business logic or stored in MongoDB. Joi can be used to define validation schemas for different API requests. (Joi, n.d.)

Validation can be applied to requests such as user registration, user login, service creation, service updates, booking creation, transaction information, and other API operations.

For example, registration validation can check that required fields are provided, email addresses follow the expected format, passwords meet the required requirements, and invalid values are rejected.

This helps prevent malformed or unexpected data from entering the application.

---

## 8.4 HTTPS / TLS

HustleHub+ should use HTTPS/TLS to protect communication between the frontend and backend. TLS helps protect information while it is being transmitted between the client and server. (MDN Web Docs, n.d.)

This is particularly important because the application processes sensitive information such as login credentials, authentication tokens, user information, booking information, transaction information, and income-related information.

Using HTTPS prevents sensitive information from being transmitted through an unencrypted HTTP connection and helps protect data from interception during transmission.

---

## 8.5 Authorisation

Authentication determines whether a user has successfully established their identity, while authorisation determines what that authenticated user is permitted to access.

HustleHub+ applies authorisation controls to protected functionality. For example, freelancers should be able to manage their own services, clients should be able to create and manage their own bookings, and users should only be able to access information associated with their own accounts.

Protected financial and income information should only be accessible to appropriately authenticated and authorised users. These authorisation checks are performed by the backend rather than relying solely on frontend restrictions.

---

## 8.6 Additional Security Controls

Additional security controls can be implemented to strengthen the overall security of the application.

### Helmet

Helmet can be used with Express.js to configure HTTP security headers and reduce exposure to common web-based attacks. (Express.js, n.d.)

### Rate Limiting

Rate limiting can restrict excessive requests to the API. This is particularly useful for authentication endpoints because it can reduce the effectiveness of repeated login attempts and brute-force attacks. (Express.js, n.d.)

### Environment Variables

Sensitive configuration information should be stored using environment variables rather than directly in the source code. Examples include the MongoDB connection string, JWT secret, and API keys.

Example:

```text
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
API_KEYS=<your-api-keys>
```

The `.env` file should not be committed to the public repository. It should be included in the `.gitignore` file to prevent sensitive configuration information from being exposed.

---

## 9. Financial Transactions

HustleHub+ records financial transactions generated through service bookings. A transaction can contain information relating to the client, freelancer, service, booking, transaction amount, and transaction status.

Financial information is handled through the backend rather than being directly manipulated by the frontend. This ensures that transaction-related operations are subject to authentication, authorisation, and input validation before being processed or stored. (MongoDB, n.d.)

The backend therefore acts as the main security boundary for financial operations and database access.

---

## 10. Income and Estimated Tax Information

HustleHub+ provides users with an indication of income earned and estimated tax obligations based on financial information recorded through bookings and transactions.

Income-related information is considered sensitive and should only be accessible to appropriately authenticated and authorised users. The backend is responsible for processing the relevant financial information and providing the appropriate results to the frontend.

The tax information displayed by HustleHub+ should be treated as an estimate rather than professional tax advice. The system is intended to provide users with an indication of their potential tax obligations based on the information recorded within the application.

---

## 11. API Structure

The HustleHub+ backend exposes RESTful API endpoints for the main functionality of the application. The API provides a structured communication layer between the React frontend and the backend application.

Example endpoint groups include:

```text
/api/auth
/api/users
/api/services
/api/bookings
/api/transactions
/api/tax
```

Authentication endpoints may include:

```text
POST /api/auth/register
POST /api/auth/login
```

Protected endpoints require a valid authentication token. An authenticated request may include the token using the following format:

```text
Authorization: Bearer <JWT_TOKEN>
```

The backend verifies the token before allowing access to protected resources.

This API structure provides a consistent communication mechanism between the frontend and backend while ensuring that authentication, validation, and authorisation controls can be applied to protected operations.

---

## 12. Error Handling

The API uses HTTP status codes to communicate the result of requests. Appropriate status codes allow the frontend to determine whether a request was successful or whether an error occurred.

| Status Code | Meaning                                              |
| ----------- | ---------------------------------------------------- |
| 200         | Successful request                                   |
| 201         | Resource successfully created                        |
| 400         | Invalid request or validation failure                |
| 401         | Authentication required or invalid authentication    |
| 403         | User does not have permission to access the resource |
| 404         | Resource not found                                   |
| 500         | Internal server error                                |

Appropriate error responses allow the frontend to provide meaningful feedback to users without exposing sensitive backend information. Error handling should therefore provide sufficient information for the client to understand the result of a request while avoiding the disclosure of internal system details.

---

## 13. Testing

Postman is used to test the HustleHub+ REST API. The Postman collection can be used to demonstrate both successful and invalid API scenarios. (Postman, n.d.)

### Postman Test Evidence

Postman screenshots showing successful user registration, successful login with JWT token generation, and the API operating over HTTPS should be provided as evidence of the implemented testing and security controls.

**Figure 1: Successful User Registration in Postman**

*Insert screenshot here.*

**Figure 2: Successful Login and JWT Token Generation**

*Insert screenshot here.*

### Successful Scenarios

The successful test scenarios include:

* Successful user registration
* Successful login
* Successful JWT authentication
* Successful service creation
* Successful service retrieval
* Successful booking
* Successful transaction processing

These tests verify that the main functionality of the API operates as expected. (Jones, Bradley and Sakimura, 2015; Postman, n.d.)

### Invalid Scenarios

The invalid test scenarios include:

* Registration using invalid information
* Registration using an existing email address
* Login using an incorrect password
* Login using a non-existent account
* Accessing protected endpoints without a JWT
* Accessing protected endpoints using an invalid JWT
* Submitting invalid service information
* Submitting invalid booking information

These tests help demonstrate that the application's authentication, validation, and authorisation controls operate as intended. (Postman, n.d.)

<img width="1600" height="1000" alt="image" src="https://github.com/user-attachments/assets/fa122d3b-cfe1-4446-a86d-c59ba0cc50b7" />



---

## 14. Security Summary

The main security controls implemented within HustleHub+ are summarised below.

| Security Decision     | Implementation       | Purpose                                              |
| --------------------- | -------------------- | ---------------------------------------------------- |
| Password protection   | bcrypt               | Protects passwords from being stored as plaintext    |
| Authentication        | JWT                  | Authenticates users accessing protected resources    |
| Input validation      | Joi                  | Ensures API input follows expected formats           |
| HTTPS                 | TLS                  | Protects data during transmission                    |
| Security headers      | Helmet               | Provides additional HTTP security controls           |
| Rate limiting         | Express rate limiter | Helps reduce excessive and brute-force requests      |
| Environment variables | `.env`               | Protects sensitive configuration and secrets         |
| Authorisation         | Backend middleware   | Prevents users from accessing unauthorised resources |

---

## 15. Security Approach

Security is incorporated throughout the HustleHub+ system rather than being added after development. The frontend, backend, and database are separated so that users cannot directly access sensitive database information. Authentication and authorisation are applied to protected API endpoints, while input validation ensures that data is checked before being processed. (MongoDB, n.d.; Express.js, n.d.)

Passwords are protected using bcrypt hashing, authentication is implemented using JWT, and HTTPS/TLS protects data during transmission. (OWASP Foundation, n.d.; Jones, Bradley and Sakimura, 2015; MDN Web Docs, n.d.)

These controls are particularly important for HustleHub+ because the platform processes not only account information but also booking, transaction, income, and estimated tax information.

The combination of authentication, authorisation, password protection, validation, secure communication, security headers, rate limiting, and secure configuration provides a layered security approach for the application.

---

## 16. Running the Application

### Backend

To run the backend, navigate to the backend directory:

```bash
cd backend
```

Install the required dependencies:

```bash
npm install
```

Create a `.env` file containing the required configuration.

Example:

```text
PORT=5000
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
```

Start the development server:

```bash
npm run dev
```

### Frontend

To run the frontend, navigate to the frontend directory:

```bash
cd frontend
```

Install the required dependencies:

```bash
npm install
```

Start the React application:

```bash
npm start
```

The React frontend can then communicate with the Node.js and Express.js backend through the configured REST API. (React, n.d.; Express.js, n.d.)

---

## 17. Project Purpose

HustleHub+ demonstrates the development of a secure full-stack freelance marketplace that combines marketplace functionality with financial transaction recording and income-related information.

The system applies security throughout the development process, including authentication, password protection, input validation, secure communication, authorisation, API testing, and secure configuration. (OWASP Foundation, n.d.; Postman, n.d.; MongoDB, n.d.)

The project therefore provides a foundation for a functional, secure, testable, and maintainable freelance marketplace platform.

---

# Reference List

Express.js (n.d.) *Production best practices: security*. Available at: https://expressjs.com/en/advanced/best-practice-security/ (Accessed: 27 August 2026).

Jones, M., Bradley, J. and Sakimura, N. (2015) *JSON Web Token (JWT), RFC 7519*. Available at: https://datatracker.ietf.org/doc/rfc7519/ (Accessed: 27 August 2026).

Joi (n.d.) *API documentation*. Available at: https://joi.dev/api/18.x.x (Accessed: 27 August 2026).

MDN Web Docs (n.d.) *Transport Layer Security (TLS)*. Available at: https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Transport_Layer_Security (Accessed: 27 August 2026).

MongoDB (n.d.) *Security*. Available at: https://www.mongodb.com/docs/v8.0/security/ (Accessed: 27 August 2026).

Node.js (n.d.) *About Node.js*. Available at: https://nodejs.org/en/about (Accessed: 27 August 2026).

OWASP Foundation (n.d.) *Password Storage Cheat Sheet*. Available at: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html (Accessed: 27 August 2026).

Postman (n.d.) *API testing*. Available at: https://www.postman.com/api-platform/api-testing/ (Accessed: 27 August 2026).

React (n.d.) *React documentation*. Available at: https://react.dev/ (Accessed: 27 August 2026).
