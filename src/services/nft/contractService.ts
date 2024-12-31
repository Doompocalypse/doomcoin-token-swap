import { ethers } from "ethers";

// Contract addresses (Sepolia Testnet)
export const BOT_WALLET = "0x1D81C4D46302ef1866bda9f9c73962396968e054";
export const DMC_CONTRACT = "0x02655Ad2a81e396Bc35957d647179fD87b3d2b36";
export const NFT_CONTRACT = "0x6890Fc38B996371366f845a73587722307EE54F7";
export const EXCHANGE_CONTRACT = "0x529a7FdC52bb74cc0456D6d8E8693C22e2b28629";

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
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  
  const dmcContract = new ethers.Contract(DMC_CONTRACT, DMC_ABI, signer);
  const nftContract = new ethers.Contract(NFT_CONTRACT, NFT_ABI, signer);
  const exchangeContract = new ethers.Contract(EXCHANGE_CONTRACT, EXCHANGE_ABI, signer);

  const checkDMCBalance = async (account: string): Promise<bigint> => {
    console.log("Checking DMC balance for account:", account);
    const balance = await dmcContract.balanceOf(account);
    console.log("User DMC balance:", ethers.formatEther(balance));
    return balance;
  };

  const approveDMC = async (account: string, amount: bigint): Promise<void> => {
    console.log("Checking DMC allowance...");
    const allowance = await dmcContract.allowance(account, EXCHANGE_CONTRACT);
    
    if (allowance < amount) {
      console.log("Approving DMC tokens for exchange contract...");
      const approveTx = await dmcContract.approve(EXCHANGE_CONTRACT, amount);
      console.log("DMC approval transaction sent:", approveTx.hash);
      await approveTx.wait();
      console.log("DMC approval successful");
    }
  };

  const approveNFT = async (account: string): Promise<void> => {
    console.log("Checking NFT approval status...");
    const isApproved = await nftContract.isApprovedForAll(account, EXCHANGE_CONTRACT);
    
    if (!isApproved) {
      console.log("Approving NFT contract for exchange...");
      const nftApproveTx = await nftContract.setApprovalForAll(EXCHANGE_CONTRACT, true);
      console.log("NFT approval transaction sent:", nftApproveTx.hash);
      await nftApproveTx.wait();
      console.log("NFT approval successful");
    }
  };

  const purchaseNFT = async (account: string, tokenId: string): Promise<string> => {
    console.log("Executing NFT purchase through exchange contract...");
    const purchaseTx = await exchangeContract.purchaseNFT(tokenId);
    console.log("Purchase transaction sent:", purchaseTx.hash);
    const receipt = await purchaseTx.wait();
    console.log("NFT purchase successful:", receipt);
    return receipt.hash;
  };

  return {
    checkDMCBalance,
    approveDMC,
    approveNFT,
    purchaseNFT
  };
};