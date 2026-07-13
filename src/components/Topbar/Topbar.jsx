import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell, Search, ChevronDown, LogOut, UserCircle2, Settings,
  TrendingUp, Wallet as WalletIcon, BarChart3, DollarSign, Menu,
} from 'lucide-react';
import Avatar from '@/components/Avatar/Avatar';
import Logo from '@/components/Logo/Logo';
import { useAuth } from '@/context/AuthContext';
import { mockNotifications, mockBalances } from '@/utils/mockData';
import { formatCurrency } from '@/utils/formatters';
import styles from './Topbar.module.scss';

const METRICS = [
  { key: 'available', label: 'Available',  value: mockBalances.walletBalance,  icon: WalletIcon, tone: 'cyan'   },
  { key: 'invested',  label: 'Invested',   value: mockBalances.accountBalance, icon: BarChart3,  tone: 'teal'   },
  { key: 'profit',    label: 'Profit',     value: mockBalances.totalProfit,    icon: TrendingUp, tone: 'green'  },
  { key: 'equity',    label: 'Equity',     value: mockBalances.portfolioValue, icon: DollarSign, tone: 'purple' },
];

const Topbar = ({ title, subtitle, hideMetrics = false, onMenuOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);
  const [openBell, setOpenBell] = useState(false);
  const menuRef = useRef(null);
  const bellRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpenMenu(false);
      if (bellRef.current && !bellRef.current.contains(e.target)) setOpenBell(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const unread = mockNotifications.filter((n) => n.unread).length;

  return (
    <header className={styles.topbar}>
      <div className={styles.topRow}>
        {/* Mobile-only: hamburger + logo */}
        <button
          className={styles.hamburger}
          onClick={onMenuOpen}
          aria-label="Open navigation"
        >
          <Menu size={20} />
        </button>

        <div className={styles.mobileLogo}>
          <Logo compact />
        </div>

        <div className={styles.titleBlock}>
          {title && <h1 className={styles.title}>{title}</h1>}
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>

        <div className={styles.right}>
          <div className={styles.search}>
            <Search size={15} />
            <input placeholder="Search markets, symbols…" />
            <kbd>⌘K</kbd>
          </div>

          <div className={styles.bell} ref={bellRef}>
            <button className={styles.iconBtn} onClick={() => setOpenBell((o) => !o)} aria-label="Notifications">
              <Bell size={17} />
              {unread > 0 && <span className={styles.dot}>{unread}</span>}
            </button>
            {openBell && (
              <div className={styles.dropdown}>
                <header className={styles.dropdownHead}>
                  <span>Notifications</span>
                  <button>Mark all read</button>
                </header>
                <ul className={styles.notifList}>
                  {mockNotifications.map((n) => (
                    <li key={n.id} className={`${styles.notif} ${n.unread ? styles.unread : ''}`}>
                      <span className={`${styles.notifTone} ${styles[n.type]}`} />
                      <div>
                        <strong>{n.title}</strong>
                        <p>{n.message}</p>
                        <time>{n.time}</time>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className={styles.user} ref={menuRef}>
            <button className={styles.userBtn} onClick={() => setOpenMenu((o) => !o)}>
              <Avatar name={user?.fullName || 'You'} size="sm" />
              <div className={styles.userInfo}>
                <span className={styles.userName}>{user?.fullName || 'Member'}</span>
                <span className={styles.userPlan}>Premier · Live</span>
              </div>
              <ChevronDown size={14} />
            </button>
            {openMenu && (
              <div className={styles.dropdown}>
                <button className={styles.menuItem} onClick={() => { setOpenMenu(false); navigate('/profile'); }}>
                  <UserCircle2 size={16} /> Profile
                </button>
                <button className={styles.menuItem} onClick={() => { setOpenMenu(false); navigate('/settings'); }}>
                  <Settings size={16} /> Settings
                </button>
                <div className={styles.divider} />
                <button className={`${styles.menuItem} ${styles.logout}`} onClick={handleLogout}>
                  <LogOut size={16} /> Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {!hideMetrics && (
        <div className={styles.metricsScroll}>
          <div className={styles.metrics}>
            {METRICS.map((m) => (
              <div key={m.key} className={`${styles.metric} ${styles[m.tone]}`}>
                <span className={styles.metricIcon}><m.icon size={14} /></span>
                <div>
                  <span className={styles.metricLabel}>{m.label}</span>
                  <strong className={styles.metricValue}>{formatCurrency(m.value, 'USD', 0)}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Topbar;
