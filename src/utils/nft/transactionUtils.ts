import { ethers } from "ethers";

interface TransferEventResult extends ethers.utils.Result {
  tokenId: ethers.BigNumber;
}

interface CustomTransferEvent extends ethers.Event {
  args: TransferEventResult;
}

export const findTransferEvent = (receipt: ethers.ContractReceipt): CustomTransferEvent | undefined => {
  console.log("Looking for Transfer event in receipt:", receipt);
  
  const transferTopic = ethers.utils.id("Transfer(address,address,uint256)");
  console.log("Transfer topic hash:", transferTopic);

  // First try to find a named Transfer event
  const transferEvent = receipt.events?.find(event => 
    event.event === 'Transfer' && event.args && event.args.length >= 3
  );

  if (transferEvent) {
    console.log("Found named Transfer event:", transferEvent);
    return transferEvent as CustomTransferEvent;
  }

  // If no named event found, look through logs for Transfer topic
  for (const log of receipt.logs) {
    console.log("Checking log:", log);
    if (log.topics[0] === transferTopic) {
      try {
        const iface = new ethers.utils.Interface([
          "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"
        ]);
        
        const parsedLog = iface.parseLog(log);
        console.log("Successfully parsed log:", parsedLog);
        
        // Create a properly typed event object
        const customEvent: CustomTransferEvent = {
          ...log,
          args: {
            ...parsedLog.args,
            tokenId: parsedLog.args.tokenId,
          } as TransferEventResult,
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
        return customEvent;
      } catch (error) {
        console.error("Error parsing Transfer event from log:", error);
      }
    }
  }
  
  console.log("No Transfer event found in receipt");
  return undefined;
};

export const validateTransferEvent = (transferEvent: CustomTransferEvent | undefined, receipt: ethers.ContractReceipt): CustomTransferEvent => {
  console.log("Validating transfer event...");
  
  if (!transferEvent) {
    console.error("No Transfer event found in transaction receipt:", receipt);
    throw new Error(`Transaction succeeded but we couldn't find the token ID. Please check your wallet in MetaMask to verify the NFT was minted. The transaction hash is: ${receipt.transactionHash}`);
  }

  if (!transferEvent.args) {
    console.error("Transfer event found but no args present:", transferEvent);
    throw new Error(`Transaction succeeded but the token ID format was invalid. Transaction hash: ${receipt.transactionHash}`);
  }

  if (!transferEvent.args.tokenId) {
    console.error("Transfer event has no token ID:", transferEvent);
    throw new Error(`Transaction succeeded but token ID was undefined. Transaction hash: ${receipt.transactionHash}`);
  }

  console.log("Transfer event validation successful. Token ID:", transferEvent.args.tokenId.toString());
  return transferEvent;
};

// Get provider instance for block/transaction lookups
const provider = new ethers.providers.Web3Provider(window.ethereum);