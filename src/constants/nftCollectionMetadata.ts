export const COLLECTION_METADATA = {
  name: "Cleopatra's Necklace",
  symbol: "CLEO",
  description: `A unique digital NFT collection representing ancient Egyptian craftsmanship and royalty. Each piece is carefully designed to combine historical significance with digital art.`,
  external_url: "https://cleopatranft.com",
  seller_fee_basis_points: 1000, // 10% royalty
  fee_recipient: "0x02655Ad2a81e396Bc35957d647179fD87b3d2b36", // DMC contract address
  pieces: [
    {
      id: "1",
      name: "The Royal Cobra",
      description: "A ceremonial necklace featuring the royal cobra symbol, representing divine authority and protection in ancient Egyptian culture. This piece combines intricate metalwork with symbolic power.",
      attributes: [
        { trait_type: "Type", value: "Ceremonial" },
        { trait_type: "Material", value: "Gold" },
        { trait_type: "Symbol", value: "Cobra" }
      ]
    },
    {
      id: "2",
      name: "The Isis Amulet",
      description: "A protective necklace adorned with the symbol of Isis, the goddess of motherhood and magic. This piece channels ancient Egyptian protective magic through its detailed craftsmanship.",
      attributes: [
        { trait_type: "Type", value: "Protective" },
        { trait_type: "Material", value: "Silver" },
        { trait_type: "Symbol", value: "Isis" }
      ]
    },
    {
      id: "3",
      name: "The Scarab Heart",
      description: "Embodying the concept of rebirth in Egyptian mythology, this heart-shaped scarab necklace symbolizes transformation and eternal life. Each detail represents aspects of spiritual renewal.",
      attributes: [
        { trait_type: "Type", value: "Symbolic" },
        { trait_type: "Material", value: "Lapis Lazuli" },
        { trait_type: "Symbol", value: "Scarab" }
      ]
    },
    {
      id: "4",
      name: "The Sun Disk",
      description: "A magnificent necklace featuring Ra's sun disk symbol, representing the power of the sun god and divine kingship. The radiant design captures the essence of solar worship.",
      attributes: [
        { trait_type: "Type", value: "Divine" },
        { trait_type: "Material", value: "Gold" },
        { trait_type: "Symbol", value: "Sun Disk" }
      ]
    },
    {
      id: "5",
      name: "The Lotus Crown",
      description: "A delicate necklace adorned with lotus flowers, symbolizing creation and rebirth in Egyptian mythology. The intricate floral pattern represents purity and enlightenment.",
      attributes: [
        { trait_type: "Type", value: "Floral" },
        { trait_type: "Material", value: "Rose Gold" },
        { trait_type: "Symbol", value: "Lotus" }
      ]
    },
    {
      id: "6",
      name: "The Alexandria Gems",
      description: "A stunning necklace featuring precious gems from ancient trade routes, showcasing the wealth and international connections of ancient Alexandria. Each gem tells a story of commerce and culture.",
      attributes: [
        { trait_type: "Type", value: "Ornamental" },
        { trait_type: "Material", value: "Mixed Gems" },
        { trait_type: "Symbol", value: "Trade" }
      ]
    }
  ]
};