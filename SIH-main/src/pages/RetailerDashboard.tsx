import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Package, QrCode, TrendingUp, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useApp } from '@/contexts/AppContext';
import { useLanguage } from '@/contexts/LanguageContext';

const RetailerDashboard: React.FC = () => {
  const { toast } = useToast();
  const { lots, setLots, addTransaction } = useApp();
  const { t } = useLanguage();
  const [purchasedLots, setPurchasedLots] = useState<string[]>([]);

  const availableLots = lots.filter(lot => lot.status === 'available');
  const myPurchasedLots = lots.filter(lot => purchasedLots.includes(lot.id));

  const handleBuyLot = (lotId: string) => {
    // Update lot status
    const updatedLots = lots.map(lot => 
      lot.id === lotId 
        ? { ...lot, status: 'sold' as const, retailerId: 'RETAILER001', retailerName: 'Green Mart' }
        : lot
    );
    setLots(updatedLots);

    // Add to purchased lots
    setPurchasedLots(prev => [...prev, lotId]);

    // Add blockchain transaction
    addTransaction({
      id: `TX_${Date.now()}`,
      hash: `0x${Math.random().toString(16).substr(2, 20)}`,
      type: 'lot_purchased',
      stakeholder: 'Green Mart',
      stakeholderType: 'retailer',
      data: { lotId },
      timestamp: new Date(),
      previousHash: `0x${Math.random().toString(16).substr(2, 20)}`
    });

    toast({
      title: 'Purchase Successful',
      description: `Lot ${lotId} has been purchased successfully.`,
    });
  };

  const getTotalValue = (lots: any[]) => {
    return lots.reduce((sum, lot) => sum + (lot.totalQuantity * lot.averagePrice), 0);
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
            Retailer Dashboard
          </h1>
          <p className="text-muted-foreground">
            Browse and purchase agricultural lots from FPOs
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="shadow-card hover:shadow-elegant transition-shadow glass-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Package className="w-8 h-8 text-primary icon-pulse" />
                <div>
                  <p className="text-2xl font-bold">{availableLots.length}</p>
                  <p className="text-sm text-muted-foreground">Available Lots</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card hover:shadow-elegant transition-shadow glass-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="w-8 h-8 text-success icon-pulse" />
                <div>
                  <p className="text-2xl font-bold">{myPurchasedLots.length}</p>
                  <p className="text-sm text-muted-foreground">Purchased Lots</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-elegant transition-shadow glass-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-8 h-8 text-warning icon-pulse" />
                <div>
                  <p className="text-2xl font-bold">₹{getTotalValue(myPurchasedLots).toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Investment</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-elegant transition-shadow glass-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Package className="w-8 h-8 text-primary icon-pulse" />
                <div>
                  <p className="text-2xl font-bold">
                    {myPurchasedLots.reduce((sum, lot) => sum + lot.totalQuantity, 0)}kg
                  </p>
                  <p className="text-sm text-muted-foreground">Total Quantity</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Available Lots */}
        <Card className="shadow-hero glass-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ShoppingCart className="w-5 h-5 icon-pulse" />
              <span>Available Lots for Purchase</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableLots.length === 0 ? (
                <div className="col-span-full text-center text-muted-foreground py-8">
                  No lots available for purchase at the moment
                </div>
              ) : (
                availableLots.map((lot) => (
                  <motion.div
                    key={lot.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                    className="border border-border rounded-lg p-4 bg-card/50 hover:bg-card/80 transition-colors"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">{lot.id}</h3>
                        <Badge variant="secondary" className="bg-success/20 text-success">
                          Available
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <p><strong>FPO:</strong> {lot.fpoName}</p>
                        <p><strong>Total Quantity:</strong> {lot.totalQuantity}kg</p>
                        <p><strong>Average Price:</strong> ₹{lot.averagePrice}/kg</p>
                        <p><strong>Total Value:</strong> ₹{(lot.totalQuantity * lot.averagePrice).toLocaleString()}</p>
                        <p><strong>Batches:</strong> {lot.batches.length}</p>
                      </div>

                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="flex-1 btn-attractive">
                              <Eye className="w-4 h-4 mr-1" />
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl glass-card">
                            <DialogHeader>
                              <DialogTitle>Lot Details - {lot.id}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p><strong>FPO:</strong> {lot.fpoName}</p>
                                  <p><strong>Total Quantity:</strong> {lot.totalQuantity}kg</p>
                                  <p><strong>Average Price:</strong> ₹{lot.averagePrice}/kg</p>
                                </div>
                                <div className="text-center">
                                  {lot.qrCode && (
                                    <img src={lot.qrCode} alt="QR Code" className="w-32 h-32 mx-auto border" />
                                  )}
                                  <p className="text-sm text-muted-foreground mt-2">Lot QR Code</p>
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="font-semibold mb-2">Included Batches:</h4>
                                <div className="space-y-2">
                                  {lot.batches.map((batch) => (
                                    <div key={batch.id} className="p-2 border border-border rounded">
                                      <p><strong>{batch.cropName}</strong> - {batch.quantity}kg</p>
                                      <p className="text-sm text-muted-foreground">
                                        Farmer: {batch.farmerName} | Location: {batch.location}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Button
                          onClick={() => handleBuyLot(lot.id)}
                          className="flex-1 gradient-primary text-primary-foreground btn-attractive"
                          size="sm"
                        >
                          <ShoppingCart className="w-4 h-4 mr-1" />
                          Buy Lot
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* My Purchased Lots */}
        <Card className="shadow-hero glass-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="w-5 h-5 icon-pulse" />
              <span>My Purchased Lots</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myPurchasedLots.length === 0 ? (
                <div className="col-span-full text-center text-muted-foreground py-8">
                  You haven't purchased any lots yet
                </div>
              ) : (
                myPurchasedLots.map((lot) => (
                  <motion.div
                    key={lot.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="border border-border rounded-lg p-4 bg-card/50"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">{lot.id}</h3>
                        <Badge className="bg-primary/20 text-primary">
                          Purchased
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <p><strong>FPO:</strong> {lot.fpoName}</p>
                        <p><strong>Quantity:</strong> {lot.totalQuantity}kg</p>
                        <p><strong>Price Paid:</strong> ₹{(lot.totalQuantity * lot.averagePrice).toLocaleString()}</p>
                      </div>

                      <div className="text-center">
                        {lot.qrCode && (
                          <div>
                            <img src={lot.qrCode} alt="QR Code" className="w-24 h-24 mx-auto border" />
                            <p className="text-xs text-muted-foreground mt-1">Lot QR Code</p>
                          </div>
                        )}
                      </div>
                    </div>
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

export default RetailerDashboard;