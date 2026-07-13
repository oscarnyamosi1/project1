import styles from './Badge.module.scss';

const Badge = ({ children, tone = 'neutral', size = 'md', className = '' }) => (
  <span className={`${styles.badge} ${styles[tone]} ${styles[size]} ${className}`}>
    {children}
  </span>
);

export default Badge;
