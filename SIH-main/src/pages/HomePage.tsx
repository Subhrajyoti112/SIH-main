import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Shield, Users, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Hero from '@/components/Hero';
import { useLanguage } from '@/contexts/LanguageContext';

const HomePage: React.FC = () => {
  const { t } = useLanguage();

  const stakeholders = [
    {
      title: 'Farmers',
      description: 'Add produce to blockchain, generate QR codes, track batches',
      icon: Leaf,
      path: '/farmer',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'FPO Organizations',
      description: 'Approve farmer submissions, create lots, manage quality',
      icon: Shield,
      path: '/fpo',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Retailers',
      description: 'Purchase lots, track inventory, access supplier information',
      icon: Users,
      path: '/retailer',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Government',
      description: 'Monitor trends, analyze market data, ensure compliance',
      icon: TrendingUp,
      path: '/government',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  const benefits = [
    {
      title: 'Complete Traceability',
      description: 'Track agricultural produce from farm to consumer with immutable blockchain records.',
    },
    {
      title: 'Quality Assurance',
      description: 'Multi-level approval system ensures only quality produce reaches the market.',
    },
    {
      title: 'Fair Pricing',
      description: 'Transparent pricing mechanism protects both farmers and consumers.',
    },
    {
      title: 'Reduced Fraud',
      description: 'Blockchain technology eliminates counterfeit products and ensures authenticity.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Stakeholders Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Choose Your Role
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Access your personalized dashboard based on your role in the agricultural supply chain
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stakeholders.map((stakeholder, index) => (
              <motion.div
                key={stakeholder.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-border/50 hover:border-primary/50 card-attractive">
                  <Link to={stakeholder.path}>
                    <CardHeader className="text-center pb-4">
                      <div className={`w-16 h-16 mx-auto rounded-full ${stakeholder.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <stakeholder.icon className={`w-8 h-8 ${stakeholder.color}`} />
                      </div>
                      <CardTitle className="group-hover:text-primary transition-colors">
                        {stakeholder.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-center">
                        {stakeholder.description}
                      </CardDescription>
                      <div className="flex justify-center mt-4">
                        <Button variant="ghost" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          Access Dashboard
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Benefits of Blockchain Transparency
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover how our platform revolutionizes agricultural supply chain management
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-start space-x-4 p-6 rounded-lg bg-card shadow-card"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-glow text-primary-foreground">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Agriculture?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of farmers, FPOs, and retailers who trust our blockchain platform
              for transparent and secure agricultural supply chain management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="bg-background text-foreground hover:bg-background/90 btn-attractive">
                <Link to="/signup">
                  Start Your Journey
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <Link to="/blockchain">
                  Explore Blockchain
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;