// Qualification checker functionality inspired by Qualify app for Lesotho
// This module provides offline qualification checking for tertiary institutions

export const QUALIFICATION_REQUIREMENTS = {
    // University Degree Programs
    degree: {
        minimumGpa: 2.0,
        requiredSubjects: [],
        englishProficiency: true,
        additionalRequirements: []
    },

    // Diploma Programs
    diploma: {
        minimumGpa: 1.8,
        requiredSubjects: [],
        englishProficiency: true,
        additionalRequirements: []
    },

    // Certificate Programs
    certificate: {
        minimumGpa: 1.5,
        requiredSubjects: [],
        englishProficiency: true,
        additionalRequirements: []
    }
}

// Specific course requirements
export const COURSE_SPECIFIC_REQUIREMENTS = {
    // Medicine and Health Sciences
    "Bachelor of Medicine, Bachelor of Surgery (MBBS)": {
        minimumGpa: 3.0,
        requiredSubjects: ["Biology", "Chemistry", "Physics", "Mathematics"],
        englishProficiency: true,
        additionalRequirements: ["Medical certificate", "Interview"]
    },

    "Bachelor of Pharmacy": {
        minimumGpa: 2.8,
        requiredSubjects: ["Chemistry", "Biology", "Physics", "Mathematics"],
        englishProficiency: true,
        additionalRequirements: []
    },

    "Bachelor of Science in Nursing": {
        minimumGpa: 2.5,
        requiredSubjects: ["Biology", "Chemistry"],
        englishProficiency: true,
        additionalRequirements: ["Health certificate"]
    },

    // Engineering Programs
    "Bachelor of Engineering in Civil Engineering": {
        minimumGpa: 2.5,
        requiredSubjects: ["Mathematics", "Physics", "Chemistry"],
        englishProficiency: true,
        additionalRequirements: []
    },

    "Bachelor of Engineering in Electrical Engineering": {
        minimumGpa: 2.5,
        requiredSubjects: ["Mathematics", "Physics"],
        englishProficiency: true,
        additionalRequirements: []
    },

    "Bachelor of Engineering in Mechanical Engineering": {
        minimumGpa: 2.5,
        requiredSubjects: ["Mathematics", "Physics"],
        englishProficiency: true,
        additionalRequirements: []
    },

    // Computer Science and IT
    "Bachelor of Science in Computer Science": {
        minimumGpa: 2.5,
        requiredSubjects: ["Mathematics"],
        englishProficiency: true,
        additionalRequirements: []
    },

    "Bachelor of Science in Information Technology": {
        minimumGpa: 2.0,
        requiredSubjects: ["Mathematics"],
        englishProficiency: true,
        additionalRequirements: []
    },

    // Business and Commerce
    "Bachelor of Commerce in Accounting": {
        minimumGpa: 2.5,
        requiredSubjects: ["Mathematics", "English"],
        englishProficiency: true,
        additionalRequirements: []
    },

    "Bachelor of Business Administration": {
        minimumGpa: 2.0,
        requiredSubjects: ["Mathematics", "English"],
        englishProficiency: true,
        additionalRequirements: []
    },

    // Law
    "Bachelor of Laws (LLB)": {
        minimumGpa: 2.8,
        requiredSubjects: ["English"],
        englishProficiency: true,
        additionalRequirements: ["Interview"]
    },

    // Education
    "Bachelor of Education": {
        minimumGpa: 2.5,
        requiredSubjects: ["English"],
        englishProficiency: true,
        additionalRequirements: ["Teaching aptitude test"]
    }
}

// Career-based qualification checking
export const CAREER_REQUIREMENTS = {
    "Doctor/Medical Professional": {
        requiredCourses: ["Bachelor of Medicine, Bachelor of Surgery (MBBS)", "Bachelor of Pharmacy", "Bachelor of Science in Nursing"],
        minimumQualification: "degree",
        alternativePaths: ["Diploma in Nursing", "Diploma in Pharmacy"]
    },

    "Engineer": {
        requiredCourses: ["Bachelor of Engineering in Civil Engineering", "Bachelor of Engineering in Electrical Engineering", "Bachelor of Engineering in Mechanical Engineering"],
        minimumQualification: "degree",
        alternativePaths: ["Diploma in Civil Engineering", "Diploma in Electrical Engineering"]
    },

    "Software Developer/Programmer": {
        requiredCourses: ["Bachelor of Science in Computer Science", "Bachelor of Science in Information Technology", "Bachelor of Science in Software Engineering"],
        minimumQualification: "degree",
        alternativePaths: ["Diploma in Information Technology", "Certificate in Computer Applications"]
    },

    "Teacher/Educator": {
        requiredCourses: ["Bachelor of Education (Primary)", "Bachelor of Education (Secondary)"],
        minimumQualification: "degree",
        alternativePaths: ["Diploma in Primary Education", "Diploma in Secondary Education"]
    },

    "Business Professional": {
        requiredCourses: ["Bachelor of Business Administration", "Bachelor of Commerce in Accounting", "Bachelor of Commerce in Finance"],
        minimumQualification: "degree",
        alternativePaths: ["Diploma in Business Administration", "Diploma in Accounting"]
    },

    "Lawyer/Legal Professional": {
        requiredCourses: ["Bachelor of Laws (LLB)"],
        minimumQualification: "degree",
        alternativePaths: []
    },

    "Nurse": {
        requiredCourses: ["Bachelor of Science in Nursing", "Diploma in General Nursing"],
        minimumQualification: "diploma",
        alternativePaths: ["Certificate in Nursing Assistant"]
    },

    "Accountant": {
        requiredCourses: ["Bachelor of Commerce in Accounting"],
        minimumQualification: "degree",
        alternativePaths: ["Diploma in Accounting"]
    },

    "IT Specialist": {
        requiredCourses: ["Bachelor of Science in Information Technology", "Diploma in Information Technology"],
        minimumQualification: "diploma",
        alternativePaths: ["Certificate in Information Technology"]
    },

    "Journalist/Media Professional": {
        requiredCourses: ["Bachelor of Arts in Journalism", "Bachelor of Arts in Public Relations"],
        minimumQualification: "degree",
        alternativePaths: ["Diploma in Journalism"]
    }
}

// Main qualification checking function
export const checkQualification = (studentProfile, courseName, institutionId) => {
    const { gpa, qualificationLevel, subjects, englishProficiency } = studentProfile

    // Get course-specific requirements
    const courseReqs = COURSE_SPECIFIC_REQUIREMENTS[courseName] || QUALIFICATION_REQUIREMENTS[qualificationLevel] || QUALIFICATION_REQUIREMENTS.degree

    const results = {
        qualified: true,
        reasons: [],
        recommendations: []
    }

    // Check GPA requirement
    if (gpa < courseReqs.minimumGpa) {
        results.qualified = false
        results.reasons.push(`GPA of ${gpa} is below minimum requirement of ${courseReqs.minimumGpa}`)
        results.recommendations.push("Consider improving your GPA or applying for foundation programs")
    }

    // Check required subjects
    if (courseReqs.requiredSubjects && courseReqs.requiredSubjects.length > 0) {
        const missingSubjects = courseReqs.requiredSubjects.filter(subject =>
            !subjects.some(s => s.toLowerCase().includes(subject.toLowerCase()))
        )

        if (missingSubjects.length > 0) {
            results.qualified = false
            results.reasons.push(`Missing required subjects: ${missingSubjects.join(', ')}`)
            results.recommendations.push("Consider taking bridging courses or foundation programs")
        }
    }

    // Check English proficiency
    if (courseReqs.englishProficiency && !englishProficiency) {
        results.qualified = false
        results.reasons.push("English proficiency required")
        results.recommendations.push("Take English proficiency test or language courses")
    }

    return results
}

// Career-based qualification checking
export const checkCareerQualification = (studentProfile, career) => {
    const careerReqs = CAREER_REQUIREMENTS[career]

    if (!careerReqs) {
        return {
            qualified: false,
            reasons: ["Career not found in database"],
            recommendations: ["Contact career counselor for guidance"]
        }
    }

    const results = {
        qualified: false,
        suitableCourses: [],
        alternativePaths: careerReqs.alternativePaths,
        reasons: [],
        recommendations: []
    }

    // Check if student meets minimum qualification level
    const qualificationLevels = {
        'certificate': 1,
        'diploma': 2,
        'degree': 3
    }

    const studentLevel = qualificationLevels[studentProfile.qualificationLevel] || 0
    const requiredLevel = qualificationLevels[careerReqs.minimumQualification] || 3

    if (studentLevel >= requiredLevel) {
        results.qualified = true
        results.suitableCourses = careerReqs.requiredCourses
    } else {
        results.reasons.push(`Current qualification level (${studentProfile.qualificationLevel}) does not meet minimum requirement (${careerReqs.minimumQualification})`)
        results.recommendations.push("Consider upgrading your qualification level")
        results.suitableCourses = careerReqs.alternativePaths
    }

    return results
}

// Get all available courses for a qualification level
export const getCoursesByQualification = (qualificationLevel) => {
    const { LESOTHO_INSTITUTIONS } = require('./institutions-data')
    const allCourses = LESOTHO_INSTITUTIONS.flatMap(inst => inst.courses)

    return allCourses.filter(course => course.level === qualificationLevel)
}

// Get courses by career field
export const getCoursesByCareer = (career) => {
    const careerReqs = CAREER_REQUIREMENTS[career]

    if (!careerReqs) return []

    const { LESOTHO_INSTITUTIONS } = require('./institutions-data')
    const allCourses = LESOTHO_INSTITUTIONS.flatMap(inst => inst.courses)

    return allCourses.filter(course =>
        careerReqs.requiredCourses.some(required =>
            course.name.toLowerCase().includes(required.toLowerCase().split(' ').slice(-2).join(' '))
        ) ||
        careerReqs.alternativePaths.some(alternative =>
            course.name.toLowerCase().includes(alternative.toLowerCase().split(' ').slice(-2).join(' '))
        )
    )
}

// Offline qualification checking (works without internet)
export const performOfflineQualificationCheck = (studentData) => {
    const { gpa, qualificationLevel, field, subjects, englishProficiency } = studentData

    return {
        timestamp: new Date().toISOString(),
        studentProfile: studentData,
        qualificationLevel,
        possibleCareers: Object.keys(CAREER_REQUIREMENTS).filter(career => {
            const check = checkCareerQualification(studentData, career)
            return check.qualified
        }),
        recommendedCourses: getCoursesByQualification(qualificationLevel),
        careerSpecificCourses: getCoursesByCareer(field),
        status: "offline_check_completed"
    }
}
