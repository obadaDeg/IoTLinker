/**
 * useDevices Hook
 * React hook for device management operations
 */

import { useState, useEffect, useCallback } from 'react';
import { DeviceService } from '@/services/deviceService';
import type {
  Device,
  DeviceListResponse,
  DeviceFilters,
  DeviceCreate,
  DeviceUpdate,
  DeviceCredentials,
} from '@/types/device';

interface UseDevicesOptions {
  filters: DeviceFilters;
  autoFetch?: boolean;
}

export function useDevices(options: UseDevicesOptions) {
  const { filters, autoFetch = true } = options;

  const [devices, setDevices] = useState<Device[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDevices = useCallback(async () => {
    setLoading(true);
    setError(null);

    const response = await DeviceService.listDevices(filters);

    if (response.error) {
      setError(response.error);
      setDevices([]);
    } else if (response.data) {
      setDevices(response.data.devices);
      setTotal(response.data.total);
      setTotalPages(response.data.total_pages);
    }

    setLoading(false);
  }, [
    filters.tenant_id,
    filters.status,
    filters.device_type_id,
    filters.search,
    filters.page,
    filters.page_size,
  ]);

  useEffect(() => {
    if (autoFetch) {
      fetchDevices();
    }
  }, [autoFetch, fetchDevices]);

  const createDevice = async (device: DeviceCreate): Promise<DeviceCredentials | null> => {
    setLoading(true);
    setError(null);

    const response = await DeviceService.createDevice(device);

    setLoading(false);

    if (response.error) {
      setError(response.error);
      return null;
    }

    // Refresh device list after creation
    await fetchDevices();
    return response.data || null;
  };

  const updateDevice = async (
    deviceId: string,
    updates: DeviceUpdate
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    const response = await DeviceService.updateDevice(deviceId, updates);

    setLoading(false);

    if (response.error) {
      setError(response.error);
      return false;
    }

    // Refresh device list after update
    await fetchDevices();
    return true;
  };

  const deleteDevice = async (deviceId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    const response = await DeviceService.deleteDevice(deviceId);

    setLoading(false);

    if (response.error) {
      setError(response.error);
      return false;
    }

    // Refresh device list after deletion
    await fetchDevices();
    return true;
  };

  return {
    devices,
    total,
    totalPages,
    loading,
    error,
    refetch: fetchDevices,
    createDevice,
    updateDevice,
    deleteDevice,
  };
}
