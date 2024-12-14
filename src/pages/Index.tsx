import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import TokenExchange from "@/components/TokenExchange";
import TransactionHistory from "@/components/TransactionHistory";
import Doomy from "@/components/Doomy";

const Index = () => {
  const { toast } = useToast();

  return (
    <div className="min-h-screen bg-[#221F26] p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold text-[#F1F1F1]">
            Swap Tokens
          </h1>
        </div>

        <div className="space-y-8">
          <TokenExchange isConnected={false} />
          <TransactionHistory />
        </div>
      </div>
      <Doomy />
    </div>
  );
};

export default Index;