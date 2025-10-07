# Demo Credentials for Canvas Portal

## Login Credentials

You can use any of these demo credentials to test the login functionality:

### Pre-configured Demo Accounts:
- **Username**: `admin` | **Password**: `admin123`
- **Username**: `carrier1` | **Password**: `password`  
- **Username**: `demo` | **Password**: `demo`

### Open Access:
- **Any username and password combination** will also work for testing purposes

## Registration

- The registration form accepts any valid information
- After registration, you'll be automatically logged in and redirected to the dashboard

## Current Authentication Status

🔓 **Demo Mode**: No real authentication is implemented
- Any credentials will work for login
- Registration creates a local session only
- Data is stored in browser's localStorage
- No backend validation or security

## For Production Use

To implement real authentication, you would need to:
1. Set up a backend API (Node.js, Python, etc.)
2. Implement proper password hashing
3. Add JWT tokens or session management
4. Connect to a database
5. Add proper validation and security measures

## Quick Test

1. Go to the login page
2. Use `demo` / `demo` or any credentials
3. You'll be redirected to the dashboard
4. User info is stored locally and persists until logout