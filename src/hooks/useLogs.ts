// hooks/use-logs.ts
import { useState, useCallback } from 'react';
import { api } from '@/lib/axios';
import type { Log, LogFilters, LogsResponse } from '@/types/logs.types';
import useToast from './useToast';

export const DEFAULT_FILTERS: LogFilters = {
  page: 1,
  limit: 10,
  sortBy: 'timestamp',
  sortOrder: 'desc',
  search: '',
  level: '',
  startDate: '',
  endDate: ''
};

export const useLogs = () => {
  const toast = useToast();
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<LogFilters>(DEFAULT_FILTERS);
  const [metadata, setMetadata] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1
  });

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Convert filters to query parameters
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });

      const response = await api.get<LogsResponse>(`/logs?${params.toString()}`);
      setLogs(response.data.data);
      setMetadata(response.data.metadata);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch logs';
      setError(message);
      toast('error', message);
    } finally {
      setLoading(false);
    }
  }, [filters, toast]);

  const handleFilterChange = (newFilters: Partial<LogFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: newFilters.page || 1
    }));
  };

  const exportLogs = async () => {
    try {
      const response = await api.get('/logs/export', {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `logs-${new Date().toISOString()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      toast('error', 'Failed to export logs');
    }
  };

  return {
    logs,
    loading,
    error,
    filters,
    metadata,
    fetchLogs,
    handleFilterChange,
    exportLogs
  };
};