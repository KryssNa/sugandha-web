"use client"
import { DashboardOverview } from "@/components/dashboard/admin/overview/overview";
import { DollarSign, Package, ShoppingBag, Users } from "lucide-react";


export default function Page() {
  const dummyMetrics = {
    revenue: {
      title: 'Total Revenue',
      value: '$45,890',
      trend: 12.3,
      icon: DollarSign,
      chartData: [
        { date: '2023-01-01', value: 4500 },
        { date: '2023-01-02', value: 5200 },
        { date: '2023-01-03', value: 4800 },
        { date: '2023-01-04', value: 5100 },
        { date: '2023-01-05', value: 6000 },
        { date: '2023-01-06', value: 5800 },
        { date: '2023-01-07', value: 6200 },
      ],
    },
    orders: {
      title: 'Total Orders',
      value: '1,234',
      trend: 8.1,
      icon: ShoppingBag,
      chartData: [
        { date: '2023-01-01', value: 120 },
        { date: '2023-01-02', value: 98 },
        { date: '2023-01-03', value: 105 },
        { date: '2023-01-04', value: 110 },
        { date: '2023-01-05', value: 130 },
        { date: '2023-01-06', value: 122 },
        { date: '2023-01-07', value: 135 },
      ],
    },
    customers: {
      title: 'New Customers',
      value: '567',
      trend: 5.6,
      icon: Users,
      chartData: [
        { date: '2023-01-01', value: 20 },
        { date: '2023-01-02', value: 15 },
        { date: '2023-01-03', value: 18 },
        { date: '2023-01-04', value: 22 },
        { date: '2023-01-05', value: 25 },
        { date: '2023-01-06', value: 28 },
        { date: '2023-01-07', value: 30 },
      ],
    },
    products: {
      title: 'Total Products',
      value: '456',
      trend: -2.3,
      icon: Package,
      chartData: [
        { date: '2023-01-01', value: 120 },
        { date: '2023-01-02', value: 118 },
        { date: '2023-01-03', value: 115 },
        { date: '2023-01-04', value: 112 },
        { date: '2023-01-05', value: 110 },
        { date: '2023-01-06', value: 108 },
        { date: '2023-01-07', value: 105 },
      ],
    },
  };
  return (
    <div>
      <DashboardOverview metrics={dummyMetrics}
      key={dummyMetrics.revenue.value}
      />
    </div>
  );
}