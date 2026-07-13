import styles from './Logo.module.scss';

const Logo = ({ tone = 'dark', compact = false }) => (
  <div className={`${styles.logo} ${styles[tone]} ${compact ? styles.compact : ''}`}>
    {/* <span className={styles.mark} aria-hidden="true">
      <svg viewBox="0 0 32 32" width="100%" height="100%">
        <defs>
          <linearGradient id="logoG" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#00d1ff" />
            <stop offset="100%" stopColor="#14d6b1" />
          </linearGradient>
        </defs>
        <path
          d="M5 25 L13 8 L19 19 L24 12 L27 25"
          fill="none"
          stroke="url(#logoG)"
          strokeWidth="2.6"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg> 
    </span>
    {!compact && (
      <span className={styles.text}>
        Flexrr<span className={styles.dot}>.</span>
      </span>
    )}*/}

    <img src="/logo.png" className='logoImage' alt="Flexrr logo" />
  </div>
);

export default Logo;
