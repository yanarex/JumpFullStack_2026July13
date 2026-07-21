# Jump Banking API

A secure RESTful banking API built with Spring Boot and MongoDB. The API supports customer account management, administrator controls, JWT authentication, and banking transactions.

## Features

### Authentication

- JWT Authentication
- BCrypt password encryption
- Stateless sessions
- Role-based authorization
- Secure login

### Customer Features

- Register new customers
- Login
- Deposit funds
- Withdraw funds
- Transfer between accounts
- View account information
- Transaction history

### Administrator Features

- View all customers
- Create administrators
- Create customers
- Delete customers
- Send announcements
- View contact messages

### Security

- Spring Security
- JWT Authorization Filter
- Authentication Provider
- BCrypt password hashing
- Protected API endpoints

## Technologies

- Java 21
- Spring Boot
- Spring Security
- Spring Data MongoDB
- MongoDB Atlas
- JWT
- Maven
- REST API

## API Endpoints

### Authentication

```
POST /api/auth/login
POST /api/customers
```

### Customer

```
GET /api/customers/{username}
POST /api/customers/deposit
POST /api/customers/withdraw
POST /api/customers/transfer
```

### Admin

```
GET /api/admin/customers
POST /api/admin/customers
DELETE /api/admin/customers/{id}
```

## Project Structure

```
src
├── controller
├── security
├── repository
├── service
├── model
├── dto
└── config
```

## Running

```
mvn spring-boot:run
```

or

```
mvn clean package
java -jar bankapi.jar
```

## Environment Variables

```
SPRING_DATA_MONGODB_URI=<MongoDB Atlas URI>

JWT_SECRET=<32+ character secret>
```

## Deployment

The application has been deployed using:

- AWS EC2
- Nginx Reverse Proxy
- Ubuntu
- MongoDB Atlas

## Future Improvements

- Docker support
- HTTPS
- AWS Load Balancer
- Password reset
- Email verification

## Author

Tony Arrington
