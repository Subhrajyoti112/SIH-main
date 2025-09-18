import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, PieChart, TrendingUp, Users, Package, DollarSign, Eye, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useApp } from '@/contexts/AppContext';
import { useLanguage } from '@/contexts/LanguageContext';

const GovernmentDashboard: React.FC = () => {
  const { batches, lots, blockchain } = useApp();
  const { t } = useLanguage();

  // Calculate analytics data
  const totalCrops = batches.length;
  const totalFarmers = new Set(batches.map(batch => batch.farmerId)).size;
  const averagePrice = Math.round(batches.reduce((sum, batch) => sum + batch.expectedPrice, 0) / batches.length) || 0;
  const totalValue = lots.reduce((sum, lot) => sum + (lot.totalQuantity * lot.averagePrice), 0);
  
  // MSP data (dummy)
  const mspData = [
    { crop: 'Rice', msp: 20, market: 25, difference: 5 },
    { crop: 'Wheat', msp: 25, market: 30, difference: 5 },
    { crop: 'Cotton', msp: 55, market: 50, difference: -5 },
  ];

  // Crop distribution
  const cropDistribution = batches.reduce((acc, batch) => {
    acc[batch.cropName] = (acc[batch.cropName] || 0) + batch.quantity;
    return acc;
  }, {} as Record<string, number>);

  const pieChartData = Object.entries(cropDistribution).map(([crop, quantity]) => ({
    name: crop,
    value: quantity
  }));

  // Monthly trend data (dummy)
  const monthlyData = [
    { month: 'Jan', batches: 15, value: 45000 },
    { month: 'Feb', batches: 20, value: 60000 },
    { month: 'Mar', batches: 25, value: 75000 },
    { month: 'Apr', batches: 30, value: 90000 },
    { month: 'May', batches: 35, value: 105000 },
    { month: 'Jun', batches: 28, value: 84000 },
  ];

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

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
            Government Analytics Dashboard
          </h1>
          <p className="text-muted-foreground">
            Monitor agricultural supply chain performance and farmer welfare
          </p>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-card hover:shadow-elegant transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Package className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{totalCrops}</p>
                  <p className="text-sm text-muted-foreground">Total Crops Listed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card hover:shadow-elegant transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="w-8 h-8 text-success" />
                <div>
                  <p className="text-2xl font-bold">{totalFarmers}</p>
                  <p className="text-sm text-muted-foreground">Active Farmers</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-elegant transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-8 h-8 text-warning" />
                <div>
                  <p className="text-2xl font-bold">₹{averagePrice}</p>
                  <p className="text-sm text-muted-foreground">Average Price/Kg</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-elegant transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">₹{Math.round(totalValue / 1000)}K</p>
                  <p className="text-sm text-muted-foreground">Market Value</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Crop Distribution */}
          <Card className="shadow-hero">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="w-5 h-5" />
                <span>Crop Distribution</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* MSP vs Market Price */}
          <Card className="shadow-hero">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>MSP vs Market Price Comparison</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mspData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="crop" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="msp" fill="hsl(var(--primary))" name="MSP (₹/kg)" />
                  <Bar dataKey="market" fill="hsl(var(--secondary))" name="Market Price (₹/kg)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Trends */}
        <Card className="shadow-hero">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Monthly Trading Trends</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Bar yAxisId="left" dataKey="batches" fill="hsl(var(--primary))" name="Batches Created" />
                <Line yAxisId="right" type="monotone" dataKey="value" stroke="hsl(var(--secondary))" strokeWidth={2} name="Market Value (₹)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Blockchain Transactions Overview */}
        <Card className="shadow-hero">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Package className="w-5 h-5" />
                <span>Recent Blockchain Transactions</span>
              </div>
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                View All Transactions
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {blockchain.slice(-10).reverse().map((transaction) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-4 border border-border rounded-lg bg-card/50"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <Badge 
                        variant="outline" 
                        className={
                          transaction.type.includes('created') ? 'bg-primary/20 text-primary border-primary' :
                          transaction.type.includes('approved') ? 'bg-success/20 text-success border-success' :
                          transaction.type.includes('purchased') ? 'bg-warning/20 text-warning border-warning' :
                          'bg-muted/20 text-muted-foreground border-muted'
                        }
                      >
                        {transaction.type.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <div>
                        <p className="font-medium">{transaction.stakeholder}</p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {transaction.stakeholderType} Action
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm font-mono text-muted-foreground">
                      {transaction.hash.substring(0, 8)}...
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {transaction.timestamp.toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Farmer Welfare Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">Price Realization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-3xl font-bold text-success">94%</p>
                <p className="text-sm text-muted-foreground">Above MSP Sales</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">Farmer Satisfaction</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">4.2/5</p>
                <p className="text-sm text-muted-foreground">Platform Rating</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">Transaction Speed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-3xl font-bold text-warning">2.3</p>
                <p className="text-sm text-muted-foreground">Days Average</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GovernmentDashboard;