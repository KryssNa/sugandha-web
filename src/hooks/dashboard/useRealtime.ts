  // hooks/dashboard/useRealtime.ts
  import { DashboardData } from '@/components/layouts/dashboard/types/types';
import { useEffect } from 'react';
  
  export const useRealtimeUpdates = (onUpdate: (data: DashboardData) => void) => {
    useEffect(() => {
      const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080');
      
      const handleWebSocketError = (error: Event) => {
        console.error('WebSocket error:', error);
      };
  
      ws.onopen = () => {
        console.log('WebSocket connected');
        ws.send(JSON.stringify({ type: 'subscribe', channel: 'dashboard' }));
      };
  
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as DashboardData;
          onUpdate(data);
        } catch (error) {
          console.error('Error parsing WebSocket data:', error);
        }
      };
  
      ws.onerror = handleWebSocketError;
  
      return () => {
        ws.close();
      };
    }, [onUpdate]);
  };
  
 