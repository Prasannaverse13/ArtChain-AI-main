import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/hooks/use-wallet';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const walletIcons: Record<string, string> = {
  'freighter': 'wallet',
  'xbull': 'bolt',
  'albedo': 'key',
  'walletconnect': 'link',
  'rabet': 'shield'
};

const walletColors: Record<string, { primary: string; border: string; bg: string }> = {
  'freighter': { primary: 'neon-purple', border: 'neon-purple/30', bg: 'neon-purple/10' },
  'xbull': { primary: 'electric-blue', border: 'electric-blue/30', bg: 'electric-blue/10' },
  'albedo': { primary: 'cyber-green', border: 'cyber-green/30', bg: 'cyber-green/10' },
  'walletconnect': { primary: 'purple-400', border: 'purple-400/30', bg: 'purple-400/10' },
  'rabet': { primary: 'blue-400', border: 'blue-400/30', bg: 'blue-400/10' }
};

export function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const { connectWallet, isLoading } = useWallet();

  const handleConnect = async () => {
    await connectWallet();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-dark-indigo border border-electric-blue/30 shadow-lg shadow-electric-blue/10 max-w-md w-full">
        <div className="absolute inset-0 gradient-border pointer-events-none opacity-50"></div>
        
        <DialogHeader className="relative z-10">
          <DialogTitle className="text-2xl font-orbitron font-bold text-electric-blue mb-2">
            Connect Your Wallet
          </DialogTitle>
          <DialogDescription className="text-light-gray/70">
            Connect to your Stellar wallet using our integrated wallet selector
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-6 mb-4 text-center" data-testid="wallet-info">
          <div className="mb-6 text-light-gray/80">
            <p className="mb-3">Stellar Wallet Kit supports all major wallets:</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <i className="fas fa-check text-neon-green"></i>
                <span>Freighter</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fas fa-check text-neon-green"></i>
                <span>xBull</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fas fa-check text-neon-green"></i>
                <span>Albedo</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fas fa-check text-neon-green"></i>
                <span>WalletConnect</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fas fa-check text-neon-green"></i>
                <span>Rabet</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fas fa-check text-neon-green"></i>
                <span>+ More</span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleConnect}
            disabled={isLoading}
            className="w-full py-4 px-6 bg-gradient-to-r from-neon-purple to-electric-blue hover:opacity-90 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
            data-testid="button-connect-wallet"
          >
            <i className="fas fa-wallet text-white text-xl"></i>
            <span className="font-orbitron font-bold text-white">
              {isLoading ? 'Connecting...' : 'Connect Wallet'}
            </span>
          </button>
        </div>
        
        <div className="mt-6 pt-4 border-t border-electric-blue/20">
          <p className="text-sm text-light-gray/70 text-center">
            By connecting your wallet, you agree to our <a href="#" className="text-electric-blue hover:underline">Terms of Service</a> and <a href="#" className="text-electric-blue hover:underline">Privacy Policy</a>
          </p>
        </div>
        
        <DialogFooter className="bg-dark-indigo/80 px-0 pt-4 border-t border-electric-blue/20 sm:justify-end">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="w-full sm:w-auto bg-space-black text-light-gray border border-light-gray/30 hover:border-light-gray/60"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default WalletModal;
