import React from "react";
import { Input } from "@/components/ui/input";

interface TokenIdInputProps {
  tokenId: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

const TokenIdInput = ({ tokenId, onChange, disabled }: TokenIdInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numeric input
    const value = e.target.value.replace(/\D/g, '');
    onChange(value);
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        type="text"
        value={tokenId}
        onChange={handleChange}
        className="w-20 px-2 py-1 text-sm bg-black/20 border border-green-400/20 rounded text-green-400"
        placeholder="1"
        maxLength={3}
        pattern="\d*"
        disabled={disabled}
      />
      <span className="text-sm text-green-300">← Enter your Token ID (e.g. 1, 2, 3)</span>
    </div>
  );
};

export default TokenIdInput;