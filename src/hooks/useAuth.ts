import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockApi } from '@/lib/mockApi';
import { api } from '@/lib/api';
import { queryKeys } from '@/lib/queryKeys';
import type { User, LoginCredentials, SignUpCredentials } from '@/types';

// Get current user
export function useUser() {
  return useQuery<User, Error>({
    queryKey: queryKeys.user,
    queryFn: () => mockApi.getUser(),
    retry: false,
  });
}

// Login mutation
export function useLogin() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const result = await mockApi.login(credentials);
      api.setTokens(result.tokens.accessToken, result.tokens.refreshToken);
      return result;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.user, data.user);
    },
  });
}

// Register mutation
export function useRegister() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (credentials: SignUpCredentials) => {
      const result = await mockApi.register(credentials);
      api.setTokens(result.tokens.accessToken, result.tokens.refreshToken);
      return result;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.user, data.user);
    },
  });
}

// Logout mutation
export function useLogout() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => mockApi.logout(),
    onSuccess: () => {
      api.clearTokens();
      queryClient.clear();
    },
  });
}

// Update user profile
export function useUpdateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<User>) => mockApi.updateUser(data),
    onSuccess: (user) => {
      queryClient.setQueryData(queryKeys.user, user);
    },
  });
}