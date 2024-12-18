import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useIsMobile } from "@/hooks/use-mobile";
import { fetchEthPrice } from "@/utils/ethPrice";
import ExchangeForm from "./exchange/ExchangeForm";
import ContractInfo from "./exchange/ContractInfo";

interface TokenExchangeProps {
  isConnected: boolean;
  connectedAccount?: string;
}

const TokenExchange = ({ isConnected, connectedAccount }: TokenExchangeProps) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) {
      toast({
        title: "Desktop Only Feature",
        description: "Token swapping is currently only available on desktop devices.",
        variant: "destructive",
      });
    }
  }, [isMobile, toast]);

  const { data: ethPrice = 2500 } = useQuery({
    queryKey: ["ethPrice"],
    queryFn: fetchEthPrice,
    refetchInterval: 60000,
    meta: {
      onError: (error: Error) => {
        console.error("Query error:", error);
        toast({
          title: "Price Update Failed",
          description: "Using fallback price. Please try again later.",
          variant: "destructive",
        });
      },
    },
  });

  return (
    <Card className="p-8 space-y-6 bg-transparent border-[#8E9196]/20">
      <ExchangeForm
        isConnected={isConnected}
        connectedAccount={connectedAccount}
        ethPrice={ethPrice}
        isMobile={isMobile}
      />
      <ContractInfo />
    </Card>
  );
};

export default TokenExchange;