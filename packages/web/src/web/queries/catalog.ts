import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { orpc } from "../lib/api";

export function useCategories() {
  return useQuery(orpc.catalog.categories.queryOptions({ staleTime: 5 * 60_000 }));
}

export function useFeatured(limit = 8) {
  return useQuery(orpc.catalog.featured.queryOptions({ input: { limit }, staleTime: 5 * 60_000 }));
}

export function useSearch(q: string, limit = 6) {
  const term = q.trim();
  return useQuery(
    orpc.catalog.search.queryOptions({
      input: { q: term, limit },
      enabled: term.length >= 2,
      placeholderData: keepPreviousData,
      staleTime: 30_000,
    }),
  );
}
