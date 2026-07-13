import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell,
} from 'recharts';
import {
  TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft, Send, Plus,
  ArrowRight, Bell, Zap, Bitcoin, DollarSign, Activity,
} from 'lucide-react';
import AuthLayout from '@/layouts/AuthLayout';
import Button from '@/components/Button/Button';
import Badge from '@/components/Badge/Badge';
import Loader from '@/components/Loader/Loader';
import { getTransactions } from '@/api/transactions';
import {
  mockBalances, mockPortfolioGrowth, mockAllocation, mockMarkets,
  mockProfitLoss30d,
} from '@/utils/mockData';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency, formatPercent } from '@/utils/formatters';
import styles from './Dashboard.module.scss';

const RANGES = ['1D', '1W', '1M', '3M', '1Y', 'ALL'];

const Dashboard = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState('1Y');

  useEffect(() => {
    let active = true;
    getTransactions().then((res) => {
      if (active) {
        setTransactions(res.data.slice(0, 5));
        setLoading(false);
      }
    });
    return () => { active = false; };
  }, []);

  const firstName = (user?.fullName || 'Trader').split(' ')[0];
  const movers = mockMarkets.slice(0, 5);

  const rightPanel = (
    <div className={styles.utility}>
      <header className={styles.utilHead}>
        <h3>Quick trade</h3>
        <Badge tone="success" size="sm">Live</Badge>
      </header>

      <div className={styles.tradePair}>
        <span className={styles.tradeSym}>BTCUSD</span>
        <span className={styles.tradeName}>Bitcoin</span>
      </div>
      <div className={styles.tradePrice}>
        <span>71,245.00</span>
        <Badge tone="success" size="sm">+1.39%</Badge>
      </div>

      <div className={styles.bidAsk}>
        <button className={styles.sellBtn}>
          <span>SELL</span>
          <strong>71,245.00</strong>
        </button>
        <button className={styles.buyBtn}>
          <span>BUY</span>
          <strong>71,262.00</strong>
        </button>
      </div>

      <div className={styles.amountRow}>
        <label>Amount, USD</label>
        <div className={styles.amountInput}>
          <button>−</button>
          <input defaultValue="500" />
          <button>+</button>
        </div>
      </div>

      <div className={styles.execRow}>
        <span>Margin impact</span>
        <strong>$2,500.00</strong>
      </div>
      <div className={styles.execRow}>
        <span>Est. value</span>
        <strong>$0.00702 BTC</strong>
      </div>

      <div className={styles.tradeCheck}><span>Take profit</span><i /></div>
      <div className={styles.tradeCheck}><span>Stop loss</span><i /></div>

      <Button fullWidth size="md">Place order</Button>

      <div className={styles.utilDivider} />

      <header className={styles.utilHead}>
        <h3>Quick actions</h3>
      </header>
      <div className={styles.quickGrid}>
        <Link to="/wallet" className={styles.quickAction}>
          <span><ArrowDownLeft size={16} /></span>Deposit
        </Link>
        <Link to="/wallet" className={styles.quickAction}>
          <span><ArrowUpRight size={16} /></span>Withdraw
        </Link>
        <Link to="/wallet" className={styles.quickAction}>
          <span><Send size={16} /></span>Transfer
        </Link>
        <Link to="/markets" className={styles.quickAction}>
          <span><Zap size={16} /></span>Trade
        </Link>
      </div>

      <div className={styles.utilDivider} />

      <header className={styles.utilHead}>
        <h3>Alerts</h3>
        <Bell size={14} />
      </header>
      <ul className={styles.alertsList}>
        <li className={styles.alertOk}><span /> BTC crossed $70k support</li>
        <li className={styles.alertWarn}><span /> NVDA price alert at $930</li>
        <li className={styles.alertOk}><span /> ETH staking rewards credited</li>
      </ul>
    </div>
  );

  return (
    <AuthLayout
      title={`Welcome back, ${firstName}`}
      subtitle="Markets are live. Here's the snapshot of your portfolio today."
      rightPanel={rightPanel}
    >
      {/* Performance chart card */}
      <section className={styles.heroChart}>
        <div className={styles.heroChartHead}>
          <div>
            <span className={styles.eyebrow}>Portfolio value</span>
            <h2>{formatCurrency(mockBalances.portfolioValue)}</h2>
            <div className={styles.heroDelta}>
              <Badge tone="success" size="sm"><TrendingUp size={12} /> +18.4%</Badge>
              <span>+{formatCurrency(mockBalances.totalProfit, 'USD', 0)} all-time</span>
            </div>
          </div>
          <div className={styles.rangeTabs}>
            {RANGES.map((r) => (
              <button
                key={r}
                className={`${styles.rangeBtn} ${range === r ? styles.rangeActive : ''}`}
                onClick={() => setRange(r)}
              >{r}</button>
            ))}
          </div>
        </div>
        <div className={styles.heroChartBody}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockPortfolioGrowth} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="heroFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#00d1ff" stopOpacity={0.32} />
                  <stop offset="100%" stopColor="#00d1ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6c7798' }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: '#6c7798' }} axisLine={false} tickLine={false} width={50} />
              <Tooltip
                cursor={{ stroke: '#00d1ff', strokeOpacity: 0.3 }}
                formatter={(v) => formatCurrency(v, 'USD', 0)}
              />
              <Area type="monotone" dataKey="value" stroke="#00d1ff" strokeWidth={2.5} fill="url(#heroFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Two-up: Allocation + P/L */}
      <section className={styles.twoUp}>
        <div className={styles.card}>
          <header className={styles.cardHead}>
            <div>
              <h3>Asset allocation</h3>
              <p>Current portfolio mix</p>
            </div>
            <Link to="/portfolio" className={styles.linkRight}>View <ArrowRight size={12} /></Link>
          </header>
          <div className={styles.allocBody}>
            <div className={styles.allocChart}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={mockAllocation} dataKey="value" nameKey="name" cx="50%" cy="50%"
                    innerRadius={48} outerRadius={72} paddingAngle={2} stroke="#0a0f1f" strokeWidth={2}>
                    {mockAllocation.map((e) => <Cell key={e.name} fill={e.color} />)}
                  </Pie>
                  <Tooltip formatter={(v) => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className={styles.allocLegend}>
              {mockAllocation.map((a) => (
                <li key={a.name}>
                  <span className={styles.legendDot} style={{ background: a.color }} />
                  <span className={styles.legendName}>{a.name}</span>
                  <strong>{a.value}%</strong>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.card}>
          <header className={styles.cardHead}>
            <div>
              <h3>Profit & loss</h3>
              <p>Daily realized over last 30 days</p>
            </div>
            <Badge tone="success" size="sm"><TrendingUp size={12} /> +6.8%</Badge>
          </header>
          <div className={styles.plBody}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockProfitLoss30d}>
                <defs>
                  <linearGradient id="plFillD" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#1fd693" stopOpacity={0.30} />
                    <stop offset="100%" stopColor="#1fd693" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6c7798' }} axisLine={false} tickLine={false} interval={6} />
                <YAxis tick={{ fontSize: 11, fill: '#6c7798' }} axisLine={false} tickLine={false} width={40} tickFormatter={(v) => `$${v}`} />
                <Tooltip formatter={(v) => formatCurrency(v, 'USD', 0)} />
                <Area type="monotone" dataKey="value" stroke="#1fd693" strokeWidth={2.5} fill="url(#plFillD)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Top movers + Recent activity */}
      <section className={styles.twoUp}>
        <div className={styles.card}>
          <header className={styles.cardHead}>
            <div>
              <h3>Top movers</h3>
              <p>Most active symbols today</p>
            </div>
            <Link to="/markets" className={styles.linkRight}>Markets <ArrowRight size={12} /></Link>
          </header>
          <ul className={styles.moverList}>
            {movers.map((m) => (
              <li key={m.symbol}>
                <div className={styles.moverLeft}>
                  <span className={styles.moverIcon}>
                    {m.category === 'crypto' ? <Bitcoin size={14} /> : m.category === 'forex' ? <DollarSign size={14} /> : <Activity size={14} />}
                  </span>
                  <div>
                    <strong>{m.symbol}</strong>
                    <span>{m.name}</span>
                  </div>
                </div>
                <div className={styles.moverRight}>
                  <strong className={styles.mono}>{typeof m.bid === 'number' ? m.bid.toLocaleString('en-US', { maximumFractionDigits: 4 }) : m.bid}</strong>
                  <span className={m.changePct >= 0 ? styles.up : styles.down}>
                    {m.changePct >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                    {formatPercent(m.changePct, 2)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.card}>
          <header className={styles.cardHead}>
            <div>
              <h3>Recent activity</h3>
              <p>Latest transactions</p>
            </div>
            <Link to="/transactions" className={styles.linkRight}>All <ArrowRight size={12} /></Link>
          </header>
          {loading ? <Loader label="Loading…" /> : (
            <ul className={styles.activityList}>
              {transactions.map((t) => (
                <li key={t.id}>
                  <div className={styles.actLeft}>
                    <span className={`${styles.actIcon} ${styles[t.type]}`}>
                      {t.type === 'deposit' ? <ArrowDownLeft size={14} />
                       : t.type === 'withdrawal' ? <ArrowUpRight size={14} />
                       : t.type === 'profit' ? <TrendingUp size={14} />
                       : <Plus size={14} />}
                    </span>
                    <div>
                      <strong>{t.method}</strong>
                      <span>{t.reference}</span>
                    </div>
                  </div>
                  <div className={styles.actRight}>
                    <strong className={t.type === 'withdrawal' ? styles.neg : styles.pos}>
                      {t.type === 'withdrawal' ? '−' : '+'}{formatCurrency(t.amount, 'USD', 0)}
                    </strong>
                    <Badge tone={t.status === 'completed' ? 'success' : t.status === 'pending' ? 'accent' : 'danger'} size="sm">{t.status}</Badge>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </AuthLayout>
  );
};

export default Dashboard;
