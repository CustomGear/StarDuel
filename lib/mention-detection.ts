import { prisma } from './prisma'

export interface MentionDetectionResult {
  staffId: string
  staffName: string
  context: string
  confidence: number
  startIndex: number
  endIndex: number
}

export class MentionDetectionService {
  /**
   * Detect staff mentions in review content
   */
  async detectMentions(
    reviewContent: string,
    companyId: string
  ): Promise<MentionDetectionResult[]> {
    // Get all active staff for the company
    const staff = await prisma.staff.findMany({
      where: {
        companyId,
        isActive: true
      }
    })

    const mentions: MentionDetectionResult[] = []

    for (const staffMember of staff) {
      const detectionResults = this.findStaffMentions(reviewContent, staffMember)
      mentions.push(...detectionResults)
    }

    // Sort by confidence and remove duplicates
    return this.deduplicateMentions(mentions)
  }

  /**
   * Find mentions of a specific staff member in text
   */
  private findStaffMentions(
    text: string,
    staff: { id: string; name: string; position?: string | null }
  ): MentionDetectionResult[] {
    const mentions: MentionDetectionResult[] = []
    const lowerText = text.toLowerCase()
    const staffName = staff.name.toLowerCase()

    // Direct name mentions
    const nameMentions = this.findNameMentions(lowerText, staffName, staff.id)
    mentions.push(...nameMentions)

    // Position-based mentions (e.g., "the manager", "our server")
    if (staff.position) {
      const positionMentions = this.findPositionMentions(lowerText, staff.position.toLowerCase(), staff.id)
      mentions.push(...positionMentions)
    }

    // Partial name matches (first name only, last name only)
    const partialMentions = this.findPartialNameMentions(lowerText, staffName, staff.id)
    mentions.push(...partialMentions)

    return mentions
  }

  /**
   * Find direct name mentions
   */
  private findNameMentions(
    text: string,
    staffName: string,
    staffId: string
  ): MentionDetectionResult[] {
    const mentions: MentionDetectionResult[] = []
    let index = 0

    while (index < text.length) {
      const foundIndex = text.indexOf(staffName, index)
      if (foundIndex === -1) break

      const context = this.extractContext(text, foundIndex, staffName.length)
      const confidence = this.calculateNameConfidence(staffName, context)

      mentions.push({
        staffId,
        staffName: staffName,
        context,
        confidence,
        startIndex: foundIndex,
        endIndex: foundIndex + staffName.length
      })

      index = foundIndex + staffName.length
    }

    return mentions
  }

  /**
   * Find position-based mentions
   */
  private findPositionMentions(
    text: string,
    position: string,
    staffId: string
  ): MentionDetectionResult[] {
    const mentions: MentionDetectionResult[] = []
    
    // Common position patterns
    const patterns = [
      `the ${position}`,
      `our ${position}`,
      `this ${position}`,
      `that ${position}`,
      `a ${position}`,
      `an ${position}`
    ]

    for (const pattern of patterns) {
      let index = 0
      while (index < text.length) {
        const foundIndex = text.indexOf(pattern, index)
        if (foundIndex === -1) break

        const context = this.extractContext(text, foundIndex, pattern.length)
        const confidence = this.calculatePositionConfidence(position, context)

        mentions.push({
          staffId,
          staffName: position,
          context,
          confidence,
          startIndex: foundIndex,
          endIndex: foundIndex + pattern.length
        })

        index = foundIndex + pattern.length
      }
    }

    return mentions
  }

  /**
   * Find partial name mentions (first name, last name)
   */
  private findPartialNameMentions(
    text: string,
    fullName: string,
    staffId: string
  ): MentionDetectionResult[] {
    const mentions: MentionDetectionResult[] = []
    const nameParts = fullName.split(' ')

    for (const namePart of nameParts) {
      if (namePart.length < 3) continue // Skip very short parts

      let index = 0
      while (index < text.length) {
        const foundIndex = text.indexOf(namePart, index)
        if (foundIndex === -1) break

        const context = this.extractContext(text, foundIndex, namePart.length)
        const confidence = this.calculatePartialNameConfidence(namePart, context, fullName)

        if (confidence > 0.6) { // Only include high-confidence partial matches
          mentions.push({
            staffId,
            staffName: namePart,
            context,
            confidence,
            startIndex: foundIndex,
            endIndex: foundIndex + namePart.length
          })
        }

        index = foundIndex + namePart.length
      }
    }

    return mentions
  }

  /**
   * Extract context around a mention
   */
  private extractContext(text: string, startIndex: number, length: number): string {
    const contextStart = Math.max(0, startIndex - 50)
    const contextEnd = Math.min(text.length, startIndex + length + 50)
    return text.substring(contextStart, contextEnd).trim()
  }

  /**
   * Calculate confidence for name mentions
   */
  private calculateNameConfidence(name: string, context: string): number {
    let confidence = 0.8 // Base confidence for exact name matches

    // Increase confidence for proper capitalization
    if (context.includes(name.charAt(0).toUpperCase() + name.slice(1))) {
      confidence += 0.1
    }

    // Increase confidence if mentioned with titles
    const titlePatterns = ['mr.', 'ms.', 'mrs.', 'dr.', 'prof.']
    for (const title of titlePatterns) {
      if (context.includes(title + ' ' + name)) {
        confidence += 0.1
        break
      }
    }

    // Decrease confidence if it's a common word
    const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']
    if (commonWords.includes(name)) {
      confidence -= 0.3
    }

    return Math.min(1.0, Math.max(0.0, confidence))
  }

  /**
   * Calculate confidence for position mentions
   */
  private calculatePositionConfidence(position: string, context: string): number {
    let confidence = 0.6 // Base confidence for position mentions

    // Increase confidence for specific context
    const positiveContext = ['helped', 'assisted', 'served', 'managed', 'handled', 'took care']
    for (const word of positiveContext) {
      if (context.includes(word)) {
        confidence += 0.1
        break
      }
    }

    // Decrease confidence for generic context
    const genericContext = ['the', 'a', 'an', 'some', 'any']
    if (genericContext.some(word => context.includes(word + ' ' + position))) {
      confidence -= 0.1
    }

    return Math.min(1.0, Math.max(0.0, confidence))
  }

  /**
   * Calculate confidence for partial name mentions
   */
  private calculatePartialNameConfidence(
    namePart: string,
    context: string,
    fullName: string
  ): number {
    let confidence = 0.4 // Lower base confidence for partial matches

    // Increase confidence if it's a first name and appears at start of sentence
    if (context.startsWith(namePart) || context.includes('. ' + namePart)) {
      confidence += 0.2
    }

    // Increase confidence if it's a unique name part
    if (namePart.length >= 4) {
      confidence += 0.1
    }

    // Decrease confidence for very common names
    const commonNames = ['john', 'jane', 'mike', 'sarah', 'david', 'lisa', 'chris', 'emily']
    if (commonNames.includes(namePart)) {
      confidence -= 0.2
    }

    return Math.min(1.0, Math.max(0.0, confidence))
  }

  /**
   * Remove duplicate mentions and keep the highest confidence ones
   */
  private deduplicateMentions(mentions: MentionDetectionResult[]): MentionDetectionResult[] {
    const seen = new Map<string, MentionDetectionResult>()

    for (const mention of mentions) {
      const key = `${mention.staffId}-${mention.startIndex}-${mention.endIndex}`
      const existing = seen.get(key)

      if (!existing || mention.confidence > existing.confidence) {
        seen.set(key, mention)
      }
    }

    return Array.from(seen.values()).sort((a, b) => b.confidence - a.confidence)
  }

  /**
   * Process a review and save mentions to database
   */
  async processReview(reviewId: string, companyId: string): Promise<void> {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: { mentions: true }
    })

    if (!review) {
      throw new Error('Review not found')
    }

    // Detect mentions
    const detectedMentions = await this.detectMentions(review.content, companyId)

    // Save mentions to database
    for (const mention of detectedMentions) {
      if (mention.confidence > 0.5) { // Only save high-confidence mentions
        await prisma.mention.upsert({
          where: {
            id: `${review.id}-${mention.staffId}`
          },
          update: {
            context: mention.context
          },
          create: {
            reviewId: review.id,
            staffId: mention.staffId,
            context: mention.context
          }
        })
      }
    }
  }
}
