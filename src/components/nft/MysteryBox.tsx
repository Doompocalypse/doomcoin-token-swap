import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { useNFTData } from './useNFTData';
import { useNFTPurchaseHandler } from './NFTPurchaseHandler';
import VideoPlayer from './VideoPlayer';

interface MysteryBoxProps {
  connectedAccount?: string;
}

export const MysteryBox = ({ connectedAccount }: MysteryBoxProps) => {
  const [isOpening, setIsOpening] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<any>(null);
  const [showNFT, setShowNFT] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const { nfts } = useNFTData(connectedAccount);
  const handlePurchase = useNFTPurchaseHandler(connectedAccount);

  const selectRandomNFT = () => {
    if (!nfts || nfts.length === 0) return null;
    const availableNFTs = nfts.filter(nft => !nft.name.includes('[Restored]'));
    const randomIndex = Math.floor(Math.random() * availableNFTs.length);
    return availableNFTs[randomIndex];
  };

  const handleMysteryMint = async () => {
    setIsOpening(true);
    setShowVideo(true);
    const randomNFT = selectRandomNFT();
    setSelectedNFT(randomNFT);
    
    setTimeout(() => {
      setShowVideo(false);
      setShowNFT(true);
      if (randomNFT) {
        handlePurchase(randomNFT.id, randomNFT.price);
      }
    }, 8000);
  };

  useEffect(() => {
    if (!isOpening) {
      setShowNFT(false);
      setShowVideo(false);
      setSelectedNFT(null);
    }
  }, [isOpening]);

  return (
    <div className="relative w-full max-w-md mx-auto">
      <AnimatePresence>
        {!isOpening ? (
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
                onClick={handleMysteryMint}
                disabled={!connectedAccount}
                className="bg-white hover:bg-white/90 text-black"
              >
                Mint Mystery NFT
              </Button>
            </div>
          </motion.div>
        ) : (
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
                  onClick={() => setIsOpening(false)}
                  className="mt-4 bg-white hover:bg-white/90 text-black"
                >
                  Close
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};