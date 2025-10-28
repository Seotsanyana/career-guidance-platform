"use client"

import { useAuth } from "@/lib/auth-context-updated"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { GraduationCap, Briefcase, TrendingUp, BookOpen, Users, Target, Plus, CheckCircle, Award, ArrowLeft, ExternalLink, Upload } from "lucide-react"
import { LESOTHO_INSTITUTIONS, getInstitutionById } from "@/lib/institutions-data"
import { submitApplication } from "@/lib/applications"

export default function GraduateDashboard() {
    const { user, loading } = useAuth()
    const router = useRouter()
    const [gpa, setGpa] = useState("")
    const [qualificationLevel, setQualificationLevel] = useState("")
    const [field, setField] = useState("")
    const [institution, setInstitution] = useState("")
    const [showJobRecommendations, setShowJobRecommendations] = useState(false)
    const [applicationDialogOpen, setApplicationDialogOpen] = useState(false)
    const [selectedJob, setSelectedJob] = useState(null)
    const [applicationForm, setApplicationForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        coverLetter: "",
        resume: null
    })
    const { toast } = useToast()

    useEffect(() => {
        if (!loading && (!user || user.role !== "graduate")) {
            router.push("/login")
        }
    }, [user, loading, router])

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>
    }

    if (!user || user.role !== "graduate") {
        return null
    }

    // Comprehensive job recommendations based on GPA, qualification level, and field of study
    const jobRecommendations = [
        // Certificate Level Jobs
        {
            title: "IT Support Technician",
            company: "Lesotho Tech Support",
            location: "Maseru",
            salary: "M50k-70k",
            requirements: "Certificate in IT, GPA 2.0+, Basic computer skills",
            minGpa: 2.0,
            passRate: ["pass", "merit", "distinction"],
            degrees: ["Information Technology", "Computer Science"],
            qualificationLevels: ["certificate"]
        },
        {
            title: "Receptionist",
            company: "Maseru Hotel",
            location: "Maseru",
            salary: "M40k-55k",
            requirements: "Certificate in Hospitality, GPA 2.0+, Communication skills",
            minGpa: 2.0,
            passRate: ["pass", "merit", "distinction"],
            degrees: ["Hospitality", "Business Administration"],
            qualificationLevels: ["certificate"]
        },
        {
            title: "Lab Assistant",
            company: "Lesotho Health Labs",
            location: "Maseru",
            salary: "M45k-60k",
            requirements: "Certificate in Health Sciences, GPA 2.5+, Lab experience",
            minGpa: 2.5,
            passRate: ["pass", "merit", "distinction"],
            degrees: ["Health Sciences", "Biology"],
            qualificationLevels: ["certificate"]
        },
        {
            title: "Administrative Assistant",
            company: "Government Office",
            location: "Maseru",
            salary: "M50k-65k",
            requirements: "Certificate in Administration, GPA 2.0+, Organizational skills",
            minGpa: 2.0,
            passRate: ["pass", "merit", "distinction"],
            degrees: ["Business Administration", "Public Administration"],
            qualificationLevels: ["certificate"]
        },

        // Diploma Level Jobs
        {
            title: "Junior Accountant",
            company: "Lesotho Accounting Services",
            location: "Maseru",
            salary: "M70k-90k",
            requirements: "Diploma in Accounting, GPA 2.5+, Basic accounting knowledge",
            minGpa: 2.5,
            passRate: ["pass", "merit", "distinction"],
            degrees: ["Accounting", "Finance"],
            qualificationLevels: ["diploma"]
        },
        {
            title: "Lab Technician",
            company: "Queen Mamohato Memorial Hospital",
            location: "Maseru",
            salary: "M75k-95k",
            requirements: "Diploma in Medical Laboratory Science, GPA 3.0+, Lab skills",
            minGpa: 3.0,
            passRate: ["pass", "merit", "distinction"],
            degrees: ["Medical Laboratory Science", "Health Sciences"],
            qualificationLevels: ["diploma"]
        },
        {
            title: "Hotel Front Desk Supervisor",
            company: "Maseru Sun Hotel",
            location: "Maseru",
            salary: "M80k-100k",
            requirements: "Diploma in Hospitality Management, GPA 2.5+, Customer service experience",
            minGpa: 2.5,
            passRate: ["pass", "merit", "distinction"],
            degrees: ["Hospitality Management", "Tourism"],
            qualificationLevels: ["diploma"]
        },
        {
            title: "Junior Engineer",
            company: "Lesotho Engineering Co.",
            location: "Maseru",
            salary: "M85k-110k",
            requirements: "Diploma in Engineering, GPA 3.0+, Technical skills",
            minGpa: 3.0,
            passRate: ["pass", "merit", "distinction"],
            degrees: ["Civil Engineering", "Electrical Engineering"],
            qualificationLevels: ["diploma"]
        },

        // Degree Level Jobs
        {
            title: "Software Engineer",
            company: "Lesotho Tech Solutions",
            location: "Maseru",
            salary: "M150k-200k",
            requirements: "Bachelor's in Computer Science, GPA 3.0+, Distinction/Merit pass",
            minGpa: 3.0,
            passRate: ["distinction", "merit", "pass"],
            degrees: ["Computer Science", "Information Technology", "Software Engineering"],
            qualificationLevels: ["degree"]
        },
        {
            title: "IT Project Manager",
            company: "Maseru Innovations",
            location: "Maseru",
            salary: "M180k-250k",
            requirements: "Bachelor's in IT/Computer Science, GPA 3.5+, Distinction pass preferred",
            minGpa: 3.5,
            passRate: ["distinction", "merit"],
            degrees: ["Computer Science", "Information Technology", "Business Information Systems"],
            qualificationLevels: ["degree"]
        },
        {
            title: "Registered Nurse",
            company: "Queen Mamohato Memorial Hospital",
            location: "Maseru",
            salary: "M90k-130k",
            requirements: "Bachelor's in Nursing, GPA 3.0+, Clinical competence required",
            minGpa: 3.0,
            passRate: ["distinction", "merit", "pass"],
            degrees: ["Nursing", "Health Sciences"],
            qualificationLevels: ["degree"]
        },
        {
            title: "Medical Doctor",
            company: "Maseru Private Hospital",
            location: "Maseru",
            salary: "M200k-300k",
            requirements: "MBBS/MD, GPA 3.5+, Distinction in clinical subjects",
            minGpa: 3.5,
            passRate: ["distinction"],
            degrees: ["Medicine", "Medical Sciences"],
            qualificationLevels: ["degree"]
        },
        {
            title: "Pharmacist",
            company: "Lesotho Pharmaceutical Services",
            location: "Maseru",
            salary: "M120k-170k",
            requirements: "Bachelor's in Pharmacy, GPA 3.0+, Merit or Distinction pass",
            minGpa: 3.0,
            passRate: ["distinction", "merit"],
            degrees: ["Pharmacy", "Pharmaceutical Sciences"],
            qualificationLevels: ["degree"]
        },
        {
            title: "Secondary School Teacher",
            company: "Ministry of Education",
            location: "Various Districts",
            salary: "M80k-120k",
            requirements: "Bachelor's in Education, GPA 2.5+, Teaching qualification",
            minGpa: 2.5,
            passRate: ["distinction", "merit", "pass"],
            degrees: ["Education", "Primary Education", "Secondary Education"],
            qualificationLevels: ["degree"]
        },
        {
            title: "Accountant",
            company: "Lesotho Revenue Authority",
            location: "Maseru",
            salary: "M100k-140k",
            requirements: "Bachelor's in Accounting, GPA 3.0+, ACCA/CIMA qualification",
            minGpa: 3.0,
            passRate: ["distinction", "merit"],
            degrees: ["Accounting", "Finance", "Business Administration"],
            qualificationLevels: ["degree"]
        },
        {
            title: "Bank Manager",
            company: "Nedbank Lesotho",
            location: "Maseru",
            salary: "M180k-260k",
            requirements: "Bachelor's in Finance/Business, GPA 3.5+, 3+ years banking experience",
            minGpa: 3.5,
            passRate: ["distinction", "merit"],
            degrees: ["Finance", "Business Administration", "Economics"],
            qualificationLevels: ["degree"]
        },
        {
            title: "Business Development Manager",
            company: "Lesotho Chamber of Commerce",
            location: "Maseru",
            salary: "M140k-190k",
            requirements: "Bachelor's in Business, GPA 3.0+, Marketing experience",
            minGpa: 3.0,
            passRate: ["distinction", "merit", "pass"],
            degrees: ["Business Administration", "Marketing", "Commerce"],
            qualificationLevels: ["degree"]
        },
        {
            title: "Agricultural Extension Officer",
            company: "Ministry of Agriculture",
            location: "Mafeteng",
            salary: "M85k-125k",
            requirements: "Bachelor's in Agriculture, GPA 2.5+, Field experience preferred",
            minGpa: 2.5,
            passRate: ["distinction", "merit", "pass"],
            degrees: ["Agriculture", "Agribusiness", "Agricultural Sciences"],
            qualificationLevels: ["degree"]
        },
        {
            title: "Farm Manager",
            company: "Lesotho Agribusiness",
            location: "Leribe",
            salary: "M95k-140k",
            requirements: "Diploma/Bachelor's in Agriculture, GPA 2.5+, Management experience",
            minGpa: 2.5,
            passRate: ["distinction", "merit", "pass"],
            degrees: ["Agriculture", "Farm Management", "Agribusiness"],
            qualificationLevels: ["degree"]
        },
        {
            title: "Policy Analyst",
            company: "Ministry of Development Planning",
            location: "Maseru",
            salary: "M110k-155k",
            requirements: "Bachelor's in Social Sciences, GPA 3.0+, Research skills",
            minGpa: 3.0,
            passRate: ["distinction", "merit"],
            degrees: ["Economics", "Public Administration", "Development Studies"],
            qualificationLevels: ["degree"]
        },
        {
            title: "Civil Engineer",
            company: "Ministry of Public Works",
            location: "Maseru",
            salary: "M130k-180k",
            requirements: "Bachelor's in Civil Engineering, GPA 3.0+, COREN registration",
            minGpa: 3.0,
            passRate: ["distinction", "merit"],
            degrees: ["Civil Engineering", "Structural Engineering"],
            qualificationLevels: ["degree"]
        },
        {
            title: "Electrical Engineer",
            company: "Lesotho Electricity Company",
            location: "Maseru",
            salary: "M135k-185k",
            requirements: "Bachelor's in Electrical Engineering, GPA 3.0+, Technical certification",
            minGpa: 3.0,
            passRate: ["distinction", "merit"],
            degrees: ["Electrical Engineering", "Power Engineering"],
            qualificationLevels: ["degree"]
        },
        {
            title: "Construction Project Manager",
            company: "Lesotho Construction Co.",
            location: "Maseru",
            salary: "M160k-230k",
            requirements: "Bachelor's in Civil Engineering/Construction, GPA 3.5+, PMP certification",
            minGpa: 3.5,
            passRate: ["distinction", "merit"],
            degrees: ["Civil Engineering", "Construction Management", "Project Management"],
            qualificationLevels: ["degree"]
        },
        {
            title: "Hotel Manager",
            company: "Maseru Sun Hotel",
            location: "Maseru",
            salary: "M120k-170k",
            requirements: "Diploma/Bachelor's in Hospitality, GPA 2.5+, Management experience",
            minGpa: 2.5,
            passRate: ["distinction", "merit", "pass"],
            degrees: ["Hospitality Management", "Hotel Management", "Tourism"],
            qualificationLevels: ["degree"]
        },
        {
            title: "Tourism Development Officer",
            company: "Lesotho Tourism Board",
            location: "Maseru",
            salary: "M90k-130k",
            requirements: "Bachelor's in Tourism/Hospitality, GPA 2.5+, Marketing skills",
            minGpa: 2.5,
            passRate: ["distinction", "merit", "pass"],
            degrees: ["Tourism", "Hospitality Management", "Business Administration"],
            qualificationLevels: ["degree"]
        },
        {
            title: "Journalist",
            company: "Lesotho Times",
            location: "Maseru",
            salary: "M70k-105k",
            requirements: "Bachelor's in Journalism/Communications, GPA 2.5+, Writing skills",
            minGpa: 2.5,
            passRate: ["distinction", "merit", "pass"],
            degrees: ["Journalism", "Communications", "Media Studies"],
            qualificationLevels: ["degree"]
        },
        {
            title: "Marketing Specialist",
            company: "Vodacom Lesotho",
            location: "Maseru",
            salary: "M110k-155k",
            requirements: "Bachelor's in Marketing/Business, GPA 3.0+, Digital marketing experience",
            minGpa: 3.0,
            passRate: ["distinction", "merit"],
            degrees: ["Marketing", "Business Administration", "Communications"],
            qualificationLevels: ["degree"]
        },
        {
            title: "Data Analyst",
            company: "Statistics Lesotho",
            location: "Maseru",
            salary: "M120k-165k",
            requirements: "Bachelor's in Statistics/Mathematics, GPA 3.0+, Analytical skills",
            minGpa: 3.0,
            passRate: ["distinction", "merit"],
            degrees: ["Statistics", "Mathematics", "Computer Science"],
            qualificationLevels: ["degree"]
        },

        // Master's Level Jobs
        {
            title: "Senior Software Engineer",
            company: "Lesotho Tech Solutions",
            location: "Maseru",
            salary: "M220k-300k",
            requirements: "Master's in Computer Science, GPA 3.5+, 3+ years experience",
            minGpa: 3.5,
            passRate: ["distinction", "merit"],
            degrees: ["Computer Science", "Information Technology"],
            qualificationLevels: ["masters"]
        },
        {
            title: "University Lecturer",
            company: "National University of Lesotho",
            location: "Roma",
            salary: "M150k-220k",
            requirements: "Master's degree, GPA 3.5+, Research experience preferred",
            minGpa: 3.5,
            passRate: ["distinction", "merit"],
            degrees: ["Education", "Any field with teaching qualification"],
            qualificationLevels: ["masters"]
        },
        {
            title: "Senior Policy Analyst",
            company: "Ministry of Development Planning",
            location: "Maseru",
            salary: "M140k-190k",
            requirements: "Master's in Social Sciences, GPA 3.5+, Advanced research skills",
            minGpa: 3.5,
            passRate: ["distinction", "merit"],
            degrees: ["Economics", "Public Administration", "Development Studies"],
            qualificationLevels: ["masters"]
        },
        {
            title: "Senior Engineer",
            company: "Lesotho Engineering Co.",
            location: "Maseru",
            salary: "M180k-250k",
            requirements: "Master's in Engineering, GPA 3.5+, Leadership experience",
            minGpa: 3.5,
            passRate: ["distinction", "merit"],
            degrees: ["Civil Engineering", "Electrical Engineering"],
            qualificationLevels: ["masters"]
        },

        // PhD Level Jobs
        {
            title: "Research Scientist",
            company: "National University of Lesotho",
            location: "Roma",
            salary: "M200k-280k",
            requirements: "PhD in Sciences, GPA 3.5+, Publication record",
            minGpa: 3.5,
            passRate: ["distinction"],
            degrees: ["Biology", "Chemistry", "Physics"],
            qualificationLevels: ["phd"]
        },
        {
            title: "Professor",
            company: "National University of Lesotho",
            location: "Roma",
            salary: "M250k-350k",
            requirements: "PhD, GPA 3.5+, Extensive teaching and research experience",
            minGpa: 3.5,
            passRate: ["distinction"],
            degrees: ["Education", "Any field"],
            qualificationLevels: ["phd"]
        },
        {
            title: "Chief Research Officer",
            company: "Lesotho Research Institute",
            location: "Maseru",
            salary: "M220k-320k",
            requirements: "PhD in relevant field, GPA 3.5+, Leadership in research",
            minGpa: 3.5,
            passRate: ["distinction"],
            degrees: ["Social Sciences", "Health Sciences"],
            qualificationLevels: ["phd"]
        }
    ]

    const getRecommendedJobs = () => {
        const gpaValue = parseFloat(gpa)
        if (!gpaValue || !qualificationLevel || !field) return []

        return jobRecommendations.filter(job =>
            job.minGpa <= gpaValue &&
            job.qualificationLevels?.includes(qualificationLevel.toLowerCase()) &&
            job.degrees.some(d =>
                field.toLowerCase().includes(d.toLowerCase()) ||
                d.toLowerCase().includes(field.toLowerCase())
            )
        )
    }

    const recommendedJobs = getRecommendedJobs()

    // Course recommendations based on field of study
    const getRecommendedCourses = () => {
        if (!field) return []

        const fieldLower = field.toLowerCase()
        const courses = []

        if (fieldLower.includes('computer science') || fieldLower.includes('information technology') || fieldLower.includes('software engineering')) {
            courses.push(
                { title: "CS50's Introduction to Computer Science", platform: "Harvard University (edX)", url: "https://www.edx.org/course/cs50s-introduction-to-computer-science", duration: "12 weeks", level: "Beginner" },
                { title: "The Web Developer Bootcamp 2023", platform: "Udemy", url: "https://www.udemy.com/course/the-web-developer-bootcamp/", duration: "60 hours", level: "Intermediate" },
                { title: "Machine Learning by Andrew Ng", platform: "Coursera", url: "https://www.coursera.org/learn/machine-learning", duration: "11 weeks", level: "Intermediate" },
                { title: "Data Structures and Algorithms", platform: "freeCodeCamp", url: "https://www.freecodecamp.org/learn/coding-interview-prep/", duration: "Self-paced", level: "Advanced" }
            )
        } else if (fieldLower.includes('business') || fieldLower.includes('finance') || fieldLower.includes('accounting')) {
            courses.push(
                { title: "Financial Markets by Robert Shiller", platform: "Yale University (Coursera)", url: "https://www.coursera.org/learn/financial-markets-global", duration: "8 weeks", level: "Beginner" },
                { title: "Strategic Management and Innovation Specialization", platform: "Copenhagen Business School (Coursera)", url: "https://www.coursera.org/specializations/strategic-management-innovation", duration: "6 months", level: "Intermediate" },
                { title: "CPA Exam Preparation", platform: "Becker Professional Education", url: "https://www.becker.com/", duration: "6-12 months", level: "Advanced" },
                { title: "Entrepreneurship Specialization", platform: "University of Pennsylvania (Coursera)", url: "https://www.coursera.org/specializations/wharton-entrepreneurship", duration: "4 months", level: "Intermediate" }
            )
        } else if (fieldLower.includes('engineering') || fieldLower.includes('civil') || fieldLower.includes('electrical')) {
            courses.push(
                { title: "Introduction to Engineering Mechanics", platform: "Georgia Tech (Coursera)", url: "https://www.coursera.org/learn/engineering-mechanics-statics", duration: "8 weeks", level: "Beginner" },
                { title: "Sustainable Engineering", platform: "TU Delft (edX)", url: "https://www.edx.org/course/sustainable-engineering", duration: "8 weeks", level: "Intermediate" },
                { title: "Project Management Professional (PMP) Certification Prep", platform: "PMI", url: "https://www.pmi.org/certification/project-management-professional-pmp", duration: "3-6 months", level: "Advanced" },
                { title: "AutoCAD for Beginners", platform: "Udemy", url: "https://www.udemy.com/topic/autocad/", duration: "10 hours", level: "Beginner" }
            )
        } else if (fieldLower.includes('health') || fieldLower.includes('nursing') || fieldLower.includes('medicine')) {
            courses.push(
                { title: "Health Systems Development Specialization", platform: "Imperial College London (Coursera)", url: "https://www.coursera.org/specializations/health-systems-development", duration: "6 months", level: "Intermediate" },
                { title: "Anatomy: Human Neuroanatomy", platform: "University of Michigan (Coursera)", url: "https://www.coursera.org/learn/neuroanatomy", duration: "10 weeks", level: "Intermediate" },
                { title: "Global Health Challenges and Governance", platform: "Imperial College London (Coursera)", url: "https://www.coursera.org/learn/global-health-challenges-governance", duration: "8 weeks", level: "Beginner" },
                { title: "Nursing Informatics", platform: "University of Minnesota (Coursera)", url: "https://www.coursera.org/learn/nursing-informatics", duration: "12 weeks", level: "Intermediate" }
            )
        } else if (fieldLower.includes('education') || fieldLower.includes('teaching')) {
            courses.push(
                { title: "Foundations of Teaching for Learning", platform: "Commonwealth Education Trust", url: "https://www.coursera.org/specializations/teach", duration: "4 months", level: "Beginner" },
                { title: "Assessment for Learning", platform: "University of Illinois (Coursera)", url: "https://www.coursera.org/learn/assessment-for-learning", duration: "8 weeks", level: "Intermediate" },
                { title: "Online Teaching", platform: "University of New South Wales (Coursera)", url: "https://www.coursera.org/learn/online-teaching", duration: "4 weeks", level: "Beginner" },
                { title: "Educational Psychology", platform: "University of Washington (edX)", url: "https://www.edx.org/course/educational-psychology", duration: "6 weeks", level: "Intermediate" }
            )
        } else if (fieldLower.includes('agriculture') || fieldLower.includes('farm')) {
            courses.push(
                { title: "Sustainable Agricultural Systems", platform: "University of Illinois (Coursera)", url: "https://www.coursera.org/learn/sustainable-agricultural-systems", duration: "8 weeks", level: "Beginner" },
                { title: "Climate Change and Agriculture", platform: "University of Florida (edX)", url: "https://www.edx.org/course/climate-change-and-agriculture", duration: "6 weeks", level: "Intermediate" },
                { title: "Agribusiness Management", platform: "University of Illinois (Coursera)", url: "https://www.coursera.org/learn/agribusiness-management", duration: "6 weeks", level: "Intermediate" },
                { title: "Food Security and Sustainability", platform: "Wageningen University (edX)", url: "https://www.edx.org/course/food-security-and-sustainability", duration: "8 weeks", level: "Beginner" }
            )
        } else {
            // General courses for other fields
            courses.push(
                { title: "Learning How to Learn", platform: "University of California, San Diego (Coursera)", url: "https://www.coursera.org/learn/learning-how-to-learn", duration: "4 weeks", level: "Beginner" },
                { title: "Critical Thinking Skills", platform: "University of Michigan (Coursera)", url: "https://www.coursera.org/learn/critical-thinking-skills", duration: "8 weeks", level: "Beginner" },
                { title: "Communication Skills", platform: "University of Washington (edX)", url: "https://www.edx.org/course/communication-skills", duration: "6 weeks", level: "Beginner" },
                { title: "Professional Development", platform: "Google Career Certificates", url: "https://grow.google/certificates/", duration: "3-6 months", level: "Intermediate" }
            )
        }

        return courses
    }

    const recommendedCourses = getRecommendedCourses()

    // Networking platforms based on field
    const getNetworkingPlatforms = () => {
        if (!field) return []

        const fieldLower = field.toLowerCase()
        const platforms = []

        if (fieldLower.includes('computer science') || fieldLower.includes('information technology') || fieldLower.includes('software engineering')) {
            platforms.push(
                { name: "GitHub", url: "https://github.com", description: "Connect with developers, contribute to open source projects" },
                { name: "Stack Overflow", url: "https://stackoverflow.com", description: "Q&A community for programmers and IT professionals" },
                { name: "Dev.to", url: "https://dev.to", description: "Community of software developers sharing knowledge" },
                { name: "LinkedIn Tech Groups", url: "https://www.linkedin.com", description: "Professional networking with tech industry peers" },
                { name: "Meetup.com Tech Events", url: "https://www.meetup.com", description: "Local tech meetups and networking events" }
            )
        } else if (fieldLower.includes('business') || fieldLower.includes('finance') || fieldLower.includes('accounting')) {
            platforms.push(
                { name: "LinkedIn", url: "https://www.linkedin.com", description: "Professional networking platform for business professionals" },
                { name: "Alumni Networks", url: "https://www.linkedin.com/alumni", description: "Connect with graduates from your institution" },
                { name: "Business Networking Groups", url: "https://www.meetup.com", description: "Local business networking events and groups" },
                { name: "Professional Associations", url: "https://www.lesothochamber.com", description: "Lesotho Chamber of Commerce and Industry" },
                { name: "Entrepreneurship Communities", url: "https://www.entrepreneur.com", description: "Global entrepreneurship network and resources" }
            )
        } else if (fieldLower.includes('engineering')) {
            platforms.push(
                { name: "Engineering Network", url: "https://www.engineeringnetwork.org", description: "Professional engineering networking platform" },
                { name: "ResearchGate", url: "https://www.researchgate.net", description: "Scientific research network for engineers" },
                { name: "LinkedIn Engineering Groups", url: "https://www.linkedin.com", description: "Specialized engineering professional groups" },
                { name: "Engineering Conferences", url: "https://www.conferencealerts.com/engineering.php", description: "International engineering conferences and events" },
                { name: "Professional Engineering Societies", url: "https://www.engineeringcouncil.org.ls", description: "Lesotho Engineering Council" }
            )
        } else if (fieldLower.includes('health') || fieldLower.includes('nursing') || fieldLower.includes('medicine')) {
            platforms.push(
                { name: "Health Professionals Network", url: "https://www.healthprofessionalsnetwork.org", description: "Healthcare networking and career development" },
                { name: "ResearchGate", url: "https://www.researchgate.net", description: "Medical research and academic networking" },
                { name: "PubMed", url: "https://pubmed.ncbi.nlm.nih.gov", description: "Medical literature and research networking" },
                { name: "Medical Associations", url: "https://www.health.gov.ls", description: "Lesotho Ministry of Health professional networks" },
                { name: "Healthcare LinkedIn Groups", url: "https://www.linkedin.com", description: "Specialized healthcare professional communities" }
            )
        } else if (fieldLower.includes('education') || fieldLower.includes('teaching')) {
            platforms.push(
                { name: "Education Network", url: "https://www.educationnetwork.org", description: "Teaching professionals networking platform" },
                { name: "ResearchGate", url: "https://www.researchgate.net", description: "Academic research and education networking" },
                { name: "Education LinkedIn Groups", url: "https://www.linkedin.com", description: "Education professionals and educators communities" },
                { name: "Teaching Conferences", url: "https://www.conferencealerts.com/education.php", description: "International education conferences" },
                { name: "Ministry of Education Networks", url: "https://www.education.gov.ls", description: "Lesotho education sector professional networks" }
            )
        } else {
            platforms.push(
                { name: "LinkedIn", url: "https://www.linkedin.com", description: "General professional networking platform" },
                { name: "Alumni Networks", url: "https://www.linkedin.com/alumni", description: "Connect with graduates from your institution" },
                { name: "Professional Associations", url: "https://www.professionalassociations.org.ls", description: "Lesotho professional associations directory" },
                { name: "Meetup.com", url: "https://www.meetup.com", description: "Local networking events and groups" },
                { name: "ResearchGate", url: "https://www.researchgate.net", description: "Academic and research networking" }
            )
        }

        return platforms
    }

    const networkingPlatforms = getNetworkingPlatforms()

    // Recent activities based on educational background
    const getRecentActivities = () => {
        if (!field || !qualificationLevel || !institution) {
            return [
                {
                    title: "Applied to Graduate position",
                    organization: "Lesotho Government",
                    time: "3 days ago",
                    status: "Under Review",
                    icon: "briefcase",
                    color: "blue"
                },
                {
                    title: `Graduated with ${qualificationLevel.charAt(0).toUpperCase() + qualificationLevel.slice(1)} Degree`,
                    organization: institution || "Your Institution",
                    time: "",
                    status: "Completed",
                    icon: "graduation",
                    color: "green"
                },
                {
                    title: "Attended Career Development Workshop",
                    organization: "Career Services",
                    time: "1 week ago",
                    status: "Completed",
                    icon: "target",
                    color: "purple"
                },
                {
                    title: "Completed Professional Skills Course",
                    organization: "Online Learning Platform",
                    time: "2 weeks ago",
                    status: "Completed",
                    icon: "book",
                    color: "orange"
                }
            ]
        }

        const fieldLower = field.toLowerCase()
        const qualUpper = qualificationLevel.charAt(0).toUpperCase() + qualificationLevel.slice(1)

        if (fieldLower.includes('computer science') || fieldLower.includes('information technology') || fieldLower.includes('software engineering')) {
            return [
                {
                    title: "Applied to Software Engineer position",
                    organization: "Lesotho Tech Solutions",
                    time: "3 days ago",
                    status: "Under Review",
                    icon: "briefcase",
                    color: "blue"
                },
                {
                    title: `Graduated with ${qualUpper} ${field}`,
                    organization: institution,
                    time: "",
                    status: "Completed",
                    icon: "graduation",
                    color: "green"
                },
                {
                    title: "Attended Lesotho ICT Summit",
                    organization: "Ministry of Communications",
                    time: "1 week ago",
                    status: "Completed",
                    icon: "users",
                    color: "purple"
                },
                {
                    title: "Completed Advanced JavaScript Course",
                    organization: "Online Learning Platform",
                    time: "2 weeks ago",
                    status: "Completed",
                    icon: "book",
                    color: "orange"
                }
            ]
        } else if (fieldLower.includes('business') || fieldLower.includes('finance') || fieldLower.includes('accounting')) {
            return [
                {
                    title: "Applied to Financial Analyst position",
                    organization: "Nedbank Lesotho",
                    time: "3 days ago",
                    status: "Under Review",
                    icon: "briefcase",
                    color: "blue"
                },
                {
                    title: `Graduated with ${qualUpper} ${field}`,
                    organization: institution,
                    time: "",
                    status: "Completed",
                    icon: "graduation",
                    color: "green"
                },
                {
                    title: "Attended Lesotho Business Forum",
                    organization: "Chamber of Commerce",
                    time: "1 week ago",
                    status: "Completed",
                    icon: "users",
                    color: "purple"
                },
                {
                    title: "Completed Financial Modeling Course",
                    organization: "Professional Development Center",
                    time: "2 weeks ago",
                    status: "Completed",
                    icon: "book",
                    color: "orange"
                }
            ]
        } else if (fieldLower.includes('engineering') || fieldLower.includes('civil') || fieldLower.includes('electrical')) {
            return [
                {
                    title: "Applied to Civil Engineer position",
                    organization: "Lesotho Engineering Co.",
                    time: "3 days ago",
                    status: "Under Review",
                    icon: "briefcase",
                    color: "blue"
                },
                {
                    title: `Graduated with ${qualUpper} ${field}`,
                    organization: institution,
                    time: "",
                    status: "Completed",
                    icon: "graduation",
                    color: "green"
                },
                {
                    title: "Attended Engineering Conference Lesotho",
                    organization: "Engineering Council",
                    time: "1 week ago",
                    status: "Completed",
                    icon: "users",
                    color: "purple"
                },
                {
                    title: "Completed AutoCAD Certification",
                    organization: "Technical Training Institute",
                    time: "2 weeks ago",
                    status: "Completed",
                    icon: "book",
                    color: "orange"
                }
            ]
        } else if (fieldLower.includes('health') || fieldLower.includes('nursing') || fieldLower.includes('medicine')) {
            return [
                {
                    title: "Applied to Registered Nurse position",
                    organization: "Queen Mamohato Memorial Hospital",
                    time: "3 days ago",
                    status: "Under Review",
                    icon: "briefcase",
                    color: "blue"
                },
                {
                    title: `Graduated with ${qualUpper} ${field}`,
                    organization: institution,
                    time: "",
                    status: "Completed",
                    icon: "graduation",
                    color: "green"
                },
                {
                    title: "Attended Health Sciences Symposium",
                    organization: "Ministry of Health",
                    time: "1 week ago",
                    status: "Completed",
                    icon: "users",
                    color: "purple"
                },
                {
                    title: "Completed Medical Ethics Course",
                    organization: "Health Professional Council",
                    time: "2 weeks ago",
                    status: "Completed",
                    icon: "book",
                    color: "orange"
                }
            ]
        } else if (fieldLower.includes('education') || fieldLower.includes('teaching')) {
            return [
                {
                    title: "Applied to Secondary Teacher position",
                    organization: "Ministry of Education",
                    time: "3 days ago
