import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Copy, ExternalLink } from "lucide-react";

interface NFTCollectionImportProps {
  contractAddress: string;
}

const NFTCollectionImport = ({ contractAddress }: NFTCollectionImportProps) => {
  const { toast } = useToast();

  const handleImportToMetaMask = async () => {
    if (!window.ethereum) {
      toast({
        title: "MetaMask Required",
        description: "Please install MetaMask to import the NFT collection.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("Requesting NFT import to MetaMask...");
      // Updated parameter structure to match MetaMask's expected format
      const wasAdded = await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC721',
          options: {
            address: contractAddress,
            name: "Cleopatra's Necklace",
            symbol: "CLEO",
          },
        },
      });

      if (wasAdded) {
        toast({
          title: "Success",
          description: "NFT Collection added to MetaMask",
        });
      } else {
        toast({
          title: "Cancelled",
          description: "User cancelled the import",
        });
      }
    } catch (error) {
      console.error("Error importing NFT collection:", error);
      toast({
        title: "Import Failed",
        description: "Failed to import NFT collection to MetaMask",
        variant: "destructive",
      });
    }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(contractAddress);
    toast({
      title: "Copied",
      description: "Contract address copied to clipboard",
    });
  };

  return (
    <div className="mt-4 p-4 bg-green-900/20 rounded-lg space-y-4">
      <h3 className="text-lg font-semibold text-green-400">View Your NFTs</h3>
      <div className="space-y-2">
        <p className="text-green-300 text-sm">
          To view your NFTs in MetaMask:
        </p>
        <ol className="list-decimal list-inside space-y-1 text-sm text-green-200">
          <li>Click the button below to import the collection</li>
          <li>Open MetaMask and go to the NFTs tab</li>
          <li>Your NFTs from this collection will appear there</li>
        </ol>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          onClick={handleImportToMetaMask}
          className="text-green-400 border-green-400 hover:bg-green-400/20"
          variant="outline"
        >
          Import to MetaMask
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={copyAddress}
          className="text-green-400 border-green-400 hover:bg-green-400/20"
        >
          <Copy className="h-4 w-4 mr-2" />
          Copy Contract Address
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(`https://sepolia.etherscan.io/address/${contractAddress}`, '_blank')}
          className="text-green-400 border-green-400 hover:bg-green-400/20"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          View on Etherscan
        </Button>
      </div>
    </div>
  );
};

export default NFTCollectionImport;