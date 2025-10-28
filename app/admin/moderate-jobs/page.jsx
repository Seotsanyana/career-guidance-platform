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
import { Briefcase, Search, Flag, Check, X, ArrowLeft, Eye } from "lucide-react"

// Mock data for job postings
const mockJobs = [
    { id: 1, title: "Senior Frontend Developer", company: "Tech Corp", location: "New York", status: "active", applications: 24, postedDate: "2024-03-15", flagged: false },
    { id: 2, title: "Full Stack Engineer", company: "StartupXYZ", location: "California", status: "active", applications: 18, postedDate: "2024-03-10", flagged: false },
    { id: 3, title: "DevOps Engineer", company: "CloudTech", location: "Texas", status: "flagged", applications: 12, postedDate: "2024-03-08", flagged: true, flagReason: "Suspicious content" },
    { id: 4, title: "Data Scientist", company: "DataCo", location: "Remote", status: "pending", applications: 0, postedDate: "2024-03-20", flagged: false },
    { id: 5, title: "Product Manager", company: "InnovateInc", location: "Florida", status: "active", applications: 31, postedDate: "2024-03-12", flagged: false },
    { id: 6, title: "UX Designer", company: "DesignStudio", location: "Illinois", status: "rejected", applications: 0, postedDate: "2024-03-18", flagged: true, flagReason: "Inappropriate content" },
]

export default function ModerateJobsPage() {
    const { user, loading } = useAuth()
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")

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

    const filteredJobs = mockJobs.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.company.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === "all" || job.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case "active": return "default"
            case "pending": return "secondary"
            case "flagged": return "destructive"
            case "rejected": return "outline"
            default: return "outline"
        }
    }

    const handleApprove = (id) => {
        // In a real app, this would make an API call
        console.log(`Approving job ${id}`)
    }

    const handleReject = (id) => {
        // In a real app, this would make an API call
        console.log(`Rejecting job ${id}`)
    }

    const handleFlag = (id) => {
        // In a real app, this would make an API call
        console.log(`Flagging job ${id}`)
    }

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
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">Moderate Jobs</h1>
                    <p className="text-slate-600">Monitor and moderate job postings on the platform</p>
                </div>

                {/* Filters */}
                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        placeholder="Search by title or company..."
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
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="flagged">Flagged</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Jobs Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Job Postings ({filteredJobs.length})</CardTitle>
                        <CardDescription>Manage job postings and moderate content</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Job Title</TableHead>
                                    <TableHead>Company</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Applications</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Posted Date</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredJobs.map((job) => (
                                    <TableRow key={job.id}>
                                        <TableCell className="font-medium">{job.title}</TableCell>
                                        <TableCell>{job.company}</TableCell>
                                        <TableCell>{job.location}</TableCell>
                                        <TableCell>{job.applications}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Badge variant={getStatusBadgeVariant(job.status)}>
                                                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                                                </Badge>
                                                {job.flagged && (
                                                    <Badge variant="destructive" className="text-xs">
                                                        <Flag className="h-3 w-3 mr-1" />
                                                        Flagged
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>{new Date(job.postedDate).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                {job.status === "pending" && (
                                                    <>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="text-green-600 hover:text-green-700"
                                                            onClick={() => handleApprove(job.id)}
                                                        >
                                                            <Check className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="text-red-600 hover:text-red-700"
                                                            onClick={() => handleReject(job.id)}
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </>
                                                )}
                                                {job.status === "active" && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-orange-600 hover:text-orange-700"
                                                        onClick={() => handleFlag(job.id)}
                                                    >
                                                        <Flag className="h-4 w-4" />
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
            </div>
        </div>
    )
}
