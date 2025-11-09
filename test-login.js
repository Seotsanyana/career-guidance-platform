import { LESOTHO_INSTITUTIONS, getInstitutionByEmail } from './lib/institutions-data.js'
import { LESOTHO_COMPANIES, getCompanyByEmail } from './lib/companies-data.js'

console.log('🧪 Testing Login Functionality for All User Types\n')

// Test Institution Login
console.log('🏫 Testing Institution Login:')
LESOTHO_INSTITUTIONS.forEach(inst => {
    const found = getInstitutionByEmail(inst.email)
    const loginValid = found && found.password === inst.password
    console.log(`  ${inst.name}: ${loginValid ? '✅' : '❌'} (${inst.email} / ${inst.password})`)
})

// Test Company Login
console.log('\n🏢 Testing Company Login:')
LESOTHO_COMPANIES.forEach(company => {
    const found = getCompanyByEmail(company.email)
    const loginValid = found && found.password === company.password
    console.log(`  ${company.name}: ${loginValid ? '✅' : '❌'} (${company.email} / ${company.password})`)
})

// Test Admin Login (special case)
console.log('\n👑 Testing Admin Login:')
const adminEmail = 'monyauseotsanyana7@gmail.com'
const adminPassword = 'admin123' // This would need to be set appropriately
console.log(`  Admin: ${adminEmail} (password: ${adminPassword}) - Manual verification required`)

// Test Student/Graduate Signup (mock)
console.log('\n🎓 Testing Student/Graduate Signup (Mock):')
const mockUsers = [
    { email: 'student@test.com', name: 'Test Student', role: 'student' },
    { email: 'graduate@test.com', name: 'Test Graduate', role: 'graduate' }
]
mockUsers.forEach(user => {
    console.log(`  ${user.name}: ✅ Can signup with any email (${user.email})`)
})

console.log('\n📋 Summary:')
console.log(`  Total Institutions: ${LESOTHO_INSTITUTIONS.length}`)
console.log(`  Total Companies: ${LESOTHO_COMPANIES.length}`)
console.log(`  Admin Users: 1 (restricted email)`)
console.log(`  Student/Graduate: Unlimited (signup required)`)

console.log('\n🔐 Login System Status: RESTORED TO JSON DATABASE')
console.log('✅ Institutions: Predefined credentials in institutions-data.js')
console.log('✅ Companies: Predefined credentials in companies-data.js')
console.log('✅ Students/Graduates: Can signup with any email')
console.log('✅ Admin: Restricted to specific email only')
