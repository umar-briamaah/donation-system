# 🚀 Donation System Deployment Guide

## 📋 Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- Git repository set up
- Environment variables configured

## 🔒 Environment Variables Setup

### **Required Variables:**

```bash
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# JWT Secrets (Generate strong random strings)
JWT_SECRET="your-64-character-secret-here"
JWT_REFRESH_SECRET="your-64-character-refresh-secret-here"

# App Configuration
NODE_ENV="production"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
```

### **Optional Variables:**

```bash
# Payment Gateway
PAYSTACK_SECRET_KEY="sk_test_..."
PAYSTACK_PUBLIC_KEY="pk_test_..."

# Email (if implementing email features)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

## 🚀 Deployment Options

### **Option 1: Vercel (Recommended for Next.js)**

1. **Install Vercel CLI:**

   ```bash
   npm i -g vercel
   ```

2. **Deploy:**

   ```bash
   vercel
   ```

3. **Set Environment Variables:**
   - Go to Vercel Dashboard
   - Project Settings → Environment Variables
   - Add all required variables

### **Option 2: Netlify**

1. **Build Command:**

   ```bash
   npm run build
   ```

2. **Publish Directory:**

   ```.next
   ```

3. **Environment Variables:**
   - Netlify Dashboard → Site Settings → Environment Variables

### **Option 3: Traditional Hosting**

1. **Build the project:**

   ```bash
   npm run build
   npm run start
   ```

2. **Use PM2 for process management:**

   ```bash
   npm install -g pm2
   pm2 start npm --name "donation-system" -- start
   ```

## 🗄️ Database Setup

### **Production Database:**

1. **PostgreSQL Cloud Options:**
   - [Supabase](https://supabase.com) (Free tier available)
   - [Neon](https://neon.tech) (Free tier available)
   - [Railway](https://railway.app) (Free tier available)

2. **Run Migrations:**

   ```bash
   npx prisma migrate deploy
   ```

3. **Seed Database (Optional):**

   ```bash
   npm run db:seed
   ```

## 🔐 Security Checklist

- [ ] JWT secrets are strong and unique
- [ ] Database connection uses SSL
- [ ] Environment variables are not in version control
- [ ] HTTPS is enabled
- [ ] CORS is properly configured
- [ ] Rate limiting is implemented

## 📱 Domain & SSL

1. **Domain Configuration:**
   - Point your domain to your hosting provider
   - Configure DNS records

2. **SSL Certificate:**
   - Most hosting providers offer free SSL
   - Let's Encrypt for custom hosting

## 🧪 Testing Deployment

1. **Test Authentication:**
   - User registration
   - User login
   - Admin access

2. **Test Core Features:**
   - Cause creation
   - Donation processing
   - Payment integration

3. **Performance Testing:**
   - Page load times
   - Database query performance
   - API response times

## 🚨 Troubleshooting

### **Common Issues:**

1. **Build Errors:**

   ```bash
   npm run build
   # Check for TypeScript errors
   ```

2. **Database Connection:**

   ```bash
   npx prisma db push
   # Verify DATABASE_URL is correct
   ```

3. **Environment Variables:**

   ```bash
   # Ensure all required variables are set
   # Check for typos in variable names
   ```

## 📞 Support

If you encounter issues:

1. Check the build logs
2. Verify environment variables
3. Test database connectivity
4. Check browser console for errors

## 🎉 Success

Once deployed, your donation system will be accessible at your domain with:

- ✅ Secure authentication
- ✅ Admin dashboard
- ✅ Donation processing
- ✅ User management
- ✅ Responsive design

---

**Remember: Never commit `.env` files to version control!** 🔒
