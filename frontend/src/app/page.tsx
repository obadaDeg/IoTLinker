// pages/index.tsx
'use client';
import ChannelGrid from '@/components/channels/ChannelGrid';
import ChannelHeader from '@/components/channels/ChannelHeader';
import ChannelList from '@/components/channels/ChannelList';
import SearchFilter from '@/components/channels/SearchFilter';
import Layout from '@/components/layout/Layout';
import { mockChannels } from '@/constants/mockChannels';
import { ViewMode } from '@/types';
import { Channel } from '@/types/channel';
import { useState, ChangeEvent, useCallback } from 'react';


export default function Home() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [channels, setChannels] = useState<Channel[]>(mockChannels);
  

  const handleSearchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleNewChannel = useCallback(() => {
    // TODO: Implement new channel creation logic
    console.log('Create new channel');
  }, []);

  const filteredChannels = channels.filter(channel => 
    channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    channel.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    channel.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Layout title="IoTLinker | My Channels">
      <ChannelHeader onNewChannel={handleNewChannel} />
      <SearchFilter
        viewMode={viewMode} 
        setViewMode={setViewMode}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />
      
      {viewMode === 'grid' ? (
        <ChannelGrid channels={filteredChannels} />
      ) : (
        <ChannelList channels={filteredChannels} />
      )}
    </Layout>
  );
}