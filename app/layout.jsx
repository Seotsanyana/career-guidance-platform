import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context-updated"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Lesotho Career Guidance Platform",
  description: "Comprehensive career guidance platform for Lesotho students, connecting learners with institutions, employers, and diverse career opportunities across all sectors including healthcare, education, business, agriculture, government, and technology.",
  generator: 'v0.app'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
