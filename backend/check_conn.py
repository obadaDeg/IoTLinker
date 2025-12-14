
import requests
import sys

def check_backend():
    url = "http://127.0.0.1:8001/api/v1/channels/"
    # Using the tenant ID we saw in the frontend code
    params = {"tenant_id": "10000000-0000-0000-0000-000000000001"}
    
    print(f"Checking {url}...")
    try:
        response = requests.get(url, params=params)
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            print("Success! Backend is reachable.")
            print(f"Response: {response.json()}")
        else:
            print(f"Failed with status {response.status_code}")
            print(f"Response: {response.text}")
    except Exception as e:
        print(f"Connection failed: {e}")

if __name__ == "__main__":
    check_backend()
