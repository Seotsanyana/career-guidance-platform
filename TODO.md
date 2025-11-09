# Fix Login Authentication Issue

## Problem

- Only admin can login successfully
- Students, Company, and Institution users get "invalid credentials" error
- System uses Firebase auth for all users but predefined credentials exist in JSON files

## Solution

Modify authentication to use predefined credentials for institutions/companies, Firebase for students/admin

## Tasks

- [x] Update auth-context-updated.jsx to check JSON credentials first for institutions/companies
- [x] Modify firebase-auth.js to handle mixed authentication approach
- [x] Ensure admin login works with specific email (<monyauseotsanyana7@gmail.com>)
- [x] Test login functionality for all user types
- [x] Update login page to handle different auth flows

## Files Modified

- lib/auth-context-updated.jsx: Added imports for JSON data and modified login function to check predefined credentials first
- lib/firebase-auth.js: Added comment clarifying Firebase is used for students/graduates/admin only

## Testing

- Test institution login with predefined credentials
- Test company login with predefined credentials
- Test student signup/login via Firebase
- Test admin login with specific email

# Deployment Setup

## Firebase Deployment

### Prerequisites

- Firebase project set up
- Firebase CLI installed

### Steps

1. Go to GitHub repository settings > Secrets and variables > Actions
2. Add secret: `FIREBASE_SERVICE_ACCOUNT` with the JSON content of your Firebase service account key
3. The workflow will automatically deploy on push to master

## Render Deployment

### Prerequisites

- Render account
- Create a new Web Service in Render connected to your GitHub repo
- Set build command: `npm run build`
- Set start command: `npm start`

### Steps

1. In Render dashboard, get your service ID
2. Go to Render account settings > API Keys, generate an API key
3. Go to GitHub repository settings > Secrets and variables > Actions
4. Add secrets:
   - `RENDER_SERVICE_ID`: Your Render service ID
   - `RENDER_API_KEY`: Your Render API key
5. The workflow will automatically deploy on push to master

## Notes

- Firebase will deploy the static export (no API routes)
- Render will deploy the full Next.js app with API routes
- Ensure environment variables are set in Render for Firebase config
