import { useNavigate, useLocation } from "react-router-dom";
import WalletConnect from "@/components/WalletConnect";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";

interface HeaderProps {
  onConnect: (connected: boolean, account?: string) => void;
}

const Header = ({ onConnect }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Token Swap';
      case '/nft-marketplace':
        return 'NFT Marketplace';
      case '/affiliate-program':
        return 'Affiliate Program';
      default:
        return 'Token Swap';
    }
  };

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
              <DropdownMenuItem onClick={() => navigate("/nft-marketplace")} className="cursor-pointer hover:bg-gray-100">
                NFT Marketplace
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/affiliate-program")} className="cursor-pointer hover:bg-gray-100">
                Affiliate Program
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <h1 className="text-2xl md:text-3xl font-bold text-[#F1F1F1] tracking-tight">
            {getPageTitle()}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <WalletConnect onConnect={onConnect} />
        </div>
      </div>
    </header>
  );
};

export default Header;