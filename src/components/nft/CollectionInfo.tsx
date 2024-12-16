const CollectionInfo = () => {
    return (
        <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white">Deploy Cleopatra's Necklace NFT Collection</h3>
            <p className="text-gray-400">
                Deploy a new NFT collection on Sepolia (test) or Arbitrum One with the following specifications:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-1">
                <li>6 unique Cleopatra's Necklace NFTs</li>
                <li>Price: 10,000 DMC per NFT</li>
                <li>10% royalty on secondary sales</li>
                <li>Exclusive DMC payment support</li>
            </ul>
        </div>
    );
};

export default CollectionInfo;