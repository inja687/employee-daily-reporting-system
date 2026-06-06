import { useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { PageHeader, StatCard } from '../components/Ui';

const configs = {
  employee: [['Total reports','total_reports','bi-journal-text','teal'],['Pending','pending_reports','bi-hourglass-split','amber'],['Approved','approved_reports','bi-check-circle','green'],['Rejected','rejected_reports','bi-x-circle','red']],
  manager: [['Team members','team_size','bi-people','teal'],['Total reports','total_reports','bi-journal-text','blue'],['Awaiting review','pending_reports','bi-hourglass-split','amber'],['Approved','approved_reports','bi-check-circle','green']],
  admin: [['Employees','employees','bi-person','teal'],['Managers','managers','bi-person-badge','blue'],['Active users','active_users','bi-activity','green'],['Pending reports','pending_reports','bi-hourglass-split','amber']],
};

export default function Dashboard() {
  const { user } = useAuth(); const [stats, setStats] = useState({});
  useEffect(() => { api.get('/dashboard').then(({data}) => setStats(data)); }, []);
  return <><PageHeader title={`Good day, ${user.name.split(' ')[0]}`} subtitle={`Here is your ${user.role} workspace overview.`}/><div className="row g-3">{configs[user.role].map(([label,key,icon,tone]) => <div className="col-sm-6 col-xl-3" key={key}><StatCard label={label} value={stats[key]} icon={icon} tone={tone}/></div>)}</div><div className="card welcome-card mt-4"><div><span className="eyebrow">DAILY REPORTING</span><h3>Keep the team aligned</h3><p className="text-muted mb-0">Submit focused updates, review progress, and resolve blockers before they slow the team down.</p></div><i className="bi bi-bar-chart-line"></i></div></>;
}
