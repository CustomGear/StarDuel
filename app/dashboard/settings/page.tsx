import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import SettingsPanel from '@/components/SettingsPanel'
import CompanySettings from '@/components/CompanySettings'
import UserManagement from '@/components/UserManagement'
import ApiSettings from '@/components/ApiSettings'

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)
  
  // Demo mode - allow access without company check
  // if (!session?.user?.companyId) {
  //   return <div>No company found</div>
  // }

  // Fetch company and user data (demo mode)
  const [company, users] = await Promise.all([
    prisma.company.findFirst({
      // where: { id: session.user.companyId } // Demo mode
    }),
    prisma.user.findMany({
      // where: { companyId: session.user.companyId }, // Demo mode
      orderBy: { createdAt: 'desc' }
    })
  ])

  if (!company) {
    return <div>Company not found</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your company settings, users, and integrations
        </p>
      </div>

      <SettingsPanel>
        <CompanySettings company={company} />
        <UserManagement users={users} currentUser={{ id: 'demo-user', role: 'admin' }} />
        <ApiSettings />
      </SettingsPanel>
    </div>
  )
}
