import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import styles from './styles/Auth.module.css';
import { signIn, useSession } from 'next-auth/react';
import { verifyOwnership } from '../utils/solana';

interface AuthPageProps {
  authState: string;
  handleSignMessage: () => Promise<void>;
  isAuthorized: boolean;
}

const AuthPage: React.FC<AuthPageProps> = ({ authState: initialAuthState, handleSignMessage, isAuthorized }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { connected, publicKey, disconnect } = useWallet();
  const [authState, setAuthState] = useState(initialAuthState);
  const [verificationResult, setVerificationResult] = useState<{ isOwner: boolean; debugInfo: string } | null>(null);

  useEffect(() => {
    if (session) {
      router.push('/');
    }
  }, [session, router]);

  useEffect(() => {
    if (connected && authState === 'disconnected') {
      handleVerify();
    }
  }, [connected, authState]);

  const handleDisconnect = () => {
    disconnect();
    setAuthState('disconnected');
  };

  const handleVerify = async () => {
    try {
      setAuthState('signing');
      await handleSignMessage();
      setAuthState('verifying');
      if (publicKey) {
        const result = await verifyOwnership(publicKey.toString());
        setVerificationResult(result);
        if (result.isOwner) {
          setAuthState('authorized');
          router.push('/');
        } else {
          setAuthState('unauthorized');
        }
      }
    } catch (error) {
      setAuthState('error');
    }
  };

  return (
    <div className={styles.authContainer}>
      <h1>Our Inner Circle</h1>
      <div className={styles.logoContainer}>
        <img src={authState === 'unauthorized' ? "/logo403.png" : "/logo.png"} alt="Token Gate" width={50} height={50} />
      </div>
      <p className={styles.authStatus}>
        {getStatusMessage(authState)}
        {authState === 'unauthorized' && (
          <>
            {' '}
            <span className={styles.verifyAgain} onClick={handleVerify}>
              Verify again?
            </span>
          </>
        )}
      </p>
      <WalletMultiButton />
      {authState === 'unauthorized' && (
        <>
          <div className={styles.tokenLinks}>
            <a
              href={`https://raydium.io/swap/?inputCurrency=sol&outputCurrency=${process.env.NEXT_PUBLIC_REQUIRED_SPL_TOKEN_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Get Required 13k Silly Tokens
            </a>
            <a
              href={`https://magiceden.io/marketplace/${process.env.NEXT_PUBLIC_REQUIRED_NFT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Claim Required Access NFT
            </a>
          </div>
          {verificationResult && (
            <div className={styles.debugInfo}>
              <h4>Debug Info:</h4>
              <pre>{verificationResult.debugInfo}</pre>
            </div>
          )}
        </>
      )}
    </div>
  );
};

function getStatusMessage(authState: string): string {
  switch (authState) {
    case 'disconnected':
      return 'Knock, Knock!';
    case 'connected':
      return 'Wallet connected. Verifying ownership...';
    case 'signing':
      return 'Please sign the message in your wallet';
    case 'verifying':
      return 'Verifying token ownership...';
    case 'authorized':
      return 'Destiny!';
    case 'unauthorized':
      return 'Required tokens not found in wallet!';
    case 'error':
      return 'Verification canceled or an error occurred. Please try again.';
    default:
      return 'Initializing...';
  }
}

export default AuthPage;
