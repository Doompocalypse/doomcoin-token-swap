import { ethers } from "ethers";
import { CustomTransferEvent } from "../types/eventTypes";

export const findTransferEvent = (receipt: ethers.ContractReceipt): CustomTransferEvent[] => {
  console.log("Looking for Transfer events in receipt:", receipt);
  console.log("Number of events in receipt:", receipt.events?.length);
  
  const transferEvents: CustomTransferEvent[] = [];
  const transferTopic = ethers.utils.id("Transfer(address,address,uint256)");
  console.log("Transfer topic hash:", transferTopic);

  // First try to find named Transfer events
  receipt.events?.forEach(event => {
    console.log("Checking event:", event);
    if (event.event === 'Transfer' && event.args && event.args.length >= 3) {
      console.log("Found named Transfer event:", event);
      transferEvents.push(event as CustomTransferEvent);
    }
  });

  if (transferEvents.length > 0) {
    console.log("Found", transferEvents.length, "named Transfer events");
    return transferEvents;
  }

  // If no named events found, look through logs for Transfer topic
  receipt.logs.forEach(log => {
    console.log("Checking log:", log);
    console.log("Log topics:", log.topics);
    
    if (log.topics[0] === transferTopic) {
      try {
        const iface = new ethers.utils.Interface([
          "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"
        ]);
        
        const parsedLog = iface.parseLog(log);
        console.log("Successfully parsed log:", parsedLog);
        console.log("Parsed token ID:", parsedLog.args.tokenId.toString());
        
        // Create a properly typed event object
        const customEvent: CustomTransferEvent = {
          ...log,
          args: {
            ...parsedLog.args,
            tokenId: parsedLog.args.tokenId,
          },
          event: 'Transfer',
          eventSignature: parsedLog.signature,
          decode: (data: string, topics?: Array<string>) => {
            return iface.decodeEventLog(
              'Transfer',
              data,
              topics
            );
          },
          removeListener: () => {},
          getBlock: async () => provider.getBlock(log.blockNumber),
          getTransaction: async () => provider.getTransaction(log.transactionHash),
          getTransactionReceipt: async () => provider.getTransactionReceipt(log.transactionHash),
        };

        console.log("Created custom event:", customEvent);
        transferEvents.push(customEvent);
      } catch (error) {
        console.error("Error parsing Transfer event from log:", error);
        console.error("Log that caused error:", log);
      }
    }
  });
  
  console.log("Found total transfer events:", transferEvents.length);
  return transferEvents;
};

// Get provider instance for block/transaction lookups
const provider = new ethers.providers.Web3Provider(window.ethereum);