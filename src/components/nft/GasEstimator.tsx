import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { GAS_CONFIG } from "@/scripts/constants/deploymentConstants";

interface GasEstimatorProps {
    onEstimateComplete: (estimatedCost: ethers.BigNumber) => void;
}

const GasEstimator = ({ onEstimateComplete }: GasEstimatorProps) => {
    const [estimatedGas, setEstimatedGas] = useState<string>("");
    const [currentGasPrice, setCurrentGasPrice] = useState<string>("");

    useEffect(() => {
        const estimateGas = async () => {
            if (window.ethereum) {
                try {
                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    const feeData = await provider.getFeeData();
                    const gasPrice = feeData.gasPrice;
                    
                    if (!gasPrice) throw new Error("Could not get gas price");
                    
                    const gasPriceInGwei = ethers.utils.formatUnits(gasPrice, "gwei");
                    setCurrentGasPrice(gasPriceInGwei);
                    
                    const estimatedGasUnits = GAS_CONFIG.initial.gasLimit;
                    const totalGasCost = gasPrice.mul(estimatedGasUnits);
                    
                    const gasCostInEth = ethers.utils.formatEther(totalGasCost);
                    setEstimatedGas(gasCostInEth);
                    
                    onEstimateComplete(totalGasCost);
                } catch (error) {
                    console.error("Error estimating gas:", error);
                }
            }
        };

        estimateGas();
    }, [onEstimateComplete]);

    return (
        <div className="p-4 bg-blue-900/20 rounded-lg space-y-2">
            <p className="text-blue-400">
                Estimated deployment cost: {estimatedGas} ETH
            </p>
            <p className="text-sm text-blue-300">
                Current gas price: {currentGasPrice} Gwei
            </p>
            <p className="text-xs text-blue-300/80">
                Gas limit: {GAS_CONFIG.initial.gasLimit.toLocaleString()} units
            </p>
        </div>
    );
};

export default GasEstimator;