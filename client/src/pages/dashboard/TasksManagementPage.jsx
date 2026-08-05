import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { getAllTasksApi, createTaskApi, deleteTaskApi } from '../../services/taskService';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Pagination from '../../components/ui/Pagination';
import Breadcrumb from '../../components/common/Breadcrumb';

const TasksManagementPage = () => {
  const [tasks, setTasks] = useState([]);
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
    defaultValues: {
      title: '',
      description: '',
      assignedTo: '',
      priority: 'Medium',
      dueDate: '',
    },
  });

  const fetchTasks = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const res = await getAllTasksApi({ page, limit: 10 });
      setTasks(res.data.tasks || []);
      setPagination(res.data.pagination || { page: 1, totalPages: 1, total: 0 });
    } catch (error) {
      toast.error('Failed to load tasks list');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks(1);
  }, [fetchTasks]);

  const onCreateTask = async (data) => {
    setActionLoading(true);
    try {
      await createTaskApi(data);
      toast.success('Task assigned successfully!');
      setModalOpen(false);
      reset();
      fetchTasks(1);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to assign task');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTaskApi(id);
      toast.success('Task deleted');
      fetchTasks(pagination.page);
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const columns = [
    {
      header: 'Task Title',
      accessor: 'title',
      render: (row) => (
        <div>
          <span className="font-semibold text-gray-900 block">{row.title}</span>
          <span className="text-xs text-gray-500">{row.description}</span>
        </div>
      ),
    },
    {
      header: 'Assigned To',
      accessor: 'assignedTo',
      render: (row) => row.assignedTo?.name || 'Staff Member',
    },
    {
      header: 'Priority',
      accessor: 'priority',
      render: (row) => {
        const priorityColors = {
          High: 'bg-red-100 text-red-800',
          Medium: 'bg-amber-100 text-amber-800',
          Low: 'bg-blue-100 text-blue-800',
        };
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${priorityColors[row.priority]}`}>
            {row.priority}
          </span>
        );
      },
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
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
          className="p-1 text-red-600 hover:bg-red-50 rounded-md transition-colors"
          title="Delete task"
        >
          <FiTrash2 className="text-base" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Task Management' }]} />

      <Card
        title="Organization Tasks Management"
        subtitle="Assign tasks to employees and track task progress"
        action={
          <Button variant="primary" size="sm" onClick={() => setModalOpen(true)}>
            <FiPlus className="mr-1.5" /> Assign New Task
          </Button>
        }
      >
        <Table columns={columns} data={tasks} isLoading={loading} emptyMessage="No tasks assigned yet" />
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          onPageChange={(page) => fetchTasks(page)}
        />
      </Card>

      {/* Assign Task Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Assign New Task">
        <form onSubmit={handleSubmit(onCreateTask)} className="space-y-4">
          <Input
            label="Task Title"
            placeholder="e.g. Build API Endpoints for Dashboard"
            error={errors.title?.message}
            {...register('title', { required: 'Title is required' })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              rows={3}
              placeholder="Task instructions and expected deliverables..."
              className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('description')}
            />
          </div>

          <Input
            label="Assigned Employee ID (MongoDB ObjectId or User Reference)"
            placeholder="Enter User ObjectId"
            error={errors.assignedTo?.message}
            {...register('assignedTo', { required: 'Assigned employee is required' })}
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register('priority')}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <Input label="Due Date" type="date" {...register('dueDate')} />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={actionLoading}>
              Assign Task
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TasksManagementPage;
