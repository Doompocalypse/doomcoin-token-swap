import { ethers } from "ethers";
import CleopatraNFTContract from "@/contracts/CleopatraNecklaceNFT.json";
import { findTransferEvent, validateTransferEvents } from "@/utils/nft/transactionUtils";

export const processMintTransaction = async (contractAddress: string) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  
  const contract = new ethers.Contract(
    contractAddress,
    CleopatraNFTContract.abi,
    signer
  );

  const totalSupply = await contract.totalSupply();
  const nextTokenId = totalSupply.toNumber() + 1;
  console.log(`Next NFT to be minted will be Token ID: ${nextTokenId}`);

  if (nextTokenId > 6) {
    throw new Error("All individual pieces (1-6) have been minted. Only the complete set (Token ID 7) remains.");
  }

  console.log("Minting NFT...");
  const tx = await contract.mint();
  console.log("Mint transaction sent:", tx.hash);

  const receipt = await tx.wait();
  console.log("Mint transaction confirmed. Full receipt:", receipt);
  
  const transferEvents = findTransferEvent(receipt);
  console.log("Found transfer events:", transferEvents);
  
  const validEvents = validateTransferEvents(transferEvents, receipt);
  console.log("Validated transfer events:", validEvents);
  
  if (validEvents.length === 0) {
    throw new Error("No valid transfer events found in transaction");
  }
  
  const tokenId = validEvents[0].args.tokenId.toString();
  console.log("Successfully parsed token ID:", tokenId);

  return { tokenId, receipt };
};