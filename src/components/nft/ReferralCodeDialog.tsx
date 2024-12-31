import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ReferralCodeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (isValid: boolean) => void;
  userAddress: string;
}

const ReferralCodeDialog = ({ isOpen, onClose, onSubmit, userAddress }: ReferralCodeDialogProps) => {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!code.trim()) {
      onSubmit(false);
      onClose();
      return;
    }

    setIsLoading(true);
    try {
      console.log("Checking referral code:", code.trim());
      
      // Check if code exists (case insensitive)
      const { data: referralCode, error: referralError } = await supabase
        .from("referral_codes")
        .select("id")
        .ilike("code", code.trim())
        .maybeSingle();

      if (referralError) {
        console.error("Error checking referral code:", referralError);
        throw referralError;
      }

      if (!referralCode) {
        console.log("Invalid referral code:", code.trim());
        toast({
          title: "Invalid Referral Code",
          description: "The code you entered is not valid.",
          variant: "destructive",
        });
        return;
      }

      console.log("Valid referral code found:", referralCode);

      // Record the referral code use
      const { error: useError } = await supabase
        .from("referral_code_uses")
        .insert({
          referral_code_id: referralCode.id,
          user_address: userAddress,
        });

      if (useError) {
        if (useError.code === "23505") { // Unique violation
          console.log("Referral code already used by address:", userAddress);
          toast({
            title: "Code Already Used",
            description: "You have already used this referral code.",
            variant: "destructive",
          });
          return;
        }
        throw useError;
      }

      console.log("Referral code use recorded successfully");

      // Trigger Faithcoin transfer
      console.log("Initiating Faithcoin transfer to:", userAddress);
      const response = await fetch('https://ylzqjxfbtlkmlxdopita.supabase.co/functions/v1/transfer-faithcoin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          toAddress: userAddress,
          amount: "1",
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to transfer Faithcoin');
      }

      console.log("Faithcoin transfer successful");
      toast({
        title: "Success!",
        description: "Referral code applied successfully. You received 1 Faithcoin!",
      });

      onSubmit(true);
      onClose();
    } catch (error) {
      console.error('Error processing referral code:', error);
      toast({
        title: "Error",
        description: "Failed to process referral code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    console.log("Skip clicked - proceeding with NFT purchase");
    onSubmit(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-black text-white">
        <DialogHeader>
          <DialogTitle>Enter Referral Code</DialogTitle>
          <DialogDescription className="text-gray-400">
            Enter a referral code to receive 1 Faithcoin bonus, or skip to continue with your purchase.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            placeholder="Enter code..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white"
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleSkip}
            disabled={isLoading}
            className="bg-transparent text-white hover:bg-gray-800"
          >
            Skip
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-white text-black hover:bg-white/90"
          >
            {isLoading ? "Processing..." : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReferralCodeDialog;