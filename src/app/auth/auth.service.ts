const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function registerUser(data: {
  email: string;
  username: string;
  password: string;
}) {


  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Registration failed');
  }

  return res.json();
}

export async function loginUser(data: {
  email: string;
  password: string;
}) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Login failed');
  }

  return res.json();
}
