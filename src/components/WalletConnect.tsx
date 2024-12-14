import { Button } from "@/components/ui/button";
import { useAccount, useNetwork, useDisconnect } from 'wagmi';
import { useWeb3Modal } from '@web3modal/react';

interface WalletConnectProps {
  onConnect: (connected: boolean, account?: string) => void;
}

const WalletConnect = ({ onConnect }: WalletConnectProps) => {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount({
    onConnect: ({ address }) => {
      console.log("Wallet connected:", address);
      onConnect(true, address);
    },
    onDisconnect: () => {
      console.log("Wallet disconnected");
      onConnect(false);
    }
  });
  const { chain } = useNetwork();
  const { disconnect } = useDisconnect();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getNetworkName = () => {
    if (!chain?.id) return "";
    
    console.log("Current chain:", chain);
    
    if (chain.id === 1) {
      console.log("✅ Connected to Ethereum Mainnet");
      return " (Ethereum)";
    }
    
    return ` (${chain.name})`;
  };

  const handleClick = async () => {
    if (isConnected) {
      disconnect();
    } else {
      await open();
    }
  };

  return (
    <Button onClick={handleClick} className="bg-[#33C3F0] hover:opacity-90">
      {isConnected && address
        ? `${formatAddress(address)}${getNetworkName()}`
        : "Connect Wallet"
      }
    </Button>
  );
};

export default WalletConnect;