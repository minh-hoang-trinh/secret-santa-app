import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../auth.provider';

export const useParticipateDraw = (drawId: string) => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (comment: string) =>
      fetch(`/api/draws/${drawId}/participate`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comment }),
      }).then((res) => res.json()),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['draws'] });
    },
  });
};
