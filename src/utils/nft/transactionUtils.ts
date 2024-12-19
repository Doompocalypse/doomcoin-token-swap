import { ethers } from "ethers";

export const findTransferEvent = (receipt: ethers.ContractReceipt) => {
  console.log("Looking for Transfer event in receipt:", receipt);
  
  // First try to find the Transfer event directly
  const transferEvent = receipt.events?.find(event => event.event === 'Transfer');
  if (transferEvent) {
    console.log("Found named Transfer event:", transferEvent);
    return transferEvent;
  }

  // If no named event found, try to find by Transfer topic
  const transferTopic = ethers.utils.id("Transfer(address,address,uint256)");
  console.log("Looking for Transfer topic:", transferTopic);
  
  // Look through all events for the Transfer topic
  for (const event of receipt.events || []) {
    console.log("Checking event:", event);
    if (event.topics?.[0] === transferTopic) {
      console.log("Found Transfer event by topic");
      
      try {
        // Parse the event data
        const iface = new ethers.utils.Interface([
          "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"
        ]);
        
        const parsedLog = iface.parseLog({
          topics: event.topics,
          data: event.data
        });
        
        console.log("Parsed log:", parsedLog);
        
        // Create a proper Result object that matches ethers.js requirements
        const tokenId = parsedLog.args.tokenId;
        const args = Object.assign([] as unknown as ethers.utils.Result, {
          tokenId,
          __length__: 1,
          length: 1,
          // Add array methods required by Result type
          slice: Array.prototype.slice,
          concat: Array.prototype.concat,
          join: Array.prototype.join,
          toString: function() { return `[Result tokenId=${tokenId.toString()}]`; }
        });
        
        // Return a properly constructed Event object
        return {
          ...event,
          args,
          event: 'Transfer',
          eventSignature: 'Transfer(address,address,uint256)',
        };
      } catch (error) {
        console.error("Error parsing Transfer event:", error);
      }
    }
  }

  // If still no event found, try to parse from logs directly
  for (const log of receipt.logs) {
    console.log("Checking raw log:", log);
    if (log.topics[0] === transferTopic) {
      try {
        // The tokenId should be in the last topic for a Transfer event
        const tokenId = ethers.BigNumber.from(log.topics[3]);
        console.log("Found token ID in raw log:", tokenId.toString());
        
        // Create a proper Result object
        const args = Object.assign([] as unknown as ethers.utils.Result, {
          tokenId,
          __length__: 1,
          length: 1,
          slice: Array.prototype.slice,
          concat: Array.prototype.concat,
          join: Array.prototype.join,
          toString: function() { return `[Result tokenId=${tokenId.toString()}]`; }
        });
        
        // Return a properly constructed Event object
        return {
          ...log,
          args,
          event: 'Transfer',
          eventSignature: 'Transfer(address,address,uint256)',
        };
      } catch (error) {
        console.error("Error parsing token ID from raw log:", error);
      }
    }
  }
  
  console.log("No Transfer event found in receipt");
  return undefined;
};

export const validateTransferEvent = (transferEvent: ethers.Event | undefined, receipt: ethers.ContractReceipt) => {
  console.log("Validating transfer event...");
  
  if (!transferEvent) {
    console.error("No Transfer event found in transaction receipt:", receipt);
    throw new Error(`Transaction succeeded but we couldn't find the token ID. Please check your wallet in MetaMask to verify the NFT was minted. The transaction hash is: ${receipt.transactionHash}`);
  }

  if (!transferEvent.args) {
    console.error("Transfer event found but no args present:", transferEvent);
    throw new Error(`Transaction succeeded but the token ID format was invalid. Please check your wallet in MetaMask to verify the NFT was minted. The transaction hash is: ${receipt.transactionHash}`);
  }

  if (!transferEvent.args.tokenId) {
    console.error("Transfer event has no token ID:", transferEvent);
    throw new Error(`Transaction succeeded but token ID was undefined. Please check your wallet in MetaMask to verify the NFT was minted. The transaction hash is: ${receipt.transactionHash}`);
  }

  console.log("Transfer event validation successful. Token ID:", transferEvent.args.tokenId.toString());
  return transferEvent;
};