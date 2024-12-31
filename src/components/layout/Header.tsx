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
      case '/nft-vault':
        return 'NFT Vault';
      default:
        return 'Token Swap';
    }
  };

  const handleNavigation = (path: string) => {
    console.log('Navigating to:', path);
    navigate(path);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger className="p-2 hover:bg-white/10 rounded-md transition-colors">
              <Menu className="h-6 w-6 text-white" />
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="start" 
              className="w-48 bg-zinc-900 border border-zinc-800 shadow-xl"
            >
              <DropdownMenuItem 
                onClick={() => handleNavigation("/")} 
                className="cursor-pointer text-gray-200 focus:bg-zinc-800 focus:text-white"
              >
                Token Swap
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleNavigation("/nft-marketplace")} 
                className="cursor-pointer text-gray-200 focus:bg-zinc-800 focus:text-white"
              >
                NFT Marketplace
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleNavigation("/affiliate-program")} 
                className="cursor-pointer text-gray-200 focus:bg-zinc-800 focus:text-white"
              >
                Affiliate Program
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleNavigation("/nft-vault")} 
                className="cursor-pointer text-gray-200 focus:bg-zinc-800 focus:text-white"
              >
                NFT Vault
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