import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Search, Plus, X, Edit3, Trash2, Upload, FileText,
  Phone, Mail, MapPin, Droplet, Calendar, AlertTriangle,
  ChevronDown, ChevronUp, RefreshCw, LogOut, User, Tag,
  Navigation, MessageSquare, Send, CheckCircle2
} from 'lucide-react';
import { getUser, getToken, clearAuth, authFetch, API_BASE } from '../utils/api';

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
  const [locStatus, setLocStatus] = useState('idle'); // idle | requesting | granted | denied
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const panelRef = useRef(null);

  // Auto-request location when panel opens
  useEffect(() => {
    if (open) {
      setSent(false);
      setError('');
      setLocation(null);
      setLocStatus('requesting');
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

  // Close panel on outside click
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
      {/* Floating SOS Trigger Button */}
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

      {/* SOS Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end p-4 sm:p-6 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              ref={panelRef}
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.97 }}
              transition={{ type: 'spring', damping: 22, stiffness: 280 }}
              className="w-full sm:w-96 bg-slate-900 border border-red-500/30 rounded-2xl shadow-2xl shadow-red-500/20 overflow-hidden"
            >
              {/* Header */}
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
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-6"
                  >
                    <CheckCircle2 className="w-14 h-14 text-green-400 mx-auto mb-3" />
                    <p className="text-white font-bold text-base">Alert Sent!</p>
                    <p className="text-slate-400 text-sm mt-1">Emergency email dispatched successfully.</p>
                  </motion.div>
                ) : (
                  <>
                    {/* Friend Selector */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-2">Alert for which friend?</label>
                      <select
                        id="sos-friend-select"
                        value={selectedFriend || ''}
                        onChange={e => { setSelectedFriend(e.target.value); setError(''); }}
                        className="w-full bg-slate-800 border border-white/10 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-red-500 transition-all"
                      >
                        <option value="" disabled>-- Select a friend --</option>
                        {friends.map(f => (
                          <option key={f._id} value={f._id}>{f.name}{f.relationship ? ` (${f.relationship})` : ''}</option>
                        ))}
                      </select>
                    </div>

                    {/* Location Status */}
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-white/5">
                      <Navigation className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                        locStatus === 'granted' ? 'text-green-400' :
                        locStatus === 'denied' ? 'text-red-400' :
                        'text-blue-400 animate-pulse'
                      }`} />
                      <div className="flex-1 min-w-0">
                        {locStatus === 'idle' && <p className="text-slate-400 text-xs">Waiting for location…</p>}
                        {locStatus === 'requesting' && <p className="text-blue-400 text-xs font-medium">Requesting your location…</p>}
                        {locStatus === 'granted' && location && (
                          <>
                            <p className="text-green-400 text-xs font-semibold">📍 Location captured!</p>
                            <p className="text-slate-500 text-xs mt-0.5 truncate">{location.lat.toFixed(5)}, {location.lng.toFixed(5)}</p>
                            <p className="text-slate-600 text-xs">Accuracy: ±{Math.round(location.accuracy)}m</p>
                          </>
                        )}
                        {locStatus === 'denied' && (
                          <>
                            <p className="text-red-400 text-xs font-semibold">Location access denied</p>
                            <p className="text-slate-500 text-xs mt-0.5">Alert will send without location.</p>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Optional Message */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5" /> Message <span className="text-slate-600 font-normal">(optional)</span>
                      </label>
                      <textarea
                        id="sos-message"
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        placeholder="Describe the situation..."
                        rows={3}
                        className="w-full bg-slate-800/60 border border-white/10 text-white placeholder-slate-600 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-red-500 transition-all resize-none"
                      />
                    </div>

                    {error && (
                      <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5">{error}</p>
                    )}

                    {/* Send Button */}
                    <button
                      id="sos-send-btn"
                      onClick={handleSend}
                      disabled={sending}
                      className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-50 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-red-500/30 border border-red-500/30"
                    >
                      {sending ? (
                        <><RefreshCw className="w-4 h-4 animate-spin" /> Sending Alert…</>
                      ) : (
                        <><Send className="w-4 h-4" /> 🚨 Send Emergency Alert</>
                      )}
                    </button>
                    <p className="text-slate-600 text-xs text-center">This sends an urgent email with your location to Rama Subramanian</p>
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
const FriendCard = ({ friend, onEdit, onDelete, onEmergency, onUpload }) => {
  const [expanded, setExpanded] = useState(false);
  const [alertLoading, setAlertLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);

  const handleEmergency = async () => {
    if (!window.confirm(`Send EMERGENCY ALERT for ${friend.name}? This will email Rama immediately.`)) return;
    setAlertLoading(true);
    try {
      const res = await authFetch(`/api/vault/${friend._id}/emergency`, { method: 'POST' });
      const data = await res.json();
      setAlertMsg(data.message);
      setTimeout(() => setAlertMsg(''), 4000);
    } catch { setAlertMsg('Failed to send alert'); }
    finally { setAlertLoading(false); }
  };

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
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-slate-900/80 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all"
    >
      {/* Card Header */}
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-lg`}>
            {initials}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-white font-bold text-base truncate">{friend.name}</h3>
                {friend.nickname && <p className="text-slate-500 text-xs">"{friend.nickname}"</p>}
                <span className="inline-block text-xs text-blue-400 bg-blue-500/10 rounded-full px-2 py-0.5 mt-1">{friend.relationship || 'Friend'}</span>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => onEdit(friend)} className="p-1.5 text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all" title="Edit">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button onClick={() => onDelete(friend._id)} className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick info */}
            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
              {friend.phone && (
                <a href={`tel:${friend.phone}`} className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors">
                  <Phone className="w-3 h-3" /> {friend.phone}
                </a>
              )}
              {friend.email && (
                <a href={`mailto:${friend.email}`} className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors truncate max-w-[180px]">
                  <Mail className="w-3 h-3" /> {friend.email}
                </a>
              )}
              {friend.bloodGroup && (
                <span className="flex items-center gap-1 text-xs text-red-400">
                  <Droplet className="w-3 h-3" /> {friend.bloodGroup}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Tags */}
        {friend.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {friend.tags.map((t, i) => (
              <span key={i} className="flex items-center gap-1 text-xs text-slate-500 bg-slate-800 rounded-full px-2.5 py-0.5">
                <Tag className="w-2.5 h-2.5" /> {t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Expand toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-2 flex items-center justify-between text-xs text-slate-500 hover:text-slate-300 border-t border-white/5 hover:bg-white/5 transition-all"
      >
        <span>Details & Documents ({friend.documents?.length || 0})</span>
        {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-3 space-y-4 border-t border-white/5">
              {/* Personal Data */}
              <div className="grid grid-cols-2 gap-3">
                {friend.address && (
                  <div className="col-span-2 flex items-start gap-2 text-xs text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 mt-0.5 flex-shrink-0" />
                    <span>{friend.address}</span>
                  </div>
                )}
                {friend.dateOfBirth && (
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>DOB: {new Date(friend.dateOfBirth).toLocaleDateString('en-IN')}</span>
                  </div>
                )}
                {friend.emergencyContact && (
                  <div className="col-span-2 bg-orange-500/10 border border-orange-500/20 rounded-xl p-3">
                    <p className="text-xs text-orange-400 font-semibold mb-1">Emergency Contact</p>
                    <p className="text-xs text-slate-300">{friend.emergencyContact}</p>
                    {friend.emergencyPhone && <p className="text-xs text-slate-400">{friend.emergencyPhone}</p>}
                  </div>
                )}
                {friend.notes && (
                  <div className="col-span-2 text-xs text-slate-500 bg-slate-800/50 rounded-xl p-3">
                    <p className="font-medium text-slate-400 mb-1">Notes</p>
                    <p>{friend.notes}</p>
                  </div>
                )}
              </div>

              {/* Documents */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-slate-400">Documents (PDF)</p>
                  <label className="cursor-pointer flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg px-3 py-1.5 transition-all">
                    {uploadLoading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                    Upload PDF
                    <input type="file" accept="application/pdf" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
                {friend.documents?.length === 0 && (
                  <p className="text-xs text-slate-600 italic">No documents uploaded yet.</p>
                )}
                <div className="space-y-2">
                  {friend.documents?.map((doc, i) => (
                    <a
                      key={i}
                      href={`${API_BASE}/uploads/docs/${doc.filename}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2.5 p-2.5 bg-slate-800/60 rounded-xl hover:bg-slate-800 transition-all group"
                    >
                      <FileText className="w-4 h-4 text-blue-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-white truncate">{doc.originalName}</p>
                        <p className="text-xs text-slate-500">{new Date(doc.uploadedAt).toLocaleDateString('en-IN')}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Emergency Alert Button */}
              <div className="pt-2">
                {alertMsg && (
                  <p className="text-green-400 text-xs bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-2 mb-2 text-center">
                    ✅ {alertMsg}
                  </p>
                )}
                <button
                  onClick={handleEmergency}
                  disabled={alertLoading}
                  className="w-full bg-red-600/80 hover:bg-red-600 disabled:opacity-50 text-white py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-red-500/25 border border-red-500/30"
                >
                  {alertLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <AlertTriangle className="w-4 h-4" />}
                  🚨 SEND EMERGENCY ALERT
                </button>
                <p className="text-xs text-slate-600 text-center mt-1">Sends an urgent email to Rama Subramanian</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Main Vault Dashboard ─────────────────────────────────────────────────────
const Vault = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editFriend, setEditFriend] = useState(null);
  const navigate = useNavigate();
  const user = getUser();

  const fetchFriends = useCallback(async (q = '') => {
    try {
      const res = await authFetch(`/api/vault${q ? `?q=${encodeURIComponent(q)}` : ''}`);
      if (res.status === 401) { clearAuth(); navigate('/vault/login'); return; }
      const data = await res.json();
      setFriends(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [navigate]);

  useEffect(() => {
    if (!user) { navigate('/vault/login'); return; }
    fetchFriends();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchFriends(search), 400);
    return () => clearTimeout(timer);
  }, [search, fetchFriends]);

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

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="bg-slate-900/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold text-lg leading-tight">Friend Vault</h1>
                <p className="text-slate-500 text-xs">Hi, {user?.name} 👋</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link to="/" className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 hover:text-white px-3 py-2 rounded-xl hover:bg-white/5 transition-all">
                Portfolio
              </Link>
              <button onClick={handleLogout} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-400 px-3 py-2 rounded-xl hover:bg-red-500/10 transition-all">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search + Add */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, phone, email, tag..."
              className="w-full bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:shadow-lg hover:shadow-blue-500/25 flex-shrink-0"
          >
            <Plus className="w-4 h-4" /> Add Friend
          </button>
        </div>

        {/* Stats bar */}
        <div className="flex items-center gap-4 mb-6">
          <span className="text-slate-500 text-sm">
            <span className="text-white font-semibold">{friends.length}</span> {friends.length === 1 ? 'contact' : 'contacts'} stored
          </span>
          {search && <span className="text-blue-400 text-sm">· Filtered by "{search}"</span>}
        </div>

        {/* Friends Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="w-8 h-8 text-blue-400 animate-spin" />
          </div>
        ) : friends.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-900/80 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-slate-600" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">{search ? 'No results found' : 'Your vault is empty'}</h3>
            <p className="text-slate-500 text-sm mb-6">{search ? 'Try a different search.' : 'Add your first friend to get started.'}</p>
            {!search && (
              <button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all">
                <Plus className="w-4 h-4 inline mr-2" /> Add First Friend
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            <AnimatePresence>
              {friends.map(friend => (
                <FriendCard
                  key={friend._id}
                  friend={friend}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onEmergency={() => {}}
                  onUpload={handleUpload}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Floating SOS Button */}
      <FloatingSOS friends={friends} />

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <FriendModal
            friend={editFriend}
            onClose={() => { setShowModal(false); setEditFriend(null); }}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Vault;
