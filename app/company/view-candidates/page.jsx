"use client"

import { useAuth } from "@/lib/auth-context-updated"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Search, Eye, MessageSquare, Star, Filter } from "lucide-react"

export default function ViewCandidatesPage() {
    const { user, loading } = useAuth()
    const router = useRouter()
    const [candidates, setCandidates] = useState([])
    const [filteredCandidates, setFilteredCandidates] = useState([])
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedTab, setSelectedTab] = useState("all")

    useEffect(() => {
        if (!loading && (!user || user.role !== "company")) {
            router.push("/login")
        }
    }, [user, loading, router])

    useEffect(() => {
        // Mock candidates data with Basotho names
        const mockCandidates = [
            {
                id: 1,
                name: "Pule Mochaki",
                email: "pulemochaki1@gmail.com",
                avatar: "/placeholder-user.jpg",
                skills: ["JavaScript", "React", "Node.js", "Python"],
                education: "Bachelor's in Computer Science",
                experience: 3,
                location: "Maseru",
                appliedJob: "Frontend Developer",
                appliedDate: "2 hours ago",
                status: "new",
                matchScore: 92,
            },
            {
                id: 2,
                name: "Mpho Mokone",
                email: "mphomokone2@gmail.com",
                avatar: "/placeholder-user.jpg",
                skills: ["JavaScript", "React", "TypeScript", "MongoDB"],
                education: "Bachelor's in Software Engineering",
                experience: 4,
                location: "Maseru",
                appliedJob: "Full Stack Developer",
                appliedDate: "5 hours ago",
                status: "reviewed",
                matchScore: 88,
            },
            {
                id: 3,
                name: "Nthabiseng Molefi",
                email: "nthabisengmolefi3@gmail.com",
                avatar: "/placeholder-user.jpg",
                skills: ["Python", "Django", "PostgreSQL", "AWS"],
                education: "Master's in Computer Science",
                experience: 5,
                location: "Berea",
                appliedJob: "Backend Developer",
                appliedDate: "1 day ago",
                status: "interviewed",
                matchScore: 95,
            },
            {
                id: 4,
                name: "Thabo Mothibe",
                email: "thabomothibe4@gmail.com",
                avatar: "/placeholder-user.jpg",
                skills: ["Java", "Spring Boot", "MySQL", "Docker"],
                education: "Bachelor's in Information Technology",
                experience: 2,
                location: "Maseru",
                appliedJob: "Java Developer",
                appliedDate: "2 days ago",
                status: "shortlisted",
                matchScore: 85,
            },
            {
                id: 5,
                name: "Lerato Mphuthi",
                email: "leratomphuthi5@gmail.com",
                avatar: "/placeholder-user.jpg",
                skills: ["C#", ".NET", "SQL Server", "Azure"],
                education: "Bachelor's in Computer Science",
                experience: 6,
                location: "Leribe",
                appliedJob: "Software Engineer",
                appliedDate: "3 days ago",
                status: "rejected",
                matchScore: 78,
            },
        ]
        setCandidates(mockCandidates)
        setFilteredCandidates(mockCandidates)
    }, [])

    useEffect(() => {
        let filtered = candidates

        if (searchQuery) {
            filtered = filtered.filter(
                (candidate) =>
                    candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    candidate.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
                    candidate.appliedJob.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }

        if (selectedTab !== "all") {
            filtered = filtered.filter((candidate) => candidate.status === selectedTab)
        }

        setFilteredCandidates(filtered)
    }, [searchQuery, selectedTab, candidates])

    const getStatusColor = (status) => {
        switch (status) {
            case "new": return "bg-blue-100 text-blue-800"
            case "reviewed": return "bg-yellow-100 text-yellow-800"
            case "shortlisted": return "bg-green-100 text-green-800"
            case "interviewed": return "bg-purple-100 text-purple-800"
            case "rejected": return "bg-red-100 text-red-800"
            default: return "bg-gray-100 text-gray-800"
        }
    }

    const getMatchColor = (score) => {
        if (score >= 90) return "text-green-600"
        if (score >= 80) return "text-blue-600"
        if (score >= 70) return "text-yellow-600"
        return "text-gray-600"
    }

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>
    }

    if (!user || user.role !== "company") {
        return null
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
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">View Candidates</h1>
                    <p className="text-slate-600">Browse and manage candidate applications</p>
                </div>

                {/* Search and Filters */}
                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                                <Input
                                    placeholder="Search candidates, skills, or jobs..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Button variant="outline">
                                <Filter className="h-4 w-4 mr-2" />
                                Advanced Filters
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Status Tabs */}
                <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-6">
                    <TabsList className="grid w-full grid-cols-6">
                        <TabsTrigger value="all">All ({candidates.length})</TabsTrigger>
                        <TabsTrigger value="new">New ({candidates.filter(c => c.status === "new").length})</TabsTrigger>
                        <TabsTrigger value="reviewed">Reviewed ({candidates.filter(c => c.status === "reviewed").length})</TabsTrigger>
                        <TabsTrigger value="shortlisted">Shortlisted ({candidates.filter(c => c.status === "shortlisted").length})</TabsTrigger>
                        <TabsTrigger value="interviewed">Interviewed ({candidates.filter(c => c.status === "interviewed").length})</TabsTrigger>
                        <TabsTrigger value="rejected">Rejected ({candidates.filter(c => c.status === "rejected").length})</TabsTrigger>
                    </TabsList>
                </Tabs>

                {/* Candidates List */}
                <div className="space-y-4">
                    {filteredCandidates.map((candidate) => (
                        <Card key={candidate.id} className="hover:shadow-lg transition-shadow">
                            <CardContent className="pt-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4 flex-1">
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src={candidate.avatar} alt={candidate.name} />
                                            <AvatarFallback>{candidate.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-semibold text-slate-900">{candidate.name}</h3>
                                                <Badge className={`${getMatchColor(candidate.matchScore)} border-0 bg-opacity-20`}>
                                                    <Star className="h-3 w-3 mr-1" />
                                                    {candidate.matchScore}% Match
                                                </Badge>
                                                <Badge className={getStatusColor(candidate.status)}>
                                                    {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                                                </Badge>
                                            </div>
                                            <p className="text-slate-600 mb-2">{candidate.education} • {candidate.experience} years experience</p>
                                            <p className="text-slate-600 mb-3">{candidate.location}</p>
                                            <p className="text-sm text-slate-500 mb-3">
                                                Applied to: <span className="font-medium">{candidate.appliedJob}</span> • {candidate.appliedDate}
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {candidate.skills.slice(0, 4).map((skill, index) => (
                                                    <Badge key={index} variant="outline" className="text-xs">
                                                        {skill}
                                                    </Badge>
                                                ))}
                                                {candidate.skills.length > 4 && (
                                                    <Badge variant="outline" className="text-xs">
                                                        +{candidate.skills.length - 4} more
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm">
                                            <Eye className="h-4 w-4 mr-2" />
                                            View Profile
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            <MessageSquare className="h-4 w-4 mr-2" />
                                            Contact
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {filteredCandidates.length === 0 && (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <p className="text-slate-600">No candidates found matching your criteria.</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
