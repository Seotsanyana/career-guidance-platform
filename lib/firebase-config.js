// Firebase configuration
// Note: In production, these should be environment variables
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

export const firebaseConfig = {
  apiKey: "AIzaSyAe2HsM_7O5K6rwwcS2kJ1t-TarHwG6EO8",
  authDomain: "studio-739867195-29436.firebaseapp.com",
  projectId: "studio-739867195-29436",
  storageBucket: "studio-739867195-29436.firebasestorage.app",
  messagingSenderId: "27840457217",
  appId: "1:27840457217:web:3f5333f174ae8ee740ee00"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
export { app }
export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)

// User roles
export const USER_ROLES = {
  ADMIN: "admin",
  INSTITUTION: "institution",
  STUDENT: "student",
  GRADUATE: "graduate",
  COMPANY: "company",
}

// Firestore collections
export const COLLECTIONS = {
  USERS: "users",
  INSTITUTIONS: "institutions",
  FACULTIES: "faculties",
  COURSES: "courses",
  APPLICATIONS: "applications",
  ADMISSIONS: "admissions",
  JOBS: "jobs",
  JOB_APPLICATIONS: "job_applications",
  COMPANIES: "companies",
  NOTIFICATIONS: "notifications",
  DOCUMENTS: "documents",
  ANALYTICS: "analytics",
}

// Lesotho-specific data
export const LESOTHO_DATA = {
  INSTITUTIONS: [
    {
      id: "nul",
      name: "National University of Lesotho",
      location: "Roma",
      type: "Public University",
      website: "https://www.nul.ls",
      email: "info@nul.ls",
      established: 1945,
      description: "The National University of Lesotho is the main and oldest institution of higher learning in Lesotho.",
      faculties: ["Faculty of Science and Technology", "Faculty of Humanities", "Faculty of Social Sciences", "Faculty of Education", "Faculty of Law", "Faculty of Health Sciences"]
    },
    {
      id: "limkokwing",
      name: "Limkokwing University of Creative Technology",
      location: "Maseru",
      type: "Private University",
      website: "https://www.limkokwing.net",
      email: "info@limkokwing.net.ls",
      established: 2008,
      description: "A creative technology university offering innovative programs in design, technology, and business.",
      faculties: ["Faculty of Technology", "Faculty of Design", "Faculty of Business", "Faculty of Communication"]
    },
    {
      id: "lce",
      name: "Lesotho College of Education",
      location: "Maseru",
      type: "Public College",
      website: "https://www.lce.ac.ls",
      email: "info@lce.ac.ls",
      established: 1975,
      description: "Specialized in teacher education and training for Lesotho's education sector.",
      faculties: ["Faculty of Education", "Faculty of Humanities"]
    },
    {
      id: "lerotholi",
      name: "Lerotholi Polytechnic",
      location: "Maseru",
      type: "Public Polytechnic",
      website: "https://www.lerotholi.ac.ls",
      email: "info@lerotholi.ac.ls",
      established: 1905,
      description: "Technical and vocational education provider offering diploma and certificate programs.",
      faculties: ["Faculty of Engineering", "Faculty of Business", "Faculty of Applied Sciences"]
    },
    {
      id: "idm",
      name: "Institute of Development Management",
      location: "Maseru",
      type: "Management Institute",
      website: "https://www.idm.ls",
      email: "info@idm.ls",
      established: 1974,
      description: "Regional center for development management education in Southern Africa.",
      faculties: ["Faculty of Public Administration", "Faculty of Business Management", "Faculty of Development Studies"]
    }
  ],
  COMPANIES: [
    {
      id: "vodacom",
      name: "Vodacom Lesotho",
      location: "Maseru",
      industry: "Telecommunications",
      website: "https://www.vodacom.co.ls",
      email: "info@vodacom.co.ls",
      size: "201-500 employees",
      description: "Leading telecommunications provider in Lesotho."
    },
    {
      id: "nedbank",
      name: "Nedbank Lesotho",
      location: "Maseru",
      industry: "Banking & Finance",
      website: "https://www.nedbank.co.ls",
      email: "info@nedbank.co.ls",
      size: "101-200 employees",
      description: "Commercial banking services in Lesotho."
    },
    {
      id: "lesotho_electricity",
      name: "Lesotho Electricity Company",
      location: "Maseru",
      industry: "Utilities",
      website: "https://www.lec.co.ls",
      email: "info@lec.co.ls",
      size: "501-1000 employees",
      description: "Electricity generation, transmission and distribution in Lesotho."
    },
    {
      id: "mtn",
      name: "MTN Lesotho",
      location: "Maseru",
      industry: "Telecommunications",
      website: "https://www.mtn.co.ls",
      email: "info@mtn.co.ls",
      size: "201-500 employees",
      description: "Mobile telecommunications and digital services."
    },
    {
      id: "standard_lesotho",
      name: "Standard Lesotho Bank",
      location: "Maseru",
      industry: "Banking & Finance",
      website: "https://www.standardlesothobank.co.ls",
      email: "info@standardlesothobank.co.ls",
      size: "101-200 employees",
      description: "Commercial and retail banking services."
    }
  ]
}
