import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, TrendingUp, Shield, Zap, Globe, Activity, BarChart3,
} from 'lucide-react';
import Logo from '@/components/Logo/Logo';
import Button from '@/components/Button/Button';
import Badge from '@/components/Badge/Badge';
import styles from './Landing.module.scss';

const FEATURES = [
  { icon: Activity,  label: 'Live markets',     desc: 'Forex, crypto, stocks & commodities' },
  { icon: BarChart3, label: 'Advanced charts',  desc: 'Pro-grade tools and indicators' },
  { icon: Shield,    label: 'Bank-grade security', desc: '2FA, biometrics, segregated accounts' },
  { icon: Zap,       label: 'Instant trades',   desc: 'Sub-second execution, zero hidden fees' },
];

const Landing = () => (
  <div className={styles.shell}>
    <header className={styles.nav}>
      <Logo />
      <nav className={styles.navLinks}>
        <Link to="/markets">Markets</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/portfolio">Portfolio</Link>
        <Link to="/analytics">Analytics</Link>
      </nav>
      <div className={styles.navActions}>
        <Link to="/login" className={styles.signIn}>Sign in</Link>
        <Button to="/register" size="sm" iconRight={<ArrowRight size={14} />}>Open account</Button>
      </div>
    </header>

    <main className={styles.hero}>
      <div className={styles.glow1} />
      <div className={styles.glow2} />

      <motion.section
        className={styles.heroLeft}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <Badge tone="primary" size="sm">
          <span className={styles.pulseDot} /> Live · Markets open
        </Badge>
        <h1 className={styles.title}>
          Trade with <span className={styles.gradient}>confidence.</span>
          <br />Grow with intelligence.
        </h1>
        <p className={styles.lede}>
          A premium trading platform built for serious investors.
          Live markets, deep analytics, and a beautiful workspace — all in one place.
        </p>

        <div className={styles.heroActions}>
          <Button to="/dashboard" size="lg" iconRight={<ArrowRight size={16} />}>Launch dashboard</Button>
          <Button to="/markets" variant="secondary" size="lg">View markets</Button>
        </div>

        <ul className={styles.heroStats}>
          <li><strong>$3.2B+</strong><span>Assets traded</span></li>
          <li><strong>72k</strong><span>Active traders</span></li>
          <li><strong>0.0pip</strong><span>Spreads from</span></li>
        </ul>
      </motion.section>

      <motion.section
        className={styles.heroRight}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className={styles.preview}>
          <div className={styles.previewHead}>
            <div className={styles.previewDots}><span /><span /><span /></div>
            <span className={styles.previewLabel}>Flexrr.app · live</span>
            <span className={styles.previewBadge}>● LIVE</span>
          </div>

          <div className={styles.previewMetrics}>
            <div><span>Available</span><strong>$12,450</strong></div>
            <div><span>Invested</span><strong>$184,230</strong></div>
            <div><span>Profit</span><strong className={styles.posVal}>+$47,820</strong></div>
            <div><span>Equity</span><strong>$312,890</strong></div>
          </div>

          <div className={styles.previewTable}>
            <div className={styles.row}>
              <span className={styles.sym}>EURUSD</span>
              <span className={styles.sell}>1.1240</span>
              <span className={styles.buy}>1.1248</span>
              <span className={styles.up}><TrendingUp size={11} /> 0.38%</span>
            </div>
            <div className={styles.row}>
              <span className={styles.sym}>BTCUSD</span>
              <span className={styles.sell}>71,245</span>
              <span className={styles.buy}>71,262</span>
              <span className={styles.up}><TrendingUp size={11} /> 1.39%</span>
            </div>
            <div className={styles.row}>
              <span className={styles.sym}>NVDA</span>
              <span className={styles.sell}>921.30</span>
              <span className={styles.buy}>921.78</span>
              <span className={styles.up}><TrendingUp size={11} /> 1.36%</span>
            </div>
            <div className={styles.row}>
              <span className={styles.sym}>TSLA</span>
              <span className={styles.sell}>264.80</span>
              <span className={styles.buy}>265.12</span>
              <span className={styles.down}>−1.21%</span>
            </div>
          </div>

          <div className={styles.previewChart}>
            <svg viewBox="0 0 320 80" preserveAspectRatio="none" width="100%" height="100%">
              <defs>
                <linearGradient id="hG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00d1ff" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#00d1ff" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0,60 L20,52 L40,58 L60,40 L80,46 L100,30 L120,38 L140,28 L160,34 L180,22 L200,30 L220,18 L240,24 L260,14 L280,20 L300,10 L320,8 L320,80 L0,80 Z"
                fill="url(#hG)"
              />
              <path
                d="M0,60 L20,52 L40,58 L60,40 L80,46 L100,30 L120,38 L140,28 L160,34 L180,22 L200,30 L220,18 L240,24 L260,14 L280,20 L300,10 L320,8"
                fill="none" stroke="#00d1ff" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </motion.section>
    </main>

    <footer className={styles.bottom}>
      <ul className={styles.features}>
        {FEATURES.map((f) => (
          <li key={f.label}>
            <span className={styles.featIcon}><f.icon size={14} /></span>
            <div>
              <strong>{f.label}</strong>
              <span>{f.desc}</span>
            </div>
          </li>
        ))}
      </ul>
    </footer>
  </div>
);

export default Landing;
