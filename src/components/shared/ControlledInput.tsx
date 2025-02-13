import React from 'react';
import { useControlledInput } from '../../hooks/useControlledInput';

interface ControlledInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string | number;
  onChange: (value: string | number) => void;
  type?: 'text' | 'number';
  validate?: (value: any) => boolean;
  className?: string;
  debounceMs?: number;
}

export function ControlledInput({
  value,
  onChange,
  type = 'text',
  validate,
  className = '',
  debounceMs = 300,
  ...props
}: ControlledInputProps) {
  const parse = (v: string) => {
    if (type === 'number') {
      return v === '' ? '' : Number(v);
    }
    return v;
  };
  
  const { inputProps } = useControlledInput({
    value,
    onChange,
    validate,
    parse,
    debounceMs
  });

  return (
    <input
      {...props}
      {...inputProps}
      type={type}
      className={`w-full px-4 py-3 border-2 border-gray-200 rounded-lg 
        focus:border-[#43d18a] focus:ring focus:ring-[#43d18a]/20 
        text-gray-900 transition-colors ${className}`}
    />
  );
}