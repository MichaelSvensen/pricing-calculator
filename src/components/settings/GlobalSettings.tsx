import React, { useState, useEffect } from 'react';
import { CreditCard, DollarSign, Users, FileText, Sparkles, Plus, Trash2 } from 'lucide-react';

interface GlobalSettingsProps {
  onChangesPending: () => void;
  onSave: (newPricing: any) => void;
  pricingConfig: any;
}

export function GlobalSettings({ onChangesPending, onSave, pricingConfig }: GlobalSettingsProps) {
  const [tempPricing, setTempPricing] = useState(() => {
    try {
      return JSON.parse(JSON.stringify(pricingConfig));
    } catch (e) {
      console.error('Error initializing pricing config:', e);
      return null;
    }
  });

  if (!tempPricing) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600">Error loading pricing configuration.</p>
      </div>
    );
  }

  const updateSettings = (section: string, field: string, value: any) => {
    setTempPricing(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      };
    });
    onChangesPending();
  };

  const updateAnnualReportTier = (index: number, field: string, value: number) => {
    setTempPricing(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        annualReports: {
          ...prev.annualReports,
          tiers: prev.annualReports.tiers.map((tier, i) => 
            i === index ? { ...tier, [field]: value } : tier
          )
        }
      };
    });
    onChangesPending();
  };

  const addPremiumFeature = () => {
    setTempPricing(prev => ({
      ...prev,
      premium: {
        ...prev.premium,
        features: [...prev.premium.features, '']
      }
    }));
    onChangesPending();
  };

  const removePremiumFeature = (index: number) => {
    setTempPricing(prev => ({
      ...prev,
      premium: {
        ...prev.premium,
        features: prev.premium.features.filter((_, i) => i !== index)
      }
    }));
    onChangesPending();
  };

  const updatePremiumFeature = (index: number, value: string) => {
    setTempPricing(prev => ({
      ...prev,
      premium: {
        ...prev.premium,
        features: prev.premium.features.map((feature, i) => 
          i === index ? value : feature
        )
      }
    }));
    onChangesPending();
  };

  useEffect(() => {
    if (tempPricing) {
      onSave(tempPricing);
    }
  }, [tempPricing, onSave]);

  const formatMaxRevenue = (value: number | null | undefined): string => {
    if (value === null || value === undefined) return '';
    if (value === Infinity || isNaN(value)) return '';
    return value.toString();
  };

  const ServiceCard = ({ title, description, children }: { title: string; description: string; children: React.ReactNode }) => (
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

  return (
    <div className="space-y-8">
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
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900">Revenue Tiers</h4>
            <div className="space-y-4">
              {tempPricing.annualReports.tiers.map((tier, index) => (
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
                  <InputGroup label="Price (NOK)">
                    <InputField
                      type="number"
                      value={tier.price}
                      onChange={(e) => updateAnnualReportTier(index, 'price', Number(e.target.value))}
                    />
                  </InputGroup>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ServiceCard>

      {/* Premium */}
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
              {tempPricing.premium.features.map((feature, index) => (
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