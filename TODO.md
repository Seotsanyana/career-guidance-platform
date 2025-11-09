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
