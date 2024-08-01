'use client';
import { useEffect } from 'react';

export const MSWComponent = () => {
  useEffect(() => {
    // console.log(process.env.NEXT_PUBLIC_API_MOCKING);
    if (typeof window !== 'undefined') {
      if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
        console.log('목서비스');
        require('@/mocks/browser');
      }
    }
  }, []);

  return null;
};
