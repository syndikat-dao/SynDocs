import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/router';

export const DisconnectButton: React.FC = () => {
  const { disconnect } = useWallet();
  const router = useRouter();

  const handleDisconnect = () => {
    disconnect();
    localStorage.removeItem('hasSignedMessage');
    router.push('/auth');
  };

  if (router.pathname === '/auth') {
    return null;
  }

  return (
    <button onClick={handleDisconnect}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 6V18M11 6V18M4 21H20C21.1046 21 22 20.1046 22 19V5C22 3.89543 21.1046 3 20 3H4C2.89543 3 2 3.89543 2 5V19C2 20.1046 2.89543 21 4 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
};
