'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const user = authService.getUser();
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [router]);

  return null;
}