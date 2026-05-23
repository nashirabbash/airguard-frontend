import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDevices, createDevice, updateDevice, deleteDevice } from '../utils/api';
import type { Device } from '../types';

export function useDevicesQuery(userId?: number) {
  return useQuery({
    queryKey: ['devices', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is missing');
      const res = await getDevices(userId);
      if (!res.success || !res.data) {
        throw new Error(res.message || 'Gagal mengambil daftar perangkat');
      }
      return res.data;
    },
    enabled: !!userId,
  });
}

export function useCreateDevice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (deviceConfig: Omit<Device, 'userId' | 'createdAt' | 'updatedAt'>) => {
      const res = await createDevice(deviceConfig);
      if (!res.success || !res.data) {
        throw new Error(res.message || 'Gagal mendaftarkan perangkat');
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
    },
  });
}

export function useUpdateDevice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      deviceId,
      config,
    }: {
      deviceId: string;
      config: Omit<Device, 'deviceId' | 'userId' | 'createdAt' | 'updatedAt'>;
    }) => {
      const res = await updateDevice(deviceId, config);
      if (!res.success || !res.data) {
        throw new Error(res.message || 'Gagal mengubah perangkat');
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
    },
  });
}

export function useDeleteDevice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (deviceId: string) => {
      const res = await deleteDevice(deviceId);
      if (!res.success) {
        throw new Error(res.message || 'Gagal menghapus perangkat');
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
    },
  });
}
