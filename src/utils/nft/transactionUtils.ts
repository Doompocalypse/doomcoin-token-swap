import { ethers } from "ethers";
import { formatTokenId } from "./idGenerator";

const logEventDetails = (event: any) => {
  if (!event.event || !event.args) {
    console.log("Skipping event - missing event name or args:", event);
    return;
  }

  console.log("Checking event:", {
    name: event.event,
    args: event.args,
    from: event.args.from
  });
};

const isTransferFromZeroAddress = (event: any) => {
  return event.event === "Transfer" && 
         event.args.from && 
         event.args.from.toLowerCase() === ethers.constants.AddressZero.toLowerCase();
};

const logTransferEventStatus = (transferEvent: any, receipt: ethers.ContractReceipt) => {
  if (!transferEvent) {
    console.log("No Transfer event found from zero address");
    console.log("All events in receipt:", receipt.events?.map(e => ({
      event: e.event,
      args: e.args,
      address: e.address,
      topics: e.topics
    })));
  } else {
    console.log("Found Transfer event:", {
      from: transferEvent.args.from,
      to: transferEvent.args.to,
      tokenId: formatTokenId(transferEvent.args.tokenId)
    });
  }
};

export const findTransferEvent = (receipt: ethers.ContractReceipt) => {
  console.log("Searching for Transfer event in transaction receipt");
  console.log("Transaction hash:", receipt.transactionHash);
  console.log("Block number:", receipt.blockNumber);
  console.log("Gas used:", receipt.gasUsed.toString());
  
  console.log("All events:", receipt.events?.map(e => ({
    event: e.event,
    args: e.args,
    address: e.address
  })));

  // First try to find a Transfer event from zero address
  const transferEvent = receipt.events?.find(event => {
    logEventDetails(event);
    return isTransferFromZeroAddress(event);
  });

  // If not found, look for any Transfer event as fallback
  const anyTransferEvent = !transferEvent ? receipt.events?.find(event => event.event === "Transfer") : null;

  logTransferEventStatus(transferEvent || anyTransferEvent, receipt);
  return transferEvent || anyTransferEvent;
};

const validateTransferEventExists = (transferEvent: any, receipt: ethers.ContractReceipt) => {
  if (!transferEvent) {
    console.error("Transfer event details:", {
      hash: receipt.transactionHash,
      blockNumber: receipt.blockNumber,
      events: receipt.events?.map(e => e.event),
      logs: receipt.logs.map(log => ({
        topics: log.topics,
        data: log.data
      }))
    });
    
    throw new Error(
      "Transaction succeeded but the minting event wasn't found. This can happen if the blockchain is experiencing delays. Your NFT should appear in your wallet shortly - please check MetaMask in a few minutes."
    );
  }
};

const validateTransferEventArgs = (transferEvent: any) => {
  if (!transferEvent.args) {
    console.error("Invalid Transfer event format:", {
      event: transferEvent.event,
      topics: transferEvent.topics,
      data: transferEvent.data
    });
    throw new Error(
      "Transaction succeeded but event data was invalid. Please check your wallet in a few minutes to verify the NFT was minted."
    );
  }
};

const validateTokenId = (transferEvent: any) => {
  if (!transferEvent.args.tokenId) {
    console.error("Missing tokenId in Transfer event:", {
      args: transferEvent.args,
      topics: transferEvent.topics
    });
    throw new Error(
      "Transaction succeeded but token ID was not found. Please check your wallet in a few minutes to verify the NFT was minted."
    );
  }
};

export const validateTransferEvent = (
  transferEvent: any,
  receipt: ethers.ContractReceipt
) => {
  console.log("Validating Transfer event");
  
  validateTransferEventExists(transferEvent, receipt);
  validateTransferEventArgs(transferEvent);
  validateTokenId(transferEvent);

  console.log("Transfer event validation successful:", {
    tokenId: formatTokenId(transferEvent.args.tokenId),
    from: transferEvent.args.from,
    to: transferEvent.args.to
  });
};