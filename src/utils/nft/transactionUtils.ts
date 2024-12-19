import { ethers } from "ethers";

export const findTransferEvent = (receipt: ethers.ContractReceipt) => {
  console.log("Looking for Transfer event in receipt. All events:", receipt.events);
  
  // First try to find an event with the Transfer name
  const transferEvent = receipt.events?.find(event => event.event === 'Transfer');
  
  if (transferEvent) {
    console.log("Found Transfer event by name:", transferEvent);
    return transferEvent;
  }
  
  // If no named event found, look for an event with the Transfer topic
  const transferTopic = ethers.utils.id("Transfer(address,address,uint256)");
  const anonymousTransfer = receipt.events?.find(event => 
    event.topics && event.topics[0] === transferTopic
  );
  
  if (anonymousTransfer) {
    console.log("Found Transfer event by topic:", anonymousTransfer);
    return anonymousTransfer;
  }
  
  console.log("No Transfer event found in receipt");
  return undefined;
};

export const validateTransferEvent = (transferEvent: ethers.Event | undefined, receipt: ethers.ContractReceipt) => {
  console.log("Validating transfer event...");
  
  if (!transferEvent) {
    console.error("No Transfer event found in transaction receipt:", receipt);
    throw new Error("Transaction succeeded but we couldn't find the token ID. Please check your wallet in MetaMask to verify the NFT was minted. The transaction hash is: " + receipt.transactionHash);
  }

  if (!transferEvent.args) {
    // Try to decode the event data if it's anonymous
    try {
      const iface = new ethers.utils.Interface([
        "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"
      ]);
      const decodedData = iface.parseLog(transferEvent);
      console.log("Successfully decoded anonymous Transfer event:", decodedData);
      return transferEvent;
    } catch (error) {
      console.error("Failed to decode Transfer event:", error);
      throw new Error("Transaction succeeded but the token ID format was invalid. Please check your wallet in MetaMask to verify the NFT was minted. The transaction hash is: " + receipt.transactionHash);
    }
  }

  console.log("Transfer event validation successful. Token ID:", transferEvent.args.tokenId.toString());
  return transferEvent;
};