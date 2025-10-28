// Job Matching Algorithm - Matches students with jobs based on skills, interests, and qualifications

export function calculateJobMatch(student, job) {
  let score = 0
  const weights = {
    skills: 0.35,
    education: 0.25,
    experience: 0.2,
    interests: 0.15,
    location: 0.05,
  }

  // Skills matching
  const skillsMatch = calculateSkillsMatch(student.skills || [], job.requiredSkills || [])
  score += skillsMatch * weights.skills

  // Education matching
  const educationMatch = calculateEducationMatch(student.education || "", job.educationRequired || "")
  score += educationMatch * weights.education

  // Experience matching
  const experienceMatch = calculateExperienceMatch(student.experience || 0, job.experienceRequired || 0)
  score += experienceMatch * weights.experience

  // Interests matching
  const interestsMatch = calculateInterestsMatch(student.interests || [], job.category || "")
  score += interestsMatch * weights.interests

  // Location matching
  const locationMatch = calculateLocationMatch(student.location || "", job.location || "")
  score += locationMatch * weights.location

  return Math.round(score * 100)
}

function calculateSkillsMatch(studentSkills, requiredSkills) {
  if (requiredSkills.length === 0) return 1

  const matchedSkills = requiredSkills.filter((skill) =>
    studentSkills.some((s) => s.toLowerCase().includes(skill.toLowerCase())),
  )

  return matchedSkills.length / requiredSkills.length
}

function calculateEducationMatch(studentEducation, requiredEducation) {
  const educationLevels = {
    "high school": 1,
    diploma: 2,
    bachelor: 3,
    master: 4,
    phd: 5,
  }

  const studentLevel = educationLevels[studentEducation.toLowerCase()] || 0
  const requiredLevel = educationLevels[requiredEducation.toLowerCase()] || 0

  if (studentLevel >= requiredLevel) return 1
  if (studentLevel === requiredLevel - 1) return 0.7
  return 0.3
}

function calculateExperienceMatch(studentExp, requiredExp) {
  if (studentExp >= requiredExp) return 1
  if (studentExp >= requiredExp * 0.7) return 0.8
  if (studentExp >= requiredExp * 0.5) return 0.5
  return 0.2
}

function calculateInterestsMatch(studentInterests, jobCategory) {
  if (studentInterests.length === 0) return 0.5

  // Expanded interest matching for diverse careers
  const interestMappings = {
    "Technology": ["Technology", "Software Development", "Web Development", "IT", "Programming"],
    "Healthcare": ["Healthcare", "Medicine", "Nursing", "Medical", "Health"],
    "Education": ["Education", "Teaching", "Academic", "Learning"],
    "Finance": ["Finance", "Accounting", "Banking", "Financial"],
    "Business": ["Business", "Management", "Entrepreneurship", "Commerce"],
    "Agriculture": ["Agriculture", "Farming", "Agribusiness", "Rural Development"],
    "Government": ["Government", "Public Service", "Policy", "Administration"],
    "Engineering": ["Engineering", "Technical", "Infrastructure", "Construction"],
    "Hospitality": ["Hospitality", "Hotel Management", "Customer Service"],
    "Tourism": ["Tourism", "Travel", "Hospitality"],
    "Media": ["Media", "Journalism", "Communications", "Writing"],
    "Marketing": ["Marketing", "Advertising", "Communications"],
    "Construction": ["Construction", "Building", "Engineering"],
    "Design": ["Design", "Creative", "Art"],
    "Data Science": ["Data", "Analytics", "Statistics"]
  }

  const relevantInterests = interestMappings[jobCategory] || [jobCategory]

  const hasMatch = studentInterests.some(studentInterest =>
    relevantInterests.some(relevantInterest =>
      studentInterest.toLowerCase().includes(relevantInterest.toLowerCase()) ||
      relevantInterest.toLowerCase().includes(studentInterest.toLowerCase())
    )
  )

  return hasMatch ? 1 : 0.3
}

function calculateLocationMatch(studentLocation, jobLocation) {
  if (!studentLocation || !jobLocation) return 0.5

  if (studentLocation.toLowerCase() === jobLocation.toLowerCase()) return 1

  const studentCity = studentLocation.split(",")[0].trim().toLowerCase()
  const jobCity = jobLocation.split(",")[0].trim().toLowerCase()

  return studentCity === jobCity ? 0.8 : 0.3
}

export function rankJobsForStudent(student, jobs) {
  const rankedJobs = jobs.map((job) => ({
    ...job,
    matchScore: calculateJobMatch(student, job),
  }))

  return rankedJobs.sort((a, b) => b.matchScore - a.matchScore)
}

export function rankStudentsForJob(job, students) {
  const rankedStudents = students.map((student) => ({
    ...student,
    matchScore: calculateJobMatch(student, job),
  }))

  return rankedStudents.sort((a, b) => b.matchScore - a.matchScore)
}

export function getMatchReasons(student, job) {
  const reasons = []

  const skillsMatch = calculateSkillsMatch(student.skills || [], job.requiredSkills || [])
  if (skillsMatch > 0.7) {
    reasons.push("Strong skills match")
  } else if (skillsMatch > 0.4) {
    reasons.push("Partial skills match")
  }

  const educationMatch = calculateEducationMatch(student.education || "", job.educationRequired || "")
  if (educationMatch === 1) {
    reasons.push("Meets education requirements")
  } else if (educationMatch > 0.5) {
    reasons.push("Close to education requirements")
  }

  const experienceMatch = calculateExperienceMatch(student.experience || 0, job.experienceRequired || 0)
  if (experienceMatch === 1) {
    reasons.push("Sufficient experience")
  } else if (experienceMatch > 0.5) {
    reasons.push("Some relevant experience")
  }

  const locationMatch = calculateLocationMatch(student.location || "", job.location || "")
  if (locationMatch > 0.7) {
    reasons.push("Location match")
  }

  return reasons
}
