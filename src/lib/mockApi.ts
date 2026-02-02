import type {
  User,
  Video,
  Template,
  Style,
  VideoStatus,
  AspectRatio,
  UsageStats,
  LoginCredentials,
  SignUpCredentials,
  CreateVideoInput,
  CreateTemplateInput,
  VideoFilters,
  TemplateFilters,
  PaginatedResponse,
  VideoProgressEvent,
  Scene,
} from '@/types';

// Mock Data
const mockUser: User = {
  id: 'user-1',
  email: 'demo@example.com',
  displayName: 'Demo User',
  avatar: undefined,
  preferences: {
    defaultStyle: 'clean-motion',
    defaultAspectRatio: '16:9',
    defaultDuration: '30s',
    notifications: {
      emailOnComplete: true,
      emailOnFail: true,
      marketingEmails: false,
    },
  },
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-02-02T00:00:00Z',
};

const mockVideos: Video[] = [
  {
    id: 'vid-1',
    userId: 'user-1',
    title: 'Product Launch Reel',
    prompt: 'Create an engaging product launch video with dynamic transitions',
    styleId: 'clean-motion',
    aspectRatio: '16:9',
    duration: 30,
    status: 'completed',
    fileUrl: 'https://example.com/videos/vid-1.mp4',
    thumbnailUrl: 'https://example.com/thumbnails/vid-1.jpg',
    metadata: {
      resolution: '1920x1080',
      fileSize: 5242880,
      format: 'mp4',
      generationTime: 45,
    },
    createdAt: '2026-02-02T10:00:00Z',
    updatedAt: '2026-02-02T10:05:00Z',
  },
  {
    id: 'vid-2',
    userId: 'user-1',
    title: 'Weekly Update Feb 2',
    prompt: 'Weekly team update with highlights from the past week',
    styleId: 'energetic-edit',
    aspectRatio: '9:16',
    duration: 60,
    status: 'processing',
    metadata: {},
    createdAt: '2026-02-02T09:00:00Z',
    updatedAt: '2026-02-02T09:30:00Z',
  },
  {
    id: 'vid-3',
    userId: 'user-1',
    title: 'Feature Highlight: AI',
    prompt: 'Showcase the new AI features with professional explainer style',
    styleId: 'ai-avatar',
    aspectRatio: '16:9',
    duration: 45,
    status: 'completed',
    fileUrl: 'https://example.com/videos/vid-3.mp4',
    metadata: {
      resolution: '1920x1080',
      fileSize: 3145728,
      format: 'mp4',
    },
    createdAt: '2026-02-01T15:00:00Z',
    updatedAt: '2026-02-01T15:10:00Z',
  },
  {
    id: 'vid-4',
    userId: 'user-1',
    title: 'Customer Testimonial',
    prompt: 'Talking head style customer testimonial',
    styleId: 'talking-head',
    aspectRatio: '16:9',
    duration: 90,
    status: 'queued',
    metadata: {},
    createdAt: '2026-02-01T12:00:00Z',
    updatedAt: '2026-02-01T12:00:00Z',
  },
  {
    id: 'vid-5',
    userId: 'user-1',
    title: 'Social Promo - Spring',
    prompt: 'Fast-paced social media promo for spring collection',
    styleId: 'social-snippet',
    aspectRatio: '9:16',
    duration: 15,
    status: 'failed',
    errorMessage: 'Generation timeout. Please try again.',
    metadata: {},
    createdAt: '2026-01-31T10:00:00Z',
    updatedAt: '2026-01-31T10:15:00Z',
  },
  {
    id: 'vid-6',
    userId: 'user-1',
    title: 'Year End Summary',
    prompt: 'Animated slideshow of year-end highlights',
    styleId: 'slideshow',
    aspectRatio: '16:9',
    duration: 120,
    status: 'completed',
    fileUrl: 'https://example.com/videos/vid-6.mp4',
    metadata: {
      resolution: '1920x1080',
      format: 'mp4',
    },
    createdAt: '2026-01-30T09:00:00Z',
    updatedAt: '2026-01-30T09:20:00Z',
  },
];

const mockTemplates: Template[] = [
  {
    id: 'tpl-1',
    userId: 'user-1',
    title: 'Weekly Update Template',
    basePrompt: 'Create a weekly update video about {topic} with {highlight} highlights',
    defaultStyle: 'clean-motion',
    defaultAspectRatio: '16:9',
    defaultDuration: 60,
    variables: [
      { name: 'topic', placeholder: '{topic}', description: 'Main topic for the week', required: true },
      { name: 'highlight', placeholder: '{highlight}', description: 'Key highlight count', required: false },
    ],
    isPublic: false,
    usageCount: 12,
    createdAt: '2026-01-15T00:00:00Z',
    updatedAt: '2026-01-20T00:00:00Z',
  },
  {
    id: 'tpl-2',
    userId: 'user-1',
    title: 'Product Feature Highlight',
    basePrompt: 'Showcase the benefits of {product} with {style} style',
    defaultStyle: 'energetic-edit',
    defaultAspectRatio: '9:16',
    defaultDuration: 30,
    variables: [
      { name: 'product', placeholder: '{product}', description: 'Product name', required: true },
      { name: 'style', placeholder: '{style}', description: 'Visual style preference', required: false },
    ],
    isPublic: false,
    usageCount: 8,
    createdAt: '2026-01-10T00:00:00Z',
    updatedAt: '2026-01-10T00:00:00Z',
  },
  {
    id: 'tpl-3',
    userId: 'user-1',
    title: 'Social Media Promo',
    basePrompt: 'Create an engaging {platform} promo for {campaign} with CTA',
    defaultStyle: 'social-snippet',
    defaultAspectRatio: '1:1',
    defaultDuration: 15,
    variables: [
      { name: 'platform', placeholder: '{platform}', description: 'Social platform', required: true },
      { name: 'campaign', placeholder: '{campaign}', description: 'Campaign name', required: true },
    ],
    isPublic: true,
    usageCount: 25,
    createdAt: '2026-01-05T00:00:00Z',
    updatedAt: '2026-01-18T00:00:00Z',
  },
];

const mockStyles: Style[] = [
  {
    id: 'clean-motion',
    name: 'Clean Motion',
    description: 'Professional motion graphics with smooth transitions',
    colorToken: '#6366f1',
    category: 'motion',
    availableDurations: [15, 30, 60, 120],
  },
  {
    id: 'energetic-edit',
    name: 'Energetic Edit',
    description: 'Fast-paced, dynamic editing style',
    colorToken: '#f59e0b',
    category: 'motion',
    availableDurations: [15, 30, 60],
  },
  {
    id: 'ai-avatar',
    name: 'AI Avatar',
    description: 'AI-generated presenter for explainer videos',
    colorToken: '#8b5cf6',
    category: 'avatar',
    availableDurations: [30, 60, 120],
  },
  {
    id: 'talking-head',
    name: 'Talking Head',
    description: 'Classic interview/talking head format',
    colorToken: '#10b981',
    category: 'avatar',
    availableDurations: [60, 120, 180],
  },
  {
    id: 'slideshow',
    name: 'Slideshow',
    description: 'Animated photo and text slideshow',
    colorToken: '#3b82f6',
    category: 'slideshow',
    availableDurations: [30, 60, 120],
  },
  {
    id: 'social-snippet',
    name: 'Social Snippet',
    description: 'Short, engaging format optimized for social media',
    colorToken: '#ec4899',
    category: 'social',
    availableDurations: [15, 30],
  },
  {
    id: 'product-showcase',
    name: 'Product Showcase',
    description: 'Product-focused with smooth camera movements',
    colorToken: '#14b8a6',
    category: 'product',
    availableDurations: [15, 30, 60],
  },
];

// Mock API Implementation
class MockApi {
  private videos: Video[] = [...mockVideos];
  // Simple in-memory templates cache
  private templates: Template[] = [...mockTemplates];
  private user: User = { ...mockUser };
  private isAuthenticated: boolean = false;
  private videoProgress: Map<string, { status: VideoStatus; progress: number }> = new Map();

  // Auth Methods
  async login(credentials: LoginCredentials): Promise<{ user: User; tokens: { accessToken: string; refreshToken: string; expiresAt: number } }> {
    await this.delay(500);
    
    if (credentials.email === 'demo@example.com' && credentials.password === 'demo') {
      this.isAuthenticated = true;
      return {
        user: this.user,
        tokens: {
          accessToken: 'mock-access-token-' + Date.now(),
          refreshToken: 'mock-refresh-token-' + Date.now(),
          expiresAt: Date.now() + 15 * 60 * 1000, // 15 minutes
        },
      };
    }
    
    throw new Error('Invalid email or password');
  }

  async register(credentials: SignUpCredentials): Promise<{ user: User; tokens: { accessToken: string; refreshToken: string; expiresAt: number } }> {
    await this.delay(800);
    
    if (credentials.email === 'demo@example.com') {
      throw new Error('Email already registered');
    }
    
    this.user = {
      ...this.user,
      email: credentials.email,
      displayName: credentials.displayName,
    };
    this.isAuthenticated = true;
    
    return {
      user: this.user,
      tokens: {
        accessToken: 'mock-access-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
        expiresAt: Date.now() + 15 * 60 * 1000,
      },
    };
  }

  async logout(): Promise<void> {
    await this.delay(300);
    this.isAuthenticated = false;
  }

  async getUser(): Promise<User> {
    await this.delay(300);
    if (!this.isAuthenticated) {
      throw new Error('Not authenticated');
    }
    return this.user;
  }

  async updateUser(data: Partial<User>): Promise<User> {
    await this.delay(500);
    this.user = { ...this.user, ...data, updatedAt: new Date().toISOString() };
    return this.user;
  }

  // Video Methods
  async getVideos(filters?: VideoFilters): Promise<PaginatedResponse<Video>> {
    await this.delay(400);
    
    let filtered = [...this.videos];
    
    if (filters?.status) {
      filtered = filtered.filter(v => v.status === filters.status);
    }
    if (filters?.styleId) {
      filtered = filtered.filter(v => v.styleId === filters.styleId);
    }
    if (filters?.aspectRatio) {
      filtered = filtered.filter(v => v.aspectRatio === filters.aspectRatio);
    }
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(v => 
        v.title.toLowerCase().includes(searchLower) ||
        v.prompt.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort by createdAt desc by default
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return {
      items: filtered,
      pagination: {
        page: 1,
        limit: filtered.length,
        total: filtered.length,
        totalPages: 1,
      },
    };
  }

  async getVideo(id: string): Promise<Video> {
    await this.delay(300);
    const video = this.videos.find(v => v.id === id);
    if (!video) throw new Error('Video not found');
    return video;
  }

  async createVideo(input: CreateVideoInput): Promise<Video> {
    await this.delay(600);
    
    const newVideo: Video = {
      id: `vid-${Date.now()}`,
      userId: this.user.id,
      title: input.title,
      prompt: input.prompt,
      styleId: input.styleId,
      aspectRatio: input.aspectRatio,
      duration: input.duration,
      status: 'queued',
      templateId: input.templateId,
      metadata: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      thumbnailUrl: '',
    };
    
    this.videos.unshift(newVideo);
    this.videoProgress.set(newVideo.id, { status: 'queued', progress: 0 });
    
    // Simulate progress
    this.simulateVideoProgress(newVideo.id);
    // Generate a simple thumbnail data URL for demo previews
    newVideo.thumbnailUrl = this.generateThumbnailDataUrl(newVideo.title);
    
    return newVideo;
  }

  async updateVideo(id: string, data: Partial<Video>): Promise<Video> {
    await this.delay(400);
    const index = this.videos.findIndex(v => v.id === id);
    if (index === -1) throw new Error('Video not found');
    
    this.videos[index] = { 
      ...this.videos[index], 
      ...data, 
      updatedAt: new Date().toISOString() 
    };
    return this.videos[index];
  }

  async deleteVideo(id: string): Promise<void> {
    await this.delay(400);
    const index = this.videos.findIndex(v => v.id === id);
    if (index === -1) throw new Error('Video not found');
    this.videos.splice(index, 1);
    this.videoProgress.delete(id);
  }

  async getVideoProgress(id: string): Promise<VideoProgressEvent> {
    await this.delay(200);
    const progress = this.videoProgress.get(id);
    if (!progress) throw new Error('Video not found');
    
    return {
      videoId: id,
      status: progress.status,
      progress: progress.progress,
      message: this.getProgressMessage(progress.status, progress.progress),
    };
  }

  // Template Methods
  async getTemplates(filters?: TemplateFilters): Promise<PaginatedResponse<Template>> {
    await this.delay(400);
    
    let filtered = [...this.templates];
    
    if (filters?.style) {
      filtered = filtered.filter(t => t.defaultStyle === filters.style);
    }
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(t => 
        t.title.toLowerCase().includes(searchLower) ||
        t.basePrompt.toLowerCase().includes(searchLower)
      );
    }
    
    return {
      items: filtered,
      pagination: {
        page: 1,
        limit: filtered.length,
        total: filtered.length,
        totalPages: 1,
      },
    };
  }

  // Auto-generate a storyboard from a high-level prompt
  async generateStoryboard(prompt: string): Promise<Scene[]> {
    await this.delay(150);
    const base = prompt?.trim() || 'Storyboard from prompt';
    const scenes: Scene[] = [
      {
        id: 'scene-gen-Intro-' + Date.now(),
        title: 'Intro',
        prompt: `Intro: ${base}`,
        duration: 5,
        transition: 'Fade',
      },
      {
        id: 'scene-gen-Main-' + Date.now(),
        title: 'Main',
        prompt: `Main: ${base}`,
        duration: 12,
        transition: 'Slide',
      },
      {
        id: 'scene-gen-CTA-' + Date.now(),
        title: 'CTA',
        prompt: `CTA: ${base}`,
        duration: 5,
        transition: 'Fade',
      },
    ];
    return scenes;
  }

  async getTemplate(id: string): Promise<Template> {
    await this.delay(300);
    const template = this.templates.find(t => t.id === id);
    if (!template) throw new Error('Template not found');
    return template;
  }

  async createTemplate(input: CreateTemplateInput): Promise<Template> {
    await this.delay(500);
    
    const newTemplate: Template = {
      id: `tpl-${Date.now()}`,
      userId: this.user.id,
      ...input,
      isPublic: input.isPublic ?? false,
      usageCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    this.templates.unshift(newTemplate);
    return newTemplate;
  }

  async updateTemplate(id: string, data: Partial<Template>): Promise<Template> {
    await this.delay(400);
    const index = this.templates.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Template not found');
    
    this.templates[index] = { 
      ...this.templates[index], 
      ...data, 
      updatedAt: new Date().toISOString() 
    };
    return this.templates[index];
  }

  async deleteTemplate(id: string): Promise<void> {
    await this.delay(300);
    const index = this.templates.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Template not found');
    this.templates.splice(index, 1);
  }

  // Style Methods
  async getStyles(): Promise<Style[]> {
    await this.delay(300);
    return mockStyles;
  }

  // Usage Methods
  async getUsageStats(): Promise<UsageStats> {
    await this.delay(400);
    
    const stats: UsageStats = {
      userId: this.user.id,
      totalVideos: this.videos.length,
      queuedVideos: this.videos.filter(v => v.status === 'queued').length,
      processingVideos: this.videos.filter(v => v.status === 'processing').length,
      completedVideos: this.videos.filter(v => v.status === 'completed').length,
      failedVideos: this.videos.filter(v => v.status === 'failed').length,
      videosThisWeek: this.videos.filter(v => {
        const created = new Date(v.createdAt);
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return created > weekAgo;
      }).length,
      videosThisMonth: this.videos.filter(v => {
        const created = new Date(v.createdAt);
        const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        return created > monthAgo;
      }).length,
      videosWithFiles: this.videos.filter(v => v.fileUrl).length,
      styleBreakdown: {},
      aspectBreakdown: {},
    };
    
    // Calculate breakdowns
    this.videos.forEach(v => {
      stats.styleBreakdown[v.styleId] = (stats.styleBreakdown[v.styleId] || 0) + 1;
      stats.aspectBreakdown[v.aspectRatio] = (stats.aspectBreakdown[v.aspectRatio] || 0) + 1;
    });
    
    return stats;
  }

  // Helper Methods
  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private simulateVideoProgress(videoId: string): void {
    const updateProgress = () => {
      const current = this.videoProgress.get(videoId);
      if (!current) return;
      
      if (current.status === 'queued') {
        this.videoProgress.set(videoId, { status: 'processing', progress: 0 });
        const video = this.videos.find(v => v.id === videoId);
        if (video) {
          video.status = 'processing';
          video.updatedAt = new Date().toISOString();
        }
        setTimeout(updateProgress, 3000);
      } else if (current.status === 'processing') {
        const newProgress = Math.min(current.progress + 20, 100);
        this.videoProgress.set(videoId, { status: 'processing', progress: newProgress });
        
        if (newProgress >= 100) {
          // Complete the video
          setTimeout(() => {
            this.videoProgress.set(videoId, { status: 'completed', progress: 100 });
            const video = this.videos.find(v => v.id === videoId);
            if (video) {
              video.status = 'completed';
              video.fileUrl = `https://example.com/videos/${videoId}.mp4`;
              video.thumbnailUrl = `https://example.com/thumbnails/${videoId}.jpg`;
              video.metadata = {
                resolution: '1920x1080',
                fileSize: Math.floor(Math.random() * 10000000),
                format: 'mp4',
                generationTime: Math.floor(Math.random() * 120),
              };
              video.updatedAt = new Date().toISOString();
            }
          }, 1000);
        } else {
          setTimeout(updateProgress, 2000);
        }
      }
    };
    
    // Start progress simulation after 2 seconds
    setTimeout(updateProgress, 2000);
  }

  // New: expose a couple of lightweight public APIs for exporting data
  getVideos(): Video[] {
    return this.videos;
  }

  getTemplates(): Template[] {
    return this.templates;
  }

  // Publish a storyboard: create one video per scene in the storyboard
  async publishStoryboard(scenes: Scene[]): Promise<Video[]> {
    const created: Video[] = [];
    for (const s of scenes) {
      const input: CreateVideoInput = {
        title: s.title || `Storyboard Scene ${s.id}`,
        prompt: s.prompt,
        styleId: 'clean-motion',
        aspectRatio: '16:9',
        duration: s.duration || 5,
      };
      const v = await this.createVideo(input);
      created.push(v);
    }
    return created;
  }

  // Generate a prompt bundle from scenes
  async generatePromptBundle(scenes: Scene[]): Promise<{ bundleName: string; items: { sceneTitle: string; prompt: string; duration: number }[] }> {
    const items = scenes.map((sc) => ({ sceneTitle: sc.title || sc.id, prompt: sc.prompt, duration: sc.duration }));
    const bundleName = `StoryboardBundle_${Date.now()}`;
    return { bundleName, items };
  }
  // Simple in-file thumbnail generator (SVG data URL) for previews
  private generateThumbnailDataUrl(title: string): string {
    const safe = title.replace(/[^a-zA-Z0-9 ]/g, '');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#6366f1"/><stop stop-color="#8b5cf6"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#fff" font-family="Arial" font-size="20">${safe || 'Video'}</text></svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }

  private getProgressMessage(status: VideoStatus, progress: number): string {
    switch (status) {
      case 'queued':
        return 'Waiting in queue...';
      case 'processing':
        if (progress < 30) return 'Analyzing prompt and generating script...';
        if (progress < 60) return 'Creating visuals and animations...';
        if (progress < 90) return 'Rendering frames and adding effects...';
        return 'Finalizing video and encoding...';
      case 'completed':
        return 'Video generation complete!';
      case 'failed':
        return 'Generation failed. Please try again.';
      default:
        return '';
    }
  }
}

export const mockApi = new MockApi();
export default mockApi;
