'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DeviceService } from '@/services/deviceService';
import type { Device } from '@/types/device';

// Demo tenant ID
const TENANT_ID = '10000000-0000-0000-0000-000000000001';

export default function DeviceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [device, setDevice] = useState<Device | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDevice = async () => {
      setLoading(true);
      setError(null);

      const response = await DeviceService.getDevice(resolvedParams.id, TENANT_ID);

      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        setDevice(response.data);
      }

      setLoading(false);
    };

    fetchDevice();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600">Loading device details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !device) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl">
              <div className="flex items-center gap-3 mb-3">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-red-900">Error Loading Device</h3>
              </div>
              <p className="text-red-700 mb-4">{error || 'Device not found'}</p>
              <button
                onClick={() => router.push('/dashboard')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                ← Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statusColors = {
    online: 'bg-green-100 text-green-800 border-green-200',
    offline: 'bg-gray-100 text-gray-800 border-gray-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    error: 'bg-red-100 text-red-800 border-red-200',
    maintenance: 'bg-blue-100 text-blue-800 border-blue-200',
  };

  const statusEmojis = {
    online: '✅',
    offline: '⚫',
    warning: '⚠️',
    error: '❌',
    maintenance: '🔧',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-blue-600 hover:text-blue-700 font-medium mb-4 inline-flex items-center gap-2"
          >
            ← Back to Dashboard
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{device.name}</h1>
              {device.description && (
                <p className="text-gray-600 mt-1">{device.description}</p>
              )}
            </div>
            <div className={`px-4 py-2 rounded-lg border-2 font-semibold ${statusColors[device.status]}`}>
              {statusEmojis[device.status]} {device.status.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Device Information */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Device Information</h2>
            <div className="space-y-3">
              <InfoRow label="Device ID" value={device.id} />
              <InfoRow label="Device Key" value={device.device_key} mono />
              {device.device_type_id && <InfoRow label="Device Type ID" value={device.device_type_id} />}
              {device.location?.latitude && device.location?.longitude && (
                <InfoRow
                  label="Location"
                  value={`${device.location.latitude}, ${device.location.longitude}`}
                />
              )}
              <InfoRow
                label="Created At"
                value={new Date(device.created_at).toLocaleString()}
              />
              <InfoRow
                label="Updated At"
                value={new Date(device.updated_at).toLocaleString()}
              />
              {device.last_seen_at && (
                <InfoRow
                  label="Last Seen"
                  value={new Date(device.last_seen_at).toLocaleString()}
                />
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Metadata</h2>
            {device.metadata && Object.keys(device.metadata).length > 0 ? (
              <div className="space-y-2">
                {Object.entries(device.metadata).map(([key, value]) => (
                  <div key={key} className="border-b border-gray-100 pb-2 last:border-0">
                    <div className="text-sm font-semibold text-gray-700">{key}</div>
                    <div className="text-sm text-gray-600">{JSON.stringify(value)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No metadata available</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Actions</h2>
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              📊 View Analytics
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              ✏️ Edit Device
            </button>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              🗑️ Delete Device
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between items-start border-b border-gray-100 pb-2">
      <span className="text-sm font-semibold text-gray-700">{label}:</span>
      <span className={`text-sm text-gray-900 ${mono ? 'font-mono' : ''} max-w-md text-right break-all`}>
        {value}
      </span>
    </div>
  );
}
