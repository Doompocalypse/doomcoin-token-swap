import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import CleopatraNFTContract from "@/contracts/CleopatraNecklaceNFT.json";
import TokenIdInput from "./components/TokenIdInput";
import ImportActions from "./components/ImportActions";
import SupplyInfo from "./components/SupplyInfo";

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

    if (totalSupply === 0) {
      toast({
        title: "No NFTs Available",
        description: "There are no NFTs minted yet in this collection.",
        variant: "destructive",
      });
      return;
    }

    if (!tokenId || isNaN(Number(tokenId)) || Number(tokenId) <= 0) {
      toast({
        title: "Invalid Token ID",
        description: "Please enter a valid numeric Token ID",
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
        <SupplyInfo isLoading={isLoading} totalSupply={totalSupply} />
        {!isLoading && totalSupply > 0 && (
          <TokenIdInput
            tokenId={tokenId}
            onChange={setTokenId}
            disabled={totalSupply === 0}
          />
        )}
      </div>
      <ImportActions
        onImport={handleImportToMetaMask}
        onCopy={copyAddress}
        contractAddress={contractAddress}
        disabled={isLoading || totalSupply === 0}
      />
    </div>
  );
};

export default NFTCollectionImport;