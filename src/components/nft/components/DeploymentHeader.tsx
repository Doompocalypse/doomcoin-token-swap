import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import WalletConnect from "@/components/WalletConnect";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DeploymentHeaderProps {
    onConnect: (connected: boolean, account?: string) => void;
}

const DeploymentHeader = ({ onConnect }: DeploymentHeaderProps) => {
    const navigate = useNavigate();

    return (
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
                <WalletConnect onConnect={onConnect} />
            </div>
        </header>
    );
};

export default DeploymentHeader;