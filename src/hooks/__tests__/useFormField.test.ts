import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFormField } from '../useFormField';

describe('useFormField', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('initializes with the provided value', () => {
    const { result } = renderHook(() => useFormField('test'));
    expect(result.current.value).toBe('test');
    expect(result.current.isDirty).toBe(false);
  });

  it('updates value and isDirty flag when changed', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => 
      useFormField('initial', { onChange, debounce: 300 })
    );

    act(() => {
      result.current.onChange('updated');
    });

    expect(result.current.isDirty).toBe(true);
    expect(onChange).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(onChange).toHaveBeenCalledWith('updated');
  });

  it('validates input values', () => {
    const validate = vi.fn((value: number) => value >= 0);
    const onChange = vi.fn();

    const { result } = renderHook(() => 
      useFormField(0, { validate, onChange })
    );

    act(() => {
      result.current.onChange(-1);
    });

    expect(validate).toHaveBeenCalledWith(-1);
    expect(onChange).not.toHaveBeenCalled();

    act(() => {
      result.current.onChange(5);
    });

    act(() => {
      vi.advanceTimersByTime(0);
    });

    expect(validate).toHaveBeenCalledWith(5);
    expect(onChange).toHaveBeenCalledWith(5);
  });

  it('cleans up timeout on unmount', () => {
    const { unmount } = renderHook(() => 
      useFormField('test', { debounce: 300 })
    );

    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});