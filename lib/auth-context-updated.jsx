"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { LESOTHO_INSTITUTIONS, getInstitutionByEmail } from "./institutions-data"
import { LESOTHO_COMPANIES, getCompanyByEmail } from "./companies-data"

// Basotho names for individuals
const basothoFirstNames = [
    "Pule", "Mpho", "Nthabiseng", "Thabo", "Lerato", "Kabelo", "Masechaba", "Relebohile",
    "Tšepiso", "Mpho", "Nthati", "Lebohang", "Mpho", "Nthabeleng", "Thato", "Mpho"
]

const basothoLastNames = [
    "Mochaki", "Mokone", "Molefi", "Mothibe", "Mphuthi", "Mokhachane", "Mokete", "Mohloboli",
    "Mokhosi", "Mokhele", "Mokhothu", "Mokhosi", "Mokhosi", "Mokhosi", "Mokhosi", "Mokhosi"
]

// Company/Institution names
const basothoCompanyNames = [
    "IT Center", "Lesotho Tech Solutions", "Maseru Business Hub", "Leribe Innovation Labs",
    "Berea Education Services", "Mafeteng Digital Academy", "Mohale's Hoek Tech Institute",
    "Quthing Skills Development", "Thaba-Tseka Training Center", "Qacha's Nek Business Solutions"
]

const generateBasothoName = () => {
    const firstName = basothoFirstNames[Math.floor(Math.random() * basothoFirstNames.length)]
    const lastName = basothoLastNames[Math.floor(Math.random() * basothoLastNames.length)]
    return `${firstName} ${lastName}`
}

const generateBasothoEmail = (name) => {
    const cleanName = name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z]/g, '')
    const randomNum = Math.floor(Math.random() * 100) + 1
    return `${cleanName}${randomNum}@gmail.com`
}

const generateCompanyName = () => {
    return basothoCompanyNames[Math.floor(Math.random() * basothoCompanyNames.length)]
}

const generateCompanyEmail = (name) => {
    const cleanName = name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z]/g, '')
    return `${cleanName}@lesotho.com`
}

const generateNameFromEmail = (email) => {
    // Extract the part before @ and convert to proper name format
    // e.g., pulemochaki1@gmail.com -> Pule Mochaki
    const emailPrefix = email.split('@')[0]
    // Remove numbers and convert to title case
    const cleanName = emailPrefix.replace(/\d+/g, '')
    // Split camelCase or add spaces before capital letters
    const formattedName = cleanName.replace(/([a-z])([A-Z])/g, '$1 $2')
    // Capitalize first letter of each word
    return formattedName.split(' ').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ')
}

const generateCompanyNameFromEmail = (email) => {
    // Extract the part before @ and convert to proper company name format
    // e.g., itcenter@lesotho.com -> IT Center
    const emailPrefix = email.split('@')[0]
    // Add spaces before capital letters and capitalize
    const formattedName = emailPrefix.replace(/([a-z])([A-Z])/g, '$1 $2')
    // Capitalize first letter of each word
    return formattedName.split(' ').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ')
}

const AuthContext = createContext({})

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        // Do not auto-login previously logged in users for security
        // const storedUser = localStorage.getItem("user")
        // if (storedUser) {
        //     setUser(JSON.parse(storedUser))
        // }
        setLoading(false)
    }, [])

    const login = async (email, password, userType) => {
        // Get stored users
        const storedUsers = JSON.parse(localStorage.getItem("registeredUsers") || "{}")

        // Always succeed for any user type, ignoring password checks
        let userData = storedUsers[email]

        if (!userData) {
            // Create new user if doesn't exist
            const userId = Math.random().toString(36).substr(2, 9)
            let generatedName = ""

            // Store the email exactly as provided and generate name from email
            if (userType === "student" || userType === "graduate") {
                // For Gmail emails, generate name from email (e.g., pulemochaki1@gmail.com -> Pule Mochaki)
                generatedName = generateNameFromEmail(email)
            } else if (userType === "company" || userType === "institution") {
                // For @lesotho.com emails, generate company name from email (e.g., itcenter@lesotho.com -> IT Center)
                generatedName = generateCompanyNameFromEmail(email)
            } else {
                generatedName = email.split("@")[0] // Use email prefix as name for admin
            }

            userData = {
                id: userId,
                email: email, // Store the exact email provided
                name: generatedName,
                role: userType,
                createdAt: new Date().toISOString()
            }
            storedUsers[email] = userData // Store using the exact email as key
            localStorage.setItem("registeredUsers", JSON.stringify(storedUsers))
        }

        if (userType === "institution") {
            const institution = getInstitutionByEmail(userData.email)
            const institutionData = institution || {
                id: userData.id,
                name: userData.name,
                email: userData.email,
                location: "Maseru",
                type: "Educational Institution",
                established: new Date().getFullYear(),
                website: `https://www.${userData.name.toLowerCase().replace(/\s+/g, '')}.edu.ls`,
                description: "Educational institution providing quality education.",
                courses: []
            }
            const user = {
                id: userData.id,
                email: userData.email,
                role: "institution",
                name: userData.name,
                institutionData: institutionData
            }
            setUser(user)
            localStorage.setItem("user", JSON.stringify(user))
            return user
        } else if (userType === "company") {
            const company = getCompanyByEmail(userData.email)
            const companyData = company || {
                id: userData.id,
                name: userData.name,
                email: userData.email,
                location: "Maseru",
                type: "Business Company",
                industry: "General Business",
                established: new Date().getFullYear(),
                website: `https://www.${userData.name.toLowerCase().replace(/\s+/g, '')}.co.ls`,
                description: "Business company providing services and solutions.",
                size: "11-50 employees",
                contact: {
                    phone: "+266 2231 0000",
                    address: "Business District, Maseru"
                }
            }
            const user = {
                id: userData.id,
                email: userData.email,
                role: "company",
                name: userData.name,
                companyData: companyData
            }
            setUser(user)
            localStorage.setItem("user", JSON.stringify(user))
            return user
        } else {
            // Regular user login (student, graduate, admin)
            const user = {
                id: userData.id,
                email: userData.email,
                role: userType,
                name: userData.name,
            }
            setUser(user)
            localStorage.setItem("user", JSON.stringify(user))
            return user
        }
    }

    const signup = async (email, password, name, userType) => {
        // Get existing users
        const storedUsers = JSON.parse(localStorage.getItem("registeredUsers") || "{}")

        // Check if user already exists
        if (storedUsers[email]) {
            throw new Error("User already exists. Please login instead.")
        }

        // Create new user
        const userId = Math.random().toString(36).substr(2, 9)
        const newUser = {
            id: userId,
            email,
            name,
            role: userType,
            password, // Store password for demo purposes
            createdAt: new Date().toISOString()
        }

        // Store user in registered users
        storedUsers[email] = newUser
        localStorage.setItem("registeredUsers", JSON.stringify(storedUsers))

        // Set current user
        setUser(newUser)
        localStorage.setItem("user", JSON.stringify(newUser))

        return newUser
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem("user")
        router.push("/login")
    }

    return <AuthContext.Provider value={{ user, loading, login, signup, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
