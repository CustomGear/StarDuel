'use client'

import { useState } from 'react'
import { PlusIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import BusinessSearch from './BusinessSearch'

interface ReviewFiltersProps {
  sources: string[]
}

export default function ReviewFilters({ sources }: ReviewFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedBusiness, setSelectedBusiness] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleBusinessSelect = (business: any) => {
    setSelectedBusiness(business)
    toast.success(`Selected: ${business.name}`)
  }

  const handleCollectReviews = async () => {
    if (!selectedBusiness) {
      toast.error('Please select a business first')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/reviews/collect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessInfo: {
            name: selectedBusiness.name,
            googlePlaceId: selectedBusiness.place_id,
            address: selectedBusiness.formatted_address
          }
        }),
      })

      if (response.ok) {
        const data = await response.json()
        toast.success(`Collected ${data.saved} new reviews`)
        setIsOpen(false)
        setSelectedBusiness(null)
      } else {
        toast.error('Failed to collect reviews')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Review Collection
          </h3>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="btn-primary"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Business
          </button>
        </div>

        {isOpen && (
          <div className="border-t border-gray-200 pt-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search for Your Business
                </label>
                <BusinessSearch
                  onBusinessSelect={handleBusinessSelect}
                  placeholder="Type your business name or address..."
                />
                {selectedBusiness && (
                  <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 text-sm">✓</span>
                        </div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-green-800">
                          {selectedBusiness.name}
                        </p>
                        <p className="text-sm text-green-600">
                          {selectedBusiness.formatted_address}
                        </p>
                        {selectedBusiness.rating && (
                          <p className="text-xs text-green-500">
                            ⭐ {selectedBusiness.rating} ({selectedBusiness.user_ratings_total} reviews)
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleCollectReviews}
                  disabled={loading || !selectedBusiness}
                  className="btn-primary"
                >
                  {loading ? 'Collecting...' : 'Collect Reviews'}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4">
          <p className="text-sm text-gray-500">
            Connect your business profiles to automatically collect reviews from Google, Yelp, Trustpilot, and other platforms.
          </p>
        </div>
      </div>
    </div>
  )
}
