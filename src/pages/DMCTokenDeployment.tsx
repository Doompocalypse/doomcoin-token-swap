import VideoBackground from "@/components/VideoBackground";
import { useState, useEffect } from "react";
import WalletConnect from "@/components/WalletConnect";
import NFTDeployment from "@/components/nft/NFTDeployment";
import CollectionInfo from "@/components/nft/CollectionInfo";
import OwnedNFTs from "@/components/nft/OwnedNFTs";
import TransactionHistory from "@/components/nft/TransactionHistory";
import NFTCollection from "@/components/nft/NFTCollection";
import NFTCarousel from "@/components/nft/NFTCarousel";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import ContractInfo from "@/components/exchange/ContractInfo";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";

const STORAGE_KEY = "nft_deployment_status";

const DMCTokenDeployment = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [connectedAccount, setConnectedAccount] = useState<string>();
    const [contractAddress, setContractAddress] = useState<string>();
    const isMobile = useIsMobile();
    const navigate = useNavigate();

    // Load existing deployment on mount
    useEffect(() => {
        const savedStatus = localStorage.getItem(STORAGE_KEY);
        if (savedStatus) {
            const { contractAddress: savedAddress } = JSON.parse(savedStatus);
            console.log("Found saved contract address:", savedAddress);
            if (savedAddress) {
                setContractAddress(savedAddress);
            }
        }
    }, []);

    const handleConnect = (connected: boolean, account?: string) => {
        console.log("Wallet connection status:", connected, "Account:", account);
        setIsConnected(connected);
        setConnectedAccount(account);
    };

    const handleContractDeployed = (address: string) => {
        console.log("Contract deployed at:", address);
        setContractAddress(address);
    };

    // Add debug logs to track state
    console.log("Current state:", {
        isConnected,
        connectedAccount,
        contractAddress
    });

    return (
        <div className="relative min-h-screen">
            <VideoBackground />
            <header className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-sm">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger className="p-2 hover:bg-white/10 rounded-md transition-colors">
                                <Menu className="h-6 w-6 text-white" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-48 bg-white text-black border border-gray-200">
                                <DropdownMenuItem onClick={() => navigate("/")} className="cursor-pointer hover:bg-gray-100">
                                    Token Swap
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => navigate("/about")} className="cursor-pointer hover:bg-gray-100">
                                    NFT Marketplace
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => navigate("/token-deployment-test")} className="cursor-pointer hover:bg-gray-100">
                                    Token Deployment Test
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => navigate("/dmc-token-deployment")} className="cursor-pointer hover:bg-gray-100">
                                    DMC Token Deployment
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <h1 className="text-2xl md:text-3xl font-bold text-[#F1F1F1] tracking-tight">
                            Cleopatra's Necklace NFT Collection
                        </h1>
                    </div>
                    <WalletConnect onConnect={handleConnect} />
                </div>
            </header>

            <div className="relative z-10 container mx-auto px-4 py-8 pt-24">
                <div className="max-w-6xl mx-auto space-y-8">
                    {isConnected && connectedAccount ? (
                        <>
                            {contractAddress && (
                                <ContractInfo 
                                    contractAddress={contractAddress}
                                    walletAddress={connectedAccount}
                                />
                            )}
                            
                            {!contractAddress && (
                                <NFTDeployment 
                                    isMobile={isMobile} 
                                    onContractDeployed={handleContractDeployed}
                                />
                            )}

                            <NFTCollection 
                                contractAddress={contractAddress}
                                walletAddress={connectedAccount}
                            />
                            
                            {/* Add NFTCarousel here */}
                            <NFTCarousel connectedAccount={connectedAccount} />
                            
                            <OwnedNFTs walletAddress={connectedAccount} />
                            <TransactionHistory />
                        </>
                    ) : (
                        <div className="bg-black/40 p-6 rounded-lg">
                            <p className="text-white text-center">
                                Please connect your wallet to deploy or mint NFTs
                            </p>
                        </div>
                    )}
                    
                    <CollectionInfo />
                </div>
            </div>
        </div>
    );
};

export default DMCTokenDeployment;