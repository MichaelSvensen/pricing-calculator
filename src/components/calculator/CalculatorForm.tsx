import React, { useCallback } from 'react';
import { Users, Building2, Wallet, BarChart4, CheckCircle2, Sparkles, FileText, BookOpen } from 'lucide-react';
import { Industry, Service, CalculatorFormData, PricingVariable } from '../../types';
import { industryConfigs } from '../../config/industries';
import { formatCurrency } from '../../utils/formatting';

interface CalculatorFormProps {
  formData: CalculatorFormData;
  setFormData: (data: Partial<CalculatorFormData>) => void;
  error: string | null;
  pricingConfig: any;
  variables: PricingVariable[];
}

export function CalculatorForm({ formData, setFormData, error, pricingConfig, variables }: CalculatorFormProps) {
  const handleInputChange = useCallback((name: string, value: number | string) => {
    setFormData({
      [name]: value
    });
  }, [setFormData]);

  const handleIndustryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newIndustry = e.target.value as Industry;
    const industryConfig = industryConfigs[newIndustry];
    
    if (!industryConfig) return;

    const newOptions = {};
    industryConfig.questions.forEach(q => {
      newOptions[q.id] = false;
    });
    
    setFormData({
      industry: newIndustry,
      industryOptions: newOptions
    });
  }, [setFormData]);

  const handleQuestionChange = useCallback((questionId: string, value: boolean) => {
    setFormData({
      industryOptions: {
        ...formData.industryOptions,
        [questionId]: value
      }
    });
  }, [formData.industryOptions, setFormData]);

  const toggleService = useCallback((service: Service) => {
    setFormData({
      selectedServices: formData.selectedServices.includes(service)
        ? formData.selectedServices.filter(s => s !== service)
        : [...formData.selectedServices, service]
    });
  }, [formData.selectedServices, setFormData]);

  const togglePremium = useCallback(() => {
    setFormData({
      isPremium: !formData.isPremium
    });
  }, [formData.isPremium, setFormData]);

  const calculateServiceCost = useCallback((service: Service) => {
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
        const tier = pricingConfig.annualReports.tiers.find(t => revenue <= t.maxRevenue) || 
                    pricingConfig.annualReports.tiers[pricingConfig.annualReports.tiers.length - 1];
        return tier.price / 12;
        
      default:
        return 0;
    }
  }, [formData.employees, formData.revenue, formData.transactions, pricingConfig]);

  // Get current industry config with fallback
  const currentIndustry = industryConfigs[formData.industry] || industryConfigs.consulting;

  const ServiceOption = useCallback(({ service, icon: Icon, config }: { 
    service: Service; 
    icon: React.ElementType; 
    config: any 
  }) => {
    // Return null if config is not available
    if (!config?.label || !config?.description) return null;

    const isSelected = formData.selectedServices.includes(service);
    const cost = calculateServiceCost(service);

    return (
      <button
        type="button"
        onClick={() => toggleService(service)}
        className={`w-full p-4 rounded-lg border-2 transition-colors ${
          isSelected
            ? 'border-[#43d18a] bg-[#43d18a]/10'
            : 'border-gray-200 hover:border-[#43d18a]/50'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon className={`w-5 h-5 ${isSelected ? 'text-[#43d18a]' : 'text-gray-400'}`} />
            <div className="text-left">
              <h4 className="font-medium text-gray-900">{config.label}</h4>
              <p className="text-sm text-gray-500 mt-1">{config.description}</p>
            </div>
          </div>
          <div className="text-lg font-semibold text-gray-900">
            {formatCurrency(cost)}
          </div>
        </div>
      </button>
    );
  }, [formData.selectedServices, calculateServiceCost, toggleService]);

  return (
    <div className="space-y-8">
      {/* Company Information Section */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Company Information</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {variables.map(variable => (
            <div key={variable.id}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  {variable.type === 'currency' ? <Wallet className="w-4 h-4" /> : <BarChart4 className="w-4 h-4" />}
                  {variable.name}
                </span>
              </label>
              <input
                type={variable.type === 'currency' ? 'number' : variable.type}
                value={formData[variable.tag as keyof CalculatorFormData] || ''}
                onChange={(e) => handleInputChange(variable.tag, e.target.value)}
                min={0}
                step={variable.type === 'currency' ? 0.1 : 1}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#43d18a] focus:ring focus:ring-[#43d18a]/20 focus:ring-opacity-50"
              />
              {variable.description && (
                <p className="mt-1 text-sm text-gray-500">{variable.description}</p>
              )}
            </div>
          ))}
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
            {error}
          </div>
        )}
      </div>

      {/* Industry Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="w-5 h-5 text-[#43d18a]" />
          <h3 className="text-lg font-medium text-gray-800">Industry Details</h3>
        </div>

        <div className="mb-6">
          <select
            value={formData.industry}
            onChange={handleIndustryChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#43d18a] focus:ring focus:ring-[#43d18a]/20 focus:ring-opacity-50"
          >
            {Object.entries(industryConfigs).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>
          {currentIndustry.description && (
            <p className="mt-2 text-sm text-gray-500">{currentIndustry.description}</p>
          )}
        </div>

        {currentIndustry.questions?.length > 0 && (
          <div className="space-y-4">
            {currentIndustry.questions.map((question) => (
              <div key={question.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-900">
                      {question.question}
                    </label>
                    {question.description && (
                      <p className="text-sm text-gray-500 mt-1">{question.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleQuestionChange(question.id, false)}
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        formData.industryOptions[question.id] === false
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      No
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuestionChange(question.id, true)}
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        formData.industryOptions[question.id] === true
                          ? 'bg-[#43d18a] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Yes
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Services Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="w-5 h-5 text-[#43d18a]" />
          <h3 className="text-lg font-medium text-gray-800">Select Services</h3>
        </div>
        <div className="space-y-4">
          {pricingConfig?.salary && (
            <ServiceOption 
              service="salary" 
              icon={Users} 
              config={pricingConfig.salary}
            />
          )}
          {pricingConfig?.bookkeeping && (
            <ServiceOption 
              service="bookkeeping" 
              icon={FileText} 
              config={pricingConfig.bookkeeping}
            />
          )}
          {pricingConfig?.annualReports && (
            <ServiceOption 
              service="annual-reports" 
              icon={BookOpen} 
              config={pricingConfig.annualReports}
            />
          )}
        </div>
      </div>

      {/* Premium Section */}
      {pricingConfig?.premium?.label && pricingConfig?.premium?.description && (
        <div>
          <button
            type="button"
            onClick={togglePremium}
            className={`w-full p-4 rounded-lg border-2 transition-colors ${
              formData.isPremium
                ? 'border-[#43d18a] bg-[#43d18a]/10'
                : 'border-gray-200 hover:border-[#43d18a]/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className={`w-5 h-5 ${formData.isPremium ? 'text-[#43d18a]' : 'text-gray-400'}`} />
                <div className="text-left">
                  <h4 className="font-medium text-gray-900">{pricingConfig.premium.label}</h4>
                  <p className="text-sm text-gray-500 mt-1">{pricingConfig.premium.description}</p>
                </div>
              </div>
              <div className="text-lg font-semibold text-gray-900">
                +{formatCurrency(pricingConfig.premium.monthlyPrice)}
              </div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}