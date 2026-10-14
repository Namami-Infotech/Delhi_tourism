'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import authService from '../../services/auth.service';

export default function AdminRootPage() {
  const router = useRouter();

  useEffect(() => {
    if (authService.isAuthenticated()) {
      router.replace('/admin/dashboard');
    } else {
      router.replace('/admin/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf7f2]">
      <div className="w-8 h-8 border-3 border-amber-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
