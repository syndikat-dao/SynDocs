import React, { useEffect, useState, ReactNode } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/router';
import { verifyOwnership } from '../utils/solana';

interface AuthWrapperProps {
  children: (props: {
    isAuthorized: boolean;
    isLoading: boolean;
    authState: string;
    handleSignMessage: () => Promise<void>;
    handleDisconnect: () => void;
  }) => ReactNode;
}

export const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
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
        if (router.pathname !== '/auth') {
          router.push('/auth');
        }
        return;
      }

      setIsLoading(true);
      setAuthState('verifying');
      try {
        const { isOwner, debugInfo } = await verifyOwnership(publicKey.toString());
        console.log('Debug Info:', debugInfo);
        setIsAuthorized(isOwner);
        setAuthState(isOwner ? 'authorized' : 'unauthorized');
        
        if (isOwner && router.pathname === '/auth') {
          router.push('/');
        } else if (!isOwner && router.pathname !== '/auth') {
          router.push('/auth');
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
        `Verify ownership for Syndikat DAO: ${Date.now()}\n\n` +
        'By signing this message, you agree to our terms and privacy policy.\n' +
        'This will check for required tokens and balances in your wallet.\n' +
        'No fees will be applied.'
      );
      await signMessage(message);
      // After signing, we'll re-check authorization
      setAuthState('verifying');
      const { isOwner } = await verifyOwnership(publicKey.toString());
      setIsAuthorized(isOwner);
      setAuthState(isOwner ? 'authorized' : 'unauthorized');
      if (isOwner) {
        router.push('/');
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
    router.push('/auth');
  };

  return children({ isAuthorized, isLoading, authState, handleSignMessage, handleDisconnect });
};
