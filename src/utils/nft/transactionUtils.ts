import { ethers } from "ethers";

export const findTransferEvent = (receipt: ethers.ContractReceipt) => {
  console.log("Searching for Transfer event in transaction receipt");
  console.log("All events:", receipt.events?.map(e => ({
    event: e.event,
    args: e.args,
    address: e.address
  })));

  // Look for Transfer event from address zero (minting)
  const transferEvent = receipt.events?.find(
    (event) => {
      if (!event.event || !event.args) {
        console.log("Skipping event - missing event name or args:", event);
        return false;
      }

      console.log("Checking event:", {
        name: event.event,
        args: event.args,
        from: event.args.from
      });

      return event.event === "Transfer" && 
             event.args.from && 
             event.args.from.toLowerCase() === ethers.constants.AddressZero.toLowerCase();
    }
  );

  if (!transferEvent) {
    console.log("No Transfer event found from zero address");
    console.log("Available events:", receipt.events);
  } else {
    console.log("Found Transfer event:", {
      from: transferEvent.args.from,
      to: transferEvent.args.to,
      tokenId: transferEvent.args.tokenId?.toString()
    });
  }

  return transferEvent;
};

export const validateTransferEvent = (
  transferEvent: any, 
  receipt: ethers.ContractReceipt
) => {
  console.log("Validating Transfer event");

  if (!transferEvent) {
    console.error("Transfer event not found in receipt. Full receipt:", receipt);
    throw new Error(
      "Transaction was successful but the minting event wasn't found in the logs. Your NFT should still be in your wallet - please check MetaMask to verify."
    );
  }

  if (!transferEvent.args) {
    console.error("Transfer event has invalid format:", transferEvent);
    throw new Error(
      "Transaction succeeded but event data was invalid. Please check your wallet to verify the NFT was minted."
    );
  }

  if (!transferEvent.args.tokenId) {
    console.error("Transfer event missing tokenId:", transferEvent.args);
    throw new Error(
      "Transaction succeeded but token ID was not found. Please check your wallet to verify the NFT was minted."
    );
  }

  console.log("Transfer event validation successful:", {
    tokenId: transferEvent.args.tokenId.toString(),
    from: transferEvent.args.from,
    to: transferEvent.args.to
  });

  return transferEvent;
};