import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, CandlestickChart, PieChart as PieIcon,
  Wallet as WalletIcon, ArrowLeftRight, Activity,
  UserCircle2, Settings as SettingsIcon, LogOut,
  ChevronsLeft, ChevronsRight, LifeBuoy, X,
  TrendingUp, GraduationCap, ShieldCheck, ArrowDownToLine,
  Sun, Moon, Leaf,
} from 'lucide-react';
import Logo from '@/components/Logo/Logo';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import styles from './Sidebar.module.scss';

const NAV_PRIMARY = [
  { to: '/dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
  { to: '/markets',      label: 'Markets',      icon: CandlestickChart },
  { to: '/portfolio',    label: 'Portfolio',    icon: PieIcon },
  { to: '/wallet',       label: 'Wallet',       icon: WalletIcon },
  { to: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { to: '/analytics',    label: 'Analytics',    icon: Activity },
];

const NAV_TRADING = [
  { to: '/live-trading',   label: 'Live Trading',   icon: TrendingUp },
  { to: '/demo-trading',   label: 'Demo Trading',   icon: GraduationCap },
  { to: '/deposit',        label: 'Deposit',        icon: ArrowDownToLine },
  { to: '/admin-controls', label: 'Admin Controls', icon: ShieldCheck },
];

const NAV_SECONDARY = [
  { to: '/profile',  label: 'Profile',  icon: UserCircle2 },
  { to: '/settings', label: 'Settings', icon: SettingsIcon },
];

const THEME_CYCLE  = ['dark', 'jungle', 'light'];
const THEME_ICONS  = { dark: Moon, jungle: Leaf, light: Sun };
const THEME_LABELS = { dark: 'Dark', jungle: 'Jungle', light: 'Light' };

const Sidebar = ({ open = false, onClose }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const cycleTheme = () => {
    const next = THEME_CYCLE[(THEME_CYCLE.indexOf(theme) + 1) % THEME_CYCLE.length];
    setTheme(next);
  };

  const ThemeIcon = THEME_ICONS[theme] || Moon;

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''} ${open ? styles.open : ''}`}>
      <div className={styles.brand}>
        {collapsed ? <Logo compact /> : <Logo />}
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close menu">
          <X size={18} />
        </button>
      </div>

      <nav className={styles.nav}>
        <span className={styles.navLabel}>Flexrr Trading</span>
        {NAV_TRADING.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
            title={label}
            onClick={handleNavClick}
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}

        <span className={styles.navLabel}>Workspace</span>
        {NAV_PRIMARY.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
            title={label}
            onClick={handleNavClick}
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}

        <span className={styles.navLabel} style={{ marginTop: 'auto' }}>Account</span>
        {NAV_SECONDARY.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
            title={label}
            onClick={handleNavClick}
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className={styles.bottom}>
        <button
          className={`${styles.link} ${styles.themeBtn}`}
          onClick={cycleTheme}
          title={`Theme: ${THEME_LABELS[theme]}`}
        >
          <ThemeIcon size={18} />
          <span>Theme: {THEME_LABELS[theme]}</span>
        </button>
        <button className={styles.link} title="Help center">
          <LifeBuoy size={18} />
          <span>Help</span>
        </button>
        <button className={`${styles.link} ${styles.logout}`} onClick={handleLogout} title="Sign out">
          <LogOut size={18} />
          <span>Sign out</span>
        </button>
        <button
          className={styles.collapseBtn}
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronsRight size={14} /> : <ChevronsLeft size={14} />}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
