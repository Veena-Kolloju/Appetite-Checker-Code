# Canvas Portal - React Frontend

A modern, innovative React application for the Canvas Portal Rule Management System.

## Features

- **Modern Design**: Glass morphism effects, gradient backgrounds, and smooth animations
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile devices
- **Interactive Animations**: Framer Motion powered transitions and micro-interactions
- **Form Validation**: Complete form handling with validation for login and registration
- **Dashboard**: Beautiful dashboard with stats, quick actions, and recent activities
- **Routing**: React Router for seamless navigation between pages

## Tech Stack

- React 18
- React Router DOM
- Framer Motion (animations)
- Tailwind CSS (styling)
- Lucide React (icons)

## Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Project Structure

```
src/
├── components/
│   ├── FloatingShapes.js    # Background animation component
│   ├── LoginForm.js         # Login form component
│   └── RegistrationForm.js  # Registration form component
├── pages/
│   ├── AuthPage.js          # Authentication page (login/register)
│   └── Dashboard.js         # Main dashboard page
├── styles/
├── App.js                   # Main app component
├── index.js                 # Entry point
└── index.css               # Global styles

```

## Form Fields

### Login Form
- Username (required)
- Password (required)
- Remember me (checkbox)

### Registration Form
- Carrier Name (required)
- Contact Name (required)
- Contact Email (required)
- Company Website (optional)
- Username (required)
- Password (required)
- Phone Number (optional)
- Terms Agreement (required checkbox)

## Design Features

- **Glass Morphism**: Semi-transparent elements with backdrop blur
- **Gradient Backgrounds**: Beautiful color transitions
- **Floating Animations**: Animated background shapes
- **Hover Effects**: Interactive button and card animations
- **Responsive Grid**: Adaptive layouts for all screen sizes
- **Custom Icons**: Lucide React icon library
- **Smooth Transitions**: Framer Motion animations

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (one-way operation)

## Browser Support

This application supports all modern browsers including:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)