/**
 * Device Type Definitions
 * Matching the backend Pydantic models
 */

export type DeviceStatus = 'online' | 'offline' | 'warning' | 'error' | 'maintenance';

export interface Location {
  latitude?: number;
  longitude?: number;
  address?: string;
}

export interface Device {
  id: string;
  tenant_id: string;
  device_type_id?: string;
  channel_id?: string; // Channel assignment
  name: string;
  description?: string;
  device_key: string;
  status: DeviceStatus;
  location?: Location;
  metadata?: Record<string, any>;
  configuration?: Record<string, any>;
  firmware_version?: string;
  last_seen?: string;
  last_ip_address?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;

  // Computed fields (from joins)
  channel_name?: string;
}

export interface DeviceCreate {
  name: string;
  description?: string;
  tenant_id: string;
  device_type_id?: string;
  channel_id: string; // Required channel assignment - every device must belong to a channel
  location?: Location;
  metadata?: Record<string, any>;
  configuration?: Record<string, any>;
  firmware_version?: string;
  status?: DeviceStatus;
}

export interface DeviceUpdate {
  name?: string;
  description?: string;
  device_type_id?: string;
  location?: Location;
  metadata?: Record<string, any>;
  configuration?: Record<string, any>;
  status?: DeviceStatus;
  firmware_version?: string;
}

export interface DeviceCredentials {
  device_id: string;
  device_key: string;
  device_secret: string;
  mqtt_endpoint?: string;
}

export interface DeviceListResponse {
  devices: Device[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface DeviceDataPoint {
  metric_name: string;
  value: number;
  unit?: string;
  metadata?: Record<string, any>;
  quality_score?: number;
}

export interface DeviceDataBatch {
  device_id: string;
  device_key: string;
  data: DeviceDataPoint[];
  timestamp?: string;
}

export interface DeviceDataResponse {
  device_id: string;
  metric_name: string;
  value: number;
  unit?: string;
  time: string;
  quality_score: number;
}

export interface DeviceType {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  default_configuration: Record<string, any>;
  sensor_schema: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface DeviceFilters {
  tenant_id: string;
  status?: DeviceStatus;
  device_type_id?: string;
  space_id?: string; // Filter by space
  search?: string;
  page?: number;
  page_size?: number;
}
