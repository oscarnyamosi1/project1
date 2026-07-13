import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

const TradingContext = createContext(null);

export const ASSET_CONFIGS = [
  { symbol: 'EUR/USD', name: 'Euro / US Dollar',         category: 'Forex',       pip: 0.0001, digits: 5 },
  { symbol: 'GBP/USD', name: 'British Pound / US Dollar', category: 'Forex',       pip: 0.0001, digits: 5 },
  { symbol: 'USD/JPY', name: 'US Dollar / Japanese Yen',  category: 'Forex',       pip: 0.01,   digits: 3 },
  { symbol: 'BTC/USD', name: 'Bitcoin / US Dollar',       category: 'Crypto',      pip: 1,      digits: 2 },
  { symbol: 'ETH/USD', name: 'Ethereum / US Dollar',      category: 'Crypto',      pip: 0.1,    digits: 2 },
  { symbol: 'XAU/USD', name: 'Gold / US Dollar',          category: 'Commodities', pip: 0.1,    digits: 2 },
  { symbol: 'Oil/USD', name: 'Crude Oil / US Dollar',     category: 'Commodities', pip: 0.01,   digits: 3 },
  { symbol: 'NAS100',  name: 'Nasdaq 100',                category: 'Indices',     pip: 1,      digits: 1 },
];

const BASE_PRICES = {
  'EUR/USD': 1.08420,
  'GBP/USD': 1.27350,
  'USD/JPY': 156.420,
  'BTC/USD': 71245.00,
  'ETH/USD':  3842.50,
  'XAU/USD':  2347.80,
  'Oil/USD':    78.45,
  'NAS100':  19842.30,
};

const VOLATILITY = {
  'EUR/USD': 0.00008,
  'GBP/USD': 0.00012,
  'USD/JPY': 0.012,
  'BTC/USD': 85.0,
  'ETH/USD':  5.2,
  'XAU/USD':  1.8,
  'Oil/USD':  0.12,
  'NAS100':  22.0,
};

const fmt = (val, digits) => parseFloat(val.toFixed(digits));

const generateCandles = (symbol, count = 60) => {
  const base = BASE_PRICES[symbol];
  const vol = VOLATILITY[symbol];
  const digits = ASSET_CONFIGS.find(a => a.symbol === symbol)?.digits ?? 4;
  const candles = [];
  let price = base * 0.97;
  const now = Date.now();
  for (let i = count; i >= 0; i--) {
    const open = price;
    const move = (Math.random() - 0.48) * vol * 2.5;
    const close = Math.max(open + move, base * 0.5);
    const wick = vol * (Math.random() * 1.2 + 0.3);
    const high = Math.max(open, close) + wick * Math.random();
    const low  = Math.min(open, close) - wick * Math.random();
    const volume = Math.floor(Math.random() * 1200 + 300);
    candles.push({
      time:   now - i * 60_000,
      open:   fmt(open,  digits),
      high:   fmt(high,  digits),
      low:    fmt(low,   digits),
      close:  fmt(close, digits),
      volume,
    });
    price = close;
  }
  return candles;
};

const initPrices = () => {
  const p = {};
  ASSET_CONFIGS.forEach(({ symbol }) => {
    p[symbol] = { current: BASE_PRICES[symbol], prev: BASE_PRICES[symbol], change: 0, changePct: 0 };
  });
  return p;
};

const initCandles = () => {
  const c = {};
  ASSET_CONFIGS.forEach(({ symbol }) => { c[symbol] = generateCandles(symbol); });
  return c;
};

export const TradingProvider = ({ children }) => {
  const [prices,        setPrices]        = useState(initPrices);
  const [candles,       setCandles]       = useState(initCandles);
  const [demoBalance,   setDemoBalance]   = useState(100_000);
  const [liveBalance,   setLiveBalance]   = useState(12_500);
  const [openPositions, setOpenPositions] = useState([]);
  const [orderHistory,  setOrderHistory]  = useState([]);
  const [admin, setAdmin] = useState({
    volatilityRate: 0,
    useLiveValues: true,
    isPaused: false,
    authenticated: false,
  });

  const pricesRef = useRef(prices);
  useEffect(() => { pricesRef.current = prices; }, [prices]);

  const adminRef = useRef(admin);
  useEffect(() => { adminRef.current = admin; }, [admin]);

  useEffect(() => {
    const tick = setInterval(() => {
      const { isPaused, useLiveValues, volatilityRate } = adminRef.current;
      if (isPaused) return;

      setPrices(prev => {
        const next = {};
        ASSET_CONFIGS.forEach(({ symbol, digits }) => {
          const p     = prev[symbol].current;
          const vol   = VOLATILITY[symbol];
          let drift   = (Math.random() - 0.5) * vol * 2;
          if (!useLiveValues && volatilityRate !== 0) {
            drift += p * (volatilityRate / 100) * 0.08;
          }
          const newP    = Math.max(p + drift, p * 0.6);
          const change  = newP - BASE_PRICES[symbol];
          const chgPct  = (change / BASE_PRICES[symbol]) * 100;
          next[symbol]  = {
            current:   fmt(newP,   digits),
            prev:      p,
            change:    fmt(change, digits),
            changePct: fmt(chgPct, 3),
          };
        });
        return next;
      });

      setCandles(prev => {
        const now  = Date.now();
        const next = {};
        ASSET_CONFIGS.forEach(({ symbol, digits }) => {
          const arr  = prev[symbol];
          const last = arr[arr.length - 1];
          if (now - last.time < 30_000) { next[symbol] = arr; return; }
          const price = last.close;
          const vol   = VOLATILITY[symbol];
          const open  = price;
          const move  = (Math.random() - 0.5) * vol * 2;
          const close = Math.max(open + move, price * 0.6);
          const wick  = vol * (Math.random() * 0.8 + 0.2);
          next[symbol] = [
            ...arr.slice(-99),
            {
              time:   now,
              open:   fmt(open,  digits),
              high:   fmt(Math.max(open, close) + wick * Math.random(), digits),
              low:    fmt(Math.min(open, close) - wick * Math.random(), digits),
              close:  fmt(close, digits),
              volume: Math.floor(Math.random() * 1200 + 300),
            },
          ];
        });
        return next;
      });
    }, 1_500);

    return () => clearInterval(tick);
  }, []);

  const placeOrder = useCallback((order, isDemo) => {
    if (adminRef.current.isPaused) return { success: false, error: 'Trading is currently paused by the instructor.' };
    const price = pricesRef.current[order.symbol]?.current;
    if (!price) return { success: false, error: 'Asset not found.' };
    const cost = order.lots * (price / 100);
    const balance = isDemo ? demoBalance : liveBalance;
    if (cost > balance) return { success: false, error: 'Insufficient balance for this trade.' };

    const entryPrice = order.orderType === 'limit' ? parseFloat(order.limitPrice) : price;
    const pos = {
      id: `pos_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      symbol: order.symbol,
      type: order.type,
      lots: parseFloat(order.lots),
      entryPrice,
      stopLoss:   order.stopLoss   ? parseFloat(order.stopLoss)   : null,
      takeProfit: order.takeProfit ? parseFloat(order.takeProfit) : null,
      openTime: new Date().toISOString(),
      isDemo,
      cost,
    };

    setOpenPositions(prev => [...prev, pos]);
    if (isDemo) setDemoBalance(b => b - cost);
    else        setLiveBalance(b => b - cost);
    return { success: true, position: pos };
  }, [demoBalance, liveBalance]);

  const closePosition = useCallback((posId) => {
    setOpenPositions(prev => {
      const pos = prev.find(p => p.id === posId);
      if (!pos) return prev;
      const cp    = pricesRef.current[pos.symbol]?.current ?? pos.entryPrice;
      const diff  = pos.type === 'buy' ? cp - pos.entryPrice : pos.entryPrice - cp;
      const pnl   = diff * pos.lots * 100;
      const ret   = pos.cost + pnl;

      if (pos.isDemo) setDemoBalance(b => b + ret);
      else            setLiveBalance(b => b + ret);

      setOrderHistory(h => [{
        ...pos,
        closePrice: cp,
        closeTime:  new Date().toISOString(),
        pnl: parseFloat(pnl.toFixed(2)),
      }, ...h.slice(0, 49)]);

      return prev.filter(p => p.id !== posId);
    });
  }, []);

  const resetDemoBalance = useCallback(() => {
    setDemoBalance(100_000);
    setOpenPositions(prev => prev.filter(p => !p.isDemo));
    setOrderHistory(prev => prev.filter(p => !p.isDemo));
  }, []);

  const adminLogin = useCallback((password) => {
    if (password === 'Flexrr2024') {
      setAdmin(a => ({ ...a, authenticated: true }));
      return true;
    }
    return false;
  }, []);

  const setAdminRate = useCallback((rate) => {
    setAdmin(a => ({ ...a, volatilityRate: Number(rate) }));
  }, []);

  const togglePause = useCallback(() => {
    setAdmin(a => ({ ...a, isPaused: !a.isPaused }));
  }, []);

  const toggleLiveValues = useCallback(() => {
    setAdmin(a => ({ ...a, useLiveValues: !a.useLiveValues }));
  }, []);

  const value = useMemo(() => ({
    assets: ASSET_CONFIGS,
    prices,
    candles,
    admin,
    demoBalance,
    liveBalance,
    openPositions,
    orderHistory,
    placeOrder,
    closePosition,
    resetDemoBalance,
    adminLogin,
    setAdminRate,
    togglePause,
    toggleLiveValues,
  }), [
    prices, candles, admin, demoBalance, liveBalance,
    openPositions, orderHistory,
    placeOrder, closePosition, resetDemoBalance,
    adminLogin, setAdminRate, togglePause, toggleLiveValues,
  ]);

  return <TradingContext.Provider value={value}>{children}</TradingContext.Provider>;
};

export const useTrading = () => {
  const ctx = useContext(TradingContext);
  if (!ctx) throw new Error('useTrading must be used within TradingProvider');
  return ctx;
};
