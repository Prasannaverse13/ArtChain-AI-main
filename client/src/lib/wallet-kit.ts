// Stellar Wallet Kit configuration and setup
import { 
  StellarWalletsKit, 
  WalletNetwork, 
  allowAllModules,
  ISupportedWallet,
  FREIGHTER_ID,
  XBULL_ID
} from '@creit.tech/stellar-wallets-kit';

// Create a singleton instance of StellarWalletsKit
let walletKit: StellarWalletsKit | null = null;

// Initialize the wallet kit
export function initWalletKit(): StellarWalletsKit {
  if (!walletKit) {
    walletKit = new StellarWalletsKit({
      network: WalletNetwork.TESTNET,
      selectedWalletId: FREIGHTER_ID,
      modules: allowAllModules(),
    });
  }
  return walletKit;
}

// Get the wallet kit instance
export function getWalletKit(): StellarWalletsKit {
  if (!walletKit) {
    return initWalletKit();
  }
  return walletKit;
}

// Connect to a specific wallet by ID
export async function connectWalletById(walletId: string): Promise<string> {
  const kit = getWalletKit();
  kit.setWallet(walletId);
  
  const { address } = await kit.getAddress();
  
  if (!address) {
    throw new Error('Failed to retrieve wallet address');
  }
  
  return address;
}

// Open the wallet selection modal
export async function openWalletModal(): Promise<string> {
  return new Promise((resolve, reject) => {
    const kit = getWalletKit();
    
    kit.openModal({
      modalTitle: "Connect Your Stellar Wallet",
      notAvailableText: "Wallet not installed",
      onWalletSelected: async (option: ISupportedWallet) => {
        try {
          kit.setWallet(option.id);
          const { address } = await kit.getAddress();
          
          if (!address) {
            reject(new Error('Failed to retrieve wallet address'));
            return;
          }
          
          resolve(address);
        } catch (error) {
          reject(error);
        }
      },
      onClosed: () => {
        reject(new Error('Wallet selection cancelled'));
      }
    });
  });
}

// Sign a transaction with the connected wallet
export async function signTransaction(xdr: string, address: string): Promise<string> {
  const kit = getWalletKit();
  
  const { signedTxXdr } = await kit.signTransaction(xdr, {
    networkPassphrase: 'Test SDF Network ; September 2015',
    address,
  });
  
  if (!signedTxXdr) {
    throw new Error('Transaction signing failed');
  }
  
  return signedTxXdr;
}

// Get list of all supported wallets
export function getSupportedWallets(): ISupportedWallet[] {
  return [];
}

// Wallet IDs for easy reference
export const WALLET_IDS = {
  FREIGHTER: FREIGHTER_ID,
  XBULL: XBULL_ID,
} as const;

// Export types
export type { ISupportedWallet };
export { WalletNetwork };
