"use client"

import { useAuth } from "@/lib/auth-context-updated"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, TrendingUp, Users, Eye, Calendar, Download } from "lucide-react"

export default function AnalyticsPage() {
    const { user, loading } = useAuth()
    const router = useRouter()
    const [analyticsData, setAnalyticsData] = useState(null)

    useEffect(() => {
        if (!loading && (!user || user.role !== "company")) {
            router.push("/login")
        }
    }, [user, loading, router])

    useEffect(() => {
        // Mock analytics data
        const mockData = {
            overview: {
                totalJobs: 12,
                activeJobs: 8,
                totalApplications: 247,
                totalViews: 1250,
                averageMatchRate: 89,
                interviewsScheduled: 34,
            },
            jobPerformance: [
                {
                    jobTitle: "Senior Frontend Developer",
                    applications: 24,
                    views: 156,
                    matchRate: 92,
                    status: "active"
                },
                {
                    jobTitle: "Full Stack Engineer",
                    applications: 18,
                    views: 134,
                    matchRate: 88,
                    status: "active"
                },
                {
                    jobTitle: "DevOps Engineer",
                    applications: 12,
                    views: 98,
                    matchRate: 85,
                    status: "active"
                },
            ],
            applicationTrends: {
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                data: [15, 23, 18, 31, 28, 24]
            },
            topSkills: [
                { skill: "JavaScript", count: 45 },
                { skill: "React", count: 38 },
                { skill: "Python", count: 32 },
                { skill: "Node.js", count: 28 },
                { skill: "SQL", count: 25 }
            ]
        }
        setAnalyticsData(mockData)
    }, [])

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>
    }

    if (!user || user.role !== "company") {
        return null
    }

    if (!analyticsData) {
        return <div className="min-h-screen flex items-center justify-center">Loading analytics...</div>
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        onClick={() => router.push("/company")}
                        className="mb-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Dashboard
                    </Button>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Analytics & Reports</h1>
                    <p className="text-slate-600">Track your recruitment performance and insights</p>
                </div>

                {/* Overview Metrics */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <Users className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{analyticsData.overview.totalApplications}</p>
                                    <p className="text-sm text-slate-600">Total Applications</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <Eye className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{analyticsData.overview.totalViews}</p>
                                    <p className="text-sm text-slate-600">Job Views</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-purple-100 rounded-lg">
                                    <TrendingUp className="h-6 w-6 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{analyticsData.overview.averageMatchRate}%</p>
                                    <p className="text-sm text-slate-600">Avg Match Rate</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-orange-100 rounded-lg">
                                    <Calendar className="h-6 w-6 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{analyticsData.overview.interviewsScheduled}</p>
                                    <p className="text-sm text-slate-600">Interviews</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="jobs" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="jobs">Job Performance</TabsTrigger>
                        <TabsTrigger value="trends">Application Trends</TabsTrigger>
                        <TabsTrigger value="skills">Top Skills</TabsTrigger>
                    </TabsList>

                    <Tabs value="jobs">
                        <Card>
                            <CardHeader>
                                <CardTitle>Job Performance</CardTitle>
                                <CardDescription>Performance metrics for your active job postings</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {analyticsData.jobPerformance.map((job, index) => (
                                        <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                            <div className="flex-1">
                                                <h4 className="font-medium text-slate-900">{job.jobTitle}</h4>
                                                <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                                                    <span>{job.applications} applications</span>
                                                    <span>{job.views} views</span>
                                                    <span>{job.matchRate}% match rate</span>
                                                </div>
                                            </div>
                                            <Badge className="bg-green-100 text-green-800">
                                                {job.status === "active" ? "Active" : "Inactive"}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </Tabs>

                    <Tabs value="trends">
                        <Card>
                            <CardHeader>
                                <CardTitle>Application Trends</CardTitle>
                                <CardDescription>Monthly application volume over the past 6 months</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {analyticsData.applicationTrends.labels.map((month, index) => (
                                        <div key={month} className="flex items-center gap-4">
                                            <div className="w-16 text-sm font-medium text-slate-600">{month}</div>
                                            <div className="flex-1 bg-slate-200 rounded-full h-4">
                                                <div
                                                    className="bg-blue-600 h-4 rounded-full"
                                                    style={{ width: `${(analyticsData.applicationTrends.data[index] / 35) * 100}%` }}
                                                ></div>
                                            </div>
                                            <div className="w-12 text-sm font-medium text-slate-900 text-right">
                                                {analyticsData.applicationTrends.data[index]}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </Tabs>

                    <Tabs value="skills">
                        <Card>
                            <CardHeader>
                                <CardTitle>Top Skills in Applications</CardTitle>
                                <CardDescription>Most common skills among your applicants</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {analyticsData.topSkills.map((skill, index) => (
                                        <div key={skill.skill} className="flex items-center gap-4">
                                            <div className="w-8 text-sm font-medium text-slate-600">#{index + 1}</div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-medium text-slate-900">{skill.skill}</span>
                                                    <span className="text-sm text-slate-600">{skill.count} applicants</span>
                                                </div>
                                                <div className="w-full bg-slate-200 rounded-full h-2 mt-1">
                                                    <div
                                                        className="bg-green-600 h-2 rounded-full"
                                                        style={{ width: `${(skill.count / 50) * 100}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </Tabs>
                </Tabs>

                {/* Export Reports */}
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>Export Reports</CardTitle>
                        <CardDescription>Download detailed reports for further analysis</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4">
                            <Button variant="outline">
                                <Download className="h-4 w-4 mr-2" />
                                Export Job Performance Report
                            </Button>
                            <Button variant="outline">
                                <Download className="h-4 w-4 mr-2" />
                                Export Application Trends
                            </Button>
                            <Button variant="outline">
                                <Download className="h-4 w-4 mr-2" />
                                Export Skills Analysis
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
