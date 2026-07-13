import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Github, Mail } from 'lucide-react';
import Logo from '@/components/Logo/Logo';
import Button from '@/components/Button/Button';
import InputField from '@/components/InputField/InputField';
import styles from './Footer.module.scss';

const COLUMNS = [
  {
    title: 'Platform',
    links: [
      { label: 'Investments', to: '/investments' },
      { label: 'Wallet',      to: '/wallet' },
      { label: 'Dashboard',   to: '/dashboard' },
      { label: 'Pricing',     to: '/#plans' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About',     to: '#' },
      { label: 'Approach',  to: '/#approach' },
      { label: 'Press',     to: '#' },
      { label: 'Careers',   to: '#' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Help center', to: '#' },
      { label: 'Research',    to: '#' },
      { label: 'Disclosures', to: '#' },
      { label: 'Contact',     to: '#' },
    ],
  },
];

const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.inner}>
      <div className={styles.top}>
        <div className={styles.brand}>
          <Logo tone="light" />
          <p className={styles.tagline}>
            A modern trading platform for people who take their money seriously.
            Diversified portfolios, transparent fees, and an advisory team that picks up the phone.
          </p>
          <div className={styles.social}>
            <a href="#" aria-label="Twitter"><Twitter size={16} /></a>
            <a href="#" aria-label="LinkedIn"><Linkedin size={16} /></a>
            <a href="#" aria-label="GitHub"><Github size={16} /></a>
            <a href="#" aria-label="Email"><Mail size={16} /></a>
          </div>
        </div>

        <div className={styles.columns}>
          {COLUMNS.map((col) => (
            <div key={col.title} className={styles.column}>
              <h4>{col.title}</h4>
              <ul>
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <form className={styles.newsletter} onSubmit={(e) => e.preventDefault()}>
          <h4>Quarterly briefing</h4>
          <p>Field notes from our research team. Slow, deliberate, no spam.</p>
          <div className={styles.newsletterForm}>
            <InputField type="email" placeholder="you@email.com" aria-label="Email" />
            <Button type="submit">Subscribe</Button>
          </div>
        </form>
      </div>

      <div className={styles.bottom}>
        <span>© {new Date().getFullYear()} Flexrr., Inc. All rights reserved.</span>
        <div className={styles.bottomLinks}>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Disclosures</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
