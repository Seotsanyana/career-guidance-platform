"use client"

import { useAuth } from "@/lib/auth-context-updated"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Building2, Briefcase, TrendingUp, Settings, BarChart3 } from "lucide-react"

export default function AdminDashboard() {
    const { user, loading } = useAuth()
    const router = useRouter()

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
                    <p className="text-slate-600">Manage the platform and oversee operations</p>
                </div>

                {/* Key Metrics */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <Users className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">10,247</p>
                                    <p className="text-sm text-slate-600">Total Users</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <Building2 className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">523</p>
                                    <p className="text-sm text-slate-600">Institutions</p>
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
                                    <p className="text-2xl font-bold">1,247</p>
                                    <p className="text-sm text-slate-600">Active Jobs</p>
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
                                    <p className="text-2xl font-bold">94.2%</p>
                                    <p className="text-sm text-slate-600">Match Rate</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Management Actions */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                User Management
                            </CardTitle>
                            <CardDescription>Manage users, roles, and permissions</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button className="w-full" onClick={() => router.push("/admin/manage-users")}>
                                Manage Users
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building2 className="h-5 w-5" />
                                Institution Oversight
                            </CardTitle>
                            <CardDescription>Review and approve institutions</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline" className="w-full" onClick={() => router.push("/admin/review-institutions")}>
                                Review Institutions
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Briefcase className="h-5 w-5" />
                                Job Moderation
                            </CardTitle>
                            <CardDescription>Monitor and moderate job postings</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline" className="w-full" onClick={() => router.push("/admin/moderate-jobs")}>
                                Moderate Jobs
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5" />
                                View Jobs
                            </CardTitle>
                            <CardDescription>Overview of all jobs on the platform</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline" className="w-full" onClick={() => router.push("/admin/view-jobs")}>
                                View Jobs
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                Analytics
                            </CardTitle>
                            <CardDescription>View platform analytics and reports</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline" className="w-full" onClick={() => router.push("/admin/view-analytics")}>
                                View Analytics
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Settings className="h-5 w-5" />
                                System Settings
                            </CardTitle>
                            <CardDescription>Configure platform settings</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline" className="w-full" onClick={() => router.push("/admin/system-config")}>
                                System Config
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Latest platform activities and updates</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Building2 className="h-4 w-4 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium">New institution registered: Tech University</p>
                                    <p className="text-sm text-slate-600">2 hours ago • Pending approval</p>
                                </div>
                                <Badge variant="secondary">Pending</Badge>
                            </div>

                            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <Users className="h-4 w-4 text-green-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium">500 new student registrations this week</p>
                                    <p className="text-sm text-slate-600">1 day ago</p>
                                </div>
                                <Badge className="bg-green-100 text-green-800">Active</Badge>
                            </div>

                            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <Briefcase className="h-4 w-4 text-purple-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium">Job posting flagged for review</p>
                                    <p className="text-sm text-slate-600">Tech Corp • 3 hours ago</p>
                                </div>
                                <Badge className="bg-red-100 text-red-800">Flagged</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
