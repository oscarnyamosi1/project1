import { useState } from 'react';
import { User, Mail, Phone, Shield, Bell, Camera, BadgeCheck } from 'lucide-react';
import AuthLayout from '@/layouts/AuthLayout';
import InputField from '@/components/InputField/InputField';
import Button from '@/components/Button/Button';
import Avatar from '@/components/Avatar/Avatar';
import Badge from '@/components/Badge/Badge';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { updateProfile, updatePassword, updateSecuritySettings } from '@/api/user';
import { formatDate } from '@/utils/formatters';
import styles from './Profile.module.scss';

const TABS = [
  { id: 'personal', label: 'Personal info', icon: User },
  { id: 'security', label: 'Security',      icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

const Profile = () => {
  const { user, updateUserLocally } = useAuth();
  const toast = useToast();
  const [tab, setTab] = useState('personal');

  const [profile, setProfile] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [profileSaving, setProfileSaving] = useState(false);

  const [pwd, setPwd] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwdSaving, setPwdSaving] = useState(false);

  const [security, setSecurity] = useState({
    twoFactorEnabled: user?.twoFactorEnabled ?? true,
    loginAlerts: user?.loginAlerts ?? true,
  });

  const saveProfile = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    try {
      const res = await updateProfile(profile);
      updateUserLocally(res.data);
      toast.success('Your profile has been updated.', { title: 'Saved' });
    } catch (err) {
      toast.error(err?.message || 'Could not save changes');
    } finally {
      setProfileSaving(false);
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    setPwdSaving(true);
    try {
      await updatePassword(pwd);
      setPwd({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Your password has been changed.', { title: 'Password updated' });
    } catch (err) {
      toast.error(err?.message || 'Could not change password');
    } finally {
      setPwdSaving(false);
    }
  };

  const toggleSetting = async (key) => {
    const next = { ...security, [key]: !security[key] };
    setSecurity(next);
    try {
      const res = await updateSecuritySettings(next);
      updateUserLocally(res.data);
      toast.success('Preferences saved.');
    } catch {
      setSecurity(security);
      toast.error('Could not save preferences');
    }
  };

  return (
    <AuthLayout title="Profile" subtitle="Manage your account, security, and notification preferences.">
      {/* Header card */}
      <section className={styles.headerCard}>
        <div className={styles.identity}>
          <div className={styles.avatarWrap}>
            <Avatar name={user?.fullName} size="xl" />
            <button className={styles.avatarBtn} aria-label="Change avatar">
              <Camera size={14} />
            </button>
          </div>
          <div>
            <h2>{user?.fullName}</h2>
            <p>{user?.email}</p>
            <div className={styles.headerBadges}>
              <Badge tone={user?.kycStatus === 'verified' ? 'success' : 'warning'}>
                <BadgeCheck size={11} /> KYC {user?.kycStatus || 'pending'}
              </Badge>
              <Badge tone="primary">Premier member</Badge>
              <Badge tone="neutral">Joined {formatDate(user?.joinedAt)}</Badge>
            </div>
          </div>
        </div>

        <nav className={styles.tabs}>
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`${styles.tab} ${tab === id ? styles.activeTab : ''}`}
              onClick={() => setTab(id)}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </nav>
      </section>

      {/* Tab content */}
      <section className={styles.tabContent}>
        {tab === 'personal' && (
          <form className={styles.form} onSubmit={saveProfile}>
            <h3>Personal information</h3>
            <p className={styles.lead}>Used for account communications and required for verification.</p>
            <div className={styles.formGrid}>
              <InputField label="Full name" iconLeft={<User size={18} />} value={profile.fullName} onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} />
              <InputField label="Email" type="email" iconLeft={<Mail size={18} />} value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
              <InputField label="Phone" type="tel" iconLeft={<Phone size={18} />} value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
            </div>
            <div className={styles.formActions}>
              <Button type="submit" loading={profileSaving}>Save changes</Button>
            </div>
          </form>
        )}

        {tab === 'security' && (
          <div className={styles.securityWrap}>
            <form className={styles.form} onSubmit={savePassword}>
              <h3>Change password</h3>
              <p className={styles.lead}>Pick something memorable but strong. We never store passwords in plain text.</p>
              <div className={styles.formGrid}>
                <InputField label="Current password" type="password" value={pwd.currentPassword} onChange={(e) => setPwd({ ...pwd, currentPassword: e.target.value })} />
                <InputField label="New password" type="password" value={pwd.newPassword} onChange={(e) => setPwd({ ...pwd, newPassword: e.target.value })} hint="At least 6 characters" />
                <InputField label="Confirm new password" type="password" value={pwd.confirmPassword} onChange={(e) => setPwd({ ...pwd, confirmPassword: e.target.value })} />
              </div>
              <div className={styles.formActions}>
                <Button type="submit" loading={pwdSaving}>Update password</Button>
              </div>
            </form>

            <div className={styles.toggleCard}>
              <div className={styles.toggleRow}>
                <div>
                  <h4>Two-factor authentication</h4>
                  <p>Add an extra layer of protection at sign-in.</p>
                </div>
                <ToggleSwitch checked={security.twoFactorEnabled} onChange={() => toggleSetting('twoFactorEnabled')} />
              </div>
              <div className={styles.toggleRow}>
                <div>
                  <h4>Sign-in alerts</h4>
                  <p>Get notified by email when a new device signs in.</p>
                </div>
                <ToggleSwitch checked={security.loginAlerts} onChange={() => toggleSetting('loginAlerts')} />
              </div>
            </div>
          </div>
        )}

        {tab === 'notifications' && (
          <div className={styles.toggleCard}>
            <h3 style={{ marginBottom: 6 }}>Notification preferences</h3>
            <p className={styles.lead}>Control what we send you and where.</p>
            {[
              { key: 'productUpdates',   title: 'Product updates',     body: 'New plans, features, and changes that affect you.' },
              { key: 'investmentAlerts', title: 'Investment alerts',   body: 'When a position matures, distributes, or hits a price target.' },
              { key: 'weeklyDigest',     title: 'Weekly digest',       body: 'Sunday morning summary of portfolio activity.' },
              { key: 'marketingEmails',  title: 'Marketing & research',body: 'Long-form research and member-only events.' },
            ].map((row, i) => (
              <div key={row.key} className={styles.toggleRow}>
                <div>
                  <h4>{row.title}</h4>
                  <p>{row.body}</p>
                </div>
                <ToggleSwitch checked={i < 3} onChange={() => toast.success('Preferences saved.')} />
              </div>
            ))}
          </div>
        )}
      </section>
    </AuthLayout>
  );
};

const ToggleSwitch = ({ checked, onChange }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={onChange}
    className={`${styles.toggle} ${checked ? styles.toggleOn : ''}`}
  >
    <span />
  </button>
);

export default Profile;
