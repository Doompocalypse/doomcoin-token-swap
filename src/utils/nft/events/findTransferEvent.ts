import { ethers } from "ethers";
import { CustomTransferEvent, TransferEventResult } from "../types/eventTypes";

export const findTransferEvent = (receipt: ethers.ContractReceipt): CustomTransferEvent[] => {
  console.log("Looking for Transfer events in receipt:", receipt);
  console.log("Number of events in receipt:", receipt.events?.length);
  
  const transferEvents: CustomTransferEvent[] = [];
  const transferTopic = ethers.utils.id("Transfer(address,address,uint256)");
  console.log("Transfer topic hash:", transferTopic);

  // First try to find named Transfer events
  receipt.events?.forEach(event => {
    console.log("Checking event:", {
      name: event.event,
      args: event.args,
      topics: event.topics
    });
    
    if (event.event === 'Transfer') {
      console.log("Found named Transfer event:", event);
      if (event.args) {
        const transferEvent = {
          ...event,
          args: {
            from: event.args[0],
            to: event.args[1],
            tokenId: event.args[2]
          }
        } as CustomTransferEvent;
        
        console.log("Created transfer event with args:", transferEvent.args);
        transferEvents.push(transferEvent);
      }
    }
  });

  if (transferEvents.length > 0) {
    console.log("Found", transferEvents.length, "named Transfer events");
    return transferEvents;
  }

  // If no named events found, look through logs for Transfer topic
  receipt.logs.forEach(log => {
    console.log("Checking log:", {
      topics: log.topics,
      data: log.data
    });
    
    if (log.topics[0] === transferTopic) {
      try {
        const iface = new ethers.utils.Interface([
          "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"
        ]);
        
        const parsedLog = iface.parseLog(log);
        console.log("Successfully parsed log:", {
          from: parsedLog.args.from,
          to: parsedLog.args.to,
          tokenId: parsedLog.args.tokenId.toString()
        });
        
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        
        const customEvent: CustomTransferEvent = {
          ...log,
          args: {
            from: parsedLog.args.from,
            to: parsedLog.args.to,
            tokenId: parsedLog.args.tokenId,
          },
          event: 'Transfer',
          eventSignature: parsedLog.signature,
          decode: (data: string, topics?: Array<string>) => {
            return iface.decodeEventLog(
              'Transfer',
              data,
              topics
            ) as unknown as TransferEventResult;
          },
          removeListener: () => {},
          getBlock: () => provider.getBlock(log.blockNumber),
          getTransaction: () => provider.getTransaction(log.transactionHash),
          getTransactionReceipt: () => provider.getTransactionReceipt(log.transactionHash),
        };

        console.log("Created custom event:", customEvent);
        transferEvents.push(customEvent);
      } catch (error) {
        console.error("Error parsing Transfer event from log:", error);
        console.error("Log that caused error:", log);
      }
    }
  });
  
  console.log("Total transfer events found:", transferEvents.length);
  return transferEvents;
};