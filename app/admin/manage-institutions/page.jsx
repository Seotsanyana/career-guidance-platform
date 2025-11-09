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
import { Building2, Plus, Edit, Trash2, Search, ArrowLeft, BookOpen, GraduationCap, Users, Check, X, Clock } from "lucide-react"
import { LESOTHO_INSTITUTIONS } from "@/lib/institutions-data"

// Function to get all institutions from Firebase
const getAllInstitutions = async () => {
    try {
        const { collection, getDocs } = await import('firebase/firestore')
        const { db } = await import('@/lib/firebase-config')
        const institutionsCollection = collection(db, 'institutions')
        const institutionsSnapshot = await getDocs(institutionsCollection)

        return institutionsSnapshot.docs.map((doc) => {
            const institutionData = doc.data()
            return {
                id: doc.id,
                name: institutionData.name || 'N/A',
                email: institutionData.email || 'N/A',
                location: institutionData.location || 'N/A',
                type: institutionData.type || 'N/A',
                established: institutionData.established || 'N/A',
                website: institutionData.website || 'N/A',
                description: institutionData.description || '',
                prospectus: institutionData.prospectus || '',
                status: institutionData.status || 'pending',
                courses: institutionData.courses || [],
                createdAt: institutionData.createdAt,
                updatedAt: institutionData.updatedAt
            }
        })
    } catch (error) {
        console.error('Error fetching institutions:', error)
        return []
    }
}

export default function ManageInstitutionsPage() {
    const { user, loading } = useAuth()
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [selectedInstitution, setSelectedInstitution] = useState(null)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [institutions, setInstitutions] = useState([])
    const [loadingInstitutions, setLoadingInstitutions] = useState(true)
    const [newInstitution, setNewInstitution] = useState({
        name: "",
        email: "",
        location: "",
        type: "",
        established: "",
        website: "",
        description: "",
        prospectus: ""
    })

    useEffect(() => {
        if (!loading && (!user || user.role !== "admin")) {
            router.push("/login")
        }
    }, [user, loading, router])

    useEffect(() => {
        const fetchInstitutions = async () => {
            setLoadingInstitutions(true)
            const fetchedInstitutions = await getAllInstitutions()
            setInstitutions(fetchedInstitutions)
            setLoadingInstitutions(false)
        }
        if (user && user.role === "admin") {
            fetchInstitutions()
        }
    }, [user])

    if (loading || loadingInstitutions) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>
    }

    if (!user || user.role !== "admin") {
        return null
    }

    const filteredInstitutions = institutions.filter(inst => {
        const matchesSearch = inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inst.location.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === "all" || inst.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const handleAddInstitution = async () => {
        try {
            const { collection, addDoc, serverTimestamp } = await import('firebase/firestore')
            const { db } = await import('@/lib/firebase-config')

            const institutionData = {
                ...newInstitution,
                status: 'pending',
                courses: [],
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            }

            await addDoc(collection(db, 'institutions'), institutionData)

            // Refresh institutions list
            const fetchedInstitutions = await getAllInstitutions()
            setInstitutions(fetchedInstitutions)

            setNewInstitution({
                name: "",
                email: "",
                location: "",
                type: "",
                established: "",
                website: "",
                description: "",
                prospectus: ""
            })
            setIsAddDialogOpen(false)
        } catch (error) {
            console.error('Error adding institution:', error)
            alert('Failed to add institution. Please try again.')
        }
    }

    const handleEditInstitution = async () => {
        try {
            const { doc, updateDoc, serverTimestamp } = await import('firebase/firestore')
            const { db } = await import('@/lib/firebase-config')

            const institutionRef = doc(db, 'institutions', selectedInstitution.id)
            await updateDoc(institutionRef, {
                ...selectedInstitution,
                updatedAt: serverTimestamp()
            })

            // Refresh institutions list
            const fetchedInstitutions = await getAllInstitutions()
            setInstitutions(fetchedInstitutions)

            setIsEditDialogOpen(false)
            setSelectedInstitution(null)
        } catch (error) {
            console.error('Error updating institution:', error)
            alert('Failed to update institution. Please try again.')
        }
    }

    const handleDeleteInstitution = async (id) => {
        if (confirm("Are you sure you want to delete this institution?")) {
            try {
                const { doc, deleteDoc } = await import('firebase/firestore')
                const { db } = await import('@/lib/firebase-config')

                await deleteDoc(doc(db, 'institutions', id))

                // Refresh institutions list
                const fetchedInstitutions = await getAllInstitutions()
                setInstitutions(fetchedInstitutions)
            } catch (error) {
                console.error('Error deleting institution:', error)
                alert('Failed to delete institution. Please try again.')
            }
        }
    }

    const handleStatusChange = async (id, newStatus) => {
        try {
            const { doc, updateDoc, serverTimestamp } = await import('firebase/firestore')
            const { db } = await import('@/lib/firebase-config')

            const institutionRef = doc(db, 'institutions', id)
            await updateDoc(institutionRef, {
                status: newStatus,
                updatedAt: serverTimestamp()
            })

            // Refresh institutions list
            const fetchedInstitutions = await getAllInstitutions()
            setInstitutions(fetchedInstitutions)
        } catch (error) {
            console.error('Error updating institution status:', error)
            alert('Failed to update institution status. Please try again.')
        }
    }

    const getInstitutionStats = (institution) => {
        const courseCount = institution.courses?.length || 0
        const facultyCount = [...new Set(institution.courses?.map(c => c.faculty))].length || 0
        return { courseCount, facultyCount }
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
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">Manage Institutions</h1>
                    <p className="text-slate-600">Add, edit, and manage higher learning institutions in Lesotho</p>
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
                                    <p className="text-2xl font-bold">{institutions.length}</p>
                                    <p className="text-sm text-slate-600">Total Institutions</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <BookOpen className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">
                                        {institutions.reduce((sum, inst) => sum + (inst.courses?.length || 0), 0)}
                                    </p>
                                    <p className="text-sm text-slate-600">Total Courses</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-purple-100 rounded-lg">
                                    <GraduationCap className="h-6 w-6 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">
                                        {[...new Set(institutions.flatMap(inst => inst.courses?.map(c => c.faculty) || []))].length}
                                    </p>
                                    <p className="text-sm text-slate-600">Faculties</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-orange-100 rounded-lg">
                                    <Users className="h-6 w-6 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">2,847</p>
                                    <p className="text-sm text-slate-600">Registered Students</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Search, Filter and Add */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Search institutions by name or location..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                        </Select>
                        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Institution
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>Add New Institution</DialogTitle>
                                    <DialogDescription>
                                        Add a new higher learning institution to the platform
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="name">Institution Name</Label>
                                            <Input
                                                id="name"
                                                value={newInstitution.name}
                                                onChange={(e) => setNewInstitution({ ...newInstitution, name: e.target.value })}
                                                placeholder="e.g., University of Lesotho"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={newInstitution.email}
                                                onChange={(e) => setNewInstitution({ ...newInstitution, email: e.target.value })}
                                                placeholder="info@university.ls"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="location">Location</Label>
                                            <Input
                                                id="location"
                                                value={newInstitution.location}
                                                onChange={(e) => setNewInstitution({ ...newInstitution, location: e.target.value })}
                                                placeholder="e.g., Maseru"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="type">Type</Label>
                                            <Select value={newInstitution.type} onValueChange={(value) => setNewInstitution({ ...newInstitution, type: value })}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Public University">Public University</SelectItem>
                                                    <SelectItem value="Private University">Private University</SelectItem>
                                                    <SelectItem value="Public College">Public College</SelectItem>
                                                    <SelectItem value="Private College">Private College</SelectItem>
                                                    <SelectItem value="Hospital Nursing School">Hospital Nursing School</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="established">Established Year</Label>
                                            <Input
                                                id="established"
                                                value={newInstitution.established}
                                                onChange={(e) => setNewInstitution({ ...newInstitution, established: e.target.value })}
                                                placeholder="e.g., 1945"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="website">Website</Label>
                                            <Input
                                                id="website"
                                                value={newInstitution.website}
                                                onChange={(e) => setNewInstitution({ ...newInstitution, website: e.target.value })}
                                                placeholder="https://www.university.ls"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            value={newInstitution.description}
                                            onChange={(e) => setNewInstitution({ ...newInstitution, description: e.target.value })}
                                            placeholder="Brief description of the institution"
                                            rows={3}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="prospectus">Prospectus</Label>
                                        <Textarea
                                            id="prospectus"
                                            value={newInstitution.prospectus}
                                            onChange={(e) => setNewInstitution({ ...newInstitution, prospectus: e.target.value })}
                                            placeholder="Detailed prospectus information"
                                            rows={4}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button onClick={handleAddInstitution}>
                                        Add Institution
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Institutions Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Institutions ({filteredInstitutions.length})</CardTitle>
                        <CardDescription>All registered higher learning institutions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Courses</TableHead>
                                    <TableHead>Faculties</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredInstitutions.map((inst) => {
                                    const stats = getInstitutionStats(inst)
                                    return (
                                        <TableRow key={inst.id}>
                                            <TableCell className="font-medium">{inst.name}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{inst.type}</Badge>
                                            </TableCell>
                                            <TableCell>{inst.location}</TableCell>
                                            <TableCell>{stats.courseCount}</TableCell>
                                            <TableCell>{stats.facultyCount}</TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            setSelectedInstitution(inst)
                                                            setIsEditDialogOpen(true)
                                                        }}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-red-600 hover:text-red-700"
                                                        onClick={() => handleDeleteInstitution(inst.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Edit Institution Dialog */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Edit Institution</DialogTitle>
                            <DialogDescription>
                                Update institution information
                            </DialogDescription>
                        </DialogHeader>
                        {selectedInstitution && (
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="edit-name">Institution Name</Label>
                                        <Input
                                            id="edit-name"
                                            value={selectedInstitution.name}
                                            onChange={(e) => setSelectedInstitution({ ...selectedInstitution, name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="edit-email">Email</Label>
                                        <Input
                                            id="edit-email"
                                            type="email"
                                            value={selectedInstitution.email}
                                            onChange={(e) => setSelectedInstitution({ ...selectedInstitution, email: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="edit-location">Location</Label>
                                        <Input
                                            id="edit-location"
                                            value={selectedInstitution.location}
                                            onChange={(e) => setSelectedInstitution({ ...selectedInstitution, location: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="edit-type">Type</Label>
                                        <Select value={selectedInstitution.type} onValueChange={(value) => setSelectedInstitution({ ...selectedInstitution, type: value })}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Public University">Public University</SelectItem>
                                                <SelectItem value="Private University">Private University</SelectItem>
                                                <SelectItem value="Public College">Public College</SelectItem>
                                                <SelectItem value="Private College">Private College</SelectItem>
                                                <SelectItem value="Hospital Nursing School">Hospital Nursing School</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="edit-established">Established Year</Label>
                                        <Input
                                            id="edit-established"
                                            value={selectedInstitution.established}
                                            onChange={(e) => setSelectedInstitution({ ...selectedInstitution, established: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="edit-website">Website</Label>
                                        <Input
                                            id="edit-website"
                                            value={selectedInstitution.website}
                                            onChange={(e) => setSelectedInstitution({ ...selectedInstitution, website: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="edit-description">Description</Label>
                                    <Textarea
                                        id="edit-description"
                                        value={selectedInstitution.description}
                                        onChange={(e) => setSelectedInstitution({ ...selectedInstitution, description: e.target.value })}
                                        rows={3}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="edit-prospectus">Prospectus</Label>
                                    <Textarea
                                        id="edit-prospectus"
                                        value={selectedInstitution.prospectus}
                                        onChange={(e) => setSelectedInstitution({ ...selectedInstitution, prospectus: e.target.value })}
                                        rows={4}
                                    />
                                </div>
                            </div>
                        )}
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleEditInstitution}>
                                Update Institution
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}
