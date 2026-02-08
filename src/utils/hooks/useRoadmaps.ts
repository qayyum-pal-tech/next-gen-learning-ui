"use client";

import { Roadmap } from "@/types/types";
/**
 * useRoadmaps.ts
 *
 * Fetches every roadmap that belongs to `userId`.
 * Maps to:  GET /roadmaps?userId=:userId
 *
 * Usage:
 *   const { roadmaps, isLoading, error } = useRoadmaps(userId);
 *
 * The hook is automatically paused when `userId` is undefined / null / empty –
 * useful when you're still waiting for an auth context to hydrate.
 */

import useSWR from "swr";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export function useRoadmaps(userId: string | null | undefined) {
  // key is null when userId is falsy  →  SWR won't fire
  const key = userId
    ? `${BASE_URL}/roadmaps?userId=${encodeURIComponent(userId)}`
    : null;

  const { data, error, isLoading, mutate } = useSWR<Roadmap[]>(key);

  return {
    roadmaps: data ?? [], // always an array, never undefined
    isLoading,
    error, // Error | undefined
    /** manually re-fetch from the network */
    refresh: mutate,
  };
}
