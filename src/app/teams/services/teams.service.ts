import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* -------- CREATE -------- */
export const createTeam = async (data: {
  teamName: string;
  description?: string;
  members?: string[];
}) => {
  const res = await api.post('/teams', data);
  return res.data;
};

/* -------- READ -------- */
export const getCreatedTeams = async () => {
  const res = await api.get('/teams/created');
  return res.data; // ✅ array
};

export const getJoinedTeams = async () => {
  const res = await api.get('/teams/joined');
  return res.data; // ✅ array
};

export const getTeamById = async (teamId: string) => {
  const res = await api.get(`/teams/${teamId}`);
  return res.data;
};

/* -------- UPDATE -------- */
export const updateTeam = async (teamId: string, data: any) => {
  const res = await api.patch(`/teams/${teamId}`, data);
  return res.data;
};

/* -------- MEMBERS -------- */
export const addMembers = async (teamId: string, members: string[]) => {
  const res = await api.post(`/teams/${teamId}/members`, { members });
  return res.data;
};

export const removeMember = async (teamId: string, memberId: string) => {
  const res = await api.delete(`/teams/${teamId}/members/${memberId}`);
  return res.data;
};

export const exitTeam = async (teamId: string) => {
  const res = await api.post(`/teams/${teamId}/exit`);
  return res.data;
};

/* -------- DELETE -------- */
export const deleteTeam = async (teamId: string) => {
  const res = await api.delete(`/teams/${teamId}`);
  return res.data;
};


export const getAvailableUsers = async (
  teamId: string,
  search = '',
) => {
  const res = await api.get(
    `/teams/${teamId}/available-users`,
    { params: { search } },
  );
  return res.data; // array of users
};


export const shareRoadmap = async (payload: {
  roadmapId: string | undefined;
  shareType: 'TEAM' | 'USERS';
  teamId?: string;
  userIds?: string[];
  sharedBy?: string;
}) => {
  const res = await api.post('/roadmaps/share', payload);
  return res.data;
};


export const searchUsers = async (query: string) => {
  const res = await api.get('/users/search', {
    params: { q: query },
  });
  return res.data;
};