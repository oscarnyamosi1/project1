import { useState } from 'react';
import { Lock, Shield, Globe, Moon, Bell, Smartphone, Mail, Key } from 'lucide-react';
import AuthLayout from '@/layouts/AuthLayout';
import Button from '@/components/Button/Button';
import InputField from '@/components/InputField/InputField';
import Badge from '@/components/Badge/Badge';
import { useToast } from '@/context/ToastContext';
import styles from './Settings.module.scss';

const TABS = [
  { id: 'preferences', label: 'Preferences', icon: Globe },
  { id: 'password',    label: 'Password',    icon: Lock },
  { id: 'security',    label: 'Security',    icon: Shield },
];

const Settings = () => {
  const [tab, setTab] = useState('preferences');
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const toast = useToast();

  const savePw = (e) => {
    e.preventDefault();
    if (pw.next.length < 8) return toast.error('Password must be at least 8 characters.');
    if (pw.next !== pw.confirm) return toast.error('Passwords do not match.');
    toast.success('Password updated successfully.');
    setPw({ current: '', next: '', confirm: '' });
  };

  return (
    <AuthLayout title="Settings" subtitle="Customize your workspace, security, and notification preferences.">
      <div className={styles.layout}>
        <aside className={styles.tabs}>
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`${styles.tabBtn} ${tab === t.id ? styles.tabActive : ''}`}
              onClick={() => setTab(t.id)}
            >
              <t.icon size={16} />
              <span>{t.label}</span>
            </button>
          ))}
        </aside>

        <section className={styles.panel}>
          {tab === 'preferences' && (
            <>
              <header className={styles.panelHead}>
                <h2>Preferences</h2>
                <p>Localization, theme, and display preferences for your workspace.</p>
              </header>

              <div className={styles.row}>
                <div className={styles.rowLeft}>
                  <span className={styles.rowIcon}><Moon size={16} /></span>
                  <div>
                    <strong>Appearance</strong>
                    <p>The platform always uses our trader-optimized dark theme for reduced eye strain.</p>
                  </div>
                </div>
                <Badge tone="primary" size="sm">Dark · Active</Badge>
              </div>

              <div className={styles.row}>
                <div className={styles.rowLeft}>
                  <span className={styles.rowIcon}><Globe size={16} /></span>
                  <div>
                    <strong>Language & region</strong>
                    <p>How dates, numbers, and currencies are displayed.</p>
                  </div>
                </div>
                <select className={styles.select} defaultValue="en-US">
                  <option value="en-US">English (United States)</option>
                  <option value="en-GB">English (UK)</option>
                  <option value="de-DE">Deutsch</option>
                  <option value="es-ES">Español</option>
                  <option value="fr-FR">Français</option>
                </select>
              </div>

              <div className={styles.row}>
                <div className={styles.rowLeft}>
                  <span className={styles.rowIcon}>$</span>
                  <div>
                    <strong>Display currency</strong>
                    <p>All balances will be normalized to this currency.</p>
                  </div>
                </div>
                <select className={styles.select} defaultValue="USD">
                  <option value="USD">USD — US Dollar</option>
                  <option value="EUR">EUR — Euro</option>
                  <option value="GBP">GBP — British Pound</option>
                  <option value="JPY">JPY — Japanese Yen</option>
                </select>
              </div>

              <div className={styles.row}>
                <div className={styles.rowLeft}>
                  <span className={styles.rowIcon}><Bell size={16} /></span>
                  <div>
                    <strong>Email notifications</strong>
                    <p>Investment updates, market alerts, and security events.</p>
                  </div>
                </div>
                <label className={styles.toggle}>
                  <input type="checkbox" defaultChecked />
                  <i />
                </label>
              </div>

              <div className={styles.row}>
                <div className={styles.rowLeft}>
                  <span className={styles.rowIcon}><Smartphone size={16} /></span>
                  <div>
                    <strong>Push notifications</strong>
                    <p>Real-time alerts on your devices.</p>
                  </div>
                </div>
                <label className={styles.toggle}>
                  <input type="checkbox" defaultChecked />
                  <i />
                </label>
              </div>
            </>
          )}

          {tab === 'password' && (
            <>
              <header className={styles.panelHead}>
                <h2>Change password</h2>
                <p>Choose a strong password to protect your account.</p>
              </header>
              <form onSubmit={savePw} className={styles.form}>
                <InputField
                  label="Current password"
                  type="password"
                  value={pw.current}
                  onChange={(e) => setPw({ ...pw, current: e.target.value })}
                  iconLeft={<Lock size={16} />}
                />
                <InputField
                  label="New password"
                  type="password"
                  value={pw.next}
                  onChange={(e) => setPw({ ...pw, next: e.target.value })}
                  hint="At least 8 characters, mix of letters, numbers, and symbols."
                  iconLeft={<Key size={16} />}
                />
                <InputField
                  label="Confirm new password"
                  type="password"
                  value={pw.confirm}
                  onChange={(e) => setPw({ ...pw, confirm: e.target.value })}
                  iconLeft={<Key size={16} />}
                />
                <div className={styles.formActions}>
                  <Button type="submit">Update password</Button>
                </div>
              </form>
            </>
          )}

          {tab === 'security' && (
            <>
              <header className={styles.panelHead}>
                <h2>Security</h2>
                <p>Two-factor, devices, and account-level security controls.</p>
              </header>

              <div className={styles.row}>
                <div className={styles.rowLeft}>
                  <span className={styles.rowIcon}><Shield size={16} /></span>
                  <div>
                    <strong>Two-factor authentication</strong>
                    <p>Adds an extra step at sign-in using an authenticator app.</p>
                  </div>
                </div>
                <label className={styles.toggle}>
                  <input type="checkbox" defaultChecked />
                  <i />
                </label>
              </div>

              <div className={styles.row}>
                <div className={styles.rowLeft}>
                  <span className={styles.rowIcon}><Mail size={16} /></span>
                  <div>
                    <strong>Login alerts</strong>
                    <p>Get an email whenever a new device signs in.</p>
                  </div>
                </div>
                <label className={styles.toggle}>
                  <input type="checkbox" defaultChecked />
                  <i />
                </label>
              </div>

              <div className={styles.row}>
                <div className={styles.rowLeft}>
                  <span className={styles.rowIcon}><Smartphone size={16} /></span>
                  <div>
                    <strong>Trusted devices</strong>
                    <p>3 devices currently trusted on your account.</p>
                  </div>
                </div>
                <Button variant="secondary" size="sm">Manage</Button>
              </div>

              <div className={`${styles.row} ${styles.danger}`}>
                <div className={styles.rowLeft}>
                  <span className={`${styles.rowIcon} ${styles.dangerIcon}`}><Lock size={16} /></span>
                  <div>
                    <strong>Sign out everywhere</strong>
                    <p>End all active sessions across devices.</p>
                  </div>
                </div>
                <Button variant="danger" size="sm">Sign out all</Button>
              </div>
            </>
          )}
        </section>
      </div>
    </AuthLayout>
  );
};

export default Settings;
