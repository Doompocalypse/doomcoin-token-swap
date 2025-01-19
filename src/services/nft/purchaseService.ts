import { recordPurchase } from "./purchaseRecordService";
import { createContractService } from "./contractService";
import { ethers } from "ethers";

export const executePurchase = async (
  nftId: string,
  price: number,
  connectedAccount: string
) => {
  console.log("Executing NFT purchase:", { nftId, price, connectedAccount });
  
  const contractService = await createContractService();
  const priceInWei = ethers.parseEther(price.toString());
  
  const purchaseTx = await contractService.purchaseNFT(
    connectedAccount,
    nftId,
    priceInWei
  );
  
  console.log("Purchase transaction initiated:", purchaseTx.hash);
  const receipt = await purchaseTx.wait();
  console.log("Purchase confirmed:", receipt);

  await recordPurchase(nftId, connectedAccount, receipt.hash, price);
  
  return receipt;
};