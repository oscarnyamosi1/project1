import { useEffect, useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, Send, CreditCard, Wallet as WalletIcon } from 'lucide-react';
import AuthLayout from '@/layouts/AuthLayout';
import Button from '@/components/Button/Button';
import Modal from '@/components/Modal/Modal';
import InputField from '@/components/InputField/InputField';
import Badge from '@/components/Badge/Badge';
import TransactionTable from '@/components/TransactionTable/TransactionTable';
import Loader from '@/components/Loader/Loader';
import { getWallet, depositFunds, withdrawFunds, transferFunds } from '@/api/wallet';
import { useToast } from '@/context/ToastContext';
import { formatCurrency } from '@/utils/formatters';
import styles from './Wallet.module.scss';

const PAYMENT_METHODS = [
  { id: 'pm_1', label: 'Wells Fargo Checking', sub: '•• 4421 — primary', type: 'Bank' },
  { id: 'pm_2', label: 'Chase Personal',       sub: '•• 8812',           type: 'Bank' },
  { id: 'pm_3', label: 'Visa Platinum',        sub: '•• 0014 — exp 04/29', type: 'Card' },
];

const Wallet = () => {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(null); // 'deposit' | 'withdraw' | 'transfer'
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ amount: '', method: 'Wells Fargo •• 4421', recipient: '' });
  const toast = useToast();

  useEffect(() => {
    getWallet().then((res) => {
      setWallet(res.data);
      setLoading(false);
    });
  }, []);

  const close = () => { if (!submitting) { setOpen(null); setForm({ amount: '', method: 'Wells Fargo •• 4421', recipient: '' }); } };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const amount = Number(form.amount);
      if (open === 'deposit') {
        await depositFunds({ amount, method: form.method });
        toast.success(`${formatCurrency(amount)} added to your wallet.`, { title: 'Deposit submitted' });
      } else if (open === 'withdraw') {
        await withdrawFunds({ amount, account: form.method });
        toast.success(`${formatCurrency(amount)} on the way to ${form.method}.`, { title: 'Withdrawal submitted' });
      } else if (open === 'transfer') {
        await transferFunds({ amount, recipient: form.recipient });
        toast.success(`${formatCurrency(amount)} sent to ${form.recipient}.`, { title: 'Transfer submitted' });
      }
      close();
    } catch (err) {
      toast.error(err?.message || 'Action failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !wallet) {
    return <AuthLayout title="Wallet"><Loader fullPage label="Loading wallet" /></AuthLayout>;
  }

  return (
    <AuthLayout title="Wallet" subtitle="Move funds between your account, payment methods, and other members.">
      <section className={styles.balanceCard}>
        <div className={styles.balanceMain}>
          <span className={styles.eyebrow}>Available balance</span>
          <h2>{formatCurrency(wallet.balance)}</h2>
          <p>Cash sweeps automatically into FDIC-insured high-yield accounts earning 5.10% APY.</p>
          <div className={styles.balanceActions}>
            <Button onClick={() => setOpen('deposit')} iconLeft={<ArrowDownLeft size={16} />}>Deposit</Button>
            <Button variant="secondary" onClick={() => setOpen('withdraw')} iconLeft={<ArrowUpRight size={16} />}>Withdraw</Button>
            <Button variant="ghost" onClick={() => setOpen('transfer')} iconLeft={<Send size={16} />}>Transfer</Button>
          </div>
        </div>
        <div className={styles.balanceMeta}>
          <div className={styles.metaItem}>
            <span className={styles.metaIcon}><WalletIcon size={18} /></span>
            <div>
              <span className={styles.metaLabel}>Pending settlements</span>
              <strong>{formatCurrency(8200, 'USD', 0)}</strong>
            </div>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaIcon}><CreditCard size={18} /></span>
            <div>
              <span className={styles.metaLabel}>This month</span>
              <strong>{formatCurrency(24300, 'USD', 0)} <em>moved</em></strong>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.split}>
        <div className={styles.methodsCard}>
          <header className={styles.cardHead}>
            <div>
              <h3>Payment methods</h3>
              <p>Linked bank accounts and cards</p>
            </div>
            <Button variant="secondary" size="sm">+ Add method</Button>
          </header>
          <ul className={styles.methodList}>
            {PAYMENT_METHODS.map((m) => (
              <li key={m.id}>
                <div className={styles.methodLeft}>
                  <span className={styles.methodIcon}><CreditCard size={16} /></span>
                  <div>
                    <strong>{m.label}</strong>
                    <span>{m.sub}</span>
                  </div>
                </div>
                <Badge tone="primary" size="sm">{m.type}</Badge>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.historyCard}>
          <header className={styles.cardHead}>
            <div>
              <h3>Recent wallet activity</h3>
              <p>Deposits and withdrawals</p>
            </div>
          </header>
          <div className={styles.tableWrap}>
            <TransactionTable transactions={wallet.history} compact />
          </div>
        </div>
      </section>

      <Modal
        open={!!open}
        onClose={close}
        title={open === 'deposit' ? 'Deposit funds' : open === 'withdraw' ? 'Withdraw funds' : 'Transfer to a member'}
        description={
          open === 'deposit' ? 'Move funds from a linked bank account into your wallet.'
          : open === 'withdraw' ? 'Send funds from your wallet to a linked bank account.'
          : 'Send funds instantly to another Flexrr. member.'
        }
        footer={
          <>
            <Button variant="ghost" onClick={close} disabled={submitting}>Cancel</Button>
            <Button onClick={handleSubmit} loading={submitting}>Confirm</Button>
          </>
        }
      >
        <div className={styles.modalBody}>
          <InputField
            label="Amount (USD)"
            type="number"
            placeholder="0.00"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
          {open === 'transfer' ? (
            <InputField
              label="Recipient (email or @handle)"
              placeholder="alex@example.com"
              value={form.recipient}
              onChange={(e) => setForm({ ...form, recipient: e.target.value })}
            />
          ) : (
            <div className={styles.field}>
              <label>{open === 'deposit' ? 'From' : 'To'}</label>
              <select
                value={form.method}
                onChange={(e) => setForm({ ...form, method: e.target.value })}
                className={styles.select}
              >
                {PAYMENT_METHODS.map((m) => (
                  <option key={m.id} value={`${m.label.split(' ')[0]} ${m.sub.split(' ')[0]} ${m.sub.split(' ')[1] || ''}`.trim()}>
                    {m.label} — {m.sub}
                  </option>
                ))}
              </select>
            </div>
          )}
          <p className={styles.fineprint}>
            {open === 'deposit' ? 'Funds typically settle within 1 business day.'
              : open === 'withdraw' ? 'Withdrawals settle within 1–2 business days.'
              : 'Member-to-member transfers settle instantly with no fee.'}
          </p>
        </div>
      </Modal>
    </AuthLayout>
  );
};

export default Wallet;
