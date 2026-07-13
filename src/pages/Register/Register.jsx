import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone } from 'lucide-react';
import AuthSplitLayout from '@/layouts/AuthSplitLayout';
import InputField from '@/components/InputField/InputField';
import Button from '@/components/Button/Button';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

const Register = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', password: '', confirm: '',
  });
  const [errors, setErrors] = useState({});

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!form.fullName) next.fullName = 'Full name is required';
    if (!form.email) next.email = 'Email is required';
    if (form.password.length < 6) next.password = 'At least 6 characters';
    if (form.password !== form.confirm) next.confirm = 'Passwords do not match';
    setErrors(next);
    if (Object.keys(next).length) return;

    try {
      await register(form);
      toast.success('Your account is ready', { title: 'Welcome to Flexrr.' });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error(err?.message || 'Unable to create account', { title: 'Sign-up failed' });
    }
  };

  return (
    <AuthSplitLayout
      title="Open your account"
      subtitle="Two minutes to set up. No account fees, no minimums to begin."
      footer={<>Already have an account? <Link to="/login">Sign in</Link></>}
    >
      <form onSubmit={onSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <InputField label="Full name" placeholder="Alex Whitfield" iconLeft={<User size={18} />} value={form.fullName} onChange={update('fullName')} error={errors.fullName} autoComplete="name" />
        <InputField label="Email" type="email" placeholder="you@email.com" iconLeft={<Mail size={18} />} value={form.email} onChange={update('email')} error={errors.email} autoComplete="email" />
        <InputField label="Phone (optional)" type="tel" placeholder="+1 (555) 000-0000" iconLeft={<Phone size={18} />} value={form.phone} onChange={update('phone')} autoComplete="tel" />
        <InputField label="Password" type="password" placeholder="6+ characters" iconLeft={<Lock size={18} />} value={form.password} onChange={update('password')} error={errors.password} autoComplete="new-password" />
        <InputField label="Confirm password" type="password" placeholder="Repeat password" iconLeft={<Lock size={18} />} value={form.confirm} onChange={update('confirm')} error={errors.confirm} autoComplete="new-password" />

        <p style={{ fontSize: '0.8125rem', color: '#6b7672', lineHeight: 1.5 }}>
          By continuing you agree to our <Link to="#" style={{ color: '#0f4c3a', fontWeight: 600 }}>Terms</Link> and <Link to="#" style={{ color: '#0f4c3a', fontWeight: 600 }}>Privacy Policy</Link>. Investment products are not FDIC-insured and may lose value.
        </p>
        <Button type="submit" size="lg" fullWidth loading={loading}>Create account</Button>
      </form>
    </AuthSplitLayout>
  );
};

export default Register;
