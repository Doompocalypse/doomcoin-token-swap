import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ContractInfo = ({ contractAddress, walletAddress }: { contractAddress?: string, walletAddress?: string }) => {
  const navigate = useNavigate();

  if (!contractAddress) {
    return (
      <div className="text-xs text-white space-y-1 text-center">
        <p>Contract Address: Deploy the contract to get your unique address</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-green-900/20 rounded-lg space-y-4">
      <div className="text-sm text-green-400 space-y-2">
        <h3 className="font-semibold">🎉 Contract Successfully Deployed!</h3>
        <p>Your contract is ready at: {contractAddress}</p>
        {walletAddress && (
          <p className="text-xs">Connected Wallet: {walletAddress}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-green-400">Next Steps:</h4>
        <ol className="list-decimal list-inside text-sm text-green-300 space-y-1">
          <li>Mint NFTs from the collection below</li>
          <li>Import your minted NFTs to MetaMask</li>
          <li>View your owned NFTs in the collection</li>
        </ol>
      </div>

      <Button 
        variant="outline" 
        className="w-full text-green-400 border-green-400 hover:bg-green-400/20"
        onClick={() => window.open(`https://sepolia.etherscan.io/address/${contractAddress}`, '_blank')}
      >
        View Contract on Etherscan
      </Button>
    </div>
  );
};

export default ContractInfo;