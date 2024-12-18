import React from "react";
import { Button } from "@/components/ui/button";
import ContractDetails from "./components/ContractDetails";
import ErrorDisplay from "./components/ErrorDisplay";
import TransactionDetails from "./components/TransactionDetails";

interface DeploymentStatusProps {
  contractAddress?: string;
  errorMessage?: string;
  transactionHash?: string;
}

const DeploymentStatus = ({
  contractAddress,
  errorMessage,
  transactionHash,
}: DeploymentStatusProps) => {
  if (errorMessage) {
    return <ErrorDisplay errorMessage={errorMessage} />;
  }

  if (!contractAddress && !transactionHash) {
    return null;
  }

  if (!contractAddress && transactionHash) {
    return (
      <TransactionDetails 
        transactionHash={transactionHash}
        status="Pending"
        confirmations={0}
      />
    );
  }

  return <ContractDetails contractAddress={contractAddress} transactionHash={transactionHash} />;
};

export default DeploymentStatus;