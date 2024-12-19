import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useToast } from "@/components/ui/use-toast";
import ErrorDisplay from './components/ErrorDisplay';
import { useNFTContract } from '@/hooks/nft/useNFTContract';
import { verifyContractDeployment } from '@/utils/contractVerification';

interface NFTCollectionProps {
  contractAddress?: string;
  walletAddress?: string;
}

const NFTCollection = ({ contractAddress, walletAddress }: NFTCollectionProps) => {
  const [totalSupply, setTotalSupply] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();
  const { getContract } = useNFTContract();

  const fetchTotalSupply = async () => {
    if (!contractAddress || !window.ethereum) {
      console.log("No contract address or ethereum provider available");
      return;
    }

    setIsVerifying(true);
    setError("");

    try {
      console.log("Verifying contract at address:", contractAddress);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      
      // First verify the contract is deployed and valid
      const isValid = await verifyContractDeployment(contractAddress, provider);
      if (!isValid) {
        throw new Error("Contract verification failed. The contract might not be deployed correctly.");
      }

      console.log("Contract verified, fetching total supply...");
      const signer = provider.getSigner();
      const contract = getContract(contractAddress, signer);

      console.log("Calling totalSupply on contract...");
      const supply = await contract.totalSupply();
      console.log("Total supply fetched:", supply.toString());
      
      setTotalSupply(supply.toNumber());
      setError("");
    } catch (err: any) {
      console.error("Error in NFTCollection:", err);
      
      // Handle specific error cases
      if (err.code === 'CALL_EXCEPTION') {
        setError("Unable to connect to the NFT contract. The contract might not be deployed correctly.");
      } else if (err.code === -32603) {
        setError("Internal JSON-RPC error. Please check your wallet connection.");
      } else {
        setError(err.message || "Failed to fetch NFT collection data");
      }
      
      toast({
        title: "Error",
        description: "Failed to load NFT collection data. Please check the contract address and try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    if (contractAddress) {
      fetchTotalSupply();
    }
  }, [contractAddress]);

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
      <h2 className="text-xl font-bold text-white">NFT Collection</h2>
      <div className="grid gap-4">
        <div className="flex justify-between items-center p-3 bg-black/40 rounded">
          <span className="text-gray-300">Total Supply</span>
          <span className="text-white font-medium">{totalSupply} NFTs</span>
        </div>
        <div className="text-sm text-gray-400">
          <p>• Individual Pieces (1-6): {Math.min(totalSupply, 6)} / 6 minted</p>
          <p>• Complete Set: {totalSupply > 6 ? "1" : "0"} / 1 available</p>
        </div>
      </div>
    </div>
  );
};

export default NFTCollection;