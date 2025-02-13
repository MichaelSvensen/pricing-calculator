import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { Modal } from './components/shared/Modal';
import { CalculatorForm } from './components/calculator/CalculatorForm';
import { useCalculator } from './hooks/useCalculator';
import { formatCurrency } from './utils/formatting';
import { globalPricing as defaultPricing } from './config/pricing';
import { PricingVariable } from './types';

// Default variables that match the calculator's built-in fields
const defaultVariables: PricingVariable[] = [
  {
    id: 'employees',
    name: 'Number of Employees',
    type: 'number',
    tag: 'employees',
    description: 'Total number of employees on payroll',
    impactRules: [
      {
        id: 'employees-salary',
        serviceId: 'salary',
        formula: 'linear',
        amount: defaultPricing.salary.perEmployeeRate
      }
    ]
  },
  {
    id: 'revenue',
    name: 'Annual Revenue',
    type: 'currency',
    tag: 'revenue',
    description: 'Annual revenue in million NOK',
    impactRules: [
      {
        id: 'revenue-reports',
        serviceId: 'annual-reports',
        formula: 'threshold',
        amount: 0,
        thresholds: defaultPricing.annualReports.tiers.map(tier => ({
          value: tier.maxRevenue,
          amount: tier.price / 12 // Convert annual price to monthly
        }))
      }
    ]
  },
  {
    id: 'transactions',
    name: 'Monthly Transactions',
    type: 'number',
    tag: 'transactions',
    description: 'Average number of monthly transactions',
    impactRules: [
      {
        id: 'transactions-bookkeeping',
        serviceId: 'bookkeeping',
        formula: 'linear',
        amount: defaultPricing.bookkeeping.perTransactionRate
      }
    ]
  }
];

export default function App() {
  const [pricingConfig, setPricingConfig] = useState(defaultPricing);
  const [showSettings, setShowSettings] = useState(false);
  const [variables, setVariables] = useState<PricingVariable[]>(defaultVariables);
  const { formData, setFormData, error, total } = useCalculator(pricingConfig, variables);

  const handlePricingUpdate = (newPricing: typeof defaultPricing) => {
    setPricingConfig(newPricing);
  };

  const handleVariablesUpdate = (newVariables: PricingVariable[]) => {
    setVariables(newVariables);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header Section */}
      <header className="w-full bg-white/80 backdrop-blur-sm border-b border-gray-200/80 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left Column - Logo and Title */}
            <div className="flex items-center gap-4">
              <div className="h-10 w-10">
                <svg viewBox="0 0 375 375" className="h-full w-full">
                  <defs>
                    <clipPath id="a">
                      <path d="M124.316 57.254h126v130.746h-126z"/>
                    </clipPath>
                    <clipPath id="b">
                      <path d="M124.316 187h126v130.504h-126z"/>
                    </clipPath>
                  </defs>
                  <g clipPath="url(#a)">
                    <path fill="#43d18a" d="M250.125 100.504V57.258c-69.574 0-125.617 58.094-125.617 130.387h41.87c0-48.415 37.364-87.141 83.747-87.141"/>
                  </g>
                  <g clipPath="url(#b)">
                    <path fill="#43d18a" d="M124.508 317.383c69.574 0 125.617-58.094 125.617-129.739h-41.872c0 47.762-37.363 86.493-83.745 86.493"/>
                  </g>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Silfer Pricing Calculator</h1>
                <p className="text-sm text-gray-500">The price to make you sleep at night</p>
              </div>
            </div>

            {/* Right Column - Settings Button */}
            <button
              onClick={() => setShowSettings(true)}
              className="p-2.5 rounded-full hover:bg-black/5 transition-colors group"
              title="Settings"
            >
              <Settings className="w-8 h-8 text-gray-600 group-hover:text-gray-800" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8 md:py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 mb-8">
          <CalculatorForm 
            formData={formData}
            setFormData={setFormData}
            error={error}
            pricingConfig={pricingConfig}
            variables={variables}
          />
        </div>

        <div className="bg-emerald-900 text-white rounded-2xl shadow-xl p-8 md:p-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Estimated Monthly Cost</h2>
          </div>
          <div className="text-5xl font-bold">{formatCurrency(total)}</div>
          <p className="mt-3 text-emerald-200">
            *Final pricing may vary based on specific requirements and customizations
          </p>
        </div>

        <Modal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          title="Settings"
          onUpdatePricing={handlePricingUpdate}
          pricingConfig={pricingConfig}
          onUpdateVariables={handleVariablesUpdate}
          variables={variables}
        />
      </div>
    </div>
  );
}