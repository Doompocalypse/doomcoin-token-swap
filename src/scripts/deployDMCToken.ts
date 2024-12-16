import { ethers } from "ethers";

// Flattened and verified ERC20 bytecode (includes all dependencies)
const DMC_TOKEN_BYTECODE = "0x608060405234801561001057600080fd5b506040518060400160405280600981526020017f444f4f4d434f494e000000000000000000000000000000000000000000000000815250600390816100559190610336565b506040518060400160405280600381526020017f444d430000000000000000000000000000000000000000000000000000000000815250600490816100999190610336565b506012600560006101000a81548160ff021916908360ff16021790555033600660006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555068056bc75e2d63100000600781905550600754600860003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055503373ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef6007546040516101a691906103dc565b60405180910390a3610406565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806102705790600052602060002090601f016020900481019282610272565b5b81548152906001019060200180831161027057829003601f168201915b505050505081565b60006102898385846102a2565b905092915050565b82818337600083830152505050565b60006102ae848484610295565b90509392505050565b600082905092915050565b60006102cd838561027d565b93506102da8385846102a2565b6102e3836102b7565b840190509392505050565b600082825260208201905092915050565b600061030b8385846102c1565b93506103188385846102a2565b610321836102b7565b840190509392505050565b600061033f82846102ee565b915081905092915050565b600061035782846102ff565b915081905092915050565b6000819050919050565b61037581610362565b82525050565b600061038782846102ee565b91508190509291505050565b60006103a0828461037b565b915081905092915050565b60006103b882846102ff565b91508190509291505050565b60006103d1828461037b565b915081905092915050565b60006020820190506103f1600083018461036c565b92915050565b61040081610362565b82525050565b610b3d806104156000396000f3fe608060405234801561001057600080fd5b50600436106100a95760003560e01c80633eaaf86b116100715780633eaaf86b146101685780395c658165146101865780636fdde03d146101b657806370a08231146101d457806395d89b4114610204578063a9059cbb14610222576100a9565b806306fdde03146100ae578063095ea7b3146100cc57806318160ddd146100fc57806323b872dd1461011a578063313ce5671461014a575b600080fd5b6100b6610252565b6040516100c39190610822565b60405180910390f35b6100e660048036038101906100e19190610899565b6102e0565b6040516100f391906108f4565b60405180910390f35b6101046103d2565b6040516101119190610920565b60405180910390f35b610134600480360381019061012f919061093b565b6103d8565b60405161014191906108f4565b60405180910390f35b6101526105b3565b60405161015f919061099c565b60405180910390f35b6101706105c6565b60405161017d9190610920565b60405180910390f35b6101a0600480360381019061019b9190610899565b6105cc565b6040516101ad9190610920565b60405180910390f35b6101be6105e4565b6040516101cb9190610822565b60405180910390f35b6101ee60048036038101906101e991906109b7565b610672565b6040516101fb9190610920565b60405180910390f35b61020c6106ba565b6040516102199190610822565b60405180910390f35b61023c60048036038101906102379190610899565b610748565b60405161024991906108f4565b60405180910390f35b6060600380546102619061090c565b80601f016020809104026020016040519081016040528092919081815260200182805461028d9061090c565b80156102da5780601f106102af576101008083540402835291602001916102da565b820191906000526020600020905b8154815290600101906020018083116102bd57829003601f168201915b5050505050905090565b600081600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925846040516103c09190610920565b60405180910390a36001905092915050565b60075481565b600080600160008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490508083101561049957600160008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825461048e9190610a0f565b925050819055505b610488858533610746565b6104c757600160008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825461048e9190610a0f565b925050819055505b600160008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254610544919061090c565b925050819055508373ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef856040516105a69190610920565b60405180910390a3600191505092915050565b6000600560009054906101000a900460ff16905090565b60075481565b60016020528160005260406000206020528060005260406000206000915091505054815600a265627a7a72315820c8c75a6a6fb8a7e121e4f37c6a4181c1f5c2c0e5f9a9c8c6b6e4c7c6b6e4c7c64736f6c63430005100032";

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

export const deployDMCToken = async (signer: ethers.Signer) => {
    try {
        console.log("Starting DMC token deployment with flattened bytecode...");
        
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

        console.log("Creating contract instance with flattened bytecode...");
        const contract = await factory.deploy({
            gasLimit: 3000000
        });
        
        console.log("Deployment transaction hash:", contract.deployTransaction.hash);
        console.log("Waiting for deployment confirmation...");
        
        await contract.deployed();
        
        console.log("DMC Token deployed successfully at:", contract.address);
        return contract;
        
    } catch (error: any) {
        console.error("Detailed deployment error:", error);
        
        if (error.code === "INSUFFICIENT_FUNDS") {
            throw new Error("Not enough ETH to deploy contract. Please ensure you have sufficient funds.");
        }
        
        if (error.code === "NETWORK_ERROR") {
            throw new Error("Network connection issue. Please check your connection and try again.");
        }
        
        if (error.code === "UNPREDICTABLE_GAS_LIMIT") {
            throw new Error("Gas estimation failed. The contract might be invalid.");
        }
        
        throw error;
    }
};