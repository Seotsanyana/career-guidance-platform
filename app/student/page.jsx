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
import { GraduationCap, Briefcase, TrendingUp, BookOpen, Users, Target, Plus, CheckCircle, ArrowLeft } from "lucide-react"
import { LESOTHO_INSTITUTIONS } from "@/lib/institutions-data"
import { checkQualification, QUALIFICATION_REQUIREMENTS, COURSE_SPECIFIC_REQUIREMENTS } from "@/lib/qualification-checker"

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

    useEffect(() => {
        if (!loading && (!user || user.role !== "student")) {
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
            // Check if subject already exists
            const existingIndex = lgcseResults.findIndex(result => result.subject === newSubject)
            if (existingIndex !== -1) {
                // Update existing subject grade
                const updatedResults = [...lgcseResults]
                updatedResults[existingIndex] = { subject: newSubject, grade: newGrade }
                setLgcseResults(updatedResults)
            } else {
                // Add new subject
                setLgcseResults([...lgcseResults, { subject: newSubject, grade: newGrade }])
            }
            setNewSubject("")
            setNewGrade("")
        }
    }

    // GPA calculation from LGCSE grades
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

                // Check GPA
                const gpaQualified = gpa >= courseReqs.minimumGpa

                // Check required subjects (assuming grades C or better for requirements)
                const subjectsQualified = requirements.every(req =>
                    studentSubjects.includes(req) &&
                    lgcseResults.find(r => r.subject === req && ['A*', 'A', 'B', 'C'].includes(r.grade))
                )

                return gpaQualified && subjectsQualified
            })
                .map(course => {
                    const courseReqs = COURSE_SPECIFIC_REQUIREMENTS[course.name] || QUALIFICATION_REQUIREMENTS[course.level] || QUALIFICATION_REQUIREMENTS.degree
                    return {
                        ...course,
                        institution: inst.name,
                        location: inst.location,
                        requirements: courseReqs.requiredSubjects || []
                    }
                })
        )
        setQualifiedCourses(qualified)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        onClick={() => router.push("/")}
                        className="mb-4 p-2"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Home
                    </Button>
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">Welcome back, {user.name}!</h1>
                    <p className="text-slate-600">Your career journey continues here</p>
                </div>

                {/* Quick Stats */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <TrendingUp className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">85%</p>
                                    <p className="text-sm text-slate-600">Profile Complete</p>
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
                                    <p className="text-2xl font-bold">5</p>
                                    <p className="text-sm text-slate-600">Institutions Explored</p>
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
                                    <p className="text-2xl font-bold">12</p>
                                    <p className="text-sm text-slate-600">Courses Viewed</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-orange-100 rounded-lg">
                                    <Target className="h-6 w-6 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">3</p>
                                    <p className="text-sm text-slate-600">Subject Assessments</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Actions */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <GraduationCap className="h-5 w-5" />
                                Institution Browser
                            </CardTitle>
                            <CardDescription>Explore universities and colleges in Lesotho</CardDescription>
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
                                <BookOpen className="h-5 w-5" />
                                Course Discovery
                            </CardTitle>
                            <CardDescription>Explore courses from top institutions</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline" className="w-full" onClick={() => router.push("/qualify")}>
                                Find Courses
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Target className="h-5 w-5" />
                                Subject Assessment
                            </CardTitle>
                            <CardDescription>Take assessments to discover your academic strengths</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline" className="w-full" onClick={() => setShowAssessment(true)}>
                                Start Assessment
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* LGCSE Results Section */}
                <Card className="mb-8">
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

                            {qualifiedCourses.length > 0 && (
                                <div className="mt-6">
                                    <h4 className="font-medium mb-2 text-green-700">Courses You Qualify For:</h4>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {qualifiedCourses.map((course, index) => (
                                            <Card key={index} className="border-green-200">
                                                <CardContent className="pt-4">
                                                    <h5 className="font-medium text-green-800">{course.name}</h5>
                                                    <p className="text-sm text-slate-600">{course.institution} • {course.location}</p>
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
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Subject Assessment Modal */}
                {showAssessment && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <Card className="w-full max-w-2xl mx-4">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Target className="h-5 w-5" />
                                    Subject Assessment
                                </CardTitle>
                                <CardDescription>
                                    Choose a subject you studied in high school to start your assessment and discover suitable courses
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Select a subject you enrolled in at high school:
                                        </label>
                                        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Choose a subject" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {lgcseSubjects.map(subject => (
                                                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {selectedSubject && (
                                        <div className="p-4 bg-blue-50 rounded-lg">
                                            <h4 className="font-medium text-blue-800 mb-2">Assessment for {selectedSubject}</h4>
                                            <p className="text-sm text-blue-600 mb-4">
                                                Based on your interest in {selectedSubject}, here are some recommended courses and institutions:
                                            </p>

                                            {/* Recommended courses based on selected subject */}
                                            <div className="space-y-3">
                                                {institutions.flatMap(inst =>
                                                    inst.courses.filter(course =>
                                                        course.requirements.some(req =>
                                                            req.toLowerCase().includes(selectedSubject.toLowerCase()) ||
                                                            selectedSubject.toLowerCase().includes(req.toLowerCase().split(' ')[0])
                                                        )
                                                    ).map(course => (
                                                        <Card key={`${inst.name}-${course.name}`} className="border-blue-200">
                                                            <CardContent className="pt-4">
                                                                <h5 className="font-medium text-blue-800">{course.name}</h5>
                                                                <p className="text-sm text-slate-600">{inst.name} • {inst.location}</p>
                                                                <div className="mt-2 flex items-center justify-between">
                                                                    <div className="flex flex-wrap gap-1">
                                                                        {course.requirements.map((req, i) => (
                                                                            <Badge key={i} variant="outline" className="text-xs">
                                                                                {req}
                                                                            </Badge>
                                                                        ))}
                                                                    </div>
                                                                    <Button
                                                                        size="sm"
                                                                        onClick={() => router.push("/institution")}
                                                                        className="bg-blue-600 hover:bg-blue-700"
                                                                    >
                                                                        View Institution
                                                                    </Button>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex gap-3 pt-4">
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setShowAssessment(false)
                                                setSelectedSubject("")
                                            }}
                                            className="flex-1"
                                        >
                                            Cancel
                                        </Button>
                                        {selectedSubject && (
                                            <Button
                                                onClick={() => {
                                                    setShowAssessment(false)
                                                    setSelectedSubject("")
                                                }}
                                                className="flex-1"
                                            >
                                                Start Assessment
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Recent Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Your latest actions and updates</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <GraduationCap className="h-4 w-4 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium">Researched National University of Lesotho</p>
                                    <p className="text-sm text-slate-600">Institution Browser • 2 days ago</p>
                                </div>
                                <Badge variant="secondary">Viewed</Badge>
                            </div>

                            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <BookOpen className="h-4 w-4 text-green-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium">Completed Mathematics Subject Assessment</p>
                                    <p className="text-sm text-slate-600">Subject Assessment • 1 week ago</p>
                                </div>
                                <Badge className="bg-green-100 text-green-800">Completed</Badge>
                            </div>

                            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <Target className="h-4 w-4 text-purple-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium">Viewed Computer Science course requirements</p>
                                    <p className="text-sm text-slate-600">Course Discovery • 2 weeks ago</p>
                                </div>
                                <Badge className="bg-purple-100 text-purple-800">Viewed</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
