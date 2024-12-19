import { ethers } from "ethers";

export const findTransferEvent = (receipt: ethers.ContractReceipt) => {
  console.log("Looking for Transfer event in receipt:", receipt);
  const transferEvent = receipt.events?.find(event => event.event === 'Transfer');
  console.log("Found Transfer event:", transferEvent);
  return transferEvent;
};

export const validateTransferEvent = (transferEvent: ethers.Event | undefined, receipt: ethers.ContractReceipt) => {
  console.log("Validating transfer event...");
  
  if (!transferEvent) {
    console.error("No Transfer event found in transaction receipt:", receipt);
    throw new Error("Transaction was successful but the minting event wasn't found in the logs. Your NFT should still be in your wallet - please check MetaMask to verify.");
  }

  if (!transferEvent.args) {
    console.error("Transfer event has no arguments:", transferEvent);
    throw new Error("Invalid transfer event format. Please check your wallet in a few minutes to verify the NFT was minted.");
  }

  console.log("Transfer event validation successful. Token ID:", transferEvent.args.tokenId.toString());
  return transferEvent;
};