import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

const NETWORK = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet';

const RPC_ENDPOINTS = [
  process.env.NEXT_PUBLIC_RPC_ENDPOINT,
  NETWORK === 'mainnet-beta' ? clusterApiUrl('mainnet-beta') : clusterApiUrl('devnet'),
  NETWORK === 'mainnet-beta' ? 'https://api.mainnet-beta.solana.com' : 'https://api.devnet.solana.com',
  NETWORK === 'mainnet-beta' ? 'https://rpc.ankr.com/solana' : 'https://rpc.ankr.com/solana_devnet',
];

const REQUIRED_NFT_ADDRESSES = process.env.NEXT_PUBLIC_REQUIRED_NFT_ADDRESS?.split(',') || [];
const REQUIRED_SPL_TOKEN_ADDRESSES = process.env.NEXT_PUBLIC_REQUIRED_SPL_TOKEN_ADDRESS?.split(',') || [];
const REQUIRED_SPL_TOKEN_AMOUNT = process.env.NEXT_PUBLIC_REQUIRED_SPL_TOKEN_AMOUNT?.split(',').map(Number) || [];

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
    debugInfo += "Tokens in wallet:\n";
    tokenAccounts.value.forEach((account: any) => {
      const { mint, tokenAmount } = account.account.data.parsed.info;
      debugInfo += `Mint: ${mint}, Amount: ${tokenAmount.uiAmount}\n`;
    });
    debugInfo += "\n";

    let nftFound = false;
    let splTokenFound = false;
    
    // Check NFT ownership
if (REQUIRED_NFT_ADDRESSES.length > 0) {
  debugInfo += "Required NFT addresses:\n";
  REQUIRED_NFT_ADDRESSES.forEach(addr => {
    debugInfo += `${addr}\n`;
  });
  debugInfo += "\n";

  const nftAccounts = tokenAccounts.value.filter((account: any) =>
    REQUIRED_NFT_ADDRESSES.includes(account.account.data.parsed.info.mint) &&
    account.account.data.parsed.info.tokenAmount.uiAmount > 0
  );
  nftFound = nftAccounts.length > 0;
  debugInfo += nftFound ? `Required NFT found\n` : `Required NFT not found\n`;
  nftAccounts.forEach((account: any) => {
    debugInfo += `NFT found: ${account.account.data.parsed.info.mint}\n`;
  });
} else {
  nftFound = true; // If no NFTs are required, consider this condition met
  debugInfo += "No NFTs required for verification\n";
}
    
    // Check SPL token ownership and amount
    if (REQUIRED_SPL_TOKEN_ADDRESSES.length > 0) {
      splTokenFound = REQUIRED_SPL_TOKEN_ADDRESSES.some((address, index) => {
        const tokenAccount = tokenAccounts.value.find(
          (account: any) => account.account.data.parsed.info.mint === address
        );
        if (tokenAccount) {
          const tokenAmount = parseInt(tokenAccount.account.data.parsed.info.tokenAmount.amount);
          const requiredAmount = REQUIRED_SPL_TOKEN_AMOUNT[index] || 0;
          debugInfo += `SPL token found: ${address}. Amount: ${tokenAmount}, Required: ${requiredAmount}\n`;
          return tokenAmount >= requiredAmount;
        } else {
          debugInfo += `Required SPL token not found: ${address}\n`;
          return false;
        }
      });
    } else {
      splTokenFound = true; // If no SPL tokens are required, consider this condition met
    }    

    const isOwner = nftFound && splTokenFound;
    debugInfo += `\nOwnership verified: ${isOwner}`;

    console.log(debugInfo);
    return { isOwner, debugInfo };
  } catch (error) {
    console.error('Error verifying ownership:', error);
    debugInfo += `Error: ${error instanceof Error ? error.message : String(error)}`;
    return { isOwner: false, debugInfo };
  }
};
