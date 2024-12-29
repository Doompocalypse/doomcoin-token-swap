import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

const AffiliateProgram = () => {
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [referralLink, setReferralLink] = useState<string>("");
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
      const { data: affiliate } = await supabase
        .from('affiliates')
        .select('referral_code')
        .eq('user_address', address)
        .single();

      if (affiliate?.referral_code) {
        const baseUrl = window.location.origin;
        setReferralLink(`${baseUrl}?ref=${affiliate.referral_code}`);
      }
    } catch (error) {
      console.error("Error checking affiliate status:", error);
    }
  };

  const generateReferralCode = (address: string) => {
    return `${address.substring(2, 8).toLowerCase()}${Date.now().toString(36)}`;
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
      const referralCode = generateReferralCode(walletAddress);
      const { error } = await supabase
        .from('affiliates')
        .insert([
          {
            user_address: walletAddress,
            referral_code: referralCode,
          },
        ]);

      if (error) throw error;

      const baseUrl = window.location.origin;
      const newReferralLink = `${baseUrl}?ref=${referralCode}`;
      setReferralLink(newReferralLink);
      
      toast({
        title: "Success!",
        description: "You're now registered as an affiliate. Share your referral link to start earning!",
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
      await navigator.clipboard.writeText(referralLink);
      toast({
        title: "Copied!",
        description: "Referral link copied to clipboard",
      });
    } catch (err) {
      console.error("Failed to copy:", err);
      toast({
        title: "Error",
        description: "Failed to copy referral link",
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
            Earn a percentage of each successful purchase made through your referral link!
          </p>

          {!referralLink ? (
            <div className="space-y-6">
              <div className="bg-black/30 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">How it works:</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li>Connect your wallet to sign up as an affiliate</li>
                  <li>Get your unique referral link</li>
                  <li>Share your link with potential buyers</li>
                  <li>Earn rewards when they make purchases</li>
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
              <h2 className="text-xl font-semibold">Your Referral Link:</h2>
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  value={referralLink}
                  readOnly
                  className="flex-1 bg-black/50 border border-gray-700 rounded px-4 py-2 text-sm"
                />
                <Button onClick={copyToClipboard} variant="secondary">
                  Copy Link
                </Button>
              </div>
              <p className="text-sm text-gray-400">
                Share this link with potential buyers. You'll earn rewards for each successful purchase!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AffiliateProgram;