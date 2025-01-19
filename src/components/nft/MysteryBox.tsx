import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNFTData } from './useNFTData';
import { useNFTPurchaseHandler } from './NFTPurchaseHandler';
import MysteryBoxDisplay from './MysteryBoxDisplay';
import RevealedNFT from './RevealedNFT';

interface MysteryBoxProps {
  connectedAccount?: string;
}

export const MysteryBox = ({ connectedAccount }: MysteryBoxProps) => {
  const [isOpening, setIsOpening] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<any>(null);
  const [showNFT, setShowNFT] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const { nfts } = useNFTData(connectedAccount);
  const { handlePurchase, ReferralDialog } = useNFTPurchaseHandler(connectedAccount);

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
      {ReferralDialog}
      <AnimatePresence>
        {!isOpening ? (
          <MysteryBoxDisplay 
            onMint={handleMysteryMint}
            isConnected={!!connectedAccount}
          />
        ) : (
          <RevealedNFT
            showVideo={showVideo}
            showNFT={showNFT}
            selectedNFT={selectedNFT}
            onClose={() => setIsOpening(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};