import { Terminal, Heart, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-white/5 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Terminal className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold">Rama<span className="text-blue-500">Dev</span></span>
          </Link>

          <p className="text-slate-500 text-sm flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-red-400 fill-red-400" /> by Rama Subramanian · {new Date().getFullYear()}
          </p>

          <Link
            to="/vault/login"
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-400 transition-colors"
          >
            <Shield className="w-4 h-4" /> Friend Vault
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
