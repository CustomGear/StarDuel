export interface SentimentResult {
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE'
  confidence: number
  score: number // -1 to 1, where -1 is very negative, 1 is very positive
}

export class SentimentAnalysisService {
  private positiveWords: Set<string>
  private negativeWords: Set<string>
  private intensifiers: Set<string>
  private negators: Set<string>

  constructor() {
    this.positiveWords = new Set([
      'excellent', 'amazing', 'wonderful', 'fantastic', 'great', 'good', 'awesome',
      'outstanding', 'perfect', 'brilliant', 'superb', 'marvelous', 'exceptional',
      'love', 'loved', 'enjoyed', 'pleased', 'satisfied', 'happy', 'delighted',
      'impressed', 'recommend', 'recommended', 'best', 'favorite', 'top',
      'helpful', 'friendly', 'kind', 'professional', 'courteous', 'polite',
      'clean', 'fresh', 'delicious', 'tasty', 'quality', 'value', 'worth',
      'quick', 'fast', 'efficient', 'smooth', 'easy', 'convenient'
    ])

    this.negativeWords = new Set([
      'terrible', 'awful', 'horrible', 'disgusting', 'disappointing', 'bad',
      'worst', 'hate', 'hated', 'dislike', 'unhappy', 'angry', 'frustrated',
      'annoyed', 'upset', 'disappointed', 'unsatisfied', 'poor', 'cheap',
      'dirty', 'messy', 'slow', 'late', 'rude', 'unprofessional', 'unfriendly',
      'cold', 'unhelpful', 'difficult', 'complicated', 'confusing', 'wrong',
      'broken', 'damaged', 'old', 'stale', 'overpriced', 'expensive', 'waste'
    ])

    this.intensifiers = new Set([
      'very', 'extremely', 'incredibly', 'absolutely', 'completely', 'totally',
      'really', 'quite', 'rather', 'somewhat', 'slightly', 'barely', 'hardly'
    ])

    this.negators = new Set([
      'not', 'no', 'never', 'none', 'nothing', 'nobody', 'nowhere', 'neither',
      'nor', 'cannot', 'can\'t', 'won\'t', 'wouldn\'t', 'shouldn\'t', 'couldn\'t'
    ])
  }

  /**
   * Analyze sentiment of a text
   */
  analyzeSentiment(text: string): SentimentResult {
    const words = this.tokenize(text)
    let score = 0
    let totalWords = 0

    for (let i = 0; i < words.length; i++) {
      const word = words[i].toLowerCase()
      let wordScore = 0
      let intensity = 1

      // Check for negators
      if (i > 0 && this.negators.has(words[i - 1].toLowerCase())) {
        intensity = -1
      }

      // Check for intensifiers
      if (i > 0 && this.intensifiers.has(words[i - 1].toLowerCase())) {
        intensity *= 1.5
      }

      // Check positive words
      if (this.positiveWords.has(word)) {
        wordScore = 1
      }
      // Check negative words
      else if (this.negativeWords.has(word)) {
        wordScore = -1
      }

      // Apply intensity modifier
      wordScore *= intensity
      score += wordScore
      totalWords++
    }

    // Normalize score
    const normalizedScore = totalWords > 0 ? score / totalWords : 0

    // Determine sentiment and confidence
    let sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE'
    let confidence: number

    if (normalizedScore > 0.1) {
      sentiment = 'POSITIVE'
      confidence = Math.min(0.9, 0.5 + Math.abs(normalizedScore) * 0.4)
    } else if (normalizedScore < -0.1) {
      sentiment = 'NEGATIVE'
      confidence = Math.min(0.9, 0.5 + Math.abs(normalizedScore) * 0.4)
    } else {
      sentiment = 'NEUTRAL'
      confidence = 0.6
    }

    return {
      sentiment,
      confidence,
      score: normalizedScore
    }
  }

  /**
   * Analyze sentiment of multiple texts and return aggregated results
   */
  analyzeBatch(texts: string[]): {
    overall: SentimentResult
    individual: SentimentResult[]
    distribution: {
      positive: number
      neutral: number
      negative: number
    }
  } {
    const individual = texts.map(text => this.analyzeSentiment(text))
    
    // Calculate overall sentiment
    const totalScore = individual.reduce((sum, result) => sum + result.score, 0)
    const averageScore = totalScore / individual.length
    
    let overallSentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE'
    if (averageScore > 0.1) {
      overallSentiment = 'POSITIVE'
    } else if (averageScore < -0.1) {
      overallSentiment = 'NEGATIVE'
    } else {
      overallSentiment = 'NEUTRAL'
    }

    const overall: SentimentResult = {
      sentiment: overallSentiment,
      confidence: Math.min(0.9, 0.5 + Math.abs(averageScore) * 0.4),
      score: averageScore
    }

    // Calculate distribution
    const distribution = {
      positive: individual.filter(r => r.sentiment === 'POSITIVE').length,
      neutral: individual.filter(r => r.sentiment === 'NEUTRAL').length,
      negative: individual.filter(r => r.sentiment === 'NEGATIVE').length
    }

    return {
      overall,
      individual,
      distribution
    }
  }

  /**
   * Tokenize text into words
   */
  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ') // Remove punctuation
      .split(/\s+/)
      .filter(word => word.length > 0)
  }

  /**
   * Get sentiment color for UI
   */
  getSentimentColor(sentiment: string): string {
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

  /**
   * Get sentiment emoji
   */
  getSentimentEmoji(sentiment: string): string {
    switch (sentiment) {
      case 'POSITIVE':
        return '😊'
      case 'NEGATIVE':
        return '😞'
      case 'NEUTRAL':
        return '😐'
      default:
        return '😐'
    }
  }

  /**
   * Analyze sentiment trends over time
   */
  analyzeTrends(reviews: Array<{ sentiment: string | null; createdAt: Date }>): {
    trend: 'improving' | 'declining' | 'stable'
    change: number
    period: string
  } {
    if (reviews.length < 2) {
      return {
        trend: 'stable',
        change: 0,
        period: 'insufficient data'
      }
    }

    // Sort by date
    const sortedReviews = reviews.sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )

    // Split into two halves
    const midpoint = Math.floor(sortedReviews.length / 2)
    const firstHalf = sortedReviews.slice(0, midpoint)
    const secondHalf = sortedReviews.slice(midpoint)

    // Calculate average sentiment for each half
    const firstHalfSentiment = this.calculateAverageSentiment(firstHalf)
    const secondHalfSentiment = this.calculateAverageSentiment(secondHalf)

    const change = secondHalfSentiment - firstHalfSentiment
    const changePercent = Math.abs(change) * 100

    let trend: 'improving' | 'declining' | 'stable'
    if (change > 0.1) {
      trend = 'improving'
    } else if (change < -0.1) {
      trend = 'declining'
    } else {
      trend = 'stable'
    }

    return {
      trend,
      change: changePercent,
      period: `${firstHalf.length} to ${secondHalf.length} reviews`
    }
  }

  /**
   * Calculate average sentiment score from reviews
   */
  private calculateAverageSentiment(reviews: Array<{ sentiment: string | null }>): number {
    const scores = reviews.map(review => {
      switch (review.sentiment) {
        case 'POSITIVE':
          return 1
        case 'NEGATIVE':
          return -1
        case 'NEUTRAL':
        default:
          return 0
      }
    })

    return (scores as number[]).reduce((sum, score) => sum + score, 0) / scores.length
  }
}
