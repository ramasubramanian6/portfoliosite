import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-background/80 backdrop-blur-md border-b border-white/10 py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Terminal className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold tracking-tighter">Rama Subramanian</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <a href="#about" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">About</a>
            <a href="#experience" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Experience</a>
            <a href="#projects" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Projects</a>
            <a href="#contact" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Contact</a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-muted-foreground hover:text-white">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-full left-0 w-full bg-background border-b border-white/10 py-4 px-4 flex flex-col space-y-4 shadow-xl"
        >
          <a href="#about" onClick={() => setIsOpen(false)} className="text-base font-medium text-muted-foreground hover:text-primary">About</a>
          <a href="#experience" onClick={() => setIsOpen(false)} className="text-base font-medium text-muted-foreground hover:text-primary">Experience</a>
          <a href="#projects" onClick={() => setIsOpen(false)} className="text-base font-medium text-muted-foreground hover:text-primary">Projects</a>
          <a href="#contact" onClick={() => setIsOpen(false)} className="text-base font-medium text-muted-foreground hover:text-primary">Contact</a>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
