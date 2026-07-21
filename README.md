# Jump Banking Frontend

A modern React frontend for the Jump Banking System. The application communicates with the Spring Boot backend using REST APIs secured with JWT authentication.

## Features

### Authentication

- Login
- Logout
- Account Creation
- Password visibility toggle
- JWT storage
- Automatic authorization headers

### Customer Features

- Account Overview
- Deposit
- Withdraw
- Transfer Between Accounts
- Send Money
- Transaction History
- Contact Administrator

### Administrator Features

- Dashboard
- Customer Management
- Create Customers
- Create Administrators
- Delete Customers
- View Contact Messages

### User Experience

- Responsive design
- React Router navigation
- Protected routes
- Loading indicators
- Error handling
- Form validation

## Technologies

- React
- Vite
- React Router
- Axios
- CSS
- JavaScript

## Folder Structure

```
src
├── components
├── pages
├── services
├── context
├── assets
└── App.jsx
```

## Running Locally

Install dependencies

```
npm install
```

Start development server

```
npm run dev
```

Build production version

```
npm run build
```

Preview production build

```
npm run preview
```

## Backend

The frontend communicates with the Spring Boot backend using

```
/api/*
```

Endpoints protected by JWT automatically include the authorization token after login.

## Deployment

The frontend is deployed using

- AWS EC2
- Nginx
- Vite Production Build

## Future Improvements

- Dark mode
- Mobile app
- Live notifications
- Two-factor authentication
- Profile customization

## Screenshots

(Add screenshots here)

## Author

Tony Arrington
