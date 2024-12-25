import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface MysteryBoxDisplayProps {
  onMint: () => void;
  isConnected: boolean;
}

const MysteryBoxDisplay = ({ onMint, isConnected }: MysteryBoxDisplayProps) => (
  <motion.div
    initial={{ scale: 1 }}
    animate={{ scale: [1, 1.02, 1] }}
    transition={{ repeat: Infinity, duration: 2 }}
    className="relative aspect-square rounded-lg shadow-2xl"
  >
    <div className="absolute inset-0">
      <img 
        src="/lovable-uploads/42fc647d-a273-4c0f-8093-833efae8bc9c.png" 
        alt="Mystery Box"
        className="w-full h-full object-fill"
      />
    </div>
    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-transparent">
      <h3 className="text-2xl font-bold text-white mb-4">Mystery NFT Box</h3>
      <p className="text-white mt-4">Mint a random NFT from the collection</p>
      <Button 
        onClick={onMint}
        disabled={!isConnected}
        className="bg-white hover:bg-white/90 text-white mt-4"
      >
        Mint Mystery NFT
      </Button>
    </div>
  </motion.div>
);

export default MysteryBoxDisplay;