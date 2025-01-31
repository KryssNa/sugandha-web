// types/logs.types.ts
export interface LogMetadata {
  email: string;
  sessionId: string;
  action: string;
  ipAddress: string;
  userAgent: string;
  details: {
    body: Record<string, any>;
    params: Record<string, any>;
    query: Record<string, any>;
  };
  timestamp: string;
}

export interface Log {
  _id: string;
  timestamp: string;
  level: 'info' | 'error' | 'warn' | 'debug';
  message: string;
  metadata: LogMetadata;
}

export interface LogsResponse {
  data: Log[];
  metadata: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface LogFilters {
  startDate?: string;
  endDate?: string;
  level?: string;
  email?: string;
  search?: string;
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}