import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUserTags, saveOnboardingTags } from '@/services/tag.api';
import { UpdateUserTagRequest, OnboardingTagRequest } from '@/models/tag.model';
import { TAG_KEYS } from '../query/tag.query';

export function useUpdateUserTags() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateUserTagRequest) => updateUserTags(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TAG_KEYS.myChildTags });
    },
  });
}

export function useSaveOnboardingTags() {
  return useMutation({
    mutationFn: (body: OnboardingTagRequest) => saveOnboardingTags(body),
  });
}
