'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  HomeIcon, 
  ChartBarIcon, 
  UserGroupIcon, 
  StarIcon, 
  BellIcon, 
  CogIcon,
  DocumentTextIcon,
  PlusIcon,
  PuzzlePieceIcon
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Reviews', href: '/dashboard/reviews', icon: StarIcon },
  { name: 'Staff', href: '/dashboard/staff', icon: UserGroupIcon },
  { name: 'Analytics', href: '/dashboard/analytics', icon: ChartBarIcon },
  { name: 'Reports', href: '/dashboard/reports', icon: DocumentTextIcon },
  { name: 'Notifications', href: '/dashboard/notifications', icon: BellIcon },
  { name: 'Integrations', href: '/dashboard/integrations', icon: PuzzlePieceIcon },
  { name: 'Google Analysis', href: '/dashboard/google-analysis', icon: ChartBarIcon },
  { name: 'Settings', href: '/dashboard/settings', icon: CogIcon },
]

export default function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
      <div className="flex min-h-0 flex-1 flex-col bg-white shadow">
        <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
          <div className="flex flex-shrink-0 items-center px-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SU</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">SocialUp</h1>
            </div>
          </div>
          <nav className="mt-5 flex-1 space-y-1 px-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    isActive
                      ? 'bg-blue-100 text-blue-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                  )}
                >
                  <item.icon
                    className={cn(
                      isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500',
                      'mr-3 flex-shrink-0 h-6 w-6'
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
        <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
          <Link
            href="/dashboard/staff/new"
            className="group block w-full flex-shrink-0"
          >
            <div className="flex items-center">
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  Add Staff Member
                </p>
                <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                  Track new team member
                </p>
              </div>
              <PlusIcon className="ml-auto h-5 w-5 text-gray-400 group-hover:text-gray-500" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
