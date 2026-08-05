import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FiUserPlus, FiUsers } from 'react-icons/fi';
import { registerApi } from '../../services/authService';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import SearchBox from '../../components/ui/SearchBox';
import Pagination from '../../components/ui/Pagination';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Breadcrumb from '../../components/common/Breadcrumb';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      employeeId: '',
      department: '',
      designation: '',
      role: 'Employee',
    },
  });

  const fetchEmployees = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;

      const res = await api.get('/auth/users', { params });
      const userList = res.data?.data?.users || res.data?.data || [];
      const pag = res.data?.data?.pagination || { page: 1, totalPages: 1, total: userList.length };
      setEmployees(userList);
      setPagination(pag);
    } catch (error) {
      toast.error('Failed to load employee list');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchEmployees(1);
  }, [fetchEmployees]);

  const onRegisterUser = async (data) => {
    setActionLoading(true);
    try {
      await registerApi(data);
      toast.success('New employee registered successfully!');
      setModalOpen(false);
      reset();
      fetchEmployees(1);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to register employee');
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    {
      header: 'Employee ID',
      accessor: 'employeeId',
      render: (row) => <span className="font-bold text-gray-900">{row.employeeId}</span>,
    },
    {
      header: 'Name',
      accessor: 'name',
      render: (row) => (
        <div>
          <span className="font-medium text-gray-900 block">{row.name}</span>
          <span className="text-xs text-gray-500">{row.email}</span>
        </div>
      ),
    },
    {
      header: 'Department',
      accessor: 'department',
      render: (row) => row.department || 'Unassigned',
    },
    {
      header: 'Role',
      accessor: 'role',
      render: (row) => (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
          {row.role}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
          {row.status || 'Active'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Employee Management' }]} />

      <Card
        title="Employee Directory"
        subtitle="Manage company staff, assign roles, and register new employees"
        action={
          <Button variant="primary" size="sm" onClick={() => setModalOpen(true)}>
            <FiUserPlus className="mr-1.5" /> Register New Employee
          </Button>
        }
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <SearchBox
            value={search}
            onChange={setSearch}
            placeholder="Search by name or ID..."
            className="w-full sm:w-72"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <Table columns={columns} data={employees} isLoading={loading} emptyMessage="No employees registered" />
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          onPageChange={(page) => fetchEmployees(page)}
        />
      </Card>

      {/* Register User Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Register New Employee">
        <form onSubmit={handleSubmit(onRegisterUser)} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="John Doe"
            error={errors.name?.message}
            {...register('name', { required: 'Name is required' })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="john@company.com"
              error={errors.email?.message}
              {...register('email', { required: 'Email is required' })}
            />
            <Input
              label="Employee ID"
              placeholder="EMP-101"
              error={errors.employeeId?.message}
              {...register('employeeId', { required: 'Employee ID is required' })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Department"
              placeholder="Engineering"
              {...register('department')}
            />
            <Input
              label="Designation"
              placeholder="Software Engineer"
              {...register('designation')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Initial Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password', { required: 'Password is required' })}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register('role')}
              >
                <option value="Employee">Employee</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={actionLoading}>
              Register Employee
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EmployeeManagement;
