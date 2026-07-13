import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Logo from '@/components/Logo/Logo';
import Button from '@/components/Button/Button';
import styles from './Navbar.module.scss';

const NAV = [
  { label: 'Platform', to: '/#platform' },
  { label: 'Plans',    to: '/#plans' },
  { label: 'Approach', to: '/#approach' },
  { label: 'FAQ',      to: '/#faq' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <header className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand} aria-label="Flexrr.">
          <Logo />
        </Link>

        <nav className={styles.links}>
          {NAV.map((item) => (
            <a key={item.label} href={item.to} className={styles.link}>{item.label}</a>
          ))}
        </nav>

        <div className={styles.actions}>
          <Button to="/login" variant="ghost" size="md">Sign in</Button>
          <Button to="/register" size="md">Open account</Button>
        </div>

        <button
          className={styles.menu}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className={styles.mobile}>
          {NAV.map((item) => (
            <a key={item.label} href={item.to} className={styles.mobileLink} onClick={() => setOpen(false)}>
              {item.label}
            </a>
          ))}
          <div className={styles.mobileActions}>
            <Button to="/login" variant="secondary" fullWidth>Sign in</Button>
            <Button to="/register" fullWidth>Open account</Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
