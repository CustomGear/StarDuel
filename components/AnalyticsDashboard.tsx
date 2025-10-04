'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

interface AnalyticsData {
  totalReviews: number
  totalMentions: number
  averageRating: number
  sentimentDistribution: {
    positive: number
    neutral: number
    negative: number
  }
  sourceDistribution: Record<string, number>
  staffPerformance: Array<{
    staff: {
      name: string
    }
    totalMentions: number
    sentimentScore: number
  }>
}

interface AnalyticsDashboardProps {
  data: AnalyticsData
}

export default function AnalyticsDashboard({ data }: AnalyticsDashboardProps) {
  // Prepare data for charts
  const sentimentData = [
    { name: 'Positive', value: data.sentimentDistribution.positive, color: '#10b981' },
    { name: 'Neutral', value: data.sentimentDistribution.neutral, color: '#6b7280' },
    { name: 'Negative', value: data.sentimentDistribution.negative, color: '#ef4444' }
  ]

  const sourceData = Object.entries(data.sourceDistribution).map(([source, count]) => ({
    source,
    count,
    percentage: Math.round((count / data.totalReviews) * 100)
  }))

  const staffData = data.staffPerformance.slice(0, 5).map(staff => ({
    name: staff.staff.name,
    mentions: staff.totalMentions,
    sentiment: staff.sentimentScore
  }))

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold">📊</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Reviews</p>
              <p className="text-2xl font-semibold text-gray-900">{data.totalReviews}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-semibold">💬</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Staff Mentions</p>
              <p className="text-2xl font-semibold text-gray-900">{data.totalMentions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 font-semibold">⭐</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg Rating</p>
              <p className="text-2xl font-semibold text-gray-900">{data.averageRating.toFixed(1)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-semibold">😊</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Positive Sentiment</p>
              <p className="text-2xl font-semibold text-gray-900">{data.sentimentDistribution.positive}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Sentiment Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sentimentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name} ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {sentimentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Review Sources */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Review Sources</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sourceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="source" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Staff Performance */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Top Staff by Mentions</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={staffData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="mentions" fill="#3b82f6" name="Mentions" />
            <Bar dataKey="sentiment" fill="#10b981" name="Sentiment Score" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
