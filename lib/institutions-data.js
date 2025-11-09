// Comprehensive data for real Lesotho institutions and their courses
export const LESOTHO_INSTITUTIONS = [
    {
        id: "nul",
        name: "National University of Lesotho",
        email: "nul@lesotho.com",
        password: "nul2024",
        location: "Roma",
        type: "Public University",
        established: 1945,
        website: "https://www.nul.ls",
        description: "Lesotho's oldest and largest university, offering comprehensive programs across multiple disciplines.",
        prospectus: "The National University of Lesotho is committed to excellence in teaching, research, and community service. As Lesotho's premier institution of higher learning, we provide quality education that prepares students for leadership roles in various sectors of the economy. Our diverse academic programs, experienced faculty, and modern facilities create an environment conducive to intellectual growth and innovation.",
        courses: [
            // Faculty of Humanities
            { name: "Bachelor of Arts in English", level: "degree", duration: "4 years", faculty: "Humanities", fees: "M8,000/year", requirements: ["English C", "Any 2 subjects C"] },
            { name: "Bachelor of Arts in History", level: "degree", duration: "4 years", faculty: "Humanities", fees: "M8,000/year", requirements: ["English C", "History C"] },
            { name: "Bachelor of Arts in Sociology", level: "degree", duration: "4 years", faculty: "Humanities", fees: "M8,000/year", requirements: ["English C", "Any social science C"] },
            { name: "Bachelor of Arts in Political Science", level: "degree", duration: "4 years", faculty: "Humanities", fees: "M8,000/year", requirements: ["English C", "Any social science C"] },
            { name: "Bachelor of Social Work", level: "degree", duration: "4 years", faculty: "Humanities", fees: "M8,000/year", requirements: ["English C", "Any social science C"] },

            // Faculty of Science and Technology
            { name: "Bachelor of Science in Biology", level: "degree", duration: "4 years", faculty: "Science", fees: "M10,000/year", requirements: ["Mathematics C", "Biology C", "Chemistry C"] },
            { name: "Bachelor of Science in Chemistry", level: "degree", duration: "4 years", faculty: "Science", fees: "M10,000/year", requirements: ["Mathematics C", "Chemistry C", "Physics C"] },
            { name: "Bachelor of Science in Physics", level: "degree", duration: "4 years", faculty: "Science", fees: "M10,000/year", requirements: ["Mathematics C", "Physics C"] },
            { name: "Bachelor of Science in Mathematics", level: "degree", duration: "4 years", faculty: "Science", fees: "M10,000/year", requirements: ["Mathematics C", "Additional Mathematics C"] },
            { name: "Bachelor of Science in Computer Science", level: "degree", duration: "4 years", faculty: "Science", fees: "M10,000/year", requirements: ["Mathematics C", "English C"] },

            // Faculty of Health Sciences
            { name: "Bachelor of Medicine, Bachelor of Surgery (MBBS)", level: "degree", duration: "6 years", faculty: "Health Sciences", fees: "M25,000/year", requirements: ["Mathematics C", "Biology C", "Chemistry C", "Physics C", "English C"] },
            { name: "Bachelor of Science in Nursing", level: "degree", duration: "4 years", faculty: "Health Sciences", fees: "M12,000/year", requirements: ["Biology C", "Chemistry C", "English C"] },
            { name: "Bachelor of Pharmacy", level: "degree", duration: "4 years", faculty: "Health Sciences", fees: "M15,000/year", requirements: ["Mathematics C", "Biology C", "Chemistry C", "English C"] },

            // Faculty of Education
            { name: "Bachelor of Education (Primary)", level: "degree", duration: "4 years", faculty: "Education", fees: "M9,000/year", requirements: ["English C", "Mathematics C"] },
            { name: "Bachelor of Education (Secondary)", level: "degree", duration: "4 years", faculty: "Education", fees: "M9,000/year", requirements: ["English C", "Teaching subject C"] },
            { name: "Postgraduate Certificate in Education", level: "certificate", duration: "1 year", faculty: "Education", fees: "M12,000/year", requirements: ["Bachelor's degree"] },

            // Faculty of Law
            { name: "Bachelor of Laws (LLB)", level: "degree", duration: "4 years", faculty: "Law", fees: "M11,000/year", requirements: ["English C", "Any 2 subjects C"] },

            // Faculty of Commerce
            { name: "Bachelor of Commerce in Accounting", level: "degree", duration: "4 years", faculty: "Commerce", fees: "M10,000/year", requirements: ["Mathematics C", "English C"] },
            { name: "Bachelor of Commerce in Economics", level: "degree", duration: "4 years", faculty: "Commerce", fees: "M10,000/year", requirements: ["Mathematics C", "English C"] },
            { name: "Bachelor of Commerce in Finance", level: "degree", duration: "4 years", faculty: "Commerce", fees: "M10,000/year", requirements: ["Mathematics C", "English C"] },
            { name: "Bachelor of Business Administration", level: "degree", duration: "4 years", faculty: "Commerce", fees: "M10,000/year", requirements: ["Mathematics C", "English C"] },

            // Faculty of Agriculture
            { name: "Bachelor of Science in Agriculture", level: "degree", duration: "4 years", faculty: "Agriculture", fees: "M9,500/year", requirements: ["Mathematics C", "Biology C", "Chemistry C"] },
            { name: "Bachelor of Science in Agricultural Economics", level: "degree", duration: "4 years", faculty: "Agriculture", fees: "M9,500/year", requirements: ["Mathematics C", "English C"] }
        ]
    },
    {
        id: "lecoe",
        name: "Lesotho College of Education",
        email: "info@lecoe.org.ls",
        password: "lecoe2024",
        location: "Maseru",
        type: "Public College",
        established: 1975,
        website: "https://www.lecoe.org.ls",
        description: "Specialized institution for teacher training and education programs.",
        prospectus: "Lesotho College of Education is dedicated to training competent teachers who will contribute to the development of quality education in Lesotho. Our programs combine theoretical knowledge with practical teaching experience, preparing educators for both primary and secondary school levels.",
        courses: [
            // Teacher Education
            { name: "Bachelor of Education (Primary)", level: "degree", duration: "4 years", faculty: "Education", fees: "M7,500/year", requirements: ["English C", "Mathematics C"] },
            { name: "Bachelor of Education (Secondary)", level: "degree", duration: "4 years", faculty: "Education", fees: "M7,500/year", requirements: ["English C", "Teaching subject C"] },
            { name: "Diploma in Primary Education", level: "diploma", duration: "3 years", faculty: "Education", fees: "M6,000/year", requirements: ["English C", "Mathematics D"] },
            { name: "Diploma in Secondary Education", level: "diploma", duration: "3 years", faculty: "Education", fees: "M6,000/year", requirements: ["English C", "Teaching subject C"] },
            { name: "Certificate in Early Childhood Education", level: "certificate", duration: "1 year", faculty: "Education", fees: "M4,500/year", requirements: ["English D"] },

            // Special Education
            { name: "Diploma in Special Education", level: "diploma", duration: "2 years", faculty: "Education", fees: "M6,500/year", requirements: ["English C", "Any subject C"] },
            { name: "Certificate in Inclusive Education", level: "certificate", duration: "1 year", faculty: "Education", fees: "M4,500/year", requirements: ["English C"] },

            // Educational Leadership
            { name: "Diploma in Educational Management", level: "diploma", duration: "2 years", faculty: "Education", fees: "M7,000/year", requirements: ["English C", "Teaching qualification"] },
            { name: "Certificate in School Administration", level: "certificate", duration: "1 year", faculty: "Education", fees: "M5,000/year", requirements: ["English C"] }
        ]
    },
    {
        id: "lerotholi",
        name: "Lerotholi Polytechnic",
        email: "info@lpoly.ac.ls",
        password: "lerotholi2024",
        location: "Maseru",
        type: "Public Polytechnic",
        established: 1905,
        website: "https://www.lpoly.ac.ls",
        description: "Technical and vocational training institution offering practical skills in various trades.",
        prospectus: "Lerotholi Polytechnic provides high-quality technical and vocational education to meet the skilled workforce needs of Lesotho's economy. Our hands-on training programs prepare students for careers in engineering, technology, business, and hospitality industries.",
        courses: [
            // Engineering & Technology
            { name: "Diploma in Civil Engineering", level: "diploma", duration: "3 years", faculty: "Engineering", fees: "M8,000/year", requirements: ["Mathematics C", "Physics C", "English C"] },
            { name: "Diploma in Electrical Engineering", level: "diploma", duration: "3 years", faculty: "Engineering", fees: "M8,000/year", requirements: ["Mathematics C", "Physics C", "English C"] },
            { name: "Diploma in Mechanical Engineering", level: "diploma", duration: "3 years", faculty: "Engineering", fees: "M8,000/year", requirements: ["Mathematics C", "Physics C", "English C"] },
            { name: "Certificate in Electrical Installation", level: "certificate", duration: "1 year", faculty: "Engineering", fees: "M5,500/year", requirements: ["Mathematics D", "English D"] },
            { name: "Certificate in Plumbing", level: "certificate", duration: "1 year", faculty: "Engineering", fees: "M5,500/year", requirements: ["Mathematics D", "English D"] },

            // Information Technology
            { name: "Diploma in Information Technology", level: "diploma", duration: "3 years", faculty: "Computing", fees: "M7,500/year", requirements: ["Mathematics C", "English C"] },
            { name: "Certificate in Computer Applications", level: "certificate", duration: "1 year", faculty: "Computing", fees: "M5,000/year", requirements: ["English D"] },
            { name: "Certificate in Web Development", level: "certificate", duration: "1 year", faculty: "Computing", fees: "M5,000/year", requirements: ["English D"] },

            // Business & Commerce
            { name: "Diploma in Business Administration", level: "diploma", duration: "3 years", faculty: "Business", fees: "M7,000/year", requirements: ["Mathematics C", "English C"] },
            { name: "Diploma in Accounting", level: "diploma", duration: "3 years", faculty: "Business", fees: "M7,000/year", requirements: ["Mathematics C", "English C"] },
            { name: "Certificate in Secretarial Studies", level: "certificate", duration: "1 year", faculty: "Business", fees: "M4,500/year", requirements: ["English C"] },

            // Hospitality & Tourism
            { name: "Diploma in Hotel Management", level: "diploma", duration: "3 years", faculty: "Hospitality", fees: "M8,500/year", requirements: ["English C", "Mathematics D"] },
            { name: "Certificate in Food Production", level: "certificate", duration: "1 year", faculty: "Hospitality", fees: "M5,500/year", requirements: ["English D"] },
            { name: "Certificate in Housekeeping", level: "certificate", duration: "1 year", faculty: "Hospitality", fees: "M5,500/year", requirements: ["English D"] },

            // Health Sciences
            { name: "Diploma in Nursing", level: "diploma", duration: "3 years", faculty: "Health Sciences", fees: "M9,000/year", requirements: ["Biology C", "Chemistry C", "English C"] },
            { name: "Certificate in Community Health", level: "certificate", duration: "1 year", faculty: "Health Sciences", fees: "M5,000/year", requirements: ["English C"] }
        ]
    },
    {
        id: "botho",
        name: "Botho University",
        email: "bothouniversity@lesotho.com",
        password: "botho2024",
        location: "Maseru",
        type: "Private University",
        established: 2010,
        website: "https://www.bothouniversity.ac.ls",
        description: "A modern university focused on providing quality education in business, computing, and health sciences.",
        prospectus: "Botho University is committed to providing accessible, affordable, and quality higher education that meets the needs of Lesotho's developing economy. Our programs emphasize practical skills, entrepreneurship, and industry relevance, preparing students for successful careers in business, technology, and healthcare.",
        courses: [
            // Computing & IT
            { name: "Bachelor of Science in Computing", level: "degree", duration: "4 years", faculty: "Computing", fees: "M28,000/year", requirements: ["Mathematics C", "English C"] },
            { name: "Bachelor of Science in Information Technology", level: "degree", duration: "4 years", faculty: "Computing", fees: "M28,000/year", requirements: ["Mathematics C", "English C"] },
            { name: "Bachelor of Science in Computer Science", level: "degree", duration: "4 years", faculty: "Computing", fees: "M28,000/year", requirements: ["Mathematics C", "English C"] },
            { name: "Diploma in Computing", level: "diploma", duration: "2 years", faculty: "Computing", fees: "M22,000/year", requirements: ["Mathematics C", "English C"] },
            { name: "Certificate in Information Technology", level: "certificate", duration: "1 year", faculty: "Computing", fees: "M15,000/year", requirements: ["English D"] },

            // Business Studies
            { name: "Bachelor of Business Administration", level: "degree", duration: "4 years", faculty: "Business", fees: "M26,000/year", requirements: ["Mathematics C", "English C"] },
            { name: "Bachelor of Commerce in Accounting", level: "degree", duration: "4 years", faculty: "Business", fees: "M26,000/year", requirements: ["Mathematics C", "English C"] },
            { name: "Bachelor of Commerce in Finance", level: "degree", duration: "4 years", faculty: "Business", fees: "M26,000/year", requirements: ["Mathematics C", "English C"] },
            { name: "Bachelor of Commerce in Marketing", level: "degree", duration: "4 years", faculty: "Business", fees: "M26,000/year", requirements: ["Mathematics C", "English C"] },
            { name: "Diploma in Business Administration", level: "diploma", duration: "2 years", faculty: "Business", fees: "M20,000/year", requirements: ["Mathematics C", "English C"] },

            // Health Sciences
            { name: "Bachelor of Science in Nursing", level: "degree", duration: "4 years", faculty: "Health Sciences", fees: "M30,000/year", requirements: ["Biology C", "Chemistry C", "English C"] },
            { name: "Bachelor of Science in Public Health", level: "degree", duration: "4 years", faculty: "Health Sciences", fees: "M28,000/year", requirements: ["Biology C", "English C"] },
            { name: "Diploma in Nursing", level: "diploma", duration: "3 years", faculty: "Health Sciences", fees: "M24,000/year", requirements: ["Biology C", "English C"] },
            { name: "Diploma in Public Health", level: "diploma", duration: "2 years", faculty: "Health Sciences", fees: "M20,000/year", requirements: ["English C"] },

            // Education
            { name: "Bachelor of Education (Primary)", level: "degree", duration: "4 years", faculty: "Education", fees: "M25,000/year", requirements: ["English C"] },
            { name: "Bachelor of Education (Secondary)", level: "degree", duration: "4 years", faculty: "Education", fees: "M25,000/year", requirements: ["English C"] },
            { name: "Diploma in Education", level: "diploma", duration: "2 years", faculty: "Education", fees: "M18,000/year", requirements: ["English C"] }
        ]
    },
    {
        id: "limkokwing",
        name: "Limkokwing University of Creative Technology",
        email: "limkokwing@lesotho.com",
        password: "limkokwing2024",
        location: "Maseru",
        type: "Private University",
        established: 2008,
        website: "https://www.limkokwing.net",
        description: "A leading creative technology university offering innovative programs in design, technology, and business.",
        prospectus: "Limkokwing University of Creative Technology Lesotho campus provides world-class education in creative industries. Our programs blend creativity with technology, preparing students for global careers in design, IT, business, and engineering through innovative teaching methods and industry partnerships.",
        courses: [
            // Creative Arts & Design
            { name: "Bachelor of Arts in Graphic Design", level: "degree", duration: "4 years", faculty: "Creative Arts", fees: "M38,000/year", requirements: ["English C", "Any art subject C"] },
            { name: "Bachelor of Arts in Fashion Design", level: "degree", duration: "4 years", faculty: "Creative Arts", fees: "M38,000/year", requirements: ["English C", "Any art subject C"] },
            { name: "Bachelor of Arts in Interior Design", level: "degree", duration: "4 years", faculty: "Creative Arts", fees: "M38,000/year", requirements: ["English C", "Any art subject C"] },
            { name: "Bachelor of Arts in Multimedia Design", level: "degree", duration: "4 years", faculty: "Creative Arts", fees: "M38,000/year", requirements: ["English C", "Any art subject C"] },
            { name: "Diploma in Graphic Design", level: "diploma", duration: "2 years", faculty: "Creative Arts", fees: "M25,000/year", requirements: ["English C"] },
            { name: "Diploma in Fashion Design", level: "diploma", duration: "2 years", faculty: "Creative Arts", fees: "M25,000/year", requirements: ["English C"] },

            // Information Technology
            { name: "Bachelor of Science in Computer Science", level: "degree", duration: "4 years", faculty: "Information Technology", fees: "M35,000/year", requirements: ["Mathematics C", "English C"] },
            { name: "Bachelor of Science in Information Technology", level: "degree", duration: "4 years", faculty: "Information Technology", fees: "M35,000/year", requirements: ["Mathematics C", "English C"] },
            { name: "Bachelor of Science in Software Engineering", level: "degree", duration: "4 years", faculty: "Information Technology", fees: "M35,000/year", requirements: ["Mathematics C", "English C"] },
            { name: "Diploma in Information Technology", level: "diploma", duration: "2 years", faculty: "Information Technology", fees: "M25,000/year", requirements: ["Mathematics C", "English C"] },
            { name: "Certificate in Computer Applications", level: "certificate", duration: "1 year", faculty: "Information Technology", fees: "M15,000/year", requirements: ["English D"] },

            // Business & Management
            { name: "Bachelor of Business Administration", level: "degree", duration: "4 years", faculty: "Business", fees: "M32,000/year", requirements: ["Mathematics C", "English C"] },
            { name: "Bachelor of Commerce in Accounting", level: "degree", duration: "4 years", faculty: "Business", fees: "M32,000/year", requirements: ["Mathematics C", "English C"] },
            { name: "Bachelor of Commerce in Finance", level: "degree", duration: "4 years", faculty: "Business", fees: "M32,000/year", requirements: ["Mathematics C", "English C"] },
            { name: "Bachelor of Commerce in Marketing", level: "degree", duration: "4 years", faculty: "Business", fees: "M32,000/year", requirements: ["Mathematics C", "English C"] },
            { name: "Diploma in Business Administration", level: "diploma", duration: "2 years", faculty: "Business", fees: "M25,000/year", requirements: ["Mathematics C", "English C"] },
            { name: "Diploma in Accounting", level: "diploma", duration: "2 years", faculty: "Business", fees: "M25,000/year", requirements: ["Mathematics C", "English C"] },

            // Communication & Media
            { name: "Bachelor of Arts in Journalism", level: "degree", duration: "4 years", faculty: "Communication", fees: "M30,000/year", requirements: ["English C"] },
            { name: "Bachelor of Arts in Public Relations", level: "degree", duration: "4 years", faculty: "Communication", fees: "M30,000/year", requirements: ["English C"] },
            { name: "Bachelor of Arts in Advertising", level: "degree", duration: "4 years", faculty: "Communication", fees: "M30,000/year", requirements: ["English C"] },
            { name: "Diploma in Journalism", level: "diploma", duration: "2 years", faculty: "Communication", fees: "M25,000/year", requirements: ["English C"] },

            // Engineering
            { name: "Bachelor of Engineering in Civil Engineering", level: "degree", duration: "4 years", faculty: "Engineering", fees: "M40,000/year", requirements: ["Mathematics C", "Physics C", "English C"] },
            { name: "Bachelor of Engineering in Electrical Engineering", level: "degree", duration: "4 years", faculty: "Engineering", fees: "M40,000/year", requirements: ["Mathematics C", "Physics C", "English C"] },
            { name: "Bachelor of Engineering in Mechanical Engineering", level: "degree", duration: "4 years", faculty: "Engineering", fees: "M40,000/year", requirements: ["Mathematics C", "Physics C", "English C"] },
            { name: "Diploma in Civil Engineering", level: "diploma", duration: "2 years", faculty: "Engineering", fees: "M30,000/year", requirements: ["Mathematics C", "English C"] },
            { name: "Diploma in Electrical Engineering", level: "diploma", duration: "2 years", faculty: "Engineering", fees: "M30,000/year", requirements: ["Mathematics C", "English C"] }
        ]
    },
    {
        id: "qmmh_nursing",
        name: "Queen Mamohato Memorial Hospital School of Nursing",
        email: "nursing@qmmh.org.ls",
        password: "qmmh2024",
        location: "Maseru",
        type: "Hospital Nursing School",
        established: 1906,
        website: "https://www.qmmh.org.ls",
        description: "Premier hospital nursing school providing advanced clinical training.",
        prospectus: "The Queen Mamohato Memorial Hospital School of Nursing offers comprehensive nursing education with a focus on clinical excellence and patient care. Our programs combine theoretical knowledge with extensive practical training in a modern hospital setting.",
        courses: [
            { name: "Bachelor of Science in Nursing", level: "degree", duration: "4 years", faculty: "Nursing", fees: "M18,000/year", requirements: ["Biology C", "Chemistry C", "English C"] },
            { name: "Diploma in General Nursing", level: "diploma", duration: "3 years", faculty: "Nursing", fees: "M12,000/year", requirements: ["Biology C", "Chemistry C", "English C"] },
            { name: "Diploma in Midwifery", level: "diploma", duration: "3 years", faculty: "Nursing", fees: "M12,000/year", requirements: ["Biology C", "English C"] },
            { name: "Post-Basic Diploma in Critical Care Nursing", level: "diploma", duration: "1 year", faculty: "Nursing", fees: "M15,000/year", requirements: ["Nursing diploma", "2 years experience"] }
        ]
    },
    {
        id: "scott_nursing",
        name: "Scott Hospital Nursing School",
        email: "nursing@scotthospital.org.ls",
        password: "scott2024",
        location: "Morija",
        type: "Hospital Nursing School",
        established: 1940,
        website: "https://www.scotthospital.org.ls",
        description: "Hospital-based nursing education providing practical clinical training.",
        prospectus: "Scott Hospital Nursing School provides quality nursing education with emphasis on community health and rural healthcare delivery. Our graduates are well-prepared to serve in various healthcare settings across Lesotho.",
        courses: [
            { name: "Diploma in General Nursing", level: "diploma", duration: "3 years", faculty: "Nursing", fees: "M10,000/year", requirements: ["Biology C", "Chemistry C", "English C"] },
            { name: "Certificate in Nursing Assistant", level: "certificate", duration: "1 year", faculty: "Nursing", fees: "M6,000/year", requirements: ["English C", "Biology D"] },
            { name: "Certificate in Midwifery", level: "certificate", duration: "1 year", faculty: "Nursing", fees: "M6,000/year", requirements: ["English C", "Biology D"] }
        ]
    }
]

// Helper functions for institution data
export const getInstitutionById = (id) => {
    return LESOTHO_INSTITUTIONS.find(inst => inst.id === id)
}

export const getInstitutionByEmail = (email) => {
    return LESOTHO_INSTITUTIONS.find(inst => inst.email === email)
}

export const getCoursesByInstitution = (institutionId) => {
    const institution = getInstitutionById(institutionId)
    return institution ? institution.courses : []
}

export const getCoursesByLevel = (level) => {
    const allCourses = LESOTHO_INSTITUTIONS.flatMap(inst => inst.courses)
    return allCourses.filter(course => course.level === level)
}

export const getCoursesByFaculty = (faculty) => {
    const allCourses = LESOTHO_INSTITUTIONS.flatMap(inst => inst.courses)
    return allCourses.filter(course => course.faculty.toLowerCase().includes(faculty.toLowerCase()))
}

export const getAllInstitutions = () => {
    return LESOTHO_INSTITUTIONS
}

export const getInstitutionLoginCredentials = () => {
    return LESOTHO_INSTITUTIONS.map(inst => ({
        name: inst.name,
        email: inst.email,
        password: inst.password,
        location: inst.location
    }))
}
