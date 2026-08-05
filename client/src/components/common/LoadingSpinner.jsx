const LoadingSpinner = ({ fullScreen = true, size = 'md', label = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div
        className={`${sizeClasses[size] || sizeClasses.md} border-blue-600 border-t-transparent rounded-full animate-spin`}
      />
      {label && <p className="text-sm font-medium text-gray-600 animate-pulse">{label}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gray-50/80 backdrop-blur-xs flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return <div className="py-8 flex items-center justify-center">{spinner}</div>;
};

export default LoadingSpinner;
