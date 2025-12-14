'use client';

import { useEffect, useState } from 'react';

export default function ApiTestPage() {
  const [apiUrl, setApiUrl] = useState('');
  const [healthStatus, setHealthStatus] = useState<string>('Checking...');
  const [devicesCount, setDevicesCount] = useState<string>('Checking...');

  useEffect(() => {
    // Check what API URL is being used
    const url = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    setApiUrl(url);

    // Test health endpoint
    fetch(`${url}/health`)
      .then(res => res.json())
      .then(data => setHealthStatus(`✅ ${JSON.stringify(data)}`))
      .catch(err => setHealthStatus(`❌ ${err.message}`));

    // Test devices endpoint
    fetch(`${url}/api/v1/devices/?tenant_id=10000000-0000-0000-0000-000000000001&page=1&page_size=5`)
      .then(res => res.json())
      .then(data => setDevicesCount(`✅ Found ${data.devices?.length || 0} devices`))
      .catch(err => setDevicesCount(`❌ ${err.message}`));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">API Connection Test</h1>

        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">Environment Variables</h2>
            <div className="bg-gray-100 p-3 rounded font-mono text-sm">
              <div><strong>NEXT_PUBLIC_API_URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'NOT SET (using default)'}</div>
              <div><strong>Actual API URL:</strong> {apiUrl}</div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Health Check</h2>
            <div className="bg-gray-100 p-3 rounded">
              <div><strong>Endpoint:</strong> {apiUrl}/health</div>
              <div><strong>Status:</strong> {healthStatus}</div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Devices API</h2>
            <div className="bg-gray-100 p-3 rounded">
              <div><strong>Endpoint:</strong> {apiUrl}/api/v1/devices/</div>
              <div><strong>Result:</strong> {devicesCount}</div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
            <h3 className="font-semibold text-blue-900 mb-2">Troubleshooting</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
              <li>If NEXT_PUBLIC_API_URL shows "NOT SET", restart the dev server</li>
              <li>Make sure <code className="bg-blue-100 px-1 rounded">.env.local</code> exists in the frontend folder</li>
              <li>Make sure backend is running: <code className="bg-blue-100 px-1 rounded">curl http://127.0.0.1:8000/health</code></li>
            </ol>
          </div>

          <div className="mt-4">
            <a
              href="/devices"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Go to Devices Page
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
