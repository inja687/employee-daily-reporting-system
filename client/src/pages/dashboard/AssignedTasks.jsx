import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { getMyTasksApi, updateTaskStatusApi } from '../../services/taskService';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Pagination from '../../components/ui/Pagination';
import Breadcrumb from '../../components/common/Breadcrumb';

const AssignedTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const res = await getMyTasksApi({ page, limit: 10 });
      setTasks(res.data.tasks || []);
      setPagination(res.data.pagination || { page: 1, totalPages: 1, total: 0 });
    } catch (error) {
      toast.error('Failed to load assigned tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks(1);
  }, [fetchTasks]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTaskStatusApi(taskId, newStatus);
      toast.success(`Task status updated to ${newStatus}`);
      fetchTasks(pagination.page);
    } catch (error) {
      toast.error('Failed to update task status');
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
      header: 'Assigned By',
      accessor: 'assignedBy',
      render: (row) => row.assignedBy?.name || 'Manager',
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
      header: 'Status Update',
      accessor: 'status',
      render: (row) => (
        <select
          value={row.status}
          onChange={(e) => handleStatusChange(row._id, e.target.value)}
          className="px-2.5 py-1 border border-gray-300 rounded-md text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Deferred">Deferred</option>
        </select>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Assigned Tasks' }]} />

      <Card title="Assigned Work Tasks" subtitle="Track and update your assigned tasks">
        <Table columns={columns} data={tasks} isLoading={loading} emptyMessage="No tasks assigned to you" />
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          onPageChange={(page) => fetchTasks(page)}
        />
      </Card>
    </div>
  );
};

export default AssignedTasks;
