'use client'

import { useState } from 'react'
import { PlusIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function AddStaffForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    position: '',
    department: ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast.error('Name is required')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/staff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success('Staff member added successfully')
        setIsOpen(false)
        setFormData({ name: '', email: '', position: '', department: '' })
        // TODO: Refresh staff list
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to add staff member')
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
            Add Staff Member
          </h3>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="btn-primary"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            {isOpen ? 'Cancel' : 'Add Staff'}
          </button>
        </div>

        {isOpen && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="john@company.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                  Position
                </label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Manager, Server, etc."
                  value={formData.position}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                  Department
                </label>
                <select
                  id="department"
                  name="department"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  value={formData.department}
                  onChange={handleChange}
                >
                  <option value="">Select Department</option>
                  <option value="Front of House">Front of House</option>
                  <option value="Back of House">Back of House</option>
                  <option value="Management">Management</option>
                  <option value="Sales">Sales</option>
                  <option value="Customer Service">Customer Service</option>
                  <option value="Support">Support</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
              >
                {loading ? 'Adding...' : 'Add Staff Member'}
              </button>
            </div>
          </form>
        )}

        <div className="mt-4">
          <p className="text-sm text-gray-500">
            Add your team members to track their mentions in customer reviews. 
            The system will automatically detect when staff members are mentioned by name or position.
          </p>
        </div>
      </div>
    </div>
  )
}
