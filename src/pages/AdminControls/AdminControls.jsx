import { useState } from 'react';
import { Lock, Unlock, Pause, Play, Wifi, WifiOff, ShieldCheck, AlertTriangle, TrendingUp } from 'lucide-react';
import AuthLayout from '@/layouts/AuthLayout';
import { useTrading } from '@/context/TradingContext';
import { useToast } from '@/context/ToastContext';
import styles from './AdminControls.module.scss';

const AdminLogin = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    const ok = onLogin(password);
    setLoading(false);
    if (!ok) { setError('Incorrect password. Hint: admin:Flexrr2024'); setPassword(''); }
  };

  return (
    <div className={styles.loginWrap}>
      <div className={styles.loginCard}>
        <div className={styles.loginIcon}><ShieldCheck size={32} /></div>
        <h2 className={styles.loginTitle}>Instructor Access</h2>
        <p className={styles.loginSub}>Enter the admin password to access market controls.</p>
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <input
            type="password"
            className={styles.loginInput}
            value={password}
            onChange={e => { setPassword(e.target.value); setError(''); }}
            placeholder="Admin password"
            autoFocus
            required
          />
          {error && <p className={styles.loginError}>{error}</p>}
          <button type="submit" className={styles.loginBtn} disabled={loading}>
            {loading ? 'Verifying…' : 'Access Control Panel'}
          </button>
        </form>
        <p className={styles.loginHint}>Default credentials — admin: <code>Flexrr2024</code></p>
      </div>
    </div>
  );
};

const AdminPanel = () => {
  const { admin, prices, assets, setAdminRate, togglePause, toggleLiveValues } = useTrading();
  const toast = useToast();
  const [rateInput, setRateInput] = useState(String(admin.volatilityRate));

  const applyRate = () => {
    const v = parseFloat(rateInput);
    if (isNaN(v)) { toast.error('Enter a valid number (e.g. 2.5 or -1)'); return; }
    setAdminRate(v);
    toast.success(`Price Volatility Rate set to ${v > 0 ? '+' : ''}${v}%`, { title: 'Rate Applied' });
  };

  const handleTogglePause = () => {
    togglePause();
    toast[admin.isPaused ? 'success' : 'warning'](
      admin.isPaused ? 'Trading resumed. Students can now place orders.' : 'Trading paused. All order placement disabled.',
      { title: admin.isPaused ? 'Trading Resumed' : 'Trading Paused' }
    );
  };

  const handleToggleLive = () => {
    toggleLiveValues();
    toast.info(
      admin.useLiveValues ? 'Live values disabled. Admin rate is now active.' : 'Live market values enabled.',
      { title: 'Feed Mode Changed' }
    );
  };

  return (
    <div className={styles.panel}>
      <div className={styles.statusBar}>
        <div className={`${styles.statusChip} ${admin.isPaused ? styles.paused : styles.active}`}>
          {admin.isPaused ? <Pause size={13} /> : <Play size={13} />}
          {admin.isPaused ? 'Trading Paused' : 'Trading Active'}
        </div>
        <div className={`${styles.statusChip} ${admin.useLiveValues ? styles.live : styles.manual}`}>
          {admin.useLiveValues ? <Wifi size={13} /> : <WifiOff size={13} />}
          {admin.useLiveValues ? 'Live Feed' : 'Manual Rate'}
        </div>
        <div className={`${styles.statusChip} ${admin.volatilityRate > 0 ? styles.bull : admin.volatilityRate < 0 ? styles.bear : styles.neutral}`}>
          <TrendingUp size={13} />
          Rate: {admin.volatilityRate > 0 ? '+' : ''}{admin.volatilityRate}%
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardHead}>
            <TrendingUp size={18} className={styles.cardIcon} />
            <div>
              <h3 className={styles.cardTitle}>Price Volatility Rate</h3>
              <p className={styles.cardSub}>Artificially shift market prices in real-time</p>
            </div>
          </div>
          <div className={styles.rateInput}>
            <div className={styles.inputRow}>
              <input
                type="number"
                className={styles.bigInput}
                value={rateInput}
                onChange={e => setRateInput(e.target.value)}
                step="0.1"
                placeholder="0"
              />
              <span className={styles.pct}>%</span>
            </div>
            <p className={styles.rateHint}>
              Positive = bullish bias &nbsp;|&nbsp; Negative = bearish bias &nbsp;|&nbsp; 0 = natural movement
            </p>
            <input
              type="range"
              className={styles.slider}
              min="-10"
              max="10"
              step="0.1"
              value={rateInput}
              onChange={e => setRateInput(e.target.value)}
            />
            <div className={styles.sliderLabels}>
              <span>-10%</span>
              <span>0</span>
              <span>+10%</span>
            </div>
            <div className={styles.rateActions}>
              <button className={styles.presetBtn} onClick={() => setRateInput('-5')}>Bear -5%</button>
              <button className={styles.presetBtn} onClick={() => setRateInput('-2')}>Bear -2%</button>
              <button className={styles.presetBtn} onClick={() => setRateInput('0')}>Neutral</button>
              <button className={styles.presetBtn} onClick={() => setRateInput('2')}>Bull +2%</button>
              <button className={styles.presetBtn} onClick={() => setRateInput('5')}>Bull +5%</button>
            </div>
            <button className={styles.applyBtn} onClick={applyRate}>
              Apply Rate
            </button>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHead}>
            {admin.useLiveValues ? <Wifi size={18} className={styles.cardIconLive} /> : <WifiOff size={18} className={styles.cardIconOff} />}
            <div>
              <h3 className={styles.cardTitle}>Market Feed Mode</h3>
              <p className={styles.cardSub}>Toggle between live prices and admin-controlled rate</p>
            </div>
          </div>
          <div className={styles.toggleRow}>
            <div className={styles.toggleInfo}>
              <span className={styles.toggleLabel}>Use Live Market Values</span>
              <span className={styles.toggleDesc}>
                {admin.useLiveValues
                  ? 'Real market simulation is active. Admin rate is ignored.'
                  : 'Admin rate is being applied to all asset prices.'}
              </span>
            </div>
            <button
              className={`${styles.toggle} ${admin.useLiveValues ? styles.toggleOn : ''}`}
              onClick={handleToggleLive}
              aria-checked={admin.useLiveValues}
              role="switch"
            >
              <span className={styles.toggleThumb} />
            </button>
          </div>

          <div className={styles.divider} />

          <div className={styles.cardHead} style={{ marginTop: 0 }}>
            {admin.isPaused ? <Pause size={18} className={styles.cardIconWarn} /> : <Play size={18} className={styles.cardIconLive} />}
            <div>
              <h3 className={styles.cardTitle}>Pause Trading</h3>
              <p className={styles.cardSub}>Freeze all order placement for educational breaks</p>
            </div>
          </div>
          <div className={styles.toggleRow}>
            <div className={styles.toggleInfo}>
              <span className={styles.toggleLabel}>Trading Active</span>
              <span className={styles.toggleDesc}>
                {admin.isPaused
                  ? 'All trading is frozen. Students cannot place new orders.'
                  : 'Students can freely place and close trades.'}
              </span>
            </div>
            <button
              className={`${styles.toggle} ${admin.isPaused ? styles.togglePause : ''}`}
              onClick={handleTogglePause}
              role="switch"
              aria-checked={admin.isPaused}
            >
              <span className={styles.toggleThumb} />
            </button>
          </div>
          {admin.isPaused && (
            <div className={styles.pauseAlert}>
              <AlertTriangle size={14} />
              Trading is currently frozen. Click the toggle to resume.
            </div>
          )}
        </div>
      </div>

      <div className={styles.liveTable}>
        <h3 className={styles.tableTitle}>Live Market Snapshot</h3>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr><th>Asset</th><th>Category</th><th>Price</th><th>Change</th><th>Change %</th></tr>
            </thead>
            <tbody>
              {assets.map(a => {
                const p    = prices[a.symbol];
                const isUp = p && p.changePct >= 0;
                return (
                  <tr key={a.symbol}>
                    <td className={styles.sym}>{a.symbol}</td>
                    <td className={styles.cat}>{a.category}</td>
                    <td className={styles.mono}>
                      {p?.current?.toLocaleString(undefined, { maximumFractionDigits: 6 })}
                    </td>
                    <td className={`${styles.mono} ${isUp ? styles.up : styles.down}`}>
                      {isUp ? '+' : ''}{p?.change?.toFixed(5)}
                    </td>
                    <td className={`${styles.mono} ${isUp ? styles.up : styles.down}`}>
                      {isUp ? '+' : ''}{p?.changePct?.toFixed(3)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const AdminControls = () => {
  const { admin, adminLogin } = useTrading();

  return (
    <AuthLayout
      title="Admin Controls"
      subtitle="Instructor-only market environment controls"
    >
      {admin.authenticated ? <AdminPanel /> : <AdminLogin onLogin={adminLogin} />}
    </AuthLayout>
  );
};

export default AdminControls;
