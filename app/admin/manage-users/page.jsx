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
import { Users, Search, Edit, Trash2, ArrowLeft, Flag, CheckCircle, XCircle, AlertTriangle } from "lucide-react"

// Function to get all registered users from Firebase
const getAllUsers = async () => {
    try {
        const { collection, getDocs } = await import('firebase/firestore')
        const { db } = await import('@/lib/firebase-config')
        const usersCollection = collection(db, 'users')
        const usersSnapshot = await getDocs(usersCollection)

        return usersSnapshot.docs.map((doc, index) => {
            const userData = doc.data()
            return {
                id: doc.id,
                name: userData.name || 'N/A',
                email: userData.email || 'N/A',
                role: userData.role || 'student',
                status: userData.status || 'active',
                flagged: userData.flagged || false,
                flagReason: userData.flagReason || '',
                joinDate: userData.createdAt ? new Date(userData.createdAt.seconds * 1000).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                lastLogin: userData.lastLogin ? new Date(userData.lastLogin.seconds * 1000).toISOString().split('T')[0] : 'Never',
                loginCount: userData.loginCount || 0
            }
        })
    } catch (error) {
        console.error('Error fetching users:', error)
        return []
    }
}

export default function ManageUsersPage() {
    const { user, loading } = useAuth()
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState("")
    const [roleFilter, setRoleFilter] = useState("all")
    const [statusFilter, setStatusFilter] = useState("all")
    const [users, setUsers] = useState([])
    const [loadingUsers, setLoadingUsers] = useState(true)

    useEffect(() => {
        if (!loading && (!user || user.role !== "admin")) {
            router.push("/login")
        }
    }, [user, loading, router])

    useEffect(() => {
        const fetchUsers = async () => {
            setLoadingUsers(true)
            const fetchedUsers = await getAllUsers()
            setUsers(fetchedUsers)
            setLoadingUsers(false)
        }
        if (user && user.role === "admin") {
            fetchUsers()
        }
    }, [user])

    if (loading || loadingUsers) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>
    }

    if (!user || user.role !== "admin") {
        return null
    }

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesRole = roleFilter === "all" || user.role === roleFilter
        const matchesStatus = statusFilter === "all" || user.status === statusFilter
        return matchesSearch && matchesRole && matchesStatus
    })

    const getRoleBadgeVariant = (role) => {
        switch (role) {
            case "admin": return "destructive"
            case "institution": return "default"
            case "company": return "secondary"
            case "student": return "outline"
            default: return "outline"
        }
    }

    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case "active": return "default"
            case "inactive": return "secondary"
            case "pending": return "outline"
            case "suspended": return "destructive"
            default: return "outline"
        }
    }

    const handleActivateUser = async (userId) => {
        try {
            const { doc, updateDoc } = await import('firebase/firestore')
            const { db } = await import('@/lib/firebase-config')
            const userRef = doc(db, 'users', userId)
            await updateDoc(userRef, {
                status: 'active',
                flagged: false,
                flagReason: '',
                updatedAt: new Date()
            })
            // Refresh users list
            const fetchedUsers = await getAllUsers()
            setUsers(fetchedUsers)
        } catch (error) {
            console.error('Error activating user:', error)
        }
    }

    const handleDeactivateUser = async (userId) => {
        try {
            const { doc, updateDoc } = await import('firebase/firestore')
            const { db } = await import('@/lib/firebase-config')
            const userRef = doc(db, 'users', userId)
            await updateDoc(userRef, {
                status: 'inactive',
                updatedAt: new Date()
            })
            // Refresh users list
            const fetchedUsers = await getAllUsers()
            setUsers(fetchedUsers)
        } catch (error) {
            console.error('Error deactivating user:', error)
        }
    }

    const handleFlagUser = async (userId) => {
        const reason = prompt('Enter reason for flagging this user:')
        if (reason) {
            try {
                const { doc, updateDoc } = await import('firebase/firestore')
                const { db } = await import('@/lib/firebase-config')
                const userRef = doc(db, 'users', userId)
                await updateDoc(userRef, {
                    flagged: true,
                    flagReason: reason,
                    status: 'suspended',
                    updatedAt: new Date()
                })
                // Refresh users list
                const fetchedUsers = await getAllUsers()
                setUsers(fetchedUsers)
            } catch (error) {
                console.error('Error flagging user:', error)
            }
        }
    }

    const handleDeleteUser = async (userId) => {
        if (confirm('Are you sure you want to permanently delete this user? This action cannot be undone.')) {
            try {
                const { doc, deleteDoc } = await import('firebase/firestore')
                const { db } = await import('@/lib/firebase-config')
                const userRef = doc(db, 'users', userId)
                await deleteDoc(userRef)
                // Refresh users list
                const fetchedUsers = await getAllUsers()
                setUsers(fetchedUsers)
            } catch (error) {
                console.error('Error deleting user:', error)
            }
        }
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
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">Manage Users</h1>
                    <p className="text-slate-600">Manage users, roles, and permissions across the platform</p>
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
                            <Select value={roleFilter} onValueChange={setRoleFilter}>
                                <SelectTrigger className="w-full md:w-48">
                                    <SelectValue placeholder="Filter by role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Roles</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="institution">Institution</SelectItem>
                                    <SelectItem value="company">Company</SelectItem>
                                    <SelectItem value="student">Student</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-full md:w-48">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="suspended">Suspended</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Users Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Users ({filteredUsers.length})</CardTitle>
                        <CardDescription>All registered users on the platform</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Join Date</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <Badge variant={getRoleBadgeVariant(user.role)}>
                                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusBadgeVariant(user.status)}>
                                                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{new Date(user.joinDate).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-1 flex-wrap">
                                                {user.status === 'active' ? (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-orange-600 hover:text-orange-700"
                                                        onClick={() => handleDeactivateUser(user.id)}
                                                        title="Deactivate User"
                                                    >
                                                        <XCircle className="h-4 w-4" />
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-green-600 hover:text-green-700"
                                                        onClick={() => handleActivateUser(user.id)}
                                                        title="Activate User"
                                                    >
                                                        <CheckCircle className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-yellow-600 hover:text-yellow-700"
                                                    onClick={() => handleFlagUser(user.id)}
                                                    title="Flag User"
                                                >
                                                    <Flag className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-red-600 hover:text-red-700"
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    title="Delete User"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                                {user.flagged && (
                                                    <Badge variant="destructive" className="text-xs">
                                                        <AlertTriangle className="h-3 w-3 mr-1" />
                                                        Flagged
                                                    </Badge>
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
