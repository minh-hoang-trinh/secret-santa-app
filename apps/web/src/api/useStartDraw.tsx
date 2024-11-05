import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../auth.provider';

export const useStartDraw = (drawId: string) => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      fetch(`/api/draws/${drawId}/start`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getToken()}`,
          'Content-Type': 'application/json',
        },
      }).then((res) => res.json()),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['draws'] });
    },
  });
};
