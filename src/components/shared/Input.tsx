import React, { forwardRef, useRef, useCallback, useEffect } from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon;
  label?: string;
  description?: string;
  error?: string;
  onValueChange?: (value: string) => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  icon: Icon,
  label,
  description,
  error,
  className = '',
  onChange,
  onValueChange,
  value,
  ...props
}, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const valueRef = useRef<string>(value as string);
  const timeoutRef = useRef<number>();

  const combinedRef = (node: HTMLInputElement) => {
    inputRef.current = node;
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  };

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.persist();
    const newValue = e.target.value;
    
    // Update the ref immediately
    valueRef.current = newValue;

    // Clear any existing timeout
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    // Schedule the state update
    timeoutRef.current = window.setTimeout(() => {
      requestAnimationFrame(() => {
        if (onChange) {
          onChange(e);
        }
        if (onValueChange) {
          onValueChange(valueRef.current);
        }
      });
    }, 0);
  }, [onChange, onValueChange]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-1">
      {label && (
        <label 
          htmlFor={props.id} 
          className="block text-sm font-medium text-gray-700"
        >
          {Icon && <Icon className="w-4 h-4 inline mr-2" />}
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={combinedRef}
          {...props}
          value={value}
          onChange={handleChange}
          className={`
            w-full px-4 py-3 
            border-2 border-gray-200 rounded-lg 
            focus:border-[#43d18a] focus:ring focus:ring-[#43d18a]/20 
            text-gray-900 
            transition-colors
            ${Icon ? 'pl-10' : ''}
            ${error ? 'border-red-300' : ''}
            ${className}
          `}
        />
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="w-5 h-5 text-gray-400" />
          </div>
        )}
      </div>
      {description && (
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      )}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';