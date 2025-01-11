"use client"
import { motion } from 'framer-motion';
import {
  Calendar,
  Package,
  ShoppingBag,
  TrendingDown,
  TrendingUp,
  Users
} from 'lucide-react';
import React, { useState } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

// Types
interface MetricData {
  title: string;
  value: string;
  trend: number;
  icon: React.ElementType;
  chartData: { date: string; value: number }[];
}

interface DashboardOverviewProps {
  metrics: {
    revenue: MetricData;
    orders: MetricData;
    customers: MetricData;
    products: MetricData;
  };
}

// Utility to get color classes based on trend
const getTrendColors = (trend: number) => {
  return trend > 0
    ? { text: 'text-green-600', bg: 'bg-green-50', icon: 'text-green-500' }
    : { text: 'text-red-600', bg: 'bg-red-50', icon: 'text-red-500' };
};

// Metric Card Component
const MetricCard: React.FC<{ metric: MetricData }> = ({ metric }) => {
  const trendColors = getTrendColors(metric.trend);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-gray-500 mb-2">{metric.title}</p>
          <h3 className="text-2xl font-bold text-gray-900">{metric.value}</h3>
        </div>
        <div className={`p-3 rounded-full ${trendColors.bg}`}>
          <metric.icon className={`w-6 h-6 ${trendColors.icon}`} />
        </div>
      </div>
      <div className="flex items-center">
        {metric.trend > 0 ? <TrendingUp className="w-4 h-4 mr-2 text-green-500" /> :
          <TrendingDown className="w-4 h-4 mr-2 text-red-500" />}
        <span className={`text-sm font-medium ${trendColors.text}`}>
          {metric.trend}% from last month
        </span>
      </div>
      <div className="h-20 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={metric.chartData}>
            <Line
              type="monotone"
              dataKey="value"
              stroke={trendColors.icon}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

// Recent Activity Component
const RecentActivity: React.FC = () => {
  const activities = [
    {
      icon: ShoppingBag,
      message: "New order #12345 from John Doe",
      time: "2 minutes ago",
      color: "bg-orange-100",
      textColor: "text-orange-500"
    },
    {
      icon: Users,
      message: "New customer registration",
      time: "15 minutes ago",
      color: "bg-green-100",
      textColor: "text-green-500"
    },
    {
      icon: Package,
      message: "Product 'Luxury Perfume' restocked",
      time: "1 hour ago",
      color: "bg-blue-100",
      textColor: "text-blue-500"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <Calendar className="w-5 h-5 text-gray-500" />
      </div>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className={`p-2 rounded-full ${activity.color}`}>
              <activity.icon className={`w-5 h-5 ${activity.textColor}`} />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-700">{activity.message}</p>
              <p className="text-xs text-gray-500">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// Sales Analytics Component
const SalesAnalytics: React.FC<{ data: { date: string; value: number }[] }> = ({ data }) => {
  const [timeFrame, setTimeFrame] = useState('7d');

  const timeFrameOptions = [
    { label: '7 Days', value: '7d' },
    { label: '30 Days', value: '30d' },
    { label: '90 Days', value: '90d' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
      className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Sales Analytics</h3>
        <div className="flex space-x-2">
          {timeFrameOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setTimeFrame(option.value)}
              className={`px-3 py-1 rounded-full text-xs transition-colors ${timeFrame === option.value
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip
              contentStyle={{ backgroundColor: 'white', borderRadius: '8px' }}
              labelStyle={{ fontWeight: 'bold' }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#f97316"
              strokeWidth={2}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

// Main Dashboard Overview Component
export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ metrics }) => {
  return (
    <div className="space-y-6 p-6 bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard metric={metrics.revenue} />
        <MetricCard metric={metrics.orders} />
        <MetricCard metric={metrics.customers} />
        <MetricCard metric={metrics.products} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesAnalytics data={metrics.revenue.chartData} />
        </div>
        <RecentActivity />
      </div>
    </div>
  );
};

export default DashboardOverview;