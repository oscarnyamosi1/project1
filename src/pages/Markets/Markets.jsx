import { useMemo, useState } from 'react';
import {
  AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip,
  LineChart, Line,
} from 'recharts';
import { Search, Star, TrendingUp, TrendingDown, Info } from 'lucide-react';
import AuthLayout from '@/layouts/AuthLayout';
import Button from '@/components/Button/Button';
import Badge from '@/components/Badge/Badge';
import { mockMarkets, mockCandles } from '@/utils/mockData';
import { formatPercent } from '@/utils/formatters';
import styles from './Markets.module.scss';

const CATEGORIES = [
  { id: 'all',         label: 'My Watchlist' },
  { id: 'forex',       label: 'Forex' },
  { id: 'crypto',      label: 'Crypto' },
  { id: 'stocks',      label: 'Stocks' },
  { id: 'commodities', label: 'Commodities' },
];

const TIMEFRAMES = ['5m', '30m', '1h', '4h', '1D', '1W'];

const Markets = () => {
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [active, setActive] = useState(mockMarkets[0]);
  const [tf, setTf] = useState('30m');

  const list = useMemo(() => {
    let data = mockMarkets;
    if (category !== 'all') data = data.filter((m) => m.category === category);
    if (search) {
      const q = search.toLowerCase();
      data = data.filter((m) => m.symbol.toLowerCase().includes(q) || m.name.toLowerCase().includes(q));
    }
    return data;
  }, [category, search]);

  const last = mockCandles[mockCandles.length - 1];
  const first = mockCandles[0];
  const sessionDelta = ((last.close - first.open) / first.open) * 100;

  const rightPanel = (
    <div className={styles.tradeBox}>
      <header className={styles.tbHead}>
        <div>
          <strong>{active.symbol}</strong>
          <span>{active.name}</span>
        </div>
        <button className={styles.tbStar}><Star size={14} fill={active.starred ? '#ffb547' : 'none'} stroke={active.starred ? '#ffb547' : 'currentColor'} /></button>
      </header>

      <div className={styles.tbBidAsk}>
        <button className={styles.tbSell}>
          <span>SELL</span>
          <strong>{active.bid.toLocaleString('en-US', { maximumFractionDigits: 4 })}</strong>
        </button>
        <button className={styles.tbBuy}>
          <span>BUY</span>
          <strong>{active.ask.toLocaleString('en-US', { maximumFractionDigits: 4 })}</strong>
        </button>
      </div>

      <div className={styles.tbField}>
        <label>Amount, USD</label>
        <div className={styles.tbInput}>
          <button>−</button>
          <input defaultValue="10,000" />
          <button>+</button>
        </div>
      </div>

      <div className={styles.tbField}>
        <label>Lot</label>
        <div className={styles.tbInput}>
          <button>−</button>
          <input defaultValue="0.10" />
          <button>+</button>
        </div>
      </div>

      <div className={styles.tbRow}><span>Margin impact, USD</span><strong>$100,050.00</strong></div>
      <div className={styles.tbRow}><span>Value, EUR</span><strong>$113,741.00</strong></div>

      <button className={styles.tbToggle}>+ More options</button>

      <div className={styles.tbCheck}><i /><span>Execute when price hits</span></div>
      <div className={styles.tbCheck}><i /><span>Take profit</span></div>
      <div className={styles.tbCheck}><i /><span>Stop loss</span></div>

      <Button fullWidth size="md">Buy</Button>
    </div>
  );

  return (
    <AuthLayout title="Markets" subtitle="Live prices across forex, crypto, stocks, and commodities." rightPanel={rightPanel}>
      <div className={styles.layout}>
        {/* Watchlist */}
        <section className={styles.watchlist}>
          <header className={styles.wHead}>
            <div className={styles.searchWrap}>
              <Search size={14} />
              <input placeholder="Search symbol…" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className={styles.cats}>
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  className={`${styles.cat} ${category === c.id ? styles.catActive : ''}`}
                  onClick={() => setCategory(c.id)}
                >{c.label}</button>
              ))}
            </div>
          </header>

          <div className={styles.tableScroll}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th className={styles.right}>Sell</th>
                  <th className={styles.right}>Buy</th>
                  <th className={styles.right}>Change %</th>
                  <th className={styles.right}>Last 18</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {list.map((m) => {
                  const up = m.changePct >= 0;
                  return (
                    <tr key={m.symbol} className={`${active.symbol === m.symbol ? styles.rowActive : ''}`} onClick={() => setActive(m)}>
                      <td>
                        <div className={styles.symCell}>
                          <Star size={12} fill={m.starred ? '#ffb547' : 'none'} stroke={m.starred ? '#ffb547' : '#6c7798'} />
                          <strong>{m.symbol}</strong>
                          <span className={styles.symName}>{m.name}</span>
                        </div>
                      </td>
                      <td className={styles.right}>
                        <span className={`${styles.pillSell}`}>{m.bid.toLocaleString('en-US', { maximumFractionDigits: 4 })}</span>
                      </td>
                      <td className={styles.right}>
                        <span className={`${styles.pillBuy}`}>{m.ask.toLocaleString('en-US', { maximumFractionDigits: 4 })}</span>
                      </td>
                      <td className={styles.right}>
                        <span className={up ? styles.up : styles.down}>
                          {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                          {formatPercent(m.changePct, 2)}
                        </span>
                      </td>
                      <td className={styles.right}>
                        <div className={styles.spark}>
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={m.spark}>
                              <Line type="monotone" dataKey="v" stroke={up ? '#1fd693' : '#ff4d6d'} strokeWidth={1.4} dot={false} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </td>
                      <td><Info size={13} className={styles.infoIcon} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Chart */}
        <section className={styles.chartCard}>
          <header className={styles.chartHead}>
            <div>
              <div className={styles.chartTitle}>
                <strong>{active.symbol}</strong>
                <span>{active.name}</span>
                <Badge tone={active.changePct >= 0 ? 'success' : 'danger'} size="sm">
                  {formatPercent(active.changePct, 2)}
                </Badge>
              </div>
              <div className={styles.chartPriceRow}>
                <span className={styles.chartPrice}>{active.bid.toLocaleString('en-US', { maximumFractionDigits: 4 })}</span>
                <span className={styles.chartHL}>H {(active.bid * 1.004).toFixed(4)} · L {(active.bid * 0.996).toFixed(4)} · Vol {active.volume}</span>
              </div>
            </div>
            <div className={styles.timeframes}>
              {TIMEFRAMES.map((t) => (
                <button
                  key={t}
                  className={`${styles.tf} ${tf === t ? styles.tfActive : ''}`}
                  onClick={() => setTf(t)}
                >{t}</button>
              ))}
            </div>
          </header>

          <div className={styles.chartBody}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockCandles} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="mFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={sessionDelta >= 0 ? '#1fd693' : '#ff4d6d'} stopOpacity={0.32} />
                    <stop offset="100%" stopColor={sessionDelta >= 0 ? '#1fd693' : '#ff4d6d'} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#6c7798' }} axisLine={false} tickLine={false} interval={9} />
                <YAxis orientation="right" tick={{ fontSize: 10, fill: '#6c7798' }} axisLine={false} tickLine={false} domain={['auto', 'auto']} tickFormatter={(v) => v.toFixed(3)} width={56} />
                <Tooltip formatter={(v) => Number(v).toFixed(5)} />
                <Area type="monotone" dataKey="close" stroke={sessionDelta >= 0 ? '#1fd693' : '#ff4d6d'} strokeWidth={2.2} fill="url(#mFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <footer className={styles.chartFoot}>
            <div className={styles.footStat}><span>Session</span><strong className={sessionDelta >= 0 ? styles.up : styles.down}>{formatPercent(sessionDelta, 2)}</strong></div>
            <div className={styles.footStat}><span>Spread</span><strong>{(active.ask - active.bid).toFixed(4)}</strong></div>
            <div className={styles.footStat}><span>Volume</span><strong>{active.volume}</strong></div>
            <div className={styles.footStat}><span>24h Range</span><strong>{(active.bid * 0.996).toFixed(4)} — {(active.bid * 1.004).toFixed(4)}</strong></div>
          </footer>
        </section>
      </div>
    </AuthLayout>
  );
};

export default Markets;
