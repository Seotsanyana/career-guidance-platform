"use client"

import { useAuth } from "@/lib/auth-context-updated"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Users, Building2, Briefcase, TrendingUp, Calendar, Download } from "lucide-react"

// Mock analytics data
const analyticsData = {
    userGrowth: {
        total: 10247,
        thisMonth: 523,
        lastMonth: 487,
        growth: 7.4
    },
    institutions: {
        total: 523,
        active: 498,
        pending: 25,
        thisMonth: 12
    },
    jobs: {
        total: 1247,
        active: 1189,
        applications: 15432,
        avgMatchRate: 94.2
    },
    platform: {
        totalRevenue: 45678,
        monthlyRevenue: 3456,
        conversionRate: 12.5
    }
}

const monthlyData = [
    { month: "Jan", users: 8500, jobs: 980, applications: 12000 },
    { month: "Feb", users: 8900, jobs: 1020, applications: 12800 },
    { month: "Mar", users: 9200, jobs: 1080, applications: 13500 },
    { month: "Apr", users: 9500, jobs: 1120, applications: 14200 },
    { month: "May", users: 9800, jobs: 1160, applications: 14800 },
    { month: "Jun", users: 10247, jobs: 1247, applications: 15432 },
]

export default function ViewAnalyticsPage() {
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
                    <Button
                        variant="ghost"
                        onClick={() => router.push("/admin")}
                        className="mb-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Dashboard
                    </Button>
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">Platform Analytics</h1>
                    <p className="text-slate-600">Comprehensive analytics and insights for the platform</p>
                </div>

                {/* Key Metrics */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <Users className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{analyticsData.userGrowth.total.toLocaleString()}</p>
                                    <p className="text-sm text-slate-600">Total Users</p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <TrendingUp className="h-3 w-3 text-green-600" />
                                        <span className="text-xs text-green-600">+{analyticsData.userGrowth.growth}% this month</span>
                                    </div>
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
                                    <p className="text-2xl font-bold">{analyticsData.institutions.total}</p>
                                    <p className="text-sm text-slate-600">Institutions</p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <Badge variant="secondary" className="text-xs">
                                            {analyticsData.institutions.pending} pending
                                        </Badge>
                                    </div>
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
                                    <p className="text-2xl font-bold">{analyticsData.jobs.total}</p>
                                    <p className="text-sm text-slate-600">Active Jobs</p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <span className="text-xs text-slate-600">{analyticsData.jobs.applications.toLocaleString()} applications</span>
                                    </div>
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
                                    <p className="text-2xl font-bold">{analyticsData.jobs.avgMatchRate}%</p>
                                    <p className="text-sm text-slate-600">Match Rate</p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <Progress value={analyticsData.jobs.avgMatchRate} className="h-2" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Section */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>User Growth</CardTitle>
                            <CardDescription>Monthly user registration trends</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {monthlyData.map((data, index) => (
                                    <div key={data.month} className="flex items-center gap-4">
                                        <div className="w-12 text-sm font-medium">{data.month}</div>
                                        <div className="flex-1">
                                            <Progress value={(data.users / 11000) * 100} className="h-3" />
                                        </div>
                                        <div className="w-16 text-sm text-right">{data.users.toLocaleString()}</div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Job Postings & Applications</CardTitle>
                            <CardDescription>Monthly job and application trends</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {monthlyData.map((data, index) => (
                                    <div key={data.month} className="space-y-2">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 text-sm font-medium">{data.month}</div>
                                            <div className="flex-1">
                                                <div className="flex gap-1">
                                                    <Progress value={(data.jobs / 1400) * 100} className="h-2 flex-1" />
                                                    <Progress value={(data.applications / 17000) * 100} className="h-2 flex-1" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex justify-between text-xs text-slate-600 ml-12">
                                            <span>{data.jobs} jobs</span>
                                            <span>{data.applications.toLocaleString()} apps</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Detailed Stats */}
                <div className="grid md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Institution Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-sm">Active Institutions</span>
                                <span className="font-medium">{analyticsData.institutions.active}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Pending Approval</span>
                                <span className="font-medium">{analyticsData.institutions.pending}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">New This Month</span>
                                <span className="font-medium">{analyticsData.institutions.thisMonth}</span>
                            </div>
                            <Progress value={(analyticsData.institutions.active / analyticsData.institutions.total) * 100} className="h-2" />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Platform Performance</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-sm">Total Revenue</span>
                                <span className="font-medium">M{analyticsData.platform.totalRevenue.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Monthly Revenue</span>
                                <span className="font-medium">M{analyticsData.platform.monthlyRevenue.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Conversion Rate</span>
                                <span className="font-medium">{analyticsData.platform.conversionRate}%</span>
                            </div>
                            <Progress value={analyticsData.platform.conversionRate * 4} className="h-2" />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button variant="outline" className="w-full justify-start">
                                <Download className="h-4 w-4 mr-2" />
                                Export Report
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                                <Calendar className="h-4 w-4 mr-2" />
                                Schedule Report
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                                <TrendingUp className="h-4 w-4 mr-2" />
                                Custom Analytics
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
