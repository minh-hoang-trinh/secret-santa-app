import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../auth.provider';
import { Draw } from './types';

export const useGetResults = (drawId: string, enabled: boolean) => {
  const { getToken } = useAuth();
  return useQuery<{
    results: {
      sender: string;
      receiver: string;
      commentFromReceiver: string | null;
    }[];
  }>({
    enabled,
    queryKey: ['draws', drawId, 'results'],
    queryFn: () =>
      fetch(`/api/draws/${drawId}/results`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }).then((res) => res.json()),
  });
};
