import { CalculatorFormData } from '../types';

export const validateInput = {
  employees: (value: number) => {
    if (value < 1) throw new Error('Number of employees must be at least 1');
    if (value > 10000) throw new Error('Please contact us directly for large organizations');
    return true;
  },
  revenue: (value: number) => {
    if (value < 0) throw new Error('Revenue cannot be negative');
    if (value > 1000) throw new Error('Please contact us directly for high-revenue organizations');
    return true;
  },
  transactions: (value: number) => {
    if (value < 0) throw new Error('Number of transactions cannot be negative');
    if (value > 100000) throw new Error('Please contact us directly for high-volume businesses');
    return true;
  }
};

export const validateForm = (data: CalculatorFormData) => {
  try {
    // Skip validation if any required field is empty
    if (data.employees === '' || data.revenue === '' || data.transactions === '') {
      return { isValid: false, errors: 'Please fill in all required fields' };
    }

    validateInput.employees(data.employees as number);
    validateInput.revenue(data.revenue as number);
    validateInput.transactions(data.transactions as number);
    return { isValid: true, errors: null };
  } catch (error) {
    return {
      isValid: false,
      errors: error instanceof Error ? error.message : 'Invalid input'
    };
  }
};