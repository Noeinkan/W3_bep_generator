import React from 'react';
import cn from '../../../utils/cn';
import { input } from '../../../config/theme';

const BaseTextInput = React.forwardRef(({ className = '', ...props }, ref) => (
  <input
    ref={ref}
    className={cn(input.base, className)}
    {...props}
  />
));

BaseTextInput.displayName = 'BaseTextInput';

export default BaseTextInput;