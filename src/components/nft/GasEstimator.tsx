import { useState } from "react";
import { ethers } from "ethers";

interface GasEstimatorProps {
    onEstimateComplete: (estimatedCost: ethers.BigNumber) => void;
}

const GasEstimator = ({ onEstimateComplete }: GasEstimatorProps) => {
    const [estimatedGas, setEstimatedGas] = useState<string>("");

    const estimateGasPrice = async (provider: ethers.providers.Web3Provider) => {
        try {
            const feeData = await provider.getFeeData();
            const gasPrice = feeData.gasPrice;
            if (!gasPrice) throw new Error("Could not get gas price");
            
            const estimatedGasUnits = 3000000;
            const totalGasCost = gasPrice.mul(estimatedGasUnits);
            
            const gasCostInEth = ethers.utils.formatEther(totalGasCost);
            setEstimatedGas(gasCostInEth);
            
            onEstimateComplete(totalGasCost);
            return totalGasCost;
        } catch (error) {
            console.error("Error estimating gas:", error);
            throw error;
        }
    };

    return estimatedGas ? (
        <div className="p-4 bg-blue-900/20 rounded-lg">
            <p className="text-blue-400">
                Estimated gas cost: {estimatedGas} ETH
            </p>
        </div>
    ) : null;
};

export default GasEstimator;