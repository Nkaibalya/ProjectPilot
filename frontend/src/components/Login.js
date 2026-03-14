import React, { useState } from 'react';
import { login } from '../api';
import { Compass, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(email, password);
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user_id', data.user_id);
      localStorage.setItem('user_name', data.name);
      localStorage.setItem('user_email', email);
      toast.success(`Welcome back, ${data.name}!`);
      onLogin();
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        const msg = detail.map(e => e.msg).join(', ');
        toast.error(msg);
      } else {
        toast.error(detail || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--bg-color)' }}>
      <div className="glass-panel" style={{ width: '400px', padding: '3rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Compass size={48} color="var(--primary-color)" />
          <h2 style={{ marginTop: '1rem' }}>Welcome to ProjectPilot</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Sign in to manage your projects & issues</p>
        </div>


        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? <Loader2 size={18} className="animate-spin" /> : 'Sign In'}
          </button>
        </form>
       
      </div>
    </div>
  );
};

export default Login;
