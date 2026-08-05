import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2, FiSave, FiSend } from 'react-icons/fi';
import { createReportApi } from '../../services/reportService';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Breadcrumb from '../../components/common/Breadcrumb';

const SubmitReport = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      workSummary: '',
      blockers: '',
      hoursWorked: 8,
      tasksCompleted: [{ title: '', description: '', timeSpentHours: 2 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tasksCompleted',
  });

  const onSubmit = async (data, isSubmitAction = false) => {
    setIsLoading(true);
    try {
      const payload = {
        ...data,
        isSubmit: isSubmitAction,
      };
      await createReportApi(payload);
      toast.success(
        isSubmitAction
          ? 'Daily report submitted successfully!'
          : 'Daily report saved as draft!'
      );
      navigate('/dashboard/reports');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit report');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Daily Reports', path: '/dashboard/reports' }, { label: 'Submit Report' }]} />

      <Card title="Submit Daily Work Report" subtitle="Record your daily tasks, achievements, and blockers">
        <form className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="Report Date"
              type="date"
              error={errors.date?.message}
              {...register('date', { required: 'Date is required' })}
            />
            <Input
              label="Hours Worked"
              type="number"
              step="0.5"
              error={errors.hoursWorked?.message}
              {...register('hoursWorked', {
                required: 'Hours worked is required',
                min: { value: 0.5, message: 'Minimum 0.5 hours required' },
              })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Work Summary <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="Provide a comprehensive summary of your work completed today..."
              className={`w-full p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                errors.workSummary
                  ? 'border-red-300 focus:ring-red-500 bg-red-50/20'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              {...register('workSummary', { required: 'Work summary is required' })}
            />
            {errors.workSummary && (
              <p className="mt-1 text-xs text-red-600 font-medium">{errors.workSummary.message}</p>
            )}
          </div>

          {/* Dynamic Tasks Completed List */}
          <div className="space-y-4 pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-gray-900">Completed Tasks Items</h4>
              <button
                type="button"
                onClick={() => append({ title: '', description: '', timeSpentHours: 1 })}
                className="inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                <FiPlus className="mr-1 text-sm" /> Add Task Item
              </button>
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200 relative space-y-3">
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                    title="Remove task"
                  >
                    <FiTrash2 className="text-base" />
                  </button>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <Input
                      label={`Task Title #${index + 1}`}
                      placeholder="e.g. Implemented User Auth Middleware"
                      {...register(`tasksCompleted.${index}.title`, { required: 'Task title required' })}
                    />
                  </div>
                  <Input
                    label="Hours Spent"
                    type="number"
                    step="0.5"
                    {...register(`tasksCompleted.${index}.timeSpentHours`, { valueAsNumber: true })}
                  />
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Blockers / Challenges (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Any technical issues, missing dependencies, or impediments..."
              className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('blockers')}
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              isLoading={isLoading}
              onClick={handleSubmit((data) => onSubmit(data, false))}
            >
              <FiSave className="mr-2" /> Save as Draft
            </Button>
            <Button
              type="button"
              variant="primary"
              isLoading={isLoading}
              onClick={handleSubmit((data) => onSubmit(data, true))}
            >
              <FiSend className="mr-2" /> Submit Final Report
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default SubmitReport;
