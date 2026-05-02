import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';
import axios from 'axios';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Mock login for now or call backend later
      // const res = await axios.post('http://localhost:5000/api/auth/login', { username, password });
      // localStorage.setItem('adminToken', res.data.token);
      
      // Temporary simple auth
      if(username === 'admin' && password === 'admin123') {
        localStorage.setItem('adminToken', 'mock-token');
        navigate('/admin/dashboard');
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md bg-card border border-white/10 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Admin Portal</h2>
          <p className="text-muted-foreground text-sm mt-2">Secure access for Rama Subramanian</p>
        </div>

        {error && <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded mb-6 text-sm text-center">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-background border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="Enter username"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="Enter password"
                required
              />
            </div>
          </div>
          <button 
            type="submit" 
            className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
