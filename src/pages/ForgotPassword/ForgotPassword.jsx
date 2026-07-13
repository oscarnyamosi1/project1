import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle2 } from 'lucide-react';
import AuthSplitLayout from '@/layouts/AuthSplitLayout';
import InputField from '@/components/InputField/InputField';
import Button from '@/components/Button/Button';
import { requestPasswordReset } from '@/api/auth';
import { useToast } from '@/context/ToastContext';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await requestPasswordReset(email);
      setSent(true);
      toast.success('Check your inbox for the reset link.', { title: 'Reset link sent' });
    } catch (err) {
      toast.error(err?.message || 'Unable to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSplitLayout
      title={sent ? 'Check your email' : 'Reset your password'}
      subtitle={sent
        ? `We sent a recovery link to ${email}. The link expires in 30 minutes.`
        : 'Enter the email associated with your account and we\'ll send you a secure recovery link.'}
      footer={<>Remembered it? <Link to="/login">Back to sign in</Link></>}
    >
      {sent ? (
        <div style={{ background: '#e7f1ec', color: '#0f4c3a', padding: '1.25rem', borderRadius: '14px', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
          <CheckCircle2 size={20} style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <strong style={{ display: 'block', marginBottom: 4 }}>Recovery link sent</strong>
            <span style={{ fontSize: '0.875rem' }}>If you don't see it within a few minutes, check your spam folder or try again.</span>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <InputField
            label="Email"
            type="email"
            iconLeft={<Mail size={18} />}
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <Button type="submit" size="lg" fullWidth loading={loading}>Send recovery link</Button>
        </form>
      )}
    </AuthSplitLayout>
  );
};

export default ForgotPassword;
