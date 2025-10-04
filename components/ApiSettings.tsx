'use client'

import { useState } from 'react'
import { KeyIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function ApiSettings() {
  const [apiKeys, setApiKeys] = useState({
    googlePlaces: '',
    yelp: '',
    trustpilot: ''
  })
  const [showKeys, setShowKeys] = useState({
    googlePlaces: false,
    yelp: false,
    trustpilot: false
  })
  const [loading, setLoading] = useState(false)

  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKeys({
      ...apiKeys,
      [e.target.name]: e.target.value,
    })
  }

  const toggleKeyVisibility = (key: string) => {
    setShowKeys({
      ...showKeys,
      [key]: !(showKeys as any)[key]
    })
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/settings/api-keys', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiKeys),
      })

      if (response.ok) {
        toast.success('API keys updated successfully')
      } else {
        toast.error('Failed to update API keys')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const testConnection = async (service: string) => {
    try {
      const response = await fetch(`/api/settings/test-connection?service=${service}`, {
        method: 'POST'
      })

      if (response.ok) {
        toast.success(`${service} connection successful`)
      } else {
        toast.error(`${service} connection failed`)
      }
    } catch (error) {
      toast.error('Connection test failed')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <KeyIcon className="h-6 w-6 text-primary-600" />
        <h2 className="text-lg font-medium text-gray-900">API Keys</h2>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <KeyIcon className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              API Key Security
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                Keep your API keys secure and never share them publicly. 
                These keys are used to collect reviews from external platforms.
              </p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="googlePlaces" className="block text-sm font-medium text-gray-700">
              Google Places API Key
            </label>
            <div className="mt-1 relative">
              <input
                type={showKeys.googlePlaces ? 'text' : 'password'}
                id="googlePlaces"
                name="googlePlaces"
                className="block w-full pr-10 border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Enter your Google Places API key"
                value={apiKeys.googlePlaces}
                onChange={handleKeyChange}
              />
              <button
                type="button"
                onClick={() => toggleKeyVisibility('googlePlaces')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showKeys.googlePlaces ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Used to collect reviews from Google My Business
            </p>
          </div>

          <div>
            <label htmlFor="yelp" className="block text-sm font-medium text-gray-700">
              Yelp API Key
            </label>
            <div className="mt-1 relative">
              <input
                type={showKeys.yelp ? 'text' : 'password'}
                id="yelp"
                name="yelp"
                className="block w-full pr-10 border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Enter your Yelp API key"
                value={apiKeys.yelp}
                onChange={handleKeyChange}
              />
              <button
                type="button"
                onClick={() => toggleKeyVisibility('yelp')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showKeys.yelp ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Used to collect reviews from Yelp
            </p>
          </div>

          <div>
            <label htmlFor="trustpilot" className="block text-sm font-medium text-gray-700">
              Trustpilot API Key
            </label>
            <div className="mt-1 relative">
              <input
                type={showKeys.trustpilot ? 'text' : 'password'}
                id="trustpilot"
                name="trustpilot"
                className="block w-full pr-10 border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Enter your Trustpilot API key"
                value={apiKeys.trustpilot}
                onChange={handleKeyChange}
              />
              <button
                type="button"
                onClick={() => toggleKeyVisibility('trustpilot')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showKeys.trustpilot ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Used to collect reviews from Trustpilot
            </p>
          </div>
        </div>

        <div className="flex justify-between">
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => testConnection('google')}
              className="btn-secondary"
            >
              Test Google
            </button>
            <button
              type="button"
              onClick={() => testConnection('yelp')}
              className="btn-secondary"
            >
              Test Yelp
            </button>
            <button
              type="button"
              onClick={() => testConnection('trustpilot')}
              className="btn-secondary"
            >
              Test Trustpilot
            </button>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Saving...' : 'Save API Keys'}
          </button>
        </div>
      </form>
    </div>
  )
}
