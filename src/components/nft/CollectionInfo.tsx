import { COLLECTION_METADATA } from "@/constants/nftCollectionMetadata";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

const CollectionInfo = () => {
    return (
        <Card className="p-6 space-y-4 bg-black/40">
            <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white">{COLLECTION_METADATA.name} Collection</h3>
                <p className="text-gray-300">
                    {COLLECTION_METADATA.description}
                </p>
            </div>
            
            <div className="space-y-2">
                <h4 className="text-lg font-semibold text-white">Collection Details</h4>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                    <li>Symbol: {COLLECTION_METADATA.symbol}</li>
                    <li>Total Pieces: {COLLECTION_METADATA.pieces.length}</li>
                    <li>Price: 10,000 DMC per NFT</li>
                    <li>Royalty: {COLLECTION_METADATA.seller_fee_basis_points / 100}% on secondary sales</li>
                </ul>
            </div>

            <div className="space-y-2">
                <h4 className="text-lg font-semibold text-white">Available Pieces</h4>
                <ScrollArea className="h-[200px] rounded-md border border-gray-800 p-4">
                    <div className="space-y-4">
                        {COLLECTION_METADATA.pieces.map((piece) => (
                            <div key={piece.id} className="space-y-2">
                                <h5 className="text-white font-medium">{piece.name}</h5>
                                <p className="text-gray-400 text-sm">{piece.description}</p>
                                <div className="flex flex-wrap gap-2">
                                    {piece.attributes.map((attr, index) => (
                                        <span 
                                            key={index}
                                            className="px-2 py-1 bg-gray-800 rounded-full text-xs text-gray-300"
                                        >
                                            {attr.trait_type}: {attr.value}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>
        </Card>
    );
};

export default CollectionInfo;