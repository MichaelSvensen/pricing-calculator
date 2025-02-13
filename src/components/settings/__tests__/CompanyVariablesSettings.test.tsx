import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CompanyVariablesSettings } from '../CompanyVariablesSettings';

// Mock data
const mockServices = [
  { id: 'salary', label: 'Salary & Payroll' },
  { id: 'bookkeeping', label: 'Bookkeeping' }
];

const mockVariables = [
  {
    id: 'var-1',
    name: 'Test Variable',
    type: 'number',
    tag: 'test_var',
    description: 'Test description',
    impactRules: []
  }
];

describe('CompanyVariablesSettings', () => {
  const onChangesPending = vi.fn();
  const onSave = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  it('renders without crashing', () => {
    render(
      <CompanyVariablesSettings
        onChangesPending={onChangesPending}
        onSave={onSave}
        services={mockServices}
        variables={mockVariables}
      />
    );

    expect(screen.getByText('Company Information Variables')).toBeInTheDocument();
  });

  it('maintains input focus while editing', async () => {
    const user = userEvent.setup({ delay: null });
    
    render(
      <CompanyVariablesSettings
        onChangesPending={onChangesPending}
        onSave={onSave}
        services={mockServices}
        variables={mockVariables}
      />
    );

    const nameInput = screen.getByDisplayValue('Test Variable');
    await user.click(nameInput);
    await user.type(nameInput, ' Updated');

    expect(document.activeElement).toBe(nameInput);
    expect(nameInput).toHaveValue('Test Variable Updated');
  });

  it('debounces save calls', async () => {
    const user = userEvent.setup({ delay: null });
    
    render(
      <CompanyVariablesSettings
        onChangesPending={onChangesPending}
        onSave={onSave}
        services={mockServices}
        variables={mockVariables}
      />
    );

    const nameInput = screen.getByDisplayValue('Test Variable');
    await user.click(nameInput);
    await user.type(nameInput, ' Updated');

    expect(onSave).not.toHaveBeenCalled();

    // Fast-forward timers
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith([
      {
        ...mockVariables[0],
        name: 'Test Variable Updated'
      }
    ]);
  });

  it('adds new variables', async () => {
    const user = userEvent.setup({ delay: null });
    
    render(
      <CompanyVariablesSettings
        onChangesPending={onChangesPending}
        onSave={onSave}
        services={mockServices}
        variables={mockVariables}
      />
    );

    const addButton = screen.getByText('Add Variable');
    await user.click(addButton);

    expect(screen.getByDisplayValue('New Variable')).toBeInTheDocument();
    expect(onChangesPending).toHaveBeenCalled();
  });

  it('adds and removes impact rules', async () => {
    const user = userEvent.setup({ delay: null });
    
    render(
      <CompanyVariablesSettings
        onChangesPending={onChangesPending}
        onSave={onSave}
        services={mockServices}
        variables={mockVariables}
      />
    );

    // Open variable settings
    await user.click(screen.getByText('Configure'));

    // Add a rule
    await user.click(screen.getByText('Add Rule'));
    expect(screen.getByText('Amount per Unit')).toBeInTheDocument();

    // Remove the rule
    const removeButton = screen.getByRole('button', { name: /remove/i });
    await user.click(removeButton);

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(screen.queryByText('Amount per Unit')).not.toBeInTheDocument();
  });
});