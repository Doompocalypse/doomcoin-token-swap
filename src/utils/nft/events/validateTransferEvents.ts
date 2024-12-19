import { ethers } from "ethers";
import { CustomTransferEvent } from "../types/eventTypes";

export const validateTransferEvents = (
  transferEvents: CustomTransferEvent[], 
  receipt: ethers.ContractReceipt
): CustomTransferEvent[] => {
  console.log("Validating transfer events...");
  
  if (transferEvents.length === 0) {
    console.error("No Transfer events found in transaction receipt:", receipt);
    throw new Error(
      `Transaction succeeded but we couldn't find any token IDs. Please check Etherscan: https://sepolia.etherscan.io/tx/${receipt.transactionHash}`
    );
  }

  const validEvents = transferEvents.filter(event => {
    if (!event.args) {
      console.error("Transfer event found but no args present:", event);
      return false;
    }

    if (!event.args.tokenId) {
      console.error("Transfer event has no token ID:", event);
      return false;
    }

    console.log("Valid transfer event found. Token ID:", event.args.tokenId.toString());
    return true;
  });

  if (validEvents.length === 0) {
    throw new Error(
      `Transaction succeeded but no valid token IDs were found. Please check Etherscan: https://sepolia.etherscan.io/tx/${receipt.transactionHash}`
    );
  }

  console.log("Transfer event validation successful. Found", validEvents.length, "valid events");
  return validEvents;
};