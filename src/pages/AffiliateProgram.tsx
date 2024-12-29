import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

const AffiliateProgram = () => {
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [referralCode, setReferralCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleConnect = (connected: boolean, account?: string) => {
    console.log("Wallet connection status:", connected, "Account:", account);
    if (connected && account) {
      setWalletAddress(account);
      checkExistingAffiliate(account);
    }
  };

  const checkExistingAffiliate = async (address: string) => {
    try {
      console.log("Checking existing affiliate for address:", address);
      const { data: affiliate, error } = await supabase
        .from('affiliates')
        .select('referral_code, total_referrals, total_earnings')
        .eq('user_address', address)
        .single();

      if (error) {
        console.error("Error checking affiliate:", error);
        return;
      }

      if (affiliate?.referral_code) {
        console.log("Found existing affiliate with code:", affiliate.referral_code);
        setReferralCode(affiliate.referral_code);
        toast({
          title: "Welcome Back!",
          description: `Your referral code is: ${affiliate.referral_code}. You have ${affiliate.total_referrals} referrals and earned ${affiliate.total_earnings} DMC.`,
        });
      }
    } catch (error) {
      console.error("Error checking affiliate status:", error);
    }
  };

  const generateUniqueCode = () => {
    // Generate a 6-character alphanumeric code
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
      // Generate a unique code and check if it exists
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

      const { error } = await supabase
        .from('affiliates')
        .insert([
          {
            user_address: walletAddress,
            referral_code: newCode,
            total_referrals: 0,
            total_earnings: 0
          },
        ]);

      if (error) throw error;

      setReferralCode(newCode);
      
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
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Affiliate Program</h1>
          <p className="text-lg mb-8 text-gray-300">
            Join our affiliate program and earn rewards for referring new users to our NFT marketplace.
            Share your unique referral code and earn DMC tokens for each successful referral!
          </p>

          {!referralCode ? (
            <div className="space-y-6">
              <div className="bg-black/30 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">How it works:</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li>Connect your wallet to sign up as an affiliate</li>
                  <li>Get your unique referral code</li>
                  <li>Share your code with potential buyers</li>
                  <li>Earn DMC tokens when they make purchases</li>
                </ul>
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
            <div className="bg-black/30 p-6 rounded-lg space-y-4">
              <h2 className="text-xl font-semibold">Your Referral Code:</h2>
              <div className="flex items-center gap-4">
                <div className="flex-1 bg-black/50 border border-gray-700 rounded px-4 py-2 text-xl font-mono">
                  {referralCode}
                </div>
                <Button onClick={copyToClipboard} variant="secondary">
                  Copy Code
                </Button>
              </div>
              <p className="text-sm text-gray-400">
                Share this code with potential buyers. You'll earn DMC tokens for each successful referral!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AffiliateProgram;