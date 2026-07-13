import { useState, useCallback } from 'react';
import Sidebar from '@/components/Sidebar/Sidebar';
import Topbar from '@/components/Topbar/Topbar';
import styles from './AuthLayout.module.scss';

const AuthLayout = ({ title, subtitle, hideMetrics = false, rightPanel, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openSidebar  = useCallback(() => setSidebarOpen(true),  []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <div className={styles.shell}>
      <Sidebar open={sidebarOpen} onClose={closeSidebar} />

      {sidebarOpen && (
        <div className={styles.overlay} onClick={closeSidebar} aria-hidden="true" />
      )}

      <main className={styles.main}>
        <Topbar
          title={title}
          subtitle={subtitle}
          hideMetrics={hideMetrics}
          onMenuOpen={openSidebar}
        />
        <div className={`${styles.body} ${rightPanel ? styles.bodyWithPanel : ''}`}>
          <div className={styles.content}>{children}</div>
          {rightPanel && <aside className={styles.rightPanel}>{rightPanel}</aside>}
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
