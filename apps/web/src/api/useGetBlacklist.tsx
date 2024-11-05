import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../auth.provider';

export const useGetBlacklist = (drawId: string) => {
  const { getToken } = useAuth();
  return useQuery<{ blacklist: string[] }>({
    queryKey: ['draws', drawId, 'blacklist'],
    queryFn: () =>
      fetch(`/api/draws/${drawId}/blacklist`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }).then((res) => res.json()),
  });
};
