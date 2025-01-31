"use client"
import { useLogs } from '@/hooks/useLogs';
import { motion } from 'framer-motion';
import { AlertCircle, ScrollText } from 'lucide-react';
import { useEffect } from 'react';
import LogsTable from './LogTable';

const LogsPage = () => {
    const {
        logs,
        loading,
        error,
        filters,
        metadata,
        fetchLogs,
        handleFilterChange,
        exportLogs
    } = useLogs();

    useEffect(() => {
        fetchLogs();
    }, []);
    console.log("logs", filters)

    return (
        <div className="container mx-auto p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <ScrollText className="w-8 h-8 text-orange-500" />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">System Logs</h1>
                        <p className="text-sm text-gray-500">
                            View and manage system activity logs
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {[
                    {
                        label: 'Total Logs',
                        value: metadata.total,
                        icon: ScrollText,
                        color: 'text-blue-500 bg-blue-50'
                    },
                    {
                        label: 'Error Logs',
                        value: logs.filter(log => log.level === 'error').length,
                        icon: AlertCircle,
                        color: 'text-red-500 bg-red-50'
                    },
                    {
                        label: 'Today\'s Logs',
                        value: logs.filter(log => {
                            const today = new Date().toISOString().split('T')[0];
                            return log.timestamp.startsWith(today);
                        }).length,
                        icon: ScrollText,
                        color: 'text-green-500 bg-green-50'
                    }
                ].map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-lg ${stat.color}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">
                                    {stat.label}
                                </h3>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {stat.value}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Error Alert */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
                >
                    <div className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        <p>{error}</p>
                    </div>
                </motion.div>
            )}

            {/* Logs Table */}
            <LogsTable
                logs={logs}
                loading={loading}
                filters={filters}
                metadata={metadata}
                onFilterChange={handleFilterChange}
                onRefresh={fetchLogs}
                onExport={exportLogs}
            />
        </div>
    );
};

export default LogsPage;