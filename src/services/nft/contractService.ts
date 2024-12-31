import { ethers } from "ethers";
import { supabase } from "@/integrations/supabase/client";

// Contract addresses (Sepolia Testnet)
export const BOT_WALLET = "0x1D81C4D46302ef1866bda9f9c73962396968e054";
export const DMC_CONTRACT = "0x02655Ad2a81e396Bc35957d647179fD87b3d2b36";
export const NFT_CONTRACT = "0x6890Fc38B996371366f845a73587722307EE54F7";
export const EXCHANGE_CONTRACT = "0x503611484672A1B4a54f6169C119AB506E4A179e";
export const RESERVE_WALLET = "0x95A26A70ac69CeEEFd2aA75f0a117CF0f32e6bD4";

// Contract interfaces
type NFTContract = ethers.Contract & {
  transferFrom(from: string, to: string, tokenId: string): Promise<ethers.TransactionResponse>;
  ownerOf(tokenId: string): Promise<string>;
  setApprovalForAll(operator: string, approved: boolean): Promise<ethers.TransactionResponse>;
  isApprovedForAll(owner: string, operator: string): Promise<boolean>;
  safeTransferFrom(from: string, to: string, tokenId: string): Promise<ethers.TransactionResponse>;
};

type DMCContract = ethers.Contract & {
  transfer(to: string, amount: bigint): Promise<ethers.TransactionResponse>;
  approve(spender: string, amount: bigint): Promise<ethers.TransactionResponse>;
  balanceOf(account: string): Promise<bigint>;
  allowance(owner: string, spender: string): Promise<bigint>;
};

type ExchangeContract = ethers.Contract & {
  purchaseNFT(tokenId: string): Promise<ethers.TransactionResponse>;
  setNFTPrice(tokenId: string, price: bigint): Promise<ethers.TransactionResponse>;
};

// Contract ABIs
const NFT_ABI = [
  "function transferFrom(address from, address to, uint256 tokenId) external",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function setApprovalForAll(address operator, bool approved) external",
  "function isApprovedForAll(address owner, address operator) view returns (bool)",
  "function safeTransferFrom(address from, address to, uint256 tokenId) external"
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
  approveDMC: (account: string, amount: bigint) => Promise<ethers.TransactionResponse>;
  approveNFT: (account: string) => Promise<ethers.TransactionResponse>;
  purchaseNFT: (account: string, tokenId: string, amount: bigint) => Promise<ethers.TransactionResponse>;
}

export const createContractService = async (): Promise<ContractService> => {
  if (!window.ethereum) {
    throw new Error("Web3 provider not found");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  // Get Bot Wallet private key from Supabase
  console.log("Fetching Bot Wallet private key from Supabase...");
  const { data: secretData, error: secretError } = await supabase
    .from('app_settings')
    .select('value')
    .eq('key', 'BOT_WALLET_PRIVATE_KEY')
    .single();

  if (secretError || !secretData?.value) {
    console.error('Error fetching Bot Wallet private key:', secretError);
    throw new Error('Bot Wallet private key not found in app_settings');
  }

  const botWallet = new ethers.Wallet(secretData.value, provider);
  console.log("Bot Wallet address:", botWallet.address);

  const dmcContract = new ethers.Contract(DMC_CONTRACT, DMC_ABI, signer) as DMCContract;
  const nftContract = new ethers.Contract(NFT_CONTRACT, NFT_ABI, signer) as NFTContract;
  const exchangeContract = new ethers.Contract(EXCHANGE_CONTRACT, EXCHANGE_ABI, signer) as ExchangeContract;

  const checkDMCBalance = async (account: string): Promise<bigint> => {
    console.log("Checking DMC balance for account:", account);
    return dmcContract.balanceOf(account);
  };

  const approveDMC = async (account: string, amount: bigint): Promise<ethers.TransactionResponse> => {
    console.log("Checking DMC allowance for Reserve Wallet...");
    const allowance = await dmcContract.allowance(account, RESERVE_WALLET);
    console.log("Current DMC allowance:", allowance.toString());
    
    if (allowance < amount) {
      console.log("Requesting DMC approval for amount:", amount.toString());
      return dmcContract.approve(RESERVE_WALLET, amount);
    }
    console.log("Sufficient DMC allowance already exists");
    return Promise.resolve({} as ethers.TransactionResponse);
  };

  const approveNFT = async (account: string): Promise<ethers.TransactionResponse> => {
    console.log("Checking NFT approval status for account...");
    const nftContractWithBotSigner = new ethers.Contract(NFT_CONTRACT, NFT_ABI, botWallet) as NFTContract;
    const isApproved = await nftContractWithBotSigner.isApprovedForAll(BOT_WALLET, account);
    console.log("NFT approval status:", isApproved);
    
    if (!isApproved) {
      console.log("Setting NFT approval from Bot Wallet to account:", account);
      return nftContractWithBotSigner.setApprovalForAll(account, true);
    }
    console.log("NFT contract already approved");
    return Promise.resolve({} as ethers.TransactionResponse);
  };

  const purchaseNFT = async (account: string, tokenId: string, amount: bigint): Promise<ethers.TransactionResponse> => {
    console.log("Starting NFT purchase process...");
    console.log("Buyer:", account);
    console.log("Token ID:", tokenId);
    console.log("Amount:", amount.toString());
    
    try {
      // First transfer DMC to Reserve Wallet
      console.log("Transferring DMC to Reserve Wallet:", RESERVE_WALLET);
      const dmcTransferTx = await dmcContract.transfer(RESERVE_WALLET, amount);
      await dmcTransferTx.wait();
      console.log("DMC transfer confirmed");
      
      // Create new contract instance with Bot Wallet signer
      const nftContractWithBotSigner = new ethers.Contract(NFT_CONTRACT, NFT_ABI, botWallet) as NFTContract;
      
      // Check if Bot Wallet owns the NFT
      const currentOwner = await nftContract.ownerOf(tokenId);
      console.log("Current NFT owner:", currentOwner);
      
      if (currentOwner.toLowerCase() !== BOT_WALLET.toLowerCase()) {
        throw new Error("Bot Wallet does not own this NFT");
      }
      
      // Transfer NFT from Bot Wallet to buyer using safeTransferFrom
      console.log("Transferring NFT from Bot Wallet to buyer");
      console.log("From:", BOT_WALLET);
      console.log("To:", account);
      return nftContractWithBotSigner.safeTransferFrom(BOT_WALLET, account, tokenId);
    } catch (error) {
      console.error("Error in NFT purchase process:", error);
      throw error;
    }
  };

  return {
    checkDMCBalance,
    approveDMC,
    approveNFT,
    purchaseNFT
  };
};