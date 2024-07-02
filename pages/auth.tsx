import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import styles from './styles/Auth.module.css';

const AuthPage: React.FC<{ 
  authState: string; 
  handleSignMessage: () => Promise<void>;
  isAuthorized: boolean;
}> = ({ authState, handleSignMessage, isAuthorized }) => {
  const router = useRouter();

  useEffect(() => {
    if (isAuthorized) {
      router.push('/');
    }
  }, [isAuthorized, router]);

  return (
    <div className={styles.authContainer}>
      <h1>Our Inner Circle</h1>
      <p className={styles.authStatus}>{getStatusMessage(authState)}</p>
      {authState === 'disconnected' && <WalletMultiButton />}
      {authState === 'connected' && (
        <button onClick={handleSignMessage}>Sign Message to Verify Ownership</button>
      )}
      {authState === 'unauthorized' && (
        <>
          <div className={styles.tokenLinks}>
            <a href={`https://raydium.io/swap/?inputCurrency=sol&outputCurrency=${process.env.NEXT_PUBLIC_REQUIRED_SPL_TOKEN_ADDRESS}`} target="_blank" rel="noopener noreferrer">
              Get Required SPL Token
            </a>
            <a href={`https://magiceden.io/marketplace/${process.env.NEXT_PUBLIC_REQUIRED_NFT_ADDRESS}`} target="_blank" rel="noopener noreferrer">
              Get Required NFT
            </a>
          </div>
          <div className={styles.logoContainer}>
            <img src="/logo403.png" alt="Access Denied" width={100} height={100} />
          </div>
        </>
      )}
    </div>
  );
};

function getStatusMessage(authState: string): string {
  switch (authState) {
    case 'disconnected': return 'Please connect your wallet';
    case 'connected': return 'Wallet connected. Please sign the message to verify ownership.';
    case 'signing': return 'Please sign the message in your wallet';
    case 'verifying': return 'Verifying token ownership...';
    case 'authorized': return 'Access granted. Redirecting...';
    case 'unauthorized': return 'Required tokens not found in wallet.';
    case 'error': return 'An error occurred. Please try again.';
    default: return 'Initializing...';
  }
}

export default AuthPage;
