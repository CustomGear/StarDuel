'use client'

import { useState } from 'react'
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function GenerateReportForm() {
  const [formData, setFormData] = useState({
    reportType: 'comprehensive',
    dateRange: '30',
    format: 'pdf',
    includeCharts: true,
    includeStaffDetails: true
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `review-report-${new Date().toISOString().split('T')[0]}.${formData.format}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        
        toast.success('Report generated successfully')
      } else {
        toast.error('Failed to generate report')
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
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          Generate Report
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="reportType" className="block text-sm font-medium text-gray-700">
                Report Type
              </label>
              <select
                id="reportType"
                name="reportType"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={formData.reportType}
                onChange={handleChange}
              >
                <option value="comprehensive">Comprehensive Report</option>
                <option value="summary">Executive Summary</option>
                <option value="staff">Staff Performance</option>
                <option value="sentiment">Sentiment Analysis</option>
              </select>
            </div>

            <div>
              <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700">
                Date Range
              </label>
              <select
                id="dateRange"
                name="dateRange"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={formData.dateRange}
                onChange={handleChange}
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last year</option>
                <option value="all">All time</option>
              </select>
            </div>

            <div>
              <label htmlFor="format" className="block text-sm font-medium text-gray-700">
                Format
              </label>
              <select
                id="format"
                name="format"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={formData.format}
                onChange={handleChange}
              >
                <option value="pdf">PDF</option>
                <option value="csv">CSV</option>
                <option value="excel">Excel</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Options
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="includeCharts"
                    checked={formData.includeCharts}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">Include Charts</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="includeStaffDetails"
                    checked={formData.includeStaffDetails}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">Include Staff Details</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
              {loading ? 'Generating...' : 'Generate Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
