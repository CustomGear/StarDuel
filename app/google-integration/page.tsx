'use client'

import { useState, useEffect } from 'react'
import GoogleIntegrationModal from '@/components/GoogleIntegrationModal'

interface GoogleBusiness {
  name: string
  placeId: string
  address: string
  phoneNumber?: string
  website?: string
  rating?: number
  reviewCount?: number
}

interface GoogleReview {
  reviewId: string
  reviewer: {
    displayName: string
    profilePhotoUrl?: string
  }
  starRating: 'ONE' | 'TWO' | 'THREE' | 'FOUR' | 'FIVE'
  comment?: string
  createTime: string
  updateTime: string
  reviewReply?: {
    comment: string
    updateTime: string
  }
}

export default function GoogleIntegrationPage() {
  const [showModal, setShowModal] = useState(false)
  const [businesses, setBusinesses] = useState<GoogleBusiness[]>([])
  const [selectedBusiness, setSelectedBusiness] = useState<GoogleBusiness | null>(null)
  const [reviews, setReviews] = useState<GoogleReview[]>([])
  const [loading, setLoading] = useState(false)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return // Skip during SSR
    // Check if user is connected to Google
    const checkConnection = async () => {
      try {
        const response = await fetch('/api/google/businesses')
        const data = await response.json()
        if (data.success && data.businesses.length > 0) {
          setIsConnected(true)
          setBusinesses(data.businesses)
        }
      } catch (error) {
        console.error('Error checking Google connection:', error)
      }
    }

    checkConnection()
  }, [])

  const handleBusinessSelect = async (business: GoogleBusiness) => {
    setSelectedBusiness(business)
    setLoading(true)
    
    try {
      const response = await fetch(`/api/google/reviews?placeId=${business.placeId}`)
      const data = await response.json()
      if (data.success) {
        setReviews(data.reviews)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStarRating = (rating: string) => {
    const ratingMap = {
      'ONE': 1,
      'TWO': 2,
      'THREE': 3,
      'FOUR': 4,
      'FIVE': 5
    }
    return ratingMap[rating as keyof typeof ratingMap] || 0
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Google Integration</h1>
          <p className="mt-2 text-gray-600">
            Connect your Google My Business account to import and manage reviews
          </p>
        </div>

        {!isConnected ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">G</span>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Connect Google My Business</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Import reviews, respond to customers, and get insights from your Google My Business profile
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Connect Google Account
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Business List */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Your Businesses</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {businesses.map((business) => (
                  <div
                    key={business.placeId}
                    className={`p-6 cursor-pointer hover:bg-gray-50 ${
                      selectedBusiness?.placeId === business.placeId ? 'bg-primary-50 border-r-4 border-primary-600' : ''
                    }`}
                    onClick={() => handleBusinessSelect(business)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{business.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{business.address}</p>
                        {business.phoneNumber && (
                          <p className="text-sm text-gray-500 mt-1">{business.phoneNumber}</p>
                        )}
                        <div className="flex items-center mt-2 space-x-4">
                          {business.rating && (
                            <span className="text-sm text-gray-500">
                              ⭐ {business.rating}/5
                            </span>
                          )}
                          {business.reviewCount && (
                            <span className="text-sm text-gray-500">
                              {business.reviewCount} reviews
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  {selectedBusiness ? `${selectedBusiness.name} Reviews` : 'Select a Business'}
                </h2>
              </div>
              <div className="p-6">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading reviews...</p>
                  </div>
                ) : selectedBusiness ? (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.reviewId} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-gray-600 font-medium text-sm">
                              {review.reviewer.displayName.charAt(0)}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-medium text-gray-900">{review.reviewer.displayName}</h4>
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <span
                                    key={i}
                                    className={`text-sm ${
                                      i < getStarRating(review.starRating) ? 'text-yellow-400' : 'text-gray-300'
                                    }`}
                                  >
                                    ★
                                  </span>
                                ))}
                              </div>
                              <span className="text-sm text-gray-500">
                                {formatDate(review.createTime)}
                              </span>
                            </div>
                            {review.comment && (
                              <p className="text-gray-700 text-sm mb-2">{review.comment}</p>
                            )}
                            {review.reviewReply && (
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-xs text-gray-500 mb-1">Your Reply:</p>
                                <p className="text-sm text-gray-700">{review.reviewReply.comment}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    Select a business to view its reviews
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Google Integration Modal */}
        <GoogleIntegrationModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setIsConnected(true)
            setShowModal(false)
            // Refresh businesses
            window.location.reload()
          }}
        />
      </div>
    </div>
  )
}
