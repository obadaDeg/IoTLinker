# IoTLinker System - Cursor Agent Implementation PRD

## Overview

This Product Requirements Document (PRD) provides comprehensive instructions for an automated coding agent to implement the IoTLinker platform - a web-based IoT data system for sensor data ingestion, analysis, visualization, alerting, and AI-powered insights.

## System Architecture

Implement a multi-layered architecture with the following components:

1. **Frontend Layer**: Next.js application with Clerk authentication
2. **Backend Layer**: FastAPI REST API endpoints 
3. **Database Layer**: Supabase (PostgreSQL) with real-time capabilities
4. **AI Services**: OpenAI API integration for data insights
5. **Notification Services**: Email (SendGrid), SMS (Twilio), and Webhooks

## Core Requirements

### 1. Authentication System

- Implement Clerk for user authentication
- Create secure session management
- Set up password reset functionality
- Build user profile management screens

### 2. Channel and Device Management

- Create CRUD operations for channels (logical data streams)
- Implement device registration and management
- Design token-based access control system with three permission levels:
  - Read: View data only
  - Write: Add data to channels
  - Manage: Full control over channel settings

### 3. Data Ingestion API

- Build secure REST API endpoints for device data submission
- Implement token authentication for API requests
- Create data validation mechanisms for:
  - Schema compliance
  - Timestamp verification
  - Format standardization
- Set up database storage with optimized write operations

### 4. Real-time Dashboard

- Develop visualizations using a charting library
- Implement real-time data updates via Supabase subscriptions
- Create filtering capabilities (time-based, value-based)
- Design customizable layouts for user preferences
- Ensure mobile-first responsive design

### 5. Alerting System

- Implement threshold-based alerting
- Create notification delivery via:
  - Email (SendGrid)
  - SMS (Twilio)
  - Webhooks
- Build alert management interface
- Integrate optional AI-generated alert explanations

### 6. Data Sharing

- Implement three visibility levels:
  - Private (owner only)
  - Public (anyone with link)
  - Restricted (selected users)
- Create shareable links with configurable permissions
- Build user invitation system via email

### 7. Data Export/Import

- Implement export functionality to CSV, Excel, and JSON
- Create import capability with validation
- Design batch operations for data management

### 8. AI-Powered Insights

- Integrate OpenAI API for data analysis
- Implement on-demand and scheduled data summaries
- Create anomaly detection algorithms
- Build natural language interface for data queries

## Technical Implementation Guidelines

### Database Schema

Implement the following core tables in Supabase:

1. **users** - User profiles and settings
2. **channels** - Channel metadata and configuration
3. **channel_data** - Time-series data with flexible schema
4. **access_tokens** - API tokens with scoped permissions
5. **alerts** - Alert configurations and thresholds
6. **notifications** - Alert history and delivery status
7. **shared_access** - Channel sharing permissions

### API Design

The REST API should follow these endpoint patterns:

```
# Authentication
POST   /api/auth/login
POST   /api/auth/register

# Channels
GET    /api/v1/channels
POST   /api/v1/channels
GET    /api/v1/channels/{id}
PUT    /api/v1/channels/{id}
DELETE /api/v1/channels/{id}

# Channel Data
POST   /api/v1/channels/{id}/data
GET    /api/v1/channels/{id}/data
GET    /api/v1/channels/{id}/export?format=[csv|excel|json]
POST   /api/v1/channels/{id}/import

# Access Control
GET    /api/v1/channels/{id}/tokens
POST   /api/v1/channels/{id}/tokens
DELETE /api/v1/channels/{id}/tokens/{token_id}

# Alerts
GET    /api/v1/channels/{id}/alerts
POST   /api/v1/channels/{id}/alerts
PUT    /api/v1/channels/{id}/alerts/{alert_id}
DELETE /api/v1/channels/{id}/alerts/{alert_id}

# Sharing
GET    /api/v1/channels/{id}/sharing
POST   /api/v1/channels/{id}/sharing
DELETE /api/v1/channels/{id}/sharing/{share_id}

# AI Insights
POST   /api/v1/channels/{id}/insights
GET    /api/v1/channels/{id}/anomalies
POST   /api/v1/chat - Natural language interface
```

### Frontend Structure

Implement these key pages and components:

1. **Authentication Pages**
   - Login
   - Registration
   - Password Reset

2. **Dashboard**
   - Channel List
   - Data Visualization
   - Real-time Updates

3. **Channel Management**
   - Create/Edit Channels
   - Device Integration
   - Access Control

4. **Data Explorer**
   - Interactive Charts
   - Filtering Controls
   - Export/Import Tools

5. **Alert Configuration**
   - Threshold Settings
   - Notification Preferences
   - Alert History

6. **Settings**
   - Profile Management
   - API Token Management
   - Notification Preferences

### Non-Functional Requirements

Ensure implementation meets these criteria:

1. **Performance**
   - API response time < 200ms
   - Support 100+ requests/sec per channel
   - Optimize database queries for time-series data

2. **Security**
   - HTTPS enforcement
   - JWT for API authentication
   - Input validation on all forms
   - Protection against SQL injection, XSS

3. **Scalability**
   - Stateless backend design
   - Database connection pooling
   - Optimization for high-volume writes

4. **Usability**
   - Mobile-first responsive design
   - Intuitive UI with minimal learning curve
   - Comprehensive error messages
   - Progressive enhancement

## Implementation Sequence

Follow this recommended implementation order:

1. Set up project structure and dependencies
2. Implement authentication (Clerk integration)
3. Create database schema in Supabase
4. Build core API endpoints for channel management
5. Implement data ingestion API
6. Create dashboard with basic visualization
7. Add real-time updates
8. Implement access control and sharing
9. Build alerting system
10. Add export/import functionality
11. Integrate AI services
12. Implement notification services
13. Complete UI/UX refinements
14. Add comprehensive error handling
15. Implement performance optimizations

## Testing Requirements

Implement tests for:

1. API endpoint functionality
2. Authentication flows
3. Real-time data updates
4. Alert trigger conditions
5. Data validation
6. Permission checks
7. Load/performance testing

## Deployment Considerations

Prepare for deployment with:

1. Environment-based configuration
2. Database migration scripts
3. CI/CD pipeline setup
4. Monitoring and logging
5. Backup strategies

## Appendix: Sample Code Snippets

### FastAPI Endpoint Example

```python
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from typing import List, Optional
import supabase
from pydantic import BaseModel

app = FastAPI()
supabase_client = supabase.create_client(SUPABASE_URL, SUPABASE_KEY)

class ChannelData(BaseModel):
    field1: float
    field2: Optional[float] = None
    timestamp: str

@app.post("/api/v1/channels/{channel_id}/write")
async def write_channel_data(
    channel_id: str, 
    data: ChannelData,
    token: str = Depends(verify_write_token)
):
    # Validate token has write access to this channel
    if not has_write_permission(token, channel_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Token lacks write permission for this channel"
        )
    
    # Insert data into Supabase
    result = supabase_client.table("channel_data").insert({
        "channel_id": channel_id,
        "timestamp": data.timestamp,
        "data": {
            "field1": data.field1,
            "field2": data.field2
        }
    }).execute()
    
    # Check for threshold alerts
    await check_alerts(channel_id, data)
    
    return {"status": "success", "id": result.data[0]["id"]}
```

### Next.js Channel Component Example

```jsx
import { useState, useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { LineChart } from '../components/LineChart';
import { AlertDialog } from '../components/AlertDialog';

export default function ChannelView({ channelId }) {
  const [channelData, setChannelData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = useSupabaseClient();
  
  useEffect(() => {
    // Fetch initial data
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('channel_data')
        .select('*')
        .eq('channel_id', channelId)
        .order('timestamp', { ascending: false })
        .limit(100);
        
      if (data) setChannelData(data);
      setIsLoading(false);
    };
    
    fetchData();
    
    // Subscribe to real-time updates
    const subscription = supabase
      .channel(`channel-${channelId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'channel_data',
        filter: `channel_id=eq.${channelId}` 
      }, (payload) => {
        setChannelData(current => [payload.new, ...current].slice(0, 100));
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [channelId, supabase]);
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Channel: {channelId}</h1>
      
      {isLoading ? (
        <div>Loading data...</div>
      ) : (
        <LineChart data={channelData} />
      )}
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Recent Data</h2>
        <table className="w-full">
          {/* Table implementation */}
        </table>
      </div>
      
      <AlertDialog channelId={channelId} />
    </div>
  );
}
```

## Conclusion

The IoTLinker system is a comprehensive IoT data platform with extensive capabilities for data ingestion, visualization, and management. Follow the implementation guidelines in this PRD to build a complete, production-ready application that meets all specified requirements.