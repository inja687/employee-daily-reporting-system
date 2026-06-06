import { StatusBadge } from './Ui';

export default function ReportTable({ reports, onView, showEmployee = false }) {
  if (!reports.length) return <div className="empty-state"><i className="bi bi-inbox"></i><h5>No reports found</h5><p>Reports will appear here when available.</p></div>;
  return <div className="table-responsive"><table className="table align-middle mb-0"><thead><tr>{showEmployee && <th>Employee</th>}<th>Date</th><th>Hours</th><th>Work summary</th><th>Status</th><th></th></tr></thead><tbody>{reports.map(r => <tr key={r.id}>{showEmployee && <td><strong>{r.employee_name}</strong><small className="d-block text-muted">{r.employee_email}</small></td>}<td>{new Date(`${r.report_date}T00:00:00`).toLocaleDateString()}</td><td>{r.hours_worked}</td><td className="summary-cell">{r.tasks_completed}</td><td><StatusBadge status={r.status}/></td><td><button className="btn btn-sm btn-light" onClick={() => onView(r)}>View</button></td></tr>)}</tbody></table></div>;
}
