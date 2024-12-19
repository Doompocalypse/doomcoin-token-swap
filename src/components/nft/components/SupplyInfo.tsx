import React from "react";

interface SupplyInfoProps {
  isLoading: boolean;
  totalSupply: number;
}

const SupplyInfo = ({ isLoading, totalSupply }: SupplyInfoProps) => {
  if (isLoading) {
    return <p className="text-green-300 text-sm">Loading available NFTs...</p>;
  }

  if (totalSupply === 0) {
    return (
      <p className="text-green-300 text-sm">
        No NFTs have been minted yet in this collection. Mint an NFT first to view it in MetaMask.
      </p>
    );
  }

  return (
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
    </>
  );
};

export default SupplyInfo;