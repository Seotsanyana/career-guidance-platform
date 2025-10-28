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
import { Briefcase, Search, TrendingUp, ArrowLeft, Eye } from "lucide-react"

// Mock data for all jobs - diverse careers across sectors
const mockJobs = [
    // Technology Sector
    { id: 1, title: "Senior Frontend Developer", company: "Lesotho Tech Solutions", location: "Maseru", status: "active", applications: 24, postedDate: "2024-03-15", salary: "M120k-150k" },
    { id: 2, title: "Full Stack Engineer", company: "Maseru Innovations", location: "Berea", status: "active", applications: 18, postedDate: "2024-03-10", salary: "M100k-130k" },
    { id: 3, title: "DevOps Engineer", company: "Leribe Digital", location: "Leribe", status: "active", applications: 12, postedDate: "2024-03-08", salary: "M110k-140k" },
    { id: 4, title: "Data Scientist", company: "Mafeteng Analytics", location: "Remote", status: "active", applications: 31, postedDate: "2024-03-12", salary: "M130k-160k" },
    { id: 5, title: "Product Manager", company: "Mohale's Hoek Innovations", location: "Mohale's Hoek", status: "active", applications: 27, postedDate: "2024-03-14", salary: "M140k-170k" },
    { id: 6, title: "UX Designer", company: "Qacha's Nek Creative", location: "Qacha's Nek", status: "active", applications: 19, postedDate: "2024-03-16", salary: "M90k-120k" },
    { id: 7, title: "Backend Developer", company: "Quthing Systems", location: "Quthing", status: "active", applications: 15, postedDate: "2024-03-09", salary: "M105k-135k" },
    { id: 8, title: "Mobile App Developer", company: "Thaba-Tseka Apps", location: "Thaba-Tseka", status: "pending", applications: 0, postedDate: "2024-03-20", salary: "M95k-125k" },
    { id: 9, title: "QA Engineer", company: "Butha-Buthe Quality", location: "Butha-Buthe", status: "active", applications: 22, postedDate: "2024-03-11", salary: "M85k-110k" },
    { id: 10, title: "Security Analyst", company: "Mokhotlong Security", location: "Mokhotlong", status: "flagged", applications: 8, postedDate: "2024-03-13", salary: "M115k-145k" },

    // Healthcare Sector
    { id: 11, title: "Registered Nurse", company: "Queen Mamohato Memorial Hospital", location: "Maseru", status: "active", applications: 35, postedDate: "2024-03-17", salary: "M90k-130k" },
    { id: 12, title: "Medical Doctor", company: "Maseru Private Hospital", location: "Maseru", status: "active", applications: 12, postedDate: "2024-03-14", salary: "M200k-300k" },
    { id: 13, title: "Pharmacist", company: "Lesotho Pharmaceutical Corporation", location: "Maseru", status: "active", applications: 18, postedDate: "2024-03-16", salary: "M120k-160k" },
    { id: 14, title: "Medical Laboratory Scientist", company: "National Health Laboratory", location: "Maseru", status: "active", applications: 22, postedDate: "2024-03-13", salary: "M100k-140k" },

    // Education Sector
    { id: 15, title: "Secondary School Teacher", company: "Ministry of Education", location: "Various Districts", status: "active", applications: 45, postedDate: "2024-03-18", salary: "M80k-120k" },
    { id: 16, title: "Primary School Teacher", company: "Leribe District Education", location: "Leribe", status: "active", applications: 28, postedDate: "2024-03-15", salary: "M70k-100k" },
    { id: 17, title: "Lecturer", company: "National University of Lesotho", location: "Roma", status: "active", applications: 15, postedDate: "2024-03-12", salary: "M150k-220k" },
    { id: 18, title: "Education Administrator", company: "Lesotho College of Education", location: "Maseru", status: "active", applications: 20, postedDate: "2024-03-19", salary: "M110k-150k" },

    // Business & Finance Sector
    { id: 19, title: "Accountant", company: "Lesotho Revenue Authority", location: "Maseru", status: "active", applications: 25, postedDate: "2024-03-16", salary: "M100k-140k" },
    { id: 20, title: "Business Analyst", company: "Development Bank of Lesotho", location: "Maseru", status: "active", applications: 16, postedDate: "2024-03-14", salary: "M120k-160k" },
    { id: 21, title: "Marketing Manager", company: "Vodacom Lesotho", location: "Maseru", status: "active", applications: 22, postedDate: "2024-03-17", salary: "M130k-180k" },
    { id: 22, title: "Human Resources Officer", company: "Ministry of Public Service", location: "Maseru", status: "active", applications: 30, postedDate: "2024-03-13", salary: "M90k-130k" },

    // Agriculture & Environment Sector
    { id: 23, title: "Agricultural Extension Officer", company: "Ministry of Agriculture", location: "Maseru", status: "active", applications: 18, postedDate: "2024-03-15", salary: "M85k-120k" },
    { id: 24, title: "Environmental Officer", company: "Department of Environment", location: "Maseru", status: "active", applications: 14, postedDate: "2024-03-18", salary: "M95k-135k" },
    { id: 25, title: "Forestry Technician", company: "Department of Forestry", location: "Butha-Buthe", status: "active", applications: 12, postedDate: "2024-03-16", salary: "M80k-110k" },

    // Public Service & Administration
    { id: 26, title: "Administrative Officer", company: "Prime Minister's Office", location: "Maseru", status: "active", applications: 35, postedDate: "2024-03-17", salary: "M75k-105k" },
    { id: 27, title: "Policy Analyst", company: "Ministry of Development Planning", location: "Maseru", status: "active", applications: 20, postedDate: "2024-03-14", salary: "M110k-150k" },
    { id: 28, title: "Statistics Officer", company: "Bureau of Statistics", location: "Maseru", status: "active", applications: 16, postedDate: "2024-03-19", salary: "M95k-130k" },

    // Tourism & Hospitality
    { id: 29, title: "Tourism Officer", company: "Ministry of Tourism", location: "Maseru", status: "active", applications: 22, postedDate: "2024-03-15", salary: "M85k-120k" },
    { id: 30, title: "Hotel Manager", company: "Lesotho Sun Hotel", location: "Maseru", status: "active", applications: 18, postedDate: "2024-03-16", salary: "M100k-140k" }
]

export default function ViewJobsPage() {
    const { user, loading } = useAuth()
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [locationFilter, setLocationFilter] = useState("all")

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
        const matchesLocation = locationFilter === "all" || job.location === locationFilter
        return matchesSearch && matchesStatus && matchesLocation
    })

    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case "active": return "default"
            case "pending": return "secondary"
            case "flagged": return "destructive"
            default: return "outline"
        }
    }

    // Calculate stats
    const totalJobs = mockJobs.length
    const activeJobs = mockJobs.filter(job => job.status === "active").length
    const totalApplications = mockJobs.reduce((sum, job) => sum + job.applications, 0)
    const avgApplications = Math.round(totalApplications / totalJobs)

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
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">View Jobs</h1>
                    <p className="text-slate-600">Overview of all job postings on the platform</p>
                </div>

                {/* Stats Cards */}
                <div className="grid md:grid-cols-4 gap-6 mb-6">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <Briefcase className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{totalJobs}</p>
                                    <p className="text-sm text-slate-600">Total Jobs</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <TrendingUp className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{activeJobs}</p>
                                    <p className="text-sm text-slate-600">Active Jobs</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-purple-100 rounded-lg">
                                    <Briefcase className="h-6 w-6 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{totalApplications}</p>
                                    <p className="text-sm text-slate-600">Total Applications</p>
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
                                    <p className="text-2xl font-bold">{avgApplications}</p>
                                    <p className="text-sm text-slate-600">Avg Applications</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
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
                                </SelectContent>
                            </Select>
                            <Select value={locationFilter} onValueChange={setLocationFilter}>
                                <SelectTrigger className="w-full md:w-48">
                                    <SelectValue placeholder="Filter by location" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Locations</SelectItem>
                                    <SelectItem value="Maseru">Maseru</SelectItem>
                                    <SelectItem value="Berea">Berea</SelectItem>
                                    <SelectItem value="Leribe">Leribe</SelectItem>
                                    <SelectItem value="Mafeteng">Mafeteng</SelectItem>
                                    <SelectItem value="Mohale's Hoek">Mohale's Hoek</SelectItem>
                                    <SelectItem value="Qacha's Nek">Qacha's Nek</SelectItem>
                                    <SelectItem value="Quthing">Quthing</SelectItem>
                                    <SelectItem value="Thaba-Tseka">Thaba-Tseka</SelectItem>
                                    <SelectItem value="Butha-Buthe">Butha-Buthe</SelectItem>
                                    <SelectItem value="Mokhotlong">Mokhotlong</SelectItem>
                                    <SelectItem value="Roma">Roma</SelectItem>
                                    <SelectItem value="Various Districts">Various Districts</SelectItem>
                                    <SelectItem value="Remote">Remote</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Jobs Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Job Postings ({filteredJobs.length})</CardTitle>
                        <CardDescription>All job listings on the platform</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Job Title</TableHead>
                                    <TableHead>Company</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Salary Range</TableHead>
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
                                        <TableCell>{job.salary}</TableCell>
                                        <TableCell>{job.applications}</TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusBadgeVariant(job.status)}>
                                                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{new Date(job.postedDate).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <Button variant="outline" size="sm">
                                                <Eye className="h-4 w-4" />
                                            </Button>
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
