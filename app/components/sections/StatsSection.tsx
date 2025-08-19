'use client';

import { memo } from 'react';
import { LucideIcon } from 'lucide-react';

interface Stat {
  label: string;
  value: string;
  icon: LucideIcon;
  trend: string;
}

interface StatsSectionProps {
  stats: Stat[];
}

const StatsSection = memo(({ stats }: StatsSectionProps) => {
  return (
    <section className="py-16 lg:py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
              </div>
              <div className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-300">
                {stat.value}
              </div>
              <div className="text-gray-600 dark:text-gray-400 mb-2">{stat.label}</div>
              <div className="inline-flex items-center space-x-1 text-sm text-green-600 dark:text-green-400 font-medium">
                <span>{stat.trend}</span>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

StatsSection.displayName = 'StatsSection';

export default StatsSection;
