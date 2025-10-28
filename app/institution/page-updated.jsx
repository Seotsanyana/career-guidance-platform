"use client"

import { useAuth } from "@/lib/auth-context-updated"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Building2, Users, BookOpen, TrendingUp, Plus, Eye, CheckCircle, XCircle, Clock } from "lucide-react"
import { getApplicationsByInstitution, updateApplicationStatus, getInstitutionName, getCourseName } from "@/lib/applications"
import { LESOTHO_INSTITUTIONS, getInstitutionById } from "@/lib/institutions-data"

export default function InstitutionDashboard() {
    const { user, loading } = useAuth()
    const router = useRouter()
    const [applications, setApplications] = useState([])
    const [selectedApplication, setSelectedApplication] = useState(null)
    const [applicationDialogOpen, setApplicationDialogOpen] = useState(false)

    useEffect(() => {
        if (!loading && (!user || user.role !== "institution")) {
            router.push("/login")
        }
    }, [user, loading, router])

    useEffect(() => {
        if (user && user.role === "institution") {
            // Load applications for this institution
            const institutionApplications = getApplicationsByInstitution(user.id)
            setApplications(institutionApplications)
        }
    }, [user])

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>
    }

    if (!user || user.role !== "institution") {
        return null
    }

    const institutionData = getInstitutionById(user.id)
    const totalApplications = applications.length
    const pendingApplications = applications.filter(app => app.status === 'pending').length
    const acceptedApplications = applications.filter(app => app.status === 'accepted').length
    const rejectedApplications = applications.filter(app => app.status === 'rejected').length

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">Institution Dashboard</h1>
                    <p className="text-slate-600">Manage your courses and review student applications</p>
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
                                    <p className="text-2xl font-bold">{institutionData?.courses?.length || 0}</p>
                                    <p className="text-sm text-slate-600">Active Courses</p>
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
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <CheckCircle className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{acceptedApplications}</p>
                                    <p className="text-sm text-slate-600">Accepted Applications</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-orange-100 rounded-lg">
                                    <TrendingUp className="h-6 w-6 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{totalApplications}</p>
                                    <p className="text-sm text-slate-600">Total Applications</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Applications Table */}
                <Card className="mb-8">
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

                {/* Institution Courses */}
                <Card>
                    <CardHeader>
                        <CardTitle>Your Courses</CardTitle>
                        <CardDescription>Courses offered by {institutionData?.name}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {institutionData?.courses && institutionData.courses.length > 0 ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {institutionData.courses.map((course, index) => (
                                    <Card key={index} className="border-slate-200">
                                        <CardContent className="pt-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex-1">
                                                    <h5 className="font-medium text-slate-800">{course.name}</h5>
                                                    <p className="text-sm text-slate-600">{course.faculty}</p>
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
                        ) : (
                            <div className="text-center py-8">
                                <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                                <p className="text-slate-600">No courses configured</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Application Details Dialog */}
                <Dialog open={applicationDialogOpen} onOpenChange={setApplicationDialogOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Application Details</DialogTitle>
                            <DialogDescription>
                                Review the complete application from {selectedApplication?.fullName}
                            </DialogDescription>
                        </DialogHeader>
                        {selectedApplication && (
                            <div className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-slate-700">Full Name</label>
                                        <p className="text-slate-900">{selectedApplication.fullName}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-slate-700">Email</label>
                                        <p className="text-slate-900">{selectedApplication.email}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-slate-700">Phone</label>
                                        <p className="text-slate-900">{selectedApplication.phone}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-slate-700">Course Applied</label>
                                        <p className="text-slate-900">{getCourseName(selectedApplication.institutionId, selectedApplication.courseName)}</p>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700">Cover Letter</label>
                                    <div className="mt-1 p-3 bg-slate-50 rounded-lg max-h-32 overflow-y-auto">
                                        <p className="text-slate-900 whitespace-pre-wrap">{selectedApplication.coverLetter}</p>
                                    </div>
                                </div>
                                {selectedApplication.resume && (
                                    <div>
                                        <label className="text-sm font-medium text-slate-700">Resume</label>
                                        <div className="mt-1">
                                            <Button variant="outline" size="sm">
                                                <Eye className="w-4 h-4 mr-2" />
                                                View Resume
                                            </Button>
                                        </div>
                                    </div>
                                )}
                                <div className="flex justify-between items-center pt-4 border-t">
                                    <div>
                                        <p className="text-sm text-slate-600">
                                            Submitted on {new Date(selectedApplication.submittedAt).toLocaleDateString()} at {new Date(selectedApplication.submittedAt).toLocaleTimeString()}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        {selectedApplication.status === 'pending' && (
                                            <>
                                                <Button
                                                    variant="destructive"
                                                    onClick={() => handleApplicationAction(selectedApplication.id, 'rejected')}
                                                >
                                                    <XCircle className="w-4 h-4 mr-2" />
                                                    Reject
                                                </Button>
                                                <Button
                                                    className="bg-green-600 hover:bg-green-700"
                                                    onClick={() => handleApplicationAction(selectedApplication.id, 'accepted')}
                                                >
                                                    <CheckCircle className="w-4 h-4 mr-2" />
                                                    Accept
                                                </Button>
                                            </>
                                        )}
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
