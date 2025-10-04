'use client'

import { useState, useEffect } from 'react'
import { MagnifyingGlassIcon, ChartBarIcon, UserGroupIcon } from '@heroicons/react/24/outline'

interface GoogleMyBusinessAccount {
  accountId: string
  accountName: string
  locations: GoogleMyBusinessLocation[]
}

interface GoogleMyBusinessLocation {
  locationId: string
  locationName: string
  address: string
  phoneNumber?: string
  website?: string
  rating?: number
  reviewCount?: number
  placeId?: string
}

interface StaffMention {
  staffName: string
  context: string
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL'
  reviewId: string
  reviewDate: string
  rating: number
}

interface AnalysisResult {
  totalReviews: number
  staffMentions: StaffMention[]
  sentimentBreakdown: {
    positive: number
    negative: number
    neutral: number
  }
  staffPerformance: {
    [staffName: string]: {
      totalMentions: number
      positiveMentions: number
      negativeMentions: number
      neutralMentions: number
      averageRating: number
    }
  }
}

export default function GoogleAnalysisPage() {
  const [accounts, setAccounts] = useState<GoogleMyBusinessAccount[]>([])
  const [selectedLocation, setSelectedLocation] = useState<GoogleMyBusinessLocation | null>(null)
  const [staffNames, setStaffNames] = useState<string[]>(['Sarah', 'Mike', 'Emily'])
  const [yearsBack, setYearsBack] = useState<number>(2)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    try {
      const response = await fetch('/api/google-my-business/accounts')
      const data = await response.json()
      if (data.success && data.accounts.length > 0) {
        setIsConnected(true)
        setAccounts(data.accounts)
        // Auto-select first location
        if (data.accounts[0]?.locations?.[0]) {
          setSelectedLocation(data.accounts[0].locations[0])
        }
      }
    } catch (error) {
      console.error('Error checking Google My Business connection:', error)
    }
  }

  const runAnalysis = async () => {
    if (!selectedLocation || staffNames.length === 0) {
      alert('Please select a location and add staff names')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/google-my-business/analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          locationId: selectedLocation.locationId,
          staffNames,
          yearsBack
        })
      })

      const data = await response.json()
      if (data.success) {
        setAnalysis(data.analysis)
      } else {
        alert('Error running analysis: ' + data.error)
      }
    } catch (error) {
      console.error('Error running analysis:', error)
      alert('Error running analysis')
    } finally {
      setLoading(false)
    }
  }

  const addStaffName = () => {
    const name = prompt('Enter staff member name:')
    if (name && !staffNames.includes(name)) {
      setStaffNames([...staffNames, name])
    }
  }

  const removeStaffName = (name: string) => {
    setStaffNames(staffNames.filter(n => n !== name))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'POSITIVE': return 'text-green-600 bg-green-100'
      case 'NEGATIVE': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">G</span>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Connect Google My Business</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            You need to connect your Google My Business account to analyze historical reviews and staff mentions.
          </p>
          <a
            href="/dashboard/integrations"
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Go to Integrations
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Google My Business Analysis</h1>
        <p className="mt-2 text-gray-600">
          Analyze historical reviews and staff mentions from your Google My Business listings
        </p>
      </div>

      {/* Configuration */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Analysis Configuration</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Location Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Location
            </label>
            <select
              value={selectedLocation?.locationId || ''}
              onChange={(e) => {
                const location = accounts
                  .flatMap(acc => acc.locations)
                  .find(loc => loc.locationId === e.target.value)
                setSelectedLocation(location || null)
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select a location...</option>
              {accounts.map(account =>
                account.locations.map(location => (
                  <option key={location.locationId} value={location.locationId}>
                    {location.locationName} - {account.accountName}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Years Back */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Analysis Period (Years Back)
            </label>
            <select
              value={yearsBack}
              onChange={(e) => setYearsBack(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value={1}>1 Year</option>
              <option value={2}>2 Years</option>
              <option value={3}>3 Years</option>
              <option value={5}>5 Years</option>
            </select>
          </div>
        </div>

        {/* Staff Names */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Staff Members to Track
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {staffNames.map(name => (
              <span
                key={name}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
              >
                {name}
                <button
                  onClick={() => removeStaffName(name)}
                  className="ml-2 text-primary-600 hover:text-primary-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <button
            onClick={addStaffName}
            className="text-primary-600 hover:text-primary-800 text-sm font-medium"
          >
            + Add Staff Member
          </button>
        </div>

        {/* Run Analysis Button */}
        <div className="mt-6">
          <button
            onClick={runAnalysis}
            disabled={loading || !selectedLocation}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Analyzing...' : 'Run Analysis'}
          </button>
        </div>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <ChartBarIcon className="h-8 w-8 text-primary-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Reviews</p>
                  <p className="text-2xl font-semibold text-gray-900">{analysis.totalReviews}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <UserGroupIcon className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Staff Mentions</p>
                  <p className="text-2xl font-semibold text-gray-900">{analysis.staffMentions.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold text-sm">+</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Positive</p>
                  <p className="text-2xl font-semibold text-gray-900">{analysis.sentimentBreakdown.positive}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 font-bold text-sm">-</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Negative</p>
                  <p className="text-2xl font-semibold text-gray-900">{analysis.sentimentBreakdown.negative}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Staff Performance */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Staff Performance</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {Object.entries(analysis.staffPerformance).map(([staffName, performance]) => (
                  <div key={staffName} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-lg font-medium text-gray-900">{staffName}</h4>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Average Rating</p>
                        <p className="text-xl font-semibold text-gray-900">
                          {performance.averageRating.toFixed(1)}/5
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-semibold text-green-600">{performance.positiveMentions}</p>
                        <p className="text-sm text-gray-500">Positive</p>
                      </div>
                      <div>
                        <p className="text-2xl font-semibold text-gray-600">{performance.neutralMentions}</p>
                        <p className="text-sm text-gray-500">Neutral</p>
                      </div>
                      <div>
                        <p className="text-2xl font-semibold text-red-600">{performance.negativeMentions}</p>
                        <p className="text-sm text-gray-500">Negative</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Staff Mentions */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Staff Mentions</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {analysis.staffMentions.map((mention, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{mention.staffName}</h4>
                        <p className="text-sm text-gray-500">{formatDate(mention.reviewDate)}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-yellow-500">⭐ {mention.rating}/5</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(mention.sentiment)}`}>
                          {mention.sentiment}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded">
                      "{mention.context}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
