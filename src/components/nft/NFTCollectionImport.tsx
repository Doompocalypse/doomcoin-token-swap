import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Copy, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import CleopatraNFTContract from "@/contracts/CleopatraNecklaceNFT.json";

interface NFTCollectionImportProps {
  contractAddress: string;
}

const NFTCollectionImport = ({ contractAddress }: NFTCollectionImportProps) => {
  const { toast } = useToast();
  const [tokenId, setTokenId] = useState("");
  const [totalSupply, setTotalSupply] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTotalSupply = async () => {
      if (!window.ethereum || !contractAddress) {
        setIsLoading(false);
        return;
      }
      
      try {
        console.log("Fetching total supply for contract:", contractAddress);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(
          contractAddress,
          CleopatraNFTContract.abi,
          provider
        );
        
        const supply = await contract.totalSupply();
        const supplyNumber = supply.toNumber();
        console.log("Total NFT supply:", supplyNumber);
        setTotalSupply(supplyNumber);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching total supply:", error);
        setIsLoading(false);
      }
    };

    fetchTotalSupply();
  }, [contractAddress]);

  const handleImportToMetaMask = async () => {
    if (!window.ethereum) {
      toast({
        title: "MetaMask Required",
        description: "Please install MetaMask to import the NFT collection.",
        variant: "destructive",
      });
      return;
    }

    // Only proceed if we have minted NFTs
    if (totalSupply === 0) {
      toast({
        title: "No NFTs Available",
        description: "There are no NFTs minted yet in this collection.",
        variant: "destructive",
      });
      return;
    }

    const tokenIdNum = tokenId.toUpperCase();
    if (!/^[A-Z0-9]{6}$/.test(tokenIdNum)) {
      toast({
        title: "Invalid Token ID",
        description: `Please enter a valid token ID (6 characters, alphanumeric)`,
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
            tokenId: tokenIdNum,
          },
        }],
      });

      if (wasAdded) {
        toast({
          title: "Success",
          description: "NFT added to MetaMask",
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
        description: "Failed to import NFT to MetaMask",
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
        {isLoading ? (
          <p className="text-green-300 text-sm">Loading available NFTs...</p>
        ) : totalSupply === 0 ? (
          <p className="text-green-300 text-sm">
            No NFTs have been minted yet in this collection. Mint an NFT first to view it in MetaMask.
          </p>
        ) : (
          <>
            <p className="text-green-300 text-sm">
              Available NFTs: {totalSupply} tokens minted
            </p>
            <p className="text-green-300 text-sm">
              To view your NFTs in MetaMask:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-sm text-green-200">
              <li>Enter your Token ID below</li>
              <li>Click "Import to MetaMask" to add your NFT</li>
              <li>Open MetaMask and go to the NFTs tab</li>
              <li>Your NFT will appear there</li>
            </ol>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={tokenId}
                onChange={(e) => setTokenId(e.target.value.toUpperCase())}
                className="w-32 px-2 py-1 text-sm bg-black/20 border border-green-400/20 rounded text-green-400"
                placeholder="Enter Token ID"
                maxLength={6}
                pattern="[A-Z0-9]*"
                disabled={totalSupply === 0}
              />
              <span className="text-sm text-green-300">← Enter your Token ID (e.g. ABC123)</span>
            </div>
          </>
        )}
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          onClick={handleImportToMetaMask}
          className="text-green-400 border-green-400 hover:bg-green-400/20"
          variant="outline"
          disabled={isLoading || totalSupply === 0}
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
