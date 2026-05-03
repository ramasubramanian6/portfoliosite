import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Search, Plus, X, Edit3, Trash2, Upload, FileText,
  Phone, Mail, MapPin, Droplet, Calendar, AlertTriangle,
  ChevronDown, ChevronUp, RefreshCw, LogOut, User, Tag,
  Navigation, MessageSquare, Send, CheckCircle2, Lock, Eye, EyeOff, Key
} from 'lucide-react';
import { getUser, getToken, clearAuth, authFetch, API_BASE, setAuth } from '../utils/api';

// ─── Edit Profile Modal ──────────────────────────────────────────────────────
const EditProfileModal = ({ user, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    bloodGroup: user?.bloodGroup || '',
    dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
    emergencyName: user?.emergencyName || '',
    emergencyPhone: user?.emergencyPhone || '',
    emergencyEmail: user?.emergencyEmail || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authFetch('/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      onSave(data);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-slate-900 z-10">
          <h2 className="text-xl font-bold text-white">Edit Personal Details</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-400 mb-1">Full Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full bg-slate-800 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Phone Number</label>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} className="w-full bg-slate-800 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Blood Group</label>
              <input type="text" name="bloodGroup" value={form.bloodGroup} onChange={handleChange} className="w-full bg-slate-800 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Date of Birth</label>
              <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} className="w-full bg-slate-800 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 outline-none" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-400 mb-1">Address</label>
              <textarea name="address" value={form.address} onChange={handleChange} rows={2} className="w-full bg-slate-800 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 outline-none resize-none" />
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 space-y-4">
            <h3 className="text-sm font-bold text-orange-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Emergency Contact
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-400 mb-1">Contact Name</label>
                <input type="text" name="emergencyName" value={form.emergencyName} onChange={handleChange} className="w-full bg-slate-800 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Contact Phone</label>
                <input type="tel" name="emergencyPhone" value={form.emergencyPhone} onChange={handleChange} className="w-full bg-slate-800 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Contact Email</label>
                <input type="email" name="emergencyEmail" value={form.emergencyEmail} onChange={handleChange} className="w-full bg-slate-800 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 outline-none" />
              </div>
            </div>
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 border border-white/10 text-slate-400 py-3 rounded-xl font-medium hover:bg-white/5 transition-all">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Save Changes'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// ─── PIN Entry Gate ──────────────────────────────────────────────────────────
const PinGate = ({ onSuccess }) => {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetStep, setResetStep] = useState(0); // 0: input, 1: otp-sent, 2: set-new
  const [resetForm, setResetForm] = useState({ otp: '', newPin: '', confirmPin: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pin.length !== 4) return setError('PIN must be 4 digits');
    setLoading(true);
    setError('');
    try {
      const res = await authFetch('/api/auth/vault-pin/verify', {
        method: 'POST',
        body: JSON.stringify({ pin }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      onSuccess();
    } catch (err) {
      setError(err.message || 'Incorrect PIN');
      setPin('');
    } finally {
      setLoading(false);
    }
  };

  const handleResetRequest = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await authFetch('/api/auth/vault-pin/reset-request', { method: 'POST' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
      }
      setResetStep(1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetConfirm = async (e) => {
    e.preventDefault();
    if (resetStep === 1) {
      if (!resetForm.otp) return setError('OTP is required');
      setResetStep(2);
      return;
    }

    if (resetForm.newPin.length !== 4) return setError('PIN must be 4 digits');
    if (resetForm.newPin !== resetForm.confirmPin) return setError('PINs do not match');

    setLoading(true);
    try {
      const res = await authFetch('/api/auth/vault-pin/reset-confirm', {
        method: 'POST',
        body: JSON.stringify({ otp: resetForm.otp, newPin: resetForm.newPin }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
      }
      alert('PIN reset successfully. You can now use your new PIN.');
      setResetStep(0);
      setResetForm({ otp: '', newPin: '', confirmPin: '' });
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (resetStep > 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Key className="w-8 h-8 text-blue-500" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Reset Vault PIN</h2>
          <p className="text-slate-400 text-sm mb-8">
            {resetStep === 1 ? 'Enter the OTP sent to your email.' : 'Set your new 4-digit Vault PIN.'}
          </p>

          <form onSubmit={handleResetConfirm} className="space-y-6">
            {resetStep === 1 ? (
              <input type="text" maxLength={6} value={resetForm.otp} onChange={e => setResetForm({...resetForm, otp: e.target.value.replace(/\D/g, '')})} placeholder="OTP Code" className="w-full bg-slate-800 border border-white/10 text-white text-center text-xl rounded-xl py-3 outline-none" />
            ) : (
              <div className="space-y-4">
                <input type="password" maxLength={4} value={resetForm.newPin} onChange={e => setResetForm({...resetForm, newPin: e.target.value.replace(/\D/g, '')})} placeholder="New PIN" className="w-full bg-slate-800 border border-white/10 text-white text-center text-xl rounded-xl py-3 outline-none" />
                <input type="password" maxLength={4} value={resetForm.confirmPin} onChange={e => setResetForm({...resetForm, confirmPin: e.target.value.replace(/\D/g, '')})} placeholder="Confirm PIN" className="w-full bg-slate-800 border border-white/10 text-white text-center text-xl rounded-xl py-3 outline-none" />
              </div>
            )}

            {error && <p className="text-red-400 text-xs">{error}</p>}

            <div className="flex flex-col gap-3">
              <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white py-3 rounded-xl font-bold text-sm transition-all">
                {loading ? <RefreshCw className="w-4 h-4 animate-spin mx-auto" /> : (resetStep === 1 ? 'Verify OTP' : 'Update PIN')}
              </button>
              <button type="button" onClick={() => setResetStep(0)} className="text-slate-500 text-xs hover:text-white transition-all">Cancel</button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-2xl p-8 text-center"
      >
        <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="w-8 h-8 text-blue-500" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Secure Access</h2>
        <p className="text-slate-400 text-sm mb-8">Enter your 4-digit Vault PIN to view sensitive documents.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-4">
            <input
              type="password"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              placeholder="••••"
              className="w-32 bg-slate-800 border border-white/10 text-white text-center text-3xl tracking-[1em] rounded-xl py-3 focus:outline-none focus:border-blue-500 transition-all"
              autoFocus
            />
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <div className="space-y-4">
            <button
              type="submit"
              disabled={loading || pin.length !== 4}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white py-3 rounded-xl font-bold text-sm transition-all"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin mx-auto" /> : 'Unlock Vault'}
            </button>
            <button
              type="button"
              onClick={handleResetRequest}
              className="text-slate-500 text-xs hover:text-blue-400 transition-all block mx-auto"
            >
              Forgot your PIN?
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// ─── Onboarding Modal ─────────────────────────────────────────────────────────
const OnboardingModal = ({ user, onComplete }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    phone: '', address: '', bloodGroup: '', dateOfBirth: '',
    emergencyName: '', emergencyPhone: '', emergencyEmail: '',
    pin: '', confirmPin: ''
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 1) {
      if (!form.phone || !form.emergencyName || !form.emergencyPhone) {
        return setError('Please fill in required fields');
      }
      setStep(2);
      setError('');
      return;
    }

    if (form.pin.length !== 4) return setError('PIN must be 4 digits');
    if (form.pin !== form.confirmPin) return setError('PINs do not match');

    setLoading(true);
    try {
      const profileRes = await authFetch('/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify({
          phone: form.phone,
          address: form.address,
          bloodGroup: form.bloodGroup,
          dateOfBirth: form.dateOfBirth,
          emergencyName: form.emergencyName,
          emergencyPhone: form.emergencyPhone,
          emergencyEmail: form.emergencyEmail,
        }),
      });
      const profileData = await profileRes.json();
      if (!profileRes.ok) throw new Error(profileData.message);

      const pinRes = await authFetch('/api/auth/vault-pin/set', {
        method: 'POST',
        body: JSON.stringify({ pin: form.pin }),
      });
      if (!pinRes.ok) {
        const pinData = await pinRes.json();
        throw new Error(pinData.message);
      }

      onComplete(profileData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden"
      >
        <div className="bg-gradient-to-r from-blue-600/20 to-violet-600/20 p-8 border-b border-white/10 text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Welcome to Your Vault</h2>
          <p className="text-slate-400 text-sm">Let's secure your account with a few details.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          {step === 1 ? (
            <div className="space-y-4">
              <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
                <User className="w-4 h-4 text-blue-400" /> Personal & Emergency Info
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Phone Number *</label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" required className="w-full bg-slate-800 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Blood Group</label>
                  <input type="text" name="bloodGroup" value={form.bloodGroup} onChange={handleChange} placeholder="A+, O-, etc." className="w-full bg-slate-800 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 outline-none" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Emergency Contact Name *</label>
                  <input type="text" name="emergencyName" value={form.emergencyName} onChange={handleChange} placeholder="Full name" required className="w-full bg-slate-800 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Emergency Phone *</label>
                  <input type="tel" name="emergencyPhone" value={form.emergencyPhone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" required className="w-full bg-slate-800 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Emergency Email</label>
                  <input type="email" name="emergencyEmail" value={form.emergencyEmail} onChange={handleChange} placeholder="email@example.com" className="w-full bg-slate-800 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 outline-none" />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
                <Key className="w-4 h-4 text-blue-400" /> Create Vault PIN
              </h3>
              <p className="text-slate-400 text-sm">This PIN will be required to access your private documents.</p>
              <div className="flex flex-col items-center gap-4">
                <div className="w-full">
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Set 4-Digit PIN</label>
                  <input type="password" name="pin" maxLength={4} value={form.pin} onChange={(e) => setForm({...form, pin: e.target.value.replace(/\D/g, '')})} placeholder="••••" className="w-full bg-slate-800 border border-white/10 text-white text-center text-2xl tracking-[1em] rounded-xl py-3 focus:border-blue-500 outline-none" />
                </div>
                <div className="w-full">
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Confirm PIN</label>
                  <input type="password" name="confirmPin" maxLength={4} value={form.confirmPin} onChange={(e) => setForm({...form, confirmPin: e.target.value.replace(/\D/g, '')})} placeholder="••••" className="w-full bg-slate-800 border border-white/10 text-white text-center text-2xl tracking-[1em] rounded-xl py-3 focus:border-blue-500 outline-none" />
                </div>
              </div>
            </div>
          )}

          {error && <p className="text-red-400 text-sm mt-4 text-center">{error}</p>}

          <div className="mt-8 flex gap-3">
            {step === 2 && (
              <button type="button" onClick={() => setStep(1)} className="flex-1 border border-white/10 text-slate-400 py-3 rounded-xl font-medium hover:bg-white/5 transition-all">Back</button>
            )}
            <button type="submit" disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : (step === 1 ? 'Next' : 'Complete Setup')}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// ─── Add/Edit Friend Modal ────────────────────────────────────────────────────
const FriendModal = ({ friend, onClose, onSave }) => {
  const [form, setForm] = useState(friend || {
    name: '', nickname: '', phone: '', email: '', address: '',
    bloodGroup: '', dateOfBirth: '', notes: '', relationship: 'Friend',
    emergencyContact: '', emergencyPhone: '', tags: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) return setError('Name is required');
    setLoading(true);
    try {
      const payload = {
        ...form,
        tags: typeof form.tags === 'string' ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : form.tags,
      };
      const res = friend
        ? await authFetch(`/api/vault/${friend._id}`, { method: 'PUT', body: JSON.stringify(payload) })
        : await authFetch('/api/vault', { method: 'POST', body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      onSave(data);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'name', label: 'Full Name *', type: 'text', placeholder: 'Friend\'s full name' },
    { name: 'nickname', label: 'Nickname', type: 'text', placeholder: 'Nickname' },
    { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+91 XXXXX XXXXX' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'friend@email.com' },
    { name: 'relationship', label: 'Relationship', type: 'text', placeholder: 'Friend, Family, etc.' },
    { name: 'bloodGroup', label: 'Blood Group', type: 'text', placeholder: 'A+, B-, O+, etc.' },
    { name: 'dateOfBirth', label: 'Date of Birth', type: 'date', placeholder: '' },
    { name: 'emergencyContact', label: 'Emergency Contact Name', type: 'text', placeholder: 'Contact person name' },
    { name: 'emergencyPhone', label: 'Emergency Contact Phone', type: 'tel', placeholder: '+91 XXXXX XXXXX' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-slate-900 z-10">
          <h2 className="text-xl font-bold text-white">{friend ? 'Edit Friend' : 'Add New Friend'}</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map(f => (
              <div key={f.name}>
                <label className="block text-xs font-medium text-slate-400 mb-1">{f.label}</label>
                <input
                  type={f.type}
                  name={f.name}
                  value={form[f.name] || ''}
                  onChange={handleChange}
                  placeholder={f.placeholder}
                  className="w-full bg-slate-800/60 border border-white/10 text-white placeholder-slate-600 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>
            ))}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Address</label>
            <textarea
              name="address"
              value={form.address || ''}
              onChange={handleChange}
              placeholder="Full address..."
              rows={2}
              className="w-full bg-slate-800/60 border border-white/10 text-white placeholder-slate-600 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Notes</label>
            <textarea
              name="notes"
              value={form.notes || ''}
              onChange={handleChange}
              placeholder="Any additional notes..."
              rows={3}
              className="w-full bg-slate-800/60 border border-white/10 text-white placeholder-slate-600 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Tags (comma separated)</label>
            <input
              type="text"
              name="tags"
              value={Array.isArray(form.tags) ? form.tags.join(', ') : (form.tags || '')}
              onChange={handleChange}
              placeholder="colleague, gym, school..."
              className="w-full bg-slate-800/60 border border-white/10 text-white placeholder-slate-600 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>

          {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-white/10 text-slate-400 hover:text-white py-3 rounded-xl font-medium text-sm transition-all">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all">
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : (friend ? 'Save Changes' : 'Add Friend')}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// ─── Floating SOS Alert Button + Panel ──────────────────────────────────────
const FloatingSOS = ({ friends }) => {
  const [open, setOpen] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [message, setMessage] = useState('');
  const [location, setLocation] = useState(null);
  const [locStatus, setLocStatus] = useState('idle');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const panelRef = useRef(null);

  useEffect(() => {
    if (open) {
      setSent(false); setError(''); setLocation(null); setLocStatus('requesting');
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy });
          setLocStatus('granted');
        },
        () => setLocStatus('denied'),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  }, [open]);

  useEffect(() => {
    const handler = (e) => { if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false); };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleSend = async () => {
    if (!selectedFriend) { setError('Please select a friend to alert.'); return; }
    setSending(true); setError('');
    try {
      const body = {};
      if (location) body.location = location;
      if (message.trim()) body.message = message.trim();
      const res = await authFetch(`/api/vault/${selectedFriend}/emergency`, {
        method: 'POST',
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSent(true);
      setTimeout(() => { setOpen(false); setSent(false); setMessage(''); setSelectedFriend(null); }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to send alert.');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <motion.button
        id="sos-float-btn"
        onClick={() => setOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{ boxShadow: ['0 0 0 0 rgba(239,68,68,0.7)', '0 0 0 14px rgba(239,68,68,0)', '0 0 0 0 rgba(239,68,68,0)'] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex flex-col items-center justify-center text-white shadow-2xl shadow-red-500/50 border-2 border-red-400/30 cursor-pointer"
        aria-label="Send Emergency SOS Alert"
      >
        <AlertTriangle className="w-6 h-6" />
        <span className="text-[9px] font-black tracking-widest mt-0.5">SOS</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end p-4 sm:p-6 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              ref={panelRef}
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.97 }}
              className="w-full sm:w-96 bg-slate-900 border border-red-500/30 rounded-2xl shadow-2xl shadow-red-500/20 overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-red-600/30 to-rose-600/20 border-b border-red-500/20">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center animate-pulse">
                    <AlertTriangle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm">Emergency Alert</h3>
                    <p className="text-red-400 text-xs">Sends urgent email immediately</p>
                  </div>
                </div>
                <button onClick={() => setOpen(false)} className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 space-y-4">
                {sent ? (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                    <CheckCircle2 className="w-14 h-14 text-green-400 mx-auto mb-3" />
                    <p className="text-white font-bold text-base">Alert Sent!</p>
                  </motion.div>
                ) : (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-2">Alert for which friend?</label>
                      <select
                        value={selectedFriend || ''}
                        onChange={e => { setSelectedFriend(e.target.value); setError(''); }}
                        className="w-full bg-slate-800 border border-white/10 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-red-500"
                      >
                        <option value="" disabled>-- Select a friend --</option>
                        {friends.map(f => <option key={f._id} value={f._id}>{f.name}</option>)}
                      </select>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-white/5">
                      <Navigation className={`w-4 h-4 flex-shrink-0 mt-0.5 ${locStatus === 'granted' ? 'text-green-400' : 'text-blue-400 animate-pulse'}`} />
                      <div className="flex-1 min-w-0 text-xs">
                        {locStatus === 'granted' ? <span className="text-green-400 font-semibold">📍 Location captured!</span> : <span className="text-slate-400">Requesting location…</span>}
                      </div>
                    </div>

                    <textarea
                      value={message} onChange={e => setMessage(e.target.value)}
                      placeholder="Optional message..." rows={2}
                      className="w-full bg-slate-800 border border-white/10 text-white rounded-xl px-3 py-2.5 text-sm resize-none outline-none focus:border-red-500"
                    />

                    {error && <p className="text-red-400 text-xs">{error}</p>}

                    <button
                      onClick={handleSend} disabled={sending}
                      className="w-full bg-red-600 hover:bg-red-500 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
                    >
                      {sending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" /> Send SOS Alert</>}
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// ─── Friend Card ──────────────────────────────────────────────────────────────
const FriendCard = ({ friend, onEdit, onDelete, onUpload }) => {
  const [expanded, setExpanded] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadLoading(true);
    const formData = new FormData();
    formData.append('document', file);
    formData.append('description', file.name);
    try {
      const res = await fetch(`${API_BASE}/api/vault/${friend._id}/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      onUpload(data.friend);
    } catch (err) { alert(err.message); }
    finally { setUploadLoading(false); }
  };

  const initials = friend.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const colors = ['from-blue-500 to-cyan-500', 'from-violet-500 to-purple-500', 'from-emerald-500 to-teal-500', 'from-orange-500 to-amber-500', 'from-rose-500 to-pink-500'];
  const color = colors[friend.name.charCodeAt(0) % colors.length];

  return (
    <motion.div
      layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all"
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-lg`}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-white font-bold text-base truncate">{friend.name}</h3>
                <span className="inline-block text-xs text-blue-400 bg-blue-500/10 rounded-full px-2 py-0.5 mt-1">{friend.relationship || 'Friend'}</span>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => onEdit(friend)} className="p-1.5 text-slate-500 hover:text-blue-400 rounded-lg"><Edit3 className="w-4 h-4" /></button>
                <button onClick={() => onDelete(friend._id)} className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="mt-2 space-y-1">
              {friend.phone && <p className="text-xs text-slate-400 flex items-center gap-1"><Phone className="w-3 h-3" /> {friend.phone}</p>}
              {friend.email && <p className="text-xs text-slate-400 flex items-center gap-1"><Mail className="w-3 h-3" /> {friend.email}</p>}
            </div>
          </div>
        </div>
      </div>

      <button onClick={() => setExpanded(!expanded)} className="w-full px-5 py-2 flex items-center justify-between text-xs text-slate-500 border-t border-white/5 hover:bg-white/5 transition-all">
        <span>Details & Documents ({friend.documents?.length || 0})</span>
        {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      {expanded && (
        <div className="px-5 pb-5 pt-3 space-y-4 border-t border-white/5 bg-slate-900/50">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-400">Documents (PDF)</p>
            <label className="cursor-pointer text-xs text-blue-400 hover:text-blue-300">
              {uploadLoading ? <RefreshCw className="w-3 h-3 animate-spin" /> : 'Upload PDF'}
              <input type="file" accept="application/pdf" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
          <div className="space-y-2">
            {friend.documents?.map((doc, i) => (
              <a key={i} href={`${API_BASE}/api/vault/document/${doc.filename}?token=${getToken()}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 bg-slate-800 rounded-xl hover:bg-slate-700 transition-all">
                <FileText className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-white truncate flex-1">{doc.originalName}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

// ─── Main Vault Dashboard ─────────────────────────────────────────────────────
const Vault = () => {
  const [activeTab, setActiveTab] = useState('friends');
  const [friends, setFriends] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editFriend, setEditFriend] = useState(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  
  const navigate = useNavigate();
  const user = useMemo(() => getUser(), []); // Stable reference to prevent infinite effect loops

  const fetchProfile = useCallback(async () => {
    try {
      const url = '/api/auth/profile';
      console.log(' [DEBUG] Fetching profile from:', `${API_BASE}${url}`);
      const res = await authFetch(url);
      if (res.status === 401) { clearAuth(); navigate('/vault/login'); return; }
      const data = await res.json();
      setUserProfile(data);
    } catch (err) { console.error('Profile fetch error:', err); }
  }, [navigate]);

  const fetchFriends = useCallback(async (q = '') => {
    try {
      const res = await authFetch(`/api/vault${q ? `?q=${encodeURIComponent(q)}` : ''}`);
      if (res.status === 401) { clearAuth(); navigate('/vault/login'); return; }
      const data = await res.json();
      setFriends(Array.isArray(data) ? data : []);
    } catch (err) { console.error('Friends fetch error:', err); }
    finally { setLoading(false); }
  }, [navigate]);

  useEffect(() => {
    if (!user) { navigate('/vault/login'); return; }
    fetchProfile();
    fetchFriends();
  }, [user, navigate, fetchProfile, fetchFriends]);

  useEffect(() => {
    if (activeTab === 'friends') {
      const timer = setTimeout(() => fetchFriends(search), 400);
      return () => clearTimeout(timer);
    }
  }, [search, fetchFriends, activeTab]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this friend permanently?')) return;
    await authFetch(`/api/vault/${id}`, { method: 'DELETE' });
    setFriends(prev => prev.filter(f => f._id !== id));
  };

  const handleEdit = (friend) => { setEditFriend(friend); setShowModal(true); };
  const handleAdd = () => { setEditFriend(null); setShowModal(true); };
  const handleSave = (saved) => {
    setFriends(prev => {
      const idx = prev.findIndex(f => f._id === saved._id);
      if (idx >= 0) { const next = [...prev]; next[idx] = saved; return next; }
      return [saved, ...prev];
    });
  };
  const handleUpload = (updated) => setFriends(prev => prev.map(f => f._id === updated._id ? updated : f));
  const handleLogout = () => { clearAuth(); navigate('/vault/login'); };
  const handleProfileUpdate = (updated) => { setUserProfile(updated); setAuth(getToken(), updated); };

  const handleUserDocUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingDoc(true);
    const formData = new FormData();
    formData.append('document', file);
    formData.append('description', file.name);
    try {
      const res = await fetch(`${API_BASE}/api/auth/profile/documents`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setUserProfile(data.user);
    } catch (err) { alert(err.message); }
    finally { setUploadingDoc(false); }
  };

  const handleUserDocDelete = async (docId) => {
    if (!window.confirm('Delete this document?')) return;
    try {
      const res = await authFetch(`/api/auth/profile/documents/${docId}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setUserProfile(data.user);
    } catch (err) { alert(err.message); }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {userProfile && !userProfile.profileComplete && (
        <OnboardingModal user={userProfile} onComplete={handleProfileUpdate} />
      )}

      <div className="bg-slate-900/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 pt-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-violet-600 rounded-xl flex items-center justify-center"><Shield className="w-5 h-5 text-white" /></div>
              <div><h1 className="text-white font-bold text-lg">Secure Vault</h1><p className="text-slate-500 text-xs">Welcome, {userProfile?.name} 👋</p></div>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/" className="text-xs text-slate-500 hover:text-white px-3 py-2 rounded-xl">Portfolio</Link>
              <button onClick={handleLogout} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-400 px-3 py-2 rounded-xl"><LogOut className="w-4 h-4" /> Logout</button>
            </div>
          </div>
          <div className="flex gap-1">
            {[
              { id: 'personal', label: 'Personal Details', icon: User },
              { id: 'friends', label: 'Friend Contacts', icon: Phone },
              { id: 'documents', label: 'Documents', icon: FileText },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 ${activeTab === tab.id ? 'text-blue-400 border-blue-500 bg-blue-500/5' : 'text-slate-500 border-transparent hover:text-slate-300'}`}>
                <tab.icon className="w-4 h-4" /> {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'personal' && (
            <motion.div key="personal" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2"><User className="w-6 h-6 text-blue-400" /> My Profile</h2>
                <button onClick={() => setShowEditProfile(true)} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-xl text-sm font-medium border border-white/10 transition-all"><Edit3 className="w-4 h-4" /> Edit Details</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-6">Basic Information</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Full Name', value: userProfile?.name, icon: User },
                      { label: 'Email Address', value: userProfile?.email, icon: Mail },
                      { label: 'Phone', value: userProfile?.phone || 'Not set', icon: Phone },
                      { label: 'Blood Group', value: userProfile?.bloodGroup || 'Not set', icon: Droplet },
                      { label: 'DOB', value: userProfile?.dateOfBirth ? new Date(userProfile.dateOfBirth).toLocaleDateString() : 'Not set', icon: Calendar },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-all">
                        <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center"><item.icon className="w-4 h-4 text-slate-400" /></div>
                        <div><p className="text-xs text-slate-500 font-medium">{item.label}</p><p className="text-white text-sm">{item.value}</p></div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-6">Emergency Contact</h3>
                  <div className="bg-orange-500/5 border border-orange-500/10 rounded-2xl p-6 space-y-4">
                    <div><p className="text-xs text-orange-400 font-bold">Name</p><p className="text-white text-lg font-semibold">{userProfile?.emergencyName || 'Not set'}</p></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><p className="text-xs text-orange-400 font-bold">Phone</p><p className="text-white">{userProfile?.emergencyPhone || 'Not set'}</p></div>
                      <div><p className="text-xs text-orange-400 font-bold">Email</p><p className="text-white truncate">{userProfile?.emergencyEmail || 'Not set'}</p></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'friends' && (
            <motion.div key="friends" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search friends..." className="w-full bg-slate-900 border border-white/10 text-white rounded-xl pl-10 pr-4 py-3 focus:border-blue-500 outline-none" />
                </div>
                <button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all"><Plus className="w-4 h-4" /> Add Friend</button>
              </div>
              {loading ? <div className="flex justify-center py-20"><RefreshCw className="w-8 h-8 text-blue-400 animate-spin" /></div> : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {friends.map(friend => <FriendCard key={friend._id} friend={friend} onEdit={handleEdit} onDelete={handleDelete} onUpload={handleUpload} />)}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'documents' && (
            <motion.div key="documents" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {!isUnlocked ? <PinGate onSuccess={() => setIsUnlocked(true)} /> : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div><h2 className="text-2xl font-bold text-white">Your Documents</h2><p className="text-slate-500 text-sm">Secure storage for your private files.</p></div>
                    <label className="cursor-pointer flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-semibold transition-all">
                      {uploadingDoc ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />} Upload PDF
                      <input type="file" accept="application/pdf" onChange={handleUserDocUpload} className="hidden" />
                    </label>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {userProfile?.documents?.map(doc => (
                      <div key={doc._id} className="bg-slate-900 border border-white/10 rounded-2xl p-4 hover:border-blue-500/30 transition-all group">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center flex-shrink-0"><FileText className="w-6 h-6 text-blue-500" /></div>
                          <div className="flex-1 min-w-0"><p className="text-white font-semibold truncate">{doc.originalName}</p><p className="text-slate-500 text-xs">{new Date(doc.uploadedAt).toLocaleDateString()}</p></div>
                          <button onClick={() => handleUserDocDelete(doc._id)} className="p-2 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-4 h-4" /></button>
                        </div>
                        <a href={`${API_BASE}/api/auth/profile/documents/${doc.filename}?token=${getToken()}`} target="_blank" rel="noreferrer" className="block w-full mt-4 bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-lg text-xs font-medium text-center transition-all">View PDF</a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <FloatingSOS friends={friends} />
      <AnimatePresence>
        {showModal && <FriendModal friend={editFriend} onClose={() => { setShowModal(false); setEditFriend(null); }} onSave={handleSave} />}
        {showEditProfile && <EditProfileModal user={userProfile} onClose={() => setShowEditProfile(false)} onSave={handleProfileUpdate} />}
      </AnimatePresence>
    </div>
  );
};

export default Vault;
