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
    console.error("Transfer event not found in receipt:", receipt);
    throw new Error(
      "Could not find the minting event in transaction logs. The NFT may still have been minted - please check your wallet."
    );
  }

  if (!transferEvent.args) {
    console.error("Transfer event has no arguments:", transferEvent);
    throw new Error(
      "Transfer event data is invalid. The NFT may still have been minted - please check your wallet."
    );
  }

  if (!transferEvent.args.tokenId) {
    console.error("Transfer event missing tokenId:", transferEvent.args);
    throw new Error(
      "Could not retrieve token ID from mint event. The NFT may still have been minted - please check your wallet."
    );
  }

  console.log("Transfer event validation successful:", {
    tokenId: transferEvent.args.tokenId.toString(),
    from: transferEvent.args.from,
    to: transferEvent.args.to
  });

  return transferEvent;
};