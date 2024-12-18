import { Button } from "@/components/ui/button";
import { useNFTMintHandler } from "./NFTMintHandler";

interface NFTCollectionProps {
  contractAddress?: string;
  walletAddress?: string;
}

const NFTCollection = ({ contractAddress, walletAddress }: NFTCollectionProps) => {
  const { handleMint } = useNFTMintHandler(walletAddress, contractAddress);

  if (!contractAddress) {
    return (
      <div className="p-4 bg-black/20 rounded-lg">
        <p className="text-white">Deploy the contract first to mint NFTs</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-black/20 rounded-lg space-y-4">
      <h2 className="text-xl font-bold text-white">Cleopatra's Necklace NFT Collection</h2>
      <p className="text-white">
        Mint your unique Cleopatra's Necklace NFT. Each NFT is one-of-a-kind and represents a piece of ancient Egyptian history.
      </p>
      <Button 
        onClick={handleMint}
        className="w-full"
        disabled={!walletAddress}
      >
        Mint NFT
      </Button>
    </div>
  );
};

export default NFTCollection;