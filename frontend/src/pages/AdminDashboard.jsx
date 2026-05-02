import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, LogOut, ShieldAlert, Phone, FileText } from 'lucide-react';
import axios from 'axios';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('portfolio');
  const [file, setFile] = useState(null);
  
  // Vault State
  const [contacts, setContacts] = useState('');
  const [personalNotes, setPersonalNotes] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
    }
    // Fetch data here later
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please select a file');
    
    const formData = new FormData();
    formData.append('resume', file);
    
    // axios.post('/api/upload/resume', formData, ...)
    alert('Resume uploaded successfully (Mock)');
  };

  const handleSaveVault = (e) => {
    e.preventDefault();
    // axios.post('/api/vault/contacts', { contacts, personalNotes }, ...)
    alert('Vault data saved securely (Mock)');
  };

  return (
    <div className="min-h-screen bg-background pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button onClick={handleLogout} className="flex items-center gap-2 text-muted-foreground hover:text-destructive transition-colors">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>

        <div className="flex gap-4 mb-8 border-b border-white/10 pb-4">
          <button 
            onClick={() => setActiveTab('portfolio')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'portfolio' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-white/5'}`}
          >
            <span className="flex items-center gap-2"><FileText className="w-4 h-4"/> Portfolio Setup</span>
          </button>
          <button 
            onClick={() => setActiveTab('vault')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'vault' ? 'bg-destructive text-destructive-foreground' : 'text-muted-foreground hover:bg-white/5'}`}
          >
            <span className="flex items-center gap-2"><ShieldAlert className="w-4 h-4"/> Personal Vault</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {activeTab === 'portfolio' && (
            <>
              {/* Resume Upload */}
              <div className="md:col-span-1 bg-card border border-white/10 rounded-2xl p-6 h-fit">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Upload className="w-5 h-5 text-primary" /> Upload Resume (PDF)</h3>
                <form onSubmit={handleFileUpload} className="space-y-4">
                  <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                    <input 
                      type="file" 
                      accept=".pdf" 
                      onChange={(e) => setFile(e.target.files[0])}
                      className="hidden" 
                      id="resume-upload" 
                    />
                    <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center">
                      <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground">{file ? file.name : "Click to select PDF"}</span>
                    </label>
                  </div>
                  <button type="submit" className="w-full bg-primary text-primary-foreground font-medium py-2 rounded-lg hover:bg-primary/90 transition-colors">
                    Upload File
                  </button>
                </form>
              </div>

              {/* Portfolio Details Editor - Mock */}
              <div className="md:col-span-2 bg-card border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-4">Edit Portfolio Details</h3>
                <p className="text-muted-foreground mb-4">Update your projects, experience, and skills here. (Form implementation pending API connection)</p>
                <div className="space-y-4 opacity-50 pointer-events-none">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">Professional Summary</label>
                    <textarea className="w-full bg-background border border-white/10 rounded p-3 h-32"></textarea>
                  </div>
                  <button className="bg-primary text-primary-foreground px-4 py-2 rounded">Save Details</button>
                </div>
              </div>
            </>
          )}

          {activeTab === 'vault' && (
            <div className="md:col-span-3 bg-card border border-destructive/30 rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-destructive/10 rounded-full blur-3xl -z-10"></div>
              <h3 className="text-2xl font-bold mb-2 flex items-center gap-2 text-destructive">
                <ShieldAlert className="w-6 h-6" /> Secure Emergency Vault
              </h3>
              <p className="text-muted-foreground mb-8 border-b border-white/10 pb-4">
                This data is strictly private and only accessible via this admin panel. Use this to store your friends' numbers and emergency details.
              </p>

              <form onSubmit={handleSaveVault} className="space-y-6 max-w-2xl">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4" /> Emergency Contact Numbers
                  </label>
                  <textarea 
                    value={contacts}
                    onChange={(e) => setContacts(e.target.value)}
                    className="w-full bg-background border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:border-destructive transition-colors h-32"
                    placeholder="e.g. Rahul: +91-9876543210&#10;Mom: +91-9988776655"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Personal Notes / Identification Details
                  </label>
                  <textarea 
                    value={personalNotes}
                    onChange={(e) => setPersonalNotes(e.target.value)}
                    className="w-full bg-background border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:border-destructive transition-colors h-32"
                    placeholder="Store blood group, medical conditions, or other private notes..."
                  ></textarea>
                </div>

                <button type="submit" className="bg-destructive text-destructive-foreground font-bold px-8 py-3 rounded-lg hover:bg-destructive/90 transition-colors">
                  Encrypt & Save to Vault
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
