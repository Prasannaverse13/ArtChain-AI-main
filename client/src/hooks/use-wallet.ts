import { useState, useEffect, useCallback } from 'react';
import { 
  formatAddress
} from '@/lib/wallet';
import { 
  initWalletKit, 
  connectWalletById, 
  openWalletModal,
  getSupportedWallets,
  ISupportedWallet
} from '@/lib/wallet-kit';
import { useToast } from '@/hooks/use-toast';

// Local storage key for wallet info
const WALLET_KEY = 'artchain_wallet';

export interface WalletInfo {
  isConnected: boolean;
  address: string | null;
  walletId: string | null;
  walletName: string | null;
  displayAddress: string | null;
}

export function useWallet() {
  const [walletInfo, setWalletInfo] = useState<WalletInfo>({
    isConnected: false,
    address: null,
    walletId: null,
    walletName: null,
    displayAddress: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [supportedWallets, setSupportedWallets] = useState<ISupportedWallet[]>([]);
  const { toast } = useToast();
  
  // Initialize wallet kit and get supported wallets
  useEffect(() => {
    try {
      initWalletKit();
      const wallets = getSupportedWallets();
      setSupportedWallets(wallets);
    } catch (error) {
      console.error('Error initializing wallet kit:', error);
    }
  }, []);

  // Initialize from localStorage
  useEffect(() => {
    const storedWallet = localStorage.getItem(WALLET_KEY);
    if (storedWallet) {
      try {
        const parsed = JSON.parse(storedWallet);
        setWalletInfo({
          ...parsed,
          displayAddress: parsed.address ? formatAddress(parsed.address) : null
        });
      } catch (error) {
        console.error('Failed to parse stored wallet info:', error);
        localStorage.removeItem(WALLET_KEY);
      }
    }
  }, []);

  // Connect to a specific wallet by ID
  const connectSpecificWallet = useCallback(async (walletId: string, walletName: string) => {
    setIsLoading(true);
    try {
      const address = await connectWalletById(walletId);
      
      const walletData: WalletInfo = {
        isConnected: true,
        address,
        walletId,
        walletName,
        displayAddress: formatAddress(address)
      };
      
      setWalletInfo(walletData);
      localStorage.setItem(WALLET_KEY, JSON.stringify(walletData));
      
      toast({
        title: 'Wallet Connected',
        description: `Successfully connected to ${walletName}`,
      });
    } catch (error: any) {
      console.error('Wallet connection error:', error);
      toast({
        title: 'Connection Failed',
        description: error.message || 'Failed to connect wallet. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Connect to wallet using modal
  const connectWallet = useCallback(async () => {
    setIsLoading(true);
    try {
      const address = await openWalletModal();
      
      const walletData: WalletInfo = {
        isConnected: true,
        address,
        walletId: null,
        walletName: 'Stellar Wallet',
        displayAddress: formatAddress(address)
      };
      
      setWalletInfo(walletData);
      localStorage.setItem(WALLET_KEY, JSON.stringify(walletData));
      
      toast({
        title: 'Wallet Connected',
        description: `Successfully connected wallet`,
      });
    } catch (error: any) {
      console.error('Wallet connection error:', error);
      if (!error.message?.includes('cancelled')) {
        toast({
          title: 'Connection Failed',
          description: error.message || 'Failed to connect wallet. Please try again.',
          variant: 'destructive'
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    setWalletInfo({
      isConnected: false,
      address: null,
      walletId: null,
      walletName: null,
      displayAddress: null,
    });
    localStorage.removeItem(WALLET_KEY);
    
    toast({
      title: 'Wallet Disconnected',
      description: 'Your wallet has been disconnected.',
    });
  }, [toast]);

  return {
    walletInfo,
    isLoading,
    supportedWallets,
    connectWallet,
    connectSpecificWallet,
    disconnectWallet
  };
}
