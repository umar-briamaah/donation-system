# 🎯 Give Hope - Online Donation Management System

A modern, secure, and user-friendly online donation platform built with Next.js 15, TypeScript, and Prisma. This system enables individuals and organizations to create, manage, and donate to various causes while providing comprehensive tracking and management tools.

## ✨ Features

### 🔐 **Enhanced Authentication & Security**

- **JWT-based authentication** with access and refresh tokens
- **Password hashing** using bcrypt with configurable salt rounds
- **Token refresh mechanism** for seamless user experience
- **Session management** with automatic logout and timeout
- **Role-based access control** (Admin/Donor)
- **Secure API endpoints** with proper validation

### 👥 **User Management**

- **User registration** with comprehensive validation
- **Profile management** with customizable preferences
- **User settings** including theme, notifications, and security
- **Activity tracking** for security and analytics
- **Email verification** system (ready for implementation)

### 💰 **Donation System**

- **Multiple payment methods** (Mobile Money, Bank Transfer, Cards)
- **Ghana-specific payment providers** (MTN, Vodafone, Airtel)
- **Recurring donations** support
- **Anonymous donation** options
- **Donation tracking** and history
- **Impact visualization** and reporting

### 🎨 **Modern UI/UX**

- **Responsive design** optimized for all devices
- **Dark/Light theme** support with system preference detection
- **Accessibility features** including ARIA labels and screen reader support
- **Loading states** and error handling
- **Form validation** with real-time feedback
- **Interactive components** with smooth animations

### 🗄️ **Database & API**

- **PostgreSQL database** with Prisma ORM
- **Comprehensive data models** for scalability
- **RESTful API endpoints** with proper error handling
- **Data validation** and sanitization
- **Database migrations** and seeding

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd donation-system
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp env.example .env.local
   ```

   Update the `.env.local` file with your configuration:

   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/donation_system"
   
   # JWT Secrets (CHANGE THESE IN PRODUCTION!)
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   JWT_REFRESH_SECRET="your-super-secret-refresh-jwt-key-change-this-in-production"
   
   # Stripe (for payment processing)
   STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"
   STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
   STRIPE_WEBHOOK_SECRET="whsec_your_stripe_webhook_secret"
   
   # Email (for notifications and verification)
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT=587
   SMTP_USER="your-email@gmail.com"
   SMTP_PASS="your-app-password"
   SMTP_FROM="noreply@givehopegh.org"
   ```

4. **Set up the database**

   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Seed the database with initial data
   npm run db:seed
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

``` text
donation-system/
├── app/                          # Next.js 15 app directory
│   ├── account/                 # User account pages
│   │   ├── dashboard/          # User dashboard
│   │   ├── login/              # Login page
│   │   ├── register/           # Registration page
│   │   ├── profile/            # Profile management
│   │   └── settings/           # User settings
│   ├── admin/                  # Admin panel
│   ├── api/                    # API routes
│   │   ├── auth/               # Authentication endpoints
│   │   ├── causes/             # Causes management
│   │   ├── donations/          # Donation processing
│   │   └── payments/           # Payment handling
│   ├── components/             # Reusable UI components
│   │   ├── auth/               # Authentication components
│   │   ├── layout/             # Layout components
│   │   └── ui/                 # UI components
│   ├── contexts/               # React contexts
│   │   ├── AuthContext.tsx     # Authentication state
│   │   └── ThemeContext.tsx    # Theme management
│   └── lib/                    # Utility libraries
├── prisma/                     # Database schema and migrations
├── public/                     # Static assets
└── components/                 # Additional components
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with initial data
- `npm run db:studio` - Open Prisma Studio

## 🛡️ Security Features

- **JWT token rotation** for enhanced security
- **Password strength validation** with configurable requirements
- **Rate limiting** on authentication endpoints
- **Input validation** and sanitization
- **CORS protection** and security headers
- **SQL injection prevention** through Prisma ORM
- **XSS protection** with proper content encoding

## 🌍 Localization & Accessibility

- **Multi-language support** ready (currently English)
- **Ghana-specific features** (currency, phone numbers, etc.)
- **WCAG compliance** with proper ARIA labels
- **Screen reader support** and keyboard navigation
- **High contrast mode** and reduced motion options

## 📱 Mobile & Responsive

- **Mobile-first design** approach
- **Touch-friendly interfaces** for mobile devices
- **Progressive Web App** features ready
- **Responsive layouts** for all screen sizes
- **Mobile money integration** for Ghana

## 🔌 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh access token

### Core Endpoints

- `GET /api/causes` - List all causes
- `POST /api/causes` - Create new cause (Admin)
- `GET /api/donations` - Get user donations
- `POST /api/donations` - Create donation
- `GET /api/payments` - Get payment information

## 🚀 Deployment

### Production Environment

1. **Set production environment variables**
2. **Build the application**

   ```bash
   npm run build
   ```

3. **Start the production server**

   ```bash
   npm run start
   ```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- **Email**: <support@givehopegh.org>
- **Documentation**: [Project Wiki](wiki-url)
- **Issues**: [GitHub Issues](issues-url)

## 🙏 Acknowledgments

- **Next.js team** for the amazing framework
- **Prisma team** for the excellent ORM
- **Tailwind CSS** for the utility-first CSS framework
- **Lucide React** for the beautiful icons
- **Ghana tech community** for inspiration and feedback

---

<!-- **Made with ❤️ for the people of Ghana and beyond** -->
