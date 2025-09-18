import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Leaf, User, KeyRound, Mail, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useApp } from '@/contexts/AppContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { User as UserType } from '@/types';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setCurrentUser } = useApp();
  const { t } = useLanguage();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '' as UserType['role'] | '',
    location: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const roles = [
    { value: 'farmer', label: t('farmer'), description: 'Add produce, generate QR codes' },
    { value: 'fpo', label: t('fpo'), description: 'Manage farmer approvals, create lots' },
    { value: 'retailer', label: t('retailer'), description: 'Purchase lots, track inventory' },
    { value: 'consumer', label: t('consumer'), description: 'Scan QR codes, trace produce' },
    { value: 'government', label: t('government'), description: 'Monitor analytics, ensure compliance' },
  ] as const;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    // Simulate signup delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Create new user
    const user: UserType = {
      id: `${formData.role.toUpperCase()}${Math.floor(Math.random() * 900) + 100}`,
      name: formData.name,
      role: formData.role as UserType['role'],
      location: formData.location || 'Bhubaneswar, Odisha',
    };

    setCurrentUser(user);
    setIsLoading(false);

    toast({
      title: 'Account Created Successfully!',
      description: `Welcome to AgriChain, ${user.name}!`,
    });

    // Redirect to appropriate dashboard
    navigate(`/${formData.role}`);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg"
      >
        <Card className="shadow-hero border-border/50 card-attractive">
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-16 h-16 mx-auto mb-4 bg-primary rounded-full flex items-center justify-center"
            >
              <Leaf className="w-8 h-8 text-primary-foreground" />
            </motion.div>
            <CardTitle className="text-2xl font-bold">Join AgriChain</CardTitle>
            <CardDescription>
              Create your account to start your blockchain journey
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Full Name *</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="transition-smooth focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>Email Address *</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="transition-smooth focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center space-x-2">
                    <KeyRound className="w-4 h-4" />
                    <span>Password *</span>
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="transition-smooth focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="transition-smooth focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Select Your Role *</Label>
                <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                  <SelectTrigger className="transition-smooth focus:ring-2 focus:ring-primary">
                    <SelectValue placeholder="Choose your role in the supply chain" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border border-border">
                    {roles.map((role) => (
                      <SelectItem key={role.value} value={role.value} className="cursor-pointer">
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{role.label}</span>
                          <span className="text-xs text-muted-foreground">{role.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>Location</span>
                </Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="Enter your location (optional)"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="transition-smooth focus:ring-2 focus:ring-primary"
                />
              </div>

              <Button
                type="submit"
                className="w-full gradient-primary text-primary-foreground shadow-card group btn-attractive"
                disabled={isLoading}
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SignupPage;