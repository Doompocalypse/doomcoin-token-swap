export const COLLECTION_METADATA = {
  name: "Cleopatra's Necklace",
  symbol: "CLEO",
  description: `A collection of 6 unique digital representations of Cleopatra's legendary necklaces, 
each piece telling a story of ancient Egyptian royalty and craftsmanship. These NFTs combine 
historical significance with digital art, featuring intricate designs inspired by authentic 
ancient Egyptian jewelry.`,
  external_url: "https://cleopatranft.com",
  seller_fee_basis_points: 1000, // 10% royalty
  fee_recipient: "0x02655Ad2a81e396Bc35957d647179fD87b3d2b36", // DMC contract address
  pieces: [
    {
      id: 1,
      name: "The Royal Cobra",
      description: "A majestic necklace featuring the royal cobra symbol, worn by Cleopatra during ceremonial events.",
      attributes: [
        { trait_type: "Material", value: "Gold" },
        { trait_type: "Style", value: "Ceremonial" },
        { trait_type: "Rarity", value: "Legendary" }
      ]
    },
    {
      id: 2,
      name: "The Isis Amulet",
      description: "A protective necklace bearing the symbol of Isis, believed to grant divine protection to its wearer.",
      attributes: [
        { trait_type: "Material", value: "Gold and Lapis Lazuli" },
        { trait_type: "Style", value: "Religious" },
        { trait_type: "Rarity", value: "Mythical" }
      ]
    },
    {
      id: 3,
      name: "The Scarab Heart",
      description: "A heart scarab necklace representing rebirth and eternal life in ancient Egyptian mythology.",
      attributes: [
        { trait_type: "Material", value: "Gold and Turquoise" },
        { trait_type: "Style", value: "Mystical" },
        { trait_type: "Rarity", value: "Epic" }
      ]
    },
    {
      id: 4,
      name: "The Sun Disk",
      description: "A radiant necklace featuring the sun disk of Ra, symbolizing royal power and divine right.",
      attributes: [
        { trait_type: "Material", value: "Gold and Carnelian" },
        { trait_type: "Style", value: "Royal" },
        { trait_type: "Rarity", value: "Legendary" }
      ]
    },
    {
      id: 5,
      name: "The Lotus Crown",
      description: "A delicate necklace adorned with lotus flowers, representing purity and creation.",
      attributes: [
        { trait_type: "Material", value: "Gold and Amethyst" },
        { trait_type: "Style", value: "Floral" },
        { trait_type: "Rarity", value: "Epic" }
      ]
    },
    {
      id: 6,
      name: "The Alexandria Gems",
      description: "A spectacular piece featuring precious gems from Alexandria's ancient trade routes.",
      attributes: [
        { trait_type: "Material", value: "Gold and Mixed Gems" },
        { trait_type: "Style", value: "Luxurious" },
        { trait_type: "Rarity", value: "Mythical" }
      ]
    }
  ]
};