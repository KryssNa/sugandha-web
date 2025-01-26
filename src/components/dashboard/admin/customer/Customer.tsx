"use client"
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
    deleteUser,
    fetchAllUsers,
    fetchUserById,
    setCurrentPage,
    setLimit    
} from "@/store/slices/userSlice";
import { ChevronDown, ChevronUp, Edit, Eye, Filter, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    contact?: string;
}

export const UsersTable: React.FC = () => {
    const dispatch = useAppDispatch();
    const {
        users,
        loading,
        totalUsers,
        currentPage,
        limit
    } = useAppSelector(state => state.user);

    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [sortConfig, setSortConfig] = useState<{
        key: keyof User;
        direction: 'asc' | 'desc';
    } | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<{
        firstName: string;
        lastName: string;
        email: string;
        role: string;
        contact: string;
    }>({
        firstName: '',
        lastName: '',
        email: '',
        role: '',
        contact: ''
    });

    useEffect(() => {
        dispatch(fetchAllUsers({ page: currentPage, limit }));
    }, [dispatch, currentPage, limit]);

    const handleSort = (key: keyof User) => {
        setSortConfig(current => {
            if (!current || current.key !== key) {
                return { key, direction: 'asc' };
            }
            if (current.direction === 'asc') {
                return { key, direction: 'desc' };
            }
            return null;
        });
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedUsers(users.map(user => user.id));
        } else {
            setSelectedUsers([]);
        }
    };

    const handleSelectUser = (userId: string, checked: boolean) => {
        if (checked) {
            setSelectedUsers(prev => [...prev, userId]);
        } else {
            setSelectedUsers(prev => prev.filter(id => id !== userId));
        }
    };

    const handlePageChange = (newPage: number) => {
        dispatch(setCurrentPage(newPage));
    };

    const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(setLimit(Number(event.target.value)));
    };

    const getRoleBadgeStyle = (role: string) => {
        switch (role.toLowerCase()) {
            case 'admin':
                return 'bg-gray-100 text-gray-800';
            case 'user':
                return 'bg-blue-100 text-blue-800';
            case 'guest':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getSortIcon = (key: keyof User) => {
        if (sortConfig?.key !== key) {
            return <ChevronDown className="w-4 h-4 text-gray-400" />;
        }
        return sortConfig.direction === 'asc'
            ? <ChevronUp className="w-4 h-4 text-gray-900" />
            : <ChevronDown className="w-4 h-4 text-gray-900" />;
    };

    return (
        <div className="w-full bg-white rounded-lg shadow">
            {/* Table Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <h2 className="text-lg font-semibold text-gray-900">Users</h2>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`p-2 rounded-lg ${showFilters ? 'bg-gray-100' : ''}`}
                    >
                        <Filter className="w-5 h-5 text-gray-500" />
                    </button>
                </div>
                <div className="flex items-center space-x-2">
                    <select
                        value={limit}
                        onChange={handlePageSizeChange}
                        className="border border-gray-300 rounded-lg px-2 py-1"
                    >
                        <option value={10}>10 per page</option>
                        <option value={20}>20 per page</option>
                        <option value={50}>50 per page</option>
                    </select>
                </div>
            </div>

            {/* Filters */}
            {showFilters && (
                <div className="p-4 border-b border-gray-200 grid grid-cols-5 gap-4">
                    {Object.keys(filters).map((key) => (
                        <input
                            key={key}
                            type="text"
                            placeholder={`Filter ${key}...`}
                            value={filters[key as keyof typeof filters]}
                            onChange={(e) => setFilters(prev => ({
                                ...prev,
                                [key]: e.target.value
                            }))}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        />
                    ))}
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left">
                                <input
                                    type="checkbox"
                                    checked={selectedUsers.length === users.length}
                                    onChange={(e) => handleSelectAll(e.target.checked)}
                                    className="rounded border-gray-300"
                                />
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                                onClick={() => handleSort('firstName')}
                            >
                                <div className="flex items-center space-x-1">
                                    <span>First Name</span>
                                    {getSortIcon('firstName')}
                                </div>
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                                onClick={() => handleSort('lastName')}
                            >
                                <div className="flex items-center space-x-1">
                                    <span>Last Name</span>
                                    {getSortIcon('lastName')}
                                </div>
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                                onClick={() => handleSort('email')}
                            >
                                <div className="flex items-center space-x-1">
                                    <span>Email</span>
                                    {getSortIcon('email')}
                                </div>
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                                onClick={() => handleSort('role')}
                            >
                                <div className="flex items-center space-x-1">
                                    <span>Role</span>
                                    {getSortIcon('role')}
                                </div>
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                                onClick={() => handleSort('contact')}
                            >
                                <div className="flex items-center space-x-1">
                                    <span>Contact</span>
                                    {getSortIcon('contact')}
                                </div>
                            </th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedUsers.includes(user.id)}
                                        onChange={(e) => handleSelectUser(user.id, e.target.checked)}
                                        className="rounded border-gray-300"
                                    />
                                </td>
                                <td className="px-6 py-4">{user.firstName}</td>
                                <td className="px-6 py-4">{user.lastName}</td>
                                <td className="px-6 py-4">{user.email}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeStyle(user.role)}`}>
                                        {user.role?.toLowerCase() || 'undefined'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">{user.contact || 'undefined'}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                        <button
                                            onClick={() => dispatch(fetchUserById(user.id))}
                                            className="p-1 hover:bg-gray-100 rounded"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                            className="p-1 hover:bg-gray-100 rounded"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => dispatch(deleteUser(user.id))}
                                            className="p-1 hover:bg-red-100 rounded text-red-600"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <span className="text-sm text-gray-700">
                    Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalUsers)} of {totalUsers} results
                </span>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border rounded-lg disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="px-3 py-1 bg-gray-100 rounded-lg">{currentPage}</span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage * limit >= totalUsers}
                        className="px-3 py-1 border rounded-lg disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};