import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface Transaction {
  id: string;
  nft_id: string;
  buyer_address: string;
  purchase_date: string;
  contract_address: string;
  mock_nfts: {
    name: string;
  };
}

const TransactionHistory = () => {
  const { toast } = useToast();
  const { data: transactions, isLoading, error } = useQuery({
    queryKey: ['nft-transactions'],
    queryFn: async () => {
      console.log('Fetching NFT transaction history');
      const { data, error } = await supabase
        .from('mock_purchases')
        .select(`
          *,
          mock_nfts (
            name
          )
        `)
        .order('purchase_date', { ascending: false });

      if (error) {
        console.error('Error fetching transactions:', error);
        throw error;
      }

      console.log('Received transactions:', data);
      return data as Transaction[];
    },
    refetchInterval: 5000, // Refetch every 5 seconds to catch new transactions
    initialData: [], // Initialize with empty array to avoid undefined
    retry: 3, // Retry failed requests 3 times
    staleTime: 1000, // Consider data stale after 1 second
  });

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast({
      title: "Copied",
      description: "Address copied to clipboard",
    });
  };

  if (isLoading) {
    return <div className="text-white">Loading transaction history...</div>;
  }

  if (error) {
    console.error('Transaction history error:', error);
    return <div className="text-red-500">Error loading transaction history: {error.message}</div>;
  }

  if (!transactions?.length) {
    return (
      <div className="bg-black/40 p-6 rounded-lg">
        <h2 className="text-xl font-bold text-white mb-2">Transaction History</h2>
        <p className="text-gray-300">No transactions found.</p>
      </div>
    );
  }

  return (
    <div className="bg-black/40 p-6 rounded-lg">
      <h2 className="text-xl font-bold text-white mb-4">Transaction History</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-300">NFT Name</TableHead>
              <TableHead className="text-gray-300">Buyer Address</TableHead>
              <TableHead className="text-gray-300">Contract Address</TableHead>
              <TableHead className="text-gray-300">Time</TableHead>
              <TableHead className="text-gray-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell className="text-white">{tx.mock_nfts.name}</TableCell>
                <TableCell className="text-white font-mono">
                  {tx.buyer_address.slice(0, 6)}...{tx.buyer_address.slice(-4)}
                </TableCell>
                <TableCell className="text-white font-mono">
                  {tx.contract_address ? (
                    `${tx.contract_address.slice(0, 6)}...${tx.contract_address.slice(-4)}`
                  ) : (
                    'N/A'
                  )}
                </TableCell>
                <TableCell className="text-white">
                  {formatDistanceToNow(new Date(tx.purchase_date), { addSuffix: true })}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyAddress(tx.buyer_address)}
                      className="text-green-400 border-green-400 hover:bg-green-400/20"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`https://sepolia.etherscan.io/address/${tx.buyer_address}`, '_blank')}
                      className="text-green-400 border-green-400 hover:bg-green-400/20"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TransactionHistory;