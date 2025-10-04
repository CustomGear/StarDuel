'use client'

import { useState } from 'react'
import { 
  BuildingOfficeIcon, 
  UserGroupIcon, 
  CogIcon,
  KeyIcon
} from '@heroicons/react/24/outline'

interface SettingsPanelProps {
  children: React.ReactNode
}

export default function SettingsPanel({ children }: SettingsPanelProps) {
  const [activeTab, setActiveTab] = useState('company')

  const tabs = [
    { id: 'company', name: 'Company', icon: BuildingOfficeIcon },
    { id: 'users', name: 'Users', icon: UserGroupIcon },
    { id: 'api', name: 'API Keys', icon: KeyIcon },
    { id: 'general', name: 'General', icon: CogIcon },
  ]

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.name}</span>
              </button>
            )
          })}
        </nav>
      </div>
      
      <div className="p-6">
        {children}
      </div>
    </div>
  )
}
