import { ethers } from "ethers";
import { supabase } from "@/integrations/supabase/client";
import { ARBITRUM_CHAIN_ID, SEPOLIA_CHAIN_ID } from "@/utils/chainConfig";
import { isSupportedChain } from "@/utils/chainConfig";
import { BOT_WALLET, DMC_CONTRACT, EXCHANGE_CONTRACT, RESERVE_WALLET } from "@/utils/contractAddresses";

// Export NFT_CONTRACT from contractAddresses
export { NFT_CONTRACT } from "@/utils/contractAddresses";

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
  "function safeTransferFrom(address from, address to, uint256 tokenId) external",
];

const DMC_ABI = [
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function balanceOf(address account) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
];

const EXCHANGE_ABI = [
  "function purchaseNFT(uint256 tokenId) external",
  "function setNFTPrice(uint256 tokenId, uint256 price) external",
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
  const chainId = await provider.getNetwork().then((network) => network.chainId.toString(16));
  console.log("Current chain ID:", chainId);

  if (!isSupportedChain(chainId)) {
    throw new Error("Please connect to either Arbitrum One or Sepolia network");
  }

  const signer = await provider.getSigner();

  // Get Bot Wallet private key from Supabase
  console.log("Fetching Bot Wallet private key from Supabase...");
  const { data: secretData, error: secretError } = await supabase
    .from("app_settings")
    .select("value")
    .eq("key", "BOT_WALLET_PRIVATE_KEY")
    .single();

  if (secretError || !secretData?.value) {
    console.error("Error fetching Bot Wallet private key:", secretError);
    throw new Error("Bot Wallet private key not found in app_settings");
  }

  const botWalletInstance = new ethers.Wallet(secretData.value, provider);
  console.log("Bot Wallet address:", botWalletInstance.address);

  const rpcUrl =
    chainId.toLowerCase() === ARBITRUM_CHAIN_ID.toLowerCase()
      ? "https://arb1.arbitrum.io/rpc"
      : "https://rpc.sepolia.org";

  console.log("Using RPC URL:", rpcUrl);

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
    const nftContractWithBotSigner = new ethers.Contract(NFT_CONTRACT, NFT_ABI, botWalletInstance) as NFTContract;
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
      const dmcReceipt = await dmcTransferTx.wait();
      console.log("DMC transfer confirmed in block:", dmcReceipt.blockNumber);

      // Create new contract instance with Bot Wallet signer
      const nftContractWithBotSigner = new ethers.Contract(NFT_CONTRACT, NFT_ABI, botWalletInstance) as NFTContract;

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
      const nftTransferTx = await nftContractWithBotSigner.safeTransferFrom(BOT_WALLET, account, tokenId);

      // Wait for NFT transfer to be confirmed
      console.log("Waiting for NFT transfer confirmation...");
      const nftReceipt = await nftTransferTx.wait();
      console.log("NFT transfer confirmed in block:", nftReceipt.blockNumber);

      return nftTransferTx;
    } catch (error) {
      console.error("Error in NFT purchase process:", error);
      throw error;
    }
  };

  return {
    checkDMCBalance,
    approveDMC,
    approveNFT,
    purchaseNFT,
  };
};