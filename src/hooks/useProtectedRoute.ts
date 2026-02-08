'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';

const PUBLIC_ROUTES = ['/auth/login', '/auth/register'];

export const useProtectedRoute = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { isAuthenticated, isInitialized, init } = useAuthStore();

  useEffect(() => {
    init();
  }, []);

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
