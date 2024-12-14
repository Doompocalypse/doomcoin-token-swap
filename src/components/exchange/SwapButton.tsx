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
    className="w-full bg-[#33C3F0] hover:opacity-90 transition-opacity text-white font-medium py-6"
  >
    {isConnected ? "Swap" : "Connect Wallet to Swap"}
  </Button>
);

export default SwapButton;