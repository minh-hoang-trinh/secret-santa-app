import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../auth.provider';

export const useUpdateBlacklist = (drawId: string) => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (blacklistUserIds: string[]) =>
      fetch(`/api/draws/${drawId}/blacklist`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ blacklistUserIds }),
      }).then((res) => res.text()),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['draws', drawId, 'blacklist'],
      });
    },
  });
};
