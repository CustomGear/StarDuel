'use client'

import { useState } from 'react'
import { UserGroupIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { getInitials } from '@/lib/utils'
import toast from 'react-hot-toast'

interface User {
  id: string
  name?: string | null
  email: string
  role: string
  createdAt: Date
}

interface UserManagementProps {
  users: User[]
  currentUser: {
    id: string
    role: string
  }
}

export default function UserManagement({ users, currentUser }: UserManagementProps) {
  const [showInviteForm, setShowInviteForm] = useState(false)
  const [inviteData, setInviteData] = useState({
    email: '',
    role: 'USER'
  })
  const [loading, setLoading] = useState(false)

  const handleInviteChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setInviteData({
      ...inviteData,
      [e.target.name]: e.target.value,
    })
  }

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/users/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inviteData),
      })

      if (response.ok) {
        toast.success('User invited successfully')
        setShowInviteForm(false)
        setInviteData({ email: '', role: 'USER' })
        // TODO: Refresh users list
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to invite user')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to remove this user?')) {
      return
    }

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('User removed successfully')
        // TODO: Refresh users list
      } else {
        toast.error('Failed to remove user')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  const canManageUsers = currentUser.role === 'ADMIN' || currentUser.role === 'SUPER_ADMIN'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <UserGroupIcon className="h-6 w-6 text-primary-600" />
          <h2 className="text-lg font-medium text-gray-900">Team Members</h2>
        </div>
        {canManageUsers && (
          <button
            onClick={() => setShowInviteForm(!showInviteForm)}
            className="btn-primary"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Invite User
          </button>
        )}
      </div>

      {showInviteForm && canManageUsers && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-md font-medium text-gray-900 mb-4">Invite New User</h3>
          <form onSubmit={handleInviteSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="user@company.com"
                  value={inviteData.email}
                  onChange={handleInviteChange}
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  value={inviteData.role}
                  onChange={handleInviteChange}
                >
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowInviteForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
              >
                {loading ? 'Sending...' : 'Send Invite'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-sm font-medium text-primary-600">
                    {user.name ? getInitials(user.name) : 'U'}
                  </span>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {user.name || 'No name set'}
                </p>
                <p className="text-sm text-gray-500">
                  {user.email}
                </p>
                <p className="text-xs text-gray-400">
                  Joined {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                user.role === 'SUPER_ADMIN' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {user.role}
              </span>
              
              {canManageUsers && user.id !== currentUser.id && (
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="p-2 text-gray-400 hover:text-red-600"
                  title="Remove user"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
