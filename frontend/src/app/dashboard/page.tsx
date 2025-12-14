'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDevices } from '@/components/hooks/useDevices';
import type { Device } from '@/types/device';

const TENANT_ID = '10000000-0000-0000-0000-000000000001';

export default function DashboardPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);

  const { devices, total, loading, error } = useDevices({
    filters: {
      tenant_id: TENANT_ID,
      search: searchQuery || undefined,
      status: statusFilter || undefined,
      page: currentPage,
      page_size: 12,
    },
  });

  const stats = {
    total: total,
    online: devices.filter(d => d.status === 'online').length,
    offline: devices.filter(d => d.status === 'offline').length,
    warning: devices.filter(d => d.status === 'warning').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">IoTLinker</h1>
              <p className="text-sm text-slate-600">Enterprise IoT Management Platform</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/spaces')}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-medium"
              >
                📦 Spaces
              </button>
              <button
                onClick={() => router.push('/api-test')}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-medium"
              >
                🔧 API Test
              </button>
              <button
                onClick={() => router.push('/dashboard/new')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
              >
                + Add Device
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Devices"
            value={stats.total}
            icon="📱"
            color="bg-blue-500"
          />
          <StatsCard
            title="Online"
            value={stats.online}
            icon="✅"
            color="bg-green-500"
          />
          <StatsCard
            title="Offline"
            value={stats.offline}
            icon="⚫"
            color="bg-slate-500"
          />
          <StatsCard
            title="Warnings"
            value={stats.warning}
            icon="⚠️"
            color="bg-yellow-500"
          />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Search Devices
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by name or description..."
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Filter by Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              >
                <option value="">All Statuses</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          </div>
        </div>

        {/* Devices Grid */}
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState error={error} />
        ) : devices.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {devices.map((device) => (
              <DeviceCard key={device.id} device={device} onClick={() => router.push(`/dashboard/${device.id}`)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon, color }: { title: string; value: number; icon: string; color: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
        </div>
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center text-2xl shadow-sm`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function DeviceCard({ device, onClick }: { device: Device; onClick?: () => void }) {
  const statusColors = {
    online: 'bg-green-100 text-green-800 border-green-200',
    offline: 'bg-slate-100 text-slate-800 border-slate-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    error: 'bg-red-100 text-red-800 border-red-200',
    maintenance: 'bg-blue-100 text-blue-800 border-blue-200',
  };

  const statusIcons = {
    online: '🟢',
    offline: '⚫',
    warning: '🟡',
    error: '🔴',
    maintenance: '🔧',
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition-all hover:border-blue-300 cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900 mb-1">{device.name}</h3>
          {device.description && (
            <p className="text-sm text-slate-600 line-clamp-2">{device.description}</p>
          )}
        </div>
      </div>

      {/* Status Badge */}
      <div className="mb-4">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${statusColors[device.status]}`}>
          {statusIcons[device.status]}
          {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
        </span>
      </div>

      {/* Device Info */}
      <div className="space-y-2.5 text-sm">
        {device.location?.address && (
          <div className="flex items-center text-slate-600">
            <span className="mr-2">📍</span>
            <span className="truncate">{device.location.address}</span>
          </div>
        )}

        {device.last_seen && (
          <div className="flex items-center text-slate-600">
            <span className="mr-2">🕐</span>
            <span>Last seen: {formatTime(device.last_seen)}</span>
          </div>
        )}

        {device.firmware_version && (
          <div className="flex items-center text-slate-600">
            <span className="mr-2">💾</span>
            <span>Firmware v{device.firmware_version}</span>
          </div>
        )}
      </div>

      {/* Metadata Tags */}
      {device.metadata && Object.keys(device.metadata).length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {Object.entries(device.metadata).slice(0, 2).map(([key, value]) => (
            <span
              key={key}
              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
            >
              {key}: {String(value)}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-slate-600 font-medium">Loading devices...</p>
    </div>
  );
}

function ErrorState({ error }: { error: string }) {
  const isConnectionError = error.toLowerCase().includes('fetch');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-red-200 p-8">
      <div className="max-w-md mx-auto text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">⚠️</span>
        </div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">
          {isConnectionError ? 'Cannot Connect to Backend' : 'Error Loading Devices'}
        </h3>
        <p className="text-slate-600 mb-6">{error}</p>

        {isConnectionError && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left">
            <p className="font-semibold text-yellow-900 mb-2">Quick Fix:</p>
            <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-800">
              <li>Restart the frontend dev server</li>
              <li>Ensure backend is running on port 8000</li>
              <li>Check .env.local file exists</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  const router = useRouter();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12">
      <div className="max-w-md mx-auto text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">📱</span>
        </div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">No Devices Found</h3>
        <p className="text-slate-600 mb-6">
          No devices match your current filters. Try adjusting your search or add a new device.
        </p>
        <button
          onClick={() => router.push('/dashboard/new')}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          + Add Your First Device
        </button>
      </div>
    </div>
  );
}

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 30) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}
