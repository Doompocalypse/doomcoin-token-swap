import React from "react";
import { Button } from "@/components/ui/button";

interface SwapButtonProps {
  isConnected: boolean;
  disabled: boolean;
  onClick: () => void;
}

const SwapButton = ({ isConnected, disabled, onClick }: SwapButtonProps) => (
  <Button
    onClick={onClick}
    disabled={disabled}
    className="w-full bg-white hover:bg-white/90 transition-opacity text-black font-medium py-6"
  >
    {isConnected ? "Swap For DMC" : "Connect Wallet to Swap"}
  </Button>
);

export default SwapButton;