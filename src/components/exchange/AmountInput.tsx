import React from "react";
import { Input } from "@/components/ui/input";
import PriceDisplay from "./PriceDisplay";

interface AmountInputProps {
  usdAmount: string;
  ethPrice: number;
  ethValue: string;
  onAmountChange: (value: string) => void;
}

const AmountInput = ({ usdAmount, ethPrice, ethValue, onAmountChange }: AmountInputProps) => (
  <div>
    <div className="flex justify-between items-center mb-2">
      <label className="text-sm text-[#8E9196]">Enter An Amount ($USD)</label>
      <PriceDisplay ethPrice={ethPrice} />
    </div>
    <Input
      type="number"
      placeholder="0.0"
      value={usdAmount}
      onChange={(e) => onAmountChange(e.target.value)}
      className="bg-[#1A1F2C] border-[#8E9196]/20 focus:border-[#8E9196] text-lg"
    />
    <p className="mt-2 text-sm text-[#8E9196]">≈ {ethValue} ETH</p>
  </div>
);

export default AmountInput;