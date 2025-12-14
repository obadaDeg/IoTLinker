import requests
import json
import time
import sys

# Configuration
API_URL = "http://127.0.0.1:8001/api/v1"
TENANT_ID = "10000000-0000-0000-0000-000000000001"
# The n8n URL provided by the user
N8N_WEBHOOK_URL = "http://localhost:5678/webhook-test/0bdf5c12-9a96-4ddb-b449-30b96e80406b"

def main():
    print("🚀 IoTLinker -> n8n Simulation Script")
    print("-" * 40)

    # 1. Create a Test Channel (or find one)
    print("\n1️⃣  Setting up Channel...")
    channel_data = {
        "tenant_id": TENANT_ID,
        "name": "N8n Test Channel",
        "description": "Channel for testing n8n integration",
        "metadata": {
            "n8n_webhook": N8N_WEBHOOK_URL
        }
    }
    
    # Check if exists first to avoid duplicate error
    channels = requests.get(f"{API_URL}/channels/", params={"tenant_id": TENANT_ID}).json()
    existing_channel = next((c for c in channels['channels'] if c['name'] == "N8n Test Channel"), None)
    
    if existing_channel:
        channel_id = existing_channel['id']
        print(f"   Found existing channel: {channel_id}")
        # Update webhook URL just in case
        requests.put(
            f"{API_URL}/channels/{channel_id}", 
            params={"tenant_id": TENANT_ID},
            json={"metadata": {"n8n_webhook": N8N_WEBHOOK_URL}}
        )
        print("   Updated channel metadata with n8n Webhook URL")
    else:
        resp = requests.post(f"{API_URL}/channels/", json=channel_data)
        if resp.status_code != 201:
            print(resp.url)
            print(f"Failed to create channel: {resp.text}")
            return
        channel_id = resp.json()['id']
        print(f"   Created new channel: {channel_id}")

    # 2. Create a Test Device
    print("\n2️⃣  Provisioning Device...")
    unique_name = f"N8n Test Sensor {int(time.time())}"
    device_data = {
        "tenant_id": TENANT_ID,
        "channel_id": channel_id,
        "name": unique_name,
        "description": "Virtual device sending simulated temperature",
    }
    
    print(f"   Creating new device: {unique_name}")
    resp = requests.post(f"{API_URL}/devices/", json=device_data)
    
    if resp.status_code != 201:
        print(f"Failed to create device: {resp.text}")
        return
    
    creds = resp.json()
    
    device_id = creds['device_id']
    device_key = creds['device_key']
    print(f"   Device Ready: {device_id}")
    print(f"   Key: {device_key}")

    # 3. Send Data
    print("\n3️⃣  Sending Telemetry Data...")
    print(f"   Target: IoTLinker Backend -> {N8N_WEBHOOK_URL}")
    
    for temp in [25.5, 26.1, 28.4, 31.2, 45.0]:
        payload = {
            "device_id": device_id,
            "device_key": device_key,
            "data": [
                {
                    "metric_name": "temperature",
                    "value": temp,
                    "unit": "celsius"
                }
            ]
        }
        
        resp = requests.post(f"{API_URL}/devices/{device_id}/data", json=payload)
        
        if resp.status_code == 201:
            print(f"   [Sent] Temperature: {temp}°C -> IoTLinker OK ✅")
        else:
            print(f"   [Fail] Status {resp.status_code}: {resp.text}")
            
        time.sleep(1)

    print("\n" + "="*40)
    print("✅ Simulation Complete!")
    print("Go to your n8n interface and check if the 'Webhook' node received 5 events.")

if __name__ == "__main__":
    main()
