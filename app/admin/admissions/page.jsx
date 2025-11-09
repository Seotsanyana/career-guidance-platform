"use client"

import { useAuth } from "@/lib/auth-context-updated"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GraduationCap, Users, BookOpen, Calendar, Search, ArrowLeft, Plus, Eye, Megaphone } from "lucide-react"

// Mock admissions data
const mockAdmissions = [
    {
        id: "adm_1",
        title: "2024 Undergraduate Admissions",
        institution: "University of Lesotho",
        type: "undergraduate",
        status: "published",
        applications: 1247,
        deadline: "2024-08-31",
        description: "Applications for undergraduate programs for the 2024 academic year",
        requirements: "LGCSE with minimum C average, birth certificate, ID copy",
        publishedDate: "2024-01-15",
        courses: ["Computer Science", "Business Administration", "Education", "Engineering"]
    },
    {
        id: "adm_2",
        title: "2024 Postgraduate Programs",
        institution: "National University of Lesotho",
        type: "postgraduate",
        status: "draft",
        applications: 0,
        deadline: "2024-09-15",
        description: "Masters and PhD programs for the 2024 academic year",
        requirements: "Bachelor's degree, transcripts, research proposal",
        publishedDate: null,
        courses: ["MBA", "MSc Computer Science", "PhD Education"]
    }
]

// Mock student applications
const mockApplications = [
    {
        id: "app_1",
        studentName: "Lebohang Mokete",
        studentEmail: "lebohang.mokete@email.com",
        institution: "University of Lesotho",
        program: "Computer Science",
        status: "pending_review",
        appliedDate: "2024-02-15",
        documents: ["transcript.pdf", "id_copy.pdf", "birth_certificate.pdf"]
    },
    {
        id: "app_2",
        studentName: "Mpho Ntlama",
        studentEmail: "mpho.ntlama@email.com",
        institution: "National University of Lesotho",
        program: "Business Administration",
        status: "approved",
        appliedDate: "2024-02-10",
        documents: ["transcript.pdf", "id_copy.pdf", "recommendation_letter.pdf"]
    }
]

export default function AdmissionsPage() {
    const { user, loading } = useAuth()
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [admissions, setAdmissions] = useState(mockAdmissions)
    const [applications, setApplications] = useState(mockApplications)
    const [selectedAdmission, setSelectedAdmission] = useState(null)
    const [selectedApplication, setSelectedApplication] = useState(null)
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
    const [isApplicationDialogOpen, setIsApplicationDialogOpen] = useState(false)
    const [newAdmission, setNewAdmission] = useState({
        title: "",
        institution: "",
        type: "",
        description: "",
        requirements: "",
        deadline: "",
        courses: ""
    })

    useEffect(() => {
        if (!loading && (!user || user.role !== "admin")) {
            router.push("/login")
        }
    }, [user, loading, router])

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>
    }

    if (!user || user.role !== "admin") {
        return null
    }

    const filteredAdmissions = admissions.filter(admission => {
        const matchesSearch = admission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            admission.institution.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === "all" || admission.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const filteredApplications = applications.filter(app => {
        const matchesSearch = app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.program.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesSearch
    })

    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case "published": return "default"
            case "draft": return "secondary"
            case "closed": return "outline"
            case "pending_review": return "secondary"
            case "approved": return "default"
            case "rejected": return "destructive"
            default: return "outline"
        }
    }

    const handleCreateAdmission = () => {
        const admission = {
            id: `adm_${Date.now()}`,
            ...newAdmission,
            status: "draft",
            applications: 0,
            publishedDate: null,
            courses: newAdmission.courses.split(",").map(c => c.trim())
        }
        setAdmissions([...admissions, admission])
        setNewAdmission({
            title: "",
            institution: "",
            type: "",
            description: "",
            requirements: "",
            deadline: "",
            courses: ""
        })
        setIsCreateDialogOpen(false)
    }

    const handlePublishAdmission = (id) => {
        setAdmissions(admissions.map(admission =>
            admission.id === id ? {
                ...admission,
                status: "published",
                publishedDate: new Date().toISOString().split('T')[0]
            } : admission
        ))
    }

    const handleApproveApplication = (id) => {
        setApplications(applications.map(app =>
            app.id === id ? { ...app, status: "approved" } : app
        ))
    }

    const handleRejectApplication = (id) => {
        setApplications(applications.map(app =>
            app.id === id ? { ...app, status: "rejected" } : app
        ))
    }

    const getAdmissionsStats = () => {
        const published = admissions.filter(a => a.status === "published").length
        const draft = admissions.filter(a => a.status === "draft").length
        const totalApplications = admissions.reduce((sum, a) => sum + a.applications, 0)
        const pendingApplications = applications.filter(a => a.status === "pending_review").length
        return { published, draft, totalApplications, pendingApplications }
    }

    const stats = getAdmissionsStats()

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        onClick={() => router.push("/admin")}
                        className="mb-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Dashboard
                    </Button>
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">Student Admissions</h1>
                    <p className="text-slate-600">Publish admissions and monitor student applications</p>
                </div>

                {/* Stats Overview */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <Megaphone className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{admissions.length}</p>
                                    <p className="text-sm text-slate-600">Total Admissions</p>
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
                                    <p className="text-2xl font-bold">{stats.published}</p>
                                    <p className="text-sm text-slate-600">Published</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-purple-100 rounded-lg">
                                    <Users className="h-6 w-6 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{stats.totalApplications}</p>
                                    <p className="text-sm text-slate-600">Total Applications</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-orange-100 rounded-lg">
                                    <BookOpen className="h-6 w-6 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{stats.pendingApplications}</p>
                                    <p className="text-sm text-slate-600">Pending Review</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="admissions" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="admissions">Manage Admissions</TabsTrigger>
                        <TabsTrigger value="applications">Review Applications</TabsTrigger>
                    </TabsList>

                    <TabsContent value="admissions">
                        {/* Search and Add */}
                        <div className="flex flex-col md:flex-row gap-4 mb-6">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        placeholder="Search admissions by title or institution..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-full md:w-48">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="published">Published</SelectItem>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="closed">Closed</SelectItem>
                                </SelectContent>
                            </Select>
                            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Create Admission
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>Create New Admission</DialogTitle>
                                        <DialogDescription>
                                            Create a new admission announcement for students
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="title">Admission Title</Label>
                                                <Input
                                                    id="title"
                                                    value={newAdmission.title}
                                                    onChange={(e) => setNewAdmission({ ...newAdmission, title: e.target.value })}
                                                    placeholder="e.g., 2024 Undergraduate Admissions"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="institution">Institution</Label>
                                                <Input
                                                    id="institution"
                                                    value={newAdmission.institution}
                                                    onChange={(e) => setNewAdmission({ ...newAdmission, institution: e.target.value })}
                                                    placeholder="e.g., University of Lesotho"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="type">Type</Label>
                                                <Select value={newAdmission.type} onValueChange={(value) => setNewAdmission({ ...newAdmission, type: value })}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="undergraduate">Undergraduate</SelectItem>
                                                        <SelectItem value="postgraduate">Postgraduate</SelectItem>
                                                        <SelectItem value="diploma">Diploma</SelectItem>
                                                        <SelectItem value="certificate">Certificate</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <Label htmlFor="deadline">Application Deadline</Label>
                                                <Input
                                                    id="deadline"
                                                    type="date"
                                                    value={newAdmission.deadline}
                                                    onChange={(e) => setNewAdmission({ ...newAdmission, deadline: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <Label htmlFor="courses">Available Courses</Label>
                                            <Input
                                                id="courses"
                                                value={newAdmission.courses}
                                                onChange={(e) => setNewAdmission({ ...newAdmission, courses: e.target.value })}
                                                placeholder="e.g., Computer Science, Business Administration, Education"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="description">Description</Label>
                                            <Textarea
                                                id="description"
                                                value={newAdmission.description}
                                                onChange={(e) => setNewAdmission({ ...newAdmission, description: e.target.value })}
                                                placeholder="Detailed description of the admission"
                                                rows={3}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="requirements">Requirements</Label>
                                            <Textarea
                                                id="requirements"
                                                value={newAdmission.requirements}
                                                onChange={(e) => setNewAdmission({ ...newAdmission, requirements: e.target.value })}
                                                placeholder="Admission requirements and documents needed"
                                                rows={3}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                                            Cancel
                                        </Button>
                                        <Button onClick={handleCreateAdmission}>
                                            Create Admission
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>

                        {/* Admissions Table */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Admissions ({filteredAdmissions.length})</CardTitle>
                                <CardDescription>Manage admission announcements and publications</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Title</TableHead>
                                            <TableHead>Institution</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Applications</TableHead>
                                            <TableHead>Deadline</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredAdmissions.map((admission) => (
                                            <TableRow key={admission.id}>
                                                <TableCell className="font-medium">{admission.title}</TableCell>
                                                <TableCell>{admission.institution}</TableCell>
                                                <TableCell className="capitalize">{admission.type}</TableCell>
                                                <TableCell>{admission.applications}</TableCell>
                                                <TableCell>{new Date(admission.deadline).toLocaleDateString()}</TableCell>
                                                <TableCell>
                                                    <Badge variant={getStatusBadgeVariant(admission.status)}>
                                                        {admission.status.charAt(0).toUpperCase() + admission.status.slice(1)}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => {
                                                                setSelectedAdmission(admission)
                                                                setIsDetailsDialogOpen(true)
                                                            }}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        {admission.status === "draft" && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="text-green-600 hover:text-green-700"
                                                                onClick={() => handlePublishAdmission(admission.id)}
                                                            >
                                                                <Megaphone className="h-4 w-4 mr-1" />
                                                                Publish
                                                            </Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="applications">
                        {/* Applications Table */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Student Applications ({filteredApplications.length})</CardTitle>
                                <CardDescription>Review and process student applications</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Student Name</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Institution</TableHead>
                                            <TableHead>Program</TableHead>
                                            <TableHead>Applied Date</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredApplications.map((application) => (
                                            <TableRow key={application.id}>
                                                <TableCell className="font-medium">{application.studentName}</TableCell>
                                                <TableCell>{application.studentEmail}</TableCell>
                                                <TableCell>{application.institution}</TableCell>
                                                <TableCell>{application.program}</TableCell>
                                                <TableCell>{new Date(application.appliedDate).toLocaleDateString()}</TableCell>
                                                <TableCell>
                                                    <Badge variant={getStatusBadgeVariant(application.status)}>
                                                        {application.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => {
                                                                setSelectedApplication(application)
                                                                setIsApplicationDialogOpen(true)
                                                            }}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        {application.status === "pending_review" && (
                                                            <>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="text-green-600 hover:text-green-700"
                                                                    onClick={() => handleApproveApplication(application.id)}
                                                                >
                                                                    Approve
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="text-red-600 hover:text-red-700"
                                                                    onClick={() => handleRejectApplication(application.id)}
                                                                >
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
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Admission Details Dialog */}
                <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Admission Details</DialogTitle>
                            <DialogDescription>
                                Detailed information about the admission
                            </DialogDescription>
                        </DialogHeader>
                        {selectedAdmission && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="font-semibold">Title</Label>
                                        <p>{selectedAdmission.title}</p>
                                    </div>
                                    <div>
                                        <Label className="font-semibold">Institution</Label>
                                        <p>{selectedAdmission.institution}</p>
                                    </div>
                                    <div>
                                        <Label className="font-semibold">Type</Label>
                                        <p className="capitalize">{selectedAdmission.type}</p>
                                    </div>
                                    <div>
                                        <Label className="font-semibold">Applications</Label>
                                        <p>{selectedAdmission.applications}</p>
                                    </div>
                                    <div>
                                        <Label className="font-semibold">Deadline</Label>
                                        <p>{new Date(selectedAdmission.deadline).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <Label className="font-semibold">Status</Label>
                                        <Badge variant={getStatusBadgeVariant(selectedAdmission.status)}>
                                            {selectedAdmission.status.charAt(0).toUpperCase() + selectedAdmission.status.slice(1)}
                                        </Badge>
                                    </div>
                                </div>
                                <div>
                                    <Label className="font-semibold">Courses</Label>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {selectedAdmission.courses.map((course, index) => (
                                            <Badge key={index} variant="outline">{course}</Badge>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <Label className="font-semibold">Description</Label>
                                    <p className="text-sm text-slate-600 mt-1">{selectedAdmission.description}</p>
                                </div>
                                <div>
                                    <Label className="font-semibold">Requirements</Label>
                                    <p className="text-sm text-slate-600 mt-1">{selectedAdmission.requirements}</p>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Application Details Dialog */}
                <Dialog open={isApplicationDialogOpen} onOpenChange={setIsApplicationDialogOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Application Details</DialogTitle>
                            <DialogDescription>
                                Detailed information about the student application
                            </DialogDescription>
                        </DialogHeader>
                        {selectedApplication && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="font-semibold">Student Name</Label>
                                        <p>{selectedApplication.studentName}</p>
                                    </div>
                                    <div>
                                        <Label className="font-semibold">Email</Label>
                                        <p>{selectedApplication.studentEmail}</p>
                                    </div>
                                    <div>
                                        <Label className="font-semibold">Institution</Label>
                                        <p>{selectedApplication.institution}</p>
                                    </div>
                                    <div>
                                        <Label className="font-semibold">Program</Label>
                                        <p>{selectedApplication.program}</p>
                                    </div>
                                    <div>
                                        <Label className="font-semibold">Applied Date</Label>
                                        <p>{new Date(selectedApplication.appliedDate).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <Label className="font-semibold">Status</Label>
                                        <Badge variant={getStatusBadgeVariant(selectedApplication.status)}>
                                            {selectedApplication.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                        </Badge>
                                    </div>
                                </div>
                                <div>
                                    <Label className="font-semibold">Submitted Documents</Label>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {selectedApplication.documents.map((doc, index) => (
                                            <Badge key={index} variant="outline">{doc}</Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}
