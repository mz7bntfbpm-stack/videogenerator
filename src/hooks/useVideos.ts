import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockApi } from '@/lib/mockApi';
import { queryKeys } from '@/lib/queryKeys';
import type { Video, VideoFilters, CreateVideoInput, VideoProgressEvent } from '@/types';

// Get list of videos with optional filters
export function useVideos(filters?: VideoFilters) {
  return useQuery({
    queryKey: queryKeys.videosList(filters),
    queryFn: () => mockApi.getVideos(filters),
  });
}

// Get single video by ID
export function useVideo(id: string) {
  return useQuery({
    queryKey: queryKeys.video(id),
    queryFn: () => mockApi.getVideo(id),
    enabled: !!id,
  });
}

// Get video generation progress (auto-polls for processing videos)
export function useVideoProgress(id: string) {
  return useQuery<VideoProgressEvent, Error>({
    queryKey: queryKeys.videoProgress(id),
    queryFn: () => mockApi.getVideoProgress(id),
    enabled: !!id,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data) return false;
      
      // Poll every 3 seconds while processing
      if (data.status === 'processing') return 3000;
      // Poll every 5 seconds while queued
      if (data.status === 'queued') return 5000;
      // Stop polling for completed or failed
      return false;
    },
  });
}

// Create a new video
export function useCreateVideo() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (input: CreateVideoInput) => mockApi.createVideo(input),
    onSuccess: () => {
      // Invalidate videos list and usage stats
      queryClient.invalidateQueries({ queryKey: queryKeys.videos });
      queryClient.invalidateQueries({ queryKey: queryKeys.usageStats });
    },
  });
}

// Update a video
export function useUpdateVideo() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Video> }) => 
      mockApi.updateVideo(id, data),
    onSuccess: (_, variables) => {
      // Invalidate specific video and list
      queryClient.invalidateQueries({ queryKey: queryKeys.video(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.videos });
    },
  });
}

// Delete a video
export function useDeleteVideo() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => mockApi.deleteVideo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.videos });
      queryClient.invalidateQueries({ queryKey: queryKeys.usageStats });
    },
  });
}