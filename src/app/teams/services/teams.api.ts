const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export type Team = {
  _id: string;
  teamName: string;
  createdBy: string;
  members: string[];
};

export async function getTeams(): Promise<Team[]> {
  const res = await fetch(`${BASE_URL}/teams`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch teams');
  return res.json();
}

export async function createTeam(teamName: string) {
  const res = await fetch(`${BASE_URL}/teams`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ teamName, members: [] }),
  });

  if (!res.ok) throw new Error('Failed to create team');
  return res.json();
}

export async function getTeamById(id: string): Promise<Team> {
  const res = await fetch(`${BASE_URL}/teams/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch team');
  return res.json();
}

export async function addMembers(teamId: string, members: string[]) {
  return fetch(`${BASE_URL}/teams/${teamId}/members`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ members }),
  });
}

export async function removeMember(teamId: string, memberId: string) {
  return fetch(`${BASE_URL}/teams/${teamId}/members/${memberId}`, {
    method: 'DELETE',
  });
}

