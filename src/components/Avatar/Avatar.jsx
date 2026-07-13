import { initials } from '@/utils/formatters';
import styles from './Avatar.module.scss';

const Avatar = ({ name = '', src, size = 'md' }) => (
  <div className={`${styles.avatar} ${styles[size]}`}>
    {src ? <img src={src} alt={name} /> : <span>{initials(name)}</span>}
  </div>
);

export default Avatar;
