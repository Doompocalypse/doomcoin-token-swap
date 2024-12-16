import WalletConnect from "@/components/WalletConnect";

const DeploymentHeader = () => {
    return (
        <div className="flex justify-end mb-4">
            <WalletConnect onConnect={() => {}} />
        </div>
    );
};

export default DeploymentHeader;