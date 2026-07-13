import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import styles from './StatCard.module.scss';

const StatCard = ({ label, value, change, icon, accent = 'primary', delay = 0 }) => {
  const isPositive = change != null && change >= 0;

  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={styles.head}>
        <span className={styles.label}>{label}</span>
        {icon && <span className={`${styles.icon} ${styles[accent]}`}>{icon}</span>}
      </div>
      <div className={styles.value}>{value}</div>
      {change != null && (
        <div className={`${styles.change} ${isPositive ? styles.up : styles.down}`}>
          {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          <span>{Math.abs(change).toFixed(1)}%</span>
          <span className={styles.changeLabel}>vs last month</span>
        </div>
      )}
    </motion.div>
  );
};

export default StatCard;
