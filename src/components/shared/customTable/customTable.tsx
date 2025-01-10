import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowUpDown,
    ChevronDown,
    ChevronUp,
    Edit,
    Eye,
    Filter,
    MoreHorizontal,
    Trash2,
    XCircle
} from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pagination } from '../pagination/customPagination';

// Types
export interface Column<T> {
    key: string;
    title: string;
    render?: (value: any, row: T) => React.ReactNode;
    sortable?: boolean;
    filterable?: boolean;
    width?: string;
    align?: 'left' | 'center' | 'right';
    className?: string;
    isImage?: boolean;
}

export interface TableProps<T> {
    data: T[];
    columns: Column<T>[];
    isLoading?: boolean;
    emptyMessage?: string;
    className?: string;
    rowClassName?: string | ((row: T) => string);
    onRowClick?: (row: T) => void;
    selectable?: boolean;
    onSelectionChange?: (selectedRows: T[]) => void;
    actions?: TableAction<T>[];
    pagination?: {
        currentPage: number;
        totalItems: number;
        pageSize: number;
        onPageChange: (page: number) => void;
        onPageSizeChange?: (pageSize: number) => void;
    };
    sortable?: boolean;
    filterable?: boolean;
    stickyHeader?: boolean;
    virtualized?: boolean;
    expandable?: {
        render: (row: T) => React.ReactNode;
        onExpand?: (row: T) => void;
    };
}

interface TableAction<T> {
    icon?: React.ReactNode;
    label: string;
    onClick: (row: T) => void;
    className?: string;
    show?: (row: T) => boolean;
    disabled?: (row: T) => boolean;
}

// Enhanced Action Menu Component
const ActionMenu = <T extends {}>({
    actions,
    row,
    onClose
}: {
    actions: TableAction<T>[];
    row: T;
    onClose: () => void;
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 
          py-1 z-10 overflow-hidden"
        >
            {actions
                .filter(action => !action.show || action.show(row))
                .map((action, index) => (
                    <motion.button
                        key={index}
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className={`w-full px-4 py-2.5 text-sm text-left hover:bg-gray-50
                flex items-center gap-2 ${action.className || ''}
                ${action.disabled?.(row) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-50'}
                ${index > 0 ? 'border-t border-gray-100' : ''}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!action.disabled?.(row)) {
                                action.onClick(row);
                            }
                            onClose();
                        }}
                        disabled={action.disabled?.(row)}
                    >
                        <span className={`${action.className?.includes('text-') ? '' : 'text-gray-400'}`}>
                            {action.icon}
                        </span>
                        <span className={action.className || 'text-gray-700'}>
                            {action.label}
                        </span>
                    </motion.button>
                ))}
        </motion.div>
    );
};

// Enhanced Cell Renderer
const TableCell = <T extends {}>({
    column,
    value,
    row
}: {
    column: Column<T>;
    value: any;
    row: T;
}) => {
    if (column.isImage) {
        return (
            <div className="w-10 h-10 rounded-full overflow-hidden">
                <img
                    src={value}
                    alt="thumbnail"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.currentTarget.src = '/api/placeholder/40/40'; // Fallback image
                    }}
                />
            </div>
        );
    }

    if (column.render) {
        return column.render(value, row);
    }

    return String(value);
};

// Enhanced Table Header
const TableHeader = <T extends {}>({
    column,
    sortConfig,
    onSort,
    showFilters,
    onFilter,
}: {
    column: Column<T>;
    sortConfig: { key: string; direction: 'asc' | 'desc' } | null;
    onSort: (key: string) => void;
    showFilters: boolean;
    onFilter: (key: string, value: string) => void;
}) => {
    const [filterValue, setFilterValue] = useState('');

    return (
        <th
            className={`px-6 py-4 text-left text-sm font-semibold bg-gray-50/80 backdrop-blur-sm
          ${column.className || ''}`}
            style={{ width: column.width }}
        >
            <div className="flex items-center gap-2">
                <div
                    className={`flex items-center gap-2 ${column.sortable ? 'cursor-pointer group' : ''}`}
                    onClick={() => column.sortable && onSort(column.key)}
                >
                    <span className="text-gray-700">{column.title}</span>
                    {column.sortable && (
                        <div className="flex flex-col">
                            {sortConfig?.key === column.key ? (
                                sortConfig.direction === 'asc' ? (
                                    <ChevronUp className="w-4 h-4 text-orange-500" />
                                ) : (
                                    <ChevronDown className="w-4 h-4 text-orange-500" />
                                )
                            ) : (
                                <ArrowUpDown className="w-4 h-4 text-gray-300 group-hover:text-gray-400" />
                            )}
                        </div>
                    )}
                </div>
                {showFilters && column.filterable && (
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={filterValue}
                            onChange={(e) => {
                                setFilterValue(e.target.value);
                                onFilter(column.key, e.target.value);
                            }}
                            className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg
                  focus:outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100"
                            placeholder={`Filter ${column.title.toLowerCase()}...`}
                        />
                    </div>
                )}
            </div>
        </th>
    );
};


const TableRow = <T extends {}>({
    row,
    columns,
    isSelected,
    onSelect,
    actions,
    onRowClick,
    rowClassName,
    expandable,
    index,
}: {
    row: T;
    columns: Column<T>[];
    isSelected?: boolean;
    onSelect?: (row: T, selected: boolean) => void;
    actions?: TableAction<T>[];
    onRowClick?: (row: T) => void;
    rowClassName?: string | ((row: T) => string);
    expandable?: {
        render: (row: T) => React.ReactNode;
        onExpand?: (row: T) => void;
    };
    index: number;
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showActions, setShowActions] = useState(false);
    const actionMenuRef = useRef<HTMLDivElement>(null);

    // Close action menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
                setShowActions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleExpand = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsExpanded(!isExpanded);
        expandable?.onExpand?.(row);
    };

    const handleRowClick = (e: React.MouseEvent) => {
        // Don't trigger row click when clicking on actions or checkbox
        if (
            e.target instanceof Element &&
            (e.target.closest('[data-action-menu]') ||
                e.target.closest('[data-checkbox]'))
        ) {
            return;
        }
        onRowClick?.(row);
    };

    // Dynamic class names
    const baseClassName = typeof rowClassName === 'function' ? rowClassName(row) : rowClassName;
    const stripeClassName = index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50';
    const selectedClassName = isSelected ? 'bg-orange-50/70 hover:bg-orange-50/90' : 'hover:bg-gray-50/80';

    return (
        <>
            <motion.tr
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{
                    duration: 0.2,
                    delay: index * 0.05,
                    ease: "easeOut"
                }}
                className={`
            group transition-all duration-200
            ${stripeClassName}
            ${selectedClassName}
            ${baseClassName || ''}
            relative
          `}
                onClick={handleRowClick}
            >
                {/* Selection Checkbox */}
                {onSelect && (
                    <td className="w-12 px-6 py-4">
                        <div
                            className="flex items-center"
                            data-checkbox
                            onClick={e => e.stopPropagation()}
                        >
                            <motion.input
                                type="checkbox"
                                checked={isSelected}
                                onChange={e => onSelect(row, e.target.checked)}
                                className="
                    w-4 h-4 rounded 
                    border-gray-300 
                    text-orange-500 
                    focus:ring-2
                    focus:ring-orange-500/20
                    focus:border-orange-500
                    cursor-pointer
                    transition-all
                    duration-200
                  "
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            />
                        </div>
                    </td>
                )}

                {/* Expand Button */}
                {expandable && (
                    <td className="w-12 px-6 py-4">
                        <motion.button
                            onClick={handleExpand}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="
                  p-1.5 
                  rounded-full 
                  hover:bg-orange-100 
                  transition-colors 
                  duration-200
                "
                        >
                            <ChevronDown className={`
                  w-4 h-4 
                  transition-colors 
                  duration-200
                  ${isExpanded ? 'text-orange-500' : 'text-gray-400'}
                `} />
                        </motion.button>
                    </td>
                )}

                {/* Data Cells */}
                {columns.map((column, cellIndex) => (
                    <td
                        key={column.key}
                        className={`
                px-6 py-4 
                text-sm 
                transition-colors 
                duration-200
                ${column.align === 'right' ? 'text-right' :
                                column.align === 'center' ? 'text-center' : 'text-left'}
              `}
                    >
                        {column.isImage ? (
                            <div className="w-10 h-10 rounded-full overflow-hidden">
                                <motion.img
                                    src={(row as any)[column.key]}
                                    alt="thumbnail"
                                    className="w-full h-full object-cover"
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                    onError={(e) => {
                                        e.currentTarget.src = '/api/placeholder/40/40';
                                    }}
                                />
                            </div>
                        ) : column.render ? (
                            column.render((row as any)[column.key], row)
                        ) : (
                            String((row as any)[column.key])
                        )}
                    </td>
                ))}

                {/* Actions Menu */}
                {actions && actions.length > 0 && (
                    <td className="px-6 py-4 text-right">
                        <div className="relative" ref={actionMenuRef} data-action-menu>
                            <motion.button
                                onClick={() => setShowActions(!showActions)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="
                    p-2 
                    rounded-full 
                    hover:bg-orange-100 
                    opacity-0 
                    group-hover:opacity-100 
                    transition-all 
                    duration-200
                  "
                            >
                                <MoreHorizontal className="w-4 h-4 text-gray-500" />
                            </motion.button>

                            <AnimatePresence>
                                {showActions && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                        transition={{ duration: 0.15 }}
                                        className="
                        absolute 
                        right-0 
                        mt-2 
                        w-48 
                        bg-white 
                        rounded-lg 
                        shadow-xl 
                        border 
                        border-gray-100 
                        py-1 
                        z-50
                      "
                                    >
                                        {actions
                                            .filter(action => !action.show || action.show(row))
                                            .map((action, actionIndex) => (
                                                <motion.button
                                                    key={actionIndex}
                                                    initial={{ x: 20, opacity: 0 }}
                                                    animate={{ x: 0, opacity: 1 }}
                                                    transition={{ delay: actionIndex * 0.05 }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (!action.disabled?.(row)) {
                                                            action.onClick(row);
                                                            setShowActions(false);
                                                        }
                                                    }}
                                                    disabled={action.disabled?.(row)}
                                                    className={`
                              w-full 
                              px-4 
                              py-2.5 
                              text-sm 
                              text-left 
                              flex 
                              items-center 
                              gap-2
                              ${action.disabled?.(row)
                                                            ? 'opacity-50 cursor-not-allowed'
                                                            : 'hover:bg-orange-50'}
                              ${action.className || ''}
                              ${actionIndex > 0 ? 'border-t border-gray-100' : ''}
                            `}
                                                >
                                                    <span className={action.className?.includes('text-')
                                                        ? ''
                                                        : 'text-gray-400'
                                                    }>
                                                        {action.icon}
                                                    </span>
                                                    <span>{action.label}</span>
                                                </motion.button>
                                            ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </td>
                )}
            </motion.tr>

            {/* Expandable Content */}
            {isExpanded && expandable && (
                <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <td
                        colSpan={columns.length + (onSelect ? 2 : 1)}
                        className="
                px-6 
                py-4 
                bg-gray-50/50 
                border-y 
                border-gray-100
              "
                    >
                        {expandable.render(row)}
                    </td>
                </motion.tr>
            )}
        </>
    );
};

// Main Table Component
export const Table = <T extends {}>({
    data,
    columns,
    isLoading,
    emptyMessage = "No data available",
    className = '',
    rowClassName = '',
    onRowClick,
    selectable,
    onSelectionChange,
    actions,
    pagination,
    sortable = true,
    filterable = true,
    stickyHeader = false,
    expandable,
}: TableProps<T>) => {
    const [selectedRows, setSelectedRows] = useState<T[]>([]);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
    const [filters, setFilters] = useState<Record<string, string>>({});
    const [showFilters, setShowFilters] = useState(false);

    // Handle sorting
    const handleSort = (key: string) => {
        if (!sortable) return;

        setSortConfig((current) => {
            if (current?.key === key) {
                if (current.direction === 'asc') {
                    return { key, direction: 'desc' };
                }
                return null;
            }
            return { key, direction: 'asc' };
        });
    };

    // Handle filtering
    const handleFilter = (key: string, value: string) => {
        setFilters((current) => ({
            ...current,
            [key]: value,
        }));
    };

    // Process data with sorting and filtering
    const processedData = useMemo(() => {
        let result = [...data];

        // Apply filters
        Object.entries(filters).forEach(([key, value]) => {
            if (value) {
                result = result.filter((item) =>
                    String((item as any)[key])
                        .toLowerCase()
                        .includes(value.toLowerCase())
                );
            }
        });

        // Apply sorting
        if (sortConfig) {
            result.sort((a, b) => {
                const aValue = (a as any)[sortConfig.key];
                const bValue = (b as any)[sortConfig.key];

                if (aValue === bValue) return 0;

                const comparison = aValue > bValue ? 1 : -1;
                return sortConfig.direction === 'asc' ? comparison : -comparison;
            });
        }

        return result;
    }, [data, sortConfig, filters]);

    // Handle selection
    const handleSelectAll = (checked: boolean) => {
        const newSelected = checked ? processedData : [];
        setSelectedRows(newSelected);
        onSelectionChange?.(newSelected);
    };

    const handleSelectRow = (row: T, selected: boolean) => {
        const newSelected = selected
            ? [...selectedRows, row]
            : selectedRows.filter((r) => r !== row);
        setSelectedRows(newSelected);
        onSelectionChange?.(newSelected);
    };

    function handleRowClick(row: T): void {
        if (onRowClick) {
            onRowClick(row);
        }
    }
    function handleExpand(row: T): void {
        console.log("Row expanded", row);
    }
    return (
        <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${className}`}>
            {/* Table Controls */}
            {(filterable || sortable || selectable) && (
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {selectable && selectedRows.length > 0 && (
                            <span className="text-sm text-gray-600">
                                {selectedRows.length} items selected
                            </span>
                        )}
                        {filterable && (
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`px-3 py-1.5 text-sm border rounded-lg flex items-center gap-2
                  ${showFilters ? 'bg-orange-50 border-orange-200 text-orange-600' :
                                        'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                            >
                                <Filter className="w-4 h-4" />
                                Filters
                            </button>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Add your custom controls here */}
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className={`bg-gray-50 ${stickyHeader ? 'sticky top-0' : ''}`}>
                        <tr>
                            {selectable && (
                                <th className="w-12 px-6 py-3">
                                    <input
                                        type="checkbox"
                                        checked={selectedRows.length === processedData.length}
                                        onChange={(e) => handleSelectAll(e.target.checked)}
                                        title='Select All'
                                        className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500"
                                    />
                                </th>
                            )}
                            {expandable && <th className="w-12 px-6 py-3" />}
                            {columns.map((column) => (
                                <TableHeader
                                    key={column.key}
                                    column={column}
                                    sortConfig={sortConfig}
                                    onSort={handleSort}
                                    showFilters={showFilters}
                                    onFilter={handleFilter}
                                />
                            ))}
                            {actions && actions.length > 0 && (
                                <th className="w-12 px-6 py-3" />
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {isLoading ? (
                            <tr>
                                <td
                                    colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)}
                                    className="px-6 py-8 text-center"
                                >
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}

                                        className="w-6 h-6 border-2 border-orange-500 border-t-transparent 
                      rounded-full inline-block"
                                    />
                                    <span className="ml-2 text-gray-500">Loading...</span>
                                </td>
                            </tr>
                        ) : processedData.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)}
                                    className="px-6 py-8 text-center"
                                >
                                    <div className="flex flex-col items-center justify-center">
                                        <XCircle className="w-12 h-12 text-gray-400 mb-2" />
                                        <p className="text-gray-500">{emptyMessage}</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            <AnimatePresence>
                                {processedData.map((row, index) => (
                                    <TableRow
                                        key={1} // Preferably use a unique ID
                                        row={row}
                                        columns={columns}
                                        isSelected={selectedRows.includes(row)}
                                        onSelect={handleSelectRow}
                                        actions={actions}
                                        onRowClick={handleRowClick}
                                        rowClassName={rowClassName}
                                        expandable={{
                                            render: row => (
                                                <div className="space-y-2">
                                                    <h3 className="font-medium">Expanded Content</h3>
                                                    <p>Additional information about {(row as unknown as User).name}</p>
                                                </div>
                                            ),
                                            onExpand: handleExpand
                                        }}
                                        index={index}
                                    />
                                ))}
                            </AnimatePresence>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Updated Pagination */}
            {pagination && (
                <div className="px-6 py-4 border-t border-gray-100">
                    <Pagination
                        currentPage={pagination.currentPage}
                        totalItems={pagination.totalItems}
                        itemsPerPage={pagination.pageSize}
                        onPageChange={pagination.onPageChange}
                        onItemsPerPageChange={pagination.onPageSizeChange}
                        variant="detailed"
                        showItemsPerPage
                        className="justify-between"
                    />
                </div>
            )}
        </div>
    );
};

// Example Usage
interface User {
    id: number;
    name: string;
    email: string;
    status: 'active' | 'inactive';
    role: string;
    lastLogin: string;
}

export const TableExample: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

    const mockData: User[] = [
        {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            status: "active",
            role: "Admin",
            lastLogin: "2024-01-01"
        },
        {
            id: 2,
            name: "Jane Smith",
            email: "jane@example.com",
            status: "inactive",
            role: "User",
            lastLogin: "2024-01-02"
        },
        // Add more mock data as needed
    ];

    const columns: Column<User>[] = [
        {
            key: "name",
            title: "Name",
            sortable: true,
            filterable: true,
        },
        {
            key: "email",
            title: "Email",
            sortable: true,
            filterable: true,
        },
        {
            key: "status",
            title: "Status",
            sortable: true,
            render: (value) => (
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs
          ${value === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                >
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5
            ${value === 'active' ? 'bg-green-500' : 'bg-red-500'}`}
                    />
                    {value}
                </span>
            ),
        },
        {
            key: "role",
            title: "Role",
            sortable: true,
        },
        {
            key: "lastLogin",
            title: "Last Login",
            sortable: true,
            render: (value) => new Date(value).toLocaleDateString(),
        },
    ];

    const actions: TableAction<User>[] = [
        {
            icon: <Eye className="w-4 h-4" />,
            label: "View",
            onClick: (user) => console.log("View", user),
        },
        {
            icon: <Edit className="w-4 h-4" />,
            label: "Edit",
            onClick: (user) => console.log("Edit", user),
            show: (user) => user.status === 'active',
        },
        {
            icon: <Trash2 className="w-4 h-4" />,
            label: "Delete",
            onClick: (user) => console.log("Delete", user),
            className: "text-red-600 hover:bg-red-50",
            disabled: (user) => user.role === 'Admin',
        },
    ];

    return (
        <Table
            data={mockData}
            columns={columns}
            selectable
            onSelectionChange={setSelectedUsers}
            actions={actions}
            pagination={{
                currentPage,
                totalItems: mockData.length,
                pageSize,
                onPageChange: setCurrentPage,
                onPageSizeChange: setPageSize,
            }}
            expandable={{
                render: (user) => (
                    <div className="space-y-2">
                        <h3 className="font-medium">User Details</h3>
                        <p>Additional information about {user.name}</p>
                    </div>
                ),
            }}
            onRowClick={(user) => console.log("Row clicked", user)}
            rowClassName={(user) => user.status === 'inactive' ? 'opacity-60' : ''}
        />
    );
};