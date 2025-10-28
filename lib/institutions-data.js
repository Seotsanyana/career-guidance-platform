// Comprehensive data for Lesotho institutions and their courses
export const LESOTHO_INSTITUTIONS = [
    {
        id: "limkokwing",
        name: "Limkokwing University of Creative Technology",
        email: "limkokwing@lesotho.com",
        password: "limkokwing",
        location: "Maseru",
        type: "Private University",
        established: 2008,
        website: "https://www.limkokwing.net",
        description: "A leading creative technology university offering innovative programs in design, technology, and business.",
        prospectus: "Limkokwing University of Creative Technology is a premier institution specializing in creative technology education. Our programs blend creativity with technology, preparing students for careers in design, IT, business, and engineering. With state-of-the-art facilities, industry partnerships, and a focus on entrepreneurship, we provide an environment that fosters innovation and practical skills. Our graduates are equipped to excel in the global job market, with opportunities for international exposure and real-world projects. Choose Limkokwing for a transformative educational experience that combines creativity, technology, and career readiness.",
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
        id: "botho",
        name: "Botho University",
        email: "botho@lesotho.com",
        password: "botho",
        location: "Maseru",
        type: "Private University",
        established: 2010,
        website: "https://www.bothouniversity.ac.ls",
        description: "A modern university focused on providing quality education in business, computing, and health sciences.",
        prospectus: "Botho University is committed to providing accessible, affordable, and quality higher education that meets the needs of Lesotho's developing economy. Our programs emphasize practical skills, entrepreneurship, and industry relevance, preparing students for successful careers in business, technology, and healthcare. With a student-centered approach, modern facilities, and partnerships with leading organizations, Botho University offers a supportive learning environment that fosters innovation and personal growth. Join us to build a brighter future for yourself and your community.",
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
        id: "nul",
        name: "National University of Lesotho",
        email: "nul@lesotho.com",
        password: "nul",
        location: "Roma",
        type: "Public University",
        established: 1945,
        website: "https://www.nul.ls",
        description: "Lesotho's oldest and largest university, offering comprehensive programs across multiple disciplines.",
        courses: [
            // Humanities & Social Sciences
            { name: "Bachelor of Arts in English", level: "degree", duration: "4 years", faculty: "Humanities" },
            { name: "Bachelor of Arts in History", level: "degree", duration: "4 years", faculty: "Humanities" },
            { name: "Bachelor of Arts in Sociology", level: "degree", duration: "4 years", faculty: "Humanities" },
            { name: "Bachelor of Arts in Political Science", level: "degree", duration: "4 years", faculty: "Humanities" },
            { name: "Bachelor of Social Work", level: "degree", duration: "4 years", faculty: "Humanities" },

            // Science & Technology
            { name: "Bachelor of Science in Biology", level: "degree", duration: "4 years", faculty: "Science" },
            { name: "Bachelor of Science in Chemistry", level: "degree", duration: "4 years", faculty: "Science" },
            { name: "Bachelor of Science in Physics", level: "degree", duration: "4 years", faculty: "Science" },
            { name: "Bachelor of Science in Mathematics", level: "degree", duration: "4 years", faculty: "Science" },
            { name: "Bachelor of Science in Computer Science", level: "degree", duration: "4 years", faculty: "Science" },

            // Health Sciences
            { name: "Bachelor of Medicine, Bachelor of Surgery (MBBS)", level: "degree", duration: "6 years", faculty: "Health Sciences" },
            { name: "Bachelor of Science in Nursing", level: "degree", duration: "4 years", faculty: "Health Sciences" },
            { name: "Bachelor of Pharmacy", level: "degree", duration: "4 years", faculty: "Health Sciences" },

            // Education
            { name: "Bachelor of Education (Primary)", level: "degree", duration: "4 years", faculty: "Education" },
            { name: "Bachelor of Education (Secondary)", level: "degree", duration: "4 years", faculty: "Education" },
            { name: "Postgraduate Certificate in Education", level: "certificate", duration: "1 year", faculty: "Education" },

            // Law
            { name: "Bachelor of Laws (LLB)", level: "degree", duration: "4 years", faculty: "Law" },

            // Business & Economics
            { name: "Bachelor of Commerce in Accounting", level: "degree", duration: "4 years", faculty: "Commerce" },
            { name: "Bachelor of Commerce in Economics", level: "degree", duration: "4 years", faculty: "Commerce" },
            { name: "Bachelor of Commerce in Finance", level: "degree", duration: "4 years", faculty: "Commerce" },
            { name: "Bachelor of Business Administration", level: "degree", duration: "4 years", faculty: "Commerce" },

            // Agriculture
            { name: "Bachelor of Science in Agriculture", level: "degree", duration: "4 years", faculty: "Agriculture" },
            { name: "Bachelor of Science in Agricultural Economics", level: "degree", duration: "4 years", faculty: "Agriculture" }
        ]
    },
    {
        id: "lecoe",
        name: "Lesotho College of Education",
        email: "lecoe@lesotho.com",
        password: "lecoe",
        location: "Maseru",
        type: "Public College",
        established: 1975,
        website: "https://www.lecoe.org.ls",
        description: "Specialized institution for teacher training and education programs.",
        courses: [
            // Teacher Education
            { name: "Bachelor of Education (Primary)", level: "degree", duration: "4 years", faculty: "Education" },
            { name: "Bachelor of Education (Secondary)", level: "degree", duration: "4 years", faculty: "Education" },
            { name: "Diploma in Primary Education", level: "diploma", duration: "3 years", faculty: "Education" },
            { name: "Diploma in Secondary Education", level: "diploma", duration: "3 years", faculty: "Education" },
            { name: "Certificate in Early Childhood Education", level: "certificate", duration: "1 year", faculty: "Education" },

            // Special Education
            { name: "Diploma in Special Education", level: "diploma", duration: "2 years", faculty: "Education" },
            { name: "Certificate in Inclusive Education", level: "certificate", duration: "1 year", faculty: "Education" },

            // Educational Leadership
            { name: "Diploma in Educational Management", level: "diploma", duration: "2 years", faculty: "Education" },
            { name: "Certificate in School Administration", level: "certificate", duration: "1 year", faculty: "Education" }
        ]
    },
    {
        id: "lerotholi",
        name: "Lerotholi Polytechnic",
        email: "lerotholi@lesotho.com",
        password: "lerotholi",
        location: "Maseru",
        type: "Public Polytechnic",
        established: 1905,
        website: "https://www.lpoly.ac.ls",
        description: "Technical and vocational training institution offering practical skills in various trades.",
        courses: [
            // Engineering & Technology
            { name: "Diploma in Civil Engineering", level: "diploma", duration: "3 years", faculty: "Engineering" },
            { name: "Diploma in Electrical Engineering", level: "diploma", duration: "3 years", faculty: "Engineering" },
            { name: "Diploma in Mechanical Engineering", level: "diploma", duration: "3 years", faculty: "Engineering" },
            { name: "Certificate in Electrical Installation", level: "certificate", duration: "1 year", faculty: "Engineering" },
            { name: "Certificate in Plumbing", level: "certificate", duration: "1 year", faculty: "Engineering" },

            // Information Technology
            { name: "Diploma in Information Technology", level: "diploma", duration: "3 years", faculty: "Computing" },
            { name: "Certificate in Computer Applications", level: "certificate", duration: "1 year", faculty: "Computing" },
            { name: "Certificate in Web Development", level: "certificate", duration: "1 year", faculty: "Computing" },

            // Business & Commerce
            { name: "Diploma in Business Administration", level: "diploma", duration: "3 years", faculty: "Business" },
            { name: "Diploma in Accounting", level: "diploma", duration: "3 years", faculty: "Business" },
            { name: "Certificate in Secretarial Studies", level: "certificate", duration: "1 year", faculty: "Business" },

            // Hospitality & Tourism
            { name: "Diploma in Hotel Management", level: "diploma", duration: "3 years", faculty: "Hospitality" },
            { name: "Certificate in Food Production", level: "certificate", duration: "1 year", faculty: "Hospitality" },
            { name: "Certificate in Housekeeping", level: "certificate", duration: "1 year", faculty: "Hospitality" },

            // Health Sciences
            { name: "Diploma in Nursing", level: "diploma", duration: "3 years", faculty: "Health Sciences" },
            { name: "Certificate in Community Health", level: "certificate", duration: "1 year", faculty: "Health Sciences" }
        ]
    },
    {
        id: "paray",
        name: "Paray School of Nursing",
        email: "paray@lesotho.com",
        password: "paray",
        location: "Maseru",
        type: "Private Nursing School",
        established: 1986,
        website: "https://www.paray.ac.ls",
        description: "Specialized nursing education institution providing comprehensive nursing training.",
        courses: [
            // Nursing Programs
            { name: "Bachelor of Science in Nursing", level: "degree", duration: "4 years", faculty: "Nursing" },
            { name: "Diploma in General Nursing", level: "diploma", duration: "3 years", faculty: "Nursing" },
            { name: "Diploma in Midwifery", level: "diploma", duration: "3 years", faculty: "Nursing" },
            { name: "Certificate in Nursing Assistant", level: "certificate", duration: "1 year", faculty: "Nursing" },
            { name: "Certificate in Community Health Nursing", level: "certificate", duration: "1 year", faculty: "Nursing" },

            // Advanced Nursing
            { name: "Post-Basic Diploma in Psychiatric Nursing", level: "diploma", duration: "1 year", faculty: "Nursing" },
            { name: "Post-Basic Diploma in Operating Room Nursing", level: "diploma", duration: "1 year", faculty: "Nursing" }
        ]
    },
    {
        id: "scott",
        name: "Scott Hospital Nursing School",
        email: "scott@lesotho.com",
        password: "scott",
        location: "Morija",
        type: "Hospital Nursing School",
        established: 1940,
        website: "https://www.scotthospital.org.ls",
        description: "Hospital-based nursing education providing practical clinical training.",
        courses: [
            { name: "Diploma in General Nursing", level: "diploma", duration: "3 years", faculty: "Nursing" },
            { name: "Certificate in Nursing Assistant", level: "certificate", duration: "1 year", faculty: "Nursing" },
            { name: "Certificate in Midwifery", level: "certificate", duration: "1 year", faculty: "Nursing" }
        ]
    },
    {
        id: "mohales",
        name: "Mohale's Hoek Nursing School",
        email: "mohales@lesotho.com",
        password: "mohales",
        location: "Mohale's Hoek",
        type: "Hospital Nursing School",
        established: 1980,
        website: "https://www.mohalesnursing.org.ls",
        description: "Regional nursing school serving the southern districts of Lesotho.",
        courses: [
            { name: "Diploma in General Nursing", level: "diploma", duration: "3 years", faculty: "Nursing" },
            { name: "Certificate in Community Health Nursing", level: "certificate", duration: "1 year", faculty: "Nursing" }
        ]
    },
    {
        id: "queen2",
        name: "Queen 'Mamohato Memorial Hospital School of Nursing",
        email: "queen2@lesotho.com",
        password: "queen2",
        location: "Maseru",
        type: "Hospital Nursing School",
        established: 1906,
        website: "https://www.qmmh.org.ls",
        description: "Premier hospital nursing school providing advanced clinical training.",
        courses: [
            { name: "Bachelor of Science in Nursing", level: "degree", duration: "4 years", faculty: "Nursing" },
            { name: "Diploma in General Nursing", level: "diploma", duration: "3 years", faculty: "Nursing" },
            { name: "Diploma in Midwifery", level: "diploma", duration: "3 years", faculty: "Nursing" },
            { name: "Post-Basic Diploma in Critical Care Nursing", level: "diploma", duration: "1 year", faculty: "Nursing" }
        ]
    },
    {
        id: "semonkong",
        name: "Semonkong Nursing School",
        email: "semonkong@lesotho.com",
        password: "semonkong",
        location: "Semonkong",
        type: "Hospital Nursing School",
        established: 1995,
        website: "https://www.semonkongnursing.org.ls",
        description: "Rural nursing school focused on community health and rural healthcare.",
        courses: [
            { name: "Diploma in General Nursing", level: "diploma", duration: "3 years", faculty: "Nursing" },
            { name: "Certificate in Rural Health Nursing", level: "certificate", duration: "1 year", faculty: "Nursing" }
        ]
    },
    {
        id: "butha",
        name: "Butha-Buthe Nursing School",
        email: "butha@lesotho.com",
        password: "butha",
        location: "Butha-Buthe",
        type: "Hospital Nursing School",
        established: 1985,
        website: "https://www.buthanursing.org.ls",
        description: "Northern region nursing school providing essential healthcare training.",
        courses: [
            { name: "Diploma in General Nursing", level: "diploma", duration: "3 years", faculty: "Nursing" },
            { name: "Certificate in Primary Health Care", level: "certificate", duration: "1 year", faculty: "Nursing" }
        ]
    },
    {
        id: "moko",
        name: "Mokhotlong Nursing School",
        email: "moko@lesotho.com",
        password: "moko",
        location: "Mokhotlong",
        type: "Hospital Nursing School",
        established: 1990,
        website: "https://www.mokhotlongnursing.org.ls",
        description: "Mountain region nursing school specializing in high-altitude healthcare.",
        courses: [
            { name: "Diploma in General Nursing", level: "diploma", duration: "3 years", faculty: "Nursing" },
            { name: "Certificate in Mountain Health Nursing", level: "certificate", duration: "1 year", faculty: "Nursing" }
        ]
    },
    {
        id: "thaba",
        name: "Thaba-Tseka Nursing School",
        email: "thaba@lesotho.com",
        password: "thaba",
        location: "Thaba-Tseka",
        type: "Hospital Nursing School",
        established: 1992,
        website: "https://www.thabanursing.org.ls",
        description: "Eastern region nursing school focused on district health services.",
        courses: [
            { name: "Diploma in General Nursing", level: "diploma", duration: "3 years", faculty: "Nursing" },
            { name: "Certificate in District Health Services", level: "certificate", duration: "1 year", faculty: "Nursing" }
        ]
    },
    {
        id: "qacha",
        name: "Qacha's Nek Nursing School",
        email: "qacha@lesotho.com",
        password: "qacha",
        location: "Qacha's Nek",
        type: "Hospital Nursing School",
        established: 1988,
        website: "https://www.qachanursing.org.ls",
        description: "Southern border region nursing school providing essential healthcare education.",
        courses: [
            { name: "Diploma in General Nursing", level: "diploma", duration: "3 years", faculty: "Nursing" },
            { name: "Certificate in Border Health Services", level: "certificate", duration: "1 year", faculty: "Nursing" }
        ]
    },
    {
        id: "mafeteng",
        name: "Mafeteng Nursing School",
        email: "mafeteng@lesotho.com",
        password: "mafeteng",
        location: "Mafeteng",
        type: "Hospital Nursing School",
        established: 1982,
        website: "https://www.mafetengnursing.org.ls",
        description: "Central southern region nursing school with focus on community healthcare.",
        courses: [
            { name: "Diploma in General Nursing", level: "diploma", duration: "3 years", faculty: "Nursing" },
            { name: "Certificate in Community Health Nursing", level: "certificate", duration: "1 year", faculty: "Nursing" }
        ]
    },
    {
        id: "leribe",
        name: "Leribe Nursing School",
        email: "leribe@lesotho.com",
        password: "leribe",
        location: "Leribe",
        type: "Hospital Nursing School",
        established: 1978,
        website: "https://www.leribenursing.org.ls",
        description: "Northern central region nursing school providing comprehensive nursing education.",
        courses: [
            { name: "Diploma in General Nursing", level: "diploma", duration: "3 years", faculty: "Nursing" },
            { name: "Certificate in General Nursing Assistant", level: "certificate", duration: "1 year", faculty: "Nursing" }
        ]
    },
    {
        id: "bothouniversity",
        name: "Botho University",
        email: "bothouniversity@lesotho.com",
        password: "botho",
        location: "Maseru",
        type: "Private University",
        established: 2010,
        website: "https://www.bothouniversity.ac.ls",
        description: "A modern university focused on providing quality education in business, computing, and health sciences.",
        prospectus: "Botho University is committed to providing accessible, affordable, and quality higher education that meets the needs of Lesotho's developing economy. Our programs emphasize practical skills, entrepreneurship, and industry relevance, preparing students for successful careers in business, technology, and healthcare. With a student-centered approach, modern facilities, and partnerships with leading organizations, Botho University offers a supportive learning environment that fosters innovation and personal growth. Join us to build a brighter future for yourself and your community.",
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
