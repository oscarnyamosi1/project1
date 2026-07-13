import { Link } from 'react-router-dom';
import styles from './Button.module.scss';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  to,
  href,
  type = 'button',
  fullWidth = false,
  loading = false,
  disabled = false,
  iconLeft,
  iconRight,
  onClick,
  className = '',
  ...rest
}) => {
  const cls = [
    styles.btn,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : '',
    loading ? styles.loading : '',
    className,
  ].filter(Boolean).join(' ');

  const inner = (
    <>
      {loading && <span className={styles.spinner} aria-hidden="true" />}
      {!loading && iconLeft && <span className={styles.icon}>{iconLeft}</span>}
      <span className={styles.label}>{children}</span>
      {!loading && iconRight && <span className={styles.icon}>{iconRight}</span>}
    </>
  );

  if (to) return <Link to={to} className={cls} {...rest}>{inner}</Link>;
  if (href) return <a href={href} className={cls} {...rest}>{inner}</a>;
  return (
    <button type={type} disabled={disabled || loading} onClick={onClick} className={cls} {...rest}>
      {inner}
    </button>
  );
};

export default Button;
