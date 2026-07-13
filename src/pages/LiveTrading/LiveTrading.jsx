import { useState } from 'react';
import { Activity, TrendingUp, TrendingDown, DollarSign, AlertTriangle } from 'lucide-react';
import AuthLayout from '@/layouts/AuthLayout';
import TradingChart from '@/components/TradingChart/TradingChart';
import TradePanel from '@/components/TradePanel/TradePanel';
import OpenPositions from '@/components/OpenPositions/OpenPositions';
import { useTrading } from '@/context/TradingContext';
import styles from './LiveTrading.module.scss';

const LiveTrading = () => {
  const { assets, prices, liveBalance, openPositions, orderHistory, admin } = useTrading();
  const [selectedSymbol, setSelectedSymbol] = useState('EUR/USD');

  const livePositions  = openPositions.filter(p => !p.isDemo);
  const liveHistory    = orderHistory.filter(p => !p.isDemo);
  const totalPnl       = livePositions.reduce((sum, pos) => {
    const cp   = prices[pos.symbol]?.current ?? pos.entryPrice;
    const diff = pos.type === 'buy' ? cp - pos.entryPrice : pos.entryPrice - cp;
    return sum + diff * pos.lots * 100;
  }, 0);
  const equity = liveBalance + totalPnl;

  return (
    <AuthLayout title="Live Trading" subtitle="Real-time market execution">
      {admin.isPaused && (
        <div className={styles.pauseBanner}>
          <AlertTriangle size={16} />
          Trading is currently paused by the instructor. No orders can be placed.
        </div>
      )}

      <div className={styles.statsRow}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Live Balance</span>
          <span className={styles.statValue}>${liveBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Equity</span>
          <span className={`${styles.statValue} ${equity >= liveBalance ? styles.up : styles.down}`}>
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
          <span className={styles.statValue}>{livePositions.length}</span>
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
                const p   = prices[a.symbol];
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
              <div className={styles.livePill}>
                <span className={styles.liveDot} />
                LIVE
              </div>
            </div>
            <TradingChart symbol={selectedSymbol} />
          </div>

          <div className={styles.positionsCard}>
            <div className={styles.sectionHead}>
              <DollarSign size={15} />
              <span>Open Positions</span>
              <span className={styles.count}>{livePositions.length}</span>
            </div>
            <OpenPositions isDemo={false} />
          </div>

          {liveHistory.length > 0 && (
            <div className={styles.historyCard}>
              <div className={styles.sectionHead}>
                <span>Order History</span>
                <span className={styles.count}>{liveHistory.length}</span>
              </div>
              <div className={styles.tableWrap}>
                <table className={styles.histTable}>
                  <thead>
                    <tr><th>Symbol</th><th>Side</th><th>Lots</th><th>Entry</th><th>Close</th><th>P&amp;L</th><th>Time</th></tr>
                  </thead>
                  <tbody>
                    {liveHistory.slice(0, 10).map(h => (
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
          <TradePanel isDemo={false} />
        </div>
      </div>
    </AuthLayout>
  );
};

export default LiveTrading;
