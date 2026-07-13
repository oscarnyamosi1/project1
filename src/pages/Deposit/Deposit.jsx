import { useState } from 'react';
import { Phone, DollarSign, Clock, CheckCircle, XCircle, ChevronRight, Smartphone } from 'lucide-react';
import AuthLayout from '@/layouts/AuthLayout';
import { useTrading } from '@/context/TradingContext';
import { useToast } from '@/context/ToastContext';
import styles from './Deposit.module.scss';

const AMOUNTS = [500, 1000, 2500, 5000, 10000];

const statusIcon = (status) => {
  if (status === 'pending')   return <Clock size={16} className={styles.pendingIcon} />;
  if (status === 'completed') return <CheckCircle size={16} className={styles.successIcon} />;
  if (status === 'failed')    return <XCircle size={16} className={styles.failIcon} />;
  return null;
};

const Deposit = () => {
  const { liveBalance } = useTrading();
  const toast = useToast();

  const [amount,  setAmount]  = useState('');
  const [phone,   setPhone]   = useState('');
  const [step,    setStep]    = useState('form');
  const [history, setHistory] = useState([]);

  const handleDeposit = async (e) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!amt || amt < 10) { toast.error('Minimum deposit is KES 10'); return; }
    if (!phone.match(/^(\+?254|0)[17]\d{8}$/)) {
      toast.error('Enter a valid M-Pesa number (e.g. 0712345678 or +254712345678)');
      return;
    }

    const txId = `TXN${Date.now().toString().slice(-8)}`;
    const entry = { id: txId, amount: amt, phone, status: 'pending', time: new Date() };
    setHistory(h => [entry, ...h]);
    setStep('pending');

    toast.info(`STK Push sent to ${phone}. Enter your M-Pesa PIN to confirm.`, { title: 'STK Push Sent' });

    await new Promise(r => setTimeout(r, 4500));

    setHistory(h => h.map(x => x.id === txId ? { ...x, status: 'completed' } : x));
    setStep('success');
    toast.success(`KES ${amt.toLocaleString()} deposited successfully!`, { title: 'Deposit Confirmed' });
  };

  const handleReset = () => {
    setStep('form');
    setAmount('');
    setPhone('');
  };

  return (
    <AuthLayout title="Deposit" subtitle="Fund your account via M-Pesa">
      <div className={styles.page}>
        <div className={styles.left}>
          <div className={styles.balanceCard}>
            <DollarSign size={20} className={styles.balIcon} />
            <div>
              <p className={styles.balLabel}>Live Account Balance</p>
              <p className={styles.balValue}>
                ${liveBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {step === 'form' && (
            <form className={styles.card} onSubmit={handleDeposit}>
              <h2 className={styles.cardTitle}>
                <Smartphone size={18} /> M-Pesa Deposit
              </h2>

              <div className={styles.field}>
                <label className={styles.label}>Quick Select Amount (KES)</label>
                <div className={styles.amountGrid}>
                  {AMOUNTS.map(a => (
                    <button
                      key={a}
                      type="button"
                      className={`${styles.amountChip} ${amount === String(a) ? styles.selectedChip : ''}`}
                      onClick={() => setAmount(String(a))}
                    >
                      {a.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Amount (KES)</label>
                <div className={styles.inputWrap}>
                  <span className={styles.prefix}>KES</span>
                  <input
                    type="number"
                    className={styles.input}
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    min="10"
                    required
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>M-Pesa Phone Number</label>
                <div className={styles.inputWrap}>
                  <Phone size={15} className={styles.prefixIcon} />
                  <input
                    type="tel"
                    className={styles.input}
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="0712 345 678"
                    required
                  />
                </div>
              </div>

              <div className={styles.howItWorks}>
                <p className={styles.howTitle}>How it works</p>
                <div className={styles.steps}>
                  {['Enter your M-Pesa number', 'Receive STK Push on your phone', 'Enter your M-Pesa PIN', 'Funds credited instantly'].map((s, i) => (
                    <div key={i} className={styles.step}>
                      <span className={styles.stepNum}>{i + 1}</span>
                      <span className={styles.stepText}>{s}</span>
                      {i < 3 && <ChevronRight size={12} className={styles.stepArrow} />}
                    </div>
                  ))}
                </div>
              </div>

              <button type="submit" className={styles.submitBtn}>
                Deposit via M-Pesa
              </button>
            </form>
          )}

          {step === 'pending' && (
            <div className={styles.card}>
              <div className={styles.pendingState}>
                <div className={styles.mpesaSpinner}>
                  <div className={styles.spinRing} />
                  <Smartphone size={28} className={styles.spinIcon} />
                </div>
                <h3 className={styles.pendingTitle}>Waiting for M-Pesa Confirmation</h3>
                <p className={styles.pendingDesc}>
                  An STK Push has been sent to <strong>{phone}</strong>.<br />
                  Please enter your M-Pesa PIN on your phone to complete the deposit.
                </p>
                <div className={styles.pendingDetail}>
                  <span>Amount</span>
                  <span className={styles.pendingAmt}>KES {parseFloat(amount).toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className={styles.card}>
              <div className={styles.successState}>
                <div className={styles.successCheck}>
                  <CheckCircle size={40} />
                </div>
                <h3 className={styles.successTitle}>Deposit Successful!</h3>
                <p className={styles.successDesc}>
                  <strong>KES {parseFloat(amount).toLocaleString()}</strong> has been added to your live account.
                </p>
                <div className={styles.successDetails}>
                  <div className={styles.successRow}>
                    <span>Phone</span><span>{phone}</span>
                  </div>
                  <div className={styles.successRow}>
                    <span>Amount</span><span>KES {parseFloat(amount).toLocaleString()}</span>
                  </div>
                  <div className={styles.successRow}>
                    <span>Status</span>
                    <span className={styles.successBadge}><CheckCircle size={12} /> Confirmed</span>
                  </div>
                </div>
                <button className={styles.newDepositBtn} onClick={handleReset}>
                  Make Another Deposit
                </button>
              </div>
            </div>
          )}
        </div>

        <div className={styles.right}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>
              <Clock size={16} /> Transaction History
            </h3>
            {history.length === 0 ? (
              <p className={styles.emptyHist}>No transactions yet. Make your first deposit!</p>
            ) : (
              <div className={styles.txList}>
                {history.map(tx => (
                  <div key={tx.id} className={`${styles.txRow} ${styles[tx.status]}`}>
                    <div className={styles.txIcon}>{statusIcon(tx.status)}</div>
                    <div className={styles.txInfo}>
                      <span className={styles.txId}>{tx.id}</span>
                      <span className={styles.txPhone}>{tx.phone}</span>
                      <span className={styles.txTime}>{tx.time.toLocaleString()}</span>
                    </div>
                    <div className={styles.txRight}>
                      <span className={styles.txAmount}>KES {tx.amount.toLocaleString()}</span>
                      <span className={`${styles.txStatus} ${styles[tx.status]}`}>
                        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Deposit;
