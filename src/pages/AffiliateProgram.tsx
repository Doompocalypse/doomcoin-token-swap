import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AffiliateStats {
  referralCode: string;
  totalReferrals: number;
  totalEarnings: number;
  commission: number;
}

const AffiliateProgram = () => {
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [referralCode, setReferralCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const calculateCommissionRate = (referralCount: number): number => {
    if (referralCount >= 20) return 0.20;
    if (referralCount >= 10) return 0.15;
    return 0.10;
  };

  const handleConnect = (connected: boolean, account?: string) => {
    console.log("Wallet connection status:", connected, "Account:", account);
    if (connected && account) {
      setWalletAddress(account);
      checkExistingAffiliate(account);
    }
  };

  const fetchAffiliateStats = async (affiliateId: string) => {
    try {
      const { data: referrals, error: referralsError } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_id', affiliateId);

      if (referralsError) throw referralsError;

      const totalReferrals = referrals?.length || 0;
      const commission = calculateCommissionRate(totalReferrals);
      const totalEarnings = referrals?.reduce((sum, ref) => sum + Number(ref.commission_paid), 0) || 0;

      return {
        totalReferrals,
        totalEarnings,
        commission: commission * 100 // Convert to percentage
      };
    } catch (error) {
      console.error("Error fetching affiliate stats:", error);
      return null;
    }
  };

  const checkExistingAffiliate = async (address: string) => {
    try {
      console.log("Checking existing affiliate for address:", address);
      const { data: affiliate, error } = await supabase
        .from('affiliates')
        .select('*')
        .eq('user_address', address)
        .single();

      if (error) {
        console.error("Error checking affiliate:", error);
        return;
      }

      if (affiliate?.referral_code) {
        console.log("Found existing affiliate with code:", affiliate.referral_code);
        setReferralCode(affiliate.referral_code);
        
        // Fetch and set stats
        const stats = await fetchAffiliateStats(affiliate.id);
        if (stats) {
          setStats({
            referralCode: affiliate.referral_code,
            ...stats
          });
        }

        toast({
          title: "Welcome Back!",
          description: `Your referral code is: ${affiliate.referral_code}`,
        });
      }
    } catch (error) {
      console.error("Error checking affiliate status:", error);
    }
  };

  const generateUniqueCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleSignUp = async () => {
    if (!walletAddress) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to sign up as an affiliate.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      let isUnique = false;
      let newCode = '';
      
      while (!isUnique) {
        newCode = generateUniqueCode();
        const { data } = await supabase
          .from('affiliates')
          .select('referral_code')
          .eq('referral_code', newCode);
        
        isUnique = !data || data.length === 0;
      }

      const { data: newAffiliate, error } = await supabase
        .from('affiliates')
        .insert([
          {
            user_address: walletAddress,
            referral_code: newCode,
            total_referrals: 0,
            total_earnings: 0
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setReferralCode(newCode);
      setStats({
        referralCode: newCode,
        totalReferrals: 0,
        totalEarnings: 0,
        commission: 10 // Starting commission rate
      });
      
      toast({
        title: "Success!",
        description: `You're now registered as an affiliate. Your referral code is: ${newCode}`,
      });
    } catch (error) {
      console.error("Error creating affiliate:", error);
      toast({
        title: "Error",
        description: "Failed to register as an affiliate. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
    <div className="min-h-screen bg-[#221F26] text-white">
      <Header onConnect={handleConnect} />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Affiliate Program</h1>
          
          {!referralCode ? (
            <div className="space-y-6">
              <div className="bg-black/30 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">How it works:</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li>Connect your wallet to sign up as an affiliate</li>
                  <li>Get your unique referral code</li>
                  <li>Share your code with potential buyers</li>
                  <li>Earn DMC tokens when they make purchases</li>
                  <li>Increase your commission rate by referring more users</li>
                </ul>
                
                <div className="mt-6 p-4 bg-purple-900/30 rounded-lg">
                  <h3 className="font-semibold mb-2">Commission Tiers:</h3>
                  <ul className="space-y-1 text-gray-300">
                    <li>1-9 referrals: 10% commission</li>
                    <li>10-19 referrals: 15% commission</li>
                    <li>20+ referrals: 20% commission</li>
                  </ul>
                </div>
              </div>

              <Button
                onClick={handleSignUp}
                disabled={!walletAddress || isLoading}
                className="w-full py-6 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {isLoading ? "Processing..." : "Sign Up as Affiliate"}
              </Button>
            </div>
          ) : (
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      <CardTitle className="text-xl">Current Commission</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">{stats.commission}%</p>
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
          )}
        </div>
      </div>
    </div>
  );
};

export default AffiliateProgram;