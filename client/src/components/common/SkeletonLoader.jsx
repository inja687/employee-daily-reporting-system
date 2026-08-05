const SkeletonLoader = ({ type = 'card', rows = 3 }) => {
  if (type === 'table') {
    return (
      <div className="border border-gray-200 rounded-xl p-4 bg-white space-y-4 animate-pulse">
        <div className="h-6 bg-gray-200 rounded-md w-1/4" />
        <div className="space-y-3">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 rounded-md w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-xl p-6 bg-white space-y-4 animate-pulse">
      <div className="h-5 bg-gray-200 rounded-md w-1/3" />
      <div className="h-10 bg-gray-100 rounded-md w-full" />
      <div className="h-4 bg-gray-100 rounded-md w-2/3" />
    </div>
  );
};

export default SkeletonLoader;
