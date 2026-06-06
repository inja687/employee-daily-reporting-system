import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Alert, getError } from '../components/Ui';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const submit = async (event) => {
    event.preventDefault(); setLoading(true); setError('');
    try { await login(form.email, form.password); navigate('/dashboard'); }
    catch (err) { setError(getError(err)); }
    finally { setLoading(false); }
  };
  return <div className="login-page"><div className="login-panel"><div className="login-brand"><span className="brand-mark">D</span> DailyFlow</div><div className="login-copy"><span className="eyebrow">EMPLOYEE REPORTING</span><h1>Clear updates.<br/>Better teamwork.</h1><p>One place for daily progress, feedback, and approvals across your organization.</p></div></div><div className="login-form-wrap"><form className="login-form" onSubmit={submit}><h2>Welcome back</h2><p className="text-muted mb-4">Sign in to your workspace</p><Alert error={error}/><label className="form-label">Email address</label><input className="form-control mb-3" type="email" required value={form.email} onChange={e => setForm({...form, email:e.target.value})} placeholder="you@company.com"/><label className="form-label">Password</label><input className="form-control mb-4" type="password" required value={form.password} onChange={e => setForm({...form, password:e.target.value})} placeholder="Enter your password"/><button className="btn btn-primary w-100 py-2" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button></form></div></div>;
}
