import { useQuery } from '@tanstack/react-query';
import { mockApi } from '@/lib/mockApi';
import { queryKeys } from '@/lib/queryKeys';
import type { Style, UsageStats } from '@/types';

// Get available video styles
export function useStyles() {
  return useQuery<Style[]>({
    queryKey: queryKeys.styles,
    queryFn: () => mockApi.getStyles(),
    staleTime: 1000 * 60 * 60, // Styles rarely change, cache for 1 hour
  });
}

// Get usage statistics
export function useUsageStats() {
  return useQuery<UsageStats>({
    queryKey: queryKeys.usageStats,
    queryFn: () => mockApi.getUsageStats(),
    staleTime: 1000 * 60, // Cache for 1 minute
  });
}