// components/logs/LogsTable.tsx
import type { Log, LogFilters } from '@/types/logs.types';
import { format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import {
    AlertCircle,
    AlertTriangle,
    Bug,
    ChevronDown,
    ChevronUp,
    Download,
    Info,
    RefreshCw,
    Search
} from 'lucide-react';
import React, { useState } from 'react';

const levelIcons = {
    info: <Info className="w-4 h-4 text-blue-500" />,
    error: <AlertCircle className="w-4 h-4 text-red-500" />,
    warn: <AlertTriangle className="w-4 h-4 text-yellow-500" />,
    debug: <Bug className="w-4 h-4 text-green-500" />
} as const;

const levelStyles = {
    info: 'bg-blue-50 text-blue-700 border-blue-100',
    error: 'bg-red-50 text-red-700 border-red-100',
    warn: 'bg-yellow-50 text-yellow-700 border-yellow-100',
    debug: 'bg-green-50 text-green-700 border-green-100'
} as const;

interface LogsTableProps {
    logs: Log[];
    loading: boolean;
    filters: LogFilters;
    metadata: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
    onFilterChange: (filters: Partial<LogFilters>) => void;
    onRefresh: () => void;
    onExport: () => void;
}

const LogsTable: React.FC<LogsTableProps> = ({
    logs,
    loading,
    filters,
    metadata,
    onFilterChange,
    onRefresh,
    onExport
}) => {
    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

    const toggleRow = (logId: string) => {
        setExpandedRows(prev => ({
            ...prev,
            [logId]: !prev[logId]
        }));
    };

    const handleSort = (field: string) => {
        onFilterChange({
            sortBy: field,
            sortOrder: filters.sortBy === field && filters.sortOrder === 'asc' ? 'desc' : 'asc'
        });
    };

    // Generate page numbers array for pagination
    const getPageNumbers = () => {
        const maxPages = metadata.totalPages;
        const currentPage = metadata.page;
        const delta = 2; // Number of pages to show before and after current page

        let pages: number[] = [];
        let leftBound = Math.max(1, currentPage - delta);
        let rightBound = Math.min(maxPages, currentPage + delta);

        if (leftBound > 1) {
            pages.push(1);
            if (leftBound > 2) pages.push(-1); // Add ellipsis
        }

        for (let i = leftBound; i <= rightBound; i++) {
            pages.push(i);
        }

        if (rightBound < maxPages) {
            if (rightBound < maxPages - 1) pages.push(-1); // Add ellipsis
            pages.push(maxPages);
        }

        return pages;
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Filters Section */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2 flex-wrap">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search logs..."
                                value={filters.search}
                                onChange={(e) => onFilterChange({ search: e.target.value })}
                                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 
                  focus:ring-blue-500 focus:border-transparent"
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 
                text-gray-400 w-4 h-4" />
                        </div>

                        <select
                            value={filters.level}
                            onChange={(e) => onFilterChange({ level: e.target.value })}
                            className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 
                focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">All Levels</option>
                            <option value="info">Info</option>
                            <option value="error">Error</option>
                            <option value="warn">Warning</option>
                            <option value="debug">Debug</option>
                        </select>

                        <input
                            type="date"
                            value={filters.startDate}
                            onChange={(e) => onFilterChange({ startDate: e.target.value })}
                            className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 
                focus:ring-blue-500 focus:border-transparent"
                        />

                        <input
                            type="date"
                            value={filters.endDate}
                            onChange={(e) => onFilterChange({ endDate: e.target.value })}
                            className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 
                focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onRefresh}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                            <RefreshCw className="w-5 h-5" />
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onExport}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                            <Download className="w-5 h-5" />
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="w-10"></th>
                            {[
                                { field: 'timestamp', label: 'Timestamp' },
                                { field: 'level', label: 'Level' },
                                { field: 'message', label: 'Message' },
                                { field: 'metadata.email', label: 'User' },
                                { field: 'metadata.action', label: 'Action' }
                            ].map(({ field, label }) => (
                                <th
                                    key={field}
                                    onClick={() => handleSort(field)}
                                    className="px-4 py-3 text-left text-sm font-medium text-gray-600 cursor-pointer 
                    hover:bg-gray-100"
                                >
                                    <div className="flex items-center gap-1">
                                        {label}
                                        {filters.sortBy === field && (
                                            filters.sortOrder === 'asc' ?
                                                <ChevronUp className="w-4 h-4" /> :
                                                <ChevronDown className="w-4 h-4" />
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {logs.map((log) => (
                                <React.Fragment key={log._id}>
                                    <motion.tr
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                                        onClick={() => toggleRow(log._id)}
                                    >
                                        <td className="px-4 py-3">
                                            <ChevronDown
                                                className={`w-4 h-4 transform transition-transform
                          ${expandedRows[log._id] ? 'rotate-180' : ''}`}
                                            />
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {format(new Date(log.timestamp), 'MMM d, yyyy HH:mm:ss')}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs 
                        font-medium rounded-full ${levelStyles[log.level]}`}>
                                                {levelIcons[log.level]}
                                                {log.level.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900">{log.message}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{log.metadata.email}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{log.metadata.action}</td>
                                    </motion.tr>

                                    {/* Expanded Details */}
                                    <AnimatePresence>
                                        {expandedRows[log._id] && (
                                            <motion.tr
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                            >
                                                <td colSpan={6}>
                                                    <div className="p-4 bg-gray-50">
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <h4 className="text-sm font-medium text-gray-900 mb-2">
                                                                    Request Details
                                                                </h4>
                                                                <div className="space-y-2 text-sm text-gray-600">
                                                                    <p>Session ID: {log.metadata.sessionId}</p>
                                                                    <p>IP Address: {log.metadata.ipAddress}</p>
                                                                    <p>User Agent: {log.metadata.userAgent}</p>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <h4 className="text-sm font-medium text-gray-900 mb-2">
                                                                    Additional Data
                                                                </h4>
                                                                <pre className="text-sm text-gray-600 whitespace-pre-wrap">
                                                                    {JSON.stringify(log.metadata.details, null, 2)}
                                                                </pre>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        )}
                                    </AnimatePresence>
                                </React.Fragment>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>

                {/* Loading State */}
                <AnimatePresence>
                    {loading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center"
                        >
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 rounded-full border-4 border-blue-500 
                  border-t-transparent animate-spin" />
                                <p className="mt-4 text-sm text-gray-500">Loading logs...</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Empty State */}
                {!loading && logs.length === 0 && (
                    <div className="p-8 text-center">
                        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No logs found</h3>
                        <p className="text-sm text-gray-500">
                            Try adjusting your filters or search criteria
                        </p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <select
                            value={filters.limit}
                            onChange={(e) => onFilterChange({ limit: Number(e.target.value) })}
                            className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 
                focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="10">10 per page</option>
                            <option value="25">25 per page</option>
                            <option value="50">50 per page</option>
                            <option value="100">100 per page</option>
                        </select>

                        <span className="text-sm text-gray-500">
                            Showing {((metadata.page - 1) * metadata.limit) + 1} to{' '}
                            {Math.min(metadata.page * metadata.limit, metadata.total)} of{' '}
                            {metadata.total} entries
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            disabled={metadata.page === 1}
                            onClick={() => onFilterChange({ page: metadata.page - 1 })}
                            className={`px-4 py-2 rounded-lg transition-colors
                ${metadata.page === 1
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            Previous
                        </button>

                        <div className="flex items-center gap-1">
                            {getPageNumbers().map((pageNum, index) => (
                                pageNum === -1 ? (
                                    <span key={`ellipsis-${index}`} className="px-2">...</span>
                                ) : (
                                    <button
                                        key={pageNum}
                                        onClick={() => onFilterChange({ page: pageNum })}
                                        className={`w-8 h-8 rounded-lg text-sm transition-colors
                      ${metadata.page === pageNum
                                                ? 'bg-blue-500 text-white'
                                                : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                )
                            ))}
                        </div>

                        <button
                            disabled={metadata.page === metadata.totalPages}
                            onClick={() => onFilterChange({ page: metadata.page + 1 })}
                            className={`px-4 py-2 rounded-lg transition-colors
                ${metadata.page === metadata.totalPages
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogsTable;