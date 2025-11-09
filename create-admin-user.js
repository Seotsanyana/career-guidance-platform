import('./lib/firebase-config.js').then(async ({ db, auth, COLLECTIONS }) => {
    const { createUserWithEmailAndPassword } = await import('firebase/auth')
    const { doc, setDoc } = await import('firebase/firestore')

    async function createAdminUser() {
        console.log('🔧 Creating admin user...\n')

        try {
            const adminEmail = 'monyauseotsanyana7@gmail.com'
            const adminPassword = 'monyau'

            console.log('📧 Creating admin user with email:', adminEmail)

            // Create user in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword)
            const user = userCredential.user

            console.log('✅ Admin user created in Firebase Auth:', user.email)

            // Create admin profile in Firestore
            const adminProfile = {
                uid: user.uid,
                email: user.email,
                role: 'admin',
                name: 'Admin User',
                phone: '',
                createdAt: new Date(),
                lastLogin: new Date(),
                loginCount: 0,
                emailVerified: true,
                profileComplete: true,
                // Admin-specific data
                adminData: {
                    email: adminEmail,
                    name: 'Admin User',
                    role: 'Administrator',
                    permissions: ['all']
                }
            }

            await setDoc(doc(db, COLLECTIONS.USERS, user.uid), adminProfile)

            console.log('✅ Admin profile created in Firestore')
            console.log('\n🎉 Admin user created successfully!')
            console.log('Email:', adminEmail)
            console.log('Password:', adminPassword)

        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                console.log('ℹ️ Admin user already exists')
            } else {
                console.error('❌ Failed to create admin user:', error.code, error.message)
                console.error('Full error:', error)
            }
        }
    }

    // Run the function
    createAdminUser()
}).catch(error => {
    console.error('Failed to load Firebase config:', error)
})
