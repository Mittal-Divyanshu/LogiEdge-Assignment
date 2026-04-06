import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Billing() {
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [cart, setCart] = useState([]);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/customers').then(r => setCustomers(r.data));
    api.get('/items').then(r => setItems(r.data));
  }, []);

  const handleCustomerChange = (e) => {
    const cust = customers.find(c => c.id === parseInt(e.target.value));
    setSelectedCustomer(cust || null);
    setCart([]);
  };

  const toggleItem = (item) => {
    setCart(prev => {
      const exists = prev.find(c => c.id === item.id);
      if (exists) return prev.filter(c => c.id !== item.id);
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQty = (itemId, qty) => {
    const q = Math.max(1, parseInt(qty) || 1);
    setCart(prev => prev.map(c => c.id === itemId ? { ...c, quantity: q } : c));
  };

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const isGstApplied = selectedCustomer && !selectedCustomer.is_gst_registered;
  const gstAmount = isGstApplied ? subtotal * 0.18 : 0;
  const total = subtotal + gstAmount;

  const fmt = (n) => '₹' + parseFloat(n).toLocaleString('en-IN', { minimumFractionDigits: 2 });

  const handleSubmit = async () => {
    if (!selectedCustomer) return setAlert({ type: 'error', msg: 'Please select a customer.' });
    if (cart.length === 0) return setAlert({ type: 'error', msg: 'Please add at least one item.' });
    setLoading(true);
    try {
      const payload = {
        customer_id: selectedCustomer.id,
        items: cart.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
      };
      const res = await api.post('/invoices', payload);
      setAlert({ type: 'success', msg: `Invoice ${res.data.invoice_id} created!` });
      setTimeout(() => navigate(`/invoice/${res.data.invoice_id}`), 1200);
    } catch (err) {
      setAlert({ type: 'error', msg: err.response?.data?.error || 'Failed to create invoice.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>New Invoice</h2>
          <p>Select customer, add items, and generate invoice</p>
        </div>
      </div>

      {alert && (
        <div className={`alert alert-${alert.type === 'success' ? 'success' : 'error'}`}>
          {alert.msg}
        </div>
      )}

      <div className="two-col">
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-header"><h3>Step 1 — Select Customer</h3></div>
            <div className="card-body">
              <select className="form-control" onChange={handleCustomerChange} defaultValue="">
                <option value="" disabled>Choose a customer...</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name} — {c.email}</option>
                ))}
              </select>
              {selectedCustomer && (
                <div style={{ marginTop: 14, background: 'var(--bg)', padding: 14, borderRadius: 8, border: '1px solid var(--border)' }}>
                  <div style={{ fontWeight: 600 }}>{selectedCustomer.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>{selectedCustomer.email}</div>
                  {selectedCustomer.address && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{selectedCustomer.address}</div>}
                  <div style={{ marginTop: 8 }}>
                    <span className={`badge ${selectedCustomer.is_gst_registered ? 'badge-success' : 'badge-warning'}`}>
                      {selectedCustomer.is_gst_registered ? '✓ GST Registered — No GST applied' : '✗ Not GST Registered — 18% GST applies'}
                    </span>
                  </div>
                  {selectedCustomer.gstin && (
                    <div style={{ fontSize: 12, marginTop: 6, color: 'var(--text-muted)' }}>GSTIN: {selectedCustomer.gstin}</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {selectedCustomer && (
            <div className="card">
              <div className="card-header">
                <h3>Step 2 — Add Items</h3>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{cart.length} selected</span>
              </div>
              <div className="card-body" style={{ padding: 0 }}>
                <table className="items-select-table">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Item</th>
                      <th>Price</th>
                      <th>Qty</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(item => {
                      const inCart = cart.find(c => c.id === item.id);
                      return (
                        <tr key={item.id} style={{ background: inCart ? 'var(--accent-light)' : 'transparent' }}>
                          <td>
                            <input
                              type="checkbox"
                              checked={!!inCart}
                              onChange={() => toggleItem(item)}
                              style={{ accentColor: 'var(--accent)', width: 16, height: 16 }}
                            />
                          </td>
                          <td>
                            <div style={{ fontWeight: 500 }}>{item.name}</div>
                            {item.description && <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.description}</div>}
                          </td>
                          <td>{fmt(item.price)}</td>
                          <td>
                            {inCart ? (
                              <input
                                className="qty-input"
                                type="number"
                                min="1"
                                value={inCart.quantity}
                                onChange={e => updateQty(item.id, e.target.value)}
                              />
                            ) : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                          </td>
                          <td>{inCart ? fmt(inCart.price * inCart.quantity) : '—'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {items.length === 0 && <div className="empty-state"><div className="empty-icon">⊞</div><p>No items in master. Add items first.</p></div>}
              </div>
            </div>
          )}
        </div>

        {selectedCustomer && (
          <div className="card" style={{ position: 'sticky', top: 20 }}>
            <div className="card-header"><h3>Invoice Summary</h3></div>
            <div className="card-body">
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)', fontSize: 13 }}>
                  Select items to see summary
                </div>
              ) : (
                <>
                  <div style={{ marginBottom: 14 }}>
                    {cart.map(item => (
                      <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 13, borderBottom: '1px solid var(--border)' }}>
                        <span>{item.name} <span style={{ color: 'var(--text-muted)' }}>× {item.quantity}</span></span>
                        <span>{fmt(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="summary-box">
                    <div className="summary-row">
                      <span>Subtotal</span>
                      <span>{fmt(subtotal)}</span>
                    </div>
                    <div className="summary-row">
                      <span>GST (18%)</span>
                      <span style={{ color: isGstApplied ? 'var(--danger)' : 'var(--success)' }}>
                        {isGstApplied ? fmt(gstAmount) : 'Not applicable'}
                      </span>
                    </div>
                    <div className="summary-row total">
                      <span>Total</span>
                      <span style={{ color: 'var(--accent)' }}>{fmt(total)}</span>
                    </div>
                  </div>
                  <button
                    className="btn btn-primary"
                    style={{ width: '100%', marginTop: 16, justifyContent: 'center' }}
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? 'Generating...' : '✦ Generate Invoice'}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}