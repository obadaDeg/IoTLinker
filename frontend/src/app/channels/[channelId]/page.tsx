import { ChannelDetails } from "@/components/channels/ChannelDetails";
import { Channel } from "@/types/channel";

// Mock data fetcher
async function getChannel(id: string): Promise<Channel> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    id: id,
    tenant_id: "10000000-0000-0000-0000-000000000001",
    name: "Weather Station A",
    created_by: "user-123",
    created_at: "2023-12-01T10:00:00Z",
    updated_at: "2023-12-10T12:00:00Z",
    description: "Monitoring temp and humidity in garden",
    metadata: {
        entries: 1540,
        fields: 4,
        lastUpdate: "2 mins ago",
        tags: ["weather", "outdoor"],
        access: "Private"
    },
  };
}

export default async function ChannelDetailsPage({
  params,
}: {
  params: Promise<{ channelId: string }>;
}) {
  const { channelId } = await params;
  const channel = await getChannel(channelId);

  return (
    <div>
      <ChannelDetails channel={channel} />
    </div>
  );
}
