import { ethers } from "ethers";
import CleopatraNFTContract from "@/contracts/CleopatraNecklaceNFT.json";

interface NFTOwnershipVerifierProps {
  contractAddress: string;
  tokenId: string;
}

const NFTOwnershipVerifier = async ({ contractAddress, tokenId }: NFTOwnershipVerifierProps) => {
  try {
    console.log("Verifying NFT ownership...", {
      contractAddress,
      tokenId
    });

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(
      contractAddress,
      CleopatraNFTContract.abi,
      provider
    );
    
    // First check if the token exists by trying to get its owner
    const owner = await contract.ownerOf(tokenId);
    console.log("Token owner:", owner);
    
    // Get the current connected account
    const accounts = await provider.listAccounts();
    if (!accounts[0]) {
      console.log("No wallet connected");
      return false;
    }
    
    const currentAccount = accounts[0].toLowerCase();
    const tokenOwner = owner.toLowerCase();
    
    const isOwner = tokenOwner === currentAccount;
    console.log("NFT ownership verification:", {
      tokenId,
      owner: tokenOwner,
      currentAccount,
      isOwner
    });
    
    return isOwner;
  } catch (error) {
    console.error("Error verifying ownership:", error);
    if (error.code === 'CALL_EXCEPTION') {
      console.log("Token does not exist or other contract error");
    }
    return false;
  }
};

export default NFTOwnershipVerifier;