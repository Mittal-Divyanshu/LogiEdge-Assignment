import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axios';

export default function AllInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [filterCustomer, setFilterCustomer] = useState('');
  const [loading, setLoading] = useState(true);
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([api.get('/invoices'), api.get('/customers')]).then(([inv, cust]) => {
      setInvoices(inv.data);
      setCustomers(cust.data);
      const custParam = params.get('customer');
      if (custParam) setFilterCustomer(custParam);
      setLoading(false);
    });
  }, []);

  const filtered = filterCustomer
    ? invoices.filter(i => i.customer_id === parseInt(filterCustomer))
    : invoices;

  const fmt = (n) => '₹' + parseFloat(n).toLocaleString('en-IN', { minimumFractionDigits: 2 });

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>All Invoices</h2>
          <p>{filtered.length} invoice{filtered.length !== 1 ? 's' : ''} found</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/billing')}>+ New Invoice</button>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Filter</h3>
          <select className="form-control" style={{ width: 220 }} value={filterCustomer} onChange={e => setFilterCustomer(e.target.value)}>
            <option value="">All customers</option>
            {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="table-wrap">
          {loading ? <div className="loader">Loading...</div> : filtered.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">🧾</div><p>No invoices found.</p></div>
          ) : (
            <table>
              <thead>
                <tr><th>Invoice ID</th><th>Customer</th><th>Subtotal</th><th>GST</th><th>Total</th><th>Date</th><th></th></tr>
              </thead>
              <tbody>
                {filtered.map(inv => (
                  <tr key={inv.id}>
                    <td><span className="badge badge-info">{inv.invoice_id}</span></td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{inv.customer_name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{inv.customer_email}</div>
                    </td>
                    <td>{fmt(inv.subtotal)}</td>
                    <td>
                      {inv.is_gst_applied
                        ? <span className="badge badge-warning">{fmt(inv.gst_amount)}</span>
                        : <span className="badge badge-success">Exempt</span>}
                    </td>
                    <td><strong>{fmt(inv.total)}</strong></td>
                    <td style={{ color: 'var(--text-muted)' }}>{new Date(inv.created_at).toLocaleDateString('en-IN')}</td>
                    <td>
                      <button className="btn btn-outline btn-sm" onClick={() => navigate(`/invoice/${inv.invoice_id}`)}>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}