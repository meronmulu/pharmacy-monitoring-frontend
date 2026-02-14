'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode, useState } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: Array<'ADMIN' | 'PHARMACIST' | 'CASHIER'>;
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      const userInStorage = localStorage.getItem('user');
      if (!userInStorage) {
        router.replace('/');
      } else {
        const parsed = JSON.parse(userInStorage);
        if (!allowedRoles.includes(parsed.role)) {
          router.replace('/dashboard/unauthorized');
        }
      }
    } else {
if (!allowedRoles.includes(user.role as 'ADMIN' | 'PHARMACIST' | 'CASHIER')) {
        router.replace('/dashboard/unauthorized');
      }

    }
  }, [user, allowedRoles, router]);


  return <>{children}</>;
};
