// Course management utilities for institutions
import { LESOTHO_INSTITUTIONS, getInstitutionById } from './institutions-data'
import { updateFacultyCourseCount } from './institution-faculties'

// In a real app, this would be stored in a database
let courses = []

// Initialize with existing courses from institutions data
const initializeDefaultCourses = () => {
    LESOTHO_INSTITUTIONS.forEach(institution => {
        if (institution.courses && institution.courses.length > 0) {
            institution.courses.forEach(course => {
                const existingCourse = courses.find(c => c.institutionId === institution.id && c.name === course.name)
                if (!existingCourse) {
                    courses.push({
                        id: `${institution.id}_${course.name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')}`,
                        institutionId: institution.id,
                        facultyId: '', // Will be set when faculty is created
                        name: course.name,
                        code: course.code || `${institution.id.toUpperCase()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
                        level: course.level,
                        faculty: course.faculty,
                        duration: course.duration,
                        fees: course.fees,
                        requirements: course.requirements || [],
                        description: course.description || `${course.name} program at ${institution.name}`,
                        syllabus: course.syllabus || [],
                        capacity: course.capacity || 50,
                        enrolled: course.enrolled || 0,
                        status: 'active',
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    })
                }
            })
        }
    })
}

// Initialize default courses
initializeDefaultCourses()

export const createCourse = (courseData) => {
    const course = {
        id: `course_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...courseData,
        enrolled: 0,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
    courses.push(course)

    // Update faculty course count if facultyId is provided
    if (course.facultyId) {
        updateFacultyCourseCount(course.facultyId)
    }

    return course
}

export const getCoursesByInstitution = (institutionId) => {
    return courses.filter(course => course.institutionId === institutionId)
}

export const getCoursesByFaculty = (facultyId) => {
    return courses.filter(course => course.facultyId === facultyId)
}

export const getCourseById = (courseId) => {
    return courses.find(course => course.id === courseId)
}

export const updateCourse = (courseId, updates) => {
    const courseIndex = courses.findIndex(c => c.id === courseId)
    if (courseIndex !== -1) {
        courses[courseIndex] = {
            ...courses[courseIndex],
            ...updates,
            updatedAt: new Date().toISOString()
        }

        // Update faculty course count if faculty changed
        if (updates.facultyId && updates.facultyId !== courses[courseIndex].facultyId) {
            updateFacultyCourseCount(updates.facultyId)
            if (courses[courseIndex].facultyId) {
                updateFacultyCourseCount(courses[courseIndex].facultyId)
            }
        }

        return courses[courseIndex]
    }
    return null
}

export const deleteCourse = (courseId) => {
    const courseIndex = courses.findIndex(c => c.id === courseId)
    if (courseIndex !== -1) {
        const deletedCourse = courses[courseIndex]
        courses.splice(courseIndex, 1)

        // Update faculty course count
        if (deletedCourse.facultyId) {
            updateFacultyCourseCount(deletedCourse.facultyId)
        }

        return deletedCourse
    }
    return null
}

export const enrollStudentInCourse = (courseId, studentId) => {
    const course = getCourseById(courseId)
    if (course && course.enrolled < course.capacity) {
        updateCourse(courseId, { enrolled: course.enrolled + 1 })
        return true
    }
    return false
}

export const unenrollStudentFromCourse = (courseId, studentId) => {
    const course = getCourseById(courseId)
    if (course && course.enrolled > 0) {
        updateCourse(courseId, { enrolled: course.enrolled - 1 })
        return true
    }
    return false
}

export const getAvailableCourses = (institutionId) => {
    return courses.filter(course =>
        course.institutionId === institutionId &&
        course.status === 'active' &&
        course.enrolled < course.capacity
    )
}

export const getAllCourses = () => {
    return courses
}

export const searchCourses = (institutionId, query) => {
    const institutionCourses = getCoursesByInstitution(institutionId)
    return institutionCourses.filter(course =>
        course.name.toLowerCase().includes(query.toLowerCase()) ||
        course.faculty.toLowerCase().includes(query.toLowerCase()) ||
        course.code.toLowerCase().includes(query.toLowerCase())
    )
}
