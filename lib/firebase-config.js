// Firebase configuration
// Note: In production, these should be environment variables
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "demo.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "demo-app-id",
}

// User roles
export const USER_ROLES = {
  ADMIN: "admin",
  INSTITUTION: "institution",
  STUDENT: "student",
  COMPANY: "company",
}

// Firestore collections
export const COLLECTIONS = {
  USERS: "users",
  INSTITUTIONS: "institutions",
  COURSES: "courses",
  APPLICATIONS: "applications",
  JOBS: "jobs",
  ASSESSMENTS: "assessments",
  CAREER_PATHS: "careerPaths",
}
