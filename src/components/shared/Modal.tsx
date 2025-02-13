import React, { useState, useCallback } from 'react';
import { X } from 'lucide-react';
import { ServicesSettings } from '../settings/ServicesSettings';
import { IndustrySettings } from '../settings/IndustrySettings';
import { CompanyVariablesSettings } from '../settings/CompanyVariablesSettings';
import { PricingVariable } from '../../types';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onUpdatePricing: (newPricing: any) => void;
  pricingConfig: any;
  onUpdateVariables?: (variables: PricingVariable[]) => void;
  variables?: PricingVariable[];
}

export function Modal({ 
  isOpen, 
  onClose, 
  title, 
  onUpdatePricing, 
  pricingConfig,
  onUpdateVariables,
  variables = []
}: ModalProps) {
  const [activeTab, setActiveTab] = useState<'industry' | 'services' | 'variables'>('industry');
  const [hasChanges, setHasChanges] = useState(false);
  const [tempPricing, setTempPricing] = useState<any>(null);

  const handleClose = () => {
    if (hasChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to close?')) {
        setHasChanges(false);
        setTempPricing(null);
        onClose();
      }
    } else {
      onClose();
    }
  };

  const handleSave = useCallback((newPricing: any) => {
    onUpdatePricing(newPricing);
    setTempPricing(null);
    setHasChanges(false);
  }, [onUpdatePricing]);

  const handleVariablesSave = useCallback((newVariables: PricingVariable[]) => {
    if (onUpdateVariables) {
      onUpdateVariables(newVariables);
      setHasChanges(false);
    }
  }, [onUpdateVariables]);

  const handleChangesPending = useCallback(() => {
    setHasChanges(true);
  }, []);

  if (!isOpen) return null;

  const services = [
    { id: 'salary', label: pricingConfig.salary.label },
    { id: 'bookkeeping', label: pricingConfig.bookkeeping.label },
    { id: 'annual-reports', label: pricingConfig.annualReports.label }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden m-4">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="border-b px-6">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('industry')}
              className={`py-3 border-b-2 transition-colors ${
                activeTab === 'industry'
                  ? 'border-[#43d18a] text-[#43d18a]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Industry Settings
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`py-3 border-b-2 transition-colors ${
                activeTab === 'services'
                  ? 'border-[#43d18a] text-[#43d18a]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Services
            </button>
            <button
              onClick={() => setActiveTab('variables')}
              className={`py-3 border-b-2 transition-colors ${
                activeTab === 'variables'
                  ? 'border-[#43d18a] text-[#43d18a]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Variables
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-280px)]">
          {activeTab === 'industry' ? (
            <IndustrySettings onChangesPending={handleChangesPending} />
          ) : activeTab === 'services' ? (
            <ServicesSettings 
              onChangesPending={handleChangesPending}
              onSave={handleSave}
              pricingConfig={pricingConfig}
            />
          ) : (
            <CompanyVariablesSettings
              onChangesPending={handleChangesPending}
              onSave={handleVariablesSave}
              services={services}
              variables={variables}
            />
          )}
        </div>
      </div>
    </div>
  );
}