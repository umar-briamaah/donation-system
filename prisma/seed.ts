import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Hash passwords for users
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('password123', 10);

  // Create payment providers
  const paymentProviders = await Promise.all([
    prisma.paymentProvider.upsert({
      where: { name: 'MTN Mobile Money' },
      update: {},
      create: {
        name: 'MTN Mobile Money',
        type: 'MOBILE_MONEY',
        isActive: true,
        config: {
          shortCode: '000000',
          apiKey: 'demo_key',
          merchantId: 'demo_merchant',
        },
      },
    }),
    prisma.paymentProvider.upsert({
      where: { name: 'Vodafone Cash' },
      update: {},
      create: {
        name: 'Vodafone Cash',
        type: 'MOBILE_MONEY',
        isActive: true,
        config: {
          shortCode: '000000',
          apiKey: 'demo_key',
          merchantId: 'demo_merchant',
        },
      },
    }),
    prisma.paymentProvider.upsert({
      where: { name: 'Airtel Money' },
      update: {},
      create: {
        name: 'Airtel Money',
        type: 'MOBILE_MONEY',
        isActive: true,
        config: {
          shortCode: '000000',
          apiKey: 'demo_key',
          merchantId: 'demo_merchant',
        },
      },
    }),
    prisma.paymentProvider.upsert({
      where: { name: 'Ecobank Ghana' },
      update: {},
      create: {
        name: 'Ecobank Ghana',
        type: 'BANK',
        isActive: true,
        config: {
          bankCode: 'GH001',
          accountNumber: '1234567890',
          accountName: 'Give Hope Foundation',
        },
      },
    }),
    prisma.paymentProvider.upsert({
      where: { name: 'Ghana Link' },
      update: {},
      create: {
        name: 'Ghana Link',
        type: 'CARD',
        isActive: true,
        config: {
          merchantId: 'demo_merchant',
          terminalId: 'demo_terminal',
        },
      },
    }),
  ]);

  console.log(`✅ Created ${paymentProviders.length} payment providers`);

  // Create sample users
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'admin@givehopegh.org' },
      update: {
        password: adminPassword, // Force update password
        name: 'Admin User',
        phone: '+233 20 123 4567',
        role: 'ADMIN',
      },
      create: {
        name: 'Admin User',
        email: 'admin@givehopegh.org',
        password: adminPassword,
        phone: '+233 20 123 4567',
        role: 'ADMIN',
      },
    }),
    prisma.user.upsert({
      where: { email: 'john.doe@example.com' },
      update: {
        password: userPassword, // Force update password
        name: 'John Doe',
        phone: '+233 24 123 4567',
        role: 'DONOR',
      },
      create: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: userPassword,
        phone: '+233 24 123 4567',
        role: 'DONOR',
      },
    }),
    prisma.user.upsert({
      where: { email: 'jane.smith@example.com' },
      update: {
        password: userPassword, // Force update password
        name: 'Jane Smith',
        phone: '+233 26 123 4567',
        role: 'DONOR',
      },
      create: {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        password: userPassword,
        phone: '+233 26 123 4567',
        role: 'DONOR',
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);

  // Create default preferences and settings for users
  const userPreferences = await Promise.all([
    prisma.userPreferences.upsert({
      where: { userId: users[0].id },
      update: {},
      create: {
        userId: users[0].id,
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        anonymousDonations: false,
        recurringDonations: true,
        donationReminders: true,
        profileVisibility: 'PUBLIC',
        showDonationHistory: true,
        showEmailInDirectory: false,
        newsletterSubscribed: true,
        impactUpdates: true,
        causeRecommendations: true,
        preferredLanguage: 'en',
        timezone: 'Africa/Accra',
        currency: 'GHS',
      },
    }),
    prisma.userPreferences.upsert({
      where: { userId: users[1].id },
      update: {},
      create: {
        userId: users[1].id,
        emailNotifications: true,
        smsNotifications: true,
        pushNotifications: false,
        anonymousDonations: true,
        recurringDonations: false,
        donationReminders: true,
        profileVisibility: 'PRIVATE',
        showDonationHistory: false,
        showEmailInDirectory: false,
        newsletterSubscribed: false,
        impactUpdates: true,
        causeRecommendations: false,
        preferredLanguage: 'en',
        timezone: 'Africa/Accra',
        currency: 'GHS',
      },
    }),
    prisma.userPreferences.upsert({
      where: { userId: users[2].id },
      update: {},
      create: {
        userId: users[2].id,
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        anonymousDonations: false,
        recurringDonations: true,
        donationReminders: true,
        profileVisibility: 'FRIENDS_ONLY',
        showDonationHistory: true,
        showEmailInDirectory: true,
        newsletterSubscribed: true,
        impactUpdates: true,
        causeRecommendations: true,
        preferredLanguage: 'en',
        timezone: 'Africa/Accra',
        currency: 'GHS',
      },
    }),
  ]);

  const userSettings = await Promise.all([
    prisma.userSettings.upsert({
      where: { userId: users[0].id },
      update: {},
      create: {
        userId: users[0].id,
        twoFactorEnabled: true,
        loginNotifications: true,
        sessionTimeout: 7200,
        autoLogout: true,
        rememberLogin: true,
        theme: 'light',
        fontSize: 'medium',
        compactMode: false,
        highContrast: false,
        screenReader: false,
        reducedMotion: false,
      },
    }),
    prisma.userSettings.upsert({
      where: { userId: users[1].id },
      update: {},
      create: {
        userId: users[1].id,
        twoFactorEnabled: false,
        loginNotifications: false,
        sessionTimeout: 3600,
        autoLogout: false,
        rememberLogin: true,
        theme: 'dark',
        fontSize: 'large',
        compactMode: true,
        highContrast: true,
        screenReader: false,
        reducedMotion: true,
      },
    }),
    prisma.userSettings.upsert({
      where: { userId: users[2].id },
      update: {},
      create: {
        userId: users[2].id,
        twoFactorEnabled: false,
        loginNotifications: true,
        sessionTimeout: 5400,
        autoLogout: true,
        rememberLogin: false,
        theme: 'auto',
        fontSize: 'medium',
        compactMode: false,
        highContrast: false,
        screenReader: false,
        reducedMotion: false,
      },
    }),
  ]);

  console.log(`✅ Created ${userPreferences.length} user preferences`);
  console.log(`✅ Created ${userSettings.length} user settings`);

  // Create sample causes
  const causes = await Promise.all([
    prisma.cause.upsert({
      where: { id: 'cause-1' },
      update: {},
      create: {
        id: 'cause-1',
        title: 'Clean Water for Rural Communities in Northern Ghana',
        description: 'Help provide clean drinking water to rural communities in Northern Ghana through the construction of water wells and purification systems. This project will benefit over 5,000 people across 10 communities.',
        targetAmount: 50000,
        raisedAmount: 32000,
        category: 'Health & Sanitation',
        location: 'Northern Ghana',
        status: 'ACTIVE',
        imageUrl: 'https://images.unsplash.com/photo-1559827260728-1c00da094a0b?w=800',
      },
    }),
    prisma.cause.upsert({
      where: { id: 'cause-2' },
      update: {},
      create: {
        id: 'cause-2',
        title: 'Education for Underprivileged Children in Accra',
        description: 'Support education initiatives for children from low-income families in Accra, including school supplies, uniforms, and tuition assistance. Help break the cycle of poverty through education.',
        targetAmount: 30000,
        raisedAmount: 18500,
        category: 'Education',
        location: 'Accra',
        status: 'ACTIVE',
        imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
      },
    }),
    prisma.cause.upsert({
      where: { id: 'cause-3' },
      update: {},
      create: {
        id: 'cause-3',
        title: 'Healthcare Access for Rural Villages',
        description: 'Establish mobile health clinics and provide medical supplies to under served rural communities across Ghana. This initiative will bring essential healthcare services to remote areas.',
        targetAmount: 75000,
        raisedAmount: 42000,
        category: 'Healthcare',
        location: 'Rural Ghana',
        status: 'ACTIVE',
        imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800',
      },
    }),
    prisma.cause.upsert({
      where: { id: 'cause-4' },
      update: {},
      create: {
        id: 'cause-4',
        title: 'Emergency Relief for Flood Victims',
        description: 'Provide immediate relief to communities affected by recent flooding, including food, clean water, shelter, and medical assistance. Help families rebuild their lives.',
        targetAmount: 25000,
        raisedAmount: 12000,
        category: 'Emergency Relief',
        location: 'Eastern Region',
        status: 'ACTIVE',
        imageUrl: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800',
      },
    }),
  ]);

  console.log(`✅ Created ${causes.length} causes`);

  // Create sample donations and payments
  const donations = await Promise.all([
    prisma.donation.create({
      data: {
        amount: 250,
        currency: 'GHS',
        message: 'Happy to help with this important cause!',
        isAnonymous: false,
        status: 'COMPLETED',
        userId: users[1].id, // John Doe
        causeId: causes[0].id, // Clean Water
      },
    }),
    prisma.donation.create({
      data: {
        amount: 500,
        currency: 'GHS',
        message: 'Education is the key to a better future.',
        isAnonymous: false,
        status: 'COMPLETED',
        userId: users[2].id, // Jane Smith
        causeId: causes[1].id, // Education
      },
    }),
    prisma.donation.create({
      data: {
        amount: 100,
        currency: 'GHS',
        message: 'Every little bit helps!',
        isAnonymous: true,
        status: 'COMPLETED',
        userId: users[1].id, // John Doe
        causeId: causes[2].id, // Healthcare
      },
    }),
  ]);

  console.log(`✅ Created ${donations.length} donations`);

  // Create sample payments
  const payments = await Promise.all([
    prisma.payment.create({
      data: {
        amount: 250,
        currency: 'GHS',
        paymentMethod: 'MOBILE_MONEY',
        provider: 'MTN_MOMO',
        reference: `GH${Date.now()}ABC`,
        status: 'COMPLETED',
        transactionId: 'MM123456789',
        metadata: {
          phone: '+233 24 123 4567',
          provider: 'MTN_MOMO',
          processedAt: new Date().toISOString(),
        },
        donationId: donations[0].id,
        userId: users[1].id,
      },
    }),
    prisma.payment.create({
      data: {
        amount: 500,
        currency: 'GHS',
        paymentMethod: 'BANK_TRANSFER',
        provider: 'ECOBANK',
        reference: `GH${Date.now()}DEF`,
        status: 'COMPLETED',
        transactionId: 'BT123456789',
        metadata: {
          bankDetails: {
            accountNumber: '1234567890',
            accountName: 'Jane Smith',
            bankName: 'Ecobank',
          },
          provider: 'ECOBANK',
          processedAt: new Date().toISOString(),
        },
        donationId: donations[1].id,
        userId: users[2].id,
      },
    }),
    prisma.payment.create({
      data: {
        amount: 100,
        currency: 'GHS',
        paymentMethod: 'DEBIT_CARD',
        provider: 'GH_LINK',
        reference: `GH${Date.now()}GHI`,
        status: 'COMPLETED',
        transactionId: 'DC123456789',
        metadata: {
          cardLast4: '3456',
          cardType: 'VISA',
          provider: 'GH_LINK',
          processedAt: new Date().toISOString(),
        },
        donationId: donations[2].id,
        userId: users[1].id,
      },
    }),
  ]);

  console.log(`✅ Created ${payments.length} payments`);

  // Update cause raised amounts
  await Promise.all([
    prisma.cause.update({
      where: { id: causes[0].id },
      data: { raisedAmount: 250 },
    }),
    prisma.cause.update({
      where: { id: causes[1].id },
      data: { raisedAmount: 500 },
    }),
    prisma.cause.update({
      where: { id: causes[2].id },
      data: { raisedAmount: 100 },
    }),
  ]);

  console.log('✅ Updated cause raised amounts');

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });