
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  UserRound, 
  Users, 
  CalendarDays, 
  Menu, 
  X 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-swimming-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-swimming-300 flex items-center justify-center">
              <span className="wave-text text-swimming-800 text-xl font-bold">S</span>
            </div>
            <span className="text-xl font-bold">SwimCoach</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLinks />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMenu} className="text-white">
              {isOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div 
          className={cn(
            "md:hidden", 
            isOpen ? "block" : "hidden", 
            "py-3"
          )}
        >
          <div className="flex flex-col space-y-4">
            <NavLinks mobile onClick={toggleMenu} />
          </div>
        </div>
      </div>
    </nav>
  );
};

type NavLinksProps = {
  mobile?: boolean;
  onClick?: () => void;
};

const NavLinks = ({ mobile, onClick }: NavLinksProps) => {
  const links = [
    { to: "/", label: "Dashboard", icon: <div className="w-5 h-5" /> },
    { to: "/athletes", label: "Athletes", icon: <UserRound className="w-5 h-5" /> },
    { to: "/coaches", label: "Coaches", icon: <User className="w-5 h-5" /> },
    { to: "/groups", label: "Groups", icon: <Users className="w-5 h-5" /> },
    { to: "/calendar", label: "Calendar", icon: <CalendarDays className="w-5 h-5" /> },
  ];

  return (
    <>
      {links.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          onClick={onClick}
          className={cn(
            "text-white hover:text-swimming-200 transition-colors",
            mobile ? "flex items-center space-x-2 px-2 py-2" : "flex items-center"
          )}
        >
          {link.icon}
          <span>{link.label}</span>
        </Link>
      ))}
    </>
  );
};

export default Navbar;
