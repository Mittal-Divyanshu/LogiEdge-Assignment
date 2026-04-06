import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function AddCustomer() {
  const [form, setForm] = useState({
    name: '',
    address: '',
    pan: '',
    gstin: '',
    status: 'active',
  });
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!form.name) {
      setAlert({ type: 'error', msg: 'Customer name is required.' });
      return;
    }
    try {
      // derive is_gst_registered from whether gstin is filled
      const payload = {
        name: form.name,
        email: form.email, 
        address: form.address,
        gstin: form.gstin,
        pan: form.pan,
        is_gst_registered: form.gstin ? true : false,
        status: form.status,
      };
      await api.post('/customers', payload);
      navigate('/master/customers');
    } catch (err) {
      setAlert({ type: 'error', msg: err.response?.data?.error || 'Failed to add customer.' });
    }
  };

  return (
    <div className="page">
      <div className="form-page">
        <h2>Add New Customer</h2>

        {alert && (
          <div className={`alert alert-${alert.type === 'success' ? 'success' : 'error'}`} style={{ marginBottom: 20 }}>
            {alert.msg}
          </div>
        )}

        <div className="form-field-group">
          <div className="form-field">
            <label>Customer Name</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="form-field">
            <label>Customer Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
          </div>
        </div>

        <div className="form-field-group">
          <div className="form-field">
            <label>Customer Pan Card Number</label>
            <input
              type="text"
              value={form.pan}
              onChange={e => setForm({ ...form, pan: e.target.value })}
              maxLength={10}
            />
          </div>
          <div className="form-field">
            <label>Customer GST Number</label>
            <input
              type="text"
              value={form.gstin}
              onChange={e => setForm({ ...form, gstin: e.target.value })}
              maxLength={15}
            />
          </div>
        </div>

        <div className="form-field-group">
          <div className="form-field">
            <label>Customer Status</label>
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
              <option value="active">Active</option>
              <option value="inactive">In-Active</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button className="btn-cancel" onClick={() => navigate('/master/customers')}>Cancel</button>
          <button className="btn-create" onClick={handleSubmit}>Create</button>
        </div>
      </div>
    </div>
  );
}