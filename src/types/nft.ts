export interface NFT {
  id: string;
  name: string;
  description: string | null;
  price: number;
  videoUrl: string;
  imageUrl: string;
  balance?: number;
}

export interface NFTMetadata {
  token_id: string;
  name: string;
  description: string | null;
  image_url: string;
  attributes: Record<string, any> | null;
}

export interface NFTPurchase {
  token_id: string;
  buyer_address: string;
  transaction_hash: string;
  price_paid: number;
}