import { ethers } from "ethers";

export interface TransferEventResult {
  from: string;
  to: string;
  tokenId: ethers.BigNumber;
}

export interface CustomTransferEvent extends Omit<ethers.Event, 'args'> {
  args: TransferEventResult;
  event: string;
  eventSignature: string;
  decode: (data: string, topics?: Array<string>) => TransferEventResult;
}