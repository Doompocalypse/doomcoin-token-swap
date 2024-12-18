import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import VideoPlayer from "./VideoPlayer";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface OwnedNFT {
    nft_id: string;
    name: string;
    video_url: string;
    description: string | null;
}

const OwnedNFTs = ({ walletAddress }: { walletAddress: string }) => {
    const { data: ownedNFTs, isLoading } = useQuery({
        queryKey: ['owned-nfts', walletAddress],
        queryFn: async () => {
            console.log('Fetching owned NFTs for address:', walletAddress);
            const { data, error } = await supabase
                .from('mock_purchases')
                .select(`
                    nft_id,
                    mock_nfts (
                        name,
                        video_url,
                        description
                    )
                `)
                .eq('buyer_address', walletAddress);

            if (error) {
                console.error('Error fetching owned NFTs:', error);
                throw error;
            }

            console.log('Received owned NFTs:', data);
            return data.map(purchase => ({
                nft_id: purchase.nft_id,
                ...purchase.mock_nfts
            })) as OwnedNFT[];
        },
    });

    if (isLoading) {
        return <div className="text-white">Loading your NFTs...</div>;
    }

    if (!ownedNFTs?.length) {
        return (
            <div className="bg-black/40 p-6 rounded-lg">
                <h2 className="text-xl font-bold text-white mb-2">My NFTs</h2>
                <p className="text-gray-300">You don't own any NFTs from this collection yet.</p>
            </div>
        );
    }

    return (
        <div className="bg-black/40 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-white mb-4">My NFTs</h2>
            <ScrollArea className="h-[400px]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ownedNFTs.map((nft) => (
                        <Card key={nft.nft_id} className="bg-black/40 border-[#8E9196]/20">
                            <VideoPlayer videoUrl={nft.video_url} />
                            <div className="p-4">
                                <h3 className="text-lg font-bold text-white mb-2">{nft.name}</h3>
                                {nft.description && (
                                    <p className="text-gray-300 text-sm">{nft.description}</p>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
};

export default OwnedNFTs;