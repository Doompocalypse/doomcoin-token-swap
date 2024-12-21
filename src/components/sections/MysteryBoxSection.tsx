import { MysteryBox } from "@/components/nft/MysteryBox";

interface MysteryBoxSectionProps {
  connectedAccount?: string;
}

const MysteryBoxSection = ({ connectedAccount }: MysteryBoxSectionProps) => {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-white">Fragmented Masterpieces: A Post-Apocalyptic NFT Collection</h2>
        <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed tracking-wide px-4">
          Salvage remnants of the doomed world's most iconic art collections. Gather all the scattered fragments to restore your pieces back to priceless condition. Claim your place among the elite collectors of the post-apocalyptic era or capitalize on your finds.
        </p>
      </div>
      <div className="w-full max-w-3xl mx-auto px-4">
        <MysteryBox connectedAccount={connectedAccount} />
      </div>
    </div>
  );
};

export default MysteryBoxSection;