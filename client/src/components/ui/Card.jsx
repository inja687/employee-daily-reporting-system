const Card = ({ children, title, subtitle, action, footer, className = '' }) => {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden ${className}`}>
      {(title || action) && (
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            {title && <h3 className="text-base font-semibold text-gray-900">{title}</h3>}
            {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
      {footer && <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">{footer}</div>}
    </div>
  );
};

export default Card;
