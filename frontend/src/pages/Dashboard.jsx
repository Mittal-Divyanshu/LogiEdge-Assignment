import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Dashboard() {
  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([api.get('/invoices'), api.get('/customers')]).then(([inv, cust]) => {
      setInvoices(inv.data);
      setCustomers(cust.data);
      setLoading(false);
    });
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchError('');
    setSearchResult(null);
    if (!search.trim()) return;
    try {
      const res = await api.get(`/invoices/${search.trim()}`);
      setSearchResult(res.data);
    } catch {
      setSearchError('No invoice found for that ID.');
    }
  };

  const totalRevenue = invoices.reduce((s, i) => s + parseFloat(i.total), 0);
  const totalGst = invoices.reduce((s, i) => s + parseFloat(i.gst_amount || 0), 0);

  const fmt = (n) => '₹' + parseFloat(n).toLocaleString('en-IN', { minimumFractionDigits: 2 });

  return (
    <div className="page">

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#eeeffe' }}>🧾</div>
          <div>
            <div className="label">Total Invoices</div>
            <div className="value">{invoices.length}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#d1fae5' }}>💰</div>
          <div>
            <div className="label">Total Revenue</div>
            <div className="value" style={{ fontSize: 17 }}>{fmt(totalRevenue)}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef3c7' }}>📊</div>
          <div>
            <div className="label">GST Collected</div>
            <div className="value" style={{ fontSize: 17 }}>{fmt(totalGst)}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fee2e2' }}>👥</div>
          <div>
            <div className="label">Customers</div>
            <div className="value">{customers.length}</div>
          </div>
        </div>
      </div>

  
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-body">
          <p style={{ fontWeight: 600, marginBottom: 12 }}>Search Invoice by ID</p>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 10 }}>
            <input
              className="form-control"
              placeholder="e.g. INVC224830"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ maxWidth: 280 }}
            />
            <button type="submit" className="btn btn-primary">Search</button>
            {search && <button type="button" className="btn btn-outline" onClick={() => { setSearch(''); setSearchResult(null); setSearchError(''); }}>Clear</button>}
          </form>
          {searchError && <div className="alert alert-error" style={{ marginTop: 12 }}>{searchError}</div>}
          {searchResult && (
            <div style={{ marginTop: 14, background: 'var(--bg)', borderRadius: 8, padding: 14, border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span className="badge badge-info" style={{ marginRight: 8 }}>{searchResult.invoice_id}</span>
                  <strong>{searchResult.customer_name}</strong>
                  <span style={{ marginLeft: 12, color: 'var(--text-muted)' }}>{new Date(searchResult.created_at).toLocaleDateString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <strong>{fmt(searchResult.total)}</strong>
                  <button className="btn btn-outline btn-sm" onClick={() => navigate(`/invoice/${searchResult.invoice_id}`)}>View</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
 
        <div className="card">
          <div className="card-header">
            <h3>Recent Invoices</h3>
            <button className="btn btn-outline btn-sm" onClick={() => navigate('/invoices')}>View all</button>
          </div>
          <div className="table-wrap">
            {loading ? <div className="loader">Loading...</div> : invoices.length === 0 ? (
              <div className="empty-state"><div className="empty-icon">🧾</div><p>No invoices yet</p></div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Invoice ID</th><th>Customer</th><th>Total</th><th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.slice(0, 8).map(inv => (
                    <tr key={inv.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/invoice/${inv.invoice_id}`)}>
                      <td><span className="badge badge-info">{inv.invoice_id}</span></td>
                      <td>{inv.customer_name}</td>
                      <td><strong>{fmt(inv.total)}</strong></td>
                      <td style={{ color: 'var(--text-muted)' }}>{new Date(inv.created_at).toLocaleDateString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>


        <div className="card">
          <div className="card-header"><h3>Customer Invoice Summary</h3></div>
          <div className="table-wrap">
            {loading ? <div className="loader">Loading...</div> : customers.length === 0 ? (
              <div className="empty-state"><div className="empty-icon">👥</div><p>No customers yet</p></div>
            ) : (
              <table>
                <thead>
                  <tr><th>Customer</th><th>Invoices</th><th>Total Billed</th></tr>
                </thead>
                <tbody>
                  {customers.map(cust => {
                    const custInvoices = invoices.filter(i => i.customer_id === cust.id);
                    const total = custInvoices.reduce((s, i) => s + parseFloat(i.total), 0);
                    return (
                      <tr key={cust.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/invoices?customer=${cust.id}`)}>
                        <td>
                          <div style={{ fontWeight: 500 }}>{cust.name}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{cust.email}</div>
                        </td>
                        <td>{custInvoices.length}</td>
                        <td><strong>{fmt(total)}</strong></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}