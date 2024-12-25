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
    className="relative aspect-square bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-lg shadow-2xl border border-zinc-700"
  >
    <div className="absolute inset-0">
      <img 
        src="/lovable-uploads/b308780d-5958-4293-8455-a5764a72141d.png" 
        alt="Mystery Box"
        className="w-full h-full object-contain p-8"
      />
    </div>
    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-black/40 backdrop-blur-sm">
      <h3 className="text-2xl font-bold text-white mb-4">Mystery NFT Box</h3>
      <p className="text-zinc-400 mb-6">Mint a random NFT from the collection</p>
      <Button 
        onClick={onMint}
        disabled={!isConnected}
        className="bg-white hover:bg-white/90 text-black"
      >
        Mint Mystery NFT
      </Button>
    </div>
  </motion.div>
);

export default MysteryBoxDisplay;