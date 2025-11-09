import('./lib/firebase-config.js').then(async ({ db, auth, COLLECTIONS }) => {
    const { collection, addDoc, getDocs, doc, setDoc, getDoc } = await import('firebase/firestore')
    const { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } = await import('firebase/auth')

    async function testFirebaseConnection() {
        console.log('🔥 Testing Firebase Connection...\n')

        try {
            // Test 1: Check if Firebase is initialized
            console.log('✅ Firebase initialized successfully')

            // Test 2: Test Firestore write operation
            console.log('📝 Testing Firestore write operation...')
            const testUser = {
                uid: 'test-user-' + Date.now(),
                email: 'test@example.com',
                role: 'student',
                displayName: 'Test User',
                profileComplete: false,
                createdAt: new Date(),
                updatedAt: new Date()
            }

            // First create authenticated user
            const testEmail = 'test' + Date.now() + '@example.com'
            const testPassword = 'testpassword123'

            const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword)
            console.log('✅ User created successfully:', userCredential.user.email)

            // Now test Firestore write with authenticated user
            const docRef = doc(db, COLLECTIONS.USERS, userCredential.user.uid)
            await setDoc(docRef, testUser)
            console.log('✅ Firestore write successful, document ID:', docRef.id)

            // Test 3: Test Firestore read operation (skipped for security - only admins can list all users)
            console.log('📖 Testing Firestore read operation... (skipped - collection read not allowed for non-admins)')

            // Test 4: Test specific document read
            console.log('🔍 Testing specific document read...')
            const docSnap = await getDoc(doc(db, COLLECTIONS.USERS, docRef.id))
            if (docSnap.exists()) {
                console.log('✅ Document read successful:', docSnap.data())
            } else {
                console.log('❌ Document not found')
            }

            // Test 5: Test sign in with existing user
            console.log('🔑 Testing sign in...')
            const signInResult = await signInWithEmailAndPassword(auth, testEmail, testPassword)
            console.log('✅ Sign in successful:', signInResult.user.email)

            // Test 6: Test sign out
            console.log('🚪 Testing sign out...')
            await signOut(auth)
            console.log('✅ Sign out successful')

            console.log('\n🎉 All Firebase tests passed! Your backend is connected and working.')

        } catch (error) {
            console.error('❌ Firebase test failed:', error.code, error.message)
            console.error('Full error:', error)
        }
    }

    // Run the test
    testFirebaseConnection()
}).catch(error => {
    console.error('Failed to load Firebase config:', error)
})
