import { Roadmap } from "@/types/types";
import apiClient from "../apiClient";

/* ─── GET /roadmaps?userId=:userId ─── */
export async function fetchRoadmaps(userId: string): Promise<Roadmap[]> {
  const res = await apiClient.get<Roadmap[]>(`/roadmaps`, {
    params: { userId },
  });
  return res.data;
}

/* ─── POST /roadmaps ─── */
export async function createRoadmap(data: {
  subject: string;
  userId: string;
  difficultyLevel?: string;
  additionalContext?: string;
}): Promise<Roadmap> {
  const res = await apiClient.post<Roadmap>(`/roadmaps`, data);
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

/* ─── POST /learning-logs ─── */
export async function postLearningLog(data: {
  roadmapId: string;
  topicTitle: string;
  minutesSpent: number;
  trackedMinutes: number;
  notes?: string;
}): Promise<any> {
  const res = await apiClient.post('/learning-logs', data);
  return res.data;
}

/* ─── GET /admin/stats ─── */
export async function fetchAdminStats(): Promise<{
  userCount: number;
  roadmapCount: number;
  totalLearningMinutes: number;
  averageProgress: number;
}> {
  const res = await apiClient.get('/admin/stats');
  return res.data;
}

/* ─── GET /admin/logs ─── */
export async function fetchAdminLogs(): Promise<any[]> {
  const res = await apiClient.get('/admin/logs');
  return res.data;
}

/* ─── PATCH /roadmaps/:id/acceptance ─── */
export async function updateRoadmapStatus(
  id: string,
  userId: string,
  status: 'accepted' | 'denied'
): Promise<any> {
  const res = await apiClient.patch(`/roadmaps/${id}/acceptance`,
    { status },
    { params: { userId } }
  );
  return res.data;
}
