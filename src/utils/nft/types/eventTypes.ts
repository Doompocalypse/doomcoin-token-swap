import { ethers } from "ethers";

export interface TransferEventResult {
  from: string;
  to: string;
  tokenId: ethers.BigNumber;
}

export interface CustomTransferEvent extends ethers.Event {
  args: TransferEventResult;
}