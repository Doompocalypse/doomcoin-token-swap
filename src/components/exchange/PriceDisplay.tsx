import React from "react";

interface PriceDisplayProps {
  ethPrice: number;
}

const PriceDisplay = ({ ethPrice }: PriceDisplayProps) => (
  <span className="text-xs text-[#8E9196]">
    1 USD = 1 DMC
  </span>
);

export default PriceDisplay;