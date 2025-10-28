"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context-updated"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, MapPin, Briefcase, GraduationCap, TrendingUp, Heart, Send } from "lucide-react"
import { rankJobsForStudent, getMatchReasons } from "@/lib/matching-algorithm"

export default function JobsPage() {
  const { user } = useAuth()
  const [jobs, setJobs] = useState([])
  const [filteredJobs, setFilteredJobs] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [savedJobs, setSavedJobs] = useState([])

  // Mock student profile
  const studentProfile = {
    skills: ["JavaScript", "React", "Node.js", "Python", "SQL"],
    education: "bachelor",
    experience: 2,
    interests: ["Technology", "Software Development", "Web Development"],
    location: "Maseru",
  }

  // Comprehensive mock jobs data covering all career sectors in Lesotho
  useEffect(() => {
    const mockJobs = [
      // Technology Jobs
      {
        id: 1,
        title: "Frontend Developer",
        company: "Lesotho Tech Solutions",
        location: "Maseru",
        salary: "M70,000 - M90,000",
        type: "Full-time",
        category: "Technology",
        requiredSkills: ["JavaScript", "React", "CSS"],
        educationRequired: "bachelor",
        experienceRequired: 2,
        description: "Build modern web applications using React and TypeScript.",
        posted: "2 days ago",
      },
      {
        id: 2,
        title: "Full Stack Developer",
        company: "Maseru Innovations",
        location: "Berea",
        salary: "M80,000 - M110,000",
        type: "Full-time",
        category: "Technology",
        requiredSkills: ["JavaScript", "React", "Node.js", "MongoDB"],
        educationRequired: "bachelor",
        experienceRequired: 3,
        description: "Work on both frontend and backend of our platform.",
        posted: "1 week ago",
      },
      {
        id: 3,
        title: "IT Support Specialist",
        company: "Lerotholi Polytechnic",
        location: "Maseru",
        salary: "M45,000 - M60,000",
        type: "Full-time",
        category: "Technology",
        requiredSkills: ["Windows", "Networking", "Hardware"],
        educationRequired: "diploma",
        experienceRequired: 1,
        description: "Provide technical support and maintain IT infrastructure.",
        posted: "3 days ago",
      },

      // Healthcare Jobs
      {
        id: 4,
        title: "Registered Nurse",
        company: "Queen Mamohato Memorial Hospital",
        location: "Maseru",
        salary: "M90,000 - M130,000",
        type: "Full-time",
        category: "Healthcare",
        requiredSkills: ["Patient Care", "Medical Procedures", "EMR Systems"],
        educationRequired: "bachelor",
        experienceRequired: 2,
        description: "Provide comprehensive nursing care to patients in various departments.",
        posted: "1 day ago",
      },
      {
        id: 5,
        title: "Medical Doctor",
        company: "Maseru Private Hospital",
        location: "Maseru",
        salary: "M150,000 - M220,000",
        type: "Full-time",
        category: "Healthcare",
        requiredSkills: ["Diagnosis", "Patient Care", "Medical Procedures"],
        educationRequired: "bachelor",
        experienceRequired: 3,
        description: "Provide medical care and treatment to patients.",
        posted: "5 days ago",
      },
      {
        id: 6,
        title: "Pharmacist",
        company: "Lesotho Pharmaceutical Services",
        location: "Maseru",
        salary: "M85,000 - M120,000",
        type: "Full-time",
        category: "Healthcare",
        requiredSkills: ["Pharmacy Practice", "Drug Knowledge", "Patient Counseling"],
        educationRequired: "bachelor",
        experienceRequired: 2,
        description: "Dispense medications and provide pharmaceutical care.",
        posted: "1 week ago",
      },
      {
        id: 7,
        title: "Community Health Worker",
        company: "Ministry of Health",
        location: "Various Districts",
        salary: "M50,000 - M70,000",
        type: "Full-time",
        category: "Healthcare",
        requiredSkills: ["Community Outreach", "Health Education", "Basic Medical Care"],
        educationRequired: "certificate",
        experienceRequired: 1,
        description: "Promote health and provide basic healthcare services in communities.",
        posted: "4 days ago",
      },

      // Education Jobs
      {
        id: 8,
        title: "Secondary School Teacher",
        company: "Ministry of Education",
        location: "Maseru",
        salary: "M80,000 - M120,000",
        type: "Full-time",
        category: "Education",
        requiredSkills: ["Teaching", "Subject Expertise", "Classroom Management"],
        educationRequired: "bachelor",
        experienceRequired: 2,
        description: "Teach and inspire students in secondary education.",
        posted: "3 days ago",
      },
      {
        id: 9,
        title: "University Lecturer",
        company: "National University of Lesotho",
        location: "Roma",
        salary: "M110,000 - M160,000",
        type: "Full-time",
        category: "Education",
        requiredSkills: ["Teaching", "Research", "Academic Writing"],
        educationRequired: "master",
        experienceRequired: 3,
        description: "Teach undergraduate courses and conduct research.",
        posted: "1 week ago",
      },
      {
        id: 10,
        title: "School Principal",
        company: "Maseru District Education",
        location: "Maseru",
        salary: "M130,000 - M180,000",
        type: "Full-time",
        category: "Education",
        requiredSkills: ["Leadership", "Education Management", "Policy Implementation"],
        educationRequired: "master",
        experienceRequired: 5,
        description: "Lead and manage school operations and staff.",
        posted: "2 weeks ago",
      },

      // Business & Finance Jobs
      {
        id: 11,
        title: "Accountant",
        company: "Lesotho Revenue Authority",
        location: "Maseru",
        salary: "M100,000 - M140,000",
        type: "Full-time",
        category: "Finance",
        requiredSkills: ["Accounting", "Taxation", "Financial Reporting"],
        educationRequired: "bachelor",
        experienceRequired: 3,
        description: "Manage financial records and ensure compliance with regulations.",
        posted: "5 days ago",
      },
      {
        id: 12,
        title: "Bank Manager",
        company: "Nedbank Lesotho",
        location: "Maseru",
        salary: "M150,000 - M220,000",
        type: "Full-time",
        category: "Finance",
        requiredSkills: ["Banking", "Management", "Financial Analysis"],
        educationRequired: "bachelor",
        experienceRequired: 5,
        description: "Oversee bank branch operations and manage staff.",
        posted: "1 week ago",
      },
      {
        id: 13,
        title: "Business Development Manager",
        company: "Lesotho Chamber of Commerce",
        location: "Maseru",
        salary: "M120,000 - M170,000",
        type: "Full-time",
        category: "Business",
        requiredSkills: ["Business Development", "Marketing", "Negotiation"],
        educationRequired: "bachelor",
        experienceRequired: 4,
        description: "Develop business strategies and expand market presence.",
        posted: "3 days ago",
      },

      // Agriculture Jobs
      {
        id: 14,
        title: "Agricultural Extension Officer",
        company: "Ministry of Agriculture",
        location: "Mafeteng",
        salary: "M70,000 - M100,000",
        type: "Full-time",
        category: "Agriculture",
        requiredSkills: ["Crop Science", "Farm Management", "Community Outreach"],
        educationRequired: "bachelor",
        experienceRequired: 2,
        description: "Provide agricultural advice and support to farmers.",
        posted: "4 days ago",
      },
      {
        id: 15,
        title: "Farm Manager",
        company: "Lesotho Agribusiness",
        location: "Leribe",
        salary: "M85,000 - M125,000",
        type: "Full-time",
        category: "Agriculture",
        requiredSkills: ["Farm Management", "Animal Husbandry", "Crop Production"],
        educationRequired: "diploma",
        experienceRequired: 3,
        description: "Manage farm operations and ensure productivity.",
        posted: "1 week ago",
      },

      // Government & Civil Service Jobs
      {
        id: 16,
        title: "Policy Analyst",
        company: "Ministry of Development Planning",
        location: "Maseru",
        salary: "M95,000 - M135,000",
        type: "Full-time",
        category: "Government",
        requiredSkills: ["Policy Analysis", "Research", "Report Writing"],
        educationRequired: "bachelor",
        experienceRequired: 3,
        description: "Analyze policies and provide recommendations for development.",
        posted: "6 days ago",
      },
      {
        id: 17,
        title: "Civil Engineer",
        company: "Ministry of Public Works",
        location: "Maseru",
        salary: "M110,000 - M155,000",
        type: "Full-time",
        category: "Engineering",
        requiredSkills: ["Civil Engineering", "Project Management", "AutoCAD"],
        educationRequired: "bachelor",
        experienceRequired: 4,
        description: "Design and oversee infrastructure projects.",
        posted: "1 week ago",
      },

      // Hospitality & Tourism Jobs
      {
        id: 18,
        title: "Hotel Manager",
        company: "Maseru Sun Hotel",
        location: "Maseru",
        salary: "M100,000 - M145,000",
        type: "Full-time",
        category: "Hospitality",
        requiredSkills: ["Hotel Management", "Customer Service", "Operations"],
        educationRequired: "diploma",
        experienceRequired: 3,
        description: "Manage hotel operations and guest services.",
        posted: "5 days ago",
      },
      {
        id: 19,
        title: "Tour Guide",
        company: "Lesotho Tourism Board",
        location: "Maseru",
        salary: "M45,000 - M65,000",
        type: "Contract",
        category: "Tourism",
        requiredSkills: ["Tour Guiding", "Customer Service", "Local Knowledge"],
        educationRequired: "certificate",
        experienceRequired: 1,
        description: "Guide tourists and promote Lesotho's attractions.",
        posted: "3 days ago",
      },

      // Media & Communications Jobs
      {
        id: 20,
        title: "Journalist",
        company: "Lesotho Times",
        location: "Maseru",
        salary: "M60,000 - M85,000",
        type: "Full-time",
        category: "Media",
        requiredSkills: ["Journalism", "Writing", "Research"],
        educationRequired: "bachelor",
        experienceRequired: 2,
        description: "Report news and write articles for publication.",
        posted: "4 days ago",
      },
      {
        id: 21,
        title: "Marketing Specialist",
        company: "Vodacom Lesotho",
        location: "Maseru",
        salary: "M95,000 - M135,000",
        type: "Full-time",
        category: "Marketing",
        requiredSkills: ["Digital Marketing", "Social Media", "Content Creation"],
        educationRequired: "bachelor",
        experienceRequired: 2,
        description: "Develop marketing campaigns and manage brand presence.",
        posted: "1 week ago",
      },

      // Construction & Engineering Jobs
      {
        id: 22,
        title: "Construction Project Manager",
        company: "Lesotho Construction Co.",
        location: "Maseru",
        salary: "M130,000 - M180,000",
        type: "Full-time",
        category: "Construction",
        requiredSkills: ["Project Management", "Construction", "Budgeting"],
        educationRequired: "bachelor",
        experienceRequired: 5,
        description: "Oversee construction projects from planning to completion.",
        posted: "6 days ago",
      },
      {
        id: 23,
        title: "Electrical Engineer",
        company: "Lesotho Electricity Company",
        location: "Maseru",
        salary: "M115,000 - M160,000",
        type: "Full-time",
        category: "Engineering",
        requiredSkills: ["Electrical Engineering", "Power Systems", "Maintenance"],
        educationRequired: "bachelor",
        experienceRequired: 3,
        description: "Design and maintain electrical systems and infrastructure.",
        posted: "1 week ago",
      },
    ]

    const rankedJobs = rankJobsForStudent(studentProfile, mockJobs)
    setJobs(rankedJobs)
    setFilteredJobs(rankedJobs)
  }, [])

  useEffect(() => {
    let filtered = jobs

    if (searchQuery) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.location.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((job) => job.category === selectedCategory)
    }

    setFilteredJobs(filtered)
  }, [searchQuery, selectedCategory, jobs])

  const toggleSaveJob = (jobId) => {
    setSavedJobs((prev) => (prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]))
  }

  const getMatchColor = (score) => {
    if (score >= 80) return "text-green-600 bg-green-50"
    if (score >= 60) return "text-blue-600 bg-blue-50"
    if (score >= 40) return "text-yellow-600 bg-yellow-50"
    return "text-gray-600 bg-gray-50"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Job Opportunities</h1>
          <p className="text-slate-600">Find your perfect career match with AI-powered recommendations</p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <Input
                  placeholder="Search jobs, companies, or locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full md:w-auto">
                <TabsList>
                  <TabsTrigger value="all">All Jobs</TabsTrigger>
                  <TabsTrigger value="Technology">Tech</TabsTrigger>
                  <TabsTrigger value="Healthcare">Healthcare</TabsTrigger>
                  <TabsTrigger value="Education">Education</TabsTrigger>
                  <TabsTrigger value="Finance">Finance</TabsTrigger>
                  <TabsTrigger value="Business">Business</TabsTrigger>
                  <TabsTrigger value="Agriculture">Agriculture</TabsTrigger>
                  <TabsTrigger value="Government">Government</TabsTrigger>
                  <TabsTrigger value="Engineering">Engineering</TabsTrigger>
                  <TabsTrigger value="Hospitality">Hospitality</TabsTrigger>
                  <TabsTrigger value="Tourism">Tourism</TabsTrigger>
                  <TabsTrigger value="Media">Media</TabsTrigger>
                  <TabsTrigger value="Marketing">Marketing</TabsTrigger>
                  <TabsTrigger value="Construction">Construction</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        {/* Job Listings */}
        <div className="grid gap-6">
          {filteredJobs.map((job) => {
            const matchReasons = getMatchReasons(studentProfile, job)
            const isSaved = savedJobs.includes(job.id)

            return (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-2xl">{job.title}</CardTitle>
                        <Badge className={`${getMatchColor(job.matchScore)} border-0`}>
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {job.matchScore}% Match
                        </Badge>
                      </div>
                      <CardDescription className="text-lg">{job.company}</CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleSaveJob(job.id)}
                      className={isSaved ? "text-red-500" : "text-slate-400"}
                    >
                      <Heart className={`h-5 w-5 ${isSaved ? "fill-current" : ""}`} />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-slate-700">{job.description}</p>

                    <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        {job.type}
                      </div>
                      <div className="flex items-center gap-1">
                        <GraduationCap className="h-4 w-4" />
                        {job.educationRequired}
                      </div>
                      <div className="font-semibold text-teal-600">{job.salary}</div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-slate-700 mb-2">Required Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {job.requiredSkills.map((skill, index) => (
                          <Badge key={index} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {matchReasons.length > 0 && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm font-medium text-blue-900 mb-1">Why this matches you:</p>
                        <ul className="text-sm text-blue-700 space-y-1">
                          {matchReasons.map((reason, index) => (
                            <li key={index}>• {reason}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex gap-3 pt-2">
                      <Button className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700">
                        <Send className="h-4 w-4 mr-2" />
                        Apply Now
                      </Button>
                      <Button variant="outline">View Details</Button>
                    </div>

                    <p className="text-xs text-slate-500">Posted {job.posted}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredJobs.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-slate-600">No jobs found matching your criteria.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
