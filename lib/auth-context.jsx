"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { LESOTHO_INSTITUTIONS, getInstitutionByEmail } from "./institutions-data"
import { LESOTHO_COMPANIES, getCompanyByEmail } from "./companies-data"

const AuthContext = createContext({})

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        // Check for stored user session
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
            setUser(JSON.parse(storedUser))
        }
        setLoading(false)
    }, [])

    const login = async (email, password, userType) => {
        // Check if it's an institution first
        const institution = getInstitutionByEmail(email)
        if (institution && institution.password === password && userType === "institution") {
            const mockUser = {
                id: institution.id,
                email: institution.email,
                role: "institution",
                name: institution.name,
                institutionData: institution
            }
            setUser(mockUser)
            localStorage.setItem("user", JSON.stringify(mockUser))
            return mockUser
        }

        // Check if it's a company - allow access if email contains company name
        if (userType === "company") {
            // Find company by checking if email contains company name (case insensitive)
            const company = LESOTHO_COMPANIES.find(c =>
                email.toLowerCase().includes(c.name.toLowerCase().replace(/\s+/g, '').replace('lesotho', '').replace('company', '').replace('co.', '').replace('ltd', '').replace('limited', '')) ||
                email.toLowerCase().includes(c.email.split('@')[0].toLowerCase())
            )

            if (company) {
                const mockUser = {
                    id: company.id,
                    email: company.email,
                    role: "company",
                    name: company.name,
                    companyData: company
                }
                setUser(mockUser)
                localStorage.setItem("user", JSON.stringify(mockUser))
                return mockUser
            }
        }

        // For all other cases (students, graduates, admin) - allow login with any email/password combination
        const mockUser = {
            id: Math.random().toString(36).substr(2, 9),
            email,
            role: userType,
            name: email.split("@")[0],
        }

        setUser(mockUser)
        localStorage.setItem("user", JSON.stringify(mockUser))

        return mockUser
    }

    const signup = async (email, password, name, userType, additionalData = {}) => {
        // Demo signup - in production, this would call Firebase Auth
        const mockUser = {
            id: Math.random().toString(36).substr(2, 9),
            email,
            name,
            role: userType,
            ...additionalData, // Include any additional data
        }

        setUser(mockUser)
        localStorage.setItem("user", JSON.stringify(mockUser))

        return mockUser
    }

    const resendVerificationEmail = async () => {
        // Demo function - in production, this would resend verification email
        // For now, just return success
        return { success: true }
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem("user")
        router.push("/login")
    }

    return <AuthContext.Provider value={{ user, loading, login, signup, logout, resendVerificationEmail }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
