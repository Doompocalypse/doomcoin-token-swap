import { ethers } from "ethers";

// Contract addresses (Sepolia Testnet)
export const BOT_WALLET = "0x1D81C4D46302ef1866bda9f9c73962396968e054";
export const DMC_CONTRACT = "0x02655Ad2a81e396Bc35957d647179fD87b3d2b36";
export const NFT_CONTRACT = "0x6890Fc38B996371366f845a73587722307EE54F7";
export const EXCHANGE_CONTRACT = "0x503611484672A1B4a54f6169C119AB506E4A179e";

// Contract ABIs
const NFT_ABI = [
  "function mint(address to, uint256 tokenId) external",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function setApprovalForAll(address operator, bool approved) external",
  "function isApprovedForAll(address owner, address operator) view returns (bool)"
];

const DMC_ABI = [
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function balanceOf(address account) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)"
];

const EXCHANGE_ABI = [
  "function purchaseNFT(uint256 tokenId) external",
  "function setNFTPrice(uint256 tokenId, uint256 price) external"
];

export interface ContractService {
  checkDMCBalance: (account: string) => Promise<bigint>;
  approveDMC: (account: string, amount: bigint) => Promise<void>;
  approveNFT: (account: string) => Promise<void>;
  purchaseNFT: (account: string, tokenId: string) => Promise<string>;
}

export const createContractService = async (): Promise<ContractService> => {
  console.log("Creating contract service...");
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  
  console.log("Initializing contracts with addresses:");
  console.log("DMC Contract:", DMC_CONTRACT);
  console.log("NFT Contract:", NFT_CONTRACT);
  console.log("Exchange Contract:", EXCHANGE_CONTRACT);
  
  const dmcContract = new ethers.Contract(DMC_CONTRACT, DMC_ABI, signer);
  const nftContract = new ethers.Contract(NFT_CONTRACT, NFT_ABI, signer);
  const exchangeContract = new ethers.Contract(EXCHANGE_CONTRACT, EXCHANGE_ABI, signer);

  const checkDMCBalance = async (account: string): Promise<bigint> => {
    console.log("Checking DMC balance for account:", account);
    try {
      const balance = await dmcContract.balanceOf(account);
      console.log("User DMC balance:", ethers.formatEther(balance), "DMC");
      return balance;
    } catch (error) {
      console.error("Error checking DMC balance:", error);
      throw new Error("Failed to check DMC balance");
    }
  };

  const approveDMC = async (account: string, amount: bigint): Promise<void> => {
    console.log("Checking DMC allowance...");
    console.log("Account:", account);
    console.log("Amount to approve:", ethers.formatEther(amount), "DMC");
    
    try {
      const allowance = await dmcContract.allowance(account, EXCHANGE_CONTRACT);
      console.log("Current allowance:", ethers.formatEther(allowance), "DMC");
      
      if (allowance < amount) {
        console.log("Requesting DMC approval from wallet...");
        const approveTx = await dmcContract.approve(EXCHANGE_CONTRACT, amount);
        console.log("DMC approval transaction sent:", approveTx.hash);
        await approveTx.wait();
        console.log("DMC approval successful");
        
        // Verify approval
        const newAllowance = await dmcContract.allowance(account, EXCHANGE_CONTRACT);
        console.log("New allowance after approval:", ethers.formatEther(newAllowance), "DMC");
        
        if (newAllowance < amount) {
          throw new Error("DMC approval failed - allowance not increased");
        }
      } else {
        console.log("DMC already approved for the required amount");
      }
    } catch (error: any) {
      console.error("Error in DMC approval:", error);
      if (error.code === 'ACTION_REJECTED') {
        throw new Error("You rejected the DMC approval request");
      }
      throw new Error("Failed to approve DMC tokens");
    }
  };

  const approveNFT = async (account: string): Promise<void> => {
    console.log("Checking NFT approval status...");
    console.log("Account:", account);
    
    try {
      const isApproved = await nftContract.isApprovedForAll(account, EXCHANGE_CONTRACT);
      console.log("Current NFT approval status:", isApproved);
      
      if (!isApproved) {
        console.log("Requesting NFT approval from wallet...");
        const nftApproveTx = await nftContract.setApprovalForAll(EXCHANGE_CONTRACT, true);
        console.log("NFT approval transaction sent:", nftApproveTx.hash);
        await nftApproveTx.wait();
        console.log("NFT approval successful");
        
        // Verify approval
        const newApprovalStatus = await nftContract.isApprovedForAll(account, EXCHANGE_CONTRACT);
        console.log("New NFT approval status:", newApprovalStatus);
        
        if (!newApprovalStatus) {
          throw new Error("NFT approval failed - not approved");
        }
      } else {
        console.log("NFT already approved for the exchange contract");
      }
    } catch (error: any) {
      console.error("Error in NFT approval:", error);
      if (error.code === 'ACTION_REJECTED') {
        throw new Error("You rejected the NFT approval request");
      }
      throw new Error("Failed to approve NFT contract");
    }
  };

  const purchaseNFT = async (account: string, tokenId: string): Promise<string> => {
    console.log("Starting NFT purchase process...");
    console.log("Token ID:", tokenId);
    console.log("Buyer address:", account);
    
    try {
      // Verify DMC balance and allowance before purchase
      const balance = await checkDMCBalance(account);
      const allowance = await dmcContract.allowance(account, EXCHANGE_CONTRACT);
      console.log("Current DMC balance:", ethers.formatEther(balance), "DMC");
      console.log("Current DMC allowance:", ethers.formatEther(allowance), "DMC");
      
      console.log("Executing NFT purchase through exchange contract...");
      const purchaseTx = await exchangeContract.purchaseNFT(tokenId);
      console.log("Purchase transaction sent:", purchaseTx.hash);
      const receipt = await purchaseTx.wait();
      console.log("NFT purchase successful:", receipt);
      
      // Verify the purchase
      try {
        const owner = await nftContract.ownerOf(tokenId);
        console.log("New NFT owner:", owner);
        if (owner.toLowerCase() !== account.toLowerCase()) {
          console.warn("Warning: NFT ownership verification failed");
        }
      } catch (error) {
        console.warn("Warning: Could not verify NFT ownership:", error);
      }
      
      return receipt.hash;
    } catch (error: any) {
      console.error("Error in NFT purchase:", error);
      if (error.code === 'ACTION_REJECTED') {
        throw new Error("You rejected the purchase transaction");
      }
      // Extract more meaningful error message if possible
      const errorMessage = error.reason || error.message || "Failed to purchase NFT";
      throw new Error(errorMessage);
    }
  };

  return {
    checkDMCBalance,
    approveDMC,
    approveNFT,
    purchaseNFT
  };
};