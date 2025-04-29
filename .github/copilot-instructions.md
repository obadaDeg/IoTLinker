# IoTLinker Development Instructions

## Project Overview

You are tasked with continuing development of the IoTLinker system - a web-based IoT data platform for sensor data ingestion, analysis, visualization, alerting, and AI-powered insights. Some foundational work has already been completed, as evidenced by the existing directory structure.

## Technology Stack

Complete the implementation using the following technology stack:

### Frontend
- **Next.js 14+** (App Router) - [Official Documentation](https://nextjs.org/docs)
- **React 18+** - [Official Documentation](https://react.dev/reference/react)
- **TypeScript** - [Official Documentation](https://www.typescriptlang.org/docs/)
- **Tailwind CSS** - [Official Documentation](https://tailwindcss.com/docs)
- **Clerk Authentication** - [Official Documentation](https://clerk.com/docs)

### Backend
- **FastAPI** - [Official Documentation](https://fastapi.tiangolo.com/)
- **Supabase** (PostgreSQL + Real-time) - [Official Documentation](https://supabase.com/docs)
- **OpenAI API** (for AI insights) - [Official Documentation](https://platform.openai.com/docs/api-reference)

### Notification Services
- **SendGrid** (Email) - [Official Documentation](https://docs.sendgrid.com/)
- **Twilio** (SMS) - [Official Documentation](https://www.twilio.com/docs)

## Development Guidelines

### 1. Next.js Implementation

- Use the App Router architecture that's already established
- Implement server components where appropriate for improved performance
- Create client components only where interactivity is required
- Follow the established folder structure for routes and components
- Use TypeScript strictly with proper typing

```typescript
// Example of proper typing for a channel component
import { Channel } from '@/types/channel';

interface ChannelViewProps {
  channel: Channel;
  onUpdate?: (updatedChannel: Channel) => void;
}

export default function ChannelView({ channel, onUpdate }: ChannelViewProps) {
  // Implementation
}
```

### 2. API Development with FastAPI

Create a separate backend directory for the FastAPI application:

```
/backend
  /app
    /api
      /v1
        /channels
        /auth
        /alerts
    /models
    /services
    /utils
  main.py
  requirements.txt
```

Follow FastAPI best practices:
- Use Pydantic models for data validation
- Implement dependency injection for services
- Structure endpoints logically by resource
- Use proper status codes and error handling

```python
# Example FastAPI endpoint
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional
from app.services.channels import ChannelService

router = APIRouter(prefix="/api/v1/channels", tags=["channels"])

class ChannelCreate(BaseModel):
    name: str
    description: Optional[str] = None
    is_public: bool = False

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_channel(
    channel: ChannelCreate,
    channel_service: ChannelService = Depends()
):
    try:
        new_channel = await channel_service.create_channel(channel)
        return new_channel
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
```

### 3. Database Configuration with Supabase

Set up the following tables in Supabase:

1. `channels` - Channel metadata
2. `channel_data` - Time-series data from IoT devices
3. `access_tokens` - API tokens for device authentication
4. `alerts` - Alert configurations
5. `notifications` - Alert history and delivery status
6. `shared_access` - Channel sharing permissions

Use the Supabase client in the Next.js application:

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### 4. Authentication with Clerk

Continue the Clerk integration that appears to be in progress:

1. Complete the sign-in, sign-up, and password reset flows
2. Implement Clerk middleware for protected routes
3. Create user profile management pages

Follow the [Clerk Next.js Documentation](https://clerk.com/docs/quickstarts/nextjs) for best practices.

```typescript
// Example middleware.ts enhancement
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/", "/auth(.*)", "/api/public(.*)"],
  ignoredRoutes: ["/api/webhook/clerk"],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
```

### 5. UI/UX Implementation

- Follow the component structure that's already established
- Create reusable UI components in the components directory
- Use Tailwind CSS for styling with a consistent design system
- Implement responsive design (mobile-first approach)

```typescript
// Example of a reusable component with Tailwind
// src/components/ui/Button.tsx
import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  "rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
        secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
      },
      size: {
        sm: "py-1 px-3 text-sm",
        md: "py-2 px-4 text-base",
        lg: "py-3 px-6 text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

interface ButtonProps 
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: ReactNode;
}

export function Button({ 
  children, 
  variant, 
  size, 
  className, 
  ...props 
}: ButtonProps) {
  return (
    <button 
      className={buttonVariants({ variant, size, className })}
      {...props}
    >
      {children}
    </button>
  );
}
```

### 6. Data Visualization

Implement data visualization components using one of these libraries:
- [Recharts](https://recharts.org/en-US/api)
- [Chart.js](https://www.chartjs.org/docs/latest/)
- [D3.js](https://d3js.org/)

Create components for:
- Line charts for time-series data
- Bar charts for aggregated data
- Gauges for current values
- Custom visualization widgets

```typescript
// Example time-series chart component
import { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { ChannelData } from '@/types/channel';

interface TimeSeriesChartProps {
  data: ChannelData[];
  dataKey: string;
  timeRange: '1h' | '24h' | '7d' | '30d' | 'custom';
}

export function TimeSeriesChart({ data, dataKey, timeRange }: TimeSeriesChartProps) {
  // Implementation for chart with proper time filtering
}
```

### 7. Real-time Updates

Implement real-time updates using Supabase's real-time capabilities:

```typescript
// Example of real-time subscription in a React hook
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ChannelData } from '@/types/channel';

export function useRealtimeChannelData(channelId: string) {
  const [data, setData] = useState<ChannelData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Initial data fetch
    const fetchData = async () => {
      try {
        const { data: channelData, error } = await supabase
          .from('channel_data')
          .select('*')
          .eq('channel_id', channelId)
          .order('timestamp', { ascending: false })
          .limit(100);
          
        if (error) throw error;
        setData(channelData || []);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel(`channel-${channelId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'channel_data',
        filter: `channel_id=eq.${channelId}` 
      }, (payload) => {
        setData(current => [payload.new, ...current].slice(0, 100));
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [channelId]);

  return { data, loading, error };
}
```

### 8. Environment Setup

Create appropriate environment configuration:

```
# .env.local example
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth?tab=sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

OPENAI_API_KEY=sk-...

SENDGRID_API_KEY=SG...
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
```

### 9. API Token Management

Implement a secure token management system:

1. Create a token generation service
2. Store tokens securely (hashed) in the database
3. Implement token validation middleware
4. Create a UI for users to manage their tokens

### 10. Alert System

Build an alerting system with these components:

1. Alert configuration UI
2. Alert checking service
3. Notification delivery service
4. Alert history view

### 11. Testing Strategy

Implement testing at multiple levels:

1. **Unit Tests**: For individual components and functions
   - Use Jest and React Testing Library

2. **API Tests**: For backend endpoints
   - Use pytest for FastAPI endpoints

3. **Integration Tests**: For full workflows
   - Test complete user journeys

4. **E2E Tests**: For critical user flows
   - Use Cypress or Playwright

## Development Process

1. **Review Current Progress**: Understand the existing code structure and components
2. **Complete Core Functionality**: Finish the basic channel management and data visualization
3. **Add Authentication & Authorization**: Complete the Clerk integration
4. **Implement Data API**: Create the FastAPI backend for data ingestion
5. **Build Real-time Features**: Add real-time updates and notifications
6. **Add Advanced Features**: Implement alerts, sharing, and AI insights
7. **Polish UI/UX**: Refine the user interface and experience
8. **Optimize Performance**: Ensure the application is fast and responsive
9. **Test Thoroughly**: Verify all functionality through testing
10. **Prepare for Deployment**: Setup CI/CD and deployment configurations

## Performance Considerations

- Implement data pagination for large datasets
- Use efficient data fetching strategies (SWR or React Query)
- Optimize database queries with proper indexing
- Implement caching where appropriate
- Use code splitting for better initial load times

## Security Best Practices

- Validate all inputs on both client and server
- Use parameterized queries to prevent SQL injection
- Implement proper CORS policies
- Use HTTPS for all API communication
- Secure all API endpoints with proper authentication
- Follow the principle of least privilege for user permissions

## Documentation

Maintain documentation for:

1. API endpoints
2. Component interfaces
3. Database schema
4. Environment setup
5. Deployment instructions

## Next Steps

1. Complete the Channel management features
2. Implement the FastAPI backend
3. Set up the Supabase database schema
4. Complete the authentication flow with Clerk
5. Build the real-time dashboard components