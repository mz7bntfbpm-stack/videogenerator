import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockApi } from '@/lib/mockApi';
import { queryKeys } from '@/lib/queryKeys';
import type { Template, TemplateFilters, CreateTemplateInput } from '@/types';

// Get list of templates with optional filters
export function useTemplates(filters?: TemplateFilters) {
  return useQuery({
    queryKey: queryKeys.templatesList(filters),
    queryFn: () => mockApi.getTemplates(filters),
  });
}

// Get single template by ID
export function useTemplate(id: string) {
  return useQuery({
    queryKey: queryKeys.template(id),
    queryFn: () => mockApi.getTemplate(id),
    enabled: !!id,
  });
}

// Create a new template
export function useCreateTemplate() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (input: CreateTemplateInput) => mockApi.createTemplate(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.templates });
    },
  });
}

// Update a template
export function useUpdateTemplate() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Template> }) => 
      mockApi.updateTemplate(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.template(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.templates });
    },
  });
}

// Delete a template
export function useDeleteTemplate() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => mockApi.deleteTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.templates });
    },
  });
}