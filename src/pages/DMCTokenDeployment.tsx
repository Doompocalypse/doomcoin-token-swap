import VideoBackground from "@/components/VideoBackground";
import { useState } from "react";
import WalletConnect from "@/components/WalletConnect";
import NFTDeployment from "@/components/nft/NFTDeployment";

const DMCTokenDeployment = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [connectedAccount, setConnectedAccount] = useState<string>();

    const handleConnect = (connected: boolean, account?: string) => {
        console.log("Wallet connection status:", connected, "Account:", account);
        setIsConnected(connected);
        setConnectedAccount(account);
    };

    return (
        <div className="relative min-h-screen">
            <VideoBackground />
            <div className="relative z-10 container mx-auto px-4 py-8">
                <div className="flex justify-end mb-4">
                    <WalletConnect onConnect={handleConnect} />
                </div>
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-2xl font-bold text-white mb-4">Cleopatra's Necklace NFT Collection</h1>
                    <p className="text-gray-300 mb-6">
                        Deploy and mint unique Cleopatra's Necklace NFTs. Each NFT costs 10,000 DMC tokens.
                        Make sure you have enough DMC tokens in your wallet before minting.
                    </p>
                    {isConnected && connectedAccount ? (
                        <NFTDeployment />
                    ) : (
                        <div className="bg-black/40 p-6 rounded-lg">
                            <p className="text-white text-center">
                                Please connect your wallet to deploy or mint NFTs
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DMCTokenDeployment;