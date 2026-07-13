import { useState } from 'react';
import { Activity, TrendingUp, TrendingDown, DollarSign, RotateCcw, AlertTriangle } from 'lucide-react';
import AuthLayout from '@/layouts/AuthLayout';
import TradingChart from '@/components/TradingChart/TradingChart';
import TradePanel from '@/components/TradePanel/TradePanel';
import OpenPositions from '@/components/OpenPositions/OpenPositions';
import { useTrading } from '@/context/TradingContext';
import { useToast } from '@/context/ToastContext';
import styles from './DemoTrading.module.scss';

const DemoTrading = () => {
  const { assets, prices, demoBalance, openPositions, orderHistory, admin, resetDemoBalance } = useTrading();
  const toast = useToast();
  const [selectedSymbol, setSelectedSymbol] = useState('EUR/USD');
  const [resetting, setResetting] = useState(false);

  const demoPositions = openPositions.filter(p => p.isDemo);
  const demoHistory   = orderHistory.filter(p => p.isDemo);

  const totalPnl = demoPositions.reduce((sum, pos) => {
    const cp   = prices[pos.symbol]?.current ?? pos.entryPrice;
    const diff = pos.type === 'buy' ? cp - pos.entryPrice : pos.entryPrice - cp;
    return sum + diff * pos.lots * 100;
  }, 0);
  const equity = demoBalance + totalPnl;

  const handleReset = async () => {
    setResetting(true);
    await new Promise(r => setTimeout(r, 600));
    resetDemoBalance();
    setResetting(false);
    toast.success('Demo balance reset to $100,000. All demo positions closed.', { title: 'Balance Reset' });
  };

  return (
    <AuthLayout title="Demo Trading" subtitle="Practice with virtual $100,000 — no real funds at risk">
      {admin.isPaused && (
        <div className={styles.pauseBanner}>
          <AlertTriangle size={16} />
          Trading is currently paused by the instructor. No orders can be placed.
        </div>
      )}

      <div className={styles.demoNotice}>
        <span className={styles.demoIcon}>🎓</span>
        <span>You are trading with <strong>virtual money</strong>. No real funds are at risk. Perfect for learning.</span>
        <button className={styles.resetBtn} onClick={handleReset} disabled={resetting}>
          <RotateCcw size={14} className={resetting ? styles.spin : ''} />
          Reset Balance
        </button>
      </div>

      <div className={styles.statsRow}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Virtual Balance</span>
          <span className={styles.statValue}>${demoBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Equity</span>
          <span className={`${styles.statValue} ${equity >= demoBalance ? styles.up : styles.down}`}>
            ${equity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Open P&amp;L</span>
          <span className={`${styles.statValue} ${totalPnl >= 0 ? styles.up : styles.down}`}>
            {totalPnl >= 0 ? '+' : ''}${totalPnl.toFixed(2)}
          </span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Open Positions</span>
          <span className={styles.statValue}>{demoPositions.length}</span>
        </div>
      </div>

      <div className={styles.mainGrid}>
        <div className={styles.leftCol}>
          <div className={styles.watchlist}>
            <div className={styles.sectionHead}>
              <Activity size={15} />
              <span>Watchlist</span>
            </div>
            <div className={styles.assetList}>
              {assets.map(a => {
                const p    = prices[a.symbol];
                const isUp = p && p.changePct >= 0;
                return (
                  <button
                    key={a.symbol}
                    className={`${styles.assetRow} ${selectedSymbol === a.symbol ? styles.selected : ''}`}
                    onClick={() => setSelectedSymbol(a.symbol)}
                  >
                    <div className={styles.assetInfo}>
                      <span className={styles.assetSym}>{a.symbol}</span>
                      <span className={styles.assetCat}>{a.category}</span>
                    </div>
                    <div className={styles.assetPrice}>
                      <span className={styles.assetPriceVal}>
                        {p?.current?.toLocaleString(undefined, { maximumFractionDigits: 6 })}
                      </span>
                      <span className={`${styles.assetChange} ${isUp ? styles.up : styles.down}`}>
                        {isUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                        {isUp ? '+' : ''}{p?.changePct?.toFixed(3)}%
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className={styles.centerCol}>
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <div>
                <h2 className={styles.chartSymbol}>{selectedSymbol}</h2>
                <span className={styles.chartName}>{assets.find(a => a.symbol === selectedSymbol)?.name}</span>
              </div>
              <div className={styles.demoPill}>DEMO</div>
            </div>
            <TradingChart symbol={selectedSymbol} />
          </div>

          <div className={styles.positionsCard}>
            <div className={styles.sectionHead}>
              <DollarSign size={15} />
              <span>Open Positions</span>
              <span className={styles.count}>{demoPositions.length}</span>
            </div>
            <OpenPositions isDemo={true} />
          </div>

          {demoHistory.length > 0 && (
            <div className={styles.historyCard}>
              <div className={styles.sectionHead}>
                <span>Order History</span>
                <span className={styles.count}>{demoHistory.length}</span>
              </div>
              <div className={styles.tableWrap}>
                <table className={styles.histTable}>
                  <thead>
                    <tr><th>Symbol</th><th>Side</th><th>Lots</th><th>Entry</th><th>Close</th><th>P&amp;L</th><th>Time</th></tr>
                  </thead>
                  <tbody>
                    {demoHistory.slice(0, 10).map(h => (
                      <tr key={h.id}>
                        <td className={styles.mono}>{h.symbol}</td>
                        <td><span className={`${styles.sideBadge} ${h.type === 'buy' ? styles.buy : styles.sell}`}>{h.type.toUpperCase()}</span></td>
                        <td className={styles.mono}>{h.lots}</td>
                        <td className={styles.mono}>{h.entryPrice?.toLocaleString()}</td>
                        <td className={styles.mono}>{h.closePrice?.toLocaleString()}</td>
                        <td className={`${styles.mono} ${h.pnl >= 0 ? styles.profitTd : styles.lossTd}`}>
                          {h.pnl >= 0 ? '+' : ''}${h.pnl?.toFixed(2)}
                        </td>
                        <td className={styles.timeTd}>{new Date(h.closeTime).toLocaleTimeString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className={styles.rightCol}>
          <TradePanel isDemo={true} />
        </div>
      </div>
    </AuthLayout>
  );
};

export default DemoTrading;
