import { useEffect, useMemo, useState } from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, Cell as BarCell,
} from 'recharts';
import { TrendingUp, TrendingDown, Filter, ArrowUpDown } from 'lucide-react';
import AuthLayout from '@/layouts/AuthLayout';
import Button from '@/components/Button/Button';
import Badge from '@/components/Badge/Badge';
import Modal from '@/components/Modal/Modal';
import InputField from '@/components/InputField/InputField';
import Loader from '@/components/Loader/Loader';
import { getInvestments, investInPlan } from '@/api/investments';
import { useToast } from '@/context/ToastContext';
import { mockAllocation, mockBalances, mockAssetPerf } from '@/utils/mockData';
import { formatCurrency, formatPercent } from '@/utils/formatters';
import styles from './Portfolio.module.scss';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'fixed-deposit', label: 'Fixed' },
  { id: 'crypto', label: 'Crypto' },
  { id: 'real-estate', label: 'Real Estate' },
  { id: 'mutual-fund', label: 'Funds' },
  { id: 'savings', label: 'Savings' },
];

const Portfolio = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    getInvestments().then((res) => { setItems(res.data); setLoading(false); });
  }, []);

  const filtered = useMemo(() =>
    filter === 'all' ? items : items.filter((i) => i.category === filter), [items, filter]);

  const openInvest = (plan) => { setSelected(plan); setAmount(String(plan.minimum)); };

  const handleInvest = async () => {
    if (!selected) return;
    const value = Number(amount);
    if (!value || value < selected.minimum) {
      toast.error(`Minimum is ${formatCurrency(selected.minimum, 'USD', 0)}`);
      return;
    }
    setSubmitting(true);
    try {
      await investInPlan(selected.id, { amount: value });
      toast.success(`Allocated ${formatCurrency(value, 'USD', 0)} to ${selected.title}.`, { title: 'Position opened' });
      setSelected(null);
      setAmount('');
    } catch (err) { toast.error(err?.message || 'Failed'); }
    finally { setSubmitting(false); }
  };

  return (
    <AuthLayout title="Portfolio" subtitle="Holdings, allocation, and the assets driving your performance.">
      {/* KPI strip */}
      <section className={styles.kpis}>
        <div className={styles.kpi}>
          <span>Equity</span>
          <strong>{formatCurrency(mockBalances.portfolioValue)}</strong>
          <Badge tone="success" size="sm"><TrendingUp size={11} /> +18.4%</Badge>
        </div>
        <div className={styles.kpi}>
          <span>Invested</span>
          <strong>{formatCurrency(mockBalances.accountBalance)}</strong>
          <span className={styles.kpiMeta}>across {mockBalances.activeInvestments} positions</span>
        </div>
        <div className={styles.kpi}>
          <span>Unrealized P/L</span>
          <strong className={styles.pos}>+{formatCurrency(mockBalances.totalProfit)}</strong>
          <Badge tone="success" size="sm">+6.8% mtd</Badge>
        </div>
        <div className={styles.kpi}>
          <span>Best performer</span>
          <strong>NVDA</strong>
          <Badge tone="success" size="sm"><TrendingUp size={11} /> +24.1%</Badge>
        </div>
      </section>

      {/* Allocation + perf bars */}
      <section className={styles.split}>
        <div className={styles.card}>
          <header className={styles.cardHead}>
            <h3>Allocation by class</h3>
            <span>Current weights</span>
          </header>
          <div className={styles.allocBody}>
            <div className={styles.pie}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={mockAllocation} dataKey="value" nameKey="name" cx="50%" cy="50%"
                    innerRadius={56} outerRadius={84} paddingAngle={2} stroke="#0a0f1f" strokeWidth={2}>
                    {mockAllocation.map((e) => <Cell key={e.name} fill={e.color} />)}
                  </Pie>
                  <Tooltip formatter={(v) => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className={styles.allocLegend}>
              {mockAllocation.map((a) => (
                <li key={a.name}>
                  <span className={styles.dot} style={{ background: a.color }} />
                  <span>{a.name}</span>
                  <strong>{a.value}%</strong>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.card}>
          <header className={styles.cardHead}>
            <h3>Asset performance</h3>
            <span>Year-to-date by symbol</span>
          </header>
          <div className={styles.barWrap}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockAssetPerf} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 0 }}>
                <XAxis type="number" tickFormatter={(v) => `${v}%`} tick={{ fontSize: 10, fill: '#6c7798' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="asset" tick={{ fontSize: 11, fill: '#aab2cc' }} axisLine={false} tickLine={false} width={50} />
                <Tooltip formatter={(v) => `${v}%`} cursor={{ fill: 'rgba(0, 209, 255, 0.06)' }} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={14}>
                  {mockAssetPerf.map((e) => (
                    <Cell key={e.asset} fill={e.value >= 0 ? '#1fd693' : '#ff4d6d'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Holdings table */}
      <section className={styles.holdingsCard}>
        <header className={styles.holdingsHead}>
          <div>
            <h3>Holdings & open positions</h3>
            <p>Active investment plans and their current performance</p>
          </div>
          <div className={styles.filters}>
            {FILTERS.map((f) => (
              <button
                key={f.id}
                className={`${styles.fbtn} ${filter === f.id ? styles.fActive : ''}`}
                onClick={() => setFilter(f.id)}
              >{f.label}</button>
            ))}
          </div>
        </header>

        {loading ? <Loader fullPage label="Loading portfolio" /> : (
          <div className={styles.tableScroll}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Position</th>
                  <th>Type</th>
                  <th className={styles.right}>ROI</th>
                  <th className={styles.right}>Duration</th>
                  <th className={styles.right}>Risk</th>
                  <th className={styles.right}>Min</th>
                  <th className={styles.right}>AUM</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className={styles.posCell}>
                        <strong>{p.title}</strong>
                        <span>{p.description.slice(0, 64)}…</span>
                      </div>
                    </td>
                    <td><Badge tone="primary" size="sm">{p.category.replace('-', ' ')}</Badge></td>
                    <td className={styles.right}><span className={styles.pos}>+{p.roi}%</span></td>
                    <td className={styles.right}>{p.duration}</td>
                    <td className={styles.right}>
                      <Badge tone={p.risk === 'low' ? 'success' : p.risk === 'medium' ? 'accent' : 'danger'} size="sm">
                        {p.risk}
                      </Badge>
                    </td>
                    <td className={styles.right}><span className={styles.mono}>{formatCurrency(p.minimum, 'USD', 0)}</span></td>
                    <td className={styles.right}><span className={styles.mono}>${(p.aum/1e6).toFixed(1)}M</span></td>
                    <td className={styles.right}>
                      <Button size="sm" onClick={() => openInvest(p)}>Invest</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <Modal
        open={!!selected}
        onClose={() => !submitting && setSelected(null)}
        title={selected ? `Open position — ${selected.title}` : ''}
        description={selected?.description}
        footer={
          <>
            <Button variant="ghost" onClick={() => setSelected(null)} disabled={submitting}>Cancel</Button>
            <Button onClick={handleInvest} loading={submitting}>Confirm</Button>
          </>
        }
      >
        {selected && (
          <div className={styles.modalBody}>
            <div className={styles.modalSummary}>
              <div><span>ROI</span><strong>+{selected.roi}%</strong></div>
              <div><span>Duration</span><strong>{selected.duration}</strong></div>
              <div><span>Min</span><strong>{formatCurrency(selected.minimum, 'USD', 0)}</strong></div>
              <div><span>Risk</span><strong>{selected.risk}</strong></div>
            </div>
            <InputField
              label="Amount (USD)"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              hint={`Estimated annual return: ${formatCurrency((Number(amount) || 0) * (selected.roi / 100), 'USD', 0)}`}
              min={selected.minimum}
            />
          </div>
        )}
      </Modal>
    </AuthLayout>
  );
};

export default Portfolio;
