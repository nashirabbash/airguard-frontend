import { useQuery } from '@tanstack/react-query';
import { getMe } from '../utils/api';
import { useAppSelector } from '../store/hooks';

export function useMeQuery() {
  const token = useAppSelector((state) => state.auth.token);

  return useQuery({
    queryKey: ['me', token],
    queryFn: async () => {
      const res = await getMe();
      if (!res.success || !res.data) {
        throw new Error(res.message || 'Gagal mengambil data pengguna');
      }
      return res.data;
    },
    enabled: !!token,
    retry: false,
  });
}
