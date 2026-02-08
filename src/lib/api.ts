const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function apiRequest(
  url: string,
  options: RequestInit = {},
) {
  const res = await fetch(`${API_BASE_URL}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Something went wrong');
  }

  return res.json();
}
