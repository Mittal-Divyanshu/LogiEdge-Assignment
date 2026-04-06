import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Items() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/items').then(r => {
      setItems(r.data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: 22, fontWeight: 700 }}>ITEMS</h2>
        <button className="add-fab" onClick={() => navigate('/master/items/add')}>
          + ADD
        </button>
      </div>

      {loading ? (
        <div className="loader">Loading...</div>
      ) : items.length === 0 ? (
        <div className="empty-add-state">
          <div style={{ fontSize: 40 }}>📦</div>
          <p>No items yet.</p>
          <button className="add-fab" onClick={() => navigate('/master/items/add')}>
            + ADD ITEM
          </button>
        </div>
      ) : (
        <div className="card-grid">
          {items.map(item => (
            <div className="item-card" key={item.id}>
              <div className="item-card-name">{item.name}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
                ₹{parseFloat(item.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
              <div className="item-card-footer">
                <span className={item.status === 'active' ? 'badge-active' : 'badge-inactive'}>
                  {item.status === 'active' ? 'Active' : 'In-Active'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}