import React, { useEffect, useState, ReactNode } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/router';
import { verifyOwnership } from '../utils/solana';
import { useSession } from "next-auth/react"

interface AuthWrapperProps {
  children: (props: {
    isAuthorized: boolean;
    isLoading: boolean;
    authState: string;
    handleSignMessage: () => Promise<void>;
    handleDisconnect: () => void;
  }) => ReactNode;
}

export const AuthWrapper = ({ children }: AuthWrapperProps): JSX.Element => {
  const { data: session, status } = useSession()
  const { connected, publicKey, signMessage, disconnect } = useWallet();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authState, setAuthState] = useState('initial');

  useEffect(() => {
    const checkAuthorization = async () => {
      if (!connected || !publicKey) {
        setIsAuthorized(false);
        setAuthState('disconnected');
        setIsLoading(false);
        if (router.pathname !== '/who?') {
          router.push('/who?');
        }
        return;
      }

      setIsLoading(true);
      setAuthState('verifying');
      try {
        const ownershipResult = await verifyOwnership(publicKey.toString());
        if (ownershipResult) {
          const { isOwner, debugInfo } = ownershipResult;
          console.log('Debug Info:', debugInfo);
          setIsAuthorized(isOwner);
          setAuthState(isOwner ? 'authorized' : 'unauthorized');

          if (isOwner && router.pathname === '/who?') {
            router.push('/');
          } else if (!isOwner && router.pathname !== '/who?') {
            router.push('/who?');
          }
        } else {
          setAuthState('error');
        }
      } catch (error) {
        console.error('Error checking authorization:', error);
        setAuthState('error');
      }
      setIsLoading(false);
    };

    checkAuthorization();
  }, [connected, publicKey, router.pathname]);

  const handleSignMessage = async () => {
    if (!publicKey) return;

    setAuthState('signing');
    try {
      const message = new TextEncoder().encode(
        `Syndikat DAO Verification\n${new Date().toISOString()}\n\n` +
'This signature confirms your wallet ownership and token balance.\n' +
'No fees. By signing, you accept our terms and privacy policy.'
      );
      await signMessage?.(message);
      // After signing, we'll re-check authorization
      setAuthState('verifying');
      const ownershipResult = await verifyOwnership(publicKey.toString());
      if (ownershipResult) {
        const { isOwner } = ownershipResult;
        setIsAuthorized(isOwner);
        setAuthState(isOwner ? 'authorized' : 'unauthorized');
        if (isOwner) {
          router.push('/');
        }
      } else {
        setAuthState('error');
      }
    } catch (error) {
      console.error('Error signing message:', error);
      setAuthState('error');
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setIsAuthorized(false);
    setAuthState('disconnected');
    router.push('/who?');
  };

  return (
    <>
      {children({ 
        isAuthorized, 
        isLoading, 
        authState, 
        handleSignMessage, 
        handleDisconnect 
      })}
    </>
  );
};
