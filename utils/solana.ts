import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

const RPC_ENDPOINTS = [
  process.env.NEXT_PUBLIC_RPC_ENDPOINT,
  clusterApiUrl('devnet'),
  'https://api.devnet.solana.com',
  'https://rpc.ankr.com/solana_devnet',
];

async function getConnection(): Promise<any> {
  for (const endpoint of RPC_ENDPOINTS) {
    if (!endpoint) continue;
    const connection = new Connection(endpoint, 'confirmed');
    try {
      await connection.getVersion();
      console.log(`Connected to ${endpoint}`);
      return connection;
    } catch (error) {
      console.warn(`Failed to connect to ${endpoint}:`, error);
    }
  }
  throw new Error('Unable to connect to any RPC endpoint');
}

export const verifyOwnership = async (publicKey: string): Promise<{ isOwner: boolean; debugInfo: string }> => {
  console.log('Verifying ownership for:', publicKey);
  const walletPublicKey = new PublicKey(publicKey);
  let debugInfo = '';

  try {
    const connection = await getConnection();
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(walletPublicKey, {
      programId: TOKEN_PROGRAM_ID
    });

    debugInfo += `Total token accounts found: ${tokenAccounts.value.length}\n\n`;

    // Log all tokens in the wallet
    debugInfo += "Tokens in wallet:\n";
    tokenAccounts.value.forEach(account => {
      const { mint, tokenAmount } = account.account.data.parsed.info;
      debugInfo += `Mint: ${mint}, Amount: ${tokenAmount.uiAmount}\n`;
    });
    debugInfo += "\n";

    let nftFound = false;
    let splTokenFound = false;

    // Check NFT ownership (any NFT with amount > 0)
    const nftAccounts = tokenAccounts.value.filter(account => 
      account.account.data.parsed.info.tokenAmount.uiAmount === 1 &&
      account.account.data.parsed.info.tokenAmount.decimals === 0
    );

    if (nftAccounts.length > 0) {
      debugInfo += `NFTs found: ${nftAccounts.length}\n`;
      nftFound = true;
    } else {
      debugInfo += 'No NFTs found\n';
    }

    // Check SPL token ownership and amount
    if (process.env.NEXT_PUBLIC_REQUIRED_SPL_TOKEN_ADDRESS) {
      debugInfo += `Checking for SPL token: ${process.env.NEXT_PUBLIC_REQUIRED_SPL_TOKEN_ADDRESS}\n`;
      const tokenAddress = new PublicKey(process.env.NEXT_PUBLIC_REQUIRED_SPL_TOKEN_ADDRESS);
      const requiredAmount = parseInt(process.env.NEXT_PUBLIC_REQUIRED_SPL_TOKEN_AMOUNT || '0');

      const tokenAccount = tokenAccounts.value.find(
        account => account.account.data.parsed.info.mint === tokenAddress.toString()
      );

      if (tokenAccount) {
        const tokenAmount = parseInt(tokenAccount.account.data.parsed.info.tokenAmount.amount);
        debugInfo += `SPL token found. Amount: ${tokenAmount}, Required: ${requiredAmount}\n`;
        if (tokenAmount >= requiredAmount) {
          debugInfo += 'SPL token amount verified\n';
          splTokenFound = true;
        } else {
          debugInfo += 'SPL token found but amount is insufficient\n';
        }
      } else {
        debugInfo += 'Required SPL token not found\n';
      }
    }

    const isOwner = nftFound && splTokenFound;
    debugInfo += `\nOwnership verified: ${isOwner}`;

    console.log(debugInfo);
    return { isOwner, debugInfo };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error verifying ownership:', error);
      debugInfo += `Error: ${error.message}`;
    } else {
      console.error('Error verifying ownership:', error);
      debugInfo += `Error: ${String(error)}`;
    }
    return { isOwner: false, debugInfo };
  }
};