'use client'

import { useState, useEffect } from 'react'
import { XMarkIcon, MapPinIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

interface GooglePlace {
  place_id: string
  name: string
  formatted_address: string
  rating?: number
  user_ratings_total?: number
  business_status?: string
}

interface GooglePublicAccessModalProps {
  isOpen: boolean
  onClose: () => void
  onLocationSelect: (place: GooglePlace) => void
}

export default function GooglePublicAccessModal({ 
  isOpen, 
  onClose, 
  onLocationSelect 
}: GooglePublicAccessModalProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [suggestions, setSuggestions] = useState<GooglePlace[]>([])
  const [loading, setLoading] = useState(false)
  const [accessType, setAccessType] = useState<'public' | 'login'>('public')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [usingMockData, setUsingMockData] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return // Skip during SSR
    if (searchTerm.length > 2) {
      searchPlaces(searchTerm)
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [searchTerm])

  const searchPlaces = async (query: string) => {
    setLoading(true)
    try {
      const response = await fetch('/api/google/places/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query })
      })

      const data = await response.json()
      if (data.success) {
        setSuggestions(data.places || [])
        setUsingMockData(data.usingMockData || false)
      } else {
        console.error('Search error:', data.error)
        setSuggestions([])
        setUsingMockData(false)
      }
    } catch (error) {
      console.error('Error searching places:', error)
      setSuggestions([])
    } finally {
      setLoading(false)
    }
  }

  const handleLocationSelect = (place: GooglePlace) => {
    setSearchTerm(place.name)
    setShowSuggestions(false)
    onLocationSelect(place)
    onClose()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true)
    }
  }

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => setShowSuggestions(false), 200)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Integrate Google</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Access Type Selection */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex space-x-2 mb-4">
            <button
              onClick={() => setAccessType('login')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                accessType === 'login'
                  ? 'bg-gray-100 text-gray-900'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Login Access
            </button>
            <button
              onClick={() => setAccessType('public')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                accessType === 'public'
                  ? 'bg-gray-100 text-gray-900'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Public Access
            </button>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">
            Search for your Google My Business listing using the search box. To reply to reviews within the platform, please use the Login Access.
          </p>

          {accessType === 'public' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-start">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm text-yellow-800">
                  Please note that Public Access is a trial feature, so reviews will not be updated automatically.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Search Section */}
        <div className="p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter a location
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              placeholder="Search for your business..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              autoComplete="off"
            />
            {loading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
              </div>
            )}
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="mt-2 border border-gray-200 rounded-lg max-h-60 overflow-y-auto bg-white shadow-lg z-10">
              {suggestions.map((place) => (
                <button
                  key={place.place_id}
                  onClick={() => handleLocationSelect(place)}
                  className="w-full text-left px-3 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {place.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate mt-1">
                        {place.formatted_address}
                      </p>
                      {place.rating && (
                        <div className="flex items-center space-x-2 mt-2">
                          <div className="flex items-center">
                            <span className="text-yellow-400 text-sm">⭐</span>
                            <span className="text-xs text-gray-600 ml-1">
                              {place.rating}
                            </span>
                          </div>
                          {place.user_ratings_total && (
                            <span className="text-xs text-gray-500">
                              ({place.user_ratings_total} reviews)
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* No Results */}
          {searchTerm.length > 2 && suggestions.length === 0 && !loading && showSuggestions && (
            <div className="mt-2 text-center py-4 border border-gray-200 rounded-lg bg-gray-50">
              <p className="text-sm text-gray-500">No locations found</p>
              <p className="text-xs text-gray-400 mt-1">
                Try a different search term or check the spelling
              </p>
            </div>
          )}

          {/* Search Tips */}
          {searchTerm.length <= 2 && (
            <div className="mt-2 text-xs text-gray-500">
              Start typing to search for your business...
            </div>
          )}

          {/* Data Source Indicator */}
          {searchTerm.length > 2 && suggestions.length > 0 && (
            <div className="mt-2">
              {usingMockData ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                  <div className="flex items-center">
                    <ExclamationTriangleIcon className="h-4 w-4 text-yellow-600 mr-2" />
                    <p className="text-xs text-yellow-800">
                      Using demo data. Add <code className="bg-yellow-100 px-1 rounded">GOOGLE_PLACES_API_KEY</code> to .env.local for real Google search.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-2">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                    <p className="text-xs text-green-800">
                      Using real Google Places API
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 rounded-b-lg">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            {accessType === 'login' && (
              <button
                onClick={() => {
                  // Redirect to OAuth flow
                  window.location.href = '/api/auth/google'
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
              >
                Connect with Google
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
