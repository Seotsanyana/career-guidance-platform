import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="bg-gradient-to-br from-[#1e3a8a] to-[#0d9488] text-white">
        <nav className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">Lesotho Career Guidance</span>
          </div>
          <Link
            href="/login"
            className="bg-white text-[#1e3a8a] px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            target="_self"
          >
            Login
          </Link>
        </nav>

        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl font-bold mb-6 text-balance">Your Journey to the Perfect Career Starts Here</h1>
          <p className="text-xl mb-8 text-gray-100 max-w-2xl mx-auto text-pretty">
            Lesotho's comprehensive career guidance platform connecting students with institutions and employers across all sectors including healthcare, education, business, agriculture, government, and technology through intelligent career guidance and personalized assessments.
          </p>
          <Link
            href="/login"
            className="inline-block bg-[#14b8a6] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#0d9488] transition-colors"
            target="_self"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 bg-[#f1f5f9]">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-[#1e3a8a]">Comprehensive Career Guidance for Lesotho</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            <ModuleCard
              title="Admin Portal"
              description="Manage institutions, courses, and oversee the entire platform with comprehensive analytics."
              color="bg-[#1e3a8a]"
            />
            <ModuleCard
              title="Institution Hub"
              description="Post courses, manage applications, and connect with qualified students efficiently."
              color="bg-[#0d9488]"
            />
            <ModuleCard
              title="Student Center"
              description="Discover courses, take career assessments, and apply to your dream programs."
              color="bg-[#14b8a6]"
            />
            <ModuleCard
              title="Graduate Hub"
              description="Access job recommendations, professional development courses, and career networking opportunities."
              color="bg-[#7c3aed]"
            />
            <ModuleCard
              title="Company Connect"
              description="Post jobs, find talent, and connect with qualified candidates automatically."
              color="bg-[#1e40af]"
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-[#1e3a8a]">Comprehensive Career Guidance for All Sectors</h2>
              <p className="text-lg text-gray-700 mb-6">
                Our platform uses advanced matching algorithms to connect Lesotho students with educational opportunities and career paths across healthcare, education, business, agriculture, government, technology, and more based on their skills, interests, and LGCSE results.
              </p>
              <ul className="space-y-4">
                <BenefitItem text="LGCSE-based course qualification matching" />
                <BenefitItem text="AI-powered job and course recommendations" />
                <BenefitItem text="Comprehensive institution database" />
                <BenefitItem text="Multi-sector career opportunities" />
              </ul>
            </div>
            <div className="bg-gradient-to-br from-[#1e3a8a] to-[#0d9488] rounded-2xl p-12 text-white">
              <div className="space-y-6">
                <StatCard number="20,000+" label="Lesotho Students" />
                <StatCard number="7" label="Higher Education Institutions" />
                <StatCard number="500+" label="Job Opportunities" />
                <StatCard number="95%" label="Match Success Rate" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer with Wave Pattern */}
      <footer className="relative bg-[#1e3a8a] text-white mt-20 overflow-hidden">
        {/* Wave Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="wave-pattern w-[200%] h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,50 C150,80 350,0 600,50 C850,100 1050,20 1200,50 L1200,120 L0,120 Z" fill="currentColor" />
          </svg>
        </div>

        <div className="relative container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-5 gap-6 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl font-bold">Lesotho Career Guidance</span>
              </div>
              <p className="text-gray-300">Empowering Lesotho students with comprehensive career guidance across all sectors.</p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">For Students</h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link href="/login" className="hover:text-[#14b8a6]" target="_self">
                    LGCSE Course Matching
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-[#14b8a6]" target="_self">
                    Career Assessment
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-[#14b8a6]" target="_self">
                    Multi-Sector Job Opportunities
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">For Graduates</h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link href="/login" className="hover:text-[#14b8a6]" target="_self">
                    Job Recommendations
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-[#14b8a6]" target="_self">
                    Professional Development
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-[#14b8a6]" target="_self">
                    Career Networking
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">For Institutions</h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link href="/login" className="hover:text-[#14b8a6]" target="_self">
                    Post Courses
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-[#14b8a6]" target="_self">
                    Manage Applications
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-[#14b8a6]" target="_self">
                    Analytics
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">For Companies</h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link href="/login" className="hover:text-[#14b8a6]" target="_self">
                    Post Jobs
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-[#14b8a6]" target="_self">
                    Find Talent
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-[#14b8a6]" target="_self">
                    Recruitment Tools
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8 text-center text-gray-300">
            <p>&copy; 2025 Lesotho Career Guidance Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function ModuleCard({ title, description, color }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
      <div className={`${color} text-white w-16 h-16 rounded-lg flex items-center justify-center mb-4 text-2xl font-bold`}>{title.charAt(0)}</div>
      <h3 className="text-xl font-bold mb-2 text-[#1e3a8a]">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function BenefitItem({ text }) {
  return (
    <li className="flex items-center gap-3">
      <div className="w-6 h-6 rounded-full bg-[#14b8a6] flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">✓</div>
      <span className="text-gray-700">{text}</span>
    </li>
  )
}

function StatCard({ number, label }) {
  return (
    <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
      <div className="text-3xl font-bold mb-1">{number}</div>
      <div className="text-gray-200">{label}</div>
    </div>
  )
}
