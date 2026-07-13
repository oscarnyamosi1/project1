import styles from './Loader.module.scss';

const Loader = ({ size = 'md', label, fullPage = false }) => {
  const inner = (
    <div className={styles.wrap}>
      <span className={`${styles.dots} ${styles[size]}`}>
        <span /><span /><span />
      </span>
      {label && <span className={styles.label}>{label}</span>}
    </div>
  );

  if (fullPage) return <div className={styles.fullPage}>{inner}</div>;
  return inner;
};

export default Loader;
