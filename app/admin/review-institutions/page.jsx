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
import { Building2, Search, Check, X, ArrowLeft, Eye } from "lucide-react"
import { LESOTHO_INSTITUTIONS } from "@/lib/institutions-data"

// Transform real institution data to match table format
const realInstitutions = LESOTHO_INSTITUTIONS.map((inst, index) => ({
    id: index + 1, // Convert to number for approve/reject functions
    name: inst.name,
    email: inst.email,
    status: "approved", // All real institutions are approved
    type: inst.type.toLowerCase().replace(' ', '_'), // Format for table display
    location: inst.location,
    applications: Math.floor(Math.random() * 500) + 50, // Random demo applications
    joinDate: `${inst.established}-01-01` // Use established year as join date
}))

export default function ReviewInstitutionsPage() {
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

    const filteredInstitutions = realInstitutions.filter(inst => {
        const matchesSearch = inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inst.email.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === "all" || inst.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case "approved": return "default"
            case "pending": return "secondary"
            case "rejected": return "destructive"
            default: return "outline"
        }
    }

    const handleApprove = (id) => {
        // In a real app, this would make an API call
        console.log(`Approving institution ${id}`)
    }

    const handleReject = (id) => {
        // In a real app, this would make an API call
        console.log(`Rejecting institution ${id}`)
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
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">Review Institutions</h1>
                    <p className="text-slate-600">Review and approve institution registrations</p>
                </div>

                {/* Filters */}
                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        placeholder="Search by name or email..."
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
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="approved">Approved</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Institutions Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Institutions ({filteredInstitutions.length})</CardTitle>
                        <CardDescription>Institution registration requests and approvals</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Applications</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Join Date</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredInstitutions.map((inst) => (
                                    <TableRow key={inst.id}>
                                        <TableCell className="font-medium">{inst.name}</TableCell>
                                        <TableCell>{inst.email}</TableCell>
                                        <TableCell>{inst.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</TableCell>
                                        <TableCell>{inst.location}</TableCell>
                                        <TableCell>{inst.applications}</TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusBadgeVariant(inst.status)}>
                                                {inst.status.charAt(0).toUpperCase() + inst.status.slice(1)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{new Date(inst.joinDate).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                {inst.status === "pending" && (
                                                    <>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="text-green-600 hover:text-green-700"
                                                            onClick={() => handleApprove(inst.id)}
                                                        >
                                                            <Check className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="text-red-600 hover:text-red-700"
                                                            onClick={() => handleReject(inst.id)}
                                                        >
                                                            <X className="h-4 w-4" />
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
            </div>
        </div>
    )
}
