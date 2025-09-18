export interface User {
  id: string;
  name: string;
  role: 'farmer' | 'fpo' | 'retailer' | 'consumer' | 'government';
  location?: string;
}

export interface Batch {
  id: string;
  cropName: string;
  quantity: number;
  location: string;
  expectedPrice: number;
  farmerId: string;
  farmerName: string;
  status: 'pending' | 'approved' | 'rejected' | 'sold';
  createdAt: Date;
  qrCode?: string;
}

export interface Lot {
  id: string;
  batches: Batch[];
  fpoId: string;
  fpoName: string;
  totalQuantity: number;
  averagePrice: number;
  status: 'available' | 'sold';
  createdAt: Date;
  qrCode?: string;
  retailerId?: string;
  retailerName?: string;
}

export interface BlockchainTransaction {
  id: string;
  hash: string;
  type: 'batch_created' | 'batch_approved' | 'batch_rejected' | 'lot_created' | 'lot_purchased' | 'lot_delivered';
  stakeholder: string;
  stakeholderType: User['role'];
  data: any;
  timestamp: Date;
  previousHash?: string;
}

export type Language = 'en' | 'hi' | 'od';

export interface Translation {
  [key: string]: {
    en: string;
    hi: string;
    od: string;
  };
}