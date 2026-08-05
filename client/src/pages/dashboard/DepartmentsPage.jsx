import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FiPlus, FiBriefcase } from 'react-icons/fi';
import {
  getDepartmentsApi,
  createDepartmentApi,
  deleteDepartmentApi,
} from '../../services/departmentService';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Pagination from '../../components/ui/Pagination';
import Breadcrumb from '../../components/common/Breadcrumb';

const DepartmentsPage = () => {
  const [departments, setDepartments] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { name: '', code: '', description: '' },
  });

  const fetchDepartments = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const res = await getDepartmentsApi({ page, limit: 10 });
      setDepartments(res.data.departments || []);
      setPagination(res.data.pagination || { page: 1, totalPages: 1, total: 0 });
    } catch (error) {
      toast.error('Failed to load departments');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDepartments(1);
  }, [fetchDepartments]);

  const onCreateDepartment = async (data) => {
    setActionLoading(true);
    try {
      await createDepartmentApi(data);
      toast.success('Department created successfully!');
      setModalOpen(false);
      reset();
      fetchDepartments(1);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create department');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDepartmentApi(id);
      toast.success('Department deleted');
      fetchDepartments(pagination.page);
    } catch (error) {
      toast.error('Failed to delete department');
    }
  };

  const columns = [
    {
      header: 'Code',
      accessor: 'code',
      render: (row) => <span className="font-bold text-blue-600">{row.code}</span>,
    },
    {
      header: 'Department Name',
      accessor: 'name',
      render: (row) => <span className="font-semibold text-gray-900">{row.name}</span>,
    },
    {
      header: 'Description',
      accessor: 'description',
      render: (row) => row.description || '-',
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
          {row.status}
        </span>
      ),
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (row) => (
        <button
          onClick={() => handleDelete(row._id)}
          className="text-xs font-semibold text-red-600 hover:underline"
        >
          Delete
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Departments' }]} />

      <Card
        title="Department Management"
        subtitle="Organize company departments and operational units"
        action={
          <Button variant="primary" size="sm" onClick={() => setModalOpen(true)}>
            <FiPlus className="mr-1.5" /> Add Department
          </Button>
        }
      >
        <Table columns={columns} data={departments} isLoading={loading} emptyMessage="No departments configured" />
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          onPageChange={(page) => fetchDepartments(page)}
        />
      </Card>

      {/* Add Department Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create New Department">
        <form onSubmit={handleSubmit(onCreateDepartment)} className="space-y-4">
          <Input
            label="Department Name"
            placeholder="e.g. Software Engineering"
            error={errors.name?.message}
            {...register('name', { required: 'Department name is required' })}
          />

          <Input
            label="Department Code"
            placeholder="e.g. ENG"
            error={errors.code?.message}
            {...register('code', { required: 'Department code is required' })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              rows={3}
              placeholder="Brief description of department scope..."
              className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('description')}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={actionLoading}>
              Create Department
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DepartmentsPage;
