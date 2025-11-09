import('./lib/firebase-config.js').then(async ({ db, auth, COLLECTIONS, USER_ROLES }) => {
    const { collection, addDoc, getDocs, doc, setDoc, getDoc, updateDoc, deleteDoc } = await import('firebase/firestore')
    const { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } = await import('firebase/auth')

    async function testFirestoreRules() {
        console.log('🔒 Testing Firestore Security Rules...\n')

        const testUsers = {
            admin: null,
            company: null,
            institution: null,
            student: null,
            graduate: null
        }

        try {
            // Create test users for each role
            console.log('👥 Creating test users for each role...')

            for (const [role, _] of Object.entries(testUsers)) {
                const email = `${role}-${Date.now()}@test.com`
                const password = 'testpassword123'

                const userCredential = await createUserWithEmailAndPassword(auth, email, password)
                const uid = userCredential.user.uid

                // Set user document with role
                await setDoc(doc(db, COLLECTIONS.USERS, uid), {
                    uid,
                    email,
                    role,
                    displayName: `${role.charAt(0).toUpperCase() + role.slice(1)} User`,
                    profileComplete: true,
                    createdAt: new Date(),
                    updatedAt: new Date()
                })

                testUsers[role] = { uid, email, password }
                console.log(`✅ Created ${role} user: ${email}`)
            }

            // Test 1: Public reads (unauthenticated)
            console.log('\n🌐 Testing public reads (unauthenticated)...')
            await signOut(auth)

            try {
                const jobsSnapshot = await getDocs(collection(db, COLLECTIONS.JOBS))
                console.log('✅ Public read jobs: OK')
            } catch (error) {
                console.log('❌ Public read jobs failed:', error.message)
            }

            try {
                const institutionsSnapshot = await getDocs(collection(db, COLLECTIONS.INSTITUTIONS))
                console.log('✅ Public read institutions: OK')
            } catch (error) {
                console.log('❌ Public read institutions failed:', error.message)
            }

            // Test 2: Authenticated user access
            console.log('\n🔐 Testing authenticated user access...')

            // Sign in as student
            const studentUser = testUsers.student
            await signInWithEmailAndPassword(auth, studentUser.email, studentUser.password)
            console.log('✅ Signed in as student')

            // Test student can create application
            try {
                const applicationData = {
                    studentId: studentUser.uid,
                    institutionId: 'test-institution-id',
                    courseId: 'test-course-id',
                    status: 'pending',
                    submittedAt: new Date()
                }
                const appRef = await addDoc(collection(db, COLLECTIONS.APPLICATIONS), applicationData)
                console.log('✅ Student can create application')
                studentUser.applicationId = appRef.id
            } catch (error) {
                console.log('❌ Student create application failed:', error.message)
            }

            // Test student can read their own application
            try {
                const appDoc = await getDoc(doc(db, COLLECTIONS.APPLICATIONS, studentUser.applicationId))
                if (appDoc.exists()) {
                    console.log('✅ Student can read their own application')
                }
            } catch (error) {
                console.log('❌ Student read own application failed:', error.message)
            }

            // Test student cannot read other applications
            try {
                // Create another application as admin first
                await signOut(auth)
                const adminUser = testUsers.admin
                await signInWithEmailAndPassword(auth, adminUser.email, adminUser.password)
                const otherAppRef = await addDoc(collection(db, COLLECTIONS.APPLICATIONS), {
                    studentId: 'other-student-id',
                    institutionId: 'test-institution-id',
                    courseId: 'test-course-id',
                    status: 'pending',
                    submittedAt: new Date()
                })
                await signOut(auth)

                // Back as student, try to read other application
                await signInWithEmailAndPassword(auth, studentUser.email, studentUser.password)
                const otherAppDoc = await getDoc(doc(db, COLLECTIONS.APPLICATIONS, otherAppRef.id))
                console.log('❌ Student should not read other applications but did')
            } catch (error) {
                console.log('✅ Student cannot read other applications:', error.message)
            }

            // Test 3: Admin access
            console.log('\n👑 Testing admin access...')
            await signOut(auth)
            const adminUser = testUsers.admin
            await signInWithEmailAndPassword(auth, adminUser.email, adminUser.password)
            console.log('✅ Signed in as admin')

            // Admin can read all users
            try {
                const usersSnapshot = await getDocs(collection(db, COLLECTIONS.USERS))
                console.log('✅ Admin can read all users')
            } catch (error) {
                console.log('❌ Admin read users failed:', error.message)
            }

            // Admin can read all applications
            try {
                const appsSnapshot = await getDocs(collection(db, COLLECTIONS.APPLICATIONS))
                console.log('✅ Admin can read all applications')
            } catch (error) {
                console.log('❌ Admin read applications failed:', error.message)
            }

            // Test 4: Company access
            console.log('\n🏢 Testing company access...')
            await signOut(auth)
            const companyUser = testUsers.company
            await signInWithEmailAndPassword(auth, companyUser.email, companyUser.password)
            console.log('✅ Signed in as company')

            // Company can create job
            try {
                const jobData = {
                    companyId: companyUser.uid,
                    title: 'Test Job',
                    description: 'Test job description',
                    requirements: ['Test requirement'],
                    location: 'Test Location',
                    salary: 'Test Salary',
                    type: 'full-time',
                    status: 'active',
                    postedAt: new Date()
                }
                const jobRef = await addDoc(collection(db, COLLECTIONS.JOBS), jobData)
                console.log('✅ Company can create job')
                companyUser.jobId = jobRef.id
            } catch (error) {
                console.log('❌ Company create job failed:', error.message)
            }

            // Company can read their own job
            try {
                const jobDoc = await getDoc(doc(db, COLLECTIONS.JOBS, companyUser.jobId))
                if (jobDoc.exists()) {
                    console.log('✅ Company can read their own job')
                }
            } catch (error) {
                console.log('❌ Company read own job failed:', error.message)
            }

            // Test 5: Institution access
            console.log('\n🏫 Testing institution access...')
            await signOut(auth)
            const institutionUser = testUsers.institution
            await signInWithEmailAndPassword(auth, institutionUser.email, institutionUser.password)
            console.log('✅ Signed in as institution')

            // Institution can create course
            try {
                const courseData = {
                    institutionId: institutionUser.uid,
                    name: 'Test Course',
                    code: 'TEST101',
                    description: 'Test course description',
                    faculty: 'Test Faculty',
                    duration: '4 years',
                    requirements: ['Test requirement'],
                    status: 'active',
                    createdAt: new Date()
                }
                const courseRef = await addDoc(collection(db, COLLECTIONS.COURSES), courseData)
                console.log('✅ Institution can create course')
                institutionUser.courseId = courseRef.id
            } catch (error) {
                console.log('❌ Institution create course failed:', error.message)
            }

            // Test 6: Graduate access
            console.log('\n🎓 Testing graduate access...')
            await signOut(auth)
            const graduateUser = testUsers.graduate
            await signInWithEmailAndPassword(auth, graduateUser.email, graduateUser.password)
            console.log('✅ Signed in as graduate')

            // Graduate can create job application
            try {
                const jobAppData = {
                    graduateId: graduateUser.uid,
                    jobId: companyUser.jobId,
                    status: 'pending',
                    appliedAt: new Date()
                }
                const jobAppRef = await addDoc(collection(db, COLLECTIONS.JOB_APPLICATIONS), jobAppData)
                console.log('✅ Graduate can create job application')
                graduateUser.jobAppId = jobAppRef.id
            } catch (error) {
                console.log('❌ Graduate create job application failed:', error.message)
            }

            // Graduate can read their own job application
            try {
                const jobAppDoc = await getDoc(doc(db, COLLECTIONS.JOB_APPLICATIONS, graduateUser.jobAppId))
                if (jobAppDoc.exists()) {
                    console.log('✅ Graduate can read their own job application')
                }
            } catch (error) {
                console.log('❌ Graduate read own job application failed:', error.message)
            }

            // Clean up: Delete test data
            console.log('\n🧹 Cleaning up test data...')
            await signOut(auth)
            const adminAgain = testUsers.admin
            await signInWithEmailAndPassword(auth, adminAgain.email, adminAgain.password)

            // Delete test documents
            const collectionsToClean = [
                COLLECTIONS.APPLICATIONS,
                COLLECTIONS.JOBS,
                COLLECTIONS.COURSES,
                COLLECTIONS.JOB_APPLICATIONS
            ]

            for (const coll of collectionsToClean) {
                const snapshot = await getDocs(collection(db, coll))
                for (const docSnap of snapshot.docs) {
                    await deleteDoc(doc(db, coll, docSnap.id))
                }
            }

            // Delete test users
            for (const [role, user] of Object.entries(testUsers)) {
                if (user) {
                    await deleteDoc(doc(db, COLLECTIONS.USERS, user.uid))
                }
            }

            console.log('✅ Cleanup completed')

            console.log('\n🎉 All Firestore Security Rules tests completed!')

        } catch (error) {
            console.error('❌ Firestore rules test failed:', error.code, error.message)
            console.error('Full error:', error)
        }
    }

    // Run the test
    testFirestoreRules()
}).catch(error => {
    console.error('Failed to load Firebase config:', error)
})
