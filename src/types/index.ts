// User Model
export interface User {
  id: string;
  email: string;
  displayName: string;
  avatar?: string;
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  defaultStyle?: string;
  defaultAspectRatio?: string;
  defaultDuration?: string;
  notifications: NotificationSettings;
}

export interface NotificationSettings {
  emailOnComplete: boolean;
  emailOnFail: boolean;
  marketingEmails: boolean;
}

// Video Model
export interface Video {
  id: string;
  userId: string;
  title: string;
  prompt: string;
  styleId: string;
  aspectRatio: AspectRatio;
  duration: number;
  status: VideoStatus;
  fileUrl?: string;
  thumbnailUrl?: string;
  errorMessage?: string;
  templateId?: string;
  metadata: VideoMetadata;
  createdAt: string;
  updatedAt: string;
}

export type VideoStatus = 'queued' | 'processing' | 'completed' | 'failed';

export type AspectRatio = '16:9' | '9:16' | '1:1';

export interface VideoMetadata {
  frameCount?: number;
  resolution?: string;
  fileSize?: number;
  format?: string;
  generationTime?: number;
}

// Style Model
export interface Style {
  id: string;
  name: string;
  description: string;
  previewUrl?: string;
  colorToken: string;
  category: StyleCategory;
  availableDurations: number[];
}

export type StyleCategory = 'motion' | 'avatar' | 'slideshow' | 'social' | 'product';

// Storyboard scene for videos
export interface Scene {
  id: string;
  title: string;
  prompt: string;
  duration: number;
  transition: string;
}

// Template Model
export interface Template {
  id: string;
  userId: string;
  title: string;
  basePrompt: string;
  defaultStyle: string;
  defaultAspectRatio: AspectRatio;
  defaultDuration: number;
  variables: TemplateVariable[];
  isPublic: boolean;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateVariable {
  name: string;
  placeholder: string;
  description: string;
  required: boolean;
}

// Usage Model
export interface UsageStats {
  userId: string;
  totalVideos: number;
  queuedVideos: number;
  processingVideos: number;
  completedVideos: number;
  failedVideos: number;
  videosThisWeek: number;
  videosThisMonth: number;
  videosWithFiles: number;
  styleBreakdown: Record<string, number>;
  aspectBreakdown: Record<string, number>;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ApiMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

export interface ApiMeta {
  page?: number;
  limit?: number;
  total?: number;
  hasMore?: boolean;
}

// Pagination
export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Auth Types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  displayName: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

// Form Types
export interface CreateVideoInput {
  title: string;
  prompt: string;
  styleId: string;
  aspectRatio: AspectRatio;
  duration: number;
  templateId?: string;
}

export interface UpdateVideoInput {
  title?: string;
}

export interface CreateTemplateInput {
  title: string;
  basePrompt: string;
  defaultStyle: string;
  defaultAspectRatio: AspectRatio;
  defaultDuration: number;
  variables?: TemplateVariable[];
  isPublic?: boolean;
}

export interface UpdateTemplateInput extends Partial<CreateTemplateInput> {}

// Filter Types
export interface VideoFilters {
  status?: VideoStatus;
  styleId?: string;
  aspectRatio?: AspectRatio;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface TemplateFilters {
  style?: string;
  search?: string;
  isPublic?: boolean;
}

// Event Types for Real-time
export interface VideoProgressEvent {
  videoId: string;
  status: VideoStatus;
  progress: number;
  message?: string;
}

export type VideoEventType = 'queued' | 'progress' | 'completed' | 'failed';

// Dashboard Types
export interface DashboardData {
  recentVideos: Video[];
  usageStats: UsageStats;
  quickTemplates: Template[];
}
