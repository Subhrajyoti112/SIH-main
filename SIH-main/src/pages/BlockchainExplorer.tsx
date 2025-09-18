import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Hash, Clock, User, ChevronRight, Filter, Activity } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useApp } from '@/contexts/AppContext';
import { BlockchainTransaction } from '@/types';

const BlockchainExplorer: React.FC = () => {
  const { blockchain } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedTransaction, setSelectedTransaction] = useState<BlockchainTransaction | null>(null);

  const filteredTransactions = blockchain
    .filter(tx => {
      const matchesSearch = searchTerm === '' || 
        tx.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.stakeholder.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterType === 'all' || tx.type === filterType;
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  const getTransactionTypeLabel = (type: BlockchainTransaction['type']) => {
    switch (type) {
      case 'batch_created': return 'Batch Created';
      case 'batch_approved': return 'Batch Approved';
      case 'batch_rejected': return 'Batch Rejected';
      case 'lot_created': return 'Lot Created';
      case 'lot_purchased': return 'Lot Purchased';
      case 'lot_delivered': return 'Lot Delivered';
      default: return type;
    }
  };

  const getTransactionColor = (type: BlockchainTransaction['type']) => {
    switch (type) {
      case 'batch_created': return 'bg-blue-100 text-blue-800';
      case 'batch_approved': return 'bg-green-100 text-green-800';
      case 'batch_rejected': return 'bg-red-100 text-red-800';
      case 'lot_created': return 'bg-purple-100 text-purple-800';
      case 'lot_purchased': return 'bg-orange-100 text-orange-800';
      case 'lot_delivered': return 'bg-cyan-100 text-cyan-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'farmer': return 'text-green-600';
      case 'fpo': return 'text-blue-600';
      case 'retailer': return 'text-purple-600';
      case 'consumer': return 'text-orange-600';
      case 'government': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Blockchain Explorer</h1>
          <p className="text-muted-foreground">
            Explore all transactions in the agricultural supply chain blockchain
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Transactions</p>
                  <p className="text-2xl font-bold">{blockchain.length}</p>
                </div>
                <Hash className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Active Farmers</p>
                  <p className="text-2xl font-bold text-green-600">
                    {new Set(blockchain.filter(tx => tx.stakeholderType === 'farmer').map(tx => tx.stakeholder)).size}
                  </p>
                </div>
                <User className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">FPO Approvals</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {blockchain.filter(tx => tx.type === 'batch_approved').length}
                  </p>
                </div>
                <Activity className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Recent Activity</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {blockchain.filter(tx => 
                      (Date.now() - tx.timestamp.getTime()) < (24 * 60 * 60 * 1000)
                    ).length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="shadow-card mb-8">
          <CardHeader>
            <CardTitle>Search Transactions</CardTitle>
            <CardDescription>
              Search by transaction hash, stakeholder name, or transaction ID
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions, hashes, or stakeholders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 transition-smooth"
                />
              </div>
              <div className="md:w-48">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="transition-smooth">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border border-border">
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="batch_created">Batch Created</SelectItem>
                    <SelectItem value="batch_approved">Batch Approved</SelectItem>
                    <SelectItem value="batch_rejected">Batch Rejected</SelectItem>
                    <SelectItem value="lot_created">Lot Created</SelectItem>
                    <SelectItem value="lot_purchased">Lot Purchased</SelectItem>
                    <SelectItem value="lot_delivered">Lot Delivered</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Blockchain Visualization */}
        <Card className="shadow-card mb-8">
          <CardHeader>
            <CardTitle>Blockchain Visualization</CardTitle>
            <CardDescription>
              Visual representation of the blockchain structure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="flex space-x-4 overflow-x-auto pb-6">
                {blockchain.slice(-10).map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex-shrink-0 relative"
                  >
                    {/* Block */}
                    <div className="w-32 h-24 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-mono text-xs blockchain-block cursor-pointer hover:scale-105 transition-transform"
                         onClick={() => setSelectedTransaction(transaction)}>
                      <div className="text-center">
                        <div className="font-semibold">Block</div>
                        <div>#{index + 1}</div>
                      </div>
                    </div>
                    
                    {/* Connection Line */}
                    {index < blockchain.slice(-10).length - 1 && (
                      <div className="absolute top-1/2 -right-4 w-4 h-0.5 bg-primary transform -translate-y-1/2" />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions List */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>
              Complete list of blockchain transactions ({filteredTransactions.length} results)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-8">
                  <Hash className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No transactions found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search terms or filters
                  </p>
                </div>
              ) : (
                filteredTransactions.map((transaction) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border rounded-lg p-4 hover:shadow-md transition-all duration-300 cursor-pointer"
                    onClick={() => setSelectedTransaction(transaction)}
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Badge className={getTransactionColor(transaction.type)}>
                            {getTransactionTypeLabel(transaction.type)}
                          </Badge>
                          <span className={`text-sm font-medium ${getRoleColor(transaction.stakeholderType)}`}>
                            {transaction.stakeholder} ({transaction.stakeholderType.toUpperCase()})
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium">Hash:</span> {transaction.hash.slice(0, 16)}...
                          </div>
                          <div>
                            <span className="font-medium">ID:</span> {transaction.id}
                          </div>
                          <div>
                            <span className="font-medium">Timestamp:</span> {transaction.timestamp.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Transaction Details Dialog */}
        {selectedTransaction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedTransaction(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-background rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto glass-card"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Transaction Details</h2>
                <Button variant="ghost" onClick={() => setSelectedTransaction(null)}>×</Button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Transaction ID</label>
                    <p className="font-mono text-sm break-all">{selectedTransaction.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Type</label>
                    <Badge className={getTransactionColor(selectedTransaction.type)}>
                      {getTransactionTypeLabel(selectedTransaction.type)}
                    </Badge>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Hash</label>
                  <p className="font-mono text-sm break-all bg-muted p-2 rounded">{selectedTransaction.hash}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Stakeholder</label>
                    <p className="font-semibold">{selectedTransaction.stakeholder}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Role</label>
                    <p className={`font-semibold capitalize ${getRoleColor(selectedTransaction.stakeholderType)}`}>
                      {selectedTransaction.stakeholderType}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Timestamp</label>
                  <p>{selectedTransaction.timestamp.toLocaleString()}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Transaction Data</label>
                  <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
                    {JSON.stringify(selectedTransaction.data, null, 2)}
                  </pre>
                </div>

                {selectedTransaction.previousHash && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Previous Hash</label>
                    <p className="font-mono text-sm break-all bg-muted p-2 rounded">
                      {selectedTransaction.previousHash}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default BlockchainExplorer;