"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { GraduationCap, Briefcase, TrendingUp, BookOpen, Users, Target, Plus, CheckCircle, ArrowLeft, FileText, Upload, ExternalLink, Award, Bell, Edit, FileCheck } from "lucide-react"
import { LESOTHO_INSTITUTIONS, getInstitutionById } from "@/lib/institutions-data"
import { checkQualification, QUALIFICATION_REQUIREMENTS, COURSE_SPECIFIC_REQUIREMENTS, performTranscriptQualificationCheck } from "@/lib/qualification-checker"
import TranscriptUpload from "@/components/transcript-upload"
import { submitApplication } from "@/lib/applications"
import { useToast } from "@/hooks/use-toast"

export default function StudentDashboard() {
    const { user, loading } = useAuth()
    const router = useRouter()
    const [lgcseResults, setLgcseResults] = useState([])
    const [showResultsForm, setShowResultsForm] = useState(false)
    const [newSubject, setNewSubject] = useState("")
    const [newGrade, setNewGrade] = useState("")
    const [qualifiedCourses, setQualifiedCourses] = useState([])
    const [showAssessment, setShowAssessment] = useState(false)
    const [selectedSubject, setSelectedSubject] = useState("")

    // Graduate module state
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

    // Student profile and applications state
    const [appliedCourses, setAppliedCourses] = useState([])
    const [admissionsResults, setAdmissionsResults] = useState([])
    const [profileDialogOpen, setProfileDialogOpen] = useState(false)
    const [transcriptDialogOpen, setTranscriptDialogOpen] = useState(false)
    const [jobApplications, setJobApplications] = useState([])
    const [notifications, setNotifications] = useState([])
    const [profileData, setProfileData] = useState({
        phone: "",
        address: "",
        emergencyContact: "",
        additionalDocuments: []
    })
    const [transcriptData, setTranscriptData] = useState({
        transcripts: [],
        certificates: []
    })

    const { toast } = useToast()

    // LGCSE subjects acceptable by ECOL
    const lgcseSubjects = [
        "English Language", "Mathematics", "Biology", "Chemistry", "Physics",
        "Geography", "History", "Religious Education", "Development Studies",
        "Agriculture", "Business Studies", "Computer Science", "Design & Technology",
        "Home Economics", "Music", "Physical Education", "Sesotho"
    ]

    // Comprehensive list of Lesotho institutions and their entry requirements (based on ECOL requirements)
    const institutions = [
        {
            name: "National University of Lesotho (NUL)",
            location: "Roma",
            type: "Public University",
            website: "www.nul.ls",
            prospectus: "Offers undergraduate and postgraduate programs in sciences, humanities, social sciences, education, and law. Known for research excellence and community engagement.",
            courses: [
                { name: "Bachelor of Science in Computer Science", requirements: ["Mathematics C", "English C", "Physics C"], duration: "4 years", fees: "M25,000/year" },
                { name: "Bachelor of Science in Agriculture", requirements: ["Mathematics C", "English C", "Biology C"], duration: "4 years", fees: "M22,000/year" },
                { name: "Bachelor of Arts in Education", requirements: ["English C", "Any two subjects C"], duration: "4 years", fees: "M20,000/year" },
                { name: "Bachelor of Commerce", requirements: ["Mathematics C", "English C", "Business Studies C"], duration: "4 years", fees: "M24,000/year" },
                { name: "Bachelor of Laws (LLB)", requirements: ["English B", "Any two subjects C"], duration: "4 years", fees: "M28,000/year" },
                { name: "Bachelor of Science in Nursing", requirements: ["English C", "Mathematics C", "Biology C", "Chemistry C"], duration: "4 years", fees: "M26,000/year" },
                { name: "Bachelor of Science in Environmental Science", requirements: ["Mathematics C", "English C", "Geography C"], duration: "4 years", fees: "M23,000/year" }
            ]
        },
        {
            name: "Limkokwing University of Creative Technology",
            location: "Maseru",
            type: "Private University",
            website: "www.limkokwing.net",
            prospectus: "Specializes in creative technology, business, and design education. Offers industry-relevant programs with strong focus on practical skills and entrepreneurship.",
            courses: [
                { name: "Bachelor of Information Technology", requirements: ["Mathematics C", "English C"], duration: "4 years", fees: "M35,000/year" },
                { name: "Bachelor of Business Administration", requirements: ["Mathematics C", "English C"], duration: "4 years", fees: "M32,000/year" },
                { name: "Bachelor of Design (Graphic Design)", requirements: ["English C", "Any art subject C"], duration: "4 years", fees: "M38,000/year" },
                { name: "Bachelor of Culinary Arts", requirements: ["English C", "Mathematics D"], duration: "4 years", fees: "M36,000/year" },
                { name: "Bachelor of Hospitality Management", requirements: ["English C", "Mathematics D"], duration: "4 years", fees: "M34,000/year" }
            ]
        },
        {
            name: "Lesotho College of Education (LCE)",
            location: "Maseru",
            type: "Public College",
            website: "www.lce.ac.ls",
            prospectus: "Primary teacher training institution offering diploma programs. Focuses on developing competent educators for Lesotho's education system.",
            courses: [
                { name: "Diploma in Primary Education", requirements: ["English C", "Mathematics C"], duration: "3 years", fees: "M15,000/year" },
                { name: "Diploma in Secondary Education (Mathematics)", requirements: ["English C", "Mathematics B"], duration: "3 years", fees: "M15,000/year" },
                { name: "Diploma in Secondary Education (English)", requirements: ["English B", "Any two subjects C"], duration: "3 years", fees: "M15,000/year" },
                { name: "Diploma in Secondary Education (Science)", requirements: ["English C", "Mathematics C", "Science subject C"], duration: "3 years", fees: "M15,000/year" }
            ]
        },
        {
            name: "Lerotholi Polytechnic",
            location: "Maseru",
            type: "Public Polytechnic",
            website: "www.lpolytechnic.ac.ls",
            prospectus: "Technical and vocational education provider offering diploma and certificate programs in engineering, business, and applied sciences.",
            courses: [
                { name: "Diploma in Electrical Engineering", requirements: ["Mathematics C", "English C", "Physics C"], duration: "3 years", fees: "M18,000/year" },
                { name: "Diploma in Civil Engineering", requirements: ["Mathematics C", "English C", "Physics C"], duration: "3 years", fees: "M18,000/year" },
                { name: "Diploma in Business Studies", requirements: ["Mathematics C", "English C"], duration: "3 years", fees: "M16,000/year" },
                { name: "Diploma in Information Technology", requirements: ["Mathematics C", "English C"], duration: "3 years", fees: "M17,000/year" },
                { name: "Certificate in Automotive Mechanics", requirements: ["Mathematics D", "English D"], duration: "2 years", fees: "M12,000/year" }
            ]
        },
        {
            name: "Scott Hospital Nursing School",
            location: "Maseru",
            type: "Nursing College",
            website: "www.scotthospital.co.ls",
            prospectus: "Specialized nursing education institution affiliated with Scott Hospital. Provides comprehensive nursing training programs.",
            courses: [
                { name: "Diploma in General Nursing", requirements: ["English C", "Mathematics C", "Biology C", "Chemistry C"], duration: "3 years", fees: "M20,000/year" },
                { name: "Certificate in Community Health Nursing", requirements: ["English C", "Mathematics D", "Biology C"], duration: "2 years", fees: "M15,000/year" }
            ]
        },
        {
            name: "Paray School of Nursing",
            location: "Maseru",
            type: "Nursing College",
            website: "www.paray.ac.ls",
            prospectus: "Private nursing school offering quality nursing education with modern facilities and experienced faculty.",
            courses: [
                { name: "Diploma in General Nursing", requirements: ["English C", "Mathematics C", "Biology C", "Chemistry C"], duration: "3 years", fees: "M25,000/year" },
                { name: "Bachelor of Science in Nursing", requirements: ["English C", "Mathematics C", "Biology C", "Chemistry C"], duration: "4 years", fees: "M30,000/year" }
            ]
        },
        {
            name: "Institute of Development Management (IDM)",
            location: "Maseru",
            type: "Management Institute",
            website: "www.idm.ls",
            prospectus: "Regional center for development management education. Offers specialized programs in public administration, business management, and development studies.",
            courses: [
                { name: "Master of Public Administration", requirements: ["Bachelor's degree", "English proficiency"], duration: "2 years", fees: "M40,000/year" },
                { name: "Bachelor of Business Administration", requirements: ["Mathematics C", "English C"], duration: "4 years", fees: "M28,000/year" },
                { name: "Diploma in Development Studies", requirements: ["English C", "Any two subjects C"], duration: "2 years", fees: "M20,000/year" }
            ]
        },
        {
            name: "Lesotho Agricultural College",
            location: "Maseru",
            type: "Agricultural College",
            website: "www.agricollege.ac.ls",
            prospectus: "Specialized agricultural education institution focusing on sustainable farming, agribusiness, and rural development.",
            courses: [
                { name: "Diploma in Agriculture", requirements: ["Mathematics C", "English C", "Biology C"], duration: "3 years", fees: "M16,000/year" },
                { name: "Certificate in Animal Health", requirements: ["Mathematics D", "English C", "Biology C"], duration: "2 years", fees: "M12,000/year" },
                { name: "Diploma in Agribusiness", requirements: ["Mathematics C", "English C"], duration: "3 years", fees: "M18,000/year" }
            ]
        }
    ]

    // Job recommendations for graduates
    const jobRecommendations = [
        {
            title: "Software Engineer",
            company: "Lesotho Tech Solutions",
            location: "Maseru",
            salary: "M150k-200k",
            requirements: "Bachelor's in Computer Science, GPA 3.0+, Distinction/Merit pass",
            minGpa: 3.0,
            degrees: ["Computer Science", "Information Technology", "Software Engineering"],
            qualificationLevels: ["degree"]
        },
        {
            title: "Registered Nurse",
            company: "Queen Mamohato Memorial Hospital",
            location: "Maseru",
            salary: "M90k-130k",
            requirements: "Bachelor's in Nursing, GPA 3.0+, Clinical competence required",
            minGpa: 3.0,
            degrees: ["Nursing", "Health Sciences"],
            qualificationLevels: ["degree"]
        },
        {
            title: "Accountant",
            company: "Lesotho Revenue Authority",
            location: "Maseru",
            salary: "M100k-140k",
            requirements: "Bachelor's in Accounting, GPA 3.0+, ACCA/CIMA qualification",
            minGpa: 3.0,
            degrees: ["Accounting", "Finance", "Business Administration"],
            qualificationLevels: ["degree"]
        }
    ]

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login")
        }
    }, [user, loading, router])

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>
    }

    if (!user || user.role !== "student") {
        return null
    }

    const addLgcseResult = () => {
        if (newSubject && newGrade) {
            const existingIndex = lgcseResults.findIndex(result => result.subject === newSubject)
            if (existingIndex !== -1) {
                const updatedResults = [...lgcseResults]
                updatedResults[existingIndex] = { subject: newSubject, grade: newGrade }
                setLgcseResults(updatedResults)
            } else {
                setLgcseResults([...lgcseResults, { subject: newSubject, grade: newGrade }])
            }
            setNewSubject("")
            setNewGrade("")
        }
    }

    const calculateGPA = (results) => {
        const gradePoints = { 'A*': 5, 'A': 4, 'B': 3, 'C': 2, 'D': 1 }
        const totalPoints = results.reduce((sum, result) => sum + (gradePoints[result.grade] || 0), 0)
        return results.length > 0 ? (totalPoints / results.length).toFixed(2) : 0
    }

    const handleSubmitResults = () => {
        const gpa = parseFloat(calculateGPA(lgcseResults))
        const studentSubjects = lgcseResults.map(r => r.subject)

        const qualified = LESOTHO_INSTITUTIONS.flatMap(inst =>
            inst.courses.filter(course => {
                const courseReqs = COURSE_SPECIFIC_REQUIREMENTS[course.name] || QUALIFICATION_REQUIREMENTS[course.level] || QUALIFICATION_REQUIREMENTS.degree
                const requirements = courseReqs.requiredSubjects || []

                const gpaQualified = gpa >= courseReqs.minimumGpa
                const subjectsQualified = requirements.every(req =>
                    studentSubjects.includes(req) &&
                    lgcseResults.find(r => r.subject === req && ['A*', 'A', 'B', 'C'].includes(r.grade))
                )

                return gpaQualified && subjectsQualified
            })
                .map(course => ({
                    ...course,
                    institution: inst.name,
                    location: inst.location,
                    requirements: courseReqs.requiredSubjects || []
                }))
        )

        const groupedCourses = qualified.reduce((acc, course) => {
            if (!acc[course.institution]) {
                acc[course.institution] = {}
            }
            if (!acc[course.institution][course.faculty]) {
                acc[course.institution][course.faculty] = []
            }
            acc[course.institution][course.faculty].push(course)
            return acc
        }, {})

        setQualifiedCourses(groupedCourses)
    }

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

    const handleApply = (job) => {
        setSelectedJob(job)
        setApplicationDialogOpen(true)
    }

    const handleSubmitApplication = async () => {
        if (!applicationForm.fullName || !applicationForm.email || !applicationForm.coverLetter) {
            toast({
                title: "Error",
                description: "Please fill in all required fields",
                variant: "destructive"
            })
            return
        }

        try {
            await submitApplication({
                ...applicationForm,
                jobId: selectedJob.title,
                jobTitle: selectedJob.title,
                company: selectedJob.company
            })

            toast({
                title: "Application Submitted",
                description: "Your application has been submitted successfully",
            })

            setApplicationDialogOpen(false)
            setApplicationForm({
                fullName: "",
                email: "",
                phone: "",
                coverLetter: "",
                resume: null
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to submit application",
                variant: "destructive"
            })
        }
    }

    const handleFileUpload = (event) => {
        const file = event.target.files[0]
        if (file) {
            // Check if file is .doc or .docx
            const allowedExtensions = ['.doc', '.docx']
            const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))
            if (!allowedExtensions.includes(fileExtension)) {
                toast({
                    title: "Invalid File Type",
                    description: "Only Microsoft Word documents (.doc, .docx) are allowed",
                    variant: "destructive"
                })
                return
            }
            setApplicationForm(prev => ({
                ...prev,
                resume: file
            }))
        }
    }

    const handleProfileUpdate = () => {
        // Handle profile update logic
        toast({
            title: "Profile Updated",
            description: "Your profile has been updated successfully",
        })
        setProfileDialogOpen(false)
    }

    const handleTranscriptUpload = (event) => {
        const file = event.target.files[0]
        if (file) {
            const allowedExtensions = ['.doc', '.docx']
            const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))
            if (!allowedExtensions.includes(fileExtension)) {
                toast({
                    title: "Invalid File Type",
                    description: "Only Microsoft Word documents (.doc, .docx) are allowed",
                    variant: "destructive"
                })
                return
            }
            setTranscriptData(prev => ({
                ...prev,
                transcripts: [...prev.transcripts, file]
            }))
        }
    }

    const handleCertificateUpload = (event) => {
        const file = event.target.files[0]
        if (file) {
            const allowedExtensions = ['.doc', '.docx']
            const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))
            if (!allowedExtensions.includes(fileExtension)) {
                toast({
                    title: "Invalid File Type",
                    description: "Only Microsoft Word documents (.doc, .docx) are allowed",
                    variant: "destructive"
                })
                return
            }
            setTranscriptData(prev => ({
                ...prev,
                certificates: [...prev.certificates, file]
            }))
        }
    }

    const applyForCourse = (course, institution) => {
        const applicationsForInstitution = appliedCourses.filter(app => app.institution === institution).length
        if (applicationsForInstitution >= 2) {
            toast({
                title: "Application Limit Reached",
                description: `You can only apply for maximum 2 courses per institution. You have already applied for ${applicationsForInstitution} courses at ${institution}.`,
                variant: "destructive"
            })
            return
        }

        setAppliedCourses([...appliedCourses, {
            ...course,
            institution,
            appliedDate: new Date().toISOString(),
            status: "Pending"
        }])

        toast({
            title: "Application Submitted",
            description: `Your application for ${course.name} at ${institution} has been submitted.`,
        })
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        onClick={() => router.push("/")}
                        className="mb-4 p-2"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Home
                    </Button>
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">Career Guidance Platform</h1>
                    <p className="text-slate-600">Your comprehensive career development companion</p>
                </div>

                {/* Information Section */}
                <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-blue-800">
                            <Award className="h-6 w-6" />
                            How Our Platform Helps Students & Graduates
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-semibold text-lg mb-3 text-blue-700">For Students (LGCSE Graduates)</h3>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span>Course qualification checking based on LGCSE results</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span>Apply for up to 2 courses per institution</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span>View admissions results and application status</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span>Upload academic transcripts and certificates</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span>Receive notifications for job opportunities</span>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-3 text-purple-700">For Graduates (Job Seekers)</h3>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span>Personalized job recommendations based on qualifications</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span>Apply for job positions with resume upload</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span>Access to free certificate courses for skill enhancement</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span>International collaboration platforms for networking</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span>Professional development resources and courses</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Main Module Tabs */}
                <Tabs defaultValue="student" className="mb-8">
                    <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
                        <TabsTrigger value="student">Student Module</TabsTrigger>
                        <TabsTrigger value="graduate">Graduate Module</TabsTrigger>
                    </TabsList>

                    {/* Student Module */}
                    <TabsContent value="student">
                        <div className="space-y-8">
                            {/* Quick Stats */}
                            <div className="grid md:grid-cols-4 gap-6">
                                <Card>
                                    <CardContent className="pt-6">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-blue-100 rounded-lg">
                                                <TrendingUp className="h-6 w-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold">{appliedCourses.length}</p>
                                                <p className="text-sm text-slate-600">Course Applications</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="pt-6">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-green-100 rounded-lg">
                                                <GraduationCap className="h-6 w-6 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold">{admissionsResults.length}</p>
                                                <p className="text-sm text-slate-600">Admissions Results</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="pt-6">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-purple-100 rounded-lg">
                                                <BookOpen className="h-6 w-6 text-purple-600" />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold">{transcriptData.transcripts.length + transcriptData.certificates.length}</p>
                                                <p className="text-sm text-slate-600">Uploaded Documents</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="pt-6">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-orange-100 rounded-lg">
                                                <Bell className="h-6 w-6 text-orange-600" />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold">{notifications.length}</p>
                                                <p className="text-sm text-slate-600">Notifications</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Student Actions */}
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <Card className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <GraduationCap className="h-5 w-5" />
                                            Institution Browser
                                        </CardTitle>
                                        <CardDescription>Explore universities and colleges</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Button className="w-full" onClick={() => router.push("/institution")}>
                                            Browse Institutions
                                        </Button>
                                    </CardContent>
                                </Card>

                                <Card className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <FileCheck className="h-5 w-5" />
                                            View Applications
                                        </CardTitle>
                                        <CardDescription>Check your course applications</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Button variant="outline" className="w-full">
                                            View Applications
                                        </Button>
                                    </CardContent>
                                </Card>

                                <Card className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Edit className="h-5 w-5" />
                                            Update Profile
                                        </CardTitle>
                                        <CardDescription>Manage your personal information</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Button variant="outline" className="w-full" onClick={() => setProfileDialogOpen(true)}>
                                            Update Profile
                                        </Button>
                                    </CardContent>
                                </Card>

                                <Card className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Upload className="h-5 w-5" />
                                            Upload Documents
                                        </CardTitle>
                                        <CardDescription>Upload transcripts and certificates</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Button variant="outline" className="w-full" onClick={() => setTranscriptDialogOpen(true)}>
                                            Upload Documents
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Course Applications Section */}
                            {appliedCourses.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Your Course Applications</CardTitle>
                                        <CardDescription>Track the status of your course applications</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {appliedCourses.map((application, index) => (
                                                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                                                    <div>
                                                        <h3 className="font-medium">{application.name}</h3>
                                                        <p className="text-sm text-slate-600">{application.institution}</p>
                                                        <p className="text-xs text-slate-500">Applied: {new Date(application.appliedDate).toLocaleDateString()}</p>
                                                    </div>
                                                    <Badge variant={application.status === "Accepted" ? "default" : "secondary"}>
                                                        {application.status}
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* LGCSE Results Section */}
                            <Tabs defaultValue="manual" className="mb-8">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                                    <TabsTrigger value="upload">Upload Transcript</TabsTrigger>
                                </TabsList>

                                <TabsContent value="manual">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <CheckCircle className="h-5 w-5" />
                                                LGCSE Results & Course Qualification
                                            </CardTitle>
                                            <CardDescription>Enter your LGCSE results to see which courses you qualify for</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                <Button
                                                    onClick={() => setShowResultsForm(!showResultsForm)}
                                                    variant="outline"
                                                    className="w-full"
                                                >
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    {showResultsForm ? "Hide Results Form" : "Add LGCSE Results"}
                                                </Button>

                                                {showResultsForm && (
                                                    <div className="grid md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg">
                                                        <Select value={newSubject} onValueChange={setNewSubject}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select Subject" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {lgcseSubjects.map(subject => (
                                                                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>

                                                        <Select value={newGrade} onValueChange={setNewGrade}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select Grade" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="D">D</SelectItem>
                                                                <SelectItem value="C">C</SelectItem>
                                                                <SelectItem value="B">B</SelectItem>
                                                                <SelectItem value="A">A</SelectItem>
                                                                <SelectItem value="A*">A*</SelectItem>
                                                            </SelectContent>
                                                        </Select>

                                                        <Button onClick={addLgcseResult}>Add Result</Button>
                                                    </div>
                                                )}

                                                {lgcseResults.length > 0 && (
                                                    <div className="mt-4">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <h4 className="font-medium">Your LGCSE Results:</h4>
                                                            <Button
                                                                onClick={handleSubmitResults}
                                                                className="bg-green-600 hover:bg-green-700"
                                                                disabled={lgcseResults.length < 8}
                                                            >
                                                                <CheckCircle className="h-4 w-4 mr-2" />
                                                                Submit Results & Check Qualification
                                                            </Button>
                                                        </div>
                                                        {lgcseResults.length < 8 && (
                                                            <p className="text-sm text-amber-600 mb-2">
                                                                Please add at least 8 subjects to check qualification (currently {lgcseResults.length})
                                                            </p>
                                                        )}
                                                        <Table>
                                                            <TableHeader>
                                                                <TableRow>
                                                                    <TableHead>Subject</TableHead>
                                                                    <TableHead>Grade</TableHead>
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {lgcseResults.map((result, index) => (
                                                                    <TableRow key={index}>
                                                                        <TableCell>{result.subject}</TableCell>
                                                                        <TableCell>
                                                                            <Badge variant={result.grade === "A*" || result.grade === "A" ? "default" : "secondary"}>
                                                                                {result.grade}
                                                                            </Badge>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </div>
                                                )}

                                                {Object.keys(qualifiedCourses).length > 0 && (
                                                    <div className="mt-6">
                                                        <h4 className="font-medium mb-4 text-green-700">Courses You Qualify For:</h4>
                                                        <div className="space-y-6">
                                                            {Object.entries(qualifiedCourses).map(([institution, faculties]) => (
                                                                <Card key={institution} className="border-green-200">
                                                                    <CardHeader>
                                                                        <CardTitle className="text-lg text-green-800">{institution}</CardTitle>
                                                                    </CardHeader>
                                                                    <CardContent>
                                                                        {Object.entries(faculties).map(([faculty, courses]) => (
                                                                            <div key={faculty} className="mb-4 last:mb-0">
                                                                                <h5 className="font-medium text-green-700 mb-3">{faculty}</h5>
                                                                                <div className="grid md:grid-cols-2 gap-3">
                                                                                    {courses.map((course, index) => (
                                                                                        <Card key={index} className="border-slate-200">
                                                                                            <CardContent className="pt-4">
                                                                                                <h6 className="font-medium text-slate-800">{course.name}</h6>
                                                                                                <div className="flex items-center gap-2 mt-1">
                                                                                                    <Badge variant="outline" className="text-xs">
                                                                                                        {course.level}
                                                                                                    </Badge>
                                                                                                    <Badge variant="secondary" className="text-xs">
                                                                                                        {course.duration}
                                                                                                    </Badge>
                                                                                                </div>
                                                                                                <div className="mt-2">
                                                                                                    <p className="text-xs text-slate-500">Requirements met:</p>
                                                                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                                                                        {course.requirements.map((req, i) => (
                                                                                                            <Badge key={i} variant="outline" className="text-xs">
                                                                                                                {req}
                                                                                                            </Badge>
                                                                                                        ))}
                                                                                                    </div>
                                                                                                </div>
                                                                                                <Button
                                                                                                    size="sm"
                                                                                                    onClick={() => applyForCourse(course, institution)}
                                                                                                    className="mt-2"
                                                                                                >
                                                                                                    Apply Now
                                                                                                </Button>
                                                                                            </CardContent>
                                                                                        </Card>
                                                                                    ))}
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </CardContent>
                                                                </Card>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                <TabsContent value="upload">
                                                    <Card>
                                                        <CardHeader>
                                                            <CardTitle className="flex items-center gap-2">
                                                                <Upload className="h-5 w-5" />
                                                                Upload Transcript for Qualification Check
                                                            </CardTitle>
                                                            <CardDescription>Upload your LGCSE transcript to automatically check course qualifications</CardDescription>
                                                        </CardHeader>
                                                        <CardContent>
                                                            <TranscriptUpload />
                                                        </CardContent>
                                                    </Card>
                                                </TabsContent>
                                            </Tabs>

                                            {/* Profile Update Dialog */}
                                            <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Update Profile</DialogTitle>
                                                        <DialogDescription>Update your personal information</DialogDescription>
                                                    </DialogHeader>
                                                    <div className="space-y-4">
                                                        <Input
                                                            placeholder="Phone Number"
                                                            value={profileData.phone}
                                                            onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                                                        />
                                                        <Textarea
                                                            placeholder="Address"
                                                            value={profileData.address}
                                                            onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                                                        />
                                                        <Input
                                                            placeholder="Emergency Contact"
                                                            value={profileData.emergencyContact}
                                                            onChange={(e) => setProfileData(prev => ({ ...prev, emergencyContact: e.target.value }))}
                                                        />
                                                        <Button onClick={handleProfileUpdate} className="w-full">
                                                            Update Profile
                                                        </Button>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>

                                            {/* Transcript Upload Dialog */}
                                            <Dialog open={transcriptDialogOpen} onOpenChange={setTranscriptDialogOpen}>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Upload Documents</DialogTitle>
                                                        <DialogDescription>Upload your academic transcripts and certificates</DialogDescription>
                                                    </DialogHeader>
                                                    <div className="space-y-4">
                                                        <div>
                                                            <label className="block text-sm font-medium mb-2">Transcripts</label>
                                                            <Input
                                                                type="file"
                                                                accept=".doc,.docx"
                                                                onChange={handleTranscriptUpload}
                                                                multiple
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium mb-2">Certificates</label>
                                                            <Input
                                                                type="file"
                                                                accept=".doc,.docx"
                                                                onChange={handleCertificateUpload}
                                                                multiple
                                                            />
                                                        </div>
                                                        {transcriptData.transcripts.length > 0 && (
                                                            <div>
                                                                <h4 className="font-medium mb-2">Uploaded Transcripts:</h4>
                                                                <ul className="space-y-1">
                                                                    {transcriptData.transcripts.map((file, index) => (
                                                                        <li key={index} className="text-sm text-slate-600">{file.name}</li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}
                                                        {transcriptData.certificates.length > 0 && (
                                                            <div>
                                                                <h4 className="font-medium mb-2">Uploaded Certificates:</h4>
                                                                <ul className="space-y-1">
                                                                    {transcriptData.certificates.map((file, index) => (
                                                                        <li key={index} className="text-sm text-slate-600">{file.name}</li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                </TabsContent>

                                {/* Graduate Module */}
                                <TabsContent value="graduate">
                                    <div className="space-y-8">
                                        {/* Graduate Assessment */}
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <Briefcase className="h-5 w-5" />
                                                    Graduate Assessment & Job Recommendations
                                                </CardTitle>
                                                <CardDescription>Enter your qualifications to get personalized job recommendations</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="grid md:grid-cols-4 gap-4 mb-6">
                                                    <Input
                                                        placeholder="GPA (e.g., 3.5)"
                                                        value={gpa}
                                                        onChange={(e) => setGpa(e.target.value)}
                                                    />
                                                    <Select value={qualificationLevel} onValueChange={setQualificationLevel}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Qualification Level" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="certificate">Certificate</SelectItem>
                                                            <SelectItem value="diploma">Diploma</SelectItem>
                                                            <SelectItem value="degree">Degree</SelectItem>
                                                            <SelectItem value="masters">Masters</SelectItem>
                                                            <SelectItem value="phd">PhD</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <Input
                                                        placeholder="Field of Study"
                                                        value={field}
                                                        onChange={(e) => setField(e.target.value)}
                                                    />
                                                    <Input
                                                        placeholder="Institution"
                                                        value={institution}
                                                        onChange={(e) => setInstitution(e.target.value)}
                                                    />
                                                </div>
                                                <Button
                                                    onClick={() => setShowJobRecommendations(!showJobRecommendations)}
                                                    className="w-full"
                                                >
                                                    <Target className="h-4 w-4 mr-2" />
                                                    {showJobRecommendations ? "Hide Job Recommendations" : "Get Job Recommendations"}
                                                </Button>
                                            </CardContent>
                                        </Card>

                                        {/* Job Recommendations */}
                                        {showJobRecommendations && recommendedJobs.length > 0 && (
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle>Recommended Jobs for You</CardTitle>
                                                    <CardDescription>Based on your qualifications and GPA</CardDescription>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="space-y-4">
                                                        {recommendedJobs.map((job, index) => (
                                                            <Card key={index} className="border-slate-200">
                                                                <CardContent className="pt-4">
                                                                    <div className="flex justify-between items-start">
                                                                        <div>
                                                                            <h3 className="font-medium text-lg">{job.title}</h3>
                                                                            <p className="text-slate-600">{job.company} - {job.location}</p>
                                                                            <p className="text-sm text-slate-500 mt-1">{job.requirements}</p>
                                                                            <p className="text-sm font-medium text-green-600 mt-1">Salary: {job.salary}</p>
                                                                        </div>
                                                                        <Button onClick={() => handleApply(job)}>
                                                                            Apply Now
                                                                        </Button>
                                                                    </div>
                                                                </CardContent>
                                                            </Card>
                                                        ))}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )}

                                        {/* Job Applications */}
                                        {jobApplications.length > 0 && (
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle>Your Job Applications</CardTitle>
                                                    <CardDescription>Track your job application status</CardDescription>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="space-y-4">
                                                        {jobApplications.map((application, index) => (
                                                            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                                                                <div>
                                                                    <h3 className="font-medium">{application.jobTitle}</h3>
                                                                    <p className="text-sm text-slate-600">{application.company}</p>
                                                                    <p className="text-xs text-slate-500">Applied: {new Date(application.appliedDate).toLocaleDateString()}</p>
                                                                </div>
                                                                <Badge variant={application.status === "Accepted" ? "default" : "secondary"}>
                                                                    {application.status}
                                                                </Badge>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )}

                                        {/* Job Application Dialog */}
                                        <Dialog open={applicationDialogOpen} onOpenChange={setApplicationDialogOpen}>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Apply for {selectedJob?.title}</DialogTitle>
                                                    <DialogDescription>Submit your application for this position</DialogDescription>
                                                </DialogHeader>
                                                <div className="space-y-4">
                                                    <Input
                                                        placeholder="Full Name"
                                                        value={applicationForm.fullName}
                                                        onChange={(e) => setApplicationForm(prev => ({ ...prev, fullName: e.target.value }))}
                                                    />
                                                    <Input
                                                        placeholder="Email"
                                                        type="email"
                                                        value={applicationForm.email}
                                                        onChange={(e) => setApplicationForm(prev => ({ ...prev, email: e.target.value }))}
                                                    />
                                                    <Input
                                                        placeholder="Phone Number"
                                                        value={applicationForm.phone}
                                                        onChange={(e) => setApplicationForm(prev => ({ ...prev, phone: e.target.value }))}
                                                    />
                                                    <Textarea
                                                        placeholder="Cover Letter"
                                                        value={applicationForm.coverLetter}
                                                        onChange={(e) => setApplicationForm(prev => ({ ...prev, coverLetter: e.target.value }))}
                                                    />
                                                    <div>
                                                        <label className="block text-sm font-medium mb-2">Resume (Word Document)</label>
                                                        <Input
                                                            type="file"
                                                            accept=".doc,.docx"
                                                            onChange={handleFileUpload}
                                                        />
                                                    </div>
                                                    <Button onClick={handleSubmitApplication} className="w-full">
                                                        Submit Application
                                                    </Button>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                    )
                }
