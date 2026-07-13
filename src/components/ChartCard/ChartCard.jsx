import { motion } from 'framer-motion';
import styles from './ChartCard.module.scss';

const ChartCard = ({ title, subtitle, action, children, height = 280, delay = 0 }) => (
  <motion.section
    className={styles.card}
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
  >
    <header className={styles.header}>
      <div>
        {title && <h3 className={styles.title}>{title}</h3>}
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      {action && <div className={styles.action}>{action}</div>}
    </header>
    <div className={styles.body} style={{ height }}>{children}</div>
  </motion.section>
);

export default ChartCard;
