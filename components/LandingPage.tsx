'use client'

import Link from 'next/link'
import { ArrowRightIcon, ChartBarIcon, UserGroupIcon, StarIcon, RocketLaunchIcon } from '@heroicons/react/24/outline'

export default function LandingPage() {
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
            <div className="flex items-center space-x-4">
              <Link href="/auth/signin" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                Sign In
              </Link>
              <Link href="/auth/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="mb-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              <RocketLaunchIcon className="w-4 h-4 mr-1" />
              New: Review Analytics
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Professional Review Analytics Tool
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Track staff mentions, analyze sentiment, and monitor performance across Google, Yelp, Trustpilot, and other review platforms. 
            Part of the SocialUp suite of professional business tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-colors inline-flex items-center">
              🚀 START ANALYZING
            </Link>
            <Link href="#features" className="border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 font-semibold py-3 px-8 rounded-lg text-lg transition-colors">
              Learn More
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools to monitor, analyze, and improve your team's customer interactions
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <ChartBarIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Analytics Dashboard</h3>
              <p className="text-gray-600">
                Real-time insights into review trends, sentiment analysis, and staff performance metrics with detailed reporting.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <UserGroupIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Staff Tracking</h3>
              <p className="text-gray-600">
                Monitor individual staff mentions across all review platforms with detailed context and performance insights.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <StarIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Multi-Platform Integration</h3>
              <p className="text-gray-600">
                Connect Google, Yelp, Trustpilot, Facebook, and more review platforms in one unified dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start analyzing reviews today with our flexible pricing options
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold mb-4">Starter</h3>
              <div className="mb-6">
                <span className="text-3xl font-bold text-gray-900">$12.99</span>
                <span className="text-gray-600">/month</span>
              </div>
              <p className="text-gray-600 mb-6">Perfect for small businesses and startups</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Up to 1,000 reviews per month
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Google integration
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Basic analytics
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Email support
                </li>
              </ul>
              <Link href="/auth/signup" className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 px-6 rounded-lg text-center block transition-colors">
                Get Started
              </Link>
            </div>

            <div className="bg-white border-2 border-blue-600 rounded-lg p-8 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">Most Popular</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Professional</h3>
              <div className="mb-6">
                <span className="text-3xl font-bold text-gray-900">$18.99</span>
                <span className="text-gray-600">/month</span>
              </div>
              <p className="text-gray-600 mb-6">Ideal for growing businesses and agencies</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Up to 10,000 reviews per month
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  All Starter features
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Multi-platform integration
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Advanced analytics
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Priority support
                </li>
              </ul>
              <Link href="/auth/signup" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg text-center block transition-colors">
                Get Started
              </Link>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold mb-4">Enterprise</h3>
              <div className="mb-6">
                <span className="text-3xl font-bold text-gray-900">$59.99</span>
                <span className="text-gray-600">/month</span>
              </div>
              <p className="text-gray-600 mb-6">For large organizations and teams</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Unlimited reviews
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  All Professional features
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Custom integrations
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Dedicated support
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Team management
                </li>
              </ul>
              <Link href="/auth/signup" className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 px-6 rounded-lg text-center block transition-colors">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses already analyzing their reviews with SocialUp
          </p>
          <Link href="/auth/signup" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg text-lg transition-colors inline-flex items-center">
            🚀 START ANALYZING
          </Link>
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
