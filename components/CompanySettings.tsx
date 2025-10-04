'use client'

import { useState } from 'react'
import { BuildingOfficeIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface Company {
  id: string
  name: string
  description?: string | null
  website?: string | null
  industry?: string | null
}

interface CompanySettingsProps {
  company: Company
}

export default function CompanySettings({ company }: CompanySettingsProps) {
  const [formData, setFormData] = useState({
    name: company.name,
    description: company.description || '',
    website: company.website || '',
    industry: company.industry || ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/company', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success('Company settings updated successfully')
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to update company settings')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <BuildingOfficeIcon className="h-6 w-6 text-primary-600" />
        <h2 className="text-lg font-medium text-gray-900">Company Information</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Company Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
              Industry
            </label>
            <select
              id="industry"
              name="industry"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              value={formData.industry}
              onChange={handleChange}
            >
              <option value="">Select Industry</option>
              <option value="Restaurant">Restaurant</option>
              <option value="Retail">Retail</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Professional Services">Professional Services</option>
              <option value="Technology">Technology</option>
              <option value="Education">Education</option>
              <option value="Real Estate">Real Estate</option>
              <option value="Automotive">Automotive</option>
              <option value="Beauty & Wellness">Beauty & Wellness</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700">
              Website
            </label>
            <input
              type="url"
              id="website"
              name="website"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="https://example.com"
              value={formData.website}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="Brief description of your business"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
