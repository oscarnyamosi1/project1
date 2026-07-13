import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import AuthSplitLayout from '@/layouts/AuthSplitLayout';
import InputField from '@/components/InputField/InputField';
import Button from '@/components/Button/Button';
import { resetPassword } from '@/api/auth';
import { useToast } from '@/context/ToastContext';

const ResetPassword = () => {
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const toast = useToast();

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    const next = {};
    if (form.password.length < 6) next.password = 'At least 6 characters';
    if (form.password !== form.confirm) next.confirm = 'Passwords do not match';
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    try {
      await resetPassword(form);
      toast.success('You can now sign in with the new password.', { title: 'Password updated' });
      navigate('/login', { replace: true });
    } catch (err) {
      toast.error(err?.message || 'Unable to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSplitLayout
      title="Choose a new password"
      subtitle="Pick something memorable but strong. Avoid reusing passwords you use elsewhere."
      footer={<>Done? <Link to="/login">Back to sign in</Link></>}
    >
      <form onSubmit={onSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <InputField
          label="New password"
          type="password"
          iconLeft={<Lock size={18} />}
          value={form.password}
          onChange={update('password')}
          error={errors.password}
          placeholder="6+ characters"
        />
        <InputField
          label="Confirm new password"
          type="password"
          iconLeft={<Lock size={18} />}
          value={form.confirm}
          onChange={update('confirm')}
          error={errors.confirm}
          placeholder="Repeat password"
        />
        <Button type="submit" size="lg" fullWidth loading={loading}>Update password</Button>
      </form>
    </AuthSplitLayout>
  );
};

export default ResetPassword;
