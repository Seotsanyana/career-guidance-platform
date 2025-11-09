import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    getDoc,
    getDocs,
    query,
    where,
    orderBy,
    limit,
    onSnapshot,
    Timestamp
} from 'firebase/firestore'
import { db, COLLECTIONS } from './firebase-config'

export class FirestoreService {
    // Generic CRUD operations
    static async create(collectionName, data) {
        try {
            const docRef = await addDoc(collection(db, collectionName), {
                ...data,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now()
            })
            return docRef.id
        } catch (error) {
            throw new Error(`Failed to create document: ${error.message}`)
        }
    }

    static async update(collectionName, docId, data) {
        try {
            await updateDoc(doc(db, collectionName, docId), {
                ...data,
                updatedAt: Timestamp.now()
            })
        } catch (error) {
            throw new Error(`Failed to update document: ${error.message}`)
        }
    }

    static async delete(collectionName, docId) {
        try {
            await deleteDoc(doc(db, collectionName, docId))
        } catch (error) {
            throw new Error(`Failed to delete document: ${error.message}`)
        }
    }

    static async getById(collectionName, docId) {
        try {
            const docSnap = await getDoc(doc(db, collectionName, docId))
            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() }
            } else {
                return null
            }
        } catch (error) {
            throw new Error(`Failed to get document: ${error.message}`)
        }
    }

    static async getAll(collectionName, orderByField = 'createdAt', orderDirection = 'desc') {
        try {
            const q = query(
                collection(db, collectionName),
                orderBy(orderByField, orderDirection)
            )
            const querySnapshot = await getDocs(q)
            return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        } catch (error) {
            throw new Error(`Failed to get documents: ${error.message}`)
        }
    }

    static async query(collectionName, conditions = [], orderByField = 'createdAt', orderDirection = 'desc', limitCount = null) {
        try {
            let q = collection(db, collectionName)

            // Apply where conditions
            conditions.forEach(condition => {
                q = query(q, where(condition.field, condition.operator, condition.value))
            })

            // Apply ordering
            q = query(q, orderBy(orderByField, orderDirection))

            // Apply limit if specified
            if (limitCount) {
                q = query(q, limit(limitCount))
            }

            const querySnapshot = await getDocs(q)
            return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        } catch (error) {
            throw new Error(`Failed to query documents: ${error.message}`)
        }
    }

    // Real-time listeners
    static subscribeToCollection(collectionName, callback, conditions = [], orderByField = 'createdAt', orderDirection = 'desc') {
        let q = collection(db, collectionName)

        // Apply where conditions
        conditions.forEach(condition => {
            q = query(q, where(condition.field, condition.operator, condition.value))
        })

        // Apply ordering
        q = query(q, orderBy(orderByField, orderDirection))

        return onSnapshot(q, (querySnapshot) => {
            const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            callback(data)
        }, (error) => {
            console.error(`Error listening to ${collectionName}:`, error)
        })
    }

    // Institution-specific operations
    static async createInstitution(institutionData) {
        return this.create(COLLECTIONS.INSTITUTIONS, institutionData)
    }

    static async updateInstitution(institutionId, data) {
        return this.update(COLLECTIONS.INSTITUTIONS, institutionId, data)
    }

    static async getInstitutionById(institutionId) {
        return this.getById(COLLECTIONS.INSTITUTIONS, institutionId)
    }

    static async getAllInstitutions() {
        return this.getAll(COLLECTIONS.INSTITUTIONS)
    }

    // Course-specific operations
    static async createCourse(courseData) {
        return this.create(COLLECTIONS.COURSES, courseData)
    }

    static async updateCourse(courseId, data) {
        return this.update(COLLECTIONS.COURSES, courseId, data)
    }

    static async getCoursesByInstitution(institutionId) {
        return this.query(COLLECTIONS.COURSES, [
            { field: 'institutionId', operator: '==', value: institutionId }
        ])
    }

    // Application-specific operations
    static async createApplication(applicationData) {
        return this.create(COLLECTIONS.APPLICATIONS, applicationData)
    }

    static async updateApplication(applicationId, data) {
        return this.update(COLLECTIONS.APPLICATIONS, applicationId, data)
    }

    static async getApplicationsByStudent(studentId) {
        return this.query(COLLECTIONS.APPLICATIONS, [
            { field: 'studentId', operator: '==', value: studentId }
        ])
    }

    static async getApplicationsByInstitution(institutionId) {
        return this.query(COLLECTIONS.APPLICATIONS, [
            { field: 'institutionId', operator: '==', value: institutionId }
        ])
    }

    // Job-specific operations
    static async createJob(jobData) {
        return this.create(COLLECTIONS.JOBS, jobData)
    }

    static async updateJob(jobId, data) {
        return this.update(COLLECTIONS.JOBS, jobId, data)
    }

    static async getJobsByCompany(companyId) {
        return this.query(COLLECTIONS.JOBS, [
            { field: 'companyId', operator: '==', value: companyId }
        ])
    }

    static async getAllJobs() {
        return this.getAll(COLLECTIONS.JOBS)
    }

    // Job application operations
    static async createJobApplication(applicationData) {
        return this.create(COLLECTIONS.JOB_APPLICATIONS, applicationData)
    }

    static async getJobApplicationsByJob(jobId) {
        return this.query(COLLECTIONS.JOB_APPLICATIONS, [
            { field: 'jobId', operator: '==', value: jobId }
        ])
    }

    static async getJobApplicationsByGraduate(graduateId) {
        return this.query(COLLECTIONS.JOB_APPLICATIONS, [
            { field: 'graduateId', operator: '==', value: graduateId }
        ])
    }

    // Company operations
    static async createCompany(companyData) {
        return this.create(COLLECTIONS.COMPANIES, companyData)
    }

    static async updateCompany(companyId, data) {
        return this.update(COLLECTIONS.COMPANIES, companyId, data)
    }

    static async getAllCompanies() {
        return this.getAll(COLLECTIONS.COMPANIES)
    }

    // Notification operations
    static async createNotification(notificationData) {
        return this.create(COLLECTIONS.NOTIFICATIONS, notificationData)
    }

    static async getNotificationsByUser(userId) {
        return this.query(COLLECTIONS.NOTIFICATIONS, [
            { field: 'userId', operator: '==', value: userId }
        ], 'createdAt', 'desc', 50)
    }

    static async markNotificationAsRead(notificationId) {
        return this.update(COLLECTIONS.NOTIFICATIONS, notificationId, { read: true })
    }

    // Analytics operations
    static async createAnalyticsEntry(entryData) {
        return this.create(COLLECTIONS.ANALYTICS, entryData)
    }

    static async getAnalyticsByType(type, limitCount = 100) {
        return this.query(COLLECTIONS.ANALYTICS, [
            { field: 'type', operator: '==', value: type }
        ], 'createdAt', 'desc', limitCount)
    }
}

export default FirestoreService
