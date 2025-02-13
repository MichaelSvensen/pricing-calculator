import { useState, useCallback, useEffect, useMemo } from 'react';
import { Service, Industry, CalculatorFormData, PricingVariable } from '../types';
import { industryConfigs } from '../config/industries';
import { validateForm } from '../utils/validation';

export function useCalculator(pricingConfig: any, variables: PricingVariable[] = []) {
  // Initialize industryOptions with the default industry's questions
  const initialIndustryOptions = useMemo(() => {
    const defaultIndustry = 'consulting';
    const industryConfig = industryConfigs[defaultIndustry];
    const options: Record<string, boolean> = {};
    industryConfig.questions.forEach(q => {
      options[q.id] = false;
    });
    return options;
  }, []);

  const [formData, setFormData] = useState<CalculatorFormData>({
    employees: 1,
    revenue: 1,
    transactions: 100,
    industry: 'consulting',
    industryOptions: initialIndustryOptions,
    selectedServices: ['bookkeeping'],
    isPremium: false
  });

  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);

  // Update form data when variables change
  useEffect(() => {
    const variableValues: Record<string, any> = {};
    variables.forEach(variable => {
      if (!(variable.tag in formData)) {
        variableValues[variable.tag] = variable.type === 'number' ? 0 : '';
      }
    });
    if (Object.keys(variableValues).length > 0) {
      setFormData(prev => ({ ...prev, ...variableValues }));
    }
  }, [variables]);

  const calculateServiceTotal = useCallback((service: Service) => {
    if (!pricingConfig?.[service]) return 0;

    const employees = typeof formData.employees === 'number' ? formData.employees : 0;
    const revenue = typeof formData.revenue === 'number' ? formData.revenue : 0;
    const transactions = typeof formData.transactions === 'number' ? formData.transactions : 0;

    switch(service) {
      case 'salary':
        return pricingConfig.salary.baseRate + 
               (employees * pricingConfig.salary.perEmployeeRate);
        
      case 'bookkeeping':
        return pricingConfig.bookkeeping.baseRate + 
               (transactions * pricingConfig.bookkeeping.perTransactionRate);
        
      case 'annual-reports':
        const tier = pricingConfig.annualReports.tiers.find((t: any) => revenue <= t.maxRevenue) || 
                    pricingConfig.annualReports.tiers[pricingConfig.annualReports.tiers.length - 1];
        return tier ? tier.price / 12 : 0;
        
      default:
        return 0;
    }
  }, [formData.employees, formData.revenue, formData.transactions, pricingConfig]);

  const calculateIndustryMultiplier = useCallback(() => {
    const config = industryConfigs[formData.industry];
    if (!config) return 1;

    let multiplier = config.baseMultiplier;
    
    Object.entries(formData.industryOptions || {}).forEach(([questionId, isYes]) => {
      if (isYes) {
        const question = config.questions.find(q => q.id === questionId);
        if (question && question.impact.type === 'multiplier') {
          multiplier *= question.impact.value;
        }
      }
    });
    
    return Math.min(multiplier, config.maxMultiplier);
  }, [formData.industry, formData.industryOptions]);

  const calculateTotal = useCallback(() => {
    if (!pricingConfig) return;

    const validation = validateForm(formData);
    if (!validation.isValid) {
      setError(validation.errors);
      setTotal(0);
      return;
    }

    setError(null);
    
    let baseTotal = formData.selectedServices.reduce((sum, service) => {
      return sum + calculateServiceTotal(service);
    }, 0);

    if (formData.selectedServices.length > 0) {
      baseTotal *= calculateIndustryMultiplier();
    }

    if (formData.isPremium && pricingConfig.premium?.monthlyPrice) {
      baseTotal += pricingConfig.premium.monthlyPrice;
    }

    setTotal(Math.round(baseTotal));
  }, [
    formData,
    calculateServiceTotal,
    calculateIndustryMultiplier,
    pricingConfig
  ]);

  useEffect(() => {
    calculateTotal();
  }, [calculateTotal]);

  const updateFormData = useCallback((updates: Partial<CalculatorFormData>) => {
    setFormData(prev => {
      // Handle industry change
      if (updates.industry && updates.industry !== prev.industry) {
        const newIndustryConfig = industryConfigs[updates.industry];
        const newOptions: Record<string, boolean> = {};
        newIndustryConfig.questions.forEach(q => {
          newOptions[q.id] = false;
        });
        updates.industryOptions = newOptions;
      }
      return { ...prev, ...updates };
    });
  }, []);

  return {
    formData,
    setFormData: updateFormData,
    error,
    total,
    clearError: () => setError(null)
  };
}