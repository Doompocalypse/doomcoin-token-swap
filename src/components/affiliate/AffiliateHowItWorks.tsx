import { Card } from "@/components/ui/card";

const AffiliateHowItWorks = () => {
  return (
    <div className="bg-black/30 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">How it works:</h2>
      <ul className="list-disc list-inside space-y-2 text-gray-300">
        <li>Connect your crypto wallet to sign up as an affiliate</li>
        <li>Get your unique referral code</li>
        <li>Start earning by introducing new players to the world of Doompocalypse!</li>
      </ul>
    </div>
  );
};

export default AffiliateHowItWorks;