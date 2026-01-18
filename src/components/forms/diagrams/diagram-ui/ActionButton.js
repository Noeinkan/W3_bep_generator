// Enhanced button component with hover effects
// Add this to your OrgStructureChart.js if you want hover effects

import React, { useState } from 'react';

/**
 * ActionButton - A button component with hover effects
 * @param {Object} props
 * @param {Function} props.onClick - Click handler
 * @param {string} props.backgroundColor - Normal background color
 * @param {string} props.children - Button text
 * @param {string} props.size - 'small' | 'medium' | 'large'
 */
export const ActionButton = ({ 
  onClick, 
  backgroundColor, 
  children, 
  size = 'medium',
  type = 'button'
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const sizeStyles = {
    small: { fontSize: '10px', padding: '2px 4px' },
    medium: { fontSize: '11px', padding: '3px 6px' },
    large: { fontSize: '12px', padding: '4px 8px' }
  };

  const baseStyle = {
    ...sizeStyles[size],
    backgroundColor: backgroundColor,
    color: 'white',
    border: 'none',
    borderRadius: size === 'small' ? '2px' : size === 'medium' ? '3px' : '4px',
    cursor: 'pointer',
    boxShadow: isPressed 
      ? '0 1px 1px rgba(0,0,0,0.2)' 
      : isHovered 
        ? '0 2px 6px rgba(0,0,0,0.4)' 
        : '0 1px 3px rgba(0,0,0,0.3)',
    transform: isPressed 
      ? 'translateY(1px)' 
      : isHovered 
        ? 'translateY(-1px)' 
        : 'translateY(0)',
    filter: isHovered ? 'brightness(1.15)' : 'brightness(1)',
    transition: 'all 0.15s ease-in-out',
    fontWeight: '500'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      style={baseStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
    >
      {children}
    </button>
  );
};

// Usage example in OrgStructureChart.js:
/*
import { ActionButton } from './ActionButton';

// In the lead node section, replace regular buttons with:
<ActionButton
  onClick={() => startEditing('lead', leadIndex)}
  backgroundColor={colors.buttonEdit}
  size="medium"
>
  Edit
</ActionButton>

<ActionButton
  onClick={() => deleteLead(leadIndex)}
  backgroundColor={colors.buttonDelete}
  size="medium"
>
  Delete
</ActionButton>

<ActionButton
  onClick={() => addAppointedParty(leadIndex)}
  backgroundColor={colors.buttonAdd}
  size="medium"
>
  Add Appointed
</ActionButton>

// In the appointed party section:
<ActionButton
  onClick={() => startEditing('appointed', leadIndex, appointedIndex)}
  backgroundColor={colors.buttonEdit}
  size="small"
>
  Edit
</ActionButton>

<ActionButton
  onClick={() => deleteAppointedParty(leadIndex, appointedIndex)}
  backgroundColor={colors.buttonDelete}
  size="small"
>
  Del
</ActionButton>
*/
