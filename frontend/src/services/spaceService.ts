/**
 * Space Service
 * API calls for space/group management
 */

import { apiClient, type ApiResponse } from '@/lib/api';
import type {
  Space,
  SpaceCreate,
  SpaceUpdate,
  SpaceListResponse,
  SpaceFilters,
} from '@/types/space';

export class SpaceService {
  /**
   * List all spaces with pagination and filters
   */
  static async listSpaces(filters: SpaceFilters): Promise<ApiResponse<SpaceListResponse>> {
    return apiClient.get<SpaceListResponse>('/api/v1/spaces/', filters);
  }

  /**
   * Get a single space by ID
   */
  static async getSpace(spaceId: string, tenantId: string): Promise<ApiResponse<Space>> {
    return apiClient.get<Space>(`/api/v1/spaces/${spaceId}`, { tenant_id: tenantId });
  }

  /**
   * Create a new space
   */
  static async createSpace(space: SpaceCreate): Promise<ApiResponse<Space>> {
    return apiClient.post<Space>('/api/v1/spaces/', space);
  }

  /**
   * Update an existing space
   */
  static async updateSpace(
    spaceId: string,
    tenantId: string,
    space: SpaceUpdate
  ): Promise<ApiResponse<Space>> {
    return apiClient.put<Space>(`/api/v1/spaces/${spaceId}`, space, { tenant_id: tenantId });
  }

  /**
   * Delete a space
   */
  static async deleteSpace(spaceId: string, tenantId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/api/v1/spaces/${spaceId}`, { tenant_id: tenantId });
  }

  /**
   * Get all devices in a space
   */
  static async getSpaceDevices(
    spaceId: string,
    tenantId: string,
    status?: string
  ): Promise<ApiResponse<{ devices: any[] }>> {
    const params: any = { tenant_id: tenantId };
    if (status) params.status = status;

    return apiClient.get<{ devices: any[] }>(`/api/v1/spaces/${spaceId}/devices`, params);
  }
}
