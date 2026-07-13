import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import AuthLayout from '@/layouts/AuthLayout';
import InvestmentCard from '@/components/InvestmentCard/InvestmentCard';
import InputField from '@/components/InputField/InputField';
import Modal from '@/components/Modal/Modal';
import Button from '@/components/Button/Button';
import Badge from '@/components/Badge/Badge';
import Loader from '@/components/Loader/Loader';
import { getInvestments, investInPlan } from '@/api/investments';
import { useToast } from '@/context/ToastContext';
import { formatCurrency } from '@/utils/formatters';
import styles from './Investments.module.scss';

const FILTERS = [
  { id: 'all',           label: 'All' },
  { id: 'fixed-deposit', label: 'Fixed Deposits' },
  { id: 'crypto',        label: 'Crypto' },
  { id: 'real-estate',   label: 'Real Estate' },
  { id: 'mutual-fund',   label: 'Mutual Funds' },
  { id: 'savings',       label: 'Savings' },
];

const Investments = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    getInvestments().then((res) => {
      setItems(res.data);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    let data = items;
    if (filter !== 'all') data = data.filter((i) => i.category === filter);
    if (search) {
      const q = search.toLowerCase();
      data = data.filter((i) =>
        i.title.toLowerCase().includes(q) || i.description.toLowerCase().includes(q),
      );
    }
    return data;
  }, [items, filter, search]);

  const openInvest = (plan) => {
    setSelected(plan);
    setAmount(String(plan.minimum));
  };

  const handleInvest = async () => {
    if (!selected) return;
    const value = Number(amount);
    if (!value || value < selected.minimum) {
      toast.error(`Minimum investment is ${formatCurrency(selected.minimum, 'USD', 0)}`);
      return;
    }
    setSubmitting(true);
    try {
      await investInPlan(selected.id, { amount: value });
      toast.success(`Invested ${formatCurrency(value, 'USD', 0)} into ${selected.title}.`, {
        title: 'Investment placed',
      });
      setSelected(null);
      setAmount('');
    } catch (err) {
      toast.error(err?.message || 'Could not place investment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Investments" subtitle="A curated selection of plans across asset classes — built for capital growth and income.">
      {/* Toolbar */}
      <section className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <InputField
            placeholder="Search plans by name or description…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            iconLeft={<Search size={18} />}
          />
        </div>
        <div className={styles.filters}>
          {FILTERS.map((f) => (
            <button
              key={f.id}
              className={`${styles.filterBtn} ${filter === f.id ? styles.activeFilter : ''}`}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      {loading ? (
        <Loader fullPage label="Loading investment plans" />
      ) : filtered.length === 0 ? (
        <div className={styles.empty}>
          <h3>Nothing matches your search.</h3>
          <p>Try clearing the filter or searching for a different term.</p>
        </div>
      ) : (
        <section className={styles.grid}>
          {filtered.map((plan, i) => (
            <InvestmentCard key={plan.id} plan={plan} onInvest={openInvest} delay={i * 0.04} />
          ))}
        </section>
      )}

      <Modal
        open={!!selected}
        onClose={() => !submitting && setSelected(null)}
        title={selected ? `Invest in ${selected.title}` : ''}
        description={selected?.description}
        footer={
          <>
            <Button variant="ghost" onClick={() => setSelected(null)} disabled={submitting}>Cancel</Button>
            <Button onClick={handleInvest} loading={submitting}>Confirm investment</Button>
          </>
        }
      >
        {selected && (
          <div className={styles.modalBody}>
            <div className={styles.modalSummary}>
              <div>
                <span>Annual ROI</span>
                <strong>{selected.roi}%</strong>
              </div>
              <div>
                <span>Duration</span>
                <strong>{selected.duration}</strong>
              </div>
              <div>
                <span>Minimum</span>
                <strong>{formatCurrency(selected.minimum, 'USD', 0)}</strong>
              </div>
              <div>
                <span>Risk</span>
                <strong><Badge tone={selected.risk === 'low' ? 'success' : selected.risk === 'medium' ? 'accent' : 'danger'} size="sm">{selected.risk}</Badge></strong>
              </div>
            </div>
            <InputField
              label="Investment amount (USD)"
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

export default Investments;
