/**
 * Channel Service
 * API calls for channel/group management
 */

import { apiClient, type ApiResponse } from '@/lib/api';
import type {
  Channel,
  ChannelCreate,
  ChannelUpdate,
  ChannelListResponse,
  ChannelFilters,
} from '@/types/channel';

export class ChannelService {
  /**
   * List all channels with pagination and filters
   */
  static async listChannels(filters: ChannelFilters): Promise<ApiResponse<ChannelListResponse>> {
    return apiClient.get<ChannelListResponse>('/api/v1/channels/', filters);
  }

  /**
   * Get a single channel by ID
   */
  static async getChannel(channelId: string, tenantId: string): Promise<ApiResponse<Channel>> {
    return apiClient.get<Channel>(`/api/v1/channels/${channelId}`, { tenant_id: tenantId });
  }

  /**
   * Create a new channel
   */
  static async createChannel(channel: ChannelCreate): Promise<ApiResponse<Channel>> {
    return apiClient.post<Channel>('/api/v1/channels/', channel);
  }

  /**
   * Update an existing channel
   */
  static async updateChannel(
    channelId: string,
    tenantId: string,
    channel: ChannelUpdate
  ): Promise<ApiResponse<Channel>> {
    return apiClient.put<Channel>(`/api/v1/channels/${channelId}`, channel, { tenant_id: tenantId });
  }

  /**
   * Delete a channel
   */
  static async deleteChannel(channelId: string, tenantId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/api/v1/channels/${channelId}`, { tenant_id: tenantId });
  }

  /**
   * Get all devices in a channel
   */
  static async getChannelDevices(
    channelId: string,
    tenantId: string,
    status?: string
  ): Promise<ApiResponse<{ devices: any[] }>> {
    const params: any = { tenant_id: tenantId };
    if (status) params.status = status;

    return apiClient.get<{ devices: any[] }>(`/api/v1/channels/${channelId}/devices`, params);
  }
}
