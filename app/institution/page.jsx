"use client"

import { useAuth } from "@/lib/auth-context-updated"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Users, BookOpen, TrendingUp, Plus, Eye, CheckCircle, XCircle, Clock, Edit, Trash2, UserPlus, GraduationCap, FileText, Settings } from "lucide-react"
import { getApplicationsByInstitution, updateApplicationStatus, getInstitutionName, getCourseName } from "@/lib/applications"
import { LESOTHO_INSTITUTIONS, getInstitutionById } from "@/lib/institutions-data"
import { getFacultiesByInstitution, createFaculty, updateFaculty, deleteFaculty } from "@/lib/institution-faculties"
import { getCoursesByInstitution, createCourse, updateCourse, deleteCourse, searchCourses } from "@/lib/institution-courses"
import { getAdmissionsByInstitution, createAdmission, updateAdmission, publishAdmission, unpublishAdmission, deleteAdmission } from "@/lib/institution-admissions"

export default function InstitutionDashboard() {
    const { user, loading } = useAuth()
    const router = useRouter()
    const [applications, setApplications] = useState([])
    const [selectedApplication, setSelectedApplication] = useState(null)
    const [applicationDialogOpen, setApplicationDialogOpen] = useState(false)

    // Faculty management state
    const [faculties, setFaculties] = useState([])
    const [facultyDialogOpen, setFacultyDialogOpen] = useState(false)
    const [selectedFaculty, setSelectedFaculty] = useState(null)
    const [facultyForm, setFacultyForm] = useState({ name: '', description: '', dean: '', contactEmail: '', contactPhone: '' })

    // Course management state
    const [courses, setCourses] = useState([])
    const [courseDialogOpen, setCourseDialogOpen] = useState(false)
    const [selectedCourse, setSelectedCourse] = useState(null)
    const [courseForm, setCourseForm] = useState({
        name: '', code: '', level: '', faculty: '', duration: '', fees: '', requirements: [], description: '', capacity: 50
    })
    const [courseSearch, setCourseSearch] = useState('')

    // Admissions management state
    const [admissions, setAdmissions] = useState([])
    const [admissionDialogOpen, setAdmissionDialogOpen] = useState(false)
    const [selectedAdmission, setSelectedAdmission] = useState(null)
    const [admissionForm, setAdmissionForm] = useState({
        title: '', type: '', description: '', requirements: [], courses: [], deadline: ''
    })

    // Profile management state
    const [profileDialogOpen, setProfileDialogOpen] = useState(false)
    const [profileForm, setProfileForm] = useState({
        name: '', type: '', location: '', description: '', website: '', phone: ''
    })

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login")
        }
    }, [user, loading, router])

    useEffect(() => {
        if (user && user.role === "institution") {
            // Load applications for this institution
            const institutionApplications = getApplicationsByInstitution(user.id)
            setApplications(institutionApplications)

            // Load faculties
            const institutionFaculties = getFacultiesByInstitution(user.id)
            setFaculties(institutionFaculties)

            // Load courses
            const institutionCourses = getCoursesByInstitution(user.id)
            setCourses(institutionCourses)

            // Load admissions
            const institutionAdmissions = getAdmissionsByInstitution(user.id)
            setAdmissions(institutionAdmissions)

            // Initialize profile form
            const institutionData = user.institutionData || getInstitutionById(user.id)
            if (institutionData) {
                setProfileForm({
                    name: institutionData.name || '',
                    type: institutionData.type || '',
                    location: institutionData.location || '',
                    description: institutionData.description || '',
                    website: institutionData.website || '',
                    phone: institutionData.phone || ''
                })
            }
        }
    }, [user])

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>
    }

    if (!user || user.role !== "institution") {
        return null
    }

    // Use institution data from user object, fallback to predefined data
    const institutionData = user.institutionData || getInstitutionById(user.id)

    if (!institutionData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">Institution Profile Not Found</h2>
                    <p className="text-gray-600 mb-4">Your institution information is not available in our system.</p>
                    <Button onClick={() => router.push("/login")}>Return to Login</Button>
                </div>
            </div>
        )
    }

    const totalApplications = applications.length
    const pendingApplications = applications.filter(app => app.status === 'pending').length
    const acceptedApplications = applications.filter(app => app.status === 'accepted').length
    const rejectedApplications = applications.filter(app => app.status === 'rejected').length

    // Faculty management functions
    const handleFacultySubmit = () => {
        if (selectedFaculty) {
            const updatedFaculty = updateFaculty(selectedFaculty.id, facultyForm)
            if (updatedFaculty) {
                setFaculties(prev => prev.map(f => f.id === selectedFaculty.id ? updatedFaculty : f))
            }
        } else {
            const newFaculty = createFaculty({
                ...facultyForm,
                institutionId: user.id
            })
            setFaculties(prev => [...prev, newFaculty])
        }
        setFacultyDialogOpen(false)
        setSelectedFaculty(null)
        setFacultyForm({ name: '', description: '', dean: '', contactEmail: '', contactPhone: '' })
    }

    const handleFacultyEdit = (faculty) => {
        setSelectedFaculty(faculty)
        setFacultyForm({
            name: faculty.name,
            description: faculty.description,
            dean: faculty.dean,
            contactEmail: faculty.contactEmail,
            contactPhone: faculty.contactPhone
        })
        setFacultyDialogOpen(true)
    }

    const handleFacultyDelete = (facultyId) => {
        if (confirm('Are you sure you want to delete this faculty?')) {
            deleteFaculty(facultyId)
            setFaculties(prev => prev.filter(f => f.id !== facultyId))
        }
    }

    // Course management functions
    const handleCourseSubmit = () => {
        if (selectedCourse) {
            const updatedCourse = updateCourse(selectedCourse.id, courseForm)
            if (updatedCourse) {
                setCourses(prev => prev.map(c => c.id === selectedCourse.id ? updatedCourse : c))
            }
        } else {
            const newCourse = createCourse({
                ...courseForm,
                institutionId: user.id
            })
            setCourses(prev => [...prev, newCourse])
        }
        setCourseDialogOpen(false)
        setSelectedCourse(null)
        setCourseForm({
            name: '', code: '', level: '', faculty: '', duration: '', fees: '', requirements: [], description: '', capacity: 50
        })
    }

    const handleCourseEdit = (course) => {
        setSelectedCourse(course)
        setCourseForm({
            name: course.name,
            code: course.code,
            level: course.level,
            faculty: course.faculty,
            duration: course.duration,
            fees: course.fees,
            requirements: course.requirements || [],
            description: course.description,
            capacity: course.capacity
        })
        setCourseDialogOpen(true)
    }

    const handleCourseDelete = (courseId) => {
        if (confirm('Are you sure you want to delete this course?')) {
            deleteCourse(courseId)
            setCourses(prev => prev.filter(c => c.id !== courseId))
        }
    }

    // Admissions management functions
    const handleAdmissionSubmit = () => {
        if (selectedAdmission) {
            const updatedAdmission = updateAdmission(selectedAdmission.id, admissionForm)
            if (updatedAdmission) {
                setAdmissions(prev => prev.map(a => a.id === selectedAdmission.id ? updatedAdmission : a))
            }
        } else {
            const newAdmission = createAdmission({
                ...admissionForm,
                institutionId: user.id
            })
            setAdmissions(prev => [...prev, newAdmission])
        }
        setAdmissionDialogOpen(false)
        setSelectedAdmission(null)
        setAdmissionForm({
            title: '', type: '', description: '', requirements: [], courses: [], deadline: ''
        })
    }

    const handleAdmissionEdit = (admission) => {
        setSelectedAdmission(admission)
        setAdmissionForm({
            title: admission.title,
            type: admission.type,
            description: admission.description,
            requirements: admission.requirements || [],
            courses: admission.courses || [],
            deadline: admission.deadline
        })
        setAdmissionDialogOpen(true)
    }

    const handleAdmissionDelete = (admissionId) => {
        if (confirm('Are you sure you want to delete this admission?')) {
            deleteAdmission(admissionId)
            setAdmissions(prev => prev.filter(a => a.id !== admissionId))
        }
    }

    const handlePublishAdmission = (admissionId) => {
        const updatedAdmission = publishAdmission(admissionId)
        if (updatedAdmission) {
            setAdmissions(prev => prev.map(a => a.id === admissionId ? updatedAdmission : a))
        }
    }

    const handleUnpublishAdmission = (admissionId) => {
        const updatedAdmission = unpublishAdmission(admissionId)
        if (updatedAdmission) {
            setAdmissions(prev => prev.map(a => a.id === admissionId ? updatedAdmission : a))
        }
    }

    // Profile management functions
    const handleProfileSubmit = () => {
        // In a real app, this would update the institution profile in the database
        console.log('Updating institution profile:', profileForm)
        setProfileDialogOpen(false)
    }

    const handleApplicationAction = (applicationId, action) => {
        const updatedApplication = updateApplicationStatus(applicationId, action)
        if (updatedApplication) {
            setApplications(prev => prev.map(app =>
                app.id === applicationId ? updatedApplication : app
            ))
        }
        setApplicationDialogOpen(false)
        setSelectedApplication(null)
    }

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending':
                return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>
            case 'accepted':
                return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Accepted</Badge>
            case 'rejected':
                return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    const filteredCourses = courseSearch ? searchCourses(user.id, courseSearch) : courses

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">Institution Dashboard</h1>
                    <p className="text-slate-600">Manage your institution, courses, and student applications</p>
                    <p className="text-sm text-slate-500 mt-2">Welcome, {institutionData?.name}</p>
                </div>

                {/* Key Metrics */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <BookOpen className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{courses.length}</p>
                                    <p className="text-sm text-slate-600">Active Courses</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <Users className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{faculties.length}</p>
                                    <p className="text-sm text-slate-600">Faculties</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-yellow-100 rounded-lg">
                                    <Clock className="h-6 w-6 text-yellow-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{pendingApplications}</p>
                                    <p className="text-sm text-slate-600">Pending Applications</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-purple-100 rounded-lg">
                                    <FileText className="h-6 w-6 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{admissions.filter(a => a.status === 'published').length}</p>
                                    <p className="text-sm text-slate-600">Published Admissions</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Tabs */}
                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-6">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="faculties">Faculties</TabsTrigger>
                        <TabsTrigger value="courses">Courses</TabsTrigger>
                        <TabsTrigger value="admissions">Admissions</TabsTrigger>
                        <TabsTrigger value="applications">Applications</TabsTrigger>
                        <TabsTrigger value="profile">Profile</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                        {/* Institution Profile */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building2 className="h-5 w-5" />
                                    Institution Profile
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div>
                                        <label className="text-sm font-medium text-slate-700">Institution Type</label>
                                        <p className="text-slate-900 font-medium">{institutionData?.type}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-slate-700">Location</label>
                                        <p className="text-slate-900">{institutionData?.location}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-slate-700">Established</label>
                                        <p className="text-slate-900">{institutionData?.established}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-slate-700">Website</label>
                                        <a href={institutionData?.website} target="_blank" rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 underline">
                                            Visit Website
                                        </a>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <label className="text-sm font-medium text-slate-700">Description</label>
                                    <p className="text-slate-600 mt-1">{institutionData?.description}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                                <CardDescription>Common tasks and shortcuts</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <Button onClick={() => setFacultyDialogOpen(true)} className="h-20 flex-col gap-2">
                                        <UserPlus className="h-6 w-6" />
                                        Add Faculty
                                    </Button>
                                    <Button onClick={() => setCourseDialogOpen(true)} className="h-20 flex-col gap-2">
                                        <BookOpen className="h-6 w-6" />
                                        Add Course
                                    </Button>
                                    <Button onClick={() => setAdmissionDialogOpen(true)} className="h-20 flex-col gap-2">
                                        <FileText className="h-6 w-6" />
                                        Publish Admission
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Faculties Tab */}
                    <TabsContent value="faculties" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <CardTitle>Faculty Management</CardTitle>
                                        <CardDescription>Manage academic faculties and departments</CardDescription>
                                    </div>
                                    <Button onClick={() => setFacultyDialogOpen(true)}>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Faculty
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {faculties.length > 0 ? (
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {faculties.map((faculty) => (
                                            <Card key={faculty.id} className="border-slate-200">
                                                <CardContent className="pt-4">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div className="flex-1">
                                                            <h5 className="font-medium text-slate-800 mb-1">{faculty.name}</h5>
                                                            <p className="text-sm text-slate-600 mb-2">{faculty.description}</p>
                                                            <div className="text-xs text-slate-500">
                                                                <p>Dean: {faculty.dean || 'Not assigned'}</p>
                                                                <p>Courses: {faculty.courseCount}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-1">
                                                            <Button size="sm" variant="outline" onClick={() => handleFacultyEdit(faculty)}>
                                                                <Edit className="w-3 h-3" />
                                                            </Button>
                                                            <Button size="sm" variant="outline" onClick={() => handleFacultyDelete(faculty.id)}>
                                                                <Trash2 className="w-3 h-3" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                                        <p className="text-slate-600">No faculties configured</p>
                                        <Button onClick={() => setFacultyDialogOpen(true)} className="mt-4">
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add First Faculty
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Courses Tab */}
                    <TabsContent value="courses" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <CardTitle>Course Management</CardTitle>
                                        <CardDescription>Manage academic courses and programs</CardDescription>
                                    </div>
                                    <Button onClick={() => setCourseDialogOpen(true)}>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Course
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="mb-4">
                                    <Input
                                        placeholder="Search courses..."
                                        value={courseSearch}
                                        onChange={(e) => setCourseSearch(e.target.value)}
                                        className="max-w-sm"
                                    />
                                </div>
                                {filteredCourses.length > 0 ? (
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {filteredCourses.map((course) => (
                                            <Card key={course.id} className="border-slate-200 hover:shadow-md transition-shadow">
                                                <CardContent className="pt-4">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div className="flex-1">
                                                            <h5 className="font-medium text-slate-800 mb-1">{course.name}</h5>
                                                            <p className="text-sm text-slate-600 mb-2">{course.faculty}</p>
                                                            <div className="flex gap-2 mb-2">
                                                                <Badge variant="outline" className="text-xs">
                                                                    {course.level}
                                                                </Badge>
                                                                <Badge variant="secondary" className="text-xs">
                                                                    {course.duration}
                                                                </Badge>
                                                            </div>
                                                            {course.fees && (
                                                                <p className="text-sm text-green-600 font-medium mb-1">
                                                                    Fees: {course.fees}
                                                                </p>
                                                            )}
                                                            <div className="text-xs text-slate-500">
                                                                <p>Capacity: {course.enrolled}/{course.capacity}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-1">
                                                            <Button size="sm" variant="outline" onClick={() => handleCourseEdit(course)}>
                                                                <Edit className="w-3 h-3" />
                                                            </Button>
                                                            <Button size="sm" variant="outline" onClick={() => handleCourseDelete(course.id)}>
                                                                <Trash2 className="w-3 h-3" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                                        <p className="text-slate-600">No courses configured</p>
                                        <Button onClick={() => setCourseDialogOpen(true)} className="mt-4">
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add First Course
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Admissions Tab */}
                    <TabsContent value="admissions" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <CardTitle>Admissions Management</CardTitle>
                                        <CardDescription>Publish and manage admission announcements</CardDescription>
                                    </div>
                                    <Button onClick={() => setAdmissionDialogOpen(true)}>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Create Admission
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {admissions.length > 0 ? (
                                    <div className="space-y-4">
                                        {admissions.map((admission) => (
                                            <Card key={admission.id} className="border-slate-200">
                                                <CardContent className="pt-4">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <h5 className="font-medium text-slate-800">{admission.title}</h5>
                                                                <Badge variant={admission.status === 'published' ? 'default' : 'secondary'}>
                                                                    {admission.status}
                                                                </Badge>
                                                            </div>
                                                            <p className="text-sm text-slate-600 mb-2">{admission.description}</p>
                                                            <div className="grid md:grid-cols-3 gap-4 text-xs text-slate-500">
                                                                <div>
                                                                    <p className="font-medium">Type: {admission.type}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="font-medium">Deadline: {new Date(admission.deadline).toLocaleDateString()}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="font-medium">Applications: {admission.applicationsCount}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-1">
                                                            {admission.status === 'draft' && (
                                                                <Button size="sm" onClick={() => handlePublishAdmission(admission.id)}>
                                                                    Publish
                                                                </Button>
                                                            )}
                                                            {admission.status === 'published' && (
                                                                <Button size="sm" variant="outline" onClick={() => handleUnpublishAdmission(admission.id)}>
                                                                    Unpublish
                                                                </Button>
                                                            )}
                                                            <Button size="sm" variant="outline" onClick={() => handleAdmissionEdit(admission)}>
                                                                <Edit className="w-3 h-3" />
                                                            </Button>
                                                            <Button size="sm" variant="outline" onClick={() => handleAdmissionDelete(admission.id)}>
                                                                <Trash2 className="w-3 h-3" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                                        <p className="text-slate-600">No admissions published</p>
                                        <Button onClick={() => setAdmissionDialogOpen(true)} className="mt-4">
                                            <Plus className="w-4 h-4 mr-2" />
                                            Create First Admission
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Applications Tab */}
                    <TabsContent value="applications" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Student Applications</CardTitle>
                                <CardDescription>Review and manage applications for your courses</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {applications.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Applicant</TableHead>
                                                <TableHead>Course Applied</TableHead>
                                                <TableHead>Application Date</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {applications.map((application) => (
                                                <TableRow key={application.id}>
                                                    <TableCell>
                                                        <div>
                                                            <p className="font-medium">{application.fullName}</p>
                                                            <p className="text-sm text-slate-600">{application.email}</p>
                                                            <p className="text-sm text-slate-600">{application.phone}</p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <p className="font-medium">{getCourseName(application.institutionId, application.courseName)}</p>
                                                    </TableCell>
                                                    <TableCell>
                                                        {new Date(application.submittedAt).toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell>
                                                        {getStatusBadge(application.status)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex gap-2">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => {
                                                                    setSelectedApplication(application)
                                                                    setApplicationDialogOpen(true)
                                                                }}
                                                            >
                                                                <Eye className="w-4 h-4 mr-1" />
                                                                View
                                                            </Button>
                                                            {application.status === 'pending' && (
                                                                <>
                                                                    <Button
                                                                        size="sm"
                                                                        className="bg-green-600 hover:bg-green-700"
                                                                        onClick={() => handleApplicationAction(application.id, 'accepted')}
                                                                    >
                                                                        <CheckCircle className="w-4 h-4 mr-1" />
                                                                        Accept
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="destructive"
                                                                        onClick={() => handleApplicationAction(application.id, 'rejected')}
                                                                    >
                                                                        <XCircle className="w-4 h-4 mr-1" />
                                                                        Reject
                                                                    </Button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <div className="text-center py-8">
                                        <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                                        <p className="text-slate-600">No applications received yet</p>
                                        <p className="text-sm text-slate-500">Applications from graduates will appear here</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Profile Tab */}
                    <TabsContent value="profile" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <CardTitle>Institution Profile</CardTitle>
                                        <CardDescription>Update your institution information</CardDescription>
                                    </div>
                                    <Button onClick={() => setProfileDialogOpen(true)}>
                                        <Settings className="w-4 h-4 mr-2" />
                                        Edit Profile
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-sm font-medium text-slate-700">Institution Name</label>
                                        <p className="text-slate-900 font-medium">{profileForm.name}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-slate-700">Type</label>
                                        <p className="text-slate-900">{profileForm.type}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-slate-700">Location</label>
                                        <p className="text-slate-900">{profileForm.location}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-slate-700">Website</label>
                                        <p className="text-slate-900">{profileForm.website}</p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-sm font-medium text-slate-700">Description</label>
                                        <p className="text-slate-600 mt-1">{profileForm.description}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Faculty Dialog */}
                <Dialog open={facultyDialogOpen} onOpenChange={setFacultyDialogOpen}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>{selectedFaculty ? 'Edit Faculty' : 'Add New Faculty'}</DialogTitle>
                            <DialogDescription>
                                {selectedFaculty ? 'Update faculty information' : 'Create a new faculty for your institution'}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="faculty-name">Faculty Name</Label>
                                <Input
                                    id="faculty-name"
                                    value={facultyForm.name}
                                    onChange={(e) => setFacultyForm({ ...facultyForm, name: e.target.value })}
                                    placeholder="e.g., Faculty of Science"
                                />
                            </div>
                            <div>
                                <Label htmlFor="faculty-description">Description</Label>
                                <Textarea
                                    id="faculty-description"
                                    value={facultyForm.description}
                                    onChange={(e) => setFacultyForm({ ...facultyForm, description: e.target.value })}
                                    placeholder="Brief description of the faculty"
                                />
                            </div>
                            <div>
                                <Label htmlFor="faculty-dean">Dean</Label>
                                <Input
                                    id="faculty-dean"
                                    value={facultyForm.dean}
                                    onChange={(e) => setFacultyForm({ ...facultyForm, dean: e.target.value })}
                                    placeholder="Dean name"
                                />
                            </div>
                            <div>
                                <Label htmlFor="faculty-email">Contact Email</Label>
                                <Input
                                    id="faculty-email"
                                    type="email"
                                    value={facultyForm.contactEmail}
                                    onChange={(e) => setFacultyForm({ ...facultyForm, contactEmail: e.target.value })}
                                    placeholder="faculty@university.ls"
                                />
                            </div>
                            <div>
                                <Label htmlFor="faculty-phone">Contact Phone</Label>
                                <Input
                                    id="faculty-phone"
                                    value={facultyForm.contactPhone}
                                    onChange={(e) => setFacultyForm({ ...facultyForm, contactPhone: e.target.value })}
                                    placeholder="+266 XXX XXX XXX"
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setFacultyDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleFacultySubmit}>
                                    {selectedFaculty ? 'Update' : 'Create'} Faculty
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Course Dialog */}
                <Dialog open={courseDialogOpen} onOpenChange={setCourseDialogOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>{selectedCourse ? 'Edit Course' : 'Add New Course'}</DialogTitle>
                            <DialogDescription>
                                {selectedCourse ? 'Update course information' : 'Create a new course for your institution'}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="course-name">Course Name</Label>
                                    <Input
                                        id="course-name"
                                        value={courseForm.name}
                                        onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                                        placeholder="e.g., Bachelor of Science in Biology"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="course-code">Course Code</Label>
                                    <Input
                                        id="course-code"
                                        value={courseForm.code}
                                        onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value })}
                                        placeholder="e.g., BIO101"
                                    />
                                </div>
                            </div>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="course-level">Level</Label>
                                    <Select value={courseForm.level} onValueChange={(value) => setCourseForm({ ...courseForm, level: value })}>
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
                                <div>
                                    <Label htmlFor="course-faculty">Faculty</Label>
                                    <Select value={courseForm.faculty} onValueChange={(value) => setCourseForm({ ...courseForm, faculty: value })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select faculty" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {faculties.map((faculty) => (
                                                <SelectItem key={faculty.id} value={faculty.name}>
                                                    {faculty.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="course-duration">Duration</Label>
                                    <Input
                                        id="course-duration"
                                        value={courseForm.duration}
                                        onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
