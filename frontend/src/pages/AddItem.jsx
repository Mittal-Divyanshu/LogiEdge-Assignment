import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function AddItem() {
  const [form, setForm] = useState({ name: '', price: '', status: 'active' });
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!form.name || !form.price) {
      setAlert({ type: 'error', msg: 'Item name and price are required.' });
      return;
    }
    try {
      await api.post('/items', { ...form, price: parseFloat(form.price) });
      navigate('/master/items');
    } catch (err) {
      setAlert({ type: 'error', msg: err.response?.data?.error || 'Failed to add item.' });
    }
  };

  return (
    <div className="page">
      <div className="form-page">
        <h2>Add New Item</h2>

        {alert && (
          <div className={`alert alert-${alert.type === 'success' ? 'success' : 'error'}`} style={{ marginBottom: 20 }}>
            {alert.msg}
          </div>
        )}

        <div className="form-field-group">
          <div className="form-field">
            <label>Item Name</label>
            <input
              type="text"
              placeholder=""
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="form-field">
            <label>Customer Selling Price</label>
            <input
              type="number"
              placeholder=""
              value={form.price}
              onChange={e => setForm({ ...form, price: e.target.value })}
            />
          </div>
        </div>

        <div className="form-field-group">
          <div className="form-field">
            <label>Item Status</label>
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
              <option value="active">Active</option>
              <option value="inactive">In-Active</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button className="btn-cancel" onClick={() => navigate('/master/items')}>Cancel</button>
          <button className="btn-create" onClick={handleSubmit}>Create</button>
        </div>
      </div>
    </div>
  );
}