import { forwardRef } from 'react';

const Input = forwardRef(
  (
    {
      label,
      type = 'text',
      error,
      helperText,
      icon: Icon,
      className = '',
      id,
      name,
      ...props
    },
    ref
  ) => {
    const inputId = id || name;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <div className="relative rounded-md shadow-xs">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Icon className="h-5 w-5" />
            </div>
          )}
          <input
            id={inputId}
            name={name}
            type={type}
            ref={ref}
            autoComplete={props.autoComplete || (type === 'password' ? 'current-password' : 'on')}
            className={`block w-full rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 ${
              Icon ? 'pl-10' : 'px-3.5'
            } py-2.5 ${
              error
                ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500 bg-red-50/20'
                : 'border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 bg-white'
            } ${className}`}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>}
        {!error && helperText && <p className="mt-1 text-xs text-gray-500">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
