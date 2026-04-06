import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function InvoiceDetail() {
  const { invoiceId } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const printRef = useRef();

  useEffect(() => {
    api.get(`/invoices/${invoiceId}`)
      .then(r => { setInvoice(r.data); setLoading(false); })
      .catch(() => { setError('Invoice not found.'); setLoading(false); });
  }, [invoiceId]);

  const fmt = (n) => '₹' + parseFloat(n).toLocaleString('en-IN', { minimumFractionDigits: 2 });

  const handlePrint = () => window.print();

  if (loading) return <div className="page"><div className="loader">Loading invoice...</div></div>;
  if (error) return <div className="page"><div className="alert alert-error">{error}</div></div>;

  return (
    <div className="page">
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <button className="btn btn-outline" onClick={() => navigate(-1)}>← Back</button>
        <button className="btn btn-primary" onClick={handlePrint}>⎙ Print Invoice</button>
      </div>

      <div className="card invoice-detail" ref={printRef}>
        <div className="card-body" style={{ padding: 36 }}>
          {/* Header */}
          <div className="invoice-meta">
            <div>
              <h1>INVOICE</h1>
              <div style={{ marginTop: 4 }}>
                <span className="badge badge-info" style={{ fontSize: 13, padding: '5px 12px' }}>{invoice.invoice_id}</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 22, fontWeight: 700 }}>BillPro</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Billing Management System</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                Date: {new Date(invoice.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </div>
            </div>
          </div>

          {/* Bill to */}
          <div style={{ background: 'var(--bg)', borderRadius: 8, padding: 18, marginBottom: 28, border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.07em', marginBottom: 8 }}>BILL TO</div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{invoice.customer_name}</div>
            {invoice.customer_email && <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 3 }}>{invoice.customer_email}</div>}
            {invoice.customer_phone && <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{invoice.customer_phone}</div>}
            {invoice.customer_address && <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 3 }}>{invoice.customer_address}</div>}
            {invoice.gstin && <div style={{ fontSize: 12, marginTop: 6 }}>GSTIN: <strong>{invoice.gstin}</strong></div>}
          </div>

          {/* Items table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 24 }}>
            <thead>
              <tr style={{ background: 'var(--sidebar)', color: '#fff' }}>
                <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: 12, fontWeight: 600, borderRadius: '8px 0 0 0' }}>#</th>
                <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: 12, fontWeight: 600 }}>Item</th>
                <th style={{ padding: '10px 14px', textAlign: 'right', fontSize: 12, fontWeight: 600 }}>Price</th>
                <th style={{ padding: '10px 14px', textAlign: 'right', fontSize: 12, fontWeight: 600 }}>Qty</th>
                <th style={{ padding: '10px 14px', textAlign: 'right', fontSize: 12, fontWeight: 600, borderRadius: '0 8px 0 0' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, idx) => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px 14px', color: 'var(--text-muted)', fontSize: 13 }}>{idx + 1}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 500 }}>{item.item_name}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'right', fontSize: 13 }}>{fmt(item.price)}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'right', fontSize: 13 }}>{item.quantity}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 600 }}>{fmt(item.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ width: 280 }}>
              <div className="summary-box">
                <div className="summary-row">
                  <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                  <span>{fmt(invoice.subtotal)}</span>
                </div>
                <div className="summary-row">
                  <span style={{ color: 'var(--text-muted)' }}>
                    GST (18%) {!invoice.is_gst_applied && <span className="badge badge-success" style={{ marginLeft: 4 }}>Exempt</span>}
                  </span>
                  <span>{invoice.is_gst_applied ? fmt(invoice.gst_amount) : '₹0.00'}</span>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span style={{ color: 'var(--accent)', fontSize: 18 }}>{fmt(invoice.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ marginTop: 36, paddingTop: 18, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              <p>Thank you for your business.</p>
              <p style={{ marginTop: 4 }}>This is a computer-generated invoice.</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 24 }}>Authorised Signature</div>
              <div style={{ borderTop: '1px solid var(--text-muted)', paddingTop: 6, fontSize: 12, color: 'var(--text-muted)', width: 160 }}>BillPro</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}