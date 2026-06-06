import { useEffect, useState } from 'react';
import api from '../api/client';
import { PageHeader } from '../components/Ui';
import ReportTable from '../components/ReportTable';
import ReportModal from '../components/ReportModal';

export default function TeamReports() {
  const [reports,setReports]=useState([]); const [selected,setSelected]=useState(null); const [status,setStatus]=useState('');
  useEffect(()=>{api.get('/reports/team',{params:{status:status||undefined}}).then(({data})=>setReports(data));},[status]);
  const updated=(report)=>{setReports(reports.map(r=>r.id===report.id?report:r));setSelected(report);};
  return <><PageHeader title="Team reports" subtitle="Review daily updates and give timely feedback." action={<select className="form-select status-filter" value={status} onChange={e=>setStatus(e.target.value)}><option value="">All statuses</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option></select>}/><div className="card table-card"><ReportTable reports={reports} onView={setSelected} showEmployee/></div><ReportModal report={selected} onClose={()=>setSelected(null)} managerMode onUpdated={updated}/></>;
}
