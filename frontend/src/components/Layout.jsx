import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = {
  employee: [
    ['/dashboard', 'bi-grid', 'Dashboard'], ['/submit-report', 'bi-pencil-square', 'Submit Report'], ['/history', 'bi-clock-history', 'Report History'],
  ],
  manager: [['/dashboard', 'bi-grid', 'Dashboard'], ['/team-reports', 'bi-people', 'Team Reports']],
  admin: [['/dashboard', 'bi-grid', 'Dashboard'], ['/users', 'bi-person-gear', 'Manage Users'], ['/assignments', 'bi-diagram-3', 'Assignments']],
};

export default function Layout() {
  const { user, logout } = useAuth();
  return <div className="app-shell">
    <aside className="sidebar offcanvas-lg offcanvas-start" tabIndex="-1" id="sidebar">
      <div className="d-flex align-items-center gap-2 px-4 py-4 brand"><span className="brand-mark">D</span><span>DailyFlow</span></div>
      <div className="px-3"><div className="user-card"><div className="avatar">{user.name[0]}</div><div><strong>{user.name}</strong><small>{user.role}</small></div></div></div>
      <nav className="nav flex-column px-3 mt-4 gap-1">
        {links[user.role].map(([to, icon, label]) => <NavLink key={to} to={to} className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}><i className={`bi ${icon}`}></i>{label}</NavLink>)}
      </nav>
      <button className="btn logout-btn mt-auto mx-3 mb-4" onClick={logout}><i className="bi bi-box-arrow-left"></i> Sign out</button>
    </aside>
    <main className="main-content">
      <header className="topbar"><button className="btn d-lg-none" data-bs-toggle="offcanvas" data-bs-target="#sidebar"><i className="bi bi-list fs-4"></i></button><div className="ms-auto text-end"><small className="text-muted">Signed in as</small><div className="fw-semibold">{user.email}</div></div></header>
      <div className="content-wrap"><Outlet /></div>
    </main>
  </div>;
}
