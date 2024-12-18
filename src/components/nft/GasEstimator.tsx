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
                    console.log("Starting gas estimation for NFT deployment...");
                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    const feeData = await provider.getFeeData();
                    const gasPrice = feeData.gasPrice;
                    
                    if (!gasPrice) {
                        console.error("Could not get gas price");
                        throw new Error("Could not get gas price");
                    }
                    
                    const gasPriceInGwei = ethers.utils.formatUnits(gasPrice, "gwei");
                    console.log("Current gas price:", gasPriceInGwei, "Gwei");
                    setCurrentGasPrice(gasPriceInGwei);
                    
                    const estimatedGasUnits = GAS_CONFIG.initial.gasLimit;
                    console.log("Estimated gas units:", estimatedGasUnits.toString());
                    
                    const totalGasCost = gasPrice.mul(estimatedGasUnits);
                    console.log("Total gas cost (wei):", totalGasCost.toString());
                    
                    const gasCostInEth = ethers.utils.formatEther(totalGasCost);
                    console.log("Total gas cost (ETH):", gasCostInEth);
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