import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../auth.provider';
import { Draw } from './types';

export const useGetDraw = (drawId: string) => {
  const { getToken } = useAuth();
  return useQuery<Draw>({
    queryKey: ['draws', drawId],
    queryFn: () =>
      fetch(`/api/draws/${drawId}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }).then((res) => res.json()),
  });
};
