import NFTDeployment from "@/components/nft/NFTDeployment";
import CollectionInfo from "@/components/nft/CollectionInfo";
import OwnedNFTs from "@/components/nft/OwnedNFTs";
import TransactionHistory from "@/components/nft/TransactionHistory";
import NFTCollection from "@/components/nft/NFTCollection";
import NFTCarousel from "@/components/nft/NFTCarousel";
import ContractInfo from "@/components/exchange/ContractInfo";

interface DeploymentContentProps {
    isConnected: boolean;
    connectedAccount?: string;
    contractAddress?: string;
    isMobile: boolean;
    onContractDeployed: (address: string) => void;
}

const DeploymentContent = ({
    isConnected,
    connectedAccount,
    contractAddress,
    isMobile,
    onContractDeployed
}: DeploymentContentProps) => {
    if (!isConnected || !connectedAccount) {
        return (
            <div className="bg-black/40 p-6 rounded-lg">
                <p className="text-white text-center">
                    Please connect your wallet to deploy or mint NFTs
                </p>
            </div>
        );
    }

    return (
        <>
            {contractAddress && (
                <ContractInfo 
                    contractAddress={contractAddress}
                    walletAddress={connectedAccount}
                />
            )}
            
            {!contractAddress && (
                <NFTDeployment 
                    isMobile={isMobile} 
                    onContractDeployed={onContractDeployed}
                />
            )}

            <NFTCollection 
                contractAddress={contractAddress}
                walletAddress={connectedAccount}
            />
            
            <NFTCarousel connectedAccount={connectedAccount} />
            
            <OwnedNFTs walletAddress={connectedAccount} />
            <TransactionHistory />
            <CollectionInfo />
        </>
    );
};

export default DeploymentContent;