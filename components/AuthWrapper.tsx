import React, { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/router';
import { verifyOwnership } from '../utils/solana';

export const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { connected, publicKey } = useWallet();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuthorization = async () => {
      setIsChecking(true);
      if (connected && publicKey) {
        try {
          const { isOwner } = await verifyOwnership(publicKey.toString());
          setIsAuthorized(isOwner);
          if (isOwner && router.pathname === '/auth') {
            router.push('/');
          } else if (!isOwner && router.pathname !== '/auth') {
            router.push('/auth');
          }
        } catch (error) {
          console.error('Error checking authorization:', error);
          setIsAuthorized(false);
          if (router.pathname !== '/auth') {
            router.push('/auth');
          }
        }
      } else {
        setIsAuthorized(false);
        if (router.pathname !== '/auth') {
          router.push('/auth');
        }
      }
      setIsChecking(false);
    };

    checkAuthorization();
  }, [connected, publicKey, router.pathname]);

  if (isChecking) {
    return <div>Loading...</div>;
  }

  if (!isAuthorized && router.pathname !== '/auth') {
    return null;
  }

  return <>{children}</>;
};
