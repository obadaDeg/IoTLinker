import { Channel } from "./channel";


export type ChannelListProps = {
  channels: Channel[];
  viewMode: ViewMode;
};
export type ViewMode = 'grid' | 'list';
