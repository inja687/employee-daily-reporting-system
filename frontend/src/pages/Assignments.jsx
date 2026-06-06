import { useEffect, useState } from 'react';
import api from '../api/client';
import { PageHeader } from '../components/Ui';

export default function Assignments(){
 const [employees,setEmployees]=useState([]),[managers,setManagers]=useState([]),[saved,setSaved]=useState('');
 const load=()=>api.get('/admin/users').then(({data})=>{setEmployees(data.filter(u=>u.role==='employee'));setManagers(data.filter(u=>u.role==='manager'&&u.is_active));});
 useEffect(()=>{load();},[]);
 const assign=async(employee,manager_id)=>{await api.patch(`/admin/employees/${employee.id}/manager`,{manager_id:manager_id||null});setSaved(`Assignment updated for ${employee.name}.`);load();setTimeout(()=>setSaved(''),2500);};
 return <><PageHeader title="Team assignments" subtitle="Assign each employee to the manager responsible for reviewing their reports."/>{saved&&<div className="alert alert-success">{saved}</div>}<div className="card table-card"><div className="table-responsive"><table className="table align-middle mb-0"><thead><tr><th>Employee</th><th>Email</th><th>Assigned manager</th></tr></thead><tbody>{employees.map(e=><tr key={e.id}><td><strong>{e.name}</strong></td><td>{e.email}</td><td><select className="form-select assignment-select" value={e.manager_id||''} onChange={event=>assign(e,event.target.value)}><option value="">Unassigned</option>{managers.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}</select></td></tr>)}</tbody></table></div></div></>;
}
