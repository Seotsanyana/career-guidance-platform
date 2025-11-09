// Faculty management utilities for institutions
import { LESOTHO_INSTITUTIONS, getInstitutionById } from './institutions-data'

// In a real app, this would be stored in a database
let faculties = []

// Initialize with some default faculties for existing institutions
const initializeDefaultFaculties = () => {
    LESOTHO_INSTITUTIONS.forEach(institution => {
        if (institution.courses && institution.courses.length > 0) {
            const uniqueFaculties = [...new Set(institution.courses.map(course => course.faculty))]
            uniqueFaculties.forEach(facultyName => {
                const existingFaculty = faculties.find(f => f.institutionId === institution.id && f.name === facultyName)
                if (!existingFaculty) {
                    faculties.push({
                        id: `${institution.id}_${facultyName.toLowerCase().replace(/\s+/g, '_')}`,
                        institutionId: institution.id,
                        name: facultyName,
                        description: `${facultyName} faculty at ${institution.name}`,
                        dean: '',
                        contactEmail: '',
                        contactPhone: '',
                        courseCount: institution.courses.filter(c => c.faculty === facultyName).length,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    })
                }
            })
        }
    })
}

// Initialize default faculties
initializeDefaultFaculties()

export const createFaculty = (facultyData) => {
    const faculty = {
        id: `faculty_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...facultyData,
        courseCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
    faculties.push(faculty)
    return faculty
}

export const getFacultiesByInstitution = (institutionId) => {
    return faculties.filter(faculty => faculty.institutionId === institutionId)
}

export const getFacultyById = (facultyId) => {
    return faculties.find(faculty => faculty.id === facultyId)
}

export const updateFaculty = (facultyId, updates) => {
    const facultyIndex = faculties.findIndex(f => f.id === facultyId)
    if (facultyIndex !== -1) {
        faculties[facultyIndex] = {
            ...faculties[facultyIndex],
            ...updates,
            updatedAt: new Date().toISOString()
        }
        return faculties[facultyIndex]
    }
    return null
}

export const deleteFaculty = (facultyId) => {
    const facultyIndex = faculties.findIndex(f => f.id === facultyId)
    if (facultyIndex !== -1) {
        const deletedFaculty = faculties[facultyIndex]
        faculties.splice(facultyIndex, 1)
        return deletedFaculty
    }
    return null
}

export const updateFacultyCourseCount = (facultyId) => {
    const faculty = getFacultyById(facultyId)
    if (faculty) {
        const institution = getInstitutionById(faculty.institutionId)
        if (institution && institution.courses) {
            const courseCount = institution.courses.filter(course => course.faculty === faculty.name).length
            updateFaculty(facultyId, { courseCount })
        }
    }
}

export const getAllFaculties = () => {
    return faculties
}
