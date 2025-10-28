// Application management utilities
import { LESOTHO_INSTITUTIONS, getInstitutionById } from './institutions-data'

// In a real app, this would be stored in a database
let applications = []

export const submitApplication = (applicationData) => {
    const application = {
        id: Math.random().toString(36).substr(2, 9),
        ...applicationData,
        submittedAt: new Date().toISOString(),
        status: 'pending'
    }

    applications.push(application)
    return application
}

export const getApplicationsByInstitution = (institutionId) => {
    return applications.filter(app => app.institutionId === institutionId)
}

export const getAllApplications = () => {
    return applications
}

export const updateApplicationStatus = (applicationId, status) => {
    const application = applications.find(app => app.id === applicationId)
    if (application) {
        application.status = status
        application.updatedAt = new Date().toISOString()
        return application
    }
    return null
}

export const getApplicationById = (applicationId) => {
    return applications.find(app => app.id === applicationId)
}

// Helper function to get institution name from ID
export const getInstitutionName = (institutionId) => {
    const institution = getInstitutionById(institutionId)
    return institution ? institution.name : 'Unknown Institution'
}

// Helper function to get course name from institution and course data
export const getCourseName = (institutionId, courseName) => {
    const institution = getInstitutionById(institutionId)
    if (institution) {
        const course = institution.courses.find(c => c.name === courseName)
        return course ? course.name : courseName
    }
    return courseName
}
