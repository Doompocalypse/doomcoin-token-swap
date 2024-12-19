import { ethers } from "ethers";

export const findTransferEvent = (receipt: ethers.ContractReceipt) => {
  console.log("Looking for Transfer event in receipt. All events:", receipt.events);
  console.log("Raw logs:", receipt.logs);
  
  // First try to find an event with the Transfer name
  const transferEvent = receipt.events?.find(event => event.event === 'Transfer');
  
  if (transferEvent) {
    console.log("Found Transfer event by name:", transferEvent);
    return transferEvent;
  }
  
  // If no named event found, look for an event with the Transfer topic
  const transferTopic = ethers.utils.id("Transfer(address,address,uint256)");
  const anonymousTransfer = receipt.events?.find(event => {
    console.log("Checking event topics:", event.topics);
    return event.topics && event.topics[0] === transferTopic;
  });
  
  if (anonymousTransfer) {
    console.log("Found Transfer event by topic:", anonymousTransfer);
    return anonymousTransfer;
  }
  
  // If still no event found, try to parse the logs directly
  for (const log of receipt.logs) {
    console.log("Checking raw log:", log);
    if (log.topics[0] === transferTopic) {
      console.log("Found Transfer event in raw logs:", log);
      const baseEvent = receipt.events![0]; // Use first event as base for methods
      
      // Parse the tokenId from the topics
      let tokenId;
      try {
        // The tokenId should be in the last topic for a Transfer event
        tokenId = log.topics[3] ? ethers.BigNumber.from(log.topics[3]) : undefined;
        console.log("Parsed token ID from topics:", tokenId?.toString());
      } catch (error) {
        console.error("Error parsing token ID from topics:", error);
        // Try parsing from data if not in topics
        try {
          const iface = new ethers.utils.Interface([
            "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"
          ]);
          const parsed = iface.parseLog(log);
          tokenId = parsed.args.tokenId;
          console.log("Parsed token ID from data:", tokenId?.toString());
        } catch (parseError) {
          console.error("Error parsing token ID from data:", parseError);
        }
      }
      
      if (!tokenId) {
        console.error("Could not parse token ID from event");
        continue;
      }
      
      // Create a proper Result object for args
      const args = Object.assign([] as unknown as ethers.utils.Result, {
        tokenId,
        __length__: 1,
      });
      
      // Return a properly constructed Event object
      return Object.assign(baseEvent, {
        ...log,
        args,
        event: 'Transfer',
        eventSignature: 'Transfer(address,address,uint256)',
      });
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
    try {
      const iface = new ethers.utils.Interface([
        "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"
      ]);
      
      const decodedData = iface.parseLog({
        topics: transferEvent.topics || [],
        data: transferEvent.data
      });
      
      console.log("Successfully decoded anonymous Transfer event:", decodedData);
      
      // Create a proper Result object for args
      const args = Object.assign([] as unknown as ethers.utils.Result, {
        tokenId: decodedData.args.tokenId,
        __length__: 1,
      });
      
      transferEvent.args = args;
      
      return transferEvent;
    } catch (error) {
      console.error("Failed to decode Transfer event:", error);
      throw new Error(`Transaction succeeded but the token ID format was invalid. Please check your wallet in MetaMask to verify the NFT was minted. The transaction hash is: ${receipt.transactionHash}`);
    }
  }

  console.log("Transfer event validation successful. Token ID:", transferEvent.args?.tokenId?.toString());
  return transferEvent;
};