"use client"

import { useAuth } from "@/lib/auth-context-updated"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, X } from "lucide-react"
import { addJob } from "@/lib/jobs-data"

export default function PostJobPage() {
    const { user, loading } = useAuth()
    const router = useRouter()
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
        type: "",
        category: "",
        salary: "",
        requiredSkills: [],
        educationRequired: "",
        experienceRequired: "",
    })
    const [skillInput, setSkillInput] = useState("")

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

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const addSkill = () => {
        if (skillInput.trim() && !formData.requiredSkills.includes(skillInput.trim())) {
            setFormData(prev => ({
                ...prev,
                requiredSkills: [...prev.requiredSkills, skillInput.trim()]
            }))
            setSkillInput("")
        }
    }

    const removeSkill = (skillToRemove) => {
        setFormData(prev => ({
            ...prev,
            requiredSkills: prev.requiredSkills.filter(skill => skill !== skillToRemove)
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // Prepare job data
        const jobData = {
            companyId: user.id,
            companyName: user.name || user.email, // fallback to email if name not available
            title: formData.title,
            description: formData.description,
            location: formData.location,
            type: formData.type,
            category: formData.category,
            salary: formData.salary,
            educationRequired: formData.educationRequired,
            experienceRequired: formData.experienceRequired ? `${formData.experienceRequired} years` : "0 years",
            requiredSkills: formData.requiredSkills,
        }
        // Add job to the system
        const newJob = addJob(jobData)
        console.log("Job posted successfully:", newJob)
        // Navigate back to dashboard
        router.push("/company")
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
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Post a New Job</h1>
                    <p className="text-slate-600">Create a job posting to attract top talent</p>
                </div>

                <Card className="max-w-4xl mx-auto">
                    <CardHeader>
                        <CardTitle>Job Details</CardTitle>
                        <CardDescription>Fill in the information about the job position</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Job Title *</Label>
                                    <Input
                                        id="title"
                                        placeholder="e.g. Senior Frontend Developer"
                                        value={formData.title}
                                        onChange={(e) => handleInputChange("title", e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="location">Location *</Label>
                                    <Input
                                        id="location"
                                        placeholder="e.g. Maseru, Lesotho"
                                        value={formData.location}
                                        onChange={(e) => handleInputChange("location", e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="type">Job Type *</Label>
                                    <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select job type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="full-time">Full-time</SelectItem>
                                            <SelectItem value="part-time">Part-time</SelectItem>
                                            <SelectItem value="contract">Contract</SelectItem>
                                            <SelectItem value="internship">Internship</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="category">Category *</Label>
                                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Technology">Technology</SelectItem>
                                            <SelectItem value="Healthcare">Healthcare</SelectItem>
                                            <SelectItem value="Education">Education</SelectItem>
                                            <SelectItem value="Finance">Finance</SelectItem>
                                            <SelectItem value="Business">Business</SelectItem>
                                            <SelectItem value="Agriculture">Agriculture</SelectItem>
                                            <SelectItem value="Government">Government</SelectItem>
                                            <SelectItem value="Engineering">Engineering</SelectItem>
                                            <SelectItem value="Hospitality">Hospitality</SelectItem>
                                            <SelectItem value="Tourism">Tourism</SelectItem>
                                            <SelectItem value="Media">Media</SelectItem>
                                            <SelectItem value="Marketing">Marketing</SelectItem>
                                            <SelectItem value="Construction">Construction</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="salary">Salary Range</Label>
                                <Input
                                    id="salary"
                                    placeholder="e.g. M70,000 - M90,000"
                                    value={formData.salary}
                                    onChange={(e) => handleInputChange("salary", e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Job Description *</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Describe the role, responsibilities, and requirements..."
                                    rows={6}
                                    value={formData.description}
                                    onChange={(e) => handleInputChange("description", e.target.value)}
                                    required
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="education">Education Required</Label>
                                    <Select value={formData.educationRequired} onValueChange={(value) => handleInputChange("educationRequired", value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select education level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="certificate">Certificate</SelectItem>
                                            <SelectItem value="diploma">Diploma</SelectItem>
                                            <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                                            <SelectItem value="master">Master's Degree</SelectItem>
                                            <SelectItem value="phd">PhD</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="experience">Experience Required (years)</Label>
                                    <Input
                                        id="experience"
                                        type="number"
                                        placeholder="e.g. 2"
                                        value={formData.experienceRequired}
                                        onChange={(e) => handleInputChange("experienceRequired", e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Required Skills</Label>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Add a skill..."
                                        value={skillInput}
                                        onChange={(e) => setSkillInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                                    />
                                    <Button type="button" onClick={addSkill} variant="outline">
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {formData.requiredSkills.map((skill, index) => (
                                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                            {skill}
                                            <X
                                                className="h-3 w-3 cursor-pointer"
                                                onClick={() => removeSkill(skill)}
                                            />
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-4 pt-6">
                                <Button type="submit" className="flex-1">
                                    Post Job
                                </Button>
                                <Button type="button" variant="outline" onClick={() => router.push("/company")}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
