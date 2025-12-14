/**
 * Space/Group type definitions
 * Spaces organize multiple devices together (similar to ThingSpeak channels)
 */

export interface Space {
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

export interface SpaceCreate {
  tenant_id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  metadata?: Record<string, any>;
}

export interface SpaceUpdate {
  name?: string;
  description?: string;
  icon?: string;
  color?: string;
  metadata?: Record<string, any>;
}

export interface SpaceListResponse {
  spaces: Space[];
  total: number;
  page: number;
  page_size: number;
}

export interface SpaceFilters {
  tenant_id: string;
  search?: string;
  page?: number;
  page_size?: number;
}

// Predefined color themes for spaces
export const SPACE_COLORS = {
  green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', badge: 'bg-green-100' },
  blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', badge: 'bg-blue-100' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-800', badge: 'bg-purple-100' },
  orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-800', badge: 'bg-orange-100' },
  red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', badge: 'bg-red-100' },
  yellow: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800', badge: 'bg-yellow-100' },
  indigo: { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-800', badge: 'bg-indigo-100' },
  pink: { bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-800', badge: 'bg-pink-100' },
} as const;

export type SpaceColor = keyof typeof SPACE_COLORS;

// Default icons for spaces
export const DEFAULT_SPACE_ICONS = [
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
] as const;
