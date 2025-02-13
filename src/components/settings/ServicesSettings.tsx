import React, { useState, useCallback, useEffect } from 'react';
import { CreditCard, DollarSign, Users, FileText, Sparkles, Plus, Trash2, Check, Activity } from 'lucide-react';

interface ServicesSettingsProps {
  onChangesPending: () => void;
  onSave: (newPricing: any) => void;
  pricingConfig: any;
}

export function ServicesSettings({ onChangesPending, onSave, pricingConfig }: ServicesSettingsProps) {
  const [tempPricing, setTempPricing] = useState<any>(null);
  const [savedIndicator, setSavedIndicator] = useState(false);

  // Initialize tempPricing
  useEffect(() => {
    try {
      setTempPricing(JSON.parse(JSON.stringify(pricingConfig)));
    } catch (e) {
      console.error('Error initializing pricing config:', e);
    }
  }, [pricingConfig]);

  // Debounced save handler
  const debouncedSave = useCallback((newPricing: any) => {
    onSave(newPricing);
    setSavedIndicator(true);
    setTimeout(() => setSavedIndicator(false), 2000);
  }, [onSave]);

  const updateSettings = useCallback((section: string, field: string, value: any) => {
    setTempPricing(prev => {
      if (!prev) return prev;
      const newPricing = {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      };
      debouncedSave(newPricing);
      return newPricing;
    });
    onChangesPending();
  }, [debouncedSave, onChangesPending]);

  const updateDriver = useCallback((section: string, updates: any) => {
    setTempPricing(prev => {
      if (!prev) return prev;
      const newPricing = {
        ...prev,
        [section]: {
          ...prev[section],
          driver: {
            ...prev[section].driver,
            ...updates
          }
        }
      };
      debouncedSave(newPricing);
      return newPricing;
    });
    onChangesPending();
  }, [debouncedSave, onChangesPending]);

  const updateAnnualReportTier = useCallback((index: number, field: string, value: number) => {
    setTempPricing(prev => {
      if (!prev) return prev;
      const newPricing = {
        ...prev,
        annualReports: {
          ...prev.annualReports,
          tiers: prev.annualReports.tiers.map((tier: any, i: number) => 
            i === index ? { ...tier, [field]: value } : tier
          )
        }
      };
      debouncedSave(newPricing);
      return newPricing;
    });
    onChangesPending();
  }, [debouncedSave, onChangesPending]);

  const removeTier = useCallback((index: number) => {
    setTempPricing(prev => {
      if (!prev) return prev;
      const newPricing = {
        ...prev,
        annualReports: {
          ...prev.annualReports,
          tiers: prev.annualReports.tiers.filter((_: any, i: number) => i !== index)
        }
      };
      debouncedSave(newPricing);
      return newPricing;
    });
    onChangesPending();
  }, [debouncedSave, onChangesPending]);

  const addPremiumFeature = useCallback(() => {
    setTempPricing(prev => {
      if (!prev) return prev;
      const newPricing = {
        ...prev,
        premium: {
          ...prev.premium,
          features: [...prev.premium.features, '']
        }
      };
      debouncedSave(newPricing);
      return newPricing;
    });
    onChangesPending();
  }, [debouncedSave, onChangesPending]);

  const removePremiumFeature = useCallback((index: number) => {
    setTempPricing(prev => {
      if (!prev) return prev;
      const newPricing = {
        ...prev,
        premium: {
          ...prev.premium,
          features: prev.premium.features.filter((_: any, i: number) => i !== index)
        }
      };
      debouncedSave(newPricing);
      return newPricing;
    });
    onChangesPending();
  }, [debouncedSave, onChangesPending]);

  const updatePremiumFeature = useCallback((index: number, value: string) => {
    setTempPricing(prev => {
      if (!prev) return prev;
      const newPricing = {
        ...prev,
        premium: {
          ...prev.premium,
          features: prev.premium.features.map((feature: string, i: number) => 
            i === index ? value : feature
          )
        }
      };
      debouncedSave(newPricing);
      return newPricing;
    });
    onChangesPending();
  }, [debouncedSave, onChangesPending]);

  // If tempPricing is not initialized yet, show loading state
  if (!tempPricing) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">Loading pricing configuration...</p>
      </div>
    );
  }

  const formatMaxRevenue = (value: number | null | undefined): string => {
    if (value === null || value === undefined) return '';
    if (value === Infinity || isNaN(value)) return '';
    return value.toString();
  };

  const ServiceCard = ({ title, description, children }: { 
    title: string; 
    description: string; 
    children: React.ReactNode 
  }) => (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <h3 className="text-2xl font-semibold text-gray-900">{title}</h3>
      </div>
      <p className="text-gray-600 mb-8">{description}</p>
      {children}
    </div>
  );

  const InputGroup = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="space-y-2">
      <label className="block text-sm font-normal text-gray-600">{label}</label>
      {children}
    </div>
  );

  const InputField = ({ icon: Icon, ...props }: { icon?: React.ElementType } & React.InputHTMLAttributes<HTMLInputElement>) => (
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      )}
      <input
        {...props}
        className={`w-full h-10 rounded-lg border-2 border-gray-200 bg-white shadow-sm focus:border-[#43d18a] focus:ring focus:ring-[#43d18a]/20 text-[14px] ${
          Icon ? 'pl-9' : 'px-3'
        }`}
      />
    </div>
  );

  const TextArea = (props: React.TextAreaHTMLAttributes<HTMLTextAreaElement>) => (
    <textarea
      {...props}
      className="w-full rounded-lg border-2 border-gray-200 bg-white shadow-sm focus:border-[#43d18a] focus:ring focus:ring-[#43d18a]/20 text-[14px] px-3 py-2"
    />
  );

  const DriverConfig = ({ section, config }: { section: string; config: any }) => (
    <div className="bg-gray-50 rounded-xl p-6 space-y-4">
      <div className="flex items-center gap-2 text-gray-900">
        <Activity className="w-5 h-5" />
        <h4 className="font-medium">Pricing Driver</h4>
      </div>
      
      <div className="space-y-4">
        <InputGroup label="Driver Label">
          <InputField
            type="text"
            value={config.driver.label}
            onChange={(e) => updateDriver(section, { label: e.target.value })}
            placeholder="e.g., Employees, Transactions"
          />
        </InputGroup>
        
        <InputGroup label="Driver Description">
          <TextArea
            value={config.driver.description}
            onChange={(e) => updateDriver(section, { description: e.target.value })}
            placeholder="Explain how this driver affects pricing"
            rows={2}
          />
        </InputGroup>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        {savedIndicator && (
          <div className="flex items-center text-[#43d18a] text-sm">
            <Check className="w-4 h-4 mr-1" />
            Changes saved
          </div>
        )}
      </div>

      {/* Salary & Payroll */}
      <ServiceCard 
        title="Salary & Payroll" 
        description="Configure pricing for payroll processing services"
      >
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <InputGroup label="Service Name">
              <InputField
                type="text"
                value={tempPricing.salary.label}
                onChange={(e) => updateSettings('salary', 'label', e.target.value)}
              />
            </InputGroup>
            <InputGroup label="Description">
              <TextArea
                value={tempPricing.salary.description}
                onChange={(e) => updateSettings('salary', 'description', e.target.value)}
                rows={2}
              />
            </InputGroup>
            <DriverConfig section="salary" config={tempPricing.salary} />
          </div>
          <div className="space-y-6">
            <InputGroup label="Base Monthly Rate (NOK)">
              <InputField
                type="number"
                icon={DollarSign}
                value={tempPricing.salary.baseRate}
                onChange={(e) => updateSettings('salary', 'baseRate', Number(e.target.value))}
              />
            </InputGroup>
            <InputGroup label="Per Employee Rate (NOK)">
              <InputField
                type="number"
                icon={Users}
                value={tempPricing.salary.perEmployeeRate}
                onChange={(e) => updateSettings('salary', 'perEmployeeRate', Number(e.target.value))}
              />
            </InputGroup>
          </div>
        </div>
      </ServiceCard>

      {/* Bookkeeping */}
      <ServiceCard 
        title="Bookkeeping" 
        description="Configure pricing for transaction processing services"
      >
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <InputGroup label="Service Name">
              <InputField
                type="text"
                value={tempPricing.bookkeeping.label}
                onChange={(e) => updateSettings('bookkeeping', 'label', e.target.value)}
              />
            </InputGroup>
            <InputGroup label="Description">
              <TextArea
                value={tempPricing.bookkeeping.description}
                onChange={(e) => updateSettings('bookkeeping', 'description', e.target.value)}
                rows={2}
              />
            </InputGroup>
            <DriverConfig section="bookkeeping" config={tempPricing.bookkeeping} />
          </div>
          <div className="space-y-6">
            <InputGroup label="Base Monthly Rate (NOK)">
              <InputField
                type="number"
                icon={DollarSign}
                value={tempPricing.bookkeeping.baseRate}
                onChange={(e) => updateSettings('bookkeeping', 'baseRate', Number(e.target.value))}
              />
            </InputGroup>
            <InputGroup label="Per Transaction Rate (NOK)">
              <InputField
                type="number"
                icon={FileText}
                value={tempPricing.bookkeeping.perTransactionRate}
                onChange={(e) => updateSettings('bookkeeping', 'perTransactionRate', Number(e.target.value))}
              />
            </InputGroup>
          </div>
        </div>
      </ServiceCard>

      {/* Annual Reports */}
      <ServiceCard 
        title="Annual Reports" 
        description="Configure pricing tiers for annual reporting services"
      >
        <div className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <InputGroup label="Service Name">
                <InputField
                  type="text"
                  value={tempPricing.annualReports.label}
                  onChange={(e) => updateSettings('annualReports', 'label', e.target.value)}
                />
              </InputGroup>
              <InputGroup label="Description">
                <TextArea
                  value={tempPricing.annualReports.description}
                  onChange={(e) => updateSettings('annualReports', 'description', e.target.value)}
                  rows={2}
                />
              </InputGroup>
              <DriverConfig section="annualReports" config={tempPricing.annualReports} />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900">Revenue Tiers</h4>
            <div className="space-y-4">
              {tempPricing.annualReports.tiers.map((tier: any, index: number) => (
                <div key={index} className="grid grid-cols-2 gap-6 p-4 bg-gray-50 rounded-xl">
                  <InputGroup label="Max Revenue (M NOK)">
                    <InputField
                      type="text"
                      value={formatMaxRevenue(tier.maxRevenue)}
                      onChange={(e) => {
                        const value = e.target.value.trim();
                        updateAnnualReportTier(
                          index,
                          'maxRevenue',
                          value === '' ? Infinity : Number(value)
                        );
                      }}
                      placeholder="∞"
                    />
                  </InputGroup>
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <InputGroup label="Price (NOK)">
                        <InputField
                          type="number"
                          value={tier.price}
                          onChange={(e) => updateAnnualReportTier(index, 'price', Number(e.target.value))}
                        />
                      </InputGroup>
                    </div>
                    <button
                      onClick={() => removeTier(index)}
                      className="mt-8 p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ServiceCard>

      {/* Premium Features */}
      <ServiceCard 
        title="Premium Features" 
        description="Configure premium service options and pricing"
      >
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <InputGroup label="Service Name">
              <InputField
                type="text"
                value={tempPricing.premium.label}
                onChange={(e) => updateSettings('premium', 'label', e.target.value)}
              />
            </InputGroup>
            <InputGroup label="Description">
              <TextArea
                value={tempPricing.premium.description}
                onChange={(e) => updateSettings('premium', 'description', e.target.value)}
                rows={2}
              />
            </InputGroup>
          </div>
          <div className="space-y-6">
            <InputGroup label="Monthly Premium Price (NOK)">
              <InputField
                type="number"
                icon={DollarSign}
                value={tempPricing.premium.monthlyPrice}
                onChange={(e) => updateSettings('premium', 'monthlyPrice', Number(e.target.value))}
              />
            </InputGroup>
          </div>

          <div className="col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-medium text-gray-900">Premium Features</h4>
              <button
                onClick={addPremiumFeature}
                className="flex items-center px-3 py-1.5 text-sm font-medium text-[#43d18a] hover:bg-[#43d18a]/10 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Add Feature
              </button>
            </div>
            <div className="space-y-3">
              {tempPricing.premium.features.map((feature: string, index: number) => (
                <div key={index} className="flex items-center gap-3">
                  <InputField
                    type="text"
                    value={feature}
                    onChange={(e) => updatePremiumFeature(index, e.target.value)}
                    placeholder="Enter feature description"
                  />
                  <button
                    onClick={() => removePremiumFeature(index)}
                    className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ServiceCard>
    </div>
  );
}