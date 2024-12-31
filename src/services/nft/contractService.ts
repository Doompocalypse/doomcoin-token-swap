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
  approveDMC: (account: string, amount: bigint) => Promise<ethers.TransactionResponse>;
  approveNFT: (account: string) => Promise<ethers.TransactionResponse>;
  purchaseNFT: (account: string, tokenId: string) => Promise<ethers.TransactionResponse>;
}

export const createContractService = async (): Promise<ContractService> => {
  if (!window.ethereum) {
    throw new Error("Web3 provider not found");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  
  const dmcContract = new ethers.Contract(DMC_CONTRACT, DMC_ABI, signer);
  const nftContract = new ethers.Contract(NFT_CONTRACT, NFT_ABI, signer);
  const exchangeContract = new ethers.Contract(EXCHANGE_CONTRACT, EXCHANGE_ABI, signer);

  const checkDMCBalance = async (account: string): Promise<bigint> => {
    return dmcContract.balanceOf(account);
  };

  const approveDMC = async (account: string, amount: bigint): Promise<ethers.TransactionResponse> => {
    const allowance = await dmcContract.allowance(account, EXCHANGE_CONTRACT);
    if (allowance < amount) {
      return dmcContract.approve(EXCHANGE_CONTRACT, amount);
    }
    return Promise.resolve({} as ethers.TransactionResponse);
  };

  const approveNFT = async (account: string): Promise<ethers.TransactionResponse> => {
    const isApproved = await nftContract.isApprovedForAll(account, EXCHANGE_CONTRACT);
    if (!isApproved) {
      return nftContract.setApprovalForAll(EXCHANGE_CONTRACT, true);
    }
    return Promise.resolve({} as ethers.TransactionResponse);
  };

  const purchaseNFT = async (account: string, tokenId: string): Promise<ethers.TransactionResponse> => {
    return exchangeContract.purchaseNFT(tokenId);
  };

  return {
    checkDMCBalance,
    approveDMC,
    approveNFT,
    purchaseNFT
  };
};