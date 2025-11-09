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
import { CheckCircle, XCircle, AlertTriangle, Search, ArrowLeft, Building2, Users, Briefcase } from "lucide-react"

// Mock company data (in real app, this would come from Firestore)
const mockCompanies = [
    {
        id: "comp_1",
        name: "Lesotho Telecom",
        email: "hr@telecom.co.ls",
        industry: "Telecommunications",
        location: "Maseru",
        size: "500-1000 employees",
        status: "active",
        jobsPosted: 12,
        joinDate: "2023-01-15",
        description: "Leading telecommunications provider in Lesotho"
    },
    {
        id: "comp_2",
        name: "Standard Lesotho Bank",
        email: "careers@standardbank.co.ls",
        industry: "Banking & Finance",
        location: "Maseru",
        size: "200-500 employees",
        status: "active",
        jobsPosted: 8,
        joinDate: "2023-02-20",
        description: "Major commercial bank in Lesotho"
    },
    {
        id: "comp_3",
        name: "Tiger Brands Lesotho",
        email: "jobs@tigerbrands.co.ls",
        industry: "Manufacturing",
        location: "Maseru",
        size: "100-200 employees",
        status: "pending",
        jobsPosted: 0,
        joinDate: "2024-01-10",
        description: "Food manufacturing company"
    },
    {
        id: "comp_4",
        name: "ABC Construction",
        email: "hr@abcconstruction.co.ls",
        industry: "Construction",
        location: "Maseru",
        size: "50-100 employees",
        status: "suspended",
        jobsPosted: 3,
        joinDate: "2023-06-15",
        description: "Construction and civil engineering company"
    }
]

export default function ManageCompaniesPage() {
    const { user, loading } = useAuth()
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [companies, setCompanies] = useState(mockCompanies)
    const [selectedCompany, setSelectedCompany] = useState(null)
    const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)

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

    const filteredCompanies = companies.filter(company => {
        const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            company.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            company.industry.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === "all" || company.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case "active": return "default"
            case "pending": return "secondary"
            case "suspended": return "destructive"
            default: return "outline"
        }
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case "active": return <CheckCircle className="h-4 w-4 text-green-600" />
            case "pending": return <AlertTriangle className="h-4 w-4 text-yellow-600" />
            case "suspended": return <XCircle className="h-4 w-4 text-red-600" />
            default: return null
        }
    }

    const handleApproveCompany = (id) => {
        setCompanies(companies.map(company =>
            company.id === id ? { ...company, status: "active" } : company
        ))
    }

    const handleSuspendCompany = (id) => {
        setCompanies(companies.map(company =>
            company.id === id ? { ...company, status: "suspended" } : company
        ))
    }

    const handleDeleteCompany = (id) => {
        if (confirm("Are you sure you want to delete this company? This action cannot be undone.")) {
            setCompanies(companies.filter(company => company.id !== id))
        }
    }

    const getCompanyStats = () => {
        const active = companies.filter(c => c.status === "active").length
        const pending = companies.filter(c => c.status === "pending").length
        const suspended = companies.filter(c => c.status === "suspended").length
        const totalJobs = companies.reduce((sum, c) => sum + c.jobsPosted, 0)
        return { active, pending, suspended, totalJobs }
    }

    const stats = getCompanyStats()

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
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">Manage Companies</h1>
                    <p className="text-slate-600">Approve, suspend, or delete registered companies</p>
                </div>

                {/* Stats Overview */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <Building2 className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{companies.length}</p>
                                    <p className="text-sm text-slate-600">Total Companies</p>
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
                                    <p className="text-2xl font-bold">{stats.active}</p>
                                    <p className="text-sm text-slate-600">Active Companies</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-yellow-100 rounded-lg">
                                    <AlertTriangle className="h-6 w-6 text-yellow-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{stats.pending}</p>
                                    <p className="text-sm text-slate-600">Pending Approval</p>
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
                                    <p className="text-2xl font-bold">{stats.totalJobs}</p>
                                    <p className="text-sm text-slate-600">Total Job Postings</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Search by company name, email, or industry..."
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
                            <SelectItem value="suspended">Suspended</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Companies Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Companies ({filteredCompanies.length})</CardTitle>
                        <CardDescription>Manage company registrations and status</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Company Name</TableHead>
                                    <TableHead>Industry</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Size</TableHead>
                                    <TableHead>Jobs Posted</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Join Date</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredCompanies.map((company) => (
                                    <TableRow key={company.id}>
                                        <TableCell className="font-medium">{company.name}</TableCell>
                                        <TableCell>{company.industry}</TableCell>
                                        <TableCell>{company.location}</TableCell>
                                        <TableCell>{company.size}</TableCell>
                                        <TableCell>{company.jobsPosted}</TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusBadgeVariant(company.status)} className="flex items-center gap-1 w-fit">
                                                {getStatusIcon(company.status)}
                                                {company.status.charAt(0).toUpperCase() + company.status.slice(1)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{new Date(company.joinDate).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedCompany(company)
                                                        setIsDetailsDialogOpen(true)
                                                    }}
                                                >
                                                    View
                                                </Button>
                                                {company.status === "pending" && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-green-600 hover:text-green-700"
                                                        onClick={() => handleApproveCompany(company.id)}
                                                    >
                                                        Approve
                                                    </Button>
                                                )}
                                                {company.status === "active" && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-orange-600 hover:text-orange-700"
                                                        onClick={() => handleSuspendCompany(company.id)}
                                                    >
                                                        Suspend
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-red-600 hover:text-red-700"
                                                    onClick={() => handleDeleteCompany(company.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Company Details Dialog */}
                <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Company Details</DialogTitle>
                            <DialogDescription>
                                Detailed information about the selected company
                            </DialogDescription>
                        </DialogHeader>
                        {selectedCompany && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="font-semibold">Company Name</Label>
                                        <p>{selectedCompany.name}</p>
                                    </div>
                                    <div>
                                        <Label className="font-semibold">Email</Label>
                                        <p>{selectedCompany.email}</p>
                                    </div>
                                    <div>
                                        <Label className="font-semibold">Industry</Label>
                                        <p>{selectedCompany.industry}</p>
                                    </div>
                                    <div>
                                        <Label className="font-semibold">Location</Label>
                                        <p>{selectedCompany.location}</p>
                                    </div>
                                    <div>
                                        <Label className="font-semibold">Company Size</Label>
                                        <p>{selectedCompany.size}</p>
                                    </div>
                                    <div>
                                        <Label className="font-semibold">Jobs Posted</Label>
                                        <p>{selectedCompany.jobsPosted}</p>
                                    </div>
                                    <div>
                                        <Label className="font-semibold">Status</Label>
                                        <Badge variant={getStatusBadgeVariant(selectedCompany.status)} className="flex items-center gap-1 w-fit">
                                            {getStatusIcon(selectedCompany.status)}
                                            {selectedCompany.status.charAt(0).toUpperCase() + selectedCompany.status.slice(1)}
                                        </Badge>
                                    </div>
                                    <div>
                                        <Label className="font-semibold">Join Date</Label>
                                        <p>{new Date(selectedCompany.joinDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div>
                                    <Label className="font-semibold">Description</Label>
                                    <p className="text-sm text-slate-600 mt-1">{selectedCompany.description}</p>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}
