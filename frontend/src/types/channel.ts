/**
 * Channel type definitions
 * Channels organize multiple devices together (similar to ThingSpeak channels)
 */

export interface Channel {
  id: string;
  tenant_id: string;
  name: string;
  description?: string;
  icon?: string; // emoji or icon identifier
  color?: string; // color theme
  metadata?: Record<string, any>;
  created_by?: string;
  created_at: string;
  updated_at: string;

  // Computed fields (from joins)
  device_count?: number;
  online_count?: number;
}

export interface ChannelCreate {
  tenant_id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  metadata?: Record<string, any>;
}

export interface ChannelUpdate {
  name?: string;
  description?: string;
  icon?: string;
  color?: string;
  metadata?: Record<string, any>;
}

export interface ChannelListResponse {
  channels: Channel[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface ChannelFilters {
  tenant_id: string;
  search?: string;
  page?: number;
  page_size?: number;
}

// Predefined color themes for channels
export const CHANNEL_COLORS = {
  green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', badge: 'bg-green-100' },
  blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', badge: 'bg-blue-100' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-800', badge: 'bg-purple-100' },
  orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-800', badge: 'bg-orange-100' },
  red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', badge: 'bg-red-100' },
  yellow: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800', badge: 'bg-yellow-100' },
  indigo: { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-800', badge: 'bg-indigo-100' },
  pink: { bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-800', badge: 'bg-pink-100' },
  gray: { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-800', badge: 'bg-gray-100' },
} as const;

export type ChannelColor = keyof typeof CHANNEL_COLORS;

// Default icons for channels
export const DEFAULT_CHANNEL_ICONS = [
  '🌾', // Farm
  '💻', // Server Room
  '🏢', // Building
  '🏭', // Manufacturing
  '🏠', // Home
  '🏥', // Healthcare
  '🏫', // Education
  '🏪', // Retail
  '🚗', // Transportation
  '⚡', // Energy
  '💧', // Water
  '🌡️', // Temperature
  '📦', // Uncategorized
] as const;
