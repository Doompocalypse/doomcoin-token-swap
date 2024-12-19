import { ethers } from "ethers";
import CleopatraNFTContract from "@/contracts/CleopatraNecklaceNFT.json";

export const useNFTContract = () => {
  const getContract = (
    contractAddress: string,
    signer: ethers.Signer
  ) => {
    console.log("Creating contract instance for address:", contractAddress);
    return new ethers.Contract(
      contractAddress,
      CleopatraNFTContract.abi,
      signer
    );
  };

  return { getContract };
};