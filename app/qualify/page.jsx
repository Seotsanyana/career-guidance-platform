"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context-updated"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Search, CheckCircle, XCircle, Info, BookOpen, Briefcase, GraduationCap } from "lucide-react"
import { performOfflineQualificationCheck, checkQualification, checkCareerQualification, getCoursesByQualification, getCoursesByCareer } from "@/lib/qualification-checker"
import { LESOTHO_INSTITUTIONS } from "@/lib/institutions-data"

export default function QualifyPage() {
    const [studentData, setStudentData] = useState({
        gpa: "",
        qualificationLevel: "",
        field: "",
        subjects: [],
        englishProficiency: false
    })
    const [subjectInput, setSubjectInput] = useState("")
    const [qualificationResults, setQualificationResults] = useState(null)
    const [careerResults, setCareerResults] = useState(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [searchResults, setSearchResults] = useState([])
    const { toast } = useToast()

    const addSubject = () => {
        if (subjectInput.trim() && !studentData.subjects.includes(subjectInput.trim())) {
            setStudentData(prev => ({
                ...prev,
                subjects: [...prev.subjects, subjectInput.trim()]
            }))
            setSubjectInput("")
        }
    }

    const removeSubject = (subject) => {
        setStudentData(prev => ({
            ...prev,
            subjects: prev.subjects.filter(s => s !== subject)
        }))
    }

    const checkQualifications = () => {
        if (!studentData.gpa || !studentData.qualificationLevel) {
            toast({
                title: "Missing Information",
                description: "Please enter your GPA and qualification level",
                variant: "destructive"
            })
            return
        }

        const results = performOfflineQualificationCheck(studentData)
        setQualificationResults(results)

        toast({
            title: "Qualification Check Complete",
            description: "Your qualification assessment is ready",
        })
    }

    const checkCareerPath = () => {
        if (!studentData.field) {
            toast({
                title: "Missing Career Field",
                description: "Please select your field of study",
                variant: "destructive"
            })
            return
        }

        const results = checkCareerQualification(studentData, studentData.field)
        setCareerResults(results)
    }

    const searchCourses = () => {
        if (!searchQuery.trim()) return

        const allCourses = LESOTHO_INSTITUTIONS.flatMap(inst =>
            inst.courses.map(course => ({
                ...course,
                institution: inst.name,
                institutionId: inst.id,
                location: inst.location
            }))
        )

        const filtered = allCourses.filter(course =>
            course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.faculty.toLowerCase().includes(searchQuery.toLowerCase())
        )

        setSearchResults(filtered)
    }

    const searchByCareer = () => {
        if (!searchQuery.trim()) return

        const careerCourses = getCoursesByCareer(searchQuery)
        const allCourses = LESOTHO_INSTITUTIONS.flatMap(inst =>
            inst.courses.map(course => ({
                ...course,
                institution: inst.name,
                institutionId: inst.id,
                location: inst.location
            }))
        )

        const filtered = allCourses.filter(course =>
            careerCourses.some(careerCourse =>
                course.name.toLowerCase().includes(careerCourse.name.toLowerCase().split(' ').slice(-2).join(' '))
            )
        )

        setSearchResults(filtered)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">Qualify</h1>
                    <p className="text-slate-600">Check if you qualify for tertiary institutions in Lesotho - Works offline!</p>
                    <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Offline Ready
                        </Badge>
                        <Badge variant="outline">
                            <Info className="w-3 h-3 mr-1" />
                            Free to Use
                        </Badge>
                    </div>
                </div>

                <Tabs defaultValue="qualify" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="qualify">Qualification Check</TabsTrigger>
                        <TabsTrigger value="search">Course Search</TabsTrigger>
                        <TabsTrigger value="career">Career Guidance</TabsTrigger>
                    </TabsList>

                    <TabsContent value="qualify" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Enter Your Academic Profile</CardTitle>
                                <CardDescription>Provide your details to check qualification eligibility</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-slate-700">GPA</label>
                                        <Input
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            max="4"
                                            placeholder="e.g., 3.2"
                                            value={studentData.gpa}
                                            onChange={(e) => setStudentData(prev => ({ ...prev, gpa: e.target.value }))}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-slate-700">Qualification Level</label>
                                        <Select value={studentData.qualificationLevel} onValueChange={(value) => setStudentData(prev => ({ ...prev, qualificationLevel: value }))}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select level" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="certificate">Certificate</SelectItem>
                                                <SelectItem value="diploma">Diploma</SelectItem>
                                                <SelectItem value="degree">Degree</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-slate-700">Field of Study</label>
                                    <Select value={studentData.field} onValueChange={(value) => setStudentData(prev => ({ ...prev, field: value }))}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select your field" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Computer Science">Computer Science</SelectItem>
                                            <SelectItem value="Information Technology">Information Technology</SelectItem>
                                            <SelectItem value="Business Administration">Business Administration</SelectItem>
                                            <SelectItem value="Accounting">Accounting</SelectItem>
                                            <SelectItem value="Engineering">Engineering</SelectItem>
                                            <SelectItem value="Nursing">Nursing</SelectItem>
                                            <SelectItem value="Education">Education</SelectItem>
                                            <SelectItem value="Law">Law</SelectItem>
                                            <SelectItem value="Medicine">Medicine</SelectItem>
                                            <SelectItem value="Agriculture">Agriculture</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-slate-700">Subjects Studied</label>
                                    <div className="flex gap-2 mb-2">
                                        <Input
                                            placeholder="Add subject (e.g., Mathematics)"
                                            value={subjectInput}
                                            onChange={(e) => setSubjectInput(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && addSubject()}
                                        />
                                        <Button onClick={addSubject} size="sm">Add</Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {studentData.subjects.map((subject, index) => (
                                            <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeSubject(subject)}>
                                                {subject} ×
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="english"
                                        checked={studentData.englishProficiency}
                                        onChange={(e) => setStudentData(prev => ({ ...prev, englishProficiency: e.target.checked }))}
                                        className="rounded"
                                    />
                                    <label htmlFor="english" className="text-sm text-slate-700">English Proficiency</label>
                                </div>

                                <Button onClick={checkQualifications} className="w-full">
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Check My Qualifications
                                </Button>
                            </CardContent>
                        </Card>

                        {qualificationResults && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Qualification Results</CardTitle>
                                    <CardDescription>Your eligibility assessment for Lesotho institutions</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="font-medium text-slate-800 mb-2">Possible Careers</h4>
                                            <div className="space-y-2">
                                                {qualificationResults.possibleCareers.map((career, index) => (
                                                    <Badge key={index} variant="outline" className="mr-2 mb-2">
                                                        <Briefcase className="w-3 h-3 mr-1" />
                                                        {career}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-slate-800 mb-2">Recommended Courses ({qualificationResults.qualificationLevel})</h4>
                                            <div className="space-y-2 max-h-40 overflow-y-auto">
                                                {qualificationResults.recommendedCourses.slice(0, 5).map((course, index) => (
                                                    <div key={index} className="text-sm text-slate-600">
                                                        • {course.name} at {course.institution}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    <TabsContent value="search" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Search Courses</CardTitle>
                                <CardDescription>Find courses by name or search by career field</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Search courses (e.g., Computer Science) or careers (e.g., Software Developer)"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && searchCourses()}
                                    />
                                    <Button onClick={searchCourses}>
                                        <Search className="w-4 h-4 mr-2" />
                                        Search Courses
                                    </Button>
                                    <Button onClick={searchByCareer} variant="outline">
                                        <Briefcase className="w-4 h-4 mr-2" />
                                        Search by Career
                                    </Button>
                                </div>

                                {searchResults.length > 0 && (
                                    <div className="space-y-4">
                                        <h4 className="font-medium text-slate-800">Found {searchResults.length} courses</h4>
                                        <div className="grid md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                                            {searchResults.map((course, index) => (
                                                <Card key={index} className="border-slate-200">
                                                    <CardContent className="pt-4">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div className="flex-1">
                                                                <h5 className="font-medium text-slate-800">{course.name}</h5>
                                                                <p className="text-sm text-slate-600">{course.institution} • {course.location}</p>
                                                                <div className="flex gap-2 mt-2">
                                                                    <Badge variant="outline" className="text-xs">
                                                                        {course.level}
                                                                    </Badge>
                                                                    <Badge variant="secondary" className="text-xs">
                                                                        {course.duration}
                                                                    </Badge>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="career" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Career Guidance</CardTitle>
                                <CardDescription>Get career-specific qualification advice</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-slate-700">Select Career Field</label>
                                    <Select value={studentData.field} onValueChange={(value) => setStudentData(prev => ({ ...prev, field: value }))}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose your career interest" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Doctor/Medical Professional">Doctor/Medical Professional</SelectItem>
                                            <SelectItem value="Engineer">Engineer</SelectItem>
                                            <SelectItem value="Software Developer/Programmer">Software Developer/Programmer</SelectItem>
                                            <SelectItem value="Teacher/Educator">Teacher/Educator</SelectItem>
                                            <SelectItem value="Business Professional">Business Professional</SelectItem>
                                            <SelectItem value="Lawyer/Legal Professional">Lawyer/Legal Professional</SelectItem>
                                            <SelectItem value="Nurse">Nurse</SelectItem>
                                            <SelectItem value="Accountant">Accountant</SelectItem>
                                            <SelectItem value="IT Specialist">IT Specialist</SelectItem>
                                            <SelectItem value="Journalist/Media Professional">Journalist/Media Professional</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Button onClick={checkCareerPath} className="w-full">
                                    <GraduationCap className="w-4 h-4 mr-2" />
                                    Get Career Guidance
                                </Button>

                                {careerResults && (
                                    <div className="space-y-4">
                                        <Card>
                                            <CardContent className="pt-4">
                                                <div className="flex items-center gap-2 mb-4">
                                                    {careerResults.qualified ? (
                                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                                    ) : (
                                                        <XCircle className="w-5 h-5 text-red-600" />
                                                    )}
                                                    <span className="font-medium">
                                                        {careerResults.qualified ? "Qualified" : "Not Yet Qualified"}
                                                    </span>
                                                </div>

                                                {careerResults.suitableCourses.length > 0 && (
                                                    <div className="mb-4">
                                                        <h4 className="font-medium text-slate-800 mb-2">Recommended Courses</h4>
                                                        <div className="space-y-2">
                                                            {careerResults.suitableCourses.map((course, index) => (
                                                                <div key={index} className="text-sm text-slate-600">
                                                                    • {course}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {careerResults.alternativePaths.length > 0 && (
                                                    <div className="mb-4">
                                                        <h4 className="font-medium text-slate-800 mb-2">Alternative Paths</h4>
                                                        <div className="space-y-2">
                                                            {careerResults.alternativePaths.map((path, index) => (
                                                                <div key={index} className="text-sm text-slate-600">
                                                                    • {path}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {careerResults.recommendations.length > 0 && (
                                                    <div>
                                                        <h4 className="font-medium text-slate-800 mb-2">Recommendations</h4>
                                                        <div className="space-y-2">
                                                            {careerResults.recommendations.map((rec, index) => (
                                                                <div key={index} className="text-sm text-slate-600">
                                                                    • {rec}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
