import { Roadmap } from "@/types/types";
import useSWR from "swr";
import apiClient from "../apiClient";

const fetcher = (url: string) => apiClient.get(url).then((res) => res.data);

export function useRoadmaps(userId: string | null | undefined) {
  const key = userId ? `/roadmaps?userId=${encodeURIComponent(userId)}` : null;

  const { data, error, isLoading, mutate } = useSWR<Roadmap[]>(key, fetcher);

  return {
    roadmaps: data ?? [],
    isLoading,
    error,
    refresh: mutate,
  };
}
