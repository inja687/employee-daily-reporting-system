import { FiInbox } from 'react-icons/fi';
import Button from '../ui/Button';

const EmptyState = ({
  title = 'No records found',
  description = 'There is no data to display right now.',
  icon: Icon = FiInbox,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="py-12 px-4 text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
      <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
        <Icon className="text-2xl" />
      </div>
      <h4 className="text-base font-semibold text-gray-800 mb-1">{title}</h4>
      <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
