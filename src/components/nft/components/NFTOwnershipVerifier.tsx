import { ethers } from "ethers";
import CleopatraNFTContract from "@/contracts/CleopatraNecklaceNFT.json";

interface NFTOwnershipVerifierProps {
  contractAddress: string;
  tokenId: string;
}

const NFTOwnershipVerifier = async ({ contractAddress, tokenId }: NFTOwnershipVerifierProps) => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(
      contractAddress,
      CleopatraNFTContract.abi,
      provider
    );
    
    const accounts = await provider.listAccounts();
    if (!accounts[0]) throw new Error("No wallet connected");
    
    // First check if the token exists
    try {
      await contract.ownerOf(tokenId);
    } catch (error) {
      console.error("Token does not exist:", error);
      return false;
    }
    
    // Then verify ownership
    const owner = await contract.ownerOf(tokenId);
    const currentAccount = accounts[0].toLowerCase();
    const tokenOwner = owner.toLowerCase();
    
    console.log("NFT ownership check:", {
      tokenId,
      owner: tokenOwner,
      currentAccount,
      isOwner: tokenOwner === currentAccount
    });
    
    return tokenOwner === currentAccount;
  } catch (error) {
    console.error("Error verifying ownership:", error);
    return false;
  }
};

export default NFTOwnershipVerifier;