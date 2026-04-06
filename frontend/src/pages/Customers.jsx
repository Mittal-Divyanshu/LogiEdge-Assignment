import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/customers').then(r => {
      setCustomers(r.data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: 22, fontWeight: 700 }}>CUSTOMERS</h2>
        <button className="add-fab" onClick={() => navigate('/master/customers/add')}>
          + ADD
        </button>
      </div>

      {loading ? (
        <div className="loader">Loading...</div>
      ) : customers.length === 0 ? (
        <div className="empty-add-state">
          <div style={{ fontSize: 40 }}>👥</div>
          <p>No customers yet.</p>
          <button className="add-fab" onClick={() => navigate('/master/customers/add')}>
            + ADD CUSTOMER
          </button>
        </div>
      ) : (
        <div className="card-grid">
          {customers.map(c => (
            <div className="item-card" key={c.id}>
              <div className="item-card-name">{c.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{c.email}</div>
              <div className="item-card-footer">
                <span className={c.status === 'active' ? 'badge-active' : 'badge-inactive'}>
                  {c.status === 'active' ? 'Active' : 'In-Active'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}