'use client'

import { useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface GoogleIntegrationModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function GoogleIntegrationModal({ isOpen, onClose, onSuccess }: GoogleIntegrationModalProps) {
  const [accessType, setAccessType] = useState<'login' | 'public'>('login')
  const [isConnecting, setIsConnecting] = useState(false)

  const handleGoogleLogin = async () => {
    setIsConnecting(true)
    try {
      // Redirect to Google OAuth
      window.location.href = '/api/auth/google'
    } catch (error) {
      console.error('Error connecting to Google:', error)
      setIsConnecting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              {/* Google Logo */}
              <div className="w-8 h-8 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Integrate Google</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Access Type Selection */}
            <div className="mb-6">
              <div className="flex space-x-2 mb-4">
                <button
                  onClick={() => setAccessType('login')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    accessType === 'login'
                      ? 'bg-gray-100 text-gray-900 border border-gray-300'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Login Access
                </button>
                <button
                  onClick={() => setAccessType('public')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    accessType === 'public'
                      ? 'bg-gray-100 text-gray-900 border border-gray-300'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Public Access
                </button>
              </div>
            </div>

            {/* Explanation */}
            <div className="mb-6">
              <p className="text-gray-600 text-sm leading-relaxed">
                {accessType === 'login' ? (
                  <>
                    To import reviews and respond to them directly from the platform, we need to connect your Google My Business Page. 
                    Please log in with the account that manages the business profile and grant the necessary permissions by checking all the boxes.
                  </>
                ) : (
                  <>
                    Public access allows you to view and analyze reviews from any Google My Business listing without requiring login access. 
                    This is useful for monitoring competitors or public businesses.
                  </>
                )}
              </p>
            </div>

            {/* Benefits */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">What you'll get:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Import reviews from your Google My Business</li>
                <li>• Respond to reviews directly from the platform</li>
                <li>• Real-time review notifications</li>
                <li>• Advanced analytics and insights</li>
                <li>• Staff mention tracking</li>
              </ul>
            </div>

            {/* Action Button */}
            <div className="flex flex-col space-y-3">
              <button
                onClick={handleGoogleLogin}
                disabled={isConnecting}
                className="w-full flex items-center justify-center space-x-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="w-5 h-5 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">G</span>
                </div>
                <span className="text-gray-900 font-medium">
                  {isConnecting ? 'Connecting...' : 'Log in with Google'}
                </span>
              </button>
              
              <p className="text-xs text-gray-500 text-center">
                By connecting, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
