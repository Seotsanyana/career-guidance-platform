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
import { ArrowLeft, Building, MapPin, Calendar, Users, Phone, Mail, Save } from "lucide-react"

export default function CompanyProfilePage() {
    const { user, loading } = useAuth()
    const router = useRouter()
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        industry: "",
        location: "",
        established: "",
        size: "",
        description: "",
        contact: {
            phone: "",
            email: "",
        }
    })

    useEffect(() => {
        if (!loading && (!user || user.role !== "company")) {
            router.push("/login")
        }
    }, [user, loading, router])

    useEffect(() => {
        if (user?.companyData) {
            setFormData(user.companyData)
        }
    }, [user])

    const handleInputChange = (field, value) => {
        if (field.includes('.')) {
            const [parent, child] = field.split('.')
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }))
        } else {
            setFormData(prev => ({ ...prev, [field]: value }))
        }
    }

    const handleSave = () => {
        // TODO: Implement save logic
        console.log("Saving company profile:", formData)
        setIsEditing(false)
        // For now, just toggle back to view mode
    }

    const handleCancel = () => {
        if (user?.companyData) {
            setFormData(user.companyData)
        }
        setIsEditing(false)
    }

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
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Company Profile</h1>
                    <p className="text-slate-600">Manage your company information and settings</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Profile Overview */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-center">
                                    <div className="p-6 bg-blue-100 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                                        <Building className="h-12 w-12 text-blue-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900 mb-2">{companyData.name}</h2>
                                    <p className="text-slate-600 mb-4">{companyData.industry}</p>
                                    <div className="space-y-2 text-sm text-slate-600">
                                        <div className="flex items-center justify-center gap-2">
                                            <MapPin className="h-4 w-4" />
                                            {companyData.location}
                                        </div>
                                        <div className="flex items-center justify-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            Est. {companyData.established}
                                        </div>
                                        <div className="flex items-center justify-center gap-2">
                                            <Users className="h-4 w-4" />
                                            {companyData.size} employees
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Profile Details */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Company Details</CardTitle>
                                        <CardDescription>Update your company information</CardDescription>
                                    </div>
                                    {!isEditing ? (
                                        <Button onClick={() => setIsEditing(true)}>
                                            Edit Profile
                                        </Button>
                                    ) : (
                                        <div className="flex gap-2">
                                            <Button onClick={handleSave}>
                                                <Save className="h-4 w-4 mr-2" />
                                                Save Changes
                                            </Button>
                                            <Button variant="outline" onClick={handleCancel}>
                                                Cancel
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Company Name</Label>
                                        {isEditing ? (
                                            <Input
                                                id="name"
                                                value={formData.name}
                                                onChange={(e) => handleInputChange("name", e.target.value)}
                                            />
                                        ) : (
                                            <p className="text-slate-900 font-medium">{companyData.name}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="industry">Industry</Label>
                                        {isEditing ? (
                                            <Select value={formData.industry} onValueChange={(value) => handleInputChange("industry", value)}>
                                                <SelectTrigger>
                                                    <SelectValue />
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
                                        ) : (
                                            <p className="text-slate-900">{companyData.industry}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="location">Location</Label>
                                        {isEditing ? (
                                            <Input
                                                id="location"
                                                value={formData.location}
                                                onChange={(e) => handleInputChange("location", e.target.value)}
                                            />
                                        ) : (
                                            <p className="text-slate-900">{companyData.location}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="established">Established</Label>
                                        {isEditing ? (
                                            <Input
                                                id="established"
                                                value={formData.established}
                                                onChange={(e) => handleInputChange("established", e.target.value)}
                                            />
                                        ) : (
                                            <p className="text-slate-900">{companyData.established}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="size">Company Size</Label>
                                        {isEditing ? (
                                            <Select value={formData.size} onValueChange={(value) => handleInputChange("size", value)}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="1-10">1-10 employees</SelectItem>
                                                    <SelectItem value="11-50">11-50 employees</SelectItem>
                                                    <SelectItem value="51-200">51-200 employees</SelectItem>
                                                    <SelectItem value="201-500">201-500 employees</SelectItem>
                                                    <SelectItem value="501-1000">501-1000 employees</SelectItem>
                                                    <SelectItem value="1000+">1000+ employees</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <p className="text-slate-900">{companyData.size}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Company Description</Label>
                                    {isEditing ? (
                                        <Textarea
                                            id="description"
                                            rows={4}
                                            value={formData.description}
                                            onChange={(e) => handleInputChange("description", e.target.value)}
                                        />
                                    ) : (
                                        <p className="text-slate-700">{companyData.description}</p>
                                    )}
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        {isEditing ? (
                                            <Input
                                                id="phone"
                                                value={formData.contact.phone}
                                                onChange={(e) => handleInputChange("contact.phone", e.target.value)}
                                            />
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-4 w-4 text-slate-400" />
                                                <p className="text-slate-900">{companyData.contact.phone}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        {isEditing ? (
                                            <Input
                                                id="email"
                                                type="email"
                                                value={formData.contact.email}
                                                onChange={(e) => handleInputChange("contact.email", e.target.value)}
                                            />
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <Mail className="h-4 w-4 text-slate-400" />
                                                <p className="text-slate-900">{companyData.contact.email}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
