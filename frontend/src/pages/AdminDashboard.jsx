import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, LogOut, ShieldAlert, Phone, FileText } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('portfolio');
  const [file, setFile] = useState(null);
  const [contacts, setContacts] = useState('');
  const [personalNotes, setPersonalNotes] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please select a file');
    alert('Resume uploaded successfully (Mock)');
  };

  const handleSaveVault = (e) => {
    e.preventDefault();
    alert('Vault data saved securely (Mock)');
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-20 sm:pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors text-sm self-start sm:self-auto"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5" /> Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 sm:gap-4 mb-6 sm:mb-8 border-b border-white/10 pb-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm whitespace-nowrap ${
              activeTab === 'portfolio'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" /> Portfolio Setup
          </button>
          <button
            onClick={() => setActiveTab('vault')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm whitespace-nowrap ${
              activeTab === 'vault'
                ? 'bg-red-600 text-white'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <ShieldAlert className="w-4 h-4" /> Personal Vault
          </button>
        </div>

        {activeTab === 'portfolio' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Resume Upload */}
            <div className="md:col-span-1 bg-slate-900/80 border border-white/10 rounded-2xl p-5 sm:p-6 h-fit">
              <h3 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2 text-white">
                <Upload className="w-5 h-5 text-blue-400" /> Upload Resume (PDF)
              </h3>
              <form onSubmit={handleFileUpload} className="space-y-4">
                <div className="border-2 border-dashed border-white/20 rounded-xl p-5 sm:p-6 text-center hover:border-blue-500/50 transition-colors">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center">
                    <Upload className="w-7 h-7 sm:w-8 sm:h-8 text-slate-500 mb-2" />
                    <span className="text-xs sm:text-sm text-slate-400">
                      {file ? file.name : 'Click to select PDF'}
                    </span>
                  </label>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-xl transition-colors text-sm"
                >
                  Upload File
                </button>
              </form>
            </div>

            {/* Portfolio Editor (mock) */}
            <div className="md:col-span-2 bg-slate-900/80 border border-white/10 rounded-2xl p-5 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold mb-4 text-white">Edit Portfolio Details</h3>
              <p className="text-slate-400 text-sm mb-4">
                Update your projects, experience, and skills here. (Form implementation pending API connection)
              </p>
              <div className="space-y-4 opacity-50 pointer-events-none">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Professional Summary</label>
                  <textarea className="w-full bg-slate-800 border border-white/10 rounded-xl p-3 h-28 sm:h-32 text-white text-sm resize-none" />
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm">Save Details</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'vault' && (
          <div className="bg-slate-900/80 border border-red-500/20 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-red-600/10 rounded-full blur-3xl -z-10" />
            <h3 className="text-xl sm:text-2xl font-bold mb-2 flex items-center gap-2 text-red-400">
              <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6" /> Secure Emergency Vault
            </h3>
            <p className="text-slate-400 text-sm mb-6 sm:mb-8 border-b border-white/10 pb-4">
              This data is strictly private and only accessible via this admin panel. Use this to store your friends' numbers and emergency details.
            </p>

            <form onSubmit={handleSaveVault} className="space-y-5 sm:space-y-6 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4" /> Emergency Contact Numbers
                </label>
                <textarea
                  value={contacts}
                  onChange={(e) => setContacts(e.target.value)}
                  className="w-full bg-slate-800/60 border border-white/10 rounded-xl p-3 sm:p-4 text-white text-sm focus:outline-none focus:border-red-500 transition-colors h-28 sm:h-32 resize-none"
                  placeholder={'e.g. Rahul: +91-9876543210\nMom: +91-9988776655'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Personal Notes / Identification Details
                </label>
                <textarea
                  value={personalNotes}
                  onChange={(e) => setPersonalNotes(e.target.value)}
                  className="w-full bg-slate-800/60 border border-white/10 rounded-xl p-3 sm:p-4 text-white text-sm focus:outline-none focus:border-red-500 transition-colors h-28 sm:h-32 resize-none"
                  placeholder="Store blood group, medical conditions, or other private notes..."
                />
              </div>

              <button
                type="submit"
                className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 sm:px-8 py-3 rounded-xl transition-colors text-sm sm:text-base"
              >
                Encrypt & Save to Vault
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
