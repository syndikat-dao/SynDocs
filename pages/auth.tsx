import React, { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useRouter } from 'next/router';
import { verifyOwnership } from '../utils/solana';
import styles from './styles/Auth.module.css';

const AuthPage: React.FC = () => {
  const { connected, publicKey, signMessage } = useWallet();
  const router = useRouter();
  const [status, setStatus] = useState('Please connect your wallet');
  const [debugInfo, setDebugInfo] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (connected && publicKey) {
      handleAuthentication();
    }
  }, [connected, publicKey]);

  const handleAuthentication = async () => {
    try {
      setStatus('Signing message to prove ownership...');
      const message = new TextEncoder().encode(`Prove ownership for Syndikat DAO: ${Date.now()}`);
      await signMessage(message);
      
      setStatus('Verifying ownership...');
      const { isOwner, debugInfo } = await verifyOwnership(publicKey.toString());
      setDebugInfo(debugInfo);

      if (isOwner) {
        setStatus('Ownership verified. Redirecting...');
        router.push('/');
      } else {
        setStatus('Required tokens not found in wallet.');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setStatus('An error occurred during authentication.');
      setError(error.message);
    }
  };

  return (
    <div className={styles.authContainer}>
      <h1>Our Inner Circle! Connect your wallet to prove ownership</h1>
      <WalletMultiButton />
      <p>{status}</p>
      {error && <p className={styles.error}>Error: {error}</p>}
      {status === 'Required tokens not found in wallet.' && (
        <div>
          <a href={`https://raydium.io/swap/?inputCurrency=sol&outputCurrency=${process.env.NEXT_PUBLIC_REQUIRED_SPL_TOKEN_ADDRESS}`} target="_blank" rel="noopener noreferrer">
            Get Required SPL Token
          </a>
          <br />
          <a href={`https://magiceden.io/marketplace/${process.env.NEXT_PUBLIC_REQUIRED_NFT_ADDRESS}`} target="_blank" rel="noopener noreferrer">
            Get Required NFT
          </a>
        </div>
      )}
      <pre>{debugInfo}</pre>
    </div>
  );
};

export default AuthPage;
