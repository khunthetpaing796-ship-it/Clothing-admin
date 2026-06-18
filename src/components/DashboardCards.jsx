import React from 'react';
import { FiPackage, FiShoppingBag, FiUsers, FiDollarSign } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';

function DashboardCards() {
  const { t } = useLanguage();

  // Card configuration – only static data; labels and change text are translated
  const cards = [
    { key: 'total_products', icon: FiPackage, color: 'from-blue-500 to-blue-600', value: '156' },
    { key: 'total_orders', icon: FiShoppingBag, color: 'from-green-500 to-green-600', value: '1,234' },
    { key: 'total_customers', icon: FiUsers, color: 'from-purple-500 to-purple-600', value: '892' },
    { key: 'revenue', icon: FiDollarSign, color: 'from-orange-500 to-orange-600', value: '$45,678' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, i) => (
        <div
          key={i}
          className="card p-6 hover:scale-105 transition-transform duration-300 bg-gradient-to-br from-white to-emerald-50 dark:from-gray-800 dark:to-gray-900"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                {t(card.key)}
              </p>
              <p className="text-lg font-bold mt-2 text-gray-800 dark:text-white">
                {card.value}
              </p>
              <p className="text-green-600 dark:text-green-400 text-xs mt-1">
                +12% {t('from_last_month')}
              </p>
            </div>
            <div className={`w-10 h-10 bg-gradient-to-r ${card.color} rounded-xl flex items-center justify-center shadow-lg`}>
              <card.icon className="text-white w-5 h-5" size={24} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default DashboardCards;