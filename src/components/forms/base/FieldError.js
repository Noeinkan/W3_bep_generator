import React from 'react';
import cn from '../../../utils/cn';

const FieldError = ({ error, className = '', icon = null, iconClassName = '' }) => {
  if (!error) return null;

  return (
    <p className={cn('text-red-500 text-sm mt-1', className)}>
      {icon && <span className={iconClassName}>{icon}</span>}
      <span>{error}</span>
    </p>
  );
};

export default FieldError;