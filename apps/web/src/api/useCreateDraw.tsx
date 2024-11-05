import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../auth.provider';

export const useCreateDraw = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) =>
      fetch('/api/draws', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      }).then((res) => res.json()),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['draws'] });
    },
  });
};
