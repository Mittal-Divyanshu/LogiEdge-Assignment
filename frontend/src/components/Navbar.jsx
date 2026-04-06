import { useLocation } from 'react-router-dom';

const titles = {
  '/': 'Dashboard',
  '/master': 'Master',
  '/master/customers': 'Master',
  '/master/customers/add': 'Master',
  '/master/items': 'Master',
  '/master/items/add': 'Master',
  '/billing': 'Billing',
  '/invoices': 'Invoices',
};

export default function Navbar() {
  const location = useLocation();
  const title = titles[location.pathname] || 'Mittal';

  return (
    <header className="topbar">
      <div><h2>{title}</h2></div>
      <div className="topbar-right">
        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Admin</span>
        <div className="avatar">A</div>
      </div>
    </header>
  );
}