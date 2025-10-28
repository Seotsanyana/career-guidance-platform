"use client"

import { useAuth } from "@/lib/auth-context-updated"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Settings, Mail, Shield, Database, Save } from "lucide-react"

// Mock current settings
const currentSettings = {
    email: {
        smtpHost: "smtp.gmail.com",
        smtpPort: "587",
        smtpUser: "noreply@careerguidance.com",
        smtpPassword: "••••••••",
        fromEmail: "noreply@careerguidance.com",
        fromName: "CareerPath"
    },
    security: {
        sessionTimeout: 30,
        passwordMinLength: 8,
        twoFactorEnabled: true,
        bruteForceProtection: true,
        ipWhitelist: false
    },
    features: {
        jobMatching: true,
        courseRecommendations: true,
        analytics: true,
        notifications: true,
        apiAccess: false
    },
    maintenance: {
        maintenanceMode: false,
        maintenanceMessage: "The platform is currently under maintenance. Please check back later.",
        backupFrequency: "daily",
        logRetention: 90
    }
}

export default function SystemConfigPage() {
    const { user, loading } = useAuth()
    const router = useRouter()
    const [settings, setSettings] = useState(currentSettings)
    const [hasChanges, setHasChanges] = useState(false)

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

    const handleSettingChange = (category, key, value) => {
        setSettings(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [key]: value
            }
        }))
        setHasChanges(true)
    }

    const handleSave = () => {
        // In a real app, this would save to backend
        console.log("Saving settings:", settings)
        setHasChanges(false)
        // Show success message
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
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">System Configuration</h1>
                    <p className="text-slate-600">Configure platform settings and preferences</p>
                </div>

                <Tabs defaultValue="email" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="email" className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            Email
                        </TabsTrigger>
                        <TabsTrigger value="security" className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            Security
                        </TabsTrigger>
                        <TabsTrigger value="features" className="flex items-center gap-2">
                            <Settings className="h-4 w-4" />
                            Features
                        </TabsTrigger>
                        <TabsTrigger value="maintenance" className="flex items-center gap-2">
                            <Database className="h-4 w-4" />
                            Maintenance
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="email">
                        <Card>
                            <CardHeader>
                                <CardTitle>Email Configuration</CardTitle>
                                <CardDescription>Configure SMTP settings for email notifications</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="smtpHost">SMTP Host</Label>
                                        <Input
                                            id="smtpHost"
                                            value={settings.email.smtpHost}
                                            onChange={(e) => handleSettingChange("email", "smtpHost", e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="smtpPort">SMTP Port</Label>
                                        <Input
                                            id="smtpPort"
                                            value={settings.email.smtpPort}
                                            onChange={(e) => handleSettingChange("email", "smtpPort", e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="smtpUser">SMTP Username</Label>
                                        <Input
                                            id="smtpUser"
                                            value={settings.email.smtpUser}
                                            onChange={(e) => handleSettingChange("email", "smtpUser", e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="smtpPassword">SMTP Password</Label>
                                        <Input
                                            id="smtpPassword"
                                            type="password"
                                            value={settings.email.smtpPassword}
                                            onChange={(e) => handleSettingChange("email", "smtpPassword", e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="fromEmail">From Email</Label>
                                        <Input
                                            id="fromEmail"
                                            value={settings.email.fromEmail}
                                            onChange={(e) => handleSettingChange("email", "fromEmail", e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="fromName">From Name</Label>
                                        <Input
                                            id="fromName"
                                            value={settings.email.fromName}
                                            onChange={(e) => handleSettingChange("email", "fromName", e.target.value)}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="security">
                        <Card>
                            <CardHeader>
                                <CardTitle>Security Settings</CardTitle>
                                <CardDescription>Configure security and authentication settings</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                                        <Input
                                            id="sessionTimeout"
                                            type="number"
                                            value={settings.security.sessionTimeout}
                                            onChange={(e) => handleSettingChange("security", "sessionTimeout", parseInt(e.target.value))}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
                                        <Input
                                            id="passwordMinLength"
                                            type="number"
                                            value={settings.security.passwordMinLength}
                                            onChange={(e) => handleSettingChange("security", "passwordMinLength", parseInt(e.target.value))}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label>Two-Factor Authentication</Label>
                                            <p className="text-sm text-slate-600">Require 2FA for admin accounts</p>
                                        </div>
                                        <Switch
                                            checked={settings.security.twoFactorEnabled}
                                            onCheckedChange={(checked) => handleSettingChange("security", "twoFactorEnabled", checked)}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label>Brute Force Protection</Label>
                                            <p className="text-sm text-slate-600">Block accounts after failed login attempts</p>
                                        </div>
                                        <Switch
                                            checked={settings.security.bruteForceProtection}
                                            onCheckedChange={(checked) => handleSettingChange("security", "bruteForceProtection", checked)}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label>IP Whitelist</Label>
                                            <p className="text-sm text-slate-600">Restrict admin access to specific IPs</p>
                                        </div>
                                        <Switch
                                            checked={settings.security.ipWhitelist}
                                            onCheckedChange={(checked) => handleSettingChange("security", "ipWhitelist", checked)}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="features">
                        <Card>
                            <CardHeader>
                                <CardTitle>Feature Toggles</CardTitle>
                                <CardDescription>Enable or disable platform features</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>AI Job Matching</Label>
                                        <p className="text-sm text-slate-600">Enable intelligent job-student matching</p>
                                    </div>
                                    <Switch
                                        checked={settings.features.jobMatching}
                                        onCheckedChange={(checked) => handleSettingChange("features", "jobMatching", checked)}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Course Recommendations</Label>
                                        <p className="text-sm text-slate-600">Show personalized course suggestions</p>
                                    </div>
                                    <Switch
                                        checked={settings.features.courseRecommendations}
                                        onCheckedChange={(checked) => handleSettingChange("features", "courseRecommendations", checked)}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Analytics Dashboard</Label>
                                        <p className="text-sm text-slate-600">Enable detailed analytics for all users</p>
                                    </div>
                                    <Switch
                                        checked={settings.features.analytics}
                                        onCheckedChange={(checked) => handleSettingChange("features", "analytics", checked)}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Email Notifications</Label>
                                        <p className="text-sm text-slate-600">Send automated email notifications</p>
                                    </div>
                                    <Switch
                                        checked={settings.features.notifications}
                                        onCheckedChange={(checked) => handleSettingChange("features", "notifications", checked)}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>API Access</Label>
                                        <p className="text-sm text-slate-600">Allow third-party API integrations</p>
                                    </div>
                                    <Switch
                                        checked={settings.features.apiAccess}
                                        onCheckedChange={(checked) => handleSettingChange("features", "apiAccess", checked)}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="maintenance">
                        <Card>
                            <CardHeader>
                                <CardTitle>Maintenance Settings</CardTitle>
                                <CardDescription>Configure maintenance mode and data management</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Maintenance Mode</Label>
                                        <p className="text-sm text-slate-600">Put the platform in maintenance mode</p>
                                    </div>
                                    <Switch
                                        checked={settings.maintenance.maintenanceMode}
                                        onCheckedChange={(checked) => handleSettingChange("maintenance", "maintenanceMode", checked)}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="maintenanceMessage">Maintenance Message</Label>
                                    <Textarea
                                        id="maintenanceMessage"
                                        value={settings.maintenance.maintenanceMessage}
                                        onChange={(e) => handleSettingChange("maintenance", "maintenanceMessage", e.target.value)}
                                        rows={3}
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="backupFrequency">Backup Frequency</Label>
                                        <Select
                                            value={settings.maintenance.backupFrequency}
                                            onValueChange={(value) => handleSettingChange("maintenance", "backupFrequency", value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="hourly">Hourly</SelectItem>
                                                <SelectItem value="daily">Daily</SelectItem>
                                                <SelectItem value="weekly">Weekly</SelectItem>
                                                <SelectItem value="monthly">Monthly</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="logRetention">Log Retention (days)</Label>
                                        <Input
                                            id="logRetention"
                                            type="number"
                                            value={settings.maintenance.logRetention}
                                            onChange={(e) => handleSettingChange("maintenance", "logRetention", parseInt(e.target.value))}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {hasChanges && (
                    <div className="fixed bottom-6 right-6">
                        <Button onClick={handleSave} className="shadow-lg">
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
