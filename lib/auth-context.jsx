"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { LESOTHO_INSTITUTIONS, getInstitutionByEmail } from "./institutions-data"

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
        // Demo login - in production, this would call Firebase Auth
        if (userType === "institution") {
            // Check if it's a valid institution login
            const institution = getInstitutionByEmail(email)
            if (institution && institution.password === password) {
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
            } else {
                throw new Error("Invalid institution credentials")
            }
        } else {
            // Regular user login
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
    }

    const signup = async (email, password, name, userType) => {
        // Demo signup - in production, this would call Firebase Auth
        const mockUser = {
            id: Math.random().toString(36).substr(2, 9),
            email,
            name,
            role: userType,
        }

        setUser(mockUser)
        localStorage.setItem("user", JSON.stringify(mockUser))

        return mockUser
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem("user")
        router.push("/login")
    }

    return <AuthContext.Provider value={{ user, loading, login, signup, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
