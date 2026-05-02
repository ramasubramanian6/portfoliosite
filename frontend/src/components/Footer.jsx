import { Terminal } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-background border-t border-white/5 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center space-x-2 mb-4 md:mb-0">
          <Terminal className="w-6 h-6 text-primary" />
          <span className="text-lg font-bold tracking-tighter">Rama Subramanian</span>
        </div>
        <div className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Rama Subramanian. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
