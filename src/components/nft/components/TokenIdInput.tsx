import React from "react";
import { Input } from "@/components/ui/input";

interface TokenIdInputProps {
  tokenId: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

const TokenIdInput = ({ tokenId, onChange, disabled }: TokenIdInputProps) => {
  return (
    <div className="flex items-center gap-2">
      <Input
        type="text"
        value={tokenId}
        onChange={(e) => onChange(e.target.value.toUpperCase())}
        className="w-20 px-2 py-1 text-sm bg-black/20 border border-green-400/20 rounded text-green-400"
        placeholder="01A"
        maxLength={3}
        pattern="\d{2}[AB]"
        disabled={disabled}
      />
      <span className="text-sm text-green-300">← Enter your Token ID (01A for Tier NFTs, 01B for Collection NFTs)</span>
    </div>
  );
};

export default TokenIdInput;