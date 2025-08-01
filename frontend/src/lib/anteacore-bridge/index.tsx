/**
 * AnteaCore Component Bridge for HealthCore
 * Maps and extends AnteaCore shared components for nutrition tracking needs
 */

import React from 'react';
import progressBarStyles from './ProgressBar.module.css';

// Import all CSS modules to ensure theme variables work
import './import-styles';

// Import components from AnteaCore
export { 
  Card,
  Button,
  Badge,
  Modal,
  Input,
  Label,
  Spinner,
  Alert,
  AlertDescription,
  TaskCard,
  DataField,
  Checkbox,
  Select,
  Table
} from '@anteacore/shared';

// Import Card sub-components
export { 
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle
} from '@anteacore/shared';

// Create ProgressBar component since it's not exported from main
export const ProgressBar: React.FC<{
  value: number;
  max?: number;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  className?: string;
}> = ({ value, max = 100, variant = 'primary', className = '' }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const variantClass = progressBarStyles[variant] || progressBarStyles.primary;
  
  return (
    <div className={`${progressBarStyles.progressBar} ${className}`}>
      <div 
        className={`${progressBarStyles.progressBarFill} ${variantClass}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

// Create Tooltip component
export const Tooltip: React.FC<{
  content: string;
  children: React.ReactNode;
  className?: string;
}> = ({ content, children, className = '' }) => {
  return (
    <div className={`relative inline-block ${className}`} title={content}>
      {children}
    </div>
  );
};

// Import hooks
// export { useTheme } from '@anteacore/shared'; // Not yet available

// Re-export types
export type { 
  CardProps,
  ButtonProps,
  BadgeProps,
  ModalProps 
} from '@anteacore/shared';