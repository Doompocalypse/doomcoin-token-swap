import { Button } from "@/components/ui/button";
import { useNFTMintHandler } from "./NFTMintHandler";
import NFTCollectionImport from "./NFTCollectionImport";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import CleopatraNFTContract from "@/contracts/CleopatraNecklaceNFT.json";

interface NFTCollectionProps {
  contractAddress?: string;
  walletAddress?: string;
}

const NFTCollection = ({ contractAddress, walletAddress }: NFTCollectionProps) => {
  const [totalSupply, setTotalSupply] = useState<number>(0);
  console.log("NFTCollection rendered with props:", { contractAddress, walletAddress });
  
  const { handleMint } = useNFTMintHandler(walletAddress, contractAddress);

  // Check local storage for previously deployed contract
  const savedContract = localStorage.getItem('nft_deployment_status');
  const savedContractAddress = savedContract ? JSON.parse(savedContract).contractAddress : null;
  
  console.log("Saved contract address:", savedContractAddress);
  console.log("Current contract address:", contractAddress);

  const effectiveContractAddress = contractAddress || savedContractAddress;

  useEffect(() => {
    const fetchTotalSupply = async () => {
      if (!window.ethereum || !effectiveContractAddress) return;
      
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(
          effectiveContractAddress,
          CleopatraNFTContract.abi,
          provider
        );
        
        const supply = await contract.totalSupply();
        setTotalSupply(supply.toNumber());
      } catch (error) {
        console.error("Error fetching total supply:", error);
      }
    };

    fetchTotalSupply();
    // Refresh every 10 seconds to catch new mints
    const interval = setInterval(fetchTotalSupply, 10000);
    return () => clearInterval(interval);
  }, [effectiveContractAddress]);

  if (!effectiveContractAddress) {
    return (
      <div className="p-4 bg-black/20 rounded-lg space-y-4">
        <h2 className="text-xl font-bold text-white">Cleopatra's Necklace NFT Collection</h2>
        <p className="text-white">
          Deploy the contract first to mint NFTs
        </p>
      </div>
    );
  }

  if (!walletAddress) {
    return (
      <div className="p-4 bg-black/20 rounded-lg space-y-4">
        <h2 className="text-xl font-bold text-white">Cleopatra's Necklace NFT Collection</h2>
        <p className="text-white">
          Connect your wallet to mint NFTs
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-black/20 rounded-lg space-y-4">
      <h2 className="text-xl font-bold text-white">Cleopatra's Necklace NFT Collection</h2>
      <div className="space-y-2">
        <p className="text-white">
          Mint your unique Cleopatra's Necklace NFT. Each NFT is one-of-a-kind and represents a piece of ancient Egyptian history.
        </p>
        
        <div className="bg-black/20 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-2">Collection Status</h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {[1, 2, 3, 4, 5, 6].map((tokenId) => (
              <div 
                key={tokenId}
                className={`p-2 rounded-lg text-center ${
                  tokenId <= totalSupply ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                }`}
              >
                #{tokenId}
                <div className="text-xs">
                  {tokenId <= totalSupply ? 'Minted' : 'Available'}
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-400 mt-2">
            {totalSupply}/6 pieces minted
            {totalSupply === 6 && " - Only complete set (Token #7) remains"}
          </p>
        </div>
      </div>
      
      <Button 
        onClick={handleMint}
        className="w-full bg-white text-black hover:bg-white/90"
        disabled={totalSupply >= 6}
      >
        {totalSupply >= 6 ? "Individual Pieces Sold Out" : "Mint NFT"}
      </Button>
      
      <NFTCollectionImport contractAddress={effectiveContractAddress} />
    </div>
  );
};

export default NFTCollection;