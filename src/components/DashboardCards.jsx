import React from 'react';
import { FiPackage, FiShoppingBag, FiUsers, FiDollarSign } from 'react-icons/fi';

const cards = [
  { title: 'Total Products', value: '156', icon: FiPackage, color: 'from-blue-500 to-blue-600', change: '+12%' },
  { title: 'Total Orders', value: '1,234', icon: FiShoppingBag, color: 'from-green-500 to-green-600', change: '+8%' },
  { title: 'Total Customers', value: '892', icon: FiUsers, color: 'from-purple-500 to-purple-600', change: '+15%' },
  { title: 'Revenue', value: '$45,678', icon: FiDollarSign, color: 'from-orange-500 to-orange-600', change: '+23%' },
];

function DashboardCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, i) => (
        <div key={i} className="card p-6 hover:scale-105 transition-transform duration-300 bg-gradient-to-br from-white to-emerald-50 dark:from-gray-800 dark:to-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{card.title}</p>
              <p className="text-2xl font-bold mt-2 text-gray-800 dark:text-white">{card.value}</p>
              <p className="text-green-600 dark:text-green-400 text-xs mt-1">{card.change} from last month</p>
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
