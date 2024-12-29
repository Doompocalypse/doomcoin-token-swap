import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface AffiliateDashboardProps {
  referralCode: string;
  stats: {
    totalReferrals: number;
    totalEarnings: number;
  } | null;
}

const AffiliateDashboard = ({ referralCode, stats }: AffiliateDashboardProps) => {
  const { toast } = useToast();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      toast({
        title: "Copied!",
        description: "Referral code copied to clipboard",
      });
    } catch (err) {
      console.error("Failed to copy:", err);
      toast({
        title: "Error",
        description: "Failed to copy referral code",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-black/30 border-gray-700">
        <CardHeader>
          <CardTitle>Your Referral Code</CardTitle>
          <CardDescription className="text-gray-400">
            Share this code with potential buyers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-black/50 border border-gray-700 rounded px-4 py-2 text-xl font-mono">
              {referralCode}
            </div>
            <Button onClick={copyToClipboard} variant="secondary">
              Copy Code
            </Button>
          </div>
        </CardContent>
      </Card>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-black/30 border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl">Total Referrals</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.totalReferrals}</p>
            </CardContent>
          </Card>

          <Card className="bg-black/30 border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl">Total Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.totalEarnings} DMC</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AffiliateDashboard;