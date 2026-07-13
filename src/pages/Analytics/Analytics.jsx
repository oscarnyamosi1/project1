import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, ResponsiveContainer,
  XAxis, YAxis, Tooltip, Cell, RadialBarChart, RadialBar,
} from 'recharts';
import { TrendingUp, TrendingDown, Activity, Target, Zap } from 'lucide-react';
import AuthLayout from '@/layouts/AuthLayout';
import Badge from '@/components/Badge/Badge';
import {
  mockMonthlyRoi, mockProfitLoss30d, mockPortfolioGrowth, mockAssetPerf,
} from '@/utils/mockData';
import { formatCurrency, formatPercent } from '@/utils/formatters';
import styles from './Analytics.module.scss';

const KPIS = [
  { label: 'Total return', value: '+18.4%',  delta: '+2.1pp vs last yr', tone: 'success', icon: TrendingUp },
  { label: 'Sharpe ratio', value: '1.84',    delta: 'top quartile',      tone: 'success', icon: Target },
  { label: 'Max drawdown',value: '-6.2%',    delta: 'last 12 mo',        tone: 'danger',  icon: TrendingDown },
  { label: 'Win rate',     value: '74%',     delta: '320 / 432 trades',  tone: 'info',    icon: Activity },
];

const Analytics = () => {
  const radial = [{ name: 'roi', value: 84, fill: '#00d1ff' }];

  return (
    <AuthLayout title="Analytics" subtitle="Performance, risk, and behavior metrics across your portfolio.">
      {/* KPI strip */}
      <section className={styles.kpis}>
        {KPIS.map((k) => (
          <div key={k.label} className={`${styles.kpi} ${styles[k.tone]}`}>
            <div className={styles.kpiTop}>
              <span className={styles.kpiIcon}><k.icon size={14} /></span>
              <span className={styles.kpiLabel}>{k.label}</span>
            </div>
            <strong>{k.value}</strong>
            <span className={styles.kpiDelta}>{k.delta}</span>
          </div>
        ))}
      </section>

      {/* Big growth chart */}
      <section className={styles.bigChart}>
        <header className={styles.cardHead}>
          <div>
            <h3>Portfolio growth — 12 months</h3>
            <p>After-fee, all-in equity over time</p>
          </div>
          <Badge tone="success" size="sm"><TrendingUp size={12} /> +69.6% trailing 12mo</Badge>
        </header>
        <div className={styles.bigBody}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockPortfolioGrowth}>
              <defs>
                <linearGradient id="aGrow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#00d1ff" stopOpacity={0.32} />
                  <stop offset="100%" stopColor="#00d1ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6c7798' }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: '#6c7798' }} axisLine={false} tickLine={false} width={50} />
              <Tooltip formatter={(v) => formatCurrency(v, 'USD', 0)} />
              <Area type="monotone" dataKey="value" stroke="#00d1ff" strokeWidth={2.5} fill="url(#aGrow)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Two-up: Monthly ROI + Asset perf */}
      <section className={styles.twoUp}>
        <div className={styles.card}>
          <header className={styles.cardHead}>
            <div>
              <h3>Monthly ROI</h3>
              <p>Profit and loss percentage by month</p>
            </div>
          </header>
          <div className={styles.midBody}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockMonthlyRoi} margin={{ top: 10, right: 0, bottom: 0, left: -8 }}>
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#6c7798' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#6c7798' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip cursor={{ fill: 'rgba(0, 209, 255, 0.06)' }} formatter={(v) => `${v}%`} />
                <Bar dataKey="roi" radius={[6, 6, 0, 0]}>
                  {mockMonthlyRoi.map((e) => <Cell key={e.month} fill={e.roi >= 0 ? '#1fd693' : '#ff4d6d'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={styles.card}>
          <header className={styles.cardHead}>
            <div>
              <h3>Asset returns</h3>
              <p>Year-to-date performance per symbol</p>
            </div>
          </header>
          <div className={styles.midBody}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockAssetPerf} layout="vertical" margin={{ top: 0, right: 16, bottom: 0, left: 0 }}>
                <XAxis type="number" tickFormatter={(v) => `${v}%`} tick={{ fontSize: 10, fill: '#6c7798' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="asset" tick={{ fontSize: 11, fill: '#aab2cc' }} axisLine={false} tickLine={false} width={50} />
                <Tooltip cursor={{ fill: 'rgba(0, 209, 255, 0.06)' }} formatter={(v) => `${v}%`} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={14}>
                  {mockAssetPerf.map((e) => <Cell key={e.asset} fill={e.value >= 0 ? '#14d6b1' : '#ff4d6d'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Three-up bottom: P/L, Goal radial, Insights */}
      <section className={styles.threeUp}>
        <div className={styles.card}>
          <header className={styles.cardHead}>
            <div>
              <h3>Profit & loss</h3>
              <p>30-day rolling P/L</p>
            </div>
          </header>
          <div className={styles.smallBody}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockProfitLoss30d}>
                <XAxis dataKey="date" hide />
                <YAxis hide />
                <Tooltip formatter={(v) => formatCurrency(v, 'USD', 0)} />
                <Line type="monotone" dataKey="value" stroke="#1fd693" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className={styles.smallStat}>
            <strong>{formatCurrency(mockProfitLoss30d[mockProfitLoss30d.length - 1].value)}</strong>
            <Badge tone="success" size="sm">+12.4% mtd</Badge>
          </div>
        </div>

        <div className={styles.card}>
          <header className={styles.cardHead}>
            <div>
              <h3>Goal progress</h3>
              <p>$500k by end of 2026</p>
            </div>
          </header>
          <div className={styles.radialWrap}>
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart innerRadius="74%" outerRadius="100%" data={radial} startAngle={90} endAngle={-270}>
                <RadialBar dataKey="value" cornerRadius={20} background={{ fill: 'rgba(255,255,255,0.05)' }} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className={styles.radialLabel}>
              <strong>84%</strong>
              <span>of goal</span>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <header className={styles.cardHead}>
            <div>
              <h3>Insights</h3>
              <p>AI-flagged patterns</p>
            </div>
            <Zap size={14} color="#ffb547" />
          </header>
          <ul className={styles.insightsList}>
            <li>
              <span className={styles.insIcon}><TrendingUp size={12} /></span>
              <div>
                <strong>Crypto outperforming</strong>
                <p>Your crypto sleeve beat the index by 6.2 points this month.</p>
              </div>
            </li>
            <li>
              <span className={`${styles.insIcon} ${styles.warn}`}><Target size={12} /></span>
              <div>
                <strong>Concentration risk</strong>
                <p>NVDA is now 11% of total equity — consider trimming to 8%.</p>
              </div>
            </li>
            <li>
              <span className={styles.insIcon}><Activity size={12} /></span>
              <div>
                <strong>Steady cadence</strong>
                <p>You've contributed every month for 9 months straight. Keep it up.</p>
              </div>
            </li>
          </ul>
        </div>
      </section>
    </AuthLayout>
  );
};

export default Analytics;
