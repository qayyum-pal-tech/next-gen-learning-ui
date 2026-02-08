/**
 * roadmapApi.ts
 *
 * Thin, framework-agnostic wrappers around every endpoint exposed by
 * RoadmapController.  All functions throw on non-2xx so callers (SWR hooks,
 * tests, etc.) can catch uniformly.
 *
 * BASE_URL – set this to wherever your NestJS server lives.
 *   • In development  → "http://localhost:3000"
 *   • In production   → pulled from an env var via Next.js or your bundler
 *
 * Adjust the constant below (or replace with process.env / env config) to
 * match your setup.
 */

import { Roadmap } from "@/types/types";

/* ─── config ─── */
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

/* ─── shared helpers ─── */

/** Throw a readable error when the server returns non-2xx. */
async function assertOk(res: Response): Promise<void> {
  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const body = await res.text();
      if (body) message += ` – ${body}`;
    } catch {
      // ignore parse failure
    }
    throw new Error(message);
  }
}

/* ─── GET /roadmaps?userId=:userId ─── */
export async function fetchRoadmaps(userId: string): Promise<Roadmap[]> {
  const res = await fetch(
    `${BASE_URL}/roadmaps?userId=${encodeURIComponent(userId)}`
  );
  await assertOk(res);
  return res.json();
}

/* ─── GET /roadmaps/:id?userId=:userId ─── */
export async function fetchRoadmap(
  id: string,
  userId: string
): Promise<Roadmap> {
  const res = await fetch(
    `${BASE_URL}/roadmaps/${encodeURIComponent(id)}?userId=${encodeURIComponent(
      userId
    )}`
  );
  await assertOk(res);
  return res.json();
}

/* ─── PATCH /roadmaps/:id/topics/:topicOrder?userId=:userId ─── */
export async function markTopicCompleted(
  id: string,
  userId: string,
  topicOrder: number,
  completed: boolean
): Promise<Roadmap> {
  const res = await fetch(
    `${BASE_URL}/roadmaps/${encodeURIComponent(
      id
    )}/topics/${topicOrder}?userId=${encodeURIComponent(userId)}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topicCompleted: completed }),
    }
  );
  await assertOk(res);
  return res.json();
}

/* ─── PATCH /roadmaps/:id/topics/:topicOrder/subtopics/:subtopicOrder?userId=:userId ─── */
export async function markSubtopicCompleted(
  id: string,
  userId: string,
  topicOrder: number,
  subtopicOrder: number,
  completed: boolean,
  notes?: string
): Promise<Roadmap> {
  const res = await fetch(
    `${BASE_URL}/roadmaps/${encodeURIComponent(
      id
    )}/topics/${topicOrder}/subtopics/${subtopicOrder}?userId=${encodeURIComponent(
      userId
    )}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subtopicCompleted: completed,
        ...(notes !== undefined && { notes }),
      }),
    }
  );
  await assertOk(res);
  return res.json();
}
