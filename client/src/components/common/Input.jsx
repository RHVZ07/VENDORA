import React, { forwardRef } from 'react';

const Input = forwardRef(
  ({ type = 'text', error, className = '', ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={`form-input ${error ? 'error' : ''} ${className}`}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
export default Input;
