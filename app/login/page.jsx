"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

export default function LoginPage() {
  const router = useRouter()
  const { login, signup, loading: authLoading, resendVerificationEmail } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [userType, setUserType] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
    phone: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [needsVerification, setNeedsVerification] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    // Validate user type selection
    const dashboardRoutes = {
      admin: "/admin",
      institution: "/institution",
      student: "/student",
      company: "/company",
    }

    if (!userType || !dashboardRoutes[userType]) {
      setError("Please select a user type")
      setLoading(false)
      return
    }

    try {
      if (isLogin) {
        await login(formData.email, formData.password, userType)
        // Redirect to appropriate dashboard
        router.push(dashboardRoutes[userType])
      } else {
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords do not match")
        }

        const additionalData = { phone: formData.phone }

        // For students, collect additional info
        if (userType === 'student') {
          additionalData.lgcseResults = []
          additionalData.gpa = 0
          additionalData.qualificationLevel = ''
          additionalData.field = ''
          additionalData.institution = ''
        }

        const result = await signup(formData.email, formData.password, formData.name, userType, additionalData)

        setSuccess("Account created successfully! You can now login.")
        setIsLogin(true)
      }

      // Clear form data for security
      setFormData({
        email: "",
        password: "",
        name: "",
        confirmPassword: "",
        phone: "",
      })
    } catch (err) {
      setError(err.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleResendVerification = async () => {
    try {
      await resendVerificationEmail()
      setSuccess("Verification email sent! Please check your inbox.")
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-2 mb-8">
            <span className="text-2xl font-bold text-[#1e3a8a]">CareerPath</span>
          </Link>

          <h1 className="text-3xl font-bold text-[#1e3a8a] mb-2">{isLogin ? "Welcome Back" : "Create Account"}</h1>
          <p className="text-gray-600 mb-8">
            {isLogin ? "Sign in to continue your journey" : "Start your career journey today"}
          </p>

          {/* User Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">I am a:</label>
            <div className="grid grid-cols-2 gap-3">
              <UserTypeButton
                type="student"
                label="Student"
                selected={userType === "student"}
                onClick={() => setUserType("student")}
              />
              <UserTypeButton
                type="institution"
                label="Institution"
                selected={userType === "institution"}
                onClick={() => setUserType("institution")}
              />
              <UserTypeButton
                type="company"
                label="Company"
                selected={userType === "company"}
                onClick={() => setUserType("company")}
              />
              <UserTypeButton
                type="admin"
                label="Admin"
                selected={userType === "admin"}
                onClick={() => setUserType("admin")}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
                      placeholder="Enter your name"
                      required={!isLogin}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number (Optional)</label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
                      placeholder="+266 XXX XXX XXX"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
                  placeholder="Enter your email"
                  required
                  autoComplete="off"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
                  placeholder="Enter your password"
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <div className="relative">
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
                    placeholder="Confirm your password"
                    required={!isLogin}
                    autoComplete="new-password"
                  />
                </div>
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-gray-300 text-[#14b8a6] focus:ring-[#14b8a6]" />
                  <span className="text-gray-600">Remember me</span>
                </label>
                <Link href="#" className="text-[#14b8a6] hover:text-[#0d9488]">
                  Forgot password?
                </Link>
              </div>
            )}

            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}

            {success && (
              <div className="text-green-600 text-sm text-center bg-green-50 p-3 rounded-lg">{success}</div>
            )}

            {needsVerification && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-blue-800 text-sm mb-2">Didn't receive the verification email?</p>
                <button
                  type="button"
                  onClick={handleResendVerification}
                  className="text-blue-600 hover:text-blue-800 text-sm underline"
                >
                  Resend Verification Email
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || authLoading}
              className="w-full bg-gradient-to-r from-[#1e3a8a] to-[#0d9488] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading || authLoading ? "Please wait..." : (isLogin ? "Sign In" : "Create Account")}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => {
                setIsLogin(!isLogin)
                setError("")
                setSuccess("")
                setNeedsVerification(false)
                setFormData({
                  email: "",
                  password: "",
                  name: "",
                  confirmPassword: "",
                  phone: "",
                })
              }}
              className="text-[#14b8a6] hover:text-[#0d9488] font-semibold"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </div>

      {/* Right Side - Image/Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#1e3a8a] to-[#0d9488] items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="wave-pattern w-[200%] h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,50 C150,80 350,0 600,50 C850,100 1050,20 1200,50 L1200,120 L0,120 Z" fill="currentColor" />
          </svg>
        </div>

        <div className="relative text-white text-center max-w-lg">
          <h2 className="text-4xl font-bold mb-4">Your Future Starts Here</h2>
          <p className="text-xl text-gray-100">
            Join thousands of students, institutions, and companies building successful careers together.
          </p>

          <div className="grid grid-cols-3 gap-6 mt-12">
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-3xl font-bold">10K+</div>
              <div className="text-sm text-gray-200">Students</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-3xl font-bold">500+</div>
              <div className="text-sm text-gray-200">Institutions</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-3xl font-bold">1K+</div>
              <div className="text-sm text-gray-200">Companies</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function UserTypeButton({ type, label, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`py-3 px-4 rounded-lg border-2 font-medium transition-all ${selected
        ? "border-[#14b8a6] bg-[#14b8a6]/10 text-[#0d9488]"
        : type === "student"
          ? "border-gray-300 text-gray-600 cursor-default"
          : "border-gray-300 text-gray-600 hover:border-gray-400"
        }`}
    >
      {label}
    </button>
  )
}
