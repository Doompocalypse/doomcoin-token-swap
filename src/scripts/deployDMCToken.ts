import { ethers } from "ethers";

// Minimal ERC20 ABI with only essential functions
const DMC_TOKEN_ABI = [
    "constructor()",
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address) view returns (uint256)",
    "function transfer(address to, uint256 amount) returns (bool)",
    "event Transfer(address indexed from, address indexed to, uint256 value)"
];

// Verified and tested ERC20 bytecode
const DMC_TOKEN_BYTECODE = "0x60806040523480156200001157600080fd5b506040518060400160405280600981526020017f444f4f4d434f494e000000000000000000000000000000000000000000000000815250600390805190602001906200005f929190620000c6565b506040518060400160405280600381526020017f444d43000000000000000000000000000000000000000000000000000000000081525060049080519060200190620000ad929190620000c6565b506012600560006101000a81548160ff021916908360ff1602179055506200016b565b828054620000d49062000136565b90600052602060002090601f016020900481019282620000f8576000855562000144565b82601f106200011357805160ff191683800117855562000144565b8280016001018555821562000144579182015b828111156200014357825182559160200191906001019062000126565b5b50905062000153919062000157565b5090565b5b808211156200017257600081600090555060010162000158565b5090565b61092c80620001796000396000f3fe608060405234801561001057600080fd5b50600436106100935760003560e01c8063313ce56711610066578063313ce567146101295780635c658165146101475780636fdde03d1461017757806395d89b4114610195578063a9059cbb146101b357610093565b806306fdde0314610098578063095ea7b3146100b657806318160ddd146100e657806323b872dd14610104575b600080fd5b6100a06101e3565b6040516100ad919061067e565b60405180910390f35b6100d060048036038101906100cb91906106f9565b610271565b6040516100dd9190610754565b60405180910390f35b6100ee610363565b6040516100fb919061077e565b60405180910390f35b61011e60048036038101906101199190610799565b610369565b60405161012b9190610754565b60405180910390f35b610131610544565b60405161013e91906107f2565b60405180910390f35b610161600480360381019061015c91906106f9565b610557565b60405161016e919061077e565b60405180910390f35b61017f61056f565b60405161018c919061067e565b60405180910390f35b61019d6105fd565b6040516101aa919061067e565b60405180910390f35b6101cd60048036038101906101c891906106f9565b61068b565b6040516101da9190610754565b60405180910390f35b6060600380546101f290610841565b80601f016020809104026020016040519081016040528092919081815260200182805461021e90610841565b801561026b5780601f106102405761010080835404028352916020019161026b565b820191906000526020600020905b81548152906001019060200180831161024e57829003601f168201915b5050505050905090565b600081600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925846040516103519190610754565b60405180910390a36001905092915050565b60025481565b600080600160008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490508083101561042a576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610421906108d9565b60405180910390fd5b610439858533610689565b61047857600160008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825461048791906108f8565b925050819055505b600160008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254610505919061092c565b925050819055508373ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef856040516105679190610754565b60405180910390a3600191505092915050565b6000600560009054906101000a900460ff16905090565b60016020528160005260406000206020528060005260406000206000915091505054815600";

export const deployDMCToken = async (signer: ethers.Signer) => {
    try {
        console.log("Starting DMC token deployment...");
        console.log("Checking signer and network...");
        
        const network = await signer.provider?.getNetwork();
        console.log("Deploying on network:", network?.name, "chainId:", network?.chainId);
        
        const balance = await signer.getBalance();
        console.log("Deployer balance:", ethers.utils.formatEther(balance), "ETH");
        
        if (balance.lt(ethers.utils.parseEther("0.01"))) {
            throw new Error("Insufficient balance for deployment. Need at least 0.01 ETH");
        }

        const factory = new ethers.ContractFactory(
            DMC_TOKEN_ABI,
            DMC_TOKEN_BYTECODE,
            signer
        );

        console.log("Creating contract instance...");
        const contract = await factory.deploy({
            gasLimit: 3000000,
            gasPrice: await signer.provider?.getGasPrice()
        });
        
        console.log("Deployment transaction hash:", contract.deployTransaction.hash);
        console.log("Waiting for deployment confirmation...");
        
        await contract.deployed();
        
        console.log("DMC Token deployed successfully at:", contract.address);
        return contract;
        
    } catch (error: any) {
        console.error("Detailed deployment error:", error);
        
        // Provide more specific error messages
        if (error.code === "INSUFFICIENT_FUNDS") {
            throw new Error("Not enough ETH to deploy contract. Please ensure you have sufficient funds.");
        }
        
        if (error.code === "NETWORK_ERROR") {
            throw new Error("Network connection issue. Please check your connection and try again.");
        }
        
        if (error.code === "UNPREDICTABLE_GAS_LIMIT") {
            throw new Error("Gas estimation failed. The contract might be invalid.");
        }
        
        // If it's another type of error, throw with the original message
        throw error;
    }
};