import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

type Island = {
  id: number;
  name: string;
  name_en: string;
  slug: string;
  island_code: string | null;
  island_category: string | null;
  island_category_en: string | null;
  island_details: string | null;
  longitude: string | null;
  latitude: string | null;
  election_commission_code: string | null;
  postal_code: string | null;
  other_name_en: string | null;
  other_name_dv: string | null;
  list_order: number | null;
  atoll_id: number | null;
  created_at: string;
  atoll?: {
    id: number;
    name: string;
    name_en: string;
    slug: string;
  };
};

export function useIslands(atollIds?: number[]) {
  const [islands, setIslands] = useState<Island[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchIslands();
  }, [atollIds]);

  async function fetchIslands() {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('islands')
        .select(`
          *,
          atoll:atoll_id (
            id,
            name,
            name_en,
            slug
          )
        `)
        .order('list_order', { ascending: true });

      if (atollIds && atollIds.length > 0) {
        query = query.in('atoll_id', atollIds);
      }

      const { data, error: dbError } = await query;

      if (dbError) throw dbError;
      setIslands(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return {
    islands,
    loading,
    error,
    refresh: fetchIslands
  };
}