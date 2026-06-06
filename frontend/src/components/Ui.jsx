export function PageHeader({ title, subtitle, action }) {
  return <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4"><div><h1 className="page-title">{title}</h1><p className="text-muted mb-0">{subtitle}</p></div>{action}</div>;
}

export function StatCard({ label, value = 0, icon, tone = 'teal' }) {
  return <div className="card stat-card h-100"><div className={`stat-icon ${tone}`}><i className={`bi ${icon}`}></i></div><div><div className="stat-value">{Number(value || 0)}</div><div className="text-muted">{label}</div></div></div>;
}

export function StatusBadge({ status }) {
  return <span className={`status status-${status}`}>{status}</span>;
}

export function Alert({ error, success }) {
  const message = success || error;
  if (!message) return null;
  return <div className={`alert alert-${success ? 'success' : 'danger'}`}>{message}</div>;
}

export const getError = (error) => error.response?.data?.message
  || (error.request ? 'Cannot reach the API. Confirm the backend is running on port 5000.' : 'Something went wrong. Please try again.');
