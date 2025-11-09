import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendEmailVerification,
    onAuthStateChanged,
    updateProfile
} from 'firebase/auth'
import {
    doc,
    setDoc,
    getDoc,
    updateDoc,
    collection,
    query,
    where,
    getDocs
} from 'firebase/firestore'
import { auth, db, COLLECTIONS, USER_ROLES } from './firebase-config'

export class FirebaseAuth {
    // Sign up without email verification for public platform
    static async signUp(email, password, userData) {
        try {
            // Validate email domain before creating account
            this.validateEmailDomain(email, userData.role)

            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            const user = userCredential.user

            // Skip email verification for public platform - users can login immediately

            // Create user profile in Firestore with permanent storage
            const userProfile = {
                uid: user.uid,
                email: user.email,
                role: userData.role,
                name: userData.name,
                phone: userData.phone || '',
                createdAt: new Date(),
                lastLogin: userData.lastLogin || new Date(),
                loginCount: userData.loginCount || 0,
                emailVerified: true, // Mark as verified for immediate access
                profileComplete: false,
                // Ensure all user data is permanently stored
                ...userData
            }

            await setDoc(doc(db, COLLECTIONS.USERS, user.uid), userProfile)

            return {
                user: {
                    id: user.uid,
                    email: user.email,
                    role: userData.role,
                    name: userData.name,
                    emailVerified: true, // Allow immediate login
                    ...userData
                },
                needsVerification: false // No verification needed
            }
        } catch (error) {
            throw new Error(this.getErrorMessage(error.code))
        }
    }

    // Sign in - allow any email to login, create account if not exists
    // This is used for students, graduates, and admin only
    static async signIn(email, password, userType) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            const user = userCredential.user

            // Get user profile from Firestore
            const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, user.uid))

            if (!userDoc.exists()) {
                // Create default profile
                const userData = {
                    uid: user.uid,
                    email: user.email,
                    role: userType,
                    name: user.email.split('@')[0], // default name from email
                    phone: '',
                    createdAt: new Date(),
                    lastLogin: new Date(),
                    loginCount: 1,
                    emailVerified: true,
                    profileComplete: false,
                }
                await setDoc(doc(db, COLLECTIONS.USERS, user.uid), userData)
                return {
                    id: user.uid,
                    email: user.email,
                    role: userType,
                    name: userData.name,
                    emailVerified: true,
                    ...userData
                }
            } else {
                const userData = userDoc.data()
                return {
                    id: user.uid,
                    email: user.email,
                    role: userData.role,
                    name: userData.name,
                    emailVerified: user.emailVerified,
                    ...userData
                }
            }
        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                // Create the account on the fly for students/graduates/admin
                try {
                    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
                    const user = userCredential.user

                    // Create user profile
                    const userData = {
                        uid: user.uid,
                        email: user.email,
                        role: userType,
                        name: user.email.split('@')[0],
                        phone: '',
                        createdAt: new Date(),
                        lastLogin: new Date(),
                        loginCount: 1,
                        emailVerified: true,
                        profileComplete: false,
                    }
                    await setDoc(doc(db, COLLECTIONS.USERS, user.uid), userData)
                    return {
                        id: user.uid,
                        email: user.email,
                        role: userType,
                        name: userData.name,
                        emailVerified: true,
                        ...userData
                    }
                } catch (createError) {
                    throw new Error(this.getErrorMessage(createError.code))
                }
            } else {
                throw new Error(this.getErrorMessage(error.code))
            }
        }
    }

    // Sign out
    static async signOut() {
        try {
            await signOut(auth)
        } catch (error) {
            throw new Error('Failed to sign out')
        }
    }

    // Get current user
    static async getCurrentUser() {
        return new Promise((resolve) => {
            const unsubscribe = onAuthStateChanged(auth, async (user) => {
                unsubscribe()
                if (user) {
                    try {
                        const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, user.uid))
                        if (userDoc.exists()) {
                            const userData = userDoc.data()
                            resolve({
                                id: user.uid,
                                email: user.email,
                                role: userData.role,
                                name: userData.name,
                                emailVerified: user.emailVerified,
                                ...userData
                            })
                        } else {
                            resolve(null)
                        }
                    } catch (error) {
                        resolve(null)
                    }
                } else {
                    resolve(null)
                }
            })
        })
    }

    // Update user profile
    static async updateProfile(uid, updates) {
        try {
            await updateDoc(doc(db, COLLECTIONS.USERS, uid), {
                ...updates,
                updatedAt: new Date()
            })
        } catch (error) {
            throw new Error('Failed to update profile')
        }
    }

    // Check if email exists
    static async checkEmailExists(email) {
        try {
            const q = query(
                collection(db, COLLECTIONS.USERS),
                where('email', '==', email)
            )
            const querySnapshot = await getDocs(q)
            return !querySnapshot.empty
        } catch (error) {
            return false
        }
    }

    // Resend verification email
    static async resendVerificationEmail() {
        try {
            const user = auth.currentUser
            if (user) {
                await sendEmailVerification(user)
            } else {
                throw new Error('No user logged in')
            }
        } catch (error) {
            throw new Error('Failed to resend verification email')
        }
    }

    // Email domain validation - Allow all emails for public platform
    static validateEmailDomain(email, userType) {
        // Allow any email domain for all users (public platform)
        // No restrictions for better user experience
    }

    // Error message helper
    static getErrorMessage(code) {
        switch (code) {
            case 'auth/email-already-in-use':
                return 'This email is already registered. Please use a different email or try logging in.'
            case 'auth/weak-password':
                return 'Password must be at least 6 characters long and contain a mix of letters and numbers.'
            case 'auth/invalid-email':
                return 'Please enter a valid email address.'
            case 'auth/user-not-found':
                return 'No account found with this email address. Please check your email or sign up.'
            case 'auth/wrong-password':
                return 'Incorrect password. Please try again or reset your password.'
            case 'auth/user-disabled':
                return 'This account has been disabled. Please contact support.'
            case 'auth/too-many-requests':
                return 'Too many failed login attempts. Please wait a few minutes before trying again.'
            case 'auth/network-request-failed':
                return 'Network error. Please check your internet connection and try again.'
            case 'auth/requires-recent-login':
                return 'Please log in again to perform this action.'
            case 'auth/email-not-verified':
                return 'Please verify your email address before logging in.'
            case 'auth/invalid-credential':
                return 'Invalid login credentials. Please check your email and password.'
            case 'auth/operation-not-allowed':
                return 'This authentication method is not enabled. Please contact support.'
            case 'auth/account-exists-with-different-credential':
                return 'An account already exists with this email using a different sign-in method.'
            default:
                return `Authentication error: ${code}. Please try again or contact support if the problem persists.`
        }
    }
}

export default FirebaseAuth
