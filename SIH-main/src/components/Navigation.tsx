import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sprout, Languages, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useLanguage } from '@/contexts/LanguageContext';
import { useApp } from '@/contexts/AppContext';
import { Language } from '@/types';

const Navigation: React.FC = () => {
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const { currentUser, setCurrentUser } = useApp();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const navItems = [
    { path: '/', label: t('home') },
    { path: '/farmer', label: t('farmer') },
    { path: '/fpo', label: t('fpo') },
    { path: '/retailer', label: t('retailer') },
    { path: '/consumer', label: t('consumer') },
    { path: '/government', label: t('government') },
    { path: '/blockchain', label: t('blockchain_explorer') },
  ];

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'od', name: 'ଓଡିଆ', flag: '🇮🇳' },
  ];

  const handleLogout = () => {
    setCurrentUser(null);
    setMobileOpen(false);
  };

  const NavLink: React.FC<{ item: typeof navItems[0]; mobile?: boolean }> = ({ item, mobile }) => (
    <Link
      to={item.path}
      className={`relative px-3 py-2 text-sm font-medium transition-smooth ${
        location.pathname === item.path
          ? 'text-primary'
          : 'text-muted-foreground hover:text-foreground'
      } ${mobile ? 'block w-full text-left' : ''}`}
      onClick={() => mobile && setMobileOpen(false)}
    >
      {item.label}
      {location.pathname === item.path && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
          layoutId="activeNav"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="rounded-lg bg-primary p-2">
            <Sprout className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl text-foreground">AgriChain</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-1 items-center justify-center space-x-1">
          {navItems.map((item) => (
            <NavLink key={item.path} item={item} />
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <Languages className="h-4 w-4" />
                <span className="hidden sm:inline">{languages.find(l => l.code === language)?.flag}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover border border-border">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`cursor-pointer ${language === lang.code ? 'bg-accent' : ''}`}
                >
                  <span className="mr-2">{lang.flag}</span>
                  {lang.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">{currentUser.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover border border-border">
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex space-x-2">
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">{t('login')}</Link>
              </Button>
              <Button asChild size="sm" className="gradient-primary text-primary-foreground">
                <Link to="/signup">{t('signup')}</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="flex items-center space-x-2">
                  <Sprout className="h-5 w-5 text-primary" />
                  <span>AgriChain</span>
                </SheetTitle>
                <SheetDescription>
                  Blockchain Supply Chain Transparency
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 flex flex-col space-y-4">
                {navItems.map((item) => (
                  <NavLink key={item.path} item={item} mobile />
                ))}
                <div className="border-t pt-4">
                  {currentUser ? (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">{currentUser.name}</p>
                      <Button onClick={handleLogout} variant="outline" size="sm" className="w-full">
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Button asChild variant="outline" size="sm" className="w-full">
                        <Link to="/login" onClick={() => setMobileOpen(false)}>{t('login')}</Link>
                      </Button>
                      <Button asChild size="sm" className="w-full gradient-primary text-primary-foreground">
                        <Link to="/signup" onClick={() => setMobileOpen(false)}>{t('signup')}</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;