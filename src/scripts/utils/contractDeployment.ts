import { ethers } from "ethers";

// Complete ERC20 ABI with all essential functions
export const DMC_TOKEN_ABI = [
    "constructor(string name, string symbol)",
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address) view returns (uint256)",
    "function transfer(address to, uint256 amount) returns (bool)",
    "function allowance(address owner, address spender) view returns (uint256)",
    "function approve(address spender, uint256 amount) returns (bool)",
    "function transferFrom(address from, address to, uint256 amount) returns (bool)",
    "event Transfer(address indexed from, address indexed to, uint256 value)",
    "event Approval(address indexed owner, address indexed spender, uint256 value)"
];

export const deployContract = async (
    signer: ethers.Signer,
    bytecode: string
) => {
    console.log("Creating contract factory...");
    const factory = new ethers.ContractFactory(
        DMC_TOKEN_ABI,
        bytecode,
        signer
    );

    console.log("Deploying contract...");
    const contract = await factory.deploy(
        "DMC Token",
        "DMC",
        {
            gasLimit: 3000000,
            gasPrice: await signer.provider?.getGasPrice()
        }
    );
    
    console.log("Deployment transaction hash:", contract.deployTransaction.hash);
    console.log("Waiting for deployment confirmation...");
    
    await contract.deployed();
    return contract;
};

export const verifyDeployment = async (
    contract: ethers.Contract,
    signer: ethers.Signer
) => {
    const deployedCode = await signer.provider?.getCode(contract.address);
    if (!deployedCode || deployedCode === "0x") {
        throw new Error("Contract deployment verification failed");
    }
    
    const name = await contract.name();
    const symbol = await contract.symbol();
    console.log("Contract deployed and verified:", {
        address: contract.address,
        name,
        symbol
    });
    
    return { name, symbol };
};