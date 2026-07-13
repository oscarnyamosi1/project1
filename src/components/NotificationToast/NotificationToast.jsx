import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import styles from './NotificationToast.module.scss';

const ICONS = {
  success: <CheckCircle2 size={18} />,
  error:   <AlertCircle size={18} />,
  warning: <AlertTriangle size={18} />,
  info:    <Info size={18} />,
};

const NotificationToast = ({ toasts, onDismiss }) => {
  if (typeof document === 'undefined') return null;
  return createPortal(
    <div className={styles.stack} aria-live="polite">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, x: 24, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 24, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className={`${styles.toast} ${styles[t.type] || styles.info}`}
          >
            <span className={styles.icon}>{ICONS[t.type] || ICONS.info}</span>
            <div className={styles.body}>
              {t.title && <p className={styles.title}>{t.title}</p>}
              <p className={styles.message}>{t.message}</p>
            </div>
            <button className={styles.close} onClick={() => onDismiss(t.id)} aria-label="Dismiss">
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>,
    document.body,
  );
};

export default NotificationToast;
