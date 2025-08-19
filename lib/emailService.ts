import sgMail from '@sendgrid/mail';
import nodemailer from 'nodemailer';

// Email service configuration
const config = {
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY,
    fromEmail: process.env.SENDGRID_FROM_EMAIL || 'noreply@givehopegh.org',
    fromName: process.env.SENDGRID_FROM_NAME || 'Give Hope Foundation',
  },
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.SMTP_FROM || 'noreply@givehopegh.org',
  },
  enableEmailVerification: process.env.ENABLE_EMAIL_VERIFICATION === 'true',
};

// Initialize SendGrid if API key is available
if (config.sendgrid.apiKey) {
  sgMail.setApiKey(config.sendgrid.apiKey);
}

// Email template types
export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

// Email data interface
export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

// Email verification data
export interface EmailVerificationData {
  email: string;
  name: string;
  verificationToken: string;
}

// Password reset data
export interface PasswordResetData {
  email: string;
  name: string;
  resetToken: string;
}

// Donation confirmation data
export interface DonationConfirmationData {
  email: string;
  name: string;
  amount: number;
  currency: string;
  causeTitle: string;
  donationId: string;
  isAnonymous: boolean;
}

// Welcome email data
export interface WelcomeEmailData {
  email: string;
  name: string;
}

/**
 * Send email using SendGrid (primary method)
 */
async function sendWithSendGrid(emailData: EmailData): Promise<boolean> {
  try {
    if (!config.sendgrid.apiKey) {
      throw new Error('SendGrid API key not configured');
    }

    const msg = {
      to: emailData.to,
      from: {
        email: config.sendgrid.fromEmail,
        name: config.sendgrid.fromName,
      },
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text || emailData.html.replace(/<[^>]*>/g, ''),
    };

    await sgMail.send(msg);
    console.log(`Email sent successfully via SendGrid to: ${emailData.to}`);
    return true;
  } catch (error) {
    console.error('SendGrid email failed:', error);
    return false;
  }
}

/**
 * Send email using SMTP (fallback method)
 */
async function sendWithSMTP(emailData: EmailData): Promise<boolean> {
  try {
    if (!config.smtp.user || !config.smtp.pass) {
      throw new Error('SMTP credentials not configured');
    }

    const transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.port === 465,
      auth: {
        user: config.smtp.user,
        pass: config.smtp.pass,
      },
    });

    const mailOptions = {
      from: config.smtp.from,
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text || emailData.html.replace(/<[^>]*>/g, ''),
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully via SMTP to: ${emailData.to}`);
    return true;
  } catch (error) {
    console.error('SMTP email failed:', error);
    return false;
  }
}

/**
 * Send email with automatic fallback
 */
export async function sendEmail(emailData: EmailData): Promise<boolean> {
  // Try SendGrid first
  if (config.sendgrid.apiKey) {
    const success = await sendWithSendGrid(emailData);
    if (success) return true;
  }

  // Fallback to SMTP
  if (config.smtp.user && config.smtp.pass) {
    return await sendWithSMTP(emailData);
  }

  throw new Error('No email service configured');
}

/**
 * Generate email verification email
 */
export function generateEmailVerificationTemplate(data: EmailVerificationData): EmailTemplate {
  const verificationUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/account/verify-email?token=${data.verificationToken}`;
  
  return {
    subject: 'Verify Your Email - Give Hope Foundation',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎯 Give Hope Foundation</h1>
          </div>
          <div class="content">
            <h2>Hello ${data.name}!</h2>
            <p>Thank you for joining Give Hope Foundation. To complete your registration, please verify your email address.</p>
            <p>Click the button below to verify your email:</p>
            <a href="${verificationUrl}" class="button">Verify Email Address</a>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p><a href="${verificationUrl}">${verificationUrl}</a></p>
            <p>This link will expire in 24 hours.</p>
            <p>If you didn't create an account with Give Hope Foundation, you can safely ignore this email.</p>
          </div>
          <div class="footer">
            <p>© 2024 Give Hope Foundation. All rights reserved.</p>
            <p>This email was sent to ${data.email}</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Hello ${data.name}!
      
      Thank you for joining Give Hope Foundation. To complete your registration, please verify your email address.
      
      Click this link to verify your email: ${verificationUrl}
      
      This link will expire in 24 hours.
      
      If you didn't create an account with Give Hope Foundation, you can safely ignore this email.
      
      © 2024 Give Hope Foundation. All rights reserved.
    `,
  };
}

/**
 * Generate password reset email
 */
export function generatePasswordResetTemplate(data: PasswordResetData): EmailTemplate {
  const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/account/reset-password?token=${data.resetToken}`;
  
  return {
    subject: 'Reset Your Password - Give Hope Foundation',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎯 Give Hope Foundation</h1>
          </div>
          <div class="content">
            <h2>Hello ${data.name}!</h2>
            <p>We received a request to reset your password for your Give Hope Foundation account.</p>
            <p>Click the button below to reset your password:</p>
            <a href="${resetUrl}" class="button">Reset Password</a>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p><a href="${resetUrl}">${resetUrl}</a></p>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request a password reset, you can safely ignore this email.</p>
          </div>
          <div class="footer">
            <p>© 2024 Give Hope Foundation. All rights reserved.</p>
            <p>This email was sent to ${data.email}</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Hello ${data.name}!
      
      We received a request to reset your password for your Give Hope Foundation account.
      
      Click this link to reset your password: ${resetUrl}
      
      This link will expire in 1 hour.
      
      If you didn't request a password reset, you can safely ignore this email.
      
      © 2024 Give Hope Foundation. All rights reserved.
    `,
  };
}

/**
 * Generate donation confirmation email
 */
export function generateDonationConfirmationTemplate(data: DonationConfirmationData): EmailTemplate {
  const donationUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/account/donations/${data.donationId}`;
  
  return {
    subject: `Thank You for Your Donation - ${data.causeTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Donation Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .donation-details { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #dc2626; }
          .button { display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎯 Give Hope Foundation</h1>
          </div>
          <div class="content">
            <h2>Thank You for Your Generosity!</h2>
            <p>Dear ${data.name},</p>
            <p>Your donation has been received and will make a real difference in the lives of those in need.</p>
            
            <div class="donation-details">
              <h3>Donation Details</h3>
              <p><strong>Amount:</strong> ${data.currency} ${data.amount.toLocaleString()}</p>
              <p><strong>Cause:</strong> ${data.causeTitle}</p>
              <p><strong>Donation ID:</strong> ${data.donationId}</p>
              <p><strong>Anonymous:</strong> ${data.isAnonymous ? 'Yes' : 'No'}</p>
            </div>
            
            <p>Your contribution will help us continue our mission of providing hope and support to communities in need.</p>
            
            <a href="${donationUrl}" class="button">View Donation Details</a>
            
            <p>Thank you for being part of our mission to create positive change in the world.</p>
          </div>
          <div class="footer">
            <p>© 2024 Give Hope Foundation. All rights reserved.</p>
            <p>This email was sent to ${data.email}</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Thank You for Your Generosity!
      
      Dear ${data.name},
      
      Your donation has been received and will make a real difference in the lives of those in need.
      
      Donation Details:
      - Amount: ${data.currency} ${data.amount.toLocaleString()}
      - Cause: ${data.causeTitle}
      - Donation ID: ${data.donationId}
      - Anonymous: ${data.isAnonymous ? 'Yes' : 'No'}
      
      Your contribution will help us continue our mission of providing hope and support to communities in need.
      
      View your donation details: ${donationUrl}
      
      Thank you for being part of our mission to create positive change in the world.
      
      © 2024 Give Hope Foundation. All rights reserved.
    `,
  };
}

/**
 * Generate welcome email
 */
export function generateWelcomeEmailTemplate(data: WelcomeEmailData): EmailTemplate {
  return {
    subject: 'Welcome to Give Hope Foundation!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Give Hope</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎯 Give Hope Foundation</h1>
          </div>
          <div class="content">
            <h2>Welcome to Give Hope Foundation, ${data.name}!</h2>
            <p>We're thrilled to have you join our community of donors and changemakers.</p>
            <p>With your support, we can continue our mission of providing hope and assistance to communities in need around the world.</p>
            
            <h3>What You Can Do Next:</h3>
            <ul>
              <li>Browse our current causes and campaigns</li>
              <li>Make your first donation</li>
              <li>Set up your profile and preferences</li>
              <li>Learn about our impact and success stories</li>
            </ul>
            
            <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/causes" class="button">Browse Causes</a>
            
            <p>If you have any questions or need assistance, don't hesitate to reach out to our support team.</p>
            <p>Thank you for choosing to make a difference with Give Hope Foundation!</p>
          </div>
          <div class="footer">
            <p>© 2024 Give Hope Foundation. All rights reserved.</p>
            <p>This email was sent to ${data.email}</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Welcome to Give Hope Foundation, ${data.name}!
      
      We're thrilled to have you join our community of donors and changemakers.
      
      With your support, we can continue our mission of providing hope and assistance to communities in need around the world.
      
      What You Can Do Next:
      - Browse our current causes and campaigns
      - Make your first donation
      - Set up your profile and preferences
      - Learn about our impact and success stories
      
      Browse causes: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/causes
      
      If you have any questions or need assistance, don't hesitate to reach out to our support team.
      
      Thank you for choosing to make a difference with Give Hope Foundation!
      
      © 2024 Give Hope Foundation. All rights reserved.
    `,
  };
}

/**
 * Send email verification
 */
export async function sendEmailVerification(data: EmailVerificationData): Promise<boolean> {
  if (!config.enableEmailVerification) {
    console.log('Email verification is disabled');
    return true;
  }

  const template = generateEmailVerificationTemplate(data);
  return await sendEmail({
    to: data.email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}

/**
 * Send password reset email
 */
export async function sendPasswordReset(data: PasswordResetData): Promise<boolean> {
  const template = generatePasswordResetTemplate(data);
  return await sendEmail({
    to: data.email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}

/**
 * Send donation confirmation
 */
export async function sendDonationConfirmation(data: DonationConfirmationData): Promise<boolean> {
  const template = generateDonationConfirmationTemplate(data);
  return await sendEmail({
    to: data.email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}

/**
 * Send welcome email
 */
export async function sendWelcomeEmail(data: WelcomeEmailData): Promise<boolean> {
  const template = generateWelcomeEmailTemplate(data);
  return await sendEmail({
    to: data.email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}

/**
 * Test email service configuration
 */
export async function testEmailService(): Promise<{ success: boolean; method: string; error?: string }> {
  const testEmail = {
    to: 'test@example.com',
    subject: 'Test Email from Give Hope Foundation',
    html: '<h1>Test Email</h1><p>This is a test email to verify the email service configuration.</p>',
    text: 'Test Email\n\nThis is a test email to verify the email service configuration.',
  };

  try {
    // Try SendGrid first
    if (config.sendgrid.apiKey) {
      const success = await sendWithSendGrid(testEmail);
      if (success) {
        return { success: true, method: 'SendGrid' };
      }
    }

    // Try SMTP
    if (config.smtp.user && config.smtp.pass) {
      const success = await sendWithSMTP(testEmail);
      if (success) {
        return { success: true, method: 'SMTP' };
      }
    }

    return { success: false, method: 'None', error: 'No email service configured' };
  } catch (error) {
    return { success: false, method: 'Error', error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
