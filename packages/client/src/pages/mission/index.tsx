import * as React from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function MissionPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the basic swap mission
    router.replace('/mission/swap');
  }, [router]);

  return null; // This page will redirect immediately
}