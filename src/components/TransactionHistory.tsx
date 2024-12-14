import { Card } from "@/components/ui/card";

const TransactionHistory = () => {
  return (
    <Card className="p-6 bg-[#221F26] border-[#8E9196]/20">
      <h2 className="text-xl font-semibold mb-4 text-[#F1F1F1]">Transaction History</h2>
      
      <div className="text-center text-[#8E9196]">
        <p>No transactions yet</p>
      </div>
    </Card>
  );
};

export default TransactionHistory;