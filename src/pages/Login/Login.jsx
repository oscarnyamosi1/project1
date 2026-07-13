import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import AuthSplitLayout from '@/layouts/AuthSplitLayout';
import InputField from '@/components/InputField/InputField';
import Button from '@/components/Button/Button';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const [form, setForm] = useState({ email: 'alex@whitfield.co', password: 'demo1234' });
  const [errors, setErrors] = useState({});

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!form.email) next.email = 'Email is required';
    if (!form.password) next.password = 'Password is required';
    setErrors(next);
    if (Object.keys(next).length) return;

    try {
      await login(form);
      toast.success('Welcome back', { title: 'Signed in' });
      const target = location.state?.from?.pathname || '/dashboard';
      navigate(target, { replace: true });
    } catch (err) {
      toast.error(err?.message || 'Unable to sign in', { title: 'Sign-in failed' });
    }
  };

  return (
    <AuthSplitLayout
      title="Welcome back"
      subtitle="Sign in to view your portfolio, returns, and recent activity."
      footer={<>Don't have an account? <Link to="/register">Open one</Link></>}
    >
      <form onSubmit={onSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <InputField
          label="Email"
          type="email"
          placeholder="you@email.com"
          iconLeft={<Mail size={18} />}
          value={form.email}
          onChange={update('email')}
          error={errors.email}
          autoComplete="email"
        />
        <InputField
          label="Password"
          type="password"
          placeholder="At least 4 characters"
          iconLeft={<Lock size={18} />}
          value={form.password}
          onChange={update('password')}
          error={errors.password}
          autoComplete="current-password"
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
          <label style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center', color: '#2b3a36' }}>
            <input type="checkbox" defaultChecked /> Remember me
          </label>
          <Link to="/forgot-password" style={{ color: '#0f4c3a', fontWeight: 600 }}>Forgot password?</Link>
        </div>
        <Button type="submit" size="lg" fullWidth loading={loading}>Sign in</Button>
      </form>
    </AuthSplitLayout>
  );
};

export default Login;
