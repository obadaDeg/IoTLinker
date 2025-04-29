import { useChannels } from "@/components/hooks/useChannels";

export function ChannelList() {
  const { channels, loading, error } = useChannels();

  if (loading) return <div>Loading channels...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul className="space-y-4">
      {channels.map((channel) => (
        <li key={channel.id} className="p-4 border rounded-md shadow-sm">
          <h3 className="text-lg font-bold">{channel.name}</h3>
          <p>{channel.description || "No description available."}</p>
          <p className="text-sm text-gray-500">
            {channel.is_public ? "Public" : "Private"}
          </p>
        </li>
      ))}
    </ul>
  );
}