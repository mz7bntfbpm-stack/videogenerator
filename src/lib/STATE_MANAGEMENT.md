# State Management Strategy - VideoGenerator

## Overview

VideoGenerator uses a hybrid state management approach combining:
- **React Context** for global UI state (auth, modals, theme)
- **React Query** (TanStack Query) for server state (API data, caching)
- **Local component state** for UI-specific state (forms, interactions)

## State Categories

### 1. Global UI State (React Context)

**AuthContext**
```typescript
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}
```

**ModalContext** (managed within PageShell)
```typescript
interface ModalContextType {
  authModalOpen: boolean;
  authModalMode: 'login' | 'signup';
  openAuthModal: (mode?: 'login' | 'signup') => void;
  closeAuthModal: () => void;
}
```

**NotificationContext** (toast notifications)
```typescript
interface NotificationContextType {
  notifications: Notification[];
  showNotification: (notification: Omit<Notification, 'id'>) => void;
  dismissNotification: (id: string) => void;
}
```

### 2. Server State (React Query)

React Query handles all API data with caching, refetching, and optimistic updates.

**Query Keys**
```typescript
const queryKeys = {
  // Auth
  user: ['user'] as const,
  
  // Videos
  videos: ['videos'] as const,
  videosList: (filters?: VideoFilters) => ['videos', 'list', filters] as const,
  video: (id: string) => ['videos', id] as const,
  videoProgress: (id: string) => ['videos', id, 'progress'] as const,
  
  // Templates
  templates: ['templates'] as const,
  templatesList: (filters?: TemplateFilters) => ['templates', 'list', filters] as const,
  template: (id: string) => ['templates', id] as const,
  
  // Usage
  usageStats: ['usage', 'stats'] as const,
  usageHistory: ['usage', 'history'] as const,
  
  // Styles (public, cached long)
  styles: ['styles'] as const,
};
```

**Custom Hooks**
```typescript
// Videos
export function useVideos(filters?: VideoFilters) {
  return useQuery({
    queryKey: queryKeys.videosList(filters),
    queryFn: () => videoApi.list(filters),
  });
}

export function useVideo(id: string) {
  return useQuery({
    queryKey: queryKeys.video(id),
    queryFn: () => videoApi.get(id),
    enabled: !!id,
  });
}

export function useVideoProgress(id: string) {
  return useQuery({
    queryKey: queryKeys.videoProgress(id),
    queryFn: () => videoApi.getProgress(id),
    enabled: !!id,
    refetchInterval: (data) => {
      if (data?.status === 'processing') return 3000; // Poll every 3s
      if (data?.status === 'queued') return 5000; // Poll every 5s
      return false;
    },
  });
}

export function useCreateVideo() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (input: CreateVideoInput) => videoApi.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.videos });
      queryClient.invalidateQueries({ queryKey: queryKeys.usageStats });
    },
  });
}

export function useDeleteVideo() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => videoApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.videos });
      queryClient.invalidateQueries({ queryKey: queryKeys.usageStats });
    },
  });
}

// Templates
export function useTemplates(filters?: TemplateFilters) {
  return useQuery({
    queryKey: queryKeys.templatesList(filters),
    queryFn: () => templateApi.list(filters),
  });
}

export function useTemplate(id: string) {
  return useQuery({
    queryKey: queryKeys.template(id),
    queryFn: () => templateApi.get(id),
    enabled: !!id,
  });
}

export function useCreateTemplate() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (input: CreateTemplateInput) => templateApi.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.templates });
    },
  });
}

// Usage
export function useUsageStats() {
  return useQuery({
    queryKey: queryKeys.usageStats,
    queryFn: () => usageApi.getStats(),
    staleTime: 60000, // Cache for 1 minute
  });
}

// User
export function useUser() {
  return useQuery({
    queryKey: queryKeys.user,
    queryFn: () => userApi.getProfile(),
    retry: false,
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<User>) => userApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user });
    },
  });
}
```

### 3. Local Component State

**Form State (React Hook Form)**
```typescript
import { useForm } from 'react-hook-form';

interface CreateVideoForm {
  title: string;
  prompt: string;
  styleId: string;
  aspectRatio: AspectRatio;
  duration: number;
}

export function useCreateVideoForm() {
  const form = useForm<CreateVideoForm>({
    defaultValues: {
      title: '',
      prompt: '',
      styleId: 'clean-motion',
      aspectRatio: '16:9',
      duration: 30,
    },
  });
  
  return form;
}
```

**UI State (useState/useReducer)**
```typescript
// Video list local state for multi-select
const [selectedVideos, setSelectedVideos] = useState<Set<string>>(new Set());

// Filter panel expanded state
const [filtersExpanded, setFiltersExpanded] = useState(false);

// Modal state
const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
```

## State Flow Diagrams

### Video Creation Flow
```
User clicks "Create Video"
    ↓
Form state updates (useState/react-hook-form)
    ↓
User submits form
    ↓
useCreateVideo mutation
    ↓
Optimistic update (optional)
    ↓
API call to POST /videos
    ↓
onSuccess:
  - invalidateQueries(['videos'])
  - invalidateQueries(['usage', 'stats'])
    ↓
React Query refetches video list
    ↓
UI updates with new video in "Queued" status
```

### Video Progress Polling
```
Video created with status "queued"
    ↓
useVideoProgress hook starts polling (refetchInterval)
    ↓
GET /videos/:id/progress every 3-5 seconds
    ↓
Status updates: queued → processing → completed
    ↓
UI updates status badge color
    ↓
When status === 'completed':
  - Stop polling
  - Show download button
```

### Authentication Flow
```
App loads
    ↓
AuthContext checks for stored token
    ↓
useUser query fetches /auth/me
    ↓
isLoading: true → false
    ↓
If authenticated:
  - Show user name in nav
  - Show logout button
  - Enable authenticated routes
If not authenticated:
  - Show login/signup buttons
  - Redirect to dashboard shows auth modal
```

## Persistence

**Token Storage**
```typescript
// cookies (httpOnly in production)
const TOKEN_COOKIE = 'vg_access_token';
const REFRESH_COOKIE = 'vg_refresh_token';

// React Query cache persistence
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 30, // 30 minutes
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

// Optional: persist cache to localStorage
persistQueryClient({
  queryClient,
  persister: localStoragePersister,
  maxAge: 1000 * 60 * 60 * 24, // 24 hours
});
```

## Performance Considerations

| Strategy | Use Case |
|----------|----------|
| `staleTime: 5min` | Usage stats, user profile |
| `staleTime: 1min` | Video list, template list |
| `refetchInterval` | Video progress polling |
| `keepPreviousData` | Pagination transitions |
| `placeholderData` | Skeleton loading states |
| `optimistic updates` | Delete, update actions |

## File Structure
```
src/
├── lib/
│   ├── queryClient.ts      # React Query setup
│   ├── queryKeys.ts        # Query key constants
│   └── authContext.tsx     # Auth provider
├── hooks/
│   ├── useAuth.ts
│   ├── useVideos.ts
│   ├── useTemplates.ts
│   ├── useUsage.ts
│   └── useForms.ts
├── types/
│   └── index.ts            # TypeScript interfaces
└── components/
    ├── global/
    │   └── PageShell.tsx   # Provides auth/modal context
    └── ui/
        └── ...
```
