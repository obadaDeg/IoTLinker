import { useEffect, useState } from "react";

interface Channel {
  id: number;
  name: string;
  description?: string;
  is_public: boolean;
}

export function useChannels() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const response = await fetch("/api/v1/channels");
        if (!response.ok) {
          throw new Error("Failed to fetch channels");
        }
        const data = await response.json();
        setChannels(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChannels();
  }, []);

  return { channels, loading, error };
}