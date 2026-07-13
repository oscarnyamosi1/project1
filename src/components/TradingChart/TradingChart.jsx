import { useMemo, useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import { BarChart2, TrendingUp } from 'lucide-react';
import { useTrading } from '@/context/TradingContext';
import styles from './TradingChart.module.scss';

const formatTime = (ts) => {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const CandlestickSVG = ({ data }) => {
  if (!data || data.length === 0) return null;
  const W = 800;
  const H = 320;
  const PAD = { top: 10, right: 20, bottom: 30, left: 60 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const visible = data.slice(-60);
  const minP = Math.min(...visible.map(c => c.low))  * 0.9998;
  const maxP = Math.max(...visible.map(c => c.high)) * 1.0002;
  const range = maxP - minP || 1;

  const scaleY = (p) => PAD.top + chartH - ((p - minP) / range) * chartH;
  const barW  = Math.max(Math.floor(chartW / visible.length) - 2, 2);
  const xStep = chartW / visible.length;

  const yTicks = 5;
  const yTickVals = Array.from({ length: yTicks + 1 }, (_, i) =>
    minP + (range / yTicks) * i
  );

  const xTickEvery = Math.floor(visible.length / 5) || 1;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={styles.candleSvg}
      preserveAspectRatio="none"
    >
      {yTickVals.map((v, i) => (
        <g key={i}>
          <line
            x1={PAD.left} y1={scaleY(v)}
            x2={PAD.left + chartW} y2={scaleY(v)}
            stroke="rgba(255,255,255,0.04)" strokeWidth="1"
          />
          <text
            x={PAD.left - 6} y={scaleY(v) + 4}
            textAnchor="end"
            fontSize="9"
            fill="rgba(255,255,255,0.35)"
          >
            {v.toFixed(v > 100 ? 1 : v > 10 ? 2 : 4)}
          </text>
        </g>
      ))}

      {visible.map((c, i) => {
        const cx    = PAD.left + i * xStep + xStep / 2;
        const oY    = scaleY(c.open);
        const clY   = scaleY(c.close);
        const hiY   = scaleY(c.high);
        const loY   = scaleY(c.low);
        const bull  = c.close >= c.open;
        const color = bull ? '#1fd693' : '#ff4d6d';
        const bodyH = Math.max(Math.abs(oY - clY), 1);
        const bodyY = Math.min(oY, clY);

        return (
          <g key={i}>
            <line x1={cx} y1={hiY} x2={cx} y2={loY} stroke={color} strokeWidth="1" opacity="0.8" />
            <rect
              x={cx - barW / 2} y={bodyY}
              width={barW} height={bodyH}
              fill={bull ? color : color}
              opacity="0.9"
              rx="1"
            />
          </g>
        );
      })}

      {visible.map((c, i) => {
        if (i % xTickEvery !== 0) return null;
        const cx = PAD.left + i * xStep + xStep / 2;
        return (
          <text
            key={`t${i}`}
            x={cx} y={H - 6}
            textAnchor="middle"
            fontSize="9"
            fill="rgba(255,255,255,0.35)"
          >
            {formatTime(c.time)}
          </text>
        );
      })}
    </svg>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipTime}>{formatTime(label)}</div>
      <div className={styles.tooltipPrice}>{Number(payload[0]?.value).toLocaleString()}</div>
    </div>
  );
};

const TradingChart = ({ symbol }) => {
  const { candles, prices } = useTrading();
  const [chartType, setChartType] = useState('candlestick');

  const data = candles[symbol] || [];
  const lineData = useMemo(() =>
    data.slice(-60).map(c => ({ time: c.time, price: c.close })),
    [data]
  );

  const current = prices[symbol];
  const isUp = current && current.changePct >= 0;

  return (
    <div className={styles.chartWrap}>
      <div className={styles.chartControls}>
        <div className={styles.chartTypeToggle}>
          <button
            className={`${styles.typeBtn} ${chartType === 'candlestick' ? styles.active : ''}`}
            onClick={() => setChartType('candlestick')}
            title="Candlestick"
          >
            <BarChart2 size={15} />
            <span>Candles</span>
          </button>
          <button
            className={`${styles.typeBtn} ${chartType === 'line' ? styles.active : ''}`}
            onClick={() => setChartType('line')}
            title="Line"
          >
            <TrendingUp size={15} />
            <span>Line</span>
          </button>
        </div>
      </div>

      <div className={styles.chartArea}>
        {chartType === 'candlestick' ? (
          <CandlestickSVG data={data} />
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={lineData} margin={{ top: 10, right: 20, bottom: 0, left: 10 }}>
              <defs>
                <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={isUp ? '#1fd693' : '#ff4d6d'} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={isUp ? '#1fd693' : '#ff4d6d'} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis
                dataKey="time"
                tickFormatter={formatTime}
                tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.35)' }}
                axisLine={false} tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={['auto', 'auto']}
                tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.35)' }}
                axisLine={false} tickLine={false}
                width={60}
                tickFormatter={(v) => v.toFixed(v > 100 ? 1 : v > 10 ? 2 : 4)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone" dataKey="price"
                stroke={isUp ? '#1fd693' : '#ff4d6d'} strokeWidth={2}
                fill="url(#priceGrad)"
                dot={false} isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default TradingChart;
