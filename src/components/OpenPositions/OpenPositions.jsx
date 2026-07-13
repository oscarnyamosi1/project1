import { X } from 'lucide-react';
import { useTrading } from '@/context/TradingContext';
import { useToast } from '@/context/ToastContext';
import styles from './OpenPositions.module.scss';

const OpenPositions = ({ isDemo }) => {
  const { openPositions, prices, closePosition } = useTrading();
  const toast = useToast();

  const positions = openPositions.filter(p => p.isDemo === isDemo);

  const getPnl = (pos) => {
    const cp   = prices[pos.symbol]?.current ?? pos.entryPrice;
    const diff = pos.type === 'buy' ? cp - pos.entryPrice : pos.entryPrice - cp;
    return diff * pos.lots * 100;
  };

  const handleClose = (posId, symbol) => {
    closePosition(posId);
    toast.success(`Position on ${symbol} closed.`, { title: 'Position Closed' });
  };

  if (positions.length === 0) {
    return (
      <div className={styles.empty}>
        <span>No open positions</span>
      </div>
    );
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Side</th>
            <th>Lots</th>
            <th>Entry</th>
            <th>Current</th>
            <th>P&amp;L</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {positions.map(pos => {
            const pnl  = getPnl(pos);
            const cp   = prices[pos.symbol]?.current ?? pos.entryPrice;
            return (
              <tr key={pos.id} className={pnl >= 0 ? styles.profitRow : styles.lossRow}>
                <td className={styles.symbol}>{pos.symbol}</td>
                <td>
                  <span className={`${styles.sideBadge} ${pos.type === 'buy' ? styles.buy : styles.sell}`}>
                    {pos.type.toUpperCase()}
                  </span>
                </td>
                <td className={styles.mono}>{pos.lots}</td>
                <td className={styles.mono}>{pos.entryPrice?.toLocaleString()}</td>
                <td className={styles.mono}>{cp?.toLocaleString()}</td>
                <td className={`${styles.mono} ${pnl >= 0 ? styles.profit : styles.loss}`}>
                  {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}
                </td>
                <td>
                  <button
                    className={styles.closeBtn}
                    onClick={() => handleClose(pos.id, pos.symbol)}
                    title="Close position"
                  >
                    <X size={13} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default OpenPositions;
