'use client'

import { useState } from 'react'
import { formatDateTime, getSentimentColor } from '@/lib/utils'
import { BellIcon, CheckIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  isRead: boolean
  createdAt: Date
  metadata?: any
}

interface NotificationsListProps {
  notifications: Notification[]
}

export default function NotificationsList({ notifications }: NotificationsListProps) {
  const [notificationsList, setNotificationsList] = useState(notifications)

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PATCH'
      })

      if (response.ok) {
        setNotificationsList(prev => 
          prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
        )
      }
    } catch (error) {
      toast.error('Failed to mark notification as read')
    }
  }

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/read-all', {
        method: 'PATCH'
      })

      if (response.ok) {
        setNotificationsList(prev => 
          prev.map(n => ({ ...n, isRead: true }))
        )
        toast.success('All notifications marked as read')
      }
    } catch (error) {
      toast.error('Failed to mark all notifications as read')
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'NEW_REVIEW':
        return '⭐'
      case 'NEW_MENTION':
        return '👤'
      case 'SENTIMENT_ALERT':
        return '⚠️'
      case 'WEEKLY_SUMMARY':
        return '📊'
      default:
        return '🔔'
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'NEW_REVIEW':
        return 'bg-blue-100 text-blue-800'
      case 'NEW_MENTION':
        return 'bg-green-100 text-green-800'
      case 'SENTIMENT_ALERT':
        return 'bg-red-100 text-red-800'
      case 'WEEKLY_SUMMARY':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const unreadCount = notificationsList.filter(n => !n.isRead).length

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      {unreadCount > 0 && (
        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">
            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </p>
          <button
            onClick={markAllAsRead}
            className="text-sm text-primary-600 hover:text-primary-500 font-medium"
          >
            Mark all as read
          </button>
        </div>
      )}

      {/* Notifications List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {notificationsList.length === 0 ? (
            <div className="text-center py-8">
              <BellIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
              <p className="mt-1 text-sm text-gray-500">
                You'll receive notifications for new reviews, staff mentions, and important alerts.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {notificationsList.map((notification) => (
                <div
                  key={notification.id}
                  className={`border rounded-lg p-4 ${
                    notification.isRead 
                      ? 'border-gray-200 bg-gray-50' 
                      : 'border-primary-200 bg-primary-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="flex-shrink-0">
                        <span className="text-2xl">
                          {getNotificationIcon(notification.type)}
                        </span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className={`text-sm font-medium ${
                            notification.isRead ? 'text-gray-900' : 'text-primary-900'
                          }`}>
                            {notification.title}
                          </h4>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getNotificationColor(notification.type)}`}>
                            {notification.type.replace('_', ' ')}
                          </span>
                        </div>
                        
                        <p className={`text-sm ${
                          notification.isRead ? 'text-gray-600' : 'text-primary-700'
                        }`}>
                          {notification.message}
                        </p>
                        
                        <p className="text-xs text-gray-500 mt-2">
                          {formatDateTime(notification.createdAt)}
                        </p>
                      </div>
                    </div>
                    
                    {!notification.isRead && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="flex-shrink-0 ml-4 p-1 text-gray-400 hover:text-gray-600"
                        title="Mark as read"
                      >
                        <CheckIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
