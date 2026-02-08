"use client";

/**
 * useRoadmap.ts
 *
 * Fetches a single roadmap and exposes mutation helpers that:
 *   1. Optimistically update the SWR cache  (instant UI feedback)
 *   2. Fire the real PATCH to your NestJS backend
 *   3. Revalidate from the server response   (source of truth wins)
 *
 * Maps to:
 *   GET    /roadmaps/:id?userId=:userId
 *   PATCH  /roadmaps/:id/topics/:topicOrder?userId=:userId
 *   PATCH  /roadmaps/:id/topics/:topicOrder/subtopics/:subtopicOrder?userId=:userId
 *
 * Usage:
 *   const { roadmap, isLoading, error, markSubtopicDone, markTopicDone } =
 *     useRoadmap(roadmapId, userId);
 */

import useSWR from "swr";
import { useCallback } from "react";
import { Roadmap } from "@/types/types";
import { markSubtopicCompleted, markTopicCompleted } from "../apis/roadmapApi";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/** Build the SWR cache key for a single roadmap. Exported so other hooks can
 *  mutate the same key if needed (e.g. after creating a roadmap). */
export function roadmapKey(id: string, userId: string): string {
  return `${BASE_URL}/roadmaps/${encodeURIComponent(
    id
  )}?userId=${encodeURIComponent(userId)}`;
}

export function useRoadmap(
  id: string | null | undefined,
  userId: string | null | undefined
) {
  const key = id && userId ? roadmapKey(id, userId) : null;
  console.log("key",key);
  const { data, error, isLoading, mutate } = useSWR<Roadmap>(key);

  /* ── optimistic helper: clone & patch the local Roadmap object ── */
  const patchLocally = useCallback(
    (fn: (draft: Roadmap) => Roadmap) => {
      if (!data) return;
      // mutate with a function so SWR gives us the latest cached value
      mutate((current) => (current ? fn({ ...current }) : current), false);
    },
    [data, mutate]
  );

  /* ─── mark a single subtopic done / undone ─── */
  const markSubtopicDone = useCallback(
    async (
      topicOrder: number,
      subtopicOrder: number,
      completed: boolean,
      notes?: string
    ) => {
      if (!id || !userId || !data) return;

      // 1. optimistic update
      patchLocally((draft) => {
        const topic = draft.topics.find((t) => t.order === topicOrder);
        if (topic) {
          const sub = topic.subtopics.find((s) => s.order === subtopicOrder);
          if (sub) {
            sub.isCompleted = completed;
            if (notes !== undefined) sub.notes = notes;
          }
        }
        return draft;
      });

      // 2. fire PATCH  →  3. revalidate with server response
      try {
        const updated = await markSubtopicCompleted(
          id,
          userId,
          topicOrder,
          subtopicOrder,
          completed,
          notes
        );
        mutate(updated); // replace cache with authoritative server data
      } catch (err) {
        // rollback: re-fetch from server
        mutate();
        throw err; // let the caller handle / toast
      }
    },
    [id, userId, data, patchLocally, mutate]
  );

  /* ─── mark a whole topic done / undone (quiz owner calls this after quiz pass) ─── */
  const markTopicDone = useCallback(
    async (topicOrder: number, completed: boolean) => {
      if (!id || !userId || !data) return;

      // 1. optimistic
      patchLocally((draft) => {
        const topic = draft.topics.find((t) => t.order === topicOrder);
        if (topic) topic.isCompleted = completed;
        return draft;
      });

      // 2. PATCH  →  3. revalidate
      try {
        const updated = await markTopicCompleted(
          id,
          userId,
          topicOrder,
          completed
        );
        mutate(updated);
      } catch (err) {
        mutate(); // rollback
        throw err;
      }
    },
    [id, userId, data, patchLocally, mutate]
  );

  return {
    roadmap: data ?? null,
    isLoading,
    error, // Error | undefined
    /** hard re-fetch from network */
    refresh: () => mutate(),
    /** mark subtopic completed/uncompleted */
    markSubtopicDone,
    /** mark topic completed – quiz owner wires this */
    markTopicDone,
  };
}
