<img width="1600" height="1000" alt="WhatsApp Image 2026-08-27 at 17 53 52" src="https://github.com/user-attachments/assets/4a6d18ff-6123-486b-8429-923c78d80e12" />INSY7314 
PART1
MERN System Architecture 



The application follows a three-tier MERN architecture consisting of a React frontend, a Node.js and Express.js backend, and a MongoDB database. The React frontend provides the user interface through which organisation managers and registered users interact with the system. Communication between the frontend and backend occurs through REST API requests using HTTPS. (React, n.d.; Node.js, n.d.; Express.js, n.d.; MongoDB, n.d.)
The backend forms the main application and security boundary. Node.js provides the runtime environment while Express.js handles HTTP requests and exposes the REST API endpoints. The backend contains separate routes, controllers and business logic to ensure that application responsibilities are appropriately separated. Authentication middleware is used to protect restricted resources and verify JSON Web Tokens (JWTs) supplied by authenticated users. (Node.js, n.d.; Express.js, n.d.)
Security is implemented at multiple layers. Passwords are protected using encrypt hashing before being stored in MongoDB. JWT authentication is used to maintain authenticated sessions without storing sensitive authentication information in the database session. Joi validation is used to validate incoming request data before it reaches the business logic or database layer. HTTPS/TLS protects information while it is transmitted between the client and server. Additional Express security controls such as Helmet and rate limiting can be used to reduce common web-based attacks and excessive request attempts. (OWASP Foundation, n.d.; Jones, Bradley and Sakimura, 2015; Joi, n.d.)
MongoDB provides persistent storage for users, organisations, polls and votes. The database is not accessed directly by the React client. All database operations are performed through the backend API, ensuring that authentication, authorisation and validation controls are applied before data is created, modified or retrieved. (MongoDB, n.d.)
The architecture therefore establishes a clear system boundary between the client, application server and database. This separation improves maintainability and provides a foundation for extending the system while maintaining appropriate security controls.


README 
# HustleHub+ — Secure Freelance Marketplace

## 1. System Overview

HustleHub+ is a secure freelance marketplace platform that allows freelancers to advertise their services and clients to browse, book, and pay for those services.

In addition to standard marketplace functionality, the platform records financial transactions generated through bookings. HustleHub+ also provides users with an indication of income earned and estimated tax obligations based on the financial information recorded by the system.

The application is designed with security as a primary concern because it processes sensitive information, including user credentials, booking information, financial transactions, and income-related data.

The system uses a full-stack architecture consisting of a frontend application, backend REST API, and database. The backend provides the main security boundary between users and the database.

---

## 2. Intended Users

HustleHub+ is intended for two primary categories of users.

### 2.1 Freelancers

Freelancers use the platform to advertise and manage the services they provide.

Typical functionality includes:

- Creating a freelancer account
- Creating and managing service listings
- Providing service descriptions and pricing
- Viewing bookings
- Tracking income generated from bookings
- Viewing estimated tax obligations
- Managing account information

### 2.2 Clients

Clients use HustleHub+ to find and book freelance services.

Typical functionality includes:

- Creating an account
- Logging into the platform
- Browsing available freelance services
- Viewing service information and pricing
- Booking services
- Recording transactions associated with bookings
- Viewing booking and transaction information

---

## 3. System Architecture

HustleHub+ follows a layered MERN web application architecture.

The system consists of:

- **Frontend** — provides the user interface
- **Backend** — provides REST API endpoints and business logic
- **Database** — provides persistent data storage
- **Security Layer** — protects authentication, API requests, and sensitive information

The frontend communicates with the backend through RESTful API requests. The frontend does not directly communicate with the database. (Express.js, n.d.)

The backend validates requests, authenticates users, applies authorisation rules, processes business logic, and performs database operations. (Express.js, n.d.; MongoDB, n.d.)

This architecture creates a clear separation between the presentation layer, application layer, and data layer.

### Architecture Flow

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
  +-----------------------------+
  | Security Layer              |
  |                             |
  | JWT Authentication          |
  | Authorisation               |
  | Joi Validation              |
  | bcrypt Password Hashing     |
  | Helmet Security Headers     |
  | Rate Limiting               |
  +-----------------------------+
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
________________________________________
4. Technology Stack (React, n.d.; Node.js, n.d.; MongoDB, n.d.)
HustleHub+ uses the MERN technology stack. (React, n.d.; Node.js, n.d.; MongoDB, n.d.)
Technology	Purpose
MongoDB	Database and persistent data storage
Express.js	Backend web framework and REST API
React.js	Frontend user interface
Node.js	Backend JavaScript runtime
JWT	User authentication
bcrypt	Password hashing
Joi	Input validation
HTTPS/TLS	Secure communication
________________________________________
5. Frontend Structure
The frontend is developed using React.js.
The frontend provides the user interface through which freelancers and clients interact with the system.
Frontend functionality includes:
•	User registration 
•	User login 
•	Freelancer dashboard 
•	Client dashboard 
•	Service browsing 
•	Service management 
•	Booking functionality 
•	Transaction information 
•	Income information 
•	Estimated tax information 
•	User account management 
The frontend communicates with the backend using REST API requests. (Express.js, n.d.; React, n.d.)
The frontend is not responsible for directly accessing the database. Requests containing user input or sensitive operations are sent to the backend, where they are validated and processed.
________________________________________
6. Backend Structure
The backend is developed using Node.js and Express.js.
The backend provides the REST API and contains the application's main business logic.
A typical backend structure is:
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
The exact structure may differ depending on the implementation.
________________________________________
7. Database
MongoDB is used to persist the application's data.
The database stores information required for the marketplace, including:
•	User accounts 
•	Freelancer service listings 
•	Client bookings 
•	Financial transactions 
•	Income information 
•	Estimated tax information 
The frontend does not directly access MongoDB.
All database operations are performed through the backend API. This ensures that authentication, authorisation, and validation can be applied before sensitive information is accessed or modified. (MongoDB, n.d.)
________________________________________
8. Security Decisions
Security is a fundamental part of the HustleHub+ architecture because the platform processes sensitive user and financial information.
The main security decisions include:
1.	Password hashing using bcrypt  (OWASP Foundation, n.d.)
2.	JWT authentication  (Jones, Bradley and Sakimura, 2015)
3.	Input validation  (Joi, n.d.)
4.	HTTPS/TLS communication  (MDN Web Docs, n.d.; Express.js, n.d.)
5.	Authorisation  (MongoDB, n.d.)
6.	Secure configuration through environment variables  (Express.js, n.d.)
________________________________________
8.1 Password Hashing — A
User passwords are never stored as plain text.
The system uses bcrypt to hash passwords before they are stored in the database. (OWASP Foundation, n.d.)
The registration process is:
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
During login, the password supplied by the user is compared against the stored bcrypt hash. (OWASP Foundation, n.d.)
The original password is not stored in the database.
This reduces the risk of exposing users' actual passwords if the database is compromised.
________________________________________
8.2 JWT Authentication — B (Jones, Bradley and Sakimura, 2015)
HustleHub+ uses JSON Web Tokens (JWT) to authenticate users. (Jones, Bradley and Sakimura, 2015)
After successfully logging in, the backend generates an authentication token.
The authentication process is:
User Login
    |
    v
Backend validates credentials
    |
    v
bcrypt verifies password (Jones, Bradley and Sakimura, 2015)
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
Protected endpoints require a valid JWT.
This prevents unauthenticated users from accessing restricted functionality such as managing services, viewing protected bookings, or accessing sensitive financial information.
________________________________________
8.3 Input Validation — C (Joi, n.d.)
HustleHub+ validates incoming data before it is processed by the application's business logic or stored in MongoDB.
Joi can be used to define validation schemas for requests such as:
•	User registration 
•	User login 
•	Service creation 
•	Service updates 
•	Booking creation 
•	Transaction information 
•	Other API requests 
Validation ensures that required fields are present and that submitted values follow the expected format.
For example, registration validation can check:
•	Required fields are provided 
•	Email addresses follow the expected format 
•	Passwords meet the required requirements 
•	Invalid values are rejected 
This helps prevent malformed or unexpected data from entering the application.
________________________________________
8.4 HTTPS / TLS
HustleHub+ should use HTTPS/TLS to protect communication between the frontend and backend. (MDN Web Docs, n.d.; Express.js, n.d.)
This is particularly important because the application processes sensitive information such as:
•	Login credentials 
•	Authentication tokens 
•	User information 
•	Booking information 
•	Transaction information 
•	Income-related information 
HTTPS encrypts information while it is transmitted between the client and server.
Therefore, sensitive information is not transmitted through an unencrypted HTTP connection.
________________________________________
8.5 Authorisation (MongoDB, n.d.)
Authentication determines whether a user is logged in, while authorisation determines what that authenticated user is allowed to access. (MongoDB, n.d.)
HustleHub+ applies authorisation controls to protected functionality. (MongoDB, n.d.)
For example:
•	Freelancers can manage their own services. 
•	Clients can create and manage their own bookings. 
•	Users can access information associated with their own accounts. 
•	Protected financial and income information requires appropriate authentication and authorisation. 
Authorisation checks are performed by the backend rather than relying only on frontend restrictions. (MongoDB, n.d.)
________________________________________
8.6 Additional Security Controls
Helmet
Helmet can be used with Express.js to configure HTTP security headers and reduce exposure to common web-based attacks. (Express.js, n.d.)
Rate Limiting
Rate limiting can restrict excessive requests to the API. (Express.js, n.d.)
This is particularly useful for authentication endpoints because it can reduce the effectiveness of repeated login attempts and brute-force attacks.
Environment Variables
Sensitive configuration information should be stored using environment variables rather than directly in the source code. (Express.js, n.d.)
Examples include:
MONGO_URI
JWT_SECRET
API_KEYS
A .env file should not be committed to the public repository.
It should be included in .gitignore.
________________________________________
9. Financial Transactions
HustleHub+ records financial transactions generated through service bookings.
A transaction can be associated with:
•	Client 
•	Freelancer 
•	Service 
•	Booking 
•	Amount 
•	Transaction status 
Financial information is handled through the backend rather than being directly manipulated by the frontend.
This ensures that transaction-related operations are subject to authentication, authorisation, and validation. (MongoDB, n.d.)
________________________________________
10. Income and Estimated Tax Information
The system provides users with an indication of income earned and estimated tax obligations based on the financial information recorded through bookings and transactions.
Income-related information is considered sensitive and should only be accessible to appropriately authenticated users.
The backend is responsible for processing the relevant financial information and providing the appropriate results to the frontend.
The tax information displayed by HustleHub+ should be treated as an estimate rather than professional tax advice.
________________________________________
11. API Structure
The backend exposes RESTful API endpoints for the main functionality of HustleHub+.
Example endpoint groups include:
/api/auth
/api/users
/api/services
/api/bookings
/api/transactions
/api/tax
Authentication endpoints may include:
POST /api/auth/register
POST /api/auth/login
Protected endpoints require an authentication token.
Example:
Authorization: Bearer <JWT_TOKEN>
The backend verifies the token before allowing access to protected resources.
________________________________________
12. Error Handling
The API uses HTTP status codes to communicate the result of requests.
Status Code	Meaning
200	Successful request
201	Resource successfully created
400	Invalid request or validation failure
401	Authentication required or invalid
403	User does not have permission
404	Resource not found
500	Internal server error
Appropriate error responses allow the frontend to provide meaningful feedback to users without exposing sensitive backend information.
________________________________________
13. Testing
Postman is used to test the HustleHub+ REST API. (Postman, n.d.)
The Postman collection demonstrates both successful and invalid scenarios. (Postman, n.d.)
Postman Test Evidence

Postman screenshots showing successful user registration, successful login with JWT token generation, and the API running over HTTPS are provided below as evidence of the implemented testing and security controls.

Figure 1: Successful User Registration in Postman


Figure 2: Successful Login and JWT Token Generation



Successful Scenarios
•	Successful user registration 
•	Successful login 
•	Successful JWT authentication  (Jones, Bradley and Sakimura, 2015)
•	Successful service creation 
•	Successful service retrieval 
•	Successful booking 
•	Successful transaction processing 
Invalid Scenarios
•	Registration with invalid information 
•	Registration using an existing email address 
•	Login using an incorrect password 
•	Login using a non-existent account 
•	Accessing protected endpoints without a JWT 
•	Accessing protected endpoints using an invalid JWT 
•	Submitting invalid service information 
•	Submitting invalid booking information 
These tests demonstrate that the application's authentication, validation, and authorisation controls operate as intended. (Postman, n.d.)
________________________________________
14. Security Summary
Security Decision	Implementation	Purpose
Password protection	bcrypt	Prevents plain-text passwords from being stored
Authentication	JWT	Authenticates users accessing protected resources
Input validation	Joi	Ensures API input follows expected formats
HTTPS	TLS/SSL	Encrypts data during transmission
Security headers	Helmet	Provides additional HTTP security controls
Rate limiting	Express rate limiter	Helps reduce excessive and brute-force requests
Environment variables	.env	Protects sensitive configuration and secrets
Authorisation	Backend middleware	Prevents users from accessing unauthorised resources
________________________________________
15. Security Approach
Security is incorporated throughout the HustleHub+ system rather than being added after development.
The frontend, backend, and database are separated so that users cannot directly access sensitive database information. Authentication and authorisation are applied to protected API endpoints, while input validation ensures that data is checked before being processed. (MongoDB, n.d.; Express.js, n.d.)
Passwords are protected using bcrypt hashing, authentication is implemented using JWT, and HTTPS/TLS protects data during transmission. (OWASP Foundation, n.d.; Jones, Bradley and Sakimura, 2015; MDN Web Docs, n.d.)
These controls are particularly important for HustleHub+ because the platform processes not only account information but also booking, transaction, income, and estimated tax information.
________________________________________
16. Running the Application
Backend
Navigate to the backend directory:
cd backend
Install the dependencies:
npm install
Create a .env file containing the required configuration.
Example:
PORT=5000
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
Start the development server:
npm run dev
________________________________________
Frontend
Navigate to the frontend directory:
cd frontend
Install the dependencies:
npm install
Start the React application:
npm start
The React frontend can then communicate with the Node.js/Express backend through the configured REST API. (React, n.d.; Express.js, n.d.)
________________________________________
17. Project Purpose
HustleHub+ demonstrates the development of a secure full-stack freelance marketplace that combines marketplace functionality with financial transaction recording and income-related information.
The system applies security throughout the development process, including authentication, password protection, input validation, secure communication, authorisation, API testing, and secure configuration. (OWASP Foundation, n.d.; Postman, n.d.; MongoDB, n.d.)
The project therefore provides a foundation for a functional, secure, testable, and maintainable freelance marketplace platform.



 
Reference List
Express.js (n.d.) Production best practices: security. Available at: https://expressjs.com/en/advanced/best-practice-security/ (Accessed: 27 August 2026).
Jones, M., Bradley, J. and Sakimura, N. (2015) JSON Web Token (JWT), RFC 7519. Available at: https://datatracker.ietf.org/doc/rfc7519/ (Accessed: 27 August 2026).
Joi (n.d.) API documentation. Available at: https://joi.dev/api/18.x.x (Accessed: 27 August 2026).
MDN Web Docs (n.d.) Transport Layer Security (TLS). Available at: https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Transport_Layer_Security (Accessed: 27 August 2026).
MongoDB (n.d.) Security. Available at: https://www.mongodb.com/docs/v8.0/security/ (Accessed: 27 August 2026).
Node.js (n.d.) About Node.js. Available at: https://nodejs.org/en/about (Accessed: 27 August 2026).
OWASP Foundation (n.d.) Password Storage Cheat Sheet. Available at: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html (Accessed: 27 August 2026).
Postman (n.d.) API testing. Available at: https://www.postman.com/api-platform/api-testing/ (Accessed: 27 August 2026).
React (n.d.) React documentation. Available at: https://react.dev/ (Accessed: 27 August 2026).
