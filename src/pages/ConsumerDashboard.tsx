import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { QrCode, Search, MapPin, Calendar, User, Package, Truck, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useApp } from '@/contexts/AppContext';
import { useLanguage } from '@/contexts/LanguageContext';

const ConsumerDashboard: React.FC = () => {
  const { toast } = useToast();
  const { batches, lots, blockchain } = useApp();
  const { t } = useLanguage();
  const [searchId, setSearchId] = useState('');
  const [traceResult, setTraceResult] = useState<any>(null);

  const handleScanQR = () => {
    if (!searchId.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a Batch ID or Lot ID to trace.',
        variant: 'destructive',
      });
      return;
    }

    // Check if it's a batch or lot
    const batch = batches.find(b => b.id === searchId.trim());
    const lot = lots.find(l => l.id === searchId.trim());

    if (batch) {
      // Trace batch journey
      const batchTransactions = blockchain.filter(tx => 
        tx.data?.batchId === batch.id || 
        tx.data?.batchIds?.includes(batch.id)
      );

      setTraceResult({
        type: 'batch',
        data: batch,
        transactions: batchTransactions,
        journey: [
          {
            step: 'Farm Creation',
            stakeholder: batch.farmerName,
            location: batch.location,
            date: batch.createdAt,
            icon: User,
            status: 'completed'
          },
          {
            step: 'FPO Approval',
            stakeholder: 'Odisha Farmers Collective',
            location: 'Bhubaneswar, Odisha',
            date: new Date(batch.createdAt.getTime() + 24 * 60 * 60 * 1000),
            icon: Package,
            status: batch.status === 'approved' || batch.status === 'sold' ? 'completed' : 'pending'
          },
          {
            step: 'Retail Purchase',
            stakeholder: 'Green Mart',
            location: 'Cuttack, Odisha',
            date: batch.status === 'sold' ? new Date(batch.createdAt.getTime() + 2 * 24 * 60 * 60 * 1000) : null,
            icon: Store,
            status: batch.status === 'sold' ? 'completed' : 'pending'
          }
        ]
      });

      toast({
        title: 'Batch Found',
        description: `Successfully traced batch ${batch.id}`,
      });
    } else if (lot) {
      // Trace lot journey
      const lotTransactions = blockchain.filter(tx => tx.data?.lotId === lot.id);

      setTraceResult({
        type: 'lot',
        data: lot,
        transactions: lotTransactions,
        journey: [
          {
            step: 'Lot Creation',
            stakeholder: lot.fpoName,
            location: 'Bhubaneswar, Odisha',
            date: lot.createdAt,
            icon: Package,
            status: 'completed'
          },
          {
            step: 'Retail Purchase',
            stakeholder: lot.retailerName || 'Pending Purchase',
            location: lot.retailerName ? 'Cuttack, Odisha' : 'N/A',
            date: lot.status === 'sold' ? new Date(lot.createdAt.getTime() + 24 * 60 * 60 * 1000) : null,
            icon: Store,
            status: lot.status === 'sold' ? 'completed' : 'pending'
          },
          {
            step: 'Consumer Delivery',
            stakeholder: 'Home Delivery',
            location: 'Your Location',
            date: lot.status === 'sold' ? new Date(lot.createdAt.getTime() + 3 * 24 * 60 * 60 * 1000) : null,
            icon: Truck,
            status: 'pending'
          }
        ]
      });

      toast({
        title: 'Lot Found',
        description: `Successfully traced lot ${lot.id}`,
      });
    } else {
      setTraceResult(null);
      toast({
        title: 'Not Found',
        description: 'No batch or lot found with the provided ID.',
        variant: 'destructive',
      });
    }
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-success';
      case 'pending':
        return 'text-warning';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStepBgColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success/20 border-success';
      case 'pending':
        return 'bg-warning/20 border-warning';
      default:
        return 'bg-muted border-muted';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Consumer Portal
          </h1>
          <p className="text-muted-foreground">
            Trace your agricultural produce from farm to table
          </p>
        </motion.div>

        {/* QR Scanner Section */}
        <Card className="shadow-hero glass-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <QrCode className="w-5 h-5 icon-pulse" />
              <span>Scan Product QR Code</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter Batch ID (e.g., BATCH001) or Lot ID (e.g., LOT001)"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleScanQR} className="gradient-primary text-primary-foreground btn-attractive">
                  <Search className="w-4 h-4 mr-2" />
                  Trace Product
                </Button>
              </div>
              
              <div className="text-center">
                <div className="w-32 h-32 mx-auto border-2 border-dashed border-border rounded-lg flex items-center justify-center bg-muted/50">
                  <QrCode className="w-16 h-16 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Try: BATCH001, BATCH002, or LOT001
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trace Results */}
        {traceResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Product Information */}
            <Card className="shadow-hero glass-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="w-5 h-5" />
                  <span>Product Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold">
                      {traceResult.type === 'batch' ? traceResult.data.cropName : `Mixed Lot (${traceResult.data.batches.length} varieties)`}
                    </h3>
                    
                    {traceResult.type === 'batch' ? (
                      <div className="space-y-2">
                        <p><strong>Batch ID:</strong> {traceResult.data.id}</p>
                        <p><strong>Quantity:</strong> {traceResult.data.quantity}kg</p>
                        <p><strong>Price:</strong> ₹{traceResult.data.expectedPrice}/kg</p>
                        <p><strong>Farmer:</strong> {traceResult.data.farmerName}</p>
                        <p className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          <strong>Origin:</strong> {traceResult.data.location}
                        </p>
                        <p className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          <strong>Harvested:</strong> {traceResult.data.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p><strong>Lot ID:</strong> {traceResult.data.id}</p>
                        <p><strong>Total Quantity:</strong> {traceResult.data.totalQuantity}kg</p>
                        <p><strong>Average Price:</strong> ₹{traceResult.data.averagePrice}/kg</p>
                        <p><strong>FPO:</strong> {traceResult.data.fpoName}</p>
                        <p className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          <strong>Created:</strong> {traceResult.data.createdAt.toLocaleDateString()}
                        </p>
                        
                        <div className="mt-4">
                          <h4 className="font-semibold mb-2">Included Crops:</h4>
                          <div className="space-y-1">
                            {traceResult.data.batches.map((batch: any) => (
                              <div key={batch.id} className="text-sm bg-muted/50 p-2 rounded">
                                {batch.cropName} - {batch.quantity}kg from {batch.farmerName}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-center">
                    {traceResult.data.qrCode && (
                      <div>
                        <img src={traceResult.data.qrCode} alt="QR Code" className="w-40 h-40 mx-auto border" />
                        <p className="text-sm text-muted-foreground mt-2">Product QR Code</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Supply Chain Journey */}
            <Card className="shadow-hero glass-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Truck className="w-5 h-5" />
                  <span>Supply Chain Journey</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {traceResult.journey.map((step: any, index: number) => {
                    const Icon = step.icon;
                    return (
                      <div key={index} className="flex items-start space-x-4">
                        <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${getStepBgColor(step.status)}`}>
                          <Icon className={`w-6 h-6 ${getStepColor(step.status)}`} />
                        </div>
                        
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">{step.step}</h4>
                            <Badge 
                              variant={step.status === 'completed' ? 'default' : 'secondary'}
                              className={step.status === 'completed' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'}
                            >
                              {step.status}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground">
                            <strong>Stakeholder:</strong> {step.stakeholder}
                          </p>
                          
                          {step.location !== 'N/A' && (
                            <p className="text-sm text-muted-foreground flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {step.location}
                            </p>
                          )}
                          
                          {step.date && (
                            <p className="text-sm text-muted-foreground flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {step.date.toLocaleDateString()} at {step.date.toLocaleTimeString()}
                            </p>
                          )}
                        </div>
                        
                        {index < traceResult.journey.length - 1 && (
                          <div className="absolute ml-6 mt-12 w-0.5 h-6 bg-border"></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Blockchain Verification */}
            <Card className="shadow-hero glass-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="w-5 h-5" />
                  <span>Blockchain Verification</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {traceResult.transactions.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">
                      No blockchain transactions found for this product.
                    </p>
                  ) : (
                    traceResult.transactions.map((tx: any) => (
                      <div key={tx.id} className="p-4 border border-border rounded-lg bg-card/50">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold capitalize">{tx.type.replace('_', ' ')}</h4>
                            <p className="text-sm text-muted-foreground">By: {tx.stakeholder}</p>
                            <p className="text-sm text-muted-foreground">
                              {tx.timestamp.toLocaleDateString()} at {tx.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                          <Badge variant="outline" className="font-mono text-xs">
                            {tx.hash.substring(0, 8)}...
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ConsumerDashboard;