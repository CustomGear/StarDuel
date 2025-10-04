'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowRightIcon, ChartBarIcon, UserGroupIcon, StarIcon, RocketLaunchIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SU</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">SocialUp</h1>
              </div>
              <div className="hidden md:flex items-center space-x-6 ml-8">
                <Link href="https://app.socialup.ca/" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                  Contact Extraction
                </Link>
                <Link href="/" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Review Analytics
                </Link>
                <Link href="#features" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                  Features
                </Link>
                <Link href="#pricing" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                  Pricing
                </Link>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/auth/signin" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                Sign In
              </Link>
              <Link href="/auth/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Get Started
              </Link>
            </div>
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-600 hover:text-gray-900 p-2"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
          
          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <div className="flex flex-col space-y-4">
                <Link 
                  href="https://app.socialup.ca/" 
                  className="text-gray-600 hover:text-gray-900 text-sm font-medium px-4 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact Extraction
                </Link>
                <Link 
                  href="/" 
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium px-4 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Review Analytics
                </Link>
                <Link 
                  href="#features" 
                  className="text-gray-600 hover:text-gray-900 text-sm font-medium px-4 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Features
                </Link>
                <Link 
                  href="#pricing" 
                  className="text-gray-600 hover:text-gray-900 text-sm font-medium px-4 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Pricing
                </Link>
                <div className="border-t border-gray-200 pt-4 px-4">
                  <Link 
                    href="/auth/signin" 
                    className="block text-gray-600 hover:text-gray-900 text-sm font-medium mb-3"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link 
                    href="/auth/signup" 
                    className="block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium text-center transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center">
          <div className="mb-6">
            <span className="inline-flex items-center px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <RocketLaunchIcon className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Track Staff Mentions in Reviews</span>
              <span className="sm:hidden">Staff Mentions</span>
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight px-4">
            Turn Reviews Into
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block sm:inline"> Staff Insights</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 md:mb-8 max-w-4xl mx-auto leading-relaxed px-4">
            Monitor when your staff are mentioned in customer reviews across Google, Yelp, and other platforms. 
            Get instant notifications, analyze sentiment, and improve team performance with actionable insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mb-8 md:mb-12 px-4">
            <Link href="/auth/signup" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 md:py-4 px-6 md:px-10 rounded-xl text-base md:text-lg transition-all transform hover:scale-105 shadow-lg">
              Start Tracking Mentions
            </Link>
            <Link href="#demo" className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 font-semibold py-3 md:py-4 px-6 md:px-10 rounded-xl text-base md:text-lg transition-colors">
              Watch Demo
            </Link>
          </div>
          
          {/* Social Proof */}
          <div className="flex flex-col items-center space-y-4 px-4">
            <p className="text-xs md:text-sm text-gray-500">Trusted by businesses worldwide</p>
            <div className="flex items-center space-x-4 md:space-x-8 opacity-60 flex-wrap justify-center">
              <div className="text-lg md:text-2xl font-bold text-gray-400">Google</div>
              <div className="text-lg md:text-2xl font-bold text-gray-400">Yelp</div>
              <div className="text-lg md:text-2xl font-bold text-gray-400">Trustpilot</div>
              <div className="text-lg md:text-2xl font-bold text-gray-400">Facebook</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Track Staff Mentions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get instant notifications when your team members are mentioned in reviews, analyze sentiment, and turn feedback into actionable insights.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <UserGroupIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Staff Mention Detection</h3>
              <p className="text-gray-600 leading-relaxed">
                Automatically detect when your staff members are mentioned in customer reviews across all platforms. Get instant notifications with context.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8 border border-green-100">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <ChartBarIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Sentiment Analysis</h3>
              <p className="text-gray-600 leading-relaxed">
                Understand the sentiment behind each mention - positive, negative, or neutral. Track trends and identify areas for improvement.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-100">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6">
                <StarIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Multi-Platform Monitoring</h3>
              <p className="text-gray-600 leading-relaxed">
                Monitor mentions across Google, Yelp, Trustpilot, Facebook, and more. One dashboard for all your review platforms.
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 border border-orange-100">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mb-6">
                <RocketLaunchIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Real-Time Alerts</h3>
              <p className="text-gray-600 leading-relaxed">
                Get instant notifications via email, Slack, or SMS when your staff are mentioned. Never miss important feedback.
              </p>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-8 border border-teal-100">
              <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6">
                <ChartBarIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Performance Analytics</h3>
              <p className="text-gray-600 leading-relaxed">
                Track individual and team performance metrics. See which staff members are getting the most positive mentions.
              </p>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <UserGroupIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Team Management</h3>
              <p className="text-gray-600 leading-relaxed">
                Manage your team, assign roles, and track performance across departments. Perfect for restaurants, hotels, and service businesses.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Section */}
      <div id="demo" className="bg-gradient-to-br from-gray-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              See It In Action
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Watch how easy it is to track staff mentions and get instant insights from your customer reviews
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl mx-auto">
            <div className="bg-gray-900 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="text-white text-sm font-mono">
                <div className="mb-2">📧 New mention detected!</div>
                <div className="mb-2">👤 Staff: Sarah Johnson</div>
                <div className="mb-2">⭐ Review: "Sarah was amazing! Great service!"</div>
                <div className="mb-2">😊 Sentiment: Positive</div>
                <div className="text-green-400">✅ Alert sent to team</div>
              </div>
            </div>
            
            <div className="text-center">
              <Link href="/auth/signup" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-10 rounded-xl text-lg transition-all transform hover:scale-105 shadow-lg">
                Try Demo Account
              </Link>
              <p className="text-sm text-gray-500 mt-4">Email: demo@starduel.ca | Password: demo123</p>
              <p className="text-xs text-gray-400 mt-2">Updated homepage design - now live! v2.0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Start tracking staff mentions today. No hidden fees, no long-term contracts.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-blue-300 transition-colors">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Starter</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">$29</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-gray-600">Perfect for small businesses</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-700">
                  <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  </span>
                  Up to 1,000 mentions/month
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  </span>
                  Google & Yelp integration
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  </span>
                  Basic sentiment analysis
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  </span>
                  Email notifications
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  </span>
                  Up to 10 staff members
                </li>
              </ul>
              <Link href="/auth/signup" className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold py-4 px-6 rounded-xl text-center block transition-colors">
                Start Free Trial
              </Link>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-500 rounded-2xl p-8 relative transform scale-105 shadow-xl">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold">Most Popular</span>
              </div>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Professional</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">$79</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-gray-600">Ideal for growing businesses</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-700">
                  <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  </span>
                  Up to 10,000 mentions/month
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  </span>
                  All platform integrations
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  </span>
                  Advanced analytics & reports
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  </span>
                  Slack & SMS notifications
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  </span>
                  Up to 50 staff members
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  </span>
                  Priority support
                </li>
              </ul>
              <Link href="/auth/signup" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl text-center block transition-all transform hover:scale-105 shadow-lg">
                Start Free Trial
              </Link>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-purple-300 transition-colors">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">$199</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-gray-600">For large organizations</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-700">
                  <span className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                  </span>
                  Unlimited mentions
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                  </span>
                  Custom integrations
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                  </span>
                  White-label options
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                  </span>
                  API access
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                  </span>
                  Unlimited staff members
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                  </span>
                  Dedicated account manager
                </li>
              </ul>
              <Link href="/auth/signup" className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold py-4 px-6 rounded-xl text-center block transition-colors">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Track Staff Mentions?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Join thousands of businesses already monitoring their team's performance through customer reviews. 
            Start your free trial today and see the difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup" className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-4 px-10 rounded-xl text-lg transition-all transform hover:scale-105 shadow-lg">
              Start Free Trial
            </Link>
            <Link href="#demo" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-bold py-4 px-10 rounded-xl text-lg transition-colors">
              Watch Demo
            </Link>
          </div>
          <p className="text-blue-200 text-sm mt-6">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SU</span>
                </div>
                <h3 className="text-xl font-bold">SocialUp</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Professional business tools for modern companies.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="https://app.socialup.ca/" className="hover:text-white">Contact Extraction</Link></li>
                <li><Link href="/" className="hover:text-white">Review Analytics</Link></li>
                <li><Link href="#features" className="hover:text-white">Features</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-white">Contact</Link></li>
                <li><Link href="#" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <p className="text-gray-400 text-sm">
                Ready to get started? Have questions about our review analytics technology? We'd love to hear from you!
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-500 text-sm">
              © 2024 SocialUp. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

