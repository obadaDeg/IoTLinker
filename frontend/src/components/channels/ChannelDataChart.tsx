import { useRealtimeChannelData } from '@/components/hooks/useRealtimeChannelData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Channel } from '@/types/channel';

interface ChannelDataChartProps {
  channelId: string;
  timeRange?: string; // Optional time range prop
}

export function ChannelDataChart({ channelId, timeRange }: ChannelDataChartProps) {
  const { data, loading, error } = useRealtimeChannelData(channelId);

  if (loading) return <div>Loading data...</div>;
  if (error) return <div>Error loading data: {error.message}</div>;

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data as Channel[]}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="timestamp" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}