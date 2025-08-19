#!/bin/bash

echo "🚀 Starting Donation System Deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building the project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed!"
    exit 1
fi

# Run database migrations (if using Prisma)
echo "🗄️ Running database migrations..."
npx prisma migrate deploy

if [ $? -eq 0 ]; then
    echo "✅ Database migrations successful!"
else
    echo "⚠️ Database migrations failed or skipped"
fi

echo "🎉 Deployment preparation complete!"
echo ""
echo "📋 Next steps:"
echo "1. Set up your production environment variables"
echo "2. Deploy to your chosen platform (Vercel, Netlify, etc.)"
echo "3. Configure your production database"
echo "4. Set up your domain and SSL certificate"
echo ""
echo "🔒 Remember: Never commit .env files to version control!"
