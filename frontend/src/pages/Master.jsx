import { useNavigate } from 'react-router-dom';

export default function Master() {
  const navigate = useNavigate();

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Master Data</h2>
          <p>Manage customers and items</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, maxWidth: 600 }}>
        <div
          className="card"
          style={{ padding: 32, cursor: 'pointer', textAlign: 'center' }}
          onClick={() => navigate('/master/customers')}
        >
          <div style={{ fontSize: 36, marginBottom: 12 }}>👥</div>
          <div style={{ fontSize: 17, fontWeight: 700 }}>Customers</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6 }}>View and add customers</div>
        </div>

        <div
          className="card"
          style={{ padding: 32, cursor: 'pointer', textAlign: 'center' }}
          onClick={() => navigate('/master/items')}
        >
          <div style={{ fontSize: 36, marginBottom: 12 }}>📦</div>
          <div style={{ fontSize: 17, fontWeight: 700 }}>Items</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6 }}>View and add items</div>
        </div>
      </div>
    </div>
  );
}