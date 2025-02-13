import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useControlledInput } from '../useControlledInput';

describe('useControlledInput', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('initializes with the provided value', () => {
    const { result } = renderHook(() => 
      useControlledInput({
        value: 'test',
        onChange: vi.fn()
      })
    );

    expect(result.current.inputProps.value).toBe('test');
  });

  it('debounces onChange calls', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => 
      useControlledInput({
        value: '',
        onChange,
        debounceMs: 300
      })
    );

    act(() => {
      result.current.inputProps.onChange({ 
        target: { value: 'test' } 
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(onChange).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(onChange).toHaveBeenCalledWith('test');
  });

  it('validates input values', () => {
    const onChange = vi.fn();
    const validate = (value: number) => value >= 0;

    const { result } = renderHook(() => 
      useControlledInput({
        value: 0,
        onChange,
        validate,
        parse: (v: string) => Number(v)
      })
    );

    act(() => {
      result.current.inputProps.onChange({ 
        target: { value: '-1' } 
      } as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(onChange).not.toHaveBeenCalled();

    act(() => {
      result.current.inputProps.onChange({ 
        target: { value: '5' } 
      } as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(onChange).toHaveBeenCalledWith(5);
  });

  it('handles parsing errors gracefully', () => {
    const onChange = vi.fn();
    const consoleSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});

    const { result } = renderHook(() => 
      useControlledInput({
        value: 0,
        onChange,
        parse: (v: string) => {
          if (v === 'invalid') throw new Error('Parse error');
          return Number(v);
        }
      })
    );

    act(() => {
      result.current.inputProps.onChange({ 
        target: { value: 'invalid' } 
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(consoleSpy).toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});