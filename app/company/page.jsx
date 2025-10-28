"use client"

import { useAuth } from "@/lib/auth-context-updated"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Users, TrendingUp, Plus, Eye, Target, Building, MapPin, Calendar, Phone } from "lucide-react"

const basothoNames = [
    "Pule Mochaki", "Mpho Mokone", "Nthabiseng Molefi", "Thabo Mothibe", "Lerato Mphuthi",
    "Nthati Moshoeshoe", "Lebohang Nkosi", "Rethabile Mokete", "Khotso Mofokeng", "Tumelo Sekhonyana",
    "Boitumelo Ntlama", "Refiloe Lehloenya", "Masechaba Tlali", "Katleho Mohapi", "Mpho Mofokeng",
    "Lehlohonolo Nkosi", "Nthabeleng Mokone", "Thato Mphuthi", "Mpho Sekhonyana", "Lerato Tlali",
    "Khotso Mohapi", "Nthati Mofokeng", "Boitumelo Nkosi", "Refiloe Mokone", "Tumelo Mphuthi",
    "Katleho Sekhonyana", "Masechaba Tlali", "Lehlohonolo Mohapi", "Nthabeleng Mofokeng"
]

export default function CompanyDashboard() {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading && (!user || user.role !== "company")) {
            router.push("/login")
        }
    }, [user, loading, router])

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>
    }

    if (!user || user.role !== "company") {
        return null
    }

    const companyData = user.companyData

    if (!companyData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Company Profile Not Found</h2>
                    <p className="text-gray-600 mb-4">Your company information is not available in our system.</p>
                    <Button onClick={() => router.push("/login")}>Return to Login</Button>
                </div>
            </div>
        )
    }

    // Select 3 unique names based on company name hash for variety
    const companyHash = companyData.name.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
    const startIndex = companyHash % (basothoNames.length - 2) // Ensure we can get 3 names
    const selectedNames = basothoNames.slice(startIndex, startIndex + 3)

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="container mx-auto px-4 py-8">
                {/* Company Profile Section */}
                <div className="mb-8">
                    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                        <CardContent className="pt-6">
                            <div className="flex items-start gap-6">
                                <div className="p-4 bg-blue-100 rounded-lg">
                                    <Building className="h-8 w-8 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <h1 className="text-3xl font-bold text-slate-900 mb-2">{companyData.name}</h1>
                                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <MapPin className="h-4 w-4" />
                                            <span>{companyData.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <Building className="h-4 w-4" />
                                            <span>{companyData.industry}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <Calendar className="h-4 w-4" />
                                            <span>Est. {companyData.established}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <Users className="h-4 w-4" />
                                            <span>{companyData.size}</span>
                                        </div>
                                    </div>
                                    <p className="text-slate-700 mb-4">{companyData.description}</p>
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <Phone className="h-4 w-4" />
                                        <span>{companyData.contact.phone}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Dashboard Overview</h2>
                    <p className="text-slate-600">Find top talent and manage your job postings</p>
                </div>

                {/* Key Metrics */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <Briefcase className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">12</p>
                                    <p className="text-sm text-slate-600">Active Jobs</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <Users className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">247</p>
                                    <p className="text-sm text-slate-600">Applications</p>
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
                                    <p className="text-2xl font-bold">89%</p>
                                    <p className="text-sm text-slate-600">Match Rate</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-orange-100 rounded-lg">
                                    <Target className="h-6 w-6 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">34</p>
                                    <p className="text-sm text-slate-600">Interviews</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Plus className="h-5 w-5" />
                                Post Job
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Button className="w-full" onClick={() => router.push('/company/post-job')}>
                                Create New Job
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                View Candidates
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline" className="w-full" onClick={() => router.push('/company/view-candidates')}>
                                Browse Talent
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                Analytics
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline" className="w-full" onClick={() => router.push('/company/analytics')}>
                                View Reports
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Eye className="h-5 w-5" />
                                Company Profile
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline" className="w-full" onClick={() => router.push('/company/profile')}>
                                Edit Profile
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Job Postings & Applications */}
                <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Active Job Postings</CardTitle>
                            <CardDescription>Your current job openings</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                    <div>
                                        <p className="font-medium">Senior Frontend Developer</p>
                                        <p className="text-sm text-slate-600">24 applications • Posted 3 days ago</p>
                                    </div>
                                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                    <div>
                                        <p className="font-medium">Full Stack Engineer</p>
                                        <p className="text-sm text-slate-600">18 applications • Posted 1 week ago</p>
                                    </div>
                                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                    <div>
                                        <p className="font-medium">DevOps Engineer</p>
                                        <p className="text-sm text-slate-600">12 applications • Posted 2 weeks ago</p>
                                    </div>
                                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Applications</CardTitle>
                            <CardDescription>Latest candidate applications</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                    <div>
                                        <p className="font-medium">{selectedNames[0]}</p>
                                        <p className="text-sm text-slate-600">Applied to Frontend Dev • 2 hours ago</p>
                                    </div>
                                    <Badge variant="secondary">New</Badge>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                    <div>
                                        <p className="font-medium">{selectedNames[1]}</p>
                                        <p className="text-sm text-slate-600">Applied to Full Stack • 5 hours ago</p>
                                    </div>
                                    <Badge variant="secondary">New</Badge>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                    <div>
                                        <p className="font-medium">{selectedNames[2]}</p>
                                        <p className="text-sm text-slate-600">Applied to DevOps • 1 day ago</p>
                                    </div>
                                    <Badge className="bg-blue-100 text-blue-800">Reviewed</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
