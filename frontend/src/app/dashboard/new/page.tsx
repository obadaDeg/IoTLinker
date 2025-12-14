'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DeviceService } from '@/services/deviceService';
import { useChannels } from '@/components/hooks/useChannels';
import type { DeviceCreate } from '@/types/device';

// Demo tenant ID
const TENANT_ID = '10000000-0000-0000-0000-000000000001';

export default function NewDevicePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<DeviceCreate> & { tenant_id: string; name: string }>({
    tenant_id: TENANT_ID,
    name: '',
    description: '',
    status: 'offline',
    channel_id: searchParams.get('channel_id') || undefined,
  });

  // Fetch available channels
  const { channels } = useChannels({
    filters: {
      tenant_id: TENANT_ID,
      page: 1,
      page_size: 100,
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate that channel_id is selected
    if (!formData.channel_id) {
      setError('Please select a channel for this device');
      setLoading(false);
      return;
    }

    const response = await DeviceService.createDevice(formData as DeviceCreate);

    if (response.error) {
      setError(response.error);
      setLoading(false);
    } else if (response.data) {
      // Device created successfully, redirect to device detail page
      router.push(`/dashboard/${response.data.device_id}`);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-blue-600 hover:text-blue-700 font-medium mb-4 inline-flex items-center gap-2"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Create New Device</h1>
          <p className="text-gray-600 mt-1">Add a new IoT device to your infrastructure</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Device Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Device Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Temperature Sensor - Building A"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Optional description of the device"
              />
            </div>

            {/* Channel Selection */}
            <div>
              <label htmlFor="channel_id" className="block text-sm font-semibold text-gray-700 mb-2">
                Channel <span className="text-red-500">*</span>
              </label>
              <select
                id="channel_id"
                name="channel_id"
                required
                value={formData.channel_id || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">-- Select a Channel --</option>
                {channels.map((channel) => (
                  <option key={channel.id} value={channel.id}>
                    {channel.icon || '📦'} {channel.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Every device must belong to a channel (e.g., Farm, Server Room, Building)
              </p>
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-2">
                Initial Status *
              </label>
              <select
                id="status"
                name="status"
                required
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="online">✅ Online</option>
                <option value="offline">⚫ Offline</option>
                <option value="warning">⚠️ Warning</option>
                <option value="error">❌ Error</option>
                <option value="maintenance">🔧 Maintenance</option>
              </select>
            </div>

            {/* Device Type ID (Optional) */}
            <div>
              <label htmlFor="device_type_id" className="block text-sm font-semibold text-gray-700 mb-2">
                Device Type ID
              </label>
              <input
                type="text"
                id="device_type_id"
                name="device_type_id"
                value={formData.device_type_id || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Optional device type identifier"
              />
            </div>

            {/* Location */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="latitude" className="block text-sm font-semibold text-gray-700 mb-2">
                  Latitude
                </label>
                <input
                  type="number"
                  id="latitude"
                  name="latitude"
                  step="any"
                  value={formData.location?.latitude || ''}
                  onChange={(e) => {
                    const value = e.target.value ? parseFloat(e.target.value) : undefined;
                    setFormData(prev => ({
                      ...prev,
                      location: {
                        ...prev.location,
                        latitude: value,
                      } as any,
                    }));
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 40.7128"
                />
              </div>
              <div>
                <label htmlFor="longitude" className="block text-sm font-semibold text-gray-700 mb-2">
                  Longitude
                </label>
                <input
                  type="number"
                  id="longitude"
                  name="longitude"
                  step="any"
                  value={formData.location?.longitude || ''}
                  onChange={(e) => {
                    const value = e.target.value ? parseFloat(e.target.value) : undefined;
                    setFormData(prev => ({
                      ...prev,
                      location: {
                        ...prev.location,
                        longitude: value,
                      } as any,
                    }));
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., -74.0060"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating...
                  </span>
                ) : (
                  '✨ Create Device'
                )}
              </button>
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                disabled={loading}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </form>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">📝 Note</h3>
            <p className="text-sm text-blue-800">
              After creating the device, you'll receive a unique <strong>device_key</strong> and <strong>api_key</strong>.
              Make sure to save these credentials securely - they won't be shown again!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
