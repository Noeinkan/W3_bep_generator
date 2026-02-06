import React from 'react';
import cn from '../../../utils/cn';

const BaseTextInput = React.forwardRef(({ className = '', ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      'w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
      className
    )}
    {...props}
  />
));

BaseTextInput.displayName = 'BaseTextInput';

export default BaseTextInput;