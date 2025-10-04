'use client'

import { useState, useEffect } from 'react'

interface Company {
  id: string
  name: string
  description: string
  address: string
  googlePlaceId: string
  website: string
  industry: string
  stats: {
    totalReviews: number
    totalStaff: number
    averageRating: number
  }
  recentReviews: Array<{
    id: string
    title: string
    content: string
    rating: number
    source: string
    authorName: string
    sentiment: string
    createdAt: string
    mentions: Array<{
      id: string
      staffName: string
      context: string
      sentiment: string
    }>
  }>
}

export default function TestLocationsPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [googleReviewsData, setGoogleReviewsData] = useState<any>(null)
  const [testingGoogle, setTestingGoogle] = useState(false)

  useEffect(() => {
    fetchCompanies()
  }, [])

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/companies')
      const data = await response.json()
      if (data.success) {
        setCompanies(data.companies)
      }
    } catch (error) {
      console.error('Error fetching companies:', error)
    } finally {
      setLoading(false)
    }
  }

  const testGoogleReviews = async (company: Company) => {
    setTestingGoogle(true)
    try {
      const response = await fetch(`/api/test-google-reviews?placeId=${company.googlePlaceId}`)
      const data = await response.json()
      setGoogleReviewsData(data)
    } catch (error) {
      console.error('Error testing Google Reviews:', error)
    } finally {
      setTestingGoogle(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading companies...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Test Locations</h1>
          <p className="mt-2 text-gray-600">
            Test Google Reviews integration with different locations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Companies List */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Available Locations</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {companies.map((company) => (
                <div
                  key={company.id}
                  className={`p-6 cursor-pointer hover:bg-gray-50 ${
                    selectedCompany?.id === company.id ? 'bg-primary-50 border-r-4 border-primary-600' : ''
                  }`}
                  onClick={() => setSelectedCompany(company)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">{company.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{company.description}</p>
                      <p className="text-sm text-gray-500 mt-1">{company.address}</p>
                      <div className="flex items-center mt-2 space-x-4">
                        <span className="text-sm text-gray-500">
                          {company.stats.totalReviews} reviews
                        </span>
                        <span className="text-sm text-gray-500">
                          {company.stats.totalStaff} staff
                        </span>
                        <span className="text-sm text-gray-500">
                          ⭐ {company.stats.averageRating}/5
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        testGoogleReviews(company)
                      }}
                      disabled={testingGoogle}
                      className="ml-4 px-3 py-1 text-sm bg-primary-600 text-white rounded hover:bg-primary-700 disabled:opacity-50"
                    >
                      {testingGoogle ? 'Testing...' : 'Test Google'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Company Details */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedCompany ? selectedCompany.name : 'Select a Location'}
              </h2>
            </div>
            <div className="p-6">
              {selectedCompany ? (
                <div className="space-y-6">
                  {/* Company Info */}
                  <div>
                    <h3 className="text-md font-medium text-gray-900 mb-2">Company Information</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p><strong>Name:</strong> {selectedCompany.name}</p>
                      <p><strong>Address:</strong> {selectedCompany.address}</p>
                      <p><strong>Website:</strong> 
                        <a href={selectedCompany.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline ml-1">
                          {selectedCompany.website}
                        </a>
                      </p>
                      <p><strong>Google Place ID:</strong> 
                        <code className="bg-gray-200 px-2 py-1 rounded text-sm ml-1">
                          {selectedCompany.googlePlaceId}
                        </code>
                      </p>
                    </div>
                  </div>

                  {/* Recent Reviews */}
                  <div>
                    <h3 className="text-md font-medium text-gray-900 mb-2">Recent Reviews</h3>
                    <div className="space-y-3">
                      {selectedCompany.recentReviews.map((review) => (
                        <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-medium text-gray-900">{review.title}</h4>
                              <p className="text-sm text-gray-600">by {review.authorName}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-yellow-500">⭐ {review.rating}/5</span>
                              <span className={`px-2 py-1 rounded text-xs ${
                                review.sentiment === 'POSITIVE' ? 'bg-green-100 text-green-800' :
                                review.sentiment === 'NEGATIVE' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {review.sentiment}
                              </span>
                            </div>
                          </div>
                          <p className="text-gray-700 text-sm mb-2">{review.content}</p>
                          {review.mentions.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs text-gray-500 mb-1">Staff Mentions:</p>
                              {review.mentions.map((mention) => (
                                <div key={mention.id} className="bg-blue-50 p-2 rounded text-xs">
                                  <strong>{mention.staffName}:</strong> {mention.context}
                                  <span className={`ml-2 px-1 py-0.5 rounded ${
                                    mention.sentiment === 'POSITIVE' ? 'bg-green-200 text-green-800' :
                                    mention.sentiment === 'NEGATIVE' ? 'bg-red-200 text-red-800' :
                                    'bg-gray-200 text-gray-800'
                                  }`}>
                                    {mention.sentiment}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Select a location from the list to view details
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Google Reviews Test Results */}
        {googleReviewsData && (
          <div className="mt-8 bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Google Reviews Test Results</h2>
            </div>
            <div className="p-6">
              <div className={`p-4 rounded-lg ${
                googleReviewsData.success ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
              }`}>
                <p className={`font-medium ${
                  googleReviewsData.success ? 'text-green-800' : 'text-yellow-800'
                }`}>
                  {googleReviewsData.message}
                </p>
                
                {googleReviewsData.data && (
                  <div className="mt-4">
                    <h3 className="font-medium text-gray-900 mb-2">Real Google Reviews Data:</h3>
                    <div className="bg-white p-4 rounded border">
                      <p><strong>Place:</strong> {googleReviewsData.data.placeName}</p>
                      <p><strong>Address:</strong> {googleReviewsData.data.address}</p>
                      <p><strong>Rating:</strong> {googleReviewsData.data.rating}/5 ({googleReviewsData.data.totalReviews} reviews)</p>
                      <div className="mt-3">
                        <h4 className="font-medium mb-2">Reviews:</h4>
                        {googleReviewsData.data.reviews.map((review: any, index: number) => (
                          <div key={index} className="border-l-4 border-primary-200 pl-3 mb-2">
                            <p className="text-sm"><strong>{review.authorName}</strong> - ⭐ {review.rating}/5</p>
                            <p className="text-sm text-gray-600">{review.text}</p>
                            <p className="text-xs text-gray-500">{review.time}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {googleReviewsData.mockData && (
                  <div className="mt-4">
                    <h3 className="font-medium text-gray-900 mb-2">Mock Data (No API Key):</h3>
                    <div className="bg-white p-4 rounded border">
                      <p><strong>Place:</strong> {googleReviewsData.mockData.placeName}</p>
                      <p><strong>Address:</strong> {googleReviewsData.mockData.address}</p>
                      <div className="mt-3">
                        <h4 className="font-medium mb-2">Sample Reviews:</h4>
                        {googleReviewsData.mockData.reviews.map((review: any, index: number) => (
                          <div key={index} className="border-l-4 border-gray-200 pl-3 mb-2">
                            <p className="text-sm"><strong>{review.authorName}</strong> - ⭐ {review.rating}/5</p>
                            <p className="text-sm text-gray-600">{review.text}</p>
                            <p className="text-xs text-gray-500">{review.time}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
