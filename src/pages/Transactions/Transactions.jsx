import { useEffect, useMemo, useState } from 'react';
import { Search, Download } from 'lucide-react';
import AuthLayout from '@/layouts/AuthLayout';
import InputField from '@/components/InputField/InputField';
import TransactionTable from '@/components/TransactionTable/TransactionTable';
import Button from '@/components/Button/Button';
import Loader from '@/components/Loader/Loader';
import { getTransactions } from '@/api/transactions';
import { useToast } from '@/context/ToastContext';
import { formatCurrency } from '@/utils/formatters';
import styles from './Transactions.module.scss';

const TYPE_FILTERS = [
  { id: 'all',        label: 'All' },
  { id: 'deposit',    label: 'Deposits' },
  { id: 'withdrawal', label: 'Withdrawals' },
  { id: 'investment', label: 'Investments' },
  { id: 'profit',     label: 'Profits' },
];

const STATUS_FILTERS = [
  { id: 'all', label: 'Any status' },
  { id: 'completed', label: 'Completed' },
  { id: 'pending', label: 'Pending' },
  { id: 'failed', label: 'Failed' },
];

const PAGE_SIZE = 8;

const Transactions = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ type: 'all', status: 'all', search: '' });
  const [page, setPage] = useState(1);
  const toast = useToast();

  useEffect(() => {
    setLoading(true);
    getTransactions(filters).then((res) => {
      setItems(res.data);
      setLoading(false);
      setPage(1);
    });
  }, [filters]);

  const totals = useMemo(() => {
    const sum = items.reduce(
      (acc, t) => {
        if (t.status !== 'completed') return acc;
        if (t.type === 'deposit' || t.type === 'profit') acc.in += t.amount;
        if (t.type === 'withdrawal' || t.type === 'investment') acc.out += t.amount;
        return acc;
      },
      { in: 0, out: 0 },
    );
    return { ...sum, net: sum.in - sum.out, count: items.length };
  }, [items]);

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const paged = items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const exportCsv = () => {
    const header = 'Reference,Type,Method,Amount,Status,Date\n';
    const body = items.map((t) =>
      [t.reference, t.type, `"${t.method}"`, t.amount, t.status, t.date].join(','),
    ).join('\n');
    const blob = new Blob([header + body], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Your transactions have been exported.', { title: 'CSV downloaded' });
  };

  return (
    <AuthLayout title="Transactions" subtitle="Every deposit, investment, profit, and withdrawal — searchable, filterable, exportable.">
      {/* Summary */}
      <section className={styles.summary}>
        <div className={styles.summaryItem}>
          <span>Money in</span>
          <strong className={styles.in}>{formatCurrency(totals.in, 'USD', 0)}</strong>
        </div>
        <div className={styles.summaryItem}>
          <span>Money out</span>
          <strong className={styles.out}>{formatCurrency(totals.out, 'USD', 0)}</strong>
        </div>
        <div className={styles.summaryItem}>
          <span>Net</span>
          <strong className={totals.net >= 0 ? styles.in : styles.out}>{formatCurrency(totals.net, 'USD', 0)}</strong>
        </div>
        <div className={styles.summaryItem}>
          <span>Transactions</span>
          <strong>{totals.count}</strong>
        </div>
      </section>

      {/* Toolbar */}
      <section className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <InputField
            placeholder="Search by reference or method…"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            iconLeft={<Search size={18} />}
          />
        </div>

        <div className={styles.filters}>
          {TYPE_FILTERS.map((f) => (
            <button
              key={f.id}
              className={`${styles.chip} ${filters.type === f.id ? styles.activeChip : ''}`}
              onClick={() => setFilters({ ...filters, type: f.id })}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className={styles.actionsRow}>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className={styles.select}
          >
            {STATUS_FILTERS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
          <Button variant="secondary" onClick={exportCsv} iconLeft={<Download size={16} />}>Export CSV</Button>
        </div>
      </section>

      {/* Table */}
      <section className={styles.tableCard}>
        {loading ? (
          <Loader fullPage label="Loading transactions" />
        ) : items.length === 0 ? (
          <div className={styles.empty}>
            <h3>No transactions match your filters.</h3>
            <p>Try clearing the search or switching type.</p>
          </div>
        ) : (
          <>
            <TransactionTable transactions={paged} />
            {totalPages > 1 && (
              <footer className={styles.pagination}>
                <span>Page {page} of {totalPages} · {items.length} total</span>
                <div>
                  <Button variant="ghost" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
                  <Button variant="ghost" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</Button>
                </div>
              </footer>
            )}
          </>
        )}
      </section>
    </AuthLayout>
  );
};

export default Transactions;
