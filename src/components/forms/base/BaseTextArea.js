import React from 'react';
import cn from '../../../utils/cn';

const BaseTextArea = React.forwardRef(({ className = '', ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
      className
    )}
    {...props}
  />
));

BaseTextArea.displayName = 'BaseTextArea';

export default BaseTextArea;