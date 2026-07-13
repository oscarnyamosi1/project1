import { motion } from 'framer-motion';
import { TrendingUp, Clock, Shield } from 'lucide-react';
import Badge from '@/components/Badge/Badge';
import Button from '@/components/Button/Button';
import { formatCurrency, formatCompact } from '@/utils/formatters';
import styles from './InvestmentCard.module.scss';

const RISK_TONE = { low: 'success', medium: 'accent', high: 'danger' };
const CATEGORY_LABEL = {
  'fixed-deposit': 'Fixed Deposit',
  'crypto': 'Crypto',
  'real-estate': 'Real Estate',
  'mutual-fund': 'Mutual Fund',
  'savings': 'Savings',
};

const InvestmentCard = ({ plan, onInvest, delay = 0 }) => (
  <motion.article
    className={styles.card}
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
  >
    <div className={styles.top}>
      <div>
        <Badge tone="primary" size="sm">{CATEGORY_LABEL[plan.category] || plan.category}</Badge>
        <h3 className={styles.title}>{plan.title}</h3>
      </div>
      <div className={styles.roi}>
        <span className={styles.roiValue}>{plan.roi}%</span>
        <span className={styles.roiLabel}>Annual ROI</span>
      </div>
    </div>

    <p className={styles.description}>{plan.description}</p>

    <div className={styles.meta}>
      <div className={styles.metaItem}>
        <span className={styles.metaIcon}><Clock size={14} /></span>
        <div>
          <span className={styles.metaLabel}>Duration</span>
          <span className={styles.metaValue}>{plan.duration}</span>
        </div>
      </div>
      <div className={styles.metaItem}>
        <span className={styles.metaIcon}><Shield size={14} /></span>
        <div>
          <span className={styles.metaLabel}>Risk</span>
          <Badge tone={RISK_TONE[plan.risk] || 'neutral'} size="sm">{plan.risk}</Badge>
        </div>
      </div>
      <div className={styles.metaItem}>
        <span className={styles.metaIcon}><TrendingUp size={14} /></span>
        <div>
          <span className={styles.metaLabel}>Minimum</span>
          <span className={styles.metaValue}>{formatCurrency(plan.minimum, 'USD', 0)}</span>
        </div>
      </div>
    </div>

    <footer className={styles.footer}>
      <span className={styles.aum}>
        {formatCompact(plan.aum)} <span>under management</span>
      </span>
      <Button onClick={() => onInvest?.(plan)}>Invest</Button>
    </footer>
  </motion.article>
);

export default InvestmentCard;
