import { motion } from 'framer-motion';
import { ArrowDownLeft, ArrowUpRight, TrendingUp, Banknote } from 'lucide-react';
import Badge from '@/components/Badge/Badge';
import { formatCurrency, formatDateTime } from '@/utils/formatters';
import styles from './TransactionTable.module.scss';

const TYPE_META = {
  deposit:    { icon: <ArrowDownLeft size={16} />, tone: 'success', label: 'Deposit' },
  withdrawal: { icon: <ArrowUpRight size={16} />,  tone: 'warning', label: 'Withdrawal' },
  investment: { icon: <Banknote size={16} />,      tone: 'primary', label: 'Investment' },
  profit:     { icon: <TrendingUp size={16} />,    tone: 'accent',  label: 'Profit' },
};

const STATUS_TONE = {
  completed: 'success',
  pending:   'warning',
  failed:    'danger',
};

const TransactionTable = ({ transactions = [], compact = false }) => {
  if (!transactions.length) {
    return <div className={styles.empty}>No transactions to display.</div>;
  }

  return (
    <div className={styles.scroll}>
      <table className={`${styles.table} ${compact ? styles.compact : ''}`}>
        <thead>
          <tr>
            <th>Type</th>
            <th>Reference</th>
            <th className={styles.amount}>Amount</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t, i) => {
            const meta = TYPE_META[t.type] || TYPE_META.investment;
            const sign = t.type === 'withdrawal' || t.type === 'investment' ? '−' : '+';
            return (
              <motion.tr
                key={t.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.025 }}
              >
                <td>
                  <div className={styles.typeCell}>
                    <span className={`${styles.typeIcon} ${styles[meta.tone]}`}>{meta.icon}</span>
                    <div>
                      <span className={styles.typeLabel}>{meta.label}</span>
                      <span className={styles.typeMethod}>{t.method}</span>
                    </div>
                  </div>
                </td>
                <td className={styles.reference}>{t.reference}</td>
                <td className={`${styles.amount} ${sign === '+' ? styles.plus : styles.minus}`}>
                  {sign} {formatCurrency(t.amount, 'USD', 2)}
                </td>
                <td>
                  <Badge tone={STATUS_TONE[t.status] || 'neutral'} size="sm">{t.status}</Badge>
                </td>
                <td className={styles.date}>{formatDateTime(t.date)}</td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
