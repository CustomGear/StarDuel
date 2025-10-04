'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import GooglePublicAccessModal from '@/components/GooglePublicAccessModal'

interface Integration {
  id: string
  name: string
  logo: string
  description: string
  connected: boolean
  type: 'oauth' | 'link' | 'api'
  color: string
}

const integrations: Integration[] = [
  {
    id: 'google',
    name: 'Google',
    logo: 'G',
    description: 'Connect your Google My Business account to import reviews and respond to customers',
    connected: false,
    type: 'oauth',
    color: 'from-red-500 via-yellow-500 via-green-500 to-blue-500'
  },
  {
    id: 'facebook',
    name: 'Facebook',
    logo: 'f',
    description: 'Import reviews from your Facebook business page',
    connected: false,
    type: 'oauth',
    color: 'from-blue-600 to-blue-700'
  },
  {
    id: 'tripadvisor',
    name: 'TripAdvisor',
    logo: '🦉',
    description: 'Connect your TripAdvisor business listing to import reviews',
    connected: false,
    type: 'link',
    color: 'from-teal-500 to-teal-600'
  },
  {
    id: 'trustpilot',
    name: 'Trustpilot',
    logo: '★',
    description: 'Import reviews from your Trustpilot business profile',
    connected: false,
    type: 'link',
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'yelp',
    name: 'Yelp',
    logo: 'Y',
    description: 'Connect your Yelp business page to import reviews',
    connected: false,
    type: 'oauth',
    color: 'from-red-600 to-red-700'
  },
  {
    id: 'glassdoor',
    name: 'Glassdoor',
    logo: 'G',
    description: 'Import employee reviews from your Glassdoor company page',
    connected: false,
    type: 'link',
    color: 'from-green-600 to-green-700'
  },
  {
    id: 'indeed',
    name: 'Indeed',
    logo: 'I',
    description: 'Connect your Indeed company page for employee reviews',
    connected: false,
    type: 'link',
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'opentable',
    name: 'OpenTable',
    logo: 'O',
    description: 'Import restaurant reviews from your OpenTable listing',
    connected: false,
    type: 'api',
    color: 'from-orange-500 to-orange-600'
  },
  {
    id: 'zomato',
    name: 'Zomato',
    logo: 'Z',
    description: 'Connect your Zomato restaurant page to import reviews',
    connected: false,
    type: 'link',
    color: 'from-red-500 to-red-600'
  },
  {
    id: 'foursquare',
    name: 'Foursquare',
    logo: '4',
    description: 'Import location-based reviews from Foursquare',
    connected: false,
    type: 'api',
    color: 'from-purple-500 to-purple-600'
  }
]

export default function IntegrationsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [connectedIntegrations, setConnectedIntegrations] = useState<Set<string>>(new Set())
  const [showPublicAccessModal, setShowPublicAccessModal] = useState(false)
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null)
  const [showSetupInstructions, setShowSetupInstructions] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check for OAuth errors or success
    const error = searchParams.get('error')
    const success = searchParams.get('google_connected')

    if (error === 'google_not_configured') {
      setShowSetupInstructions(true)
    } else if (error) {
      alert(`Integration error: ${error}`)
    } else if (success) {
      setConnectedIntegrations(prev => new Set(Array.from(prev).concat(['google'])))
      alert('Google account connected successfully!')
    }

    // Check which integrations are already connected
    checkConnectedIntegrations()
  }, [searchParams])

  const checkConnectedIntegrations = async () => {
    try {
      // Check Google integration
      const response = await fetch('/api/google-my-business/accounts')
      const data = await response.json()
      if (data.success && data.accounts.length > 0) {
        setConnectedIntegrations(prev => new Set(Array.from(prev).concat(['google'])))
      }
    } catch (error) {
      console.error('Error checking connected integrations:', error)
    }
  }

  const filteredIntegrations = integrations.filter(integration =>
    integration.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleIntegrationClick = (integration: Integration) => {
    setSelectedIntegration(integration)
    
    switch (integration.type) {
      case 'oauth':
        if (integration.id === 'google') {
          setShowPublicAccessModal(true)
        } else {
          // Handle other OAuth integrations
          alert(`${integration.name} OAuth integration coming soon!`)
        }
        break
      case 'link':
        // Handle link-based integrations
        const link = prompt(`Enter your ${integration.name} business page URL:`)
        if (link) {
          alert(`Connecting to ${integration.name} with URL: ${link}`)
          // Here you would implement the actual integration
        }
        break
      case 'api':
        // Handle API-based integrations
        alert(`${integration.name} API integration coming soon!`)
        break
    }
  }

  const handleLocationSelect = async (place: any) => {
    try {
      // Import reviews from the selected location
      console.log('Selected place:', place)
      
      const response = await fetch('/api/google/places/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          placeId: place.place_id,
          placeName: place.name,
          placeAddress: place.formatted_address
        })
      })
      
      const data = await response.json()
      if (data.success) {
        setConnectedIntegrations(prev => new Set(Array.from(prev).concat(['google'])))
        setShowPublicAccessModal(false)
        alert(`✅ ${data.message}\n\nCompany: ${data.company.name}\nReviews imported: ${data.reviews.imported}/${data.reviews.total}`)
      } else {
        alert(`❌ Failed to import reviews: ${data.error}`)
      }
    } catch (error) {
      console.error('Error importing reviews:', error)
      alert('❌ Failed to import reviews')
    }
  }

  const getIntegrationStatus = (integration: Integration) => {
    if (connectedIntegrations.has(integration.id)) {
      return { text: 'Connected', color: 'text-green-600 bg-green-100' }
    }
    return { text: 'Integrate', color: 'text-gray-600 bg-gray-100' }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Platform Integrations</h1>
        <p className="mt-2 text-gray-600 max-w-3xl">
          Connect your business profiles across multiple review platforms to track staff mentions and analyze customer feedback. 
          Import reviews from Google, Facebook, Yelp, and other platforms to get comprehensive insights into your team's performance.
        </p>
        
        {/* Google Places API Notice */}
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">i</span>
              </div>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Real Google Search Available</h3>
              <p className="mt-1 text-sm text-blue-700">
                To search real Google businesses instead of demo data, add your Google Places API key to <code className="bg-blue-100 px-1 rounded">.env.local</code>.
                <a href="/GOOGLE_PLACES_SETUP.md" target="_blank" className="ml-1 underline">View setup guide</a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Google Setup Instructions */}
      {showSetupInstructions && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">G</span>
              </div>
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-lg font-medium text-yellow-800">Google OAuth Setup Required</h3>
              <p className="mt-2 text-yellow-700">
                To connect Google My Business, you need to set up OAuth credentials first.
              </p>
              <div className="mt-4">
                <h4 className="text-sm font-medium text-yellow-800">Quick Setup:</h4>
                <ol className="mt-2 text-sm text-yellow-700 list-decimal list-inside space-y-1">
                  <li>Go to <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="underline">Google Cloud Console</a></li>
                  <li>Create a new project or select existing one</li>
                  <li>Enable the <strong>Places API</strong> and <strong>Google My Business API</strong></li>
                  <li>Go to <strong>Credentials</strong> → <strong>Create Credentials</strong> → <strong>OAuth 2.0 Client ID</strong></li>
                  <li>Add authorized redirect URI: <code className="bg-yellow-100 px-1 rounded">http://localhost:3000/api/auth/google/callback</code></li>
                  <li>Update your <code className="bg-yellow-100 px-1 rounded">.env.local</code> file with the credentials</li>
                </ol>
              </div>
              <div className="mt-4 flex space-x-3">
                <button
                  onClick={() => setShowSetupInstructions(false)}
                  className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-yellow-700"
                >
                  Got it, I'll set it up
                </button>
                <a
                  href="/dashboard/google-analysis"
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700"
                >
                  Try Demo Mode
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Status */}
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search integrations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="text-sm text-gray-600">
          Platforms Integrated: <span className="font-semibold">{connectedIntegrations.size}/10</span>
        </div>
      </div>

      {/* Integration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredIntegrations.map((integration) => {
          const status = getIntegrationStatus(integration)
          const isConnected = connectedIntegrations.has(integration.id)
          
          return (
            <div
              key={integration.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleIntegrationClick(integration)}
            >
              {/* Logo */}
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4">
                <div className={`w-16 h-16 bg-gradient-to-r ${integration.color} rounded-full flex items-center justify-center text-white text-2xl font-bold`}>
                  {integration.logo}
                </div>
              </div>

              {/* Name */}
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                {integration.name}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-600 text-center mb-4 line-clamp-3">
                {integration.description}
              </p>

              {/* Status Badge */}
              <div className="flex items-center justify-center mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                  {status.text}
                </span>
              </div>

              {/* Action Button */}
              <button
                className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  isConnected
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isConnected ? 'Manage' : 'Integrate'}
              </button>

              {/* Connection Type Indicator */}
              <div className="mt-3 text-center">
                <span className="text-xs text-gray-500">
                  {integration.type === 'oauth' && '🔐 Login Required'}
                  {integration.type === 'link' && '🔗 Page Link'}
                  {integration.type === 'api' && '⚡ API Key'}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredIntegrations.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MagnifyingGlassIcon className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No integrations found</h3>
          <p className="text-gray-600">Try adjusting your search terms</p>
        </div>
      )}

      {/* Google Public Access Modal */}
      <GooglePublicAccessModal
        isOpen={showPublicAccessModal}
        onClose={() => setShowPublicAccessModal(false)}
        onLocationSelect={handleLocationSelect}
      />
    </div>
  )
}
