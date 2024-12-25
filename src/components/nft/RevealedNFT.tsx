import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import VideoPlayer from './VideoPlayer';

interface RevealedNFTProps {
  showVideo: boolean;
  showNFT: boolean;
  selectedNFT: any;
  onClose: () => void;
}

const RevealedNFT = ({ showVideo, showNFT, selectedNFT, onClose }: RevealedNFTProps) => (
  <motion.div
    initial={{ scale: 1, rotateY: 0 }}
    animate={showNFT ? {
      scale: [1, 1.2, 0.8],
      rotateY: 180,
      transition: { duration: 1.5 }
    } : {
      scale: [1, 1.1, 1],
      rotateY: 0,
      transition: { repeat: 3, duration: 0.5 }
    }}
    className="relative aspect-square bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-lg shadow-2xl border border-zinc-700 overflow-hidden"
  >
    {showVideo && (
      <div className="absolute inset-0">
        <VideoPlayer videoUrl="https://player.vimeo.com/video/1042150904" />
      </div>
    )}
    {showNFT && selectedNFT && (
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-black/80 backdrop-blur-sm">
        <h3 className="text-2xl font-bold text-white mb-2">{selectedNFT.name}</h3>
        <p className="text-zinc-400 mb-4">{selectedNFT.description}</p>
        <p className="text-xl font-bold text-white">${selectedNFT.price} DMC</p>
        <Button 
          onClick={onClose}
          className="mt-4 bg-white hover:bg-white/90 text-black"
        >
          Close
        </Button>
      </div>
    )}
  </motion.div>
);

export default RevealedNFT;