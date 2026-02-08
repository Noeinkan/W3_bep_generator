import React from 'react';
import cn from '../../../utils/cn';
import { fieldError } from '../../../config/theme';

const FieldError = ({ error, className = '', icon = null, iconClassName = '' }) => {
  if (!error) return null;

  return (
    <p className={cn(fieldError.base, className)}>
      {icon && <span className={iconClassName}>{icon}</span>}
      <span>{error}</span>
    </p>
  );
};

export default FieldError;