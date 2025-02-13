import { useState, useRef, useCallback, useEffect } from 'react';

interface UseFormFieldOptions<T> {
  onChange?: (value: T) => void;
  validate?: (value: T) => boolean;
  debounce?: number;
}

export function useFormField<T>(
  initialValue: T,
  options: UseFormFieldOptions<T> = {}
) {
  const [value, setValue] = useState<T>(initialValue);
  const [isDirty, setIsDirty] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const valueRef = useRef<T>(value);

  const handleChange = useCallback((newValue: T) => {
    if (!isDirty) setIsDirty(true);
    
    if (options.validate && !options.validate(newValue)) {
      return;
    }

    valueRef.current = newValue;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setValue(valueRef.current);
      options.onChange?.(valueRef.current);
    }, options.debounce || 0);
  }, [isDirty, options]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    value,
    onChange: handleChange,
    isDirty
  };
}