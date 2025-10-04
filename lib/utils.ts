import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: Date | string) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function getSentimentColor(sentiment: string) {
  switch (sentiment) {
    case 'POSITIVE':
      return 'text-green-600 bg-green-100'
    case 'NEGATIVE':
      return 'text-red-600 bg-red-100'
    case 'NEUTRAL':
      return 'text-gray-600 bg-gray-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
}

export function getRatingColor(rating: number) {
  if (rating >= 4) return 'text-green-600'
  if (rating >= 3) return 'text-yellow-600'
  return 'text-red-600'
}

export function getSourceIcon(source: string) {
  switch (source) {
    case 'GOOGLE':
      return '🔍'
    case 'YELP':
      return '🍽️'
    case 'TRUSTPILOT':
      return '⭐'
    case 'FACEBOOK':
      return '📘'
    case 'TRIPADVISOR':
      return '🏨'
    case 'GLASSDOOR':
      return '💼'
    default:
      return '📝'
  }
}

export function calculateSentimentScore(reviews: any[]) {
  const total = reviews.length
  if (total === 0) return { positive: 0, neutral: 0, negative: 0 }
  
  const positive = reviews.filter(r => r.sentiment === 'POSITIVE').length
  const neutral = reviews.filter(r => r.sentiment === 'NEUTRAL').length
  const negative = reviews.filter(r => r.sentiment === 'NEGATIVE').length
  
  return {
    positive: Math.round((positive / total) * 100),
    neutral: Math.round((neutral / total) * 100),
    negative: Math.round((negative / total) * 100)
  }
}
