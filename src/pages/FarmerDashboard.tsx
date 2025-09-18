import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Package, QrCode, Eye, Clock, CheckCircle, XCircle, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useApp } from '@/contexts/AppContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Batch, BlockchainTransaction } from '@/types';
import { generateQRCode, generateBatchId, generateTransactionHash } from '@/utils/qrCodeGenerator';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';

const FarmerDashboard: React.FC = () => {
  const { toast } = useToast();
  const { currentUser, batches, addBatch, addTransaction } = useApp();
  const { t } = useLanguage();
  
  const [isAddingProduce, setIsAddingProduce] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [formData, setFormData] = useState({
    cropName: '',
    quantity: '',
    location: '',
    expectedPrice: '',
  });

  const farmerBatches = batches.filter(batch => batch.farmerId === currentUser?.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) return;

    if (!formData.cropName || !formData.quantity || !formData.location || !formData.expectedPrice) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    setIsAddingProduce(true);

    try {
      const batchId = generateBatchId();
      const qrCode = await generateQRCode(batchId);

      const newBatch: Batch = {
        id: batchId,
        cropName: formData.cropName,
        quantity: Number(formData.quantity),
        location: formData.location,
        expectedPrice: Number(formData.expectedPrice),
        farmerId: currentUser.id,
        farmerName: currentUser.name,
        status: 'pending',
        createdAt: new Date(),
        qrCode,
      };

      // Add batch to system
      addBatch(newBatch);

      // Add blockchain transaction
      const transaction: BlockchainTransaction = {
        id: `TX${Date.now()}`,
        hash: generateTransactionHash(),
        type: 'batch_created',
        stakeholder: currentUser.name,
        stakeholderType: 'farmer',
        data: { batchId, cropName: formData.cropName, quantity: formData.quantity },
        timestamp: new Date(),
      };

      addTransaction(transaction);

      toast({
        title: 'Produce Added Successfully!',
        description: `Batch ${batchId} has been created and added to the blockchain.`,
      });

      // Reset form
      setFormData({ cropName: '', quantity: '', location: '', expectedPrice: '' });
      setIsAddingProduce(false);
    } catch (error) {
      console.error('Error adding produce:', error);
      toast({
        title: 'Error',
        description: 'Failed to add produce. Please try again.',
        variant: 'destructive',
      });
      setIsAddingProduce(false);
    }
  };

  const getStatusIcon = (status: Batch['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'sold': return <Package className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: Batch['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'sold': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to access your dashboard</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Farmer Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, <span className="font-semibold">{currentUser.name}</span>
            </p>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gradient-primary text-primary-foreground shadow-card btn-attractive">
                <Plus className="w-4 h-4 mr-2" />
                {t('add_produce')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] glass-card">
              <DialogHeader>
                <DialogTitle>Add New Produce</DialogTitle>
                <DialogDescription>
                  Add your agricultural produce to the blockchain for transparent tracking.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cropName">{t('crop_name')}</Label>
                    <Select
                      value={formData.cropName}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, cropName: value }))}
                    >
                      <SelectTrigger id="cropName" className="transition-smooth">
                        <SelectValue placeholder="e.g., Rice, Wheat, Maize" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Rice">Rice</SelectItem>
                        <SelectItem value="Wheat">Wheat</SelectItem>
                        <SelectItem value="Maize">Maize</SelectItem>
                        <SelectItem value="Barley">Barley</SelectItem>
                        <SelectItem value="Bajra (Pearl Millet)">Bajra (Pearl Millet)</SelectItem>
                        <SelectItem value="Jowar (Sorghum)">Jowar (Sorghum)</SelectItem>
                        <SelectItem value="Ragi (Finger Millet)">Ragi (Finger Millet)</SelectItem>
                        <SelectItem value="Pulses">Pulses</SelectItem>
                        <SelectItem value="Gram">Gram</SelectItem>
                        <SelectItem value="Arhar (Tur)">Arhar (Tur)</SelectItem>
                        <SelectItem value="Moong">Moong</SelectItem>
                        <SelectItem value="Urad">Urad</SelectItem>
                        <SelectItem value="Masoor">Masoor</SelectItem>
                        <SelectItem value="Sugarcane">Sugarcane</SelectItem>
                        <SelectItem value="Cotton">Cotton</SelectItem>
                        <SelectItem value="Jute">Jute</SelectItem>
                        <SelectItem value="Groundnut">Groundnut</SelectItem>
                        <SelectItem value="Soybean">Soybean</SelectItem>
                        <SelectItem value="Mustard">Mustard</SelectItem>
                        <SelectItem value="Sunflower">Sunflower</SelectItem>
                        <SelectItem value="Sesame">Sesame</SelectItem>
                        <SelectItem value="Castor">Castor</SelectItem>
                        <SelectItem value="Tea">Tea</SelectItem>
                        <SelectItem value="Coffee">Coffee</SelectItem>
                        <SelectItem value="Rubber">Rubber</SelectItem>
                        <SelectItem value="Coconut">Coconut</SelectItem>
                        <SelectItem value="Banana">Banana</SelectItem>
                        <SelectItem value="Mango">Mango</SelectItem>
                        <SelectItem value="Apple">Apple</SelectItem>
                        <SelectItem value="Grapes">Grapes</SelectItem>
                        <SelectItem value="Orange">Orange</SelectItem>
                        <SelectItem value="Pomegranate">Pomegranate</SelectItem>
                        <SelectItem value="Potato">Potato</SelectItem>
                        <SelectItem value="Onion">Onion</SelectItem>
                        <SelectItem value="Tomato">Tomato</SelectItem>
                        <SelectItem value="Brinjal">Brinjal</SelectItem>
                        <SelectItem value="Cabbage">Cabbage</SelectItem>
                        <SelectItem value="Cauliflower">Cauliflower</SelectItem>
                        <SelectItem value="Carrot">Carrot</SelectItem>
                        <SelectItem value="Peas">Peas</SelectItem>
                        <SelectItem value="Chillies">Chillies</SelectItem>
                        <SelectItem value="Garlic">Garlic</SelectItem>
                        <SelectItem value="Ginger">Ginger</SelectItem>
                        <SelectItem value="Turmeric">Turmeric</SelectItem>
                        <SelectItem value="Spinach">Spinach</SelectItem>
                        <SelectItem value="Okra (Lady Finger)">Okra (Lady Finger)</SelectItem>
                        <SelectItem value="Coriander">Coriander</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="quantity">{t('quantity')}</Label>
                    <div className="relative">
                      <Input
                        id="quantity"
                        type="number"
                        placeholder="100"
                        value={formData.quantity}
                        onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                        className="transition-smooth pr-12"
                      />
                      <span className="absolute inset-y-0 right-3 flex items-center text-muted-foreground text-sm pointer-events-none">kg</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">{t('location')}</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Cuttack, Odisha"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="transition-smooth"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expectedPrice">{t('expected_price')}</Label>
                  <div className="relative">
                    <Input
                      id="expectedPrice"
                      type="number"
                      step="0.01"
                      placeholder="25.00"
                      value={formData.expectedPrice}
                      onChange={(e) => setFormData(prev => ({ ...prev, expectedPrice: e.target.value }))}
                      className="transition-smooth pr-16"
                    />
                    <span className="absolute inset-y-0 right-3 flex items-center text-muted-foreground text-sm pointer-events-none">per kg</span>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button
                    type="submit"
                    className="flex-1 gradient-primary text-primary-foreground btn-attractive"
                    disabled={isAddingProduce}
                  >
                    {isAddingProduce ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full mr-2"
                      />
                    ) : (
                      <Upload className="w-4 h-4 mr-2" />
                    )}
                    {isAddingProduce ? 'Adding...' : 'Add Produce'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card card-attractive">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Batches</p>
                  <p className="text-2xl font-bold">{farmerBatches.length}</p>
                </div>
                <Package className="w-8 h-8 text-primary icon-pulse" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card card-attractive">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {farmerBatches.filter(b => b.status === 'pending').length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card card-attractive">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Approved</p>
                  <p className="text-2xl font-bold text-green-600">
                    {farmerBatches.filter(b => b.status === 'approved').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card card-attractive">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Sold</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {farmerBatches.filter(b => b.status === 'sold').length}
                  </p>
                </div>
                <Package className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Batches List */}
        <Card className="shadow-card card-attractive">
          <CardHeader>
            <CardTitle>My Produce Batches</CardTitle>
            <CardDescription>
              Track the status of your submitted agricultural produce
            </CardDescription>
          </CardHeader>
          <CardContent>
            {farmerBatches.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No produce added yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start by adding your first agricultural produce to the blockchain
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {farmerBatches.map((batch) => (
                  <motion.div
                    key={batch.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border rounded-lg p-4 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-lg">{batch.cropName}</h3>
                          <Badge className={getStatusColor(batch.status)}>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(batch.status)}
                              <span className="capitalize">{batch.status}</span>
                            </div>
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium">Batch ID:</span> {batch.id}
                          </div>
                          <div>
                            <span className="font-medium">Quantity:</span> {batch.quantity} kg
                          </div>
                          <div>
                            <span className="font-medium">Price:</span> ₹{batch.expectedPrice}/kg
                          </div>
                          <div>
                            <span className="font-medium">Date:</span> {batch.createdAt.toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedBatch(batch)}
                        >
                          <QrCode className="w-4 h-4 mr-2" />
                          QR Code
                        </Button>
                        <Button variant="outline" size="sm" className="btn-attractive">
                          <Eye className="w-4 h-4 mr-2" />
                          Details
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* QR Code Dialog */}
        {selectedBatch && (
          <Dialog open={!!selectedBatch} onOpenChange={() => setSelectedBatch(null)}>
            <DialogContent className="sm:max-w-[400px] glass-card">
              <DialogHeader>
                <DialogTitle>QR Code - {selectedBatch.id}</DialogTitle>
                <DialogDescription>
                  Scan this QR code to track the produce journey
                </DialogDescription>
              </DialogHeader>
              <div className="text-center py-6">
                <div className="inline-block p-4 bg-white rounded-lg shadow-md">
                  <img
                    src={selectedBatch.qrCode}
                    alt={`QR Code for ${selectedBatch.id}`}
                    className="w-48 h-48 mx-auto"
                  />
                </div>
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">{selectedBatch.cropName}</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedBatch.quantity} kg • ₹{selectedBatch.expectedPrice}/kg
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedBatch.location}
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </motion.div>
    </div>
  );
};

export default FarmerDashboard;