// Admissions management utilities for institutions
import { LESOTHO_INSTITUTIONS, getInstitutionById } from './institutions-data'

// In a real app, this would be stored in a database
let admissions = []

// Initialize with some default admissions for existing institutions
const initializeDefaultAdmissions = () => {
    LESOTHO_INSTITUTIONS.forEach(institution => {
        if (institution.courses && institution.courses.length > 0) {
            // Create a general admission for undergraduate programs
            const undergraduateCourses = institution.courses.filter(c => c.level === 'degree')
            if (undergraduateCourses.length > 0) {
                admissions.push({
                    id: `${institution.id}_undergraduate_2024`,
                    institutionId: institution.id,
                    title: `2024 Undergraduate Admissions - ${institution.name}`,
                    type: 'undergraduate',
                    description: `Applications for undergraduate programs at ${institution.name} for the 2024 academic year.`,
                    requirements: [
                        'LGCSE Certificate with minimum C average',
                        'Birth Certificate',
                        'National ID copy',
                        'Recent passport-sized photos',
                        'Medical Certificate'
                    ],
                    courses: undergraduateCourses.map(c => c.name),
                    deadline: '2024-08-31',
                    status: 'published',
                    applicationsCount: Math.floor(Math.random() * 200) + 50,
                    publishedDate: '2024-01-15',
                    createdAt: '2024-01-15T00:00:00.000Z',
                    updatedAt: '2024-01-15T00:00:00.000Z'
                })
            }

            // Create admission for postgraduate programs if they exist
            const postgraduateCourses = institution.courses.filter(c => c.level === 'degree' && (c.name.toLowerCase().includes('master') || c.name.toLowerCase().includes('phd') || c.name.toLowerCase().includes('postgraduate')))
            if (postgraduateCourses.length > 0) {
                admissions.push({
                    id: `${institution.id}_postgraduate_2024`,
                    institutionId: institution.id,
                    title: `2024 Postgraduate Programs - ${institution.name}`,
                    type: 'postgraduate',
                    description: `Masters and PhD programs at ${institution.name} for the 2024 academic year.`,
                    requirements: [
                        'Bachelor\'s degree with minimum 2.2 GPA',
                        'Academic transcripts',
                        'Research proposal (for PhD)',
                        'Two academic references',
                        'CV and cover letter'
                    ],
                    courses: postgraduateCourses.map(c => c.name),
                    deadline: '2024-09-15',
                    status: 'published',
                    applicationsCount: Math.floor(Math.random() * 50) + 10,
                    publishedDate: '2024-02-01',
                    createdAt: '2024-02-01T00:00:00.000Z',
                    updatedAt: '2024-02-01T00:00:00.000Z'
                })
            }
        }
    })
}

// Initialize default admissions
initializeDefaultAdmissions()

export const createAdmission = (admissionData) => {
    const admission = {
        id: `admission_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...admissionData,
        applicationsCount: 0,
        status: 'draft',
        publishedDate: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
    admissions.push(admission)
    return admission
}

export const getAdmissionsByInstitution = (institutionId) => {
    return admissions.filter(admission => admission.institutionId === institutionId)
}

export const getAdmissionById = (admissionId) => {
    return admissions.find(admission => admission.id === admissionId)
}

export const updateAdmission = (admissionId, updates) => {
    const admissionIndex = admissions.findIndex(a => a.id === admissionId)
    if (admissionIndex !== -1) {
        admissions[admissionIndex] = {
            ...admissions[admissionIndex],
            ...updates,
            updatedAt: new Date().toISOString()
        }
        return admissions[admissionIndex]
    }
    return null
}

export const deleteAdmission = (admissionId) => {
    const admissionIndex = admissions.findIndex(a => a.id === admissionId)
    if (admissionIndex !== -1) {
        const deletedAdmission = admissions.splice(admissionIndex, 1)[0]
        return deletedAdmission
    }
    return null
}

export const publishAdmission = (admissionId) => {
    return updateAdmission(admissionId, {
        status: 'published',
        publishedDate: new Date().toISOString().split('T')[0]
    })
}

export const unpublishAdmission = (admissionId) => {
    return updateAdmission(admissionId, {
        status: 'draft',
        publishedDate: null
    })
}

export const closeAdmission = (admissionId) => {
    return updateAdmission(admissionId, {
        status: 'closed'
    })
}

export const incrementApplicationCount = (admissionId) => {
    const admission = getAdmissionById(admissionId)
    if (admission) {
        return updateAdmission(admissionId, {
            applicationsCount: admission.applicationsCount + 1
        })
    }
    return null
}

export const getPublishedAdmissions = (institutionId) => {
    return getAdmissionsByInstitution(institutionId).filter(admission => admission.status === 'published')
}

export const getActiveAdmissions = (institutionId) => {
    const now = new Date()
    return getAdmissionsByInstitution(institutionId).filter(admission => {
        if (admission.status !== 'published') return false
        const deadline = new Date(admission.deadline)
        return deadline > now
    })
}

export const getExpiredAdmissions = (institutionId) => {
    const now = new Date()
    return getAdmissionsByInstitution(institutionId).filter(admission => {
        const deadline = new Date(admission.deadline)
        return deadline < now
    })
}

export const getAllAdmissions = () => {
    return admissions
}

export const searchAdmissions = (institutionId, query) => {
    const institutionAdmissions = getAdmissionsByInstitution(institutionId)
    return institutionAdmissions.filter(admission =>
        admission.title.toLowerCase().includes(query.toLowerCase()) ||
        admission.description.toLowerCase().includes(query.toLowerCase()) ||
        admission.type.toLowerCase().includes(query.toLowerCase())
    )
}
