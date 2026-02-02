export const queryKeys = {
  // Auth
  auth: ['auth'] as const,
  user: ['user'] as const,
  
  // Videos
  videos: ['videos'] as const,
  videosList: (filters?: Record<string, unknown>) => ['videos', 'list', filters] as const,
  video: (id: string) => ['videos', id] as const,
  videoProgress: (id: string) => ['videos', id, 'progress'] as const,
  
  // Templates
  templates: ['templates'] as const,
  templatesList: (filters?: Record<string, unknown>) => ['templates', 'list', filters] as const,
  template: (id: string) => ['templates', id] as const,
  
  // Styles
  styles: ['styles'] as const,
  
  // Usage
  usageStats: ['usage', 'stats'] as const,
} as const;

export type QueryKeys = typeof queryKeys;