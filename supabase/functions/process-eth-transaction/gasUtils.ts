import { ethers } from 'https://esm.sh/ethers@6.11.1';

export async function estimateGasWithFallback(dmcContract: ethers.Contract, toAddress: string, amount: bigint) {
  try {
    const gasEstimate = await dmcContract.transfer.estimateGas(toAddress, amount);
    console.log('Initial gas estimate:', gasEstimate.toString());
    return gasEstimate * BigInt(120) / BigInt(100); // Add 20% buffer
  } catch (error) {
    console.warn('Failed to estimate gas, using fallback:', error);
    return BigInt(100000); // Conservative fallback
  }
}

export async function getFeeData(provider: ethers.Provider) {
  try {
    const feeData = await provider.getFeeData();
    console.log('Raw fee data:', {
      maxFeePerGas: feeData.maxFeePerGas?.toString(),
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas?.toString(),
      gasPrice: feeData.gasPrice?.toString(),
    });

    if (!feeData.maxFeePerGas || !feeData.maxPriorityFeePerGas) {
      if (!feeData.gasPrice) {
        // Last resort fallback: use hardcoded conservative values
        const fallbackGasPrice = ethers.parseUnits('0.1', 'gwei');
        console.log('Using hardcoded fallback gas price:', fallbackGasPrice.toString());
        
        return {
          maxFeePerGas: fallbackGasPrice * BigInt(2),
          maxPriorityFeePerGas: fallbackGasPrice,
        };
      }
      
      const gasPrice = feeData.gasPrice * BigInt(80) / BigInt(100);
      console.log('Using legacy gas price:', gasPrice.toString());
      
      return {
        maxFeePerGas: gasPrice * BigInt(2),
        maxPriorityFeePerGas: gasPrice,
      };
    }

    const maxFeePerGas = feeData.maxFeePerGas * BigInt(80) / BigInt(100);
    const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas * BigInt(80) / BigInt(100);

    console.log('Adjusted EIP-1559 fees:', {
      maxFeePerGas: maxFeePerGas.toString(),
      maxPriorityFeePerGas: maxPriorityFeePerGas.toString(),
    });

    return { maxFeePerGas, maxPriorityFeePerGas };
  } catch (error) {
    console.error('Error getting fee data:', error);
    // Last resort fallback: use hardcoded conservative values
    const fallbackGasPrice = ethers.parseUnits('0.1', 'gwei');
    console.log('Using hardcoded fallback gas price:', fallbackGasPrice.toString());
    
    return {
      maxFeePerGas: fallbackGasPrice * BigInt(2),
      maxPriorityFeePerGas: fallbackGasPrice,
    };
  }
}

export async function checkGasFees(provider: ethers.Provider, botWallet: ethers.Wallet, dmcContract: ethers.Contract, toAddress: string, amount: bigint) {
  try {
    const gasEstimate = await estimateGasWithFallback(dmcContract, toAddress, amount);
    const { maxFeePerGas, maxPriorityFeePerGas } = await getFeeData(provider);
    
    const totalGasCost = gasEstimate * maxFeePerGas;
    const botBalance = await provider.getBalance(botWallet.address);
    
    console.log('Gas estimate:', gasEstimate.toString());
    console.log('Max fee per gas:', maxFeePerGas.toString());
    console.log('Max priority fee per gas:', maxPriorityFeePerGas.toString());
    console.log('Maximum total gas cost:', totalGasCost.toString());
    console.log('Bot ETH balance:', botBalance.toString());
    
    if (botBalance < totalGasCost) {
      throw new Error(`Insufficient ETH for gas fees. Required: ${ethers.formatEther(totalGasCost)} ETH, Available: ${ethers.formatEther(botBalance)} ETH`);
    }
    
    return { gasEstimate, maxFeePerGas, maxPriorityFeePerGas };
  } catch (error) {
    console.error('Error checking gas fees:', error);
    throw error;
  }
}