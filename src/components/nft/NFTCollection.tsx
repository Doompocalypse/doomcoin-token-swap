import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useToast } from "@/components/ui/use-toast";
import ErrorDisplay from './components/ErrorDisplay';
import { useNFTContract } from '@/hooks/nft/useNFTContract';

interface NFTCollectionProps {
  contractAddress?: string;
  walletAddress?: string;
}

const NFTCollection = ({ contractAddress, walletAddress }: NFTCollectionProps) => {
  const [totalSupply, setTotalSupply] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const { toast } = useToast();
  const { contract } = useNFTContract(contractAddress);

  const fetchTotalSupply = async () => {
    if (!contract || !contractAddress) {
      console.log("No contract available for total supply check");
      return;
    }

    try {
      console.log("Fetching total supply...");
      const supply = await contract.totalSupply();
      console.log("Total supply fetched:", supply.toString());
      setTotalSupply(supply.toNumber());
      setError("");
    } catch (err: any) {
      console.error("Error fetching total supply:", err);
      
      // Handle specific error cases
      if (err.code === 'CALL_EXCEPTION') {
        setError("Unable to connect to the NFT contract. The contract might not be deployed correctly.");
      } else {
        setError(err.message || "Failed to fetch NFT collection data");
      }
      
      toast({
        title: "Error",
        description: "Failed to load NFT collection data. Please try again later.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (contractAddress) {
      fetchTotalSupply();
    }
  }, [contractAddress, contract]);

  if (error) {
    return <ErrorDisplay errorMessage={error} />;
  }

  if (!contractAddress) {
    return (
      <div className="p-4 bg-black/20 rounded-lg">
        <p className="text-center text-gray-400">
          No NFT collection has been deployed yet.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-black/20 rounded-lg space-y-4">
      <h2 className="text-xl font-bold">NFT Collection</h2>
      <div className="grid gap-4">
        <div className="flex justify-between items-center p-3 bg-black/40 rounded">
          <span>Total Supply</span>
          <span>{totalSupply}</span>
        </div>
      </div>
    </div>
  );
};

export default NFTCollection;