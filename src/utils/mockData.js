// =============================================================================
// Realistic mock data for the platform
// =============================================================================

export const mockUser = {
  id: 'usr_001',
  fullName: 'Alex Whitfield',
  email: 'alex@whitfield.co',
  phone: '+1 (415) 555-0188',
  avatar: null,
  kycStatus: 'verified', // verified | pending | not_started
  joinedAt: '2024-03-12T09:00:00Z',
  twoFactorEnabled: true,
  loginAlerts: true,
};

export const mockBalances = {
  accountBalance: 184230.55,
  walletBalance: 12450.00,
  portfolioValue: 312890.42,
  roiPercent: 18.4,
  monthChange: 4.2,
  activeInvestments: 7,
  totalProfit: 47820.15,
};

export const mockNotifications = [
  { id: 'n1', title: 'Investment matured', message: 'Sapphire Real Estate Fund returned $4,820.', type: 'success', time: '2h ago', unread: true },
  { id: 'n2', title: 'New plan available', message: 'Quarterly Treasury notes — limited window.', type: 'info', time: '6h ago', unread: true },
  { id: 'n3', title: 'KYC verified', message: 'Your identity verification is complete.', type: 'success', time: '1d ago', unread: false },
  { id: 'n4', title: 'Withdrawal processed', message: '$3,200 sent to Wells Fargo •• 4421.', type: 'info', time: '2d ago', unread: false },
  { id: 'n5', title: 'Security alert', message: 'New device signed in from San Francisco.', type: 'warning', time: '3d ago', unread: false },
];

// 30 days profit/loss series
const buildSeries = (days, base, volatility, drift = 0) => {
  const points = [];
  let value = base;
  const now = Date.now();
  for (let i = days - 1; i >= 0; i -= 1) {
    const ts = now - i * 24 * 60 * 60 * 1000;
    value += (Math.random() - 0.45) * volatility + drift;
    points.push({
      date: new Date(ts).toISOString().slice(0, 10),
      value: Math.round(value * 100) / 100,
    });
  }
  return points;
};

export const mockProfitLoss30d = buildSeries(30, 4200, 380, 60);

export const mockPortfolioGrowth = [
  { month: 'May', value: 184000 },
  { month: 'Jun', value: 192800 },
  { month: 'Jul', value: 201400 },
  { month: 'Aug', value: 215650 },
  { month: 'Sep', value: 224100 },
  { month: 'Oct', value: 238900 },
  { month: 'Nov', value: 247300 },
  { month: 'Dec', value: 261800 },
  { month: 'Jan', value: 272400 },
  { month: 'Feb', value: 281900 },
  { month: 'Mar', value: 298500 },
  { month: 'Apr', value: 312890 },
];

export const mockAllocation = [
  { name: 'Equities',    value: 38, color: '#00d1ff' },
  { name: 'Crypto',      value: 24, color: '#14d6b1' },
  { name: 'Real Estate', value: 18, color: '#6c8cff' },
  { name: 'Fixed Income',value: 12, color: '#ffb547' },
  { name: 'Cash',        value: 8,  color: '#c084fc' },
];

// =====================================================
// Markets — symbol watchlist (trading-style data)
// =====================================================
const buildSparkline = (base, points = 16, vol = 0.6) => {
  const arr = [];
  let v = base;
  for (let i = 0; i < points; i += 1) {
    v += (Math.random() - 0.45) * vol;
    arr.push({ i, v: Math.round(v * 100) / 100 });
  }
  return arr;
};

export const mockMarkets = [
  { symbol: 'EURUSD',  name: 'Euro / US Dollar',          category: 'forex',  bid: 1.1240, ask: 1.1248, change: 0.42,  changePct: 0.38,  volume: '4.8B',  spark: buildSparkline(1.124, 18, 0.004), starred: true },
  { symbol: 'GBPUSD',  name: 'British Pound / US Dollar', category: 'forex',  bid: 1.2596, ask: 1.2603, change: -0.18, changePct: -0.14, volume: '3.2B',  spark: buildSparkline(1.26, 18, 0.005), starred: false },
  { symbol: 'AUDUSD',  name: 'Aussie Dollar / USD',       category: 'forex',  bid: 0.7148, ask: 0.7156, change: 0.31,  changePct: 0.43,  volume: '1.4B',  spark: buildSparkline(0.715, 18, 0.003), starred: false },
  { symbol: 'USDCHF',  name: 'US Dollar / Swiss Franc',   category: 'forex',  bid: 1.0145, ask: 1.0151, change: -0.09, changePct: -0.09, volume: '892M',  spark: buildSparkline(1.014, 18, 0.003), starred: false },
  { symbol: 'USDCAD',  name: 'US Dollar / Canadian Dollar', category: 'forex', bid: 1.3380, ask: 1.3389, change: 0.04, changePct: 0.03, volume: '1.1B',  spark: buildSparkline(1.338, 18, 0.003), starred: false },
  { symbol: 'NZDUSD',  name: 'NZ Dollar / US Dollar',     category: 'forex',  bid: 0.6677, ask: 0.6685, change: 0.34,  changePct: 0.51,  volume: '684M',  spark: buildSparkline(0.667, 18, 0.003), starred: true },
  { symbol: 'BTCUSD',  name: 'Bitcoin',                   category: 'crypto', bid: 71245.0, ask: 71262.0, change: 980.4, changePct: 1.39, volume: '24.8B', spark: buildSparkline(71200, 18, 220), starred: true },
  { symbol: 'ETHUSD',  name: 'Ethereum',                  category: 'crypto', bid: 3812.40, ask: 3814.12, change: 28.40, changePct: 0.75, volume: '12.4B', spark: buildSparkline(3800, 18, 18), starred: true },
  { symbol: 'SOLUSD',  name: 'Solana',                    category: 'crypto', bid: 184.20,  ask: 184.65,  change: -2.16, changePct: -1.16, volume: '3.6B',  spark: buildSparkline(184, 18, 1.4), starred: false },
  { symbol: 'AAPL',    name: 'Apple Inc.',                category: 'stocks', bid: 218.40,  ask: 218.62,  change: 1.42,  changePct: 0.65,  volume: '52M',   spark: buildSparkline(218, 18, 0.8), starred: false },
  { symbol: 'NVDA',    name: 'NVIDIA Corporation',        category: 'stocks', bid: 921.30,  ask: 921.78,  change: 12.40, changePct: 1.36,  volume: '38M',   spark: buildSparkline(920, 18, 4.2), starred: true },
  { symbol: 'TSLA',    name: 'Tesla Inc.',                category: 'stocks', bid: 264.80,  ask: 265.12,  change: -3.24, changePct: -1.21, volume: '74M',   spark: buildSparkline(264, 18, 1.6), starred: false },
  { symbol: 'GOOGL',   name: 'Alphabet Inc.',             category: 'stocks', bid: 175.60,  ask: 175.84,  change: 0.92,  changePct: 0.53,  volume: '21M',   spark: buildSparkline(175, 18, 0.7), starred: false },
  { symbol: 'XAUUSD',  name: 'Gold Spot / USD',           category: 'commodities', bid: 2412.40, ask: 2413.60, change: 8.20, changePct: 0.34, volume: '186K', spark: buildSparkline(2410, 18, 4), starred: false },
  { symbol: 'XAGUSD',  name: 'Silver Spot / USD',         category: 'commodities', bid: 31.42,  ask: 31.46,  change: 0.18, changePct: 0.58, volume: '92K',   spark: buildSparkline(31.4, 18, 0.12), starred: false },
];

// 80-candle market chart for the Markets page
export const mockCandles = (() => {
  const out = [];
  let close = 1.122;
  const start = Date.now() - 80 * 5 * 60 * 1000;
  for (let i = 0; i < 80; i += 1) {
    const open = close;
    const change = (Math.random() - 0.5) * 0.0042;
    close = +(open + change).toFixed(5);
    const high = +Math.max(open, close, open + Math.random() * 0.0025).toFixed(5);
    const low  = +Math.min(open, close, open - Math.random() * 0.0025).toFixed(5);
    out.push({
      ts: start + i * 5 * 60 * 1000,
      time: new Date(start + i * 5 * 60 * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      open, high, low, close,
      up: close >= open,
    });
  }
  return out;
})();

// 12-month monthly ROI for analytics
export const mockMonthlyRoi = [
  { month: 'May', roi: 1.8 }, { month: 'Jun', roi: 2.4 },
  { month: 'Jul', roi: 1.2 }, { month: 'Aug', roi: 3.1 },
  { month: 'Sep', roi: -0.6 },{ month: 'Oct', roi: 2.8 },
  { month: 'Nov', roi: 4.1 }, { month: 'Dec', roi: 2.6 },
  { month: 'Jan', roi: 3.4 }, { month: 'Feb', roi: 1.9 },
  { month: 'Mar', roi: 2.7 }, { month: 'Apr', roi: 4.6 },
];

// Asset performance bars
export const mockAssetPerf = [
  { asset: 'BTC',  value: 18.4 },
  { asset: 'ETH',  value: 12.6 },
  { asset: 'NVDA', value: 24.1 },
  { asset: 'AAPL', value: 6.2 },
  { asset: 'GOLD', value: 4.1 },
  { asset: 'TSLA', value: -8.4 },
  { asset: 'EUR',  value: 1.8 },
];

export const mockInvestments = [
  {
    id: 'inv_fd_90',
    title: '90-Day Fixed Treasury',
    category: 'fixed-deposit',
    roi: 6.4,
    duration: '90 days',
    risk: 'low',
    minimum: 1000,
    description: 'Capital-protected short-term notes backed by US treasuries. Predictable yields, fixed maturity.',
    aum: 24500000,
  },
  {
    id: 'inv_fd_365',
    title: '12-Month Fixed Yield',
    category: 'fixed-deposit',
    roi: 8.9,
    duration: '12 months',
    risk: 'low',
    minimum: 5000,
    description: 'A senior-secured income product with monthly distributions and a one-year lock.',
    aum: 41200000,
  },
  {
    id: 'inv_crypto_blue',
    title: 'Bluechip Crypto Index',
    category: 'crypto',
    roi: 22.7,
    duration: 'Open-ended',
    risk: 'high',
    minimum: 500,
    description: 'A weighted basket of the top ten digital assets, rebalanced monthly with strict risk gates.',
    aum: 18650000,
  },
  {
    id: 'inv_crypto_yield',
    title: 'Stablecoin Yield Vault',
    category: 'crypto',
    roi: 11.2,
    duration: '30 days',
    risk: 'medium',
    minimum: 250,
    description: 'Dollar-pegged returns from on-chain lending across vetted protocols.',
    aum: 9200000,
  },
  {
    id: 'inv_re_sapphire',
    title: 'Sapphire Real Estate Fund',
    category: 'real-estate',
    roi: 13.5,
    duration: '24 months',
    risk: 'medium',
    minimum: 10000,
    description: 'Direct ownership in income-producing multifamily properties across the Sun Belt.',
    aum: 86400000,
  },
  {
    id: 'inv_re_industrial',
    title: 'Industrial Logistics Fund',
    category: 'real-estate',
    roi: 11.0,
    duration: '36 months',
    risk: 'medium',
    minimum: 25000,
    description: 'Last-mile distribution warehouses leased to investment-grade tenants.',
    aum: 112000000,
  },
  {
    id: 'inv_mf_growth',
    title: 'Global Growth Equity',
    category: 'mutual-fund',
    roi: 16.3,
    duration: 'Open-ended',
    risk: 'medium',
    minimum: 1000,
    description: 'A diversified mutual fund tracking innovative companies across developed markets.',
    aum: 305000000,
  },
  {
    id: 'inv_mf_income',
    title: 'Conservative Income Fund',
    category: 'mutual-fund',
    roi: 7.2,
    duration: 'Open-ended',
    risk: 'low',
    minimum: 500,
    description: 'A blend of investment-grade bonds and dividend equities for steady income.',
    aum: 198000000,
  },
  {
    id: 'inv_sav_ladder',
    title: 'Wealth Ladder Plan',
    category: 'savings',
    roi: 5.8,
    duration: 'Flexible',
    risk: 'low',
    minimum: 100,
    description: 'Automated monthly contributions with tiered yields as your balance grows.',
    aum: 64200000,
  },
  {
    id: 'inv_sav_goal',
    title: 'Goal-Based Savings',
    category: 'savings',
    roi: 4.6,
    duration: 'Flexible',
    risk: 'low',
    minimum: 50,
    description: 'Set a goal, set a timeline, and we will route the right product mix to get there.',
    aum: 22800000,
  },
];

export const mockTransactions = [
  { id: 'txn_001', type: 'deposit',    amount: 5000, status: 'completed', method: 'Wire — Wells Fargo', reference: 'DEP-25Q1-001', date: '2026-04-22T10:14:00Z' },
  { id: 'txn_002', type: 'investment', amount: 15000, status: 'completed', method: 'Sapphire Real Estate Fund', reference: 'INV-RE-SAP-018', date: '2026-04-19T14:02:00Z' },
  { id: 'txn_003', type: 'profit',     amount: 482, status: 'completed', method: 'Stablecoin Yield Vault', reference: 'PFT-CR-YIELD', date: '2026-04-18T09:00:00Z' },
  { id: 'txn_004', type: 'withdrawal', amount: 3200, status: 'completed', method: 'Wells Fargo •• 4421', reference: 'WD-2026-118', date: '2026-04-16T16:32:00Z' },
  { id: 'txn_005', type: 'investment', amount: 8000, status: 'pending', method: '12-Month Fixed Yield', reference: 'INV-FD-365-022', date: '2026-04-15T11:48:00Z' },
  { id: 'txn_006', type: 'deposit',    amount: 12000, status: 'completed', method: 'ACH — Chase', reference: 'DEP-25Q1-002', date: '2026-04-12T08:21:00Z' },
  { id: 'txn_007', type: 'profit',     amount: 1240, status: 'completed', method: 'Bluechip Crypto Index', reference: 'PFT-CR-BLUE', date: '2026-04-10T18:00:00Z' },
  { id: 'txn_008', type: 'withdrawal', amount: 1500, status: 'failed', method: 'Wells Fargo •• 4421', reference: 'WD-2026-117', date: '2026-04-08T13:11:00Z' },
  { id: 'txn_009', type: 'investment', amount: 2500, status: 'completed', method: 'Global Growth Equity', reference: 'INV-MF-GE-007', date: '2026-04-05T10:00:00Z' },
  { id: 'txn_010', type: 'profit',     amount: 318, status: 'completed', method: 'Conservative Income Fund', reference: 'PFT-MF-CIF', date: '2026-04-03T09:30:00Z' },
  { id: 'txn_011', type: 'deposit',    amount: 7500, status: 'completed', method: 'Wire — Citibank', reference: 'DEP-25Q1-003', date: '2026-03-30T15:00:00Z' },
  { id: 'txn_012', type: 'investment', amount: 4200, status: 'completed', method: 'Wealth Ladder Plan', reference: 'INV-SAV-LDR-091', date: '2026-03-28T11:14:00Z' },
  { id: 'txn_013', type: 'profit',     amount: 96, status: 'completed', method: 'Wealth Ladder Plan', reference: 'PFT-SAV-LDR', date: '2026-03-25T08:00:00Z' },
  { id: 'txn_014', type: 'withdrawal', amount: 2000, status: 'completed', method: 'Chase •• 8812', reference: 'WD-2026-110', date: '2026-03-22T16:48:00Z' },
  { id: 'txn_015', type: 'investment', amount: 1000, status: 'pending', method: 'Stablecoin Yield Vault', reference: 'INV-CR-YIELD-014', date: '2026-03-20T12:30:00Z' },
];

export const mockWalletHistory = mockTransactions.filter(
  (t) => t.type === 'deposit' || t.type === 'withdrawal',
);

export const mockTestimonials = [
  {
    name: 'Mara Chen',
    role: 'Founder, Northpoint Studio',
    quote: 'I have used four Flexrr.s in the past decade. Flexrr. is the first one I trust enough to recommend to my own clients.',
  },
  {
    name: 'Sebastián Ortega',
    role: 'Surgeon, Cedars Health',
    quote: 'Calm, deliberate, transparent. The product feels built by people who actually manage money for a living.',
  },
  {
    name: 'Priya Raman',
    role: 'Partner, Linfield Capital',
    quote: 'The reporting alone is worth the move. Every dollar is accounted for and the dashboards finally answer the questions I have.',
  },
];

export const mockPartners = [
  'Northbridge Trust', 'Lattice Capital', 'Aurelian & Co.', 'Meridian Bank',
  'Cedar Holdings', 'Avalon Reserve', 'Halcyon Wealth', 'Westbrook Group',
];

export const mockFaqs = [
  { q: 'Is my capital protected?', a: 'Cash balances are held in segregated accounts at FDIC-insured partner banks. Investment returns are not guaranteed and depend on the product you choose.' },
  { q: 'How soon can I withdraw?', a: 'Wallet withdrawals settle within 1–2 business days. Investment positions follow each product\'s stated maturity or redemption window.' },
  { q: 'What are the minimums?', a: 'Most savings products start at $50. Specialized funds start between $1,000 and $25,000 — each card on the Investments page lists its minimum.' },
  { q: 'Are there hidden fees?', a: 'No. Each product lists its all-in management fee. There are no platform fees, no trade fees, and no wire fees on standard accounts.' },
  { q: 'Who manages my portfolio?', a: 'A licensed advisory team with combined 80+ years across public markets, private credit, and real estate. You can speak to them directly.' },
  { q: 'How do you handle taxes?', a: 'We provide consolidated 1099s every January and integrate directly with TurboTax, H&R Block, and most accounting platforms.' },
  { q: 'Is the platform regulated?', a: 'Yes. Flexrr. is a SEC-registered investment advisor. All custody is handled by a third-party qualified custodian.' },
  { q: 'Can I move existing accounts?', a: 'Most retirement and brokerage accounts can be transferred in-kind in 5–10 business days. Our team handles the paperwork.' },
];
