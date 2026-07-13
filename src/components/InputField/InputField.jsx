import { useState, forwardRef, useId } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import styles from './InputField.module.scss';

const InputField = forwardRef(({
  label,
  hint,
  error,
  type = 'text',
  iconLeft,
  iconRight,
  className = '',
  id,
  ...rest
}, ref) => {
  const reactId = useId();
  const inputId = id || reactId;
  const [visible, setVisible] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (visible ? 'text' : 'password') : type;

  return (
    <div className={`${styles.field} ${error ? styles.hasError : ''} ${className}`}>
      {label && <label htmlFor={inputId} className={styles.label}>{label}</label>}
      <div className={styles.wrap}>
        {iconLeft && <span className={`${styles.icon} ${styles.left}`}>{iconLeft}</span>}
        <input
          ref={ref}
          id={inputId}
          type={inputType}
          className={`${styles.input} ${iconLeft ? styles.padLeft : ''} ${(isPassword || iconRight) ? styles.padRight : ''}`}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            className={`${styles.icon} ${styles.right} ${styles.toggle}`}
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? 'Hide password' : 'Show password'}
          >
            {visible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
        {!isPassword && iconRight && <span className={`${styles.icon} ${styles.right}`}>{iconRight}</span>}
      </div>
      {error ? (
        <span className={styles.error}>{error}</span>
      ) : hint ? (
        <span className={styles.hint}>{hint}</span>
      ) : null}
    </div>
  );
});

InputField.displayName = 'InputField';

export default InputField;
