import { useRef, useCallback, useEffect } from 'react';

interface UseControlledInputOptions<T> {
  value: T;
  onChange: (value: T) => void;
  validate?: (value: T) => boolean;
  parse?: (value: string) => T;
  format?: (value: T) => string;
  debounceMs?: number;
}

export function useControlledInput<T>({
  value,
  onChange,
  validate,
  parse = (v: string) => v as unknown as T,
  format = (v: T) => String(v),
  debounceMs = 300
}: UseControlledInputOptions<T>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const valueRef = useRef<T>(value);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const localValueRef = useRef<string>(format(value));

  useEffect(() => {
    localValueRef.current = format(value);
  }, [value, format]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    localValueRef.current = newValue;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    try {
      const parsedValue = parse(newValue);
      if (validate && !validate(parsedValue)) {
        return;
      }
      valueRef.current = parsedValue;

      timeoutRef.current = setTimeout(() => {
        onChange(valueRef.current);
      }, debounceMs);
    } catch (error) {
      console.debug('Parse error:', error);
    }
  }, [onChange, parse, validate, debounceMs]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    inputRef,
    inputProps: {
      ref: inputRef,
      value: localValueRef.current,
      onChange: handleChange
    }
  };
}