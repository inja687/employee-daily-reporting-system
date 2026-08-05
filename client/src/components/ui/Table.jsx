import EmptyState from '../common/EmptyState';
import SkeletonLoader from '../common/SkeletonLoader';

const Table = ({
  columns = [],
  data = [],
  isLoading = false,
  emptyMessage = 'No records found',
  onRowClick,
}) => {
  if (isLoading) {
    return <SkeletonLoader type="table" rows={5} />;
  }

  if (!data || data.length === 0) {
    return <EmptyState title="No data available" description={emptyMessage} />;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-xs">
      <table className="w-full text-left text-sm text-gray-600">
        <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase font-semibold text-gray-500 tracking-wider">
          <tr>
            {columns.map((col, index) => (
              <th key={col.key || index} className={`px-6 py-3.5 ${col.headerClassName || ''}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {data.map((row, rowIndex) => (
            <tr
              key={row._id || rowIndex}
              onClick={() => onRowClick && onRowClick(row)}
              className={`hover:bg-gray-50/80 transition-colors ${
                onRowClick ? 'cursor-pointer' : ''
              }`}
            >
              {columns.map((col, colIndex) => (
                <td key={col.key || colIndex} className={`px-6 py-4 whitespace-nowrap ${col.className || ''}`}>
                  {col.render ? col.render(row, rowIndex) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
