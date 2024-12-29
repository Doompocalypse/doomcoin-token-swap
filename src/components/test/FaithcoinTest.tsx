import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const FaithcoinTest = ({ walletAddress }: { walletAddress?: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleTestTransfer = async () => {
    if (!walletAddress) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log("Testing Faithcoin transfer to:", walletAddress);
      
      const response = await supabase.functions.invoke('transfer-faithcoin', {
        body: {
          toAddress: walletAddress,
          amount: "1",
          network: "sepolia" // Explicitly use Sepolia for testing
        }
      });

      if (!response.data?.success) {
        throw new Error(response.data?.error || 'Transfer failed');
      }

      console.log("Transfer result:", response.data);
      
      toast({
        title: "Transfer Successful",
        description: `Transferred 1 Faithcoin to ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)} on Sepolia`,
      });
    } catch (error: any) {
      console.error("Transfer error:", error);
      toast({
        title: "Transfer Failed",
        description: error.message || "Failed to transfer Faithcoin",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4 bg-black/30 rounded-lg">
      <h2 className="text-xl font-bold text-white">Test Faithcoin Transfer (Sepolia)</h2>
      <div className="space-y-2">
        <p className="text-gray-300">Connected Wallet:</p>
        <Input 
          value={walletAddress || 'Not connected'} 
          readOnly 
          className="bg-black/50 text-white"
        />
      </div>
      <Button
        onClick={handleTestTransfer}
        disabled={!walletAddress || isLoading}
        className="w-full bg-white text-black hover:bg-white/90"
      >
        {isLoading ? "Processing..." : "Test Transfer (1 Faithcoin)"}
      </Button>
    </div>
  );
};

export default FaithcoinTest;