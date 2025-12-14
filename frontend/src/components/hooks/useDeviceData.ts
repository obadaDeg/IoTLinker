/**
 * useDeviceData Hook
 * React hook for fetching and managing device sensor data
 */

import { useState, useEffect, useCallback } from 'react';
import { DeviceService } from '@/services/deviceService';
import type { DeviceDataResponse } from '@/types/device';

interface UseDeviceDataOptions {
  deviceId: string;
  metricName?: string;
  limit?: number;
  autoFetch?: boolean;
  refreshInterval?: number; // in milliseconds
}

export function useDeviceData(options: UseDeviceDataOptions) {
  const {
    deviceId,
    metricName,
    limit = 100,
    autoFetch = true,
    refreshInterval,
  } = options;

  const [data, setData] = useState<DeviceDataResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!deviceId) return;

    setLoading(true);
    setError(null);

    const response = await DeviceService.getDeviceData(deviceId, {
      metric_name: metricName,
      limit,
    });

    if (response.error) {
      setError(response.error);
      setData([]);
    } else if (response.data) {
      setData(response.data);
    }

    setLoading(false);
  }, [deviceId, metricName, limit]);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, fetchData]);

  // Auto-refresh interval
  useEffect(() => {
    if (!refreshInterval || !autoFetch) return;

    const intervalId = setInterval(fetchData, refreshInterval);

    return () => clearInterval(intervalId);
  }, [refreshInterval, autoFetch, fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}
