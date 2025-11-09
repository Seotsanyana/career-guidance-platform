"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import FirebaseAuth from "./firebase-auth"
import { LESOTHO_DATA } from "./firebase-config"
import { getInstitutionByEmail } from "./institutions-data"
import { getCompanyByEmail } from "./companies-data"

const AuthContext = createContext({})

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        // Check for existing authentication on app load
        const checkAuth = async () => {
            try {
                const currentUser = await FirebaseAuth.getCurrentUser()
                setUser(currentUser)
            } catch (error) {
                console.error('Auth check failed:', error)
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        checkAuth()
    }, [])

    const login = async (email, password, userType) => {
        try {
            setLoading(true)

            let userData;

            // Check predefined credentials first for institutions and companies
            if (userType === 'institution') {
                const institution = getInstitutionByEmail(email)
                if (institution && institution.password === password) {
                    // Create mock user data for institution
                    userData = {
                        id: institution.id,
                        email: institution.email,
                        role: 'institution',
                        name: institution.name,
                        emailVerified: true,
                        institutionData: institution,
                        lastLogin: new Date(),
                        loginCount: 1
                    }
                    setUser(userData)
                    return userData
                } else {
                    // Invalid institution credentials
                    throw new Error('Invalid institution credentials. Please check your email and password.')
                }
            } else if (userType === 'company') {
                const company = getCompanyByEmail(email)
                if (company && company.password === password) {
                    // Create mock user data for company
                    userData = {
                        id: company.id,
                        email: company.email,
                        role: 'company',
                        name: company.name,
                        emailVerified: true,
                        companyData: company,
                        lastLogin: new Date(),
                        loginCount: 1
                    }
                    setUser(userData)
                    return userData
                } else {
                    // Invalid company credentials
                    throw new Error('Invalid company credentials. Please check your email and password.')
                }
            }

            // For students, graduates, and admin, use Firebase auth
            userData = await FirebaseAuth.signIn(email, password, userType)

            // Update login tracking data for Firebase users
            await FirebaseAuth.updateProfile(userData.id, {
                lastLogin: new Date(),
                loginCount: (userData.loginCount || 0) + 1
            })

            setUser(userData)
            return userData
        } catch (error) {
            throw error
        } finally {
            setLoading(false)
        }
    }

    const signup = async (email, password, name, userType, additionalData = {}) => {
        try {
            setLoading(true)

            // Allow any email for signup on public platform

            // Prepare user data based on role
            let userData = {
                role: userType,
                name,
                phone: additionalData.phone || '',
                createdAt: new Date(),
                lastLogin: new Date(),
                loginCount: 0
            }

            // Add role-specific data
            if (userType === 'institution') {
                userData.institutionData = {
                    email: email,
                    name: name,
                    type: 'Institution',
                    location: 'Lesotho',
                    description: 'Educational institution registered on the platform'
                }
            } else if (userType === 'company') {
                userData.companyData = {
                    email: email,
                    name: name,
                    industry: 'General',
                    location: 'Lesotho',
                    size: '1-10 employees',
                    description: 'Company registered on the platform'
                }
            } else if (userType === 'student') {
                userData.lgcseResults = additionalData.lgcseResults || []
                userData.gpa = additionalData.gpa || 0
                userData.qualificationLevel = additionalData.qualificationLevel || ''
                userData.field = additionalData.field || ''
                userData.institution = additionalData.institution || ''
            }

            const result = await FirebaseAuth.signUp(email, password, userData)

            // No verification needed for public platform
            setUser(result.user)
            return result.user
        } catch (error) {
            throw error
        } finally {
            setLoading(false)
        }
    }

    const logout = async () => {
        try {
            await FirebaseAuth.signOut()
            setUser(null)
            router.push("/login")
        } catch (error) {
            console.error('Logout failed:', error)
            // Force logout on client side
            setUser(null)
            router.push("/login")
        }
    }

    const updateProfile = async (updates) => {
        try {
            if (!user) throw new Error('No user logged in')

            await FirebaseAuth.updateProfile(user.id, updates)

            // Update local state
            setUser(prev => ({
                ...prev,
                ...updates
            }))

            return true
        } catch (error) {
            throw error
        }
    }

    const resendVerificationEmail = async () => {
        try {
            await FirebaseAuth.resendVerificationEmail()
            return true
        } catch (error) {
            throw error
        }
    }

    const value = {
        user,
        loading,
        login,
        signup,
        logout,
        updateProfile,
        resendVerificationEmail
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
