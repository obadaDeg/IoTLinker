/**
 * useSpaces Hook
 * React hook for managing spaces with loading and error states
 */

import { useState, useEffect, useCallback } from 'react';
import { SpaceService } from '@/services/spaceService';
import type { Space, SpaceFilters } from '@/types/space';

interface UseSpacesOptions {
  filters: SpaceFilters;
  autoFetch?: boolean;
}

interface UseSpacesReturn {
  spaces: Space[];
  total: number;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useSpaces({ filters, autoFetch = true }: UseSpacesOptions): UseSpacesReturn {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSpaces = useCallback(async () => {
    setLoading(true);
    setError(null);

    const response = await SpaceService.listSpaces(filters);

    if (response.error) {
      setError(response.error);
      setSpaces([]);
      setTotal(0);
    } else if (response.data) {
      setSpaces(response.data.spaces);
      setTotal(response.data.total);
    }

    setLoading(false);
  }, [
    filters.tenant_id,
    filters.search,
    filters.page,
    filters.page_size,
  ]);

  useEffect(() => {
    if (autoFetch) {
      fetchSpaces();
    }
  }, [autoFetch, fetchSpaces]);

  return {
    spaces,
    total,
    loading,
    error,
    refetch: fetchSpaces,
  };
}
