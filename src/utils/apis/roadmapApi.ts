import { Roadmap } from "@/types/types";
import apiClient from "../apiClient";

/* ─── GET /roadmaps?userId=:userId ─── */
export async function fetchRoadmaps(userId: string): Promise<Roadmap[]> {
  const res = await apiClient.get<Roadmap[]>(`/roadmaps`, {
    params: { userId },
  });
  return res.data;
}

/* ─── GET /roadmaps/:id?userId=:userId ─── */
export async function fetchRoadmap(
  id: string,
  userId: string
): Promise<Roadmap> {
  const res = await apiClient.get<Roadmap>(`/roadmaps/${id}`, {
    params: { userId },
  });
  return res.data;
}

/* ─── PATCH /roadmaps/:id/topics/:topicOrder?userId=:userId ─── */
export async function markTopicCompleted(
  id: string,
  userId: string,
  topicOrder: number,
  completed: boolean
): Promise<Roadmap> {
  const res = await apiClient.patch<Roadmap>(
    `/roadmaps/${id}/topics/${topicOrder}`,
    { topicCompleted: completed },
    { params: { userId } }
  );
  return res.data;
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
  const res = await apiClient.patch<Roadmap>(
    `/roadmaps/${id}/topics/${topicOrder}/subtopics/${subtopicOrder}`,
    {
      subtopicCompleted: completed,
      ...(notes !== undefined && { notes }),
    },
    { params: { userId } }
  );
  return res.data;
}

/* ─── GET /roadmaps/team/:teamId ─── */
export async function fetchTeamRoadmaps(teamId: string): Promise<any[]> {
  const res = await apiClient.get<any[]>(`/roadmaps/team/${teamId}`);
  return res.data;
}

/* ─── GET /roadmaps/team/:teamId/roadmap/:roadmapId/progress ─── */
export async function fetchTeamRoadmapProgress(
  teamId: string,
  roadmapId: string
): Promise<{ roadmap: Roadmap; membersProgress: any[] }> {
  const res = await apiClient.get<{ roadmap: Roadmap; membersProgress: any[] }>(
    `/roadmaps/team/${teamId}/roadmap/${roadmapId}/progress`
  );
  return res.data;
}
