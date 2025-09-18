import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Batch, Lot, BlockchainTransaction } from '@/types';

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  batches: Batch[];
  setBatches: (batches: Batch[]) => void;
  lots: Lot[];
  setLots: (lots: Lot[]) => void;
  blockchain: BlockchainTransaction[];
  setBlockchain: (blockchain: BlockchainTransaction[]) => void;
  addBatch: (batch: Batch) => void;
  updateBatch: (batchId: string, updates: Partial<Batch>) => void;
  addLot: (lot: Lot) => void;
  addTransaction: (transaction: BlockchainTransaction) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

// Dummy data
const dummyBatches: Batch[] = [
  {
    id: 'BATCH001',
    cropName: 'Rice',
    quantity: 100,
    location: 'Cuttack, Odisha',
    expectedPrice: 25,
    farmerId: 'FARMER001',
    farmerName: 'Ramesh Kumar',
    status: 'approved',
    createdAt: new Date('2024-01-15'),
    qrCode: 'QR_BATCH001'
  },
  {
    id: 'BATCH002',
    cropName: 'Wheat',
    quantity: 150,
    location: 'Bhubaneswar, Odisha',
    expectedPrice: 30,
    farmerId: 'FARMER002',
    farmerName: 'Priya Patel',
    status: 'pending',
    createdAt: new Date('2024-01-20'),
    qrCode: 'QR_BATCH002'
  }
];

const dummyLots: Lot[] = [
  {
    id: 'LOT001',
    batches: [dummyBatches[0]],
    fpoId: 'FPO001',
    fpoName: 'Odisha Farmers Collective',
    totalQuantity: 100,
    averagePrice: 25,
    status: 'available',
    createdAt: new Date('2024-01-16'),
    qrCode: 'QR_LOT001'
  }
];

const dummyTransactions: BlockchainTransaction[] = [
  {
    id: 'TX001',
    hash: '0x1a2b3c4d5e6f7890abcdef',
    type: 'batch_created',
    stakeholder: 'Ramesh Kumar',
    stakeholderType: 'farmer',
    data: { batchId: 'BATCH001', cropName: 'Rice' },
    timestamp: new Date('2024-01-15'),
    previousHash: '0x0000000000000000000000'
  },
  {
    id: 'TX002',
    hash: '0x2b3c4d5e6f7890abcdef1a',
    type: 'batch_approved',
    stakeholder: 'Odisha Farmers Collective',
    stakeholderType: 'fpo',
    data: { batchId: 'BATCH001' },
    timestamp: new Date('2024-01-16'),
    previousHash: '0x1a2b3c4d5e6f7890abcdef'
  }
];

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [batches, setBatches] = useState<Batch[]>(dummyBatches);
  const [lots, setLots] = useState<Lot[]>(dummyLots);
  const [blockchain, setBlockchain] = useState<BlockchainTransaction[]>(dummyTransactions);

  const addBatch = (batch: Batch) => {
    setBatches(prev => [...prev, batch]);
  };

  const updateBatch = (batchId: string, updates: Partial<Batch>) => {
    setBatches(prev => prev.map(batch => 
      batch.id === batchId ? { ...batch, ...updates } : batch
    ));
  };

  const addLot = (lot: Lot) => {
    setLots(prev => [...prev, lot]);
  };

  const addTransaction = (transaction: BlockchainTransaction) => {
    setBlockchain(prev => [...prev, transaction]);
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      setCurrentUser,
      batches,
      setBatches,
      lots,
      setLots,
      blockchain,
      setBlockchain,
      addBatch,
      updateBatch,
      addLot,
      addTransaction
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};