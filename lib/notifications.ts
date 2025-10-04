import { prisma } from './prisma'
import nodemailer from 'nodemailer'

export interface NotificationData {
  type: 'NEW_REVIEW' | 'NEW_MENTION' | 'SENTIMENT_ALERT' | 'WEEKLY_SUMMARY'
  title: string
  message: string
  userId: string
  companyId: string
  metadata?: any
}

export class NotificationService {
  private transporter: nodemailer.Transporter

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    })
  }

  /**
   * Send a notification to a user
   */
  async sendNotification(data: NotificationData): Promise<void> {
    try {
      // Save notification to database
      await prisma.notification.create({
        data: {
          type: data.type,
          title: data.title,
          message: data.message,
          userId: data.userId,
          companyId: data.companyId,
          metadata: data.metadata || {},
          isRead: false
        }
      })

      // Send email notification
      await this.sendEmailNotification(data)
    } catch (error) {
      console.error('Error sending notification:', error)
    }
  }

  /**
   * Send email notification
   */
  private async sendEmailNotification(data: NotificationData): Promise<void> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: data.userId },
        include: { company: true }
      })

      if (!user?.email) return

      const emailContent = this.generateEmailContent(data, user.company?.name || 'Your Company')

      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: data.title,
        html: emailContent
      })
    } catch (error) {
      console.error('Error sending email notification:', error)
    }
  }

  /**
   * Generate email content
   */
  private generateEmailContent(data: NotificationData, companyName: string): string {
    const baseTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${data.title}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #3b82f6; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9fafb; }
          .footer { padding: 20px; text-align: center; color: #6b7280; font-size: 12px; }
          .button { display: inline-block; padding: 10px 20px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>ReviewDuel</h1>
            <p>${companyName}</p>
          </div>
          <div class="content">
            <h2>${data.title}</h2>
            <p>${data.message}</p>
            ${this.getEmailActionButton(data)}
          </div>
          <div class="footer">
            <p>This is an automated notification from ReviewDuel.</p>
            <p>You can manage your notification preferences in your dashboard.</p>
          </div>
        </div>
      </body>
      </html>
    `

    return baseTemplate
  }

  /**
   * Get action button for email
   */
  private getEmailActionButton(data: NotificationData): string {
    switch (data.type) {
      case 'NEW_REVIEW':
        return '<a href="' + process.env.NEXTAUTH_URL + '/dashboard/reviews" class="button">View Reviews</a>'
      case 'NEW_MENTION':
        return '<a href="' + process.env.NEXTAUTH_URL + '/dashboard/staff" class="button">View Staff</a>'
      case 'SENTIMENT_ALERT':
        return '<a href="' + process.env.NEXTAUTH_URL + '/dashboard/analytics" class="button">View Analytics</a>'
      case 'WEEKLY_SUMMARY':
        return '<a href="' + process.env.NEXTAUTH_URL + '/dashboard/reports" class="button">View Reports</a>'
      default:
        return '<a href="' + process.env.NEXTAUTH_URL + '/dashboard" class="button">View Dashboard</a>'
    }
  }

  /**
   * Notify about new review
   */
  async notifyNewReview(reviewId: string, companyId: string): Promise<void> {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: { company: true }
    })

    if (!review) return

    const users = await prisma.user.findMany({
      where: { companyId }
    })

    for (const user of users) {
      await this.sendNotification({
        type: 'NEW_REVIEW',
        title: 'New Review Received',
        message: `A new ${review.rating}-star review has been received from ${review.source}. ${review.sentiment ? `Sentiment: ${review.sentiment}` : ''}`,
        userId: user.id,
        companyId,
        metadata: { reviewId }
      })
    }
  }

  /**
   * Notify about new staff mention
   */
  async notifyNewMention(mentionId: string, companyId: string): Promise<void> {
    const mention = await prisma.mention.findUnique({
      where: { id: mentionId },
      include: {
        review: true,
        staff: true
      }
    })

    if (!mention) return

    const users = await prisma.user.findMany({
      where: { companyId }
    })

    for (const user of users) {
      await this.sendNotification({
        type: 'NEW_MENTION',
        title: 'Staff Member Mentioned',
        message: `${mention.staff.name} was mentioned in a ${mention.review.rating}-star review from ${mention.review.source}.`,
        userId: user.id,
        companyId,
        metadata: { mentionId, staffId: mention.staffId, reviewId: mention.reviewId }
      })
    }
  }

  /**
   * Notify about sentiment alerts
   */
  async notifySentimentAlert(companyId: string, alertType: 'LOW_RATING' | 'NEGATIVE_TREND' | 'HIGH_VOLUME'): Promise<void> {
    const users = await prisma.user.findMany({
      where: { companyId }
    })

    let title: string
    let message: string

    switch (alertType) {
      case 'LOW_RATING':
        title = 'Low Rating Alert'
        message = 'Your average rating has dropped below 3.0. Consider reviewing recent feedback.'
        break
      case 'NEGATIVE_TREND':
        title = 'Negative Sentiment Trend'
        message = 'There has been an increase in negative sentiment in recent reviews.'
        break
      case 'HIGH_VOLUME':
        title = 'High Review Volume'
        message = 'You have received an unusually high number of reviews today.'
        break
    }

    for (const user of users) {
      await this.sendNotification({
        type: 'SENTIMENT_ALERT',
        title,
        message,
        userId: user.id,
        companyId,
        metadata: { alertType }
      })
    }
  }

  /**
   * Send weekly summary
   */
  async sendWeeklySummary(companyId: string): Promise<void> {
    const users = await prisma.user.findMany({
      where: { companyId }
    })

    // Calculate weekly stats
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const [reviews, mentions] = await Promise.all([
      prisma.review.count({
        where: {
          companyId,
          createdAt: { gte: weekAgo }
        }
      }),
      prisma.mention.count({
        where: {
          review: { companyId },
          createdAt: { gte: weekAgo }
        }
      })
    ])

    for (const user of users) {
      await this.sendNotification({
        type: 'WEEKLY_SUMMARY',
        title: 'Weekly Review Summary',
        message: `This week you received ${reviews} new reviews and ${mentions} staff mentions. Check your dashboard for detailed insights.`,
        userId: user.id,
        companyId,
        metadata: { reviews, mentions, weekStart: weekAgo }
      })
    }
  }

  /**
   * Get user notifications
   */
  async getUserNotifications(userId: string, limit: number = 20): Promise<any[]> {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit
    })
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true }
    })
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string): Promise<void> {
    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true }
    })
  }
}
