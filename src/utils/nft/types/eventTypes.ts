import { ethers } from "ethers";

export interface TransferEventResult extends ethers.utils.Result {
  tokenId: ethers.BigNumber;
}

export interface CustomTransferEvent extends ethers.Event {
  args: TransferEventResult;
}