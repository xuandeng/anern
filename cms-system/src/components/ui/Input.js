'use client';

import { forwardRef } from 'react';

const Input = forwardRef(({ 
  className = '', 
  type = 'text',
  error = false,
  disabled = false,
  ...props 
}, ref) => {
  const baseClasses = 'flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';
  
  const borderClasses = error 
    ? 'border-red-500 focus-visible:ring-red-500' 
    : 'border-gray-300 focus-visible:ring-blue-500';
  
  const combinedClassName = `${baseClasses} ${borderClasses} ${className}`;

  return (
    <input
      type={type}
      className={combinedClassName}
      ref={ref}
      disabled={disabled}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export default Input;