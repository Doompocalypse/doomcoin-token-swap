import { Button } from "@/components/ui/button";
import { Loader2, LucideIcon } from "lucide-react";

interface WalletButtonProps {
  onClick: () => Promise<void>;
  isConnecting: boolean;
  isActive: boolean;
  icon: LucideIcon;
  title: string;
  description: string;
}

const WalletButton = ({
  onClick,
  isConnecting,
  isActive,
  icon: Icon,
  title,
  description,
}: WalletButtonProps) => {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      className="w-full justify-start h-16 bg-white/10 text-white hover:bg-white/20"
      disabled={isConnecting}
    >
      {isConnecting && isActive ? (
        <Loader2 className="mr-4 h-6 w-6 animate-spin" />
      ) : (
        <Icon className="mr-4 h-6 w-6" />
      )}
      <div className="flex flex-col items-start">
        <span className="font-semibold">{title}</span>
        <span className="text-sm text-gray-300">{description}</span>
      </div>
    </Button>
  );
};

export default WalletButton;