import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../auth.provider';
import { Draw } from './types';

export const useListDraws = () => {
  const { getToken } = useAuth();
  return useQuery<{ draws: Draw[]; total: number; skip: number; take: number }>(
    {
      queryKey: ['draws'],
      queryFn: () =>
        fetch('/api/draws', {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }).then((res) => res.json()),
    }
  );
};
