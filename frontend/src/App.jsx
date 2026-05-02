import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Register from './pages/Register';
import Login from './pages/Login';
import Vault from './pages/Vault';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <Routes>
        {/* Vault pages - no main navbar/footer */}
        <Route path="/vault/register" element={<Register />} />
        <Route path="/vault/login" element={<Login />} />
        <Route path="/vault" element={<Vault />} />

        {/* Portfolio pages - with navbar/footer */}
        <Route
          path="/*"
          element={
            <div className="min-h-screen bg-slate-950 text-white flex flex-col">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                </Routes>
              </main>
              <Footer />
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
