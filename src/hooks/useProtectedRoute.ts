'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { getMe } from '@/app/teams/services/users.service';

const PUBLIC_ROUTES = ['/auth/login', '/auth/register'];

export const useProtectedRoute = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { isAuthenticated, isInitialized, user, init, setUser } = useAuthStore();

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      if (isAuthenticated && !user) {
        try {
          const userData = await getMe();
          setUser(userData);
        } catch (error) {
          console.error('Failed to fetch user:', error);
        }
      }
    };
    fetchUser();
  }, [isAuthenticated, user, setUser]);

  useEffect(() => {
    if (!isInitialized) return;

    const isPublic = PUBLIC_ROUTES.includes(pathname);

    if (!isAuthenticated && !isPublic) {
      router.replace('/auth/login');
      return;
    }

    // OPTIONAL: prevent logged-in users from seeing login/register
    if (isAuthenticated && isPublic) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isInitialized, pathname]);
};
