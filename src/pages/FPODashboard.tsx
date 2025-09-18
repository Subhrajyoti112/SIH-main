import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Package, QrCode, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useApp } from '@/contexts/AppContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { generateQRCode } from '@/utils/qrCodeGenerator';

const FPODashboard: React.FC = () => {
  const { toast } = useToast();
  const { batches, updateBatch, addLot, addTransaction } = useApp();
  const { t } = useLanguage();
  const [selectedBatches, setSelectedBatches] = useState<string[]>([]);

  const pendingBatches = batches.filter(batch => batch.status === 'pending');
  const approvedBatches = batches.filter(batch => batch.status === 'approved');

  const handleApprove = (batchId: string) => {
    updateBatch(batchId, { status: 'approved' });
    
    // Add blockchain transaction
    addTransaction({
      id: `TX_${Date.now()}`,
      hash: `0x${Math.random().toString(16).substr(2, 20)}`,
      type: 'batch_approved',
      stakeholder: 'Odisha Farmers Collective',
      stakeholderType: 'fpo',
      data: { batchId },
      timestamp: new Date(),
      previousHash: `0x${Math.random().toString(16).substr(2, 20)}`
    });

    toast({
      title: 'Batch Approved',
      description: `Batch ${batchId} has been approved successfully.`,
    });
  };

  const handleReject = (batchId: string) => {
    updateBatch(batchId, { status: 'rejected' });
    
    // Add blockchain transaction
    addTransaction({
      id: `TX_${Date.now()}`,
      hash: `0x${Math.random().toString(16).substr(2, 20)}`,
      type: 'batch_rejected',
      stakeholder: 'Odisha Farmers Collective',
      stakeholderType: 'fpo',
      data: { batchId },
      timestamp: new Date(),
      previousHash: `0x${Math.random().toString(16).substr(2, 20)}`
    });

    toast({
      title: 'Batch Rejected',
      description: `Batch ${batchId} has been rejected.`,
      variant: 'destructive',
    });
  };

  const handleBatchSelection = (batchId: string) => {
    setSelectedBatches(prev => 
      prev.includes(batchId) 
        ? prev.filter(id => id !== batchId)
        : [...prev, batchId]
    );
  };

  const handleCreateLot = async () => {
    if (selectedBatches.length === 0) {
      toast({
        title: 'Error',
        description: 'Please select at least one batch to create a lot.',
        variant: 'destructive',
      });
      return;
    }

    const selectedBatchData = batches.filter(batch => selectedBatches.includes(batch.id));
    const totalQuantity = selectedBatchData.reduce((sum, batch) => sum + batch.quantity, 0);
    const averagePrice = selectedBatchData.reduce((sum, batch) => sum + batch.expectedPrice, 0) / selectedBatchData.length;
    
    const lotId = `LOT${String(Date.now()).slice(-3)}`;
    const qrCode = await generateQRCode(lotId);

    const newLot = {
      id: lotId,
      batches: selectedBatchData,
      fpoId: 'FPO001',
      fpoName: 'Odisha Farmers Collective',
      totalQuantity,
      averagePrice: Math.round(averagePrice),
      status: 'available' as const,
      createdAt: new Date(),
      qrCode
    };

    addLot(newLot);

    // Mark selected batches as sold
    selectedBatches.forEach(batchId => {
      updateBatch(batchId, { status: 'sold' });
    });

    // Add blockchain transaction
    addTransaction({
      id: `TX_${Date.now()}`,
      hash: `0x${Math.random().toString(16).substr(2, 20)}`,
      type: 'lot_created',
      stakeholder: 'Odisha Farmers Collective',
      stakeholderType: 'fpo',
      data: { lotId, batchIds: selectedBatches, totalQuantity },
      timestamp: new Date(),
      previousHash: `0x${Math.random().toString(16).substr(2, 20)}`
    });

    setSelectedBatches([]);
    toast({
      title: 'Lot Created Successfully',
      description: `Lot ${lotId} created with ${selectedBatches.length} batches.`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            FPO Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage farmer submissions and create lots for retailers
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="shadow-card hover:shadow-elegant transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{batches.length}</p>
                  <p className="text-sm text-muted-foreground">Total Submissions</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card hover:shadow-elegant transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Package className="w-8 h-8 text-warning" />
                <div>
                  <p className="text-2xl font-bold">{pendingBatches.length}</p>
                  <p className="text-sm text-muted-foreground">Pending Review</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-elegant transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-8 h-8 text-success" />
                <div>
                  <p className="text-2xl font-bold">{approvedBatches.length}</p>
                  <p className="text-sm text-muted-foreground">Approved Batches</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-elegant transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">₹{Math.round(batches.reduce((sum, batch) => sum + batch.expectedPrice, 0) / batches.length) || 0}</p>
                  <p className="text-sm text-muted-foreground">Avg Price/Kg</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Submissions */}
        <Card className="shadow-hero">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="w-5 h-5" />
              <span>Pending Submissions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingBatches.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No pending submissions to review
                </p>
              ) : (
                pendingBatches.map((batch) => (
                  <motion.div
                    key={batch.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-4 border border-border rounded-lg bg-card/50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="font-semibold">{batch.cropName}</h3>
                          <p className="text-sm text-muted-foreground">
                            Farmer: {batch.farmerName} | Quantity: {batch.quantity}kg | Location: {batch.location}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Expected Price: ₹{batch.expectedPrice}/kg
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleApprove(batch.id)}
                        className="bg-success hover:bg-success/90 text-success-foreground"
                        size="sm"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleReject(batch.id)}
                        variant="destructive"
                        size="sm"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Create Lot Section */}
        <Card className="shadow-hero">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <QrCode className="w-5 h-5" />
                <span>Create Lot from Approved Batches</span>
              </div>
              <Button
                onClick={handleCreateLot}
                disabled={selectedBatches.length === 0}
                className="gradient-primary text-primary-foreground"
              >
                Create Lot ({selectedBatches.length})
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {approvedBatches.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No approved batches available to create lots
                </p>
              ) : (
                approvedBatches.map((batch) => (
                  <motion.div
                    key={batch.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedBatches.includes(batch.id)
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-card/50 hover:bg-card/80'
                    }`}
                    onClick={() => handleBatchSelection(batch.id)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <input
                          type="checkbox"
                          checked={selectedBatches.includes(batch.id)}
                          onChange={() => handleBatchSelection(batch.id)}
                          className="w-4 h-4 text-primary"
                        />
                        <div>
                          <h3 className="font-semibold">{batch.cropName}</h3>
                          <p className="text-sm text-muted-foreground">
                            Farmer: {batch.farmerName} | Quantity: {batch.quantity}kg
                          </p>
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-success/20 text-success">
                      Approved
                    </Badge>
                  </motion.div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FPODashboard;