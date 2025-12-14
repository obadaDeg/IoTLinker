/**
 * DeviceCard Component
 * Displays a device in card format with status indicator
 */

import React from 'react';
import type { Device, DeviceStatus } from '@/types/device';
import { formatDistanceToNow } from '@/lib/utils';

interface DeviceCardProps {
  device: Device;
  onClick?: (device: Device) => void;
}

const statusColors: Record<DeviceStatus, string> = {
  online: 'bg-green-500',
  offline: 'bg-gray-400',
  warning: 'bg-yellow-500',
  error: 'bg-red-500',
  maintenance: 'bg-blue-500',
};

const statusLabels: Record<DeviceStatus, string> = {
  online: 'Online',
  offline: 'Offline',
  warning: 'Warning',
  error: 'Error',
  maintenance: 'Maintenance',
};

export function DeviceCard({ device, onClick }: DeviceCardProps) {
  return (
    <div
      onClick={() => onClick?.(device)}
      className={`bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {device.name}
          </h3>
          {device.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {device.description}
            </p>
          )}
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2 ml-4">
          <div className={`w-2.5 h-2.5 rounded-full ${statusColors[device.status]}`} />
          <span className="text-sm font-medium text-gray-700">
            {statusLabels[device.status]}
          </span>
        </div>
      </div>

      {/* Device Info */}
      <div className="space-y-2 text-sm">
        {/* Location */}
        {device.location?.address && (
          <div className="flex items-center text-gray-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{device.location.address}</span>
          </div>
        )}

        {/* Last Seen */}
        {device.last_seen && (
          <div className="flex items-center text-gray-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Last seen {formatDistanceToNow(device.last_seen)}</span>
          </div>
        )}

        {/* Firmware Version */}
        {device.firmware_version && (
          <div className="flex items-center text-gray-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
            <span>v{device.firmware_version}</span>
          </div>
        )}
      </div>

      {/* Metadata Tags */}
      {device.metadata && Object.keys(device.metadata).length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {Object.entries(device.metadata).slice(0, 3).map(([key, value]) => (
            <span
              key={key}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
            >
              {key}: {String(value)}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
