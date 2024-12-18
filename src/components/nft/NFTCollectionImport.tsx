import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Copy, ExternalLink } from "lucide-react";
import { useState } from "react";

interface NFTCollectionImportProps {
  contractAddress: string;
}

const NFTCollectionImport = ({ contractAddress }: NFTCollectionImportProps) => {
  const { toast } = useToast();
  const [tokenId, setTokenId] = useState("1"); // Default to token ID 1

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
      console.log("Requesting NFT import to MetaMask...", {
        contractAddress,
        tokenId
      });
      
      const wasAdded = await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: [{
          type: 'ERC721',
          options: {
            address: contractAddress,
            tokenId: tokenId,
            name: "Cleopatra's Necklace",
            symbol: "CLEO"
          },
        }],
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
          <li>Enter your Token ID below (the ID of the NFT you own)</li>
          <li>Click "Import to MetaMask" to add your NFT</li>
          <li>Open MetaMask and go to the NFTs tab</li>
          <li>Your NFT will appear there</li>
        </ol>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value)}
            className="w-24 px-2 py-1 text-sm bg-black/20 border border-green-400/20 rounded text-green-400"
            placeholder="Token ID"
            min="1"
          />
          <span className="text-sm text-green-300">← Enter your Token ID</span>
        </div>
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