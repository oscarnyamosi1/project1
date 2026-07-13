import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import Logo from '@/components/Logo/Logo';
import styles from './AuthSplitLayout.module.scss';

const AuthSplitLayout = ({ title, subtitle, footer, children }) => (
  <div className={styles.split}>
    <div className={styles.formSide}>
      <header className={styles.header}>
        <Link to="/"><Logo /></Link>
        <Link to="/" className={styles.backLink}>← Back to home</Link>
      </header>

      <motion.div
        className={styles.formWrap}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        <div className={styles.form}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </motion.div>

      <p className={styles.fineprint}>
        © {new Date().getFullYear()} Flexrr. Trading involves risk. Trade responsibly.
      </p>
    </div>

    <aside className={styles.visualSide}>
      <div className={styles.glow} />
      <div className={styles.glow2} />

      <div className={styles.visualInner}>
        <motion.div
          className={styles.previewCard}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.cardHead}>
            <span className={styles.dots}><i /><i /><i /></span>
            <span className={styles.cardTitle}>Flexrr.app</span>
            <span className={styles.live}>● LIVE</span>
          </div>
          <div className={styles.metrics}>
            <div><span>Available</span><strong>$12,450</strong></div>
            <div><span>Equity</span><strong>$312,890</strong></div>
            <div><span>Profit</span><strong className={styles.up}>+$47,820</strong></div>
          </div>
          <div className={styles.chart}>
            <svg viewBox="0 0 280 100" preserveAspectRatio="none" width="100%" height="100%">
              <defs>
                <linearGradient id="aFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00d1ff" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#00d1ff" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,80 L20,72 L40,76 L60,58 L80,64 L100,46 L120,52 L140,38 L160,44 L180,30 L200,36 L220,22 L240,28 L260,14 L280,10 L280,100 L0,100 Z" fill="url(#aFill)" />
              <path d="M0,80 L20,72 L40,76 L60,58 L80,64 L100,46 L120,52 L140,38 L160,44 L180,30 L200,36 L220,22 L240,28 L260,14 L280,10" fill="none" stroke="#00d1ff" strokeWidth="2" strokeLinejoin="round" />
            </svg>
          </div>
          <div className={styles.row}>
            <span className={styles.sym}>BTCUSD</span>
            <span className={styles.sell}>71,245</span>
            <span className={styles.buy}>71,262</span>
            <span className={styles.upPill}><TrendingUp size={11} /> 1.39%</span>
          </div>
          <div className={styles.row}>
            <span className={styles.sym}>EURUSD</span>
            <span className={styles.sell}>1.1240</span>
            <span className={styles.buy}>1.1248</span>
            <span className={styles.upPill}><TrendingUp size={11} /> 0.38%</span>
          </div>
        </motion.div>

        <motion.blockquote
          className={styles.quote}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <p>“The trading workspace I always wanted to exist. Live, fast, and beautiful.”</p>
          <footer>
            <strong>Mara Chen</strong>
            <span>Active trader since 2018</span>
          </footer>
        </motion.blockquote>

        <motion.div
          className={styles.statRow}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <div><span>$3.2B</span><small>Volume traded</small></div>
          <div><span>72k+</span><small>Active traders</small></div>
          <div><span>0.0p</span><small>Spreads from</small></div>
        </motion.div>
      </div>
    </aside>
  </div>
);

export default AuthSplitLayout;
