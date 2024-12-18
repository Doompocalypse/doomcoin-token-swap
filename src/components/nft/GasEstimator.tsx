import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { GAS_CONFIG } from "@/scripts/constants/deploymentConstants";

interface GasEstimatorProps {
    onEstimateComplete: (estimatedCost: ethers.BigNumber) => void;
}

const GasEstimator = ({ onEstimateComplete }: GasEstimatorProps) => {
    const [estimatedGas, setEstimatedGas] = useState<string>("");
    const [currentGasPrice, setCurrentGasPrice] = useState<string>("");
    const [maxFeePerGas, setMaxFeePerGas] = useState<string>("");

    useEffect(() => {
        const estimateGas = async () => {
            if (window.ethereum) {
                try {
                    console.log("Starting gas estimation for NFT deployment...");
                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    const feeData = await provider.getFeeData();
                    
                    if (!feeData.gasPrice || !feeData.maxFeePerGas) {
                        console.error("Could not get gas price data");
                        throw new Error("Could not get gas price data");
                    }
                    
                    // Add 20% buffer to gas price for higher likelihood of success
                    const adjustedGasPrice = feeData.gasPrice.mul(120).div(100);
                    const gasPriceInGwei = ethers.utils.formatUnits(adjustedGasPrice, "gwei");
                    console.log("Adjusted gas price:", gasPriceInGwei, "Gwei");
                    setCurrentGasPrice(gasPriceInGwei);
                    
                    // Set max fee per gas with buffer
                    const adjustedMaxFee = feeData.maxFeePerGas.mul(120).div(100);
                    const maxFeeInGwei = ethers.utils.formatUnits(adjustedMaxFee, "gwei");
                    console.log("Max fee per gas:", maxFeeInGwei, "Gwei");
                    setMaxFeePerGas(maxFeeInGwei);
                    
                    // Increase gas limit by 20% for safety
                    const estimatedGasUnits = GAS_CONFIG.initial.gasLimit.mul(120).div(100);
                    console.log("Estimated gas units (with buffer):", estimatedGasUnits.toString());
                    
                    const totalGasCost = adjustedGasPrice.mul(estimatedGasUnits);
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
        // Refresh estimates every 30 seconds
        const interval = setInterval(estimateGas, 30000);
        return () => clearInterval(interval);
    }, [onEstimateComplete]);

    return (
        <div className="p-4 bg-blue-900/20 rounded-lg space-y-2">
            <p className="text-blue-400">
                Estimated deployment cost: {estimatedGas} ETH
            </p>
            <p className="text-sm text-blue-300">
                Current gas price: {currentGasPrice} Gwei
            </p>
            <p className="text-sm text-blue-300">
                Max fee per gas: {maxFeePerGas} Gwei
            </p>
            <p className="text-xs text-blue-300/80">
                Gas limit: {GAS_CONFIG.initial.gasLimit.mul(120).div(100).toLocaleString()} units (includes 20% buffer)
            </p>
            <p className="text-xs text-yellow-300/80">
                Note: Estimates include a 20% buffer to increase transaction success rate
            </p>
        </div>
    );
};

export default GasEstimator;