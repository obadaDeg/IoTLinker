import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Channel } from '@/types/channel';

export function useRealtimeChannelData(channelId: string) {
  const [data, setData] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Initial data fetch
    const fetchData = async () => {
      try {
        const { data: channelData, error } = await supabase
          .from('channel_data')
          .select('*')
          .eq('channel_id', channelId)
          .order('timestamp', { ascending: false })
          .limit(100);

        if (error) throw error;
        setData(channelData as Channel[] || []);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Set up real-time subscription
    const subscription = supabase
      .channel(`channel-${channelId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'channel_data',
        filter: `channel_id=eq.${channelId}`,
      }, (payload) => {
        const newChannelData = payload.new as Channel;
        setData((current) => [newChannelData, ...current].slice(0, 100));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [channelId]);

  return { data, loading, error };
}