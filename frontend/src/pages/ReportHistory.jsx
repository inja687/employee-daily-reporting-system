import { useEffect, useState } from 'react';
import api from '../api/client';
import { PageHeader } from '../components/Ui';
import ReportTable from '../components/ReportTable';
import ReportModal from '../components/ReportModal';

export default function ReportHistory() {
  const [reports,setReports]=useState([]); const [selected,setSelected]=useState(null);
  useEffect(()=>{api.get('/reports/mine').then(({data})=>setReports(data));},[]);
  return <><PageHeader title="Report history" subtitle="Review your submitted daily reports and manager feedback."/><div className="card table-card"><ReportTable reports={reports} onView={setSelected}/></div><ReportModal report={selected} onClose={()=>setSelected(null)}/></>;
}
