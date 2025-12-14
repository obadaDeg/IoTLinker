/**
 * DeviceList Component
 * Displays a grid of device cards with loading and error states
 */

import React from 'react';
import { DeviceCard } from './DeviceCard';
import type { Device } from '@/types/device';

interface DeviceListProps {
  devices: Device[];
  loading?: boolean;
  error?: string | null;
  onDeviceClick?: (device: Device) => void;
}

export function DeviceList({ devices, loading, error, onDeviceClick }: DeviceListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading devices...</p>
        </div>
      </div>
    );
  }

  if (error) {
    const isConnectionError = error.toLowerCase().includes('fetch') || error.toLowerCase().includes('network');

    return (
      <div className="flex items-center justify-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl">
          <div className="flex items-center gap-3 mb-3">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-red-900">
              {isConnectionError ? 'Cannot Connect to Backend' : 'Error Loading Devices'}
            </h3>
          </div>
          <p className="text-red-700 mb-3">{error}</p>

          {isConnectionError && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
              <p className="font-semibold text-yellow-900 mb-2">Quick Fix:</p>
              <ol className="list-decimal list-inside space-y-1 text-yellow-800">
                <li>Start Docker Desktop</li>
                <li>Run: <code className="bg-yellow-100 px-1 rounded">npx supabase start</code></li>
                <li>Run: <code className="bg-yellow-100 px-1 rounded">cd backend && ./venv/Scripts/python.exe -m uvicorn main:app --host 127.0.0.1 --port 8000</code></li>
              </ol>
              <p className="mt-2 text-yellow-700">
                See <a href="/NEXT_STEPS.md" className="underline font-semibold">NEXT_STEPS.md</a> for detailed instructions.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (devices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Devices Found</h3>
        <p className="text-gray-600 text-center max-w-md">
          No devices match your current filters. Try adjusting your search or create a new device.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {devices.map((device) => (
        <DeviceCard key={device.id} device={device} onClick={onDeviceClick} />
      ))}
    </div>
  );
}
