'use client'

import { useState, useEffect, useRef } from 'react'
import { MagnifyingGlassIcon, MapPinIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface Business {
  place_id: string
  name: string
  formatted_address: string
  rating?: number
  user_ratings_total?: number
  types: string[]
  geometry: {
    location: {
      lat: number
      lng: number
    }
  }
}

interface BusinessSearchProps {
  onBusinessSelect: (business: Business) => void
  placeholder?: string
}

export default function BusinessSearch({ onBusinessSelect, placeholder = "Search for your business..." }: BusinessSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Business[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  // Debounced search
  useEffect(() => {
    if (query.length < 3) {
      setResults([])
      setShowResults(false)
      return
    }

    const timeoutId = setTimeout(() => {
      searchBusinesses(query)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query])

  const searchBusinesses = async (searchQuery: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/businesses/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery }),
      })

      if (response.ok) {
        const data = await response.json()
        setResults(data.results || [])
        setShowResults(true)
        setSelectedIndex(-1)
      } else {
        toast.error('Failed to search businesses')
      }
    } catch (error) {
      console.error('Search error:', error)
      // For demo purposes, show mock results
      setResults(getMockResults(searchQuery))
      setShowResults(true)
      setSelectedIndex(-1)
    } finally {
      setIsLoading(false)
    }
  }

  const getMockResults = (searchQuery: string): Business[] => {
    const mockBusinesses = [
      {
        place_id: 'demo-1',
        name: 'Demo Restaurant',
        formatted_address: '123 Main St, New York, NY 10001',
        rating: 4.5,
        user_ratings_total: 150,
        types: ['restaurant', 'food', 'establishment'],
        geometry: {
          location: { lat: 40.7128, lng: -74.0060 }
        }
      },
      {
        place_id: 'demo-2',
        name: 'Sample Cafe',
        formatted_address: '456 Oak Ave, Los Angeles, CA 90210',
        rating: 4.2,
        user_ratings_total: 89,
        types: ['cafe', 'food', 'establishment'],
        geometry: {
          location: { lat: 34.0522, lng: -118.2437 }
        }
      },
      {
        place_id: 'demo-3',
        name: 'Local Bistro',
        formatted_address: '789 Pine St, Chicago, IL 60601',
        rating: 4.7,
        user_ratings_total: 203,
        types: ['restaurant', 'food', 'establishment'],
        geometry: {
          location: { lat: 41.8781, lng: -87.6298 }
        }
      }
    ]

    return mockBusinesses.filter(business =>
      business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.formatted_address.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  const handleBusinessSelect = (business: Business) => {
    setQuery(business.name)
    setShowResults(false)
    onBusinessSelect(business)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults || results.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleBusinessSelect(results[selectedIndex])
        }
        break
      case 'Escape':
        setShowResults(false)
        setSelectedIndex(-1)
        break
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    if (e.target.value.length >= 3) {
      setShowResults(true)
    }
  }

  const handleInputFocus = () => {
    if (results.length > 0) {
      setShowResults(true)
    }
  }

  const handleInputBlur = () => {
    // Delay hiding results to allow for clicks
    setTimeout(() => {
      setShowResults(false)
      setSelectedIndex(-1)
    }, 200)
  }

  return (
    <div className="relative w-full">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
        {isLoading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
          </div>
        )}
      </div>

      {showResults && results.length > 0 && (
        <div
          ref={resultsRef}
          className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
        >
          {results.map((business, index) => (
            <div
              key={business.place_id}
              className={`cursor-pointer select-none relative py-2 pl-3 pr-9 ${
                index === selectedIndex
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-900 hover:bg-gray-100'
              }`}
              onClick={() => handleBusinessSelect(business)}
            >
              <div className="flex items-center">
                <MapPinIcon className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{business.name}</div>
                  <div className={`text-sm truncate ${
                    index === selectedIndex ? 'text-primary-100' : 'text-gray-500'
                  }`}>
                    {business.formatted_address}
                  </div>
                  {business.rating && (
                    <div className={`text-xs ${
                      index === selectedIndex ? 'text-primary-200' : 'text-gray-400'
                    }`}>
                      ⭐ {business.rating} ({business.user_ratings_total} reviews)
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showResults && results.length === 0 && query.length >= 3 && !isLoading && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-2 px-3 text-sm text-gray-500">
          No businesses found for "{query}"
        </div>
      )}
    </div>
  )
}
