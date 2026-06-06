import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SubmitReport from './pages/SubmitReport';
import ReportHistory from './pages/ReportHistory';
import TeamReports from './pages/TeamReports';
import ManageUsers from './pages/ManageUsers';
import Assignments from './pages/Assignments';

export default function App(){return <Routes><Route path="/login" element={<Login/>}/><Route element={<ProtectedRoute/>}><Route element={<Layout/>}><Route path="/dashboard" element={<Dashboard/>}/><Route element={<ProtectedRoute roles={['employee']}/>}><Route path="/submit-report" element={<SubmitReport/>}/><Route path="/history" element={<ReportHistory/>}/></Route><Route element={<ProtectedRoute roles={['manager']}/>}><Route path="/team-reports" element={<TeamReports/>}/></Route><Route element={<ProtectedRoute roles={['admin']}/>}><Route path="/users" element={<ManageUsers/>}/><Route path="/assignments" element={<Assignments/>}/></Route></Route></Route><Route path="*" element={<Navigate to="/dashboard" replace/>}/></Routes>}
