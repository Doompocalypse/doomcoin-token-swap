import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AffiliateHowItWorks from "@/components/affiliate/AffiliateHowItWorks";
import AffiliateDashboard from "@/components/affiliate/AffiliateDashboard";
import VideoBackground from "@/components/VideoBackground";

interface AffiliateStats {
  totalReferrals: number;
  totalEarnings: number;
}

const AffiliateProgram = () => {
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [referralCode, setReferralCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const { toast } = useToast();

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

      if (referralsError) {
        console.error("Error fetching referrals:", referralsError);
        return null;
      }

      const totalReferrals = referrals?.length || 0;
      const totalEarnings = referrals?.reduce((sum, ref) => sum + Number(ref.commission_paid), 0) || 0;

      return {
        totalReferrals,
        totalEarnings
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
        .maybeSingle();

      if (error) {
        console.error("Error checking affiliate:", error);
        return;
      }

      if (affiliate) {
        console.log("Found existing affiliate:", affiliate);
        setReferralCode(affiliate.referral_code);
        
        const stats = await fetchAffiliateStats(affiliate.id);
        if (stats) {
          setStats(stats);
        }

        toast({
          title: "Welcome Back!",
          description: `Your referral code is: ${affiliate.referral_code}`,
        });
      } else {
        console.log("No existing affiliate found for address:", address);
        setReferralCode("");
        setStats(null);
      }
    } catch (error) {
      console.error("Error checking affiliate status:", error);
      toast({
        title: "Error",
        description: "Failed to check affiliate status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSignUpClick = async () => {
    if (!walletAddress) {
      toast({
        title: "Connect Wallet",
        description: "Please connect your wallet to sign up as an affiliate.",
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
        totalReferrals: 0,
        totalEarnings: 0
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

  const generateUniqueCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  return (
    <div className="min-h-screen relative">
      <VideoBackground />
      <Header onConnect={handleConnect} />
      <div className="container mx-auto px-4 pt-24 pb-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center text-white">
            Play. Earn. Repeat!
          </h1>
          
          {!referralCode ? (
            <div className="space-y-6">
              <AffiliateHowItWorks />
              <Button
                onClick={handleSignUpClick}
                disabled={isLoading}
                className="w-full py-6 text-lg bg-white hover:bg-white/90 text-black"
              >
                {isLoading ? "Processing..." : "Sign Up as Affiliate"}
              </Button>
            </div>
          ) : (
            <AffiliateDashboard referralCode={referralCode} stats={stats} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AffiliateProgram;