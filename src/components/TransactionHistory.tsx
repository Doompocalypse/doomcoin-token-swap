import { Card } from "@/components/ui/card";

const TransactionHistory = () => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
      
      <div className="text-center text-muted-foreground">
        <p>No transactions yet</p>
      </div>
    </Card>
  );
};

export default TransactionHistory;