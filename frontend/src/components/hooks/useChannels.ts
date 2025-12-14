/**
 * useChannels Hook
 * React hook for managing channels with loading and error states
 */

import { useState, useEffect, useCallback } from 'react';
import { ChannelService } from '@/services/channelService';
import type { Channel, ChannelFilters } from '@/types/channel';

interface UseChannelsOptions {
  filters: ChannelFilters;
  autoFetch?: boolean;
}

interface UseChannelsReturn {
  channels: Channel[];
  total: number;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useChannels({ filters, autoFetch = true }: UseChannelsOptions): UseChannelsReturn {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChannels = useCallback(async () => {
    setLoading(true);
    setError(null);

    const response = await ChannelService.listChannels(filters);

    if (response.error) {
      setError(response.error);
      setChannels([]);
      setTotal(0);
    } else if (response.data) {
      setChannels(response.data.channels);
      setTotal(response.data.total);
    }

    setLoading(false);
  }, [
    filters.tenant_id,
    filters.search,
    filters.page,
    filters.page_size,
  ]);

  useEffect(() => {
    if (autoFetch) {
      fetchChannels();
    }
  }, [autoFetch, fetchChannels]);

  return {
    channels,
    total,
    loading,
    error,
    refetch: fetchChannels,
  };
}