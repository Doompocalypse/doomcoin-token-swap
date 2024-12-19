import { ethers } from "ethers";
import CleopatraNFTContract from "@/contracts/CleopatraNecklaceNFT.json";

interface NFTOwnershipVerifierProps {
  contractAddress: string;
  tokenId: string;
}

const NFTOwnershipVerifier = async ({ contractAddress, tokenId }: NFTOwnershipVerifierProps) => {
  try {
    console.log("Starting NFT ownership verification...", {
      contractAddress,
      tokenId,
      timestamp: new Date().toISOString()
    });

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(
      contractAddress,
      CleopatraNFTContract.abi,
      provider
    );
    
    // Get the current connected account first
    const accounts = await provider.listAccounts();
    if (!accounts[0]) {
      console.log("No wallet connected");
      return false;
    }
    
    const currentAccount = accounts[0].toLowerCase();
    console.log("Current connected account:", currentAccount);

    // Then check if the token exists by trying to get its owner
    const owner = await contract.ownerOf(tokenId);
    const tokenOwner = owner.toLowerCase();
    console.log("Token owner from contract:", tokenOwner);
    
    const isOwner = tokenOwner === currentAccount;
    console.log("NFT ownership verification result:", {
      tokenId,
      owner: tokenOwner,
      currentAccount,
      isOwner,
      timestamp: new Date().toISOString()
    });
    
    return isOwner;
  } catch (error) {
    console.error("Error verifying NFT ownership:", {
      error,
      contractAddress,
      tokenId,
      timestamp: new Date().toISOString()
    });
    
    if (error.code === 'CALL_EXCEPTION') {
      console.log("Token does not exist or other contract error");
    }
    return false;
  }
};

export default NFTOwnershipVerifier;