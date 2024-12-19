import { ethers } from "ethers";

export const findTransferEvent = (receipt: ethers.ContractReceipt) => {
  console.log("Transaction events:", receipt.events);

  const transferEvent = receipt.events?.find(
    (event: any) => {
      console.log("Checking event:", event);
      return event.event === "Transfer" && 
             event.args && 
             event.args.from && 
             event.args.from.toLowerCase() === ethers.constants.AddressZero.toLowerCase();
    }
  );

  console.log("Found transfer event:", transferEvent);
  return transferEvent;
};

export const validateTransferEvent = (
  transferEvent: any, 
  receipt: ethers.ContractReceipt
) => {
  if (!transferEvent || !transferEvent.args) {
    console.error("Transfer event not found or invalid. Events:", receipt.events);
    throw new Error(
      "Mint transaction succeeded but token details could not be retrieved. Please check your wallet for the minted NFT."
    );
  }
  return transferEvent;
};