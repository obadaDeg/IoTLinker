/**
 * Device Service
 * API service layer for device management operations
 */

import { apiClient, ApiResponse } from '@/lib/api';
import type {
  Device,
  DeviceCreate,
  DeviceUpdate,
  DeviceCredentials,
  DeviceListResponse,
  DeviceType,
  DeviceFilters,
  DeviceDataBatch,
  DeviceDataResponse,
} from '@/types/device';

export class DeviceService {
  /**
   * List devices with optional filtering and pagination
   */
  static async listDevices(
    filters: DeviceFilters
  ): Promise<ApiResponse<DeviceListResponse>> {
    return apiClient.get<DeviceListResponse>('/api/v1/devices/', filters);
  }

  /**
   * Get a single device by ID
   */
  static async getDevice(deviceId: string): Promise<ApiResponse<Device>> {
    return apiClient.get<Device>(`/api/v1/devices/${deviceId}`);
  }

  /**
   * Create a new device
   */
  static async createDevice(
    device: DeviceCreate
  ): Promise<ApiResponse<DeviceCredentials>> {
    return apiClient.post<DeviceCredentials>('/api/v1/devices/', device);
  }

  /**
   * Update an existing device
   */
  static async updateDevice(
    deviceId: string,
    updates: DeviceUpdate
  ): Promise<ApiResponse<Device>> {
    return apiClient.put<Device>(`/api/v1/devices/${deviceId}`, updates);
  }

  /**
   * Delete a device
   */
  static async deleteDevice(deviceId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/api/v1/devices/${deviceId}`);
  }

  /**
   * List all available device types
   */
  static async listDeviceTypes(): Promise<ApiResponse<DeviceType[]>> {
    return apiClient.get<DeviceType[]>('/api/v1/devices/types/list');
  }

  /**
   * Ingest sensor data for a device
   */
  static async ingestDeviceData(
    deviceId: string,
    data: DeviceDataBatch
  ): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`/api/v1/devices/${deviceId}/data`, data);
  }

  /**
   * Query device sensor data
   */
  static async getDeviceData(
    deviceId: string,
    params?: {
      metric_name?: string;
      start_time?: string;
      end_time?: string;
      limit?: number;
    }
  ): Promise<ApiResponse<DeviceDataResponse[]>> {
    return apiClient.get<DeviceDataResponse[]>(
      `/api/v1/devices/${deviceId}/data`,
      params
    );
  }
}
