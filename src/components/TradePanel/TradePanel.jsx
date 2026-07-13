import { useState } from 'react';
import { TrendingUp, TrendingDown, ChevronDown, Loader2 } from 'lucide-react';
import { useTrading } from '@/context/TradingContext';
import { useToast } from '@/context/ToastContext';
import styles from './TradePanel.module.scss';

const TradePanel = ({ isDemo }) => {
  const { assets, prices, placeOrder, admin } = useTrading();
  const toast = useToast();

  const [symbol,     setSymbol]     = useState('EUR/USD');
  const [side,       setSide]       = useState('buy');
  const [orderType,  setOrderType]  = useState('market');
  const [lots,       setLots]       = useState('0.01');
  const [limitPrice, setLimitPrice] = useState('');
  const [stopLoss,   setStopLoss]   = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [loading,    setLoading]    = useState(false);

  const current = prices[symbol];
  const isUp    = current && current.changePct >= 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (admin.isPaused) {
      toast.error('Trading is paused by the instructor.');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const result = placeOrder(
      { symbol, type: side, lots, orderType, limitPrice, stopLoss, takeProfit },
      isDemo,
    );
    setLoading(false);
    if (result.success) {
      toast.success(
        `${side.toUpperCase()} ${lots} lots of ${symbol} opened at ${current?.current?.toLocaleString()}`,
        { title: 'Order Placed' }
      );
      setStopLoss('');
      setTakeProfit('');
      setLimitPrice('');
    } else {
      toast.error(result.error || 'Failed to place order.');
    }
  };

  return (
    <form className={styles.panel} onSubmit={handleSubmit}>
      <div className={styles.panelHead}>
        <h3 className={styles.panelTitle}>Trade Execution</h3>
        {isDemo && <span className={styles.demoBadge}>DEMO</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Asset</label>
        <div className={styles.selectWrap}>
          <select
            className={styles.select}
            value={symbol}
            onChange={e => setSymbol(e.target.value)}
          >
            {assets.map(a => (
              <option key={a.symbol} value={a.symbol}>{a.symbol} — {a.name}</option>
            ))}
          </select>
          <ChevronDown size={14} className={styles.selectIcon} />
        </div>
      </div>

      {current && (
        <div className={styles.priceRow}>
          <span className={styles.currentPrice}>
            {current.current?.toLocaleString(undefined, { maximumFractionDigits: 6 })}
          </span>
          <span className={`${styles.changeBadge} ${isUp ? styles.up : styles.down}`}>
            {isUp ? '+' : ''}{current.changePct?.toFixed(3)}%
          </span>
        </div>
      )}

      <div className={styles.sideToggle}>
        <button
          type="button"
          className={`${styles.sideBtn} ${styles.buyBtn} ${side === 'buy' ? styles.active : ''}`}
          onClick={() => setSide('buy')}
        >
          <TrendingUp size={15} /> Buy / Long
        </button>
        <button
          type="button"
          className={`${styles.sideBtn} ${styles.sellBtn} ${side === 'sell' ? styles.active : ''}`}
          onClick={() => setSide('sell')}
        >
          <TrendingDown size={15} /> Sell / Short
        </button>
      </div>

      <div className={styles.orderTypeRow}>
        {['market', 'limit'].map(t => (
          <button
            key={t}
            type="button"
            className={`${styles.orderTypeBtn} ${orderType === t ? styles.activeType : ''}`}
            onClick={() => setOrderType(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)} Order
          </button>
        ))}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Lots / Units</label>
        <input
          type="number"
          className={styles.input}
          value={lots}
          onChange={e => setLots(e.target.value)}
          min="0.001"
          step="0.001"
          placeholder="0.01"
          required
        />
      </div>

      {orderType === 'limit' && (
        <div className={styles.field}>
          <label className={styles.label}>Limit Price</label>
          <input
            type="number"
            className={styles.input}
            value={limitPrice}
            onChange={e => setLimitPrice(e.target.value)}
            placeholder={current?.current?.toString()}
            step="any"
            required
          />
        </div>
      )}

      <div className={styles.sltp}>
        <div className={styles.field}>
          <label className={styles.label}>Stop Loss</label>
          <input
            type="number"
            className={`${styles.input} ${styles.danger}`}
            value={stopLoss}
            onChange={e => setStopLoss(e.target.value)}
            placeholder="Optional"
            step="any"
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Take Profit</label>
          <input
            type="number"
            className={`${styles.input} ${styles.success}`}
            value={takeProfit}
            onChange={e => setTakeProfit(e.target.value)}
            placeholder="Optional"
            step="any"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || admin.isPaused}
        className={`${styles.submitBtn} ${side === 'buy' ? styles.submitBuy : styles.submitSell}`}
      >
        {loading ? (
          <><Loader2 size={15} className={styles.spin} /> Processing…</>
        ) : admin.isPaused ? (
          'Trading Paused'
        ) : (
          `${side === 'buy' ? 'Buy' : 'Sell'} ${symbol}`
        )}
      </button>
    </form>
  );
};

export default TradePanel;
