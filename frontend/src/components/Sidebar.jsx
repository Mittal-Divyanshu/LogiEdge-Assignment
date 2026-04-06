import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon"><span>M</span></div>
        <div>
          <h1>Mittal</h1>
          <p>Billing System</p>
        </div>
      </div>

      <div className="nav-section-label">MENU</div>

      <NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
        <span className="nav-icon">◉</span> Dashboard
      </NavLink>

      <NavLink to="/master" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
        <span className="nav-icon">◈</span> Master
      </NavLink>

      <NavLink to="/billing" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
        <span className="nav-icon">☰</span> Billing
      </NavLink>
    </aside>
  );
}