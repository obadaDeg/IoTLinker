import { ChannelDetails } from "@/components/channels/ChannelDetails";
import { Channel } from "@/types/channel";

// Mock data fetcher
async function getChannel(id: string): Promise<Channel> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    id: id,
    name: "Weather Station A",
    author: "User",
    access: "Private",
    created: "2023-12-01",
    updated: "2023-12-10",
    entries: 1540,
    fields: 4,
    lastUpdate: "2 mins ago",
    description: "Monitoring temp and humidity in garden",
    tags: ["weather", "outdoor"],
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
