# Error Handling & Loading States - VideoGenerator

## Overview

Consistent error handling and loading states across the application provide a smooth user experience. This document defines patterns, components, and strategies.

---

## Loading States

### 1. Global Loading (Auth Check)

```tsx
// PageShell.tsx
export function PageShell({ children }) {
  const { isLoading } = useAuth();
  
  if (isLoading) {
    return <GlobalLoader />;
  }
  
  return <>{children}</>;
}

function GlobalLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-slate-600">Loading...</span>
      </div>
    </div>
  );
}
```

### 2. Skeleton Loading (Content Areas)

```tsx
// Components/ui/Skeleton.tsx
interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  className?: string;
}

export function Skeleton({ variant = 'text', width, height, className = '' }: SkeletonProps) {
  const baseStyles = 'bg-slate-200 animate-pulse';
  
  const variants = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };
  
  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${className}`}
      style={{ width, height }}
    />
  );
}

// Usage
function VideoListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-lg border">
          <Skeleton variant="rectangular" width={64} height={40} />
          <div className="flex-1 space-y-2">
            <Skeleton width="60%" height={20} />
            <Skeleton width="40%" height={16} />
          </div>
          <Skeleton width={80} height={32} />
        </div>
      ))}
    </div>
  );
}
```

### 3. Button Loading State

```tsx
<Button loading={isSubmitting}>
  {isSubmitting ? 'Creating...' : 'Create Video'}
</Button>
```

### 4. Inline Loading

```tsx
<div className="flex items-center gap-2 text-slate-600">
  <div className="w-4 h-4 border-2 border-slate-300 border-t-indigo-600 rounded-full animate-spin" />
  <span>Processing your request...</span>
</div>
```

### 5. Page Transition Loading

```tsx
// Using React Suspense with loading.tsx
// app/dashboard/loading.tsx
export default function DashboardLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="space-y-6">
        <Skeleton width={200} height={32} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton variant="rectangular" height={200} />
            <Skeleton variant="rectangular" height={150} />
          </div>
          <div className="space-y-4">
            <Skeleton variant="rectangular" height={120} />
            <Skeleton variant="rectangular" height={120} />
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## Error States

### 1. Error Boundary

```tsx
// lib/ErrorBoundary.tsx
'use client';

import { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <ErrorFallback error={this.state.error} />
      );
    }
    return this.props.children;
  }
}

function ErrorFallback({ error }: { error?: Error }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Something went wrong</h2>
        <p className="text-slate-600 mb-4">
          We encountered an unexpected error. Please try again or contact support.
        </p>
        <Button onClick={() => window.location.reload()}>Refresh Page</Button>
      </div>
    </div>
  );
}
```

### 2. Empty State

```tsx
// Components/ui/EmptyState.tsx
interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {icon && (
        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-medium text-slate-900 mb-2">{title}</h3>
      {description && (
        <p className="text-slate-600 max-w-sm mb-4">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}

// Usage examples
<EmptyState
  icon={<VideoCameraIcon />}
  title="No videos yet"
  description="Create your first video to get started"
  action={<Button>Create Video</Button>}
/>

<EmptyState
  icon={<TemplateIcon />}
  title="No templates yet"
  description="Create your first template to speed up video creation"
  action={<Button>Create Template</Button>}
/>
```

### 3. Error Toast

```tsx
// lib/notifications.tsx
interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

function showNotification(notification: Omit<Notification, 'id'>) {
  const id = Math.random().toString(36).substr(2, 9);
  // Add to notification queue
}

// Usage in error handlers
try {
  await videoApi.delete(videoId);
  showNotification({ type: 'success', message: 'Video deleted' });
} catch (error) {
  showNotification({ 
    type: 'error', 
    message: error instanceof Error ? error.message : 'Failed to delete video' 
  });
}
```

### 4. Form Validation Errors

```tsx
// Using react-hook-form with custom error display
<Input
  label="Email"
  {...register('email', { required: 'Email is required' })}
  error={errors.email?.message}
/>

<Input
  label="Password"
  type="password"
  {...register('password', { 
    required: 'Password is required',
    minLength: { value: 8, message: 'At least 8 characters' }
  })}
  error={errors.password?.message}
/>

{/* Global form error */}
{formState.errors.root?.serverError && (
  <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
    {formState.errors.root.serverError.message}
  </div>
)}
```

---

## Error Codes & Messages

| Code | Status | Message | User Action |
|------|--------|---------|-------------|
| AUTH_INVALID | 401 | Invalid email or password | Check credentials |
| AUTH_EXPIRED | 401 | Your session has expired | Re-login |
| AUTH_REQUIRED | 401 | Please log in to continue | Open auth modal |
| VIDEO_NOT_FOUND | 404 | Video not found | Refresh page |
| TEMPLATE_NOT_FOUND | 404 | Template not found | Refresh page |
| VIDEO_LIMIT_EXCEEDED | 403 | You've reached your monthly limit | Upgrade plan |
| VALIDATION_ERROR | 400 | Please check your input | See field errors |
| RATE_LIMIT_EXCEEDED | 429 | Too many requests | Wait and retry |
| INTERNAL_ERROR | 500 | Something went wrong | Contact support |

---

## Retry Strategies

### 1. Automatic Retry (Network Errors)

```tsx
// React Query retry configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (error instanceof AxiosError) {
          // Don't retry on 4xx errors
          if (error.response?.status && error.response.status < 500) {
            return false;
          }
        }
        // Retry up to 3 times on network/server errors
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});
```

### 2. Manual Retry Button

```tsx
function VideoListError({ error, onRetry }: { error: Error; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <p className="text-red-600 mb-4">Failed to load videos: {error.message}</p>
      <Button variant="secondary" onClick={onRetry}>Try Again</Button>
    </div>
  );
}

function VideosPage() {
  const { data, error, refetch, isLoading } = useVideos();
  
  if (error) {
    return <VideoListError error={error} onRetry={refetch} />;
  }
  
  if (isLoading) {
    return <VideoListSkeleton />;
  }
  
  return <VideoList videos={data} />;
}
```

### 3. Inline Retry

```tsx
function ProgressStatus({ videoId }: { videoId: string }) {
  const { data: progress, error, refetch } = useVideoProgress(videoId);
  
  if (error) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-red-600">Failed to get status</span>
        <button 
          onClick={() => refetch()}
          className="text-sm text-indigo-600 hover:text-indigo-700"
        >
          Retry
        </button>
      </div>
    );
  }
  
  return <span>Status: {progress?.status}</span>;
}
```

---

## API Error Interceptor

```tsx
// lib/apiClient.ts
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      const code = error.response.data?.error?.code;
      
      if (code === 'AUTH_EXPIRED') {
        // Try to refresh token
        try {
          await refreshToken();
          // Retry original request
          return apiClient.request(error.config!);
        } catch {
          // Refresh failed, redirect to login
          window.location.href = '/';
        }
      } else if (code === 'AUTH_INVALID') {
        showNotification({
          type: 'error',
          message: 'Invalid credentials. Please try again.',
        });
      } else {
        // Other 401 errors - might need login
        // Optionally redirect or show login modal
      }
    }
    
    if (error.response?.status === 403) {
      const code = error.response.data?.error?.code;
      
      if (code === 'VIDEO_LIMIT_EXCEEDED') {
        showNotification({
          type: 'warning',
          message: 'You\'ve reached your monthly video limit. Upgrade to create more.',
        });
      }
    }
    
    if (error.response?.status === 429) {
      showNotification({
        type: 'warning',
        message: 'Too many requests. Please wait a moment and try again.',
      });
    }
    
    // Re-throw for individual handlers
    return Promise.reject(error);
  }
);
```

---

## Loading State Patterns

### Component States

```tsx
function VideoCard({ videoId }: { videoId: string }) {
  const { data: video, isLoading, error } = useVideo(videoId);
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border p-4 animate-pulse">
        <Skeleton width="60%" height={20} />
        <Skeleton width="40%" height={16} className="mt-2" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 rounded-lg border border-red-200 p-4">
        <p className="text-red-700 text-sm">Failed to load video</p>
      </div>
    );
  }
  
  return <VideoCardContent video={video!} />;
}
```

### Page States

```tsx
export default function DashboardPage() {
  const { data: dashboard, isLoading, error } = useDashboardData();
  
  if (isLoading) {
    return <DashboardSkeleton />;
  }
  
  if (error) {
    return (
      <DashboardError 
        error={error} 
        onRetry={() => queryClient.invalidateQueries({ queryKey: ['dashboard'] })}
      />
    );
  }
  
  return <DashboardContent data={dashboard!} />;
}
```

---

## Progress Indicators

### Video Generation Progress

```tsx
function VideoProgressBar({ videoId }: { videoId: string }) {
  const { data: progress } = useVideoProgress(videoId);
  
  if (!progress || progress.status === 'completed') {
    return null;
  }
  
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-slate-600 capitalize">{progress.status}...</span>
        <span className="text-slate-900 font-medium">{progress.progress}%</span>
      </div>
      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-indigo-600 transition-all duration-300"
          style={{ width: `${progress.progress}%` }}
        />
      </div>
      {progress.message && (
        <p className="text-xs text-slate-500">{progress.message}</p>
      )}
    </div>
  );
}
```

### Upload Progress (if applicable)

```tsx
function UploadProgress({ progress }: { progress: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-emerald-500 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-sm text-slate-600 w-12 text-right">{progress}%</span>
    </div>
  );
}
```

---

## Summary

| Pattern | Use Case |
|---------|----------|
| `GlobalLoader` | Initial auth check on app load |
| `Skeleton` | Content area loading placeholders |
| `Button loading` | Form submissions, actions |
| `Inline loading` | Small async operations |
| `Page loading.tsx` | Route transition loading |
| `ErrorBoundary` | Catch unexpected errors |
| `EmptyState` | No data scenarios |
| `Error toast` | Transient error notifications |
| `Form validation` | Field-level input errors |
| `Retry button` | Manual recovery from errors |
| `Progress bar` | Long-running operations |
