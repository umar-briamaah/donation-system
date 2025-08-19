'use client';

import { memo } from 'react';
import { Heart, CreditCard, TrendingUp, CheckCircle } from 'lucide-react';

const HowItWorksSection = memo(() => {
  const steps = [
    {
      number: 1,
      icon: Heart,
      title: "Choose a Cause",
      description: "Browse through our verified causes and select one that resonates with your values and passion.",
      color: "from-red-500 to-red-600",
      bgColor: "from-red-100 to-red-200",
      darkBgColor: "from-red-900/30 to-red-800/30"
    },
    {
      number: 2,
      icon: CreditCard,
      title: "Make a Donation",
      description: "Choose your amount and complete your secure donation through our trusted payment platform.",
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-100 to-blue-200",
      darkBgColor: "from-blue-900/30 to-blue-800/30"
    },
    {
      number: 3,
      icon: TrendingUp,
      title: "Track Your Impact",
      description: "Receive real-time updates on how your donation is making a difference in communities.",
      color: "from-green-500 to-green-600",
      bgColor: "from-green-100 to-green-200",
      darkBgColor: "from-green-900/30 to-green-800/30"
    }
  ];

  return (
    <section className="py-16 lg:py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            How It Works
          </h2>
          <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Making a difference is simple. Follow these three easy steps to start helping others and create positive change.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div key={step.number} className="relative group">
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 z-0"></div>
              )}
              
              <div className="relative z-10 text-center">
                {/* Step Number Circle */}
                <div className={`relative mx-auto mb-6 w-20 h-20 bg-gradient-to-br ${step.bgColor} dark:${step.darkBgColor} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-3xl font-bold bg-gradient-to-br ${step.color} bg-clip-text text-transparent">
                    {step.number}
                  </span>
                  
                  {/* Success Checkmark Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                </div>

                {/* Icon */}
                <div className={`mx-auto mb-4 w-16 h-16 bg-gradient-to-br ${step.bgColor} dark:${step.darkBgColor} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <step.icon className={`h-8 w-8 bg-gradient-to-br ${step.color} bg-clip-text text-transparent`} />
                </div>

                {/* Content */}
                <h3 className="text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-300">
                  {step.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-full px-6 py-3">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            <span className="text-green-800 dark:text-green-200 font-medium">
              All causes are verified and 100% transparent
            </span>
          </div>
        </div>
      </div>
    </section>
  );
});

HowItWorksSection.displayName = 'HowItWorksSection';

export default HowItWorksSection;
