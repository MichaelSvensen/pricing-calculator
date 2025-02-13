import React, { useState, useCallback, useEffect } from 'react';
import { Variable, Hash, Percent, DollarSign, Plus, Trash2, Activity, AlertCircle, Tag } from 'lucide-react';
import { debounce } from '../../utils/debounce';
import { formatCurrency } from '../../utils/formatting';
import { ControlledInput } from '../shared/ControlledInput';
import { PricingVariable, PricingImpactRule } from '../../types';

interface CompanyVariablesSettingsProps {
  onChangesPending: () => void;
  onSave: (variables: PricingVariable[]) => void;
  services: any[];
  variables: PricingVariable[];
}

export function CompanyVariablesSettings({ 
  onChangesPending, 
  onSave, 
  services, 
  variables: initialVariables 
}: CompanyVariablesSettingsProps) {
  const [variables, setVariables] = useState<PricingVariable[]>(initialVariables);
  const [selectedVariable, setSelectedVariable] = useState<string | null>(null);

  // Update local state when props change
  useEffect(() => {
    setVariables(initialVariables);
  }, [initialVariables]);

  const debouncedSave = useCallback(
    debounce((newVariables: PricingVariable[]) => {
      onSave(newVariables);
    }, 500),
    [onSave]
  );

  const handleInputChange = useCallback((
    variableId: string, 
    field: keyof PricingVariable, 
    value: string
  ) => {
    setVariables(prev => {
      const nextState = prev.map(v => 
        v.id === variableId ? { ...v, [field]: value } : v
      );
      
      // Only update if there's an actual change
      if (JSON.stringify(prev) === JSON.stringify(nextState)) {
        return prev;
      }
      
      // Trigger save
      debouncedSave(nextState);
      onChangesPending();
      return nextState;
    });
  }, [debouncedSave, onChangesPending]);

  const handleRuleChange = useCallback((
    variableId: string,
    ruleId: string,
    field: keyof PricingImpactRule,
    value: any
  ) => {
    setVariables(prev => {
      const nextState = prev.map(v => 
        v.id === variableId 
          ? {
              ...v,
              impactRules: v.impactRules.map(r => 
                r.id === ruleId ? { ...r, [field]: value } : r
              )
            }
          : v
      );

      // Only update if there's an actual change
      if (JSON.stringify(prev) === JSON.stringify(nextState)) {
        return prev;
      }

      // Trigger save
      debouncedSave(nextState);
      onChangesPending();
      return nextState;
    });
  }, [debouncedSave, onChangesPending]);

  const addVariable = useCallback(() => {
    const newVariable: PricingVariable = {
      id: `var-${Date.now()}`,
      name: 'New Variable',
      type: 'number',
      tag: 'new_variable',
      description: '',
      impactRules: []
    };
    
    setVariables(prev => {
      const nextState = [...prev, newVariable];
      debouncedSave(nextState);
      return nextState;
    });
    setSelectedVariable(newVariable.id);
    onChangesPending();
  }, [debouncedSave, onChangesPending]);

  const removeVariable = useCallback((variableId: string) => {
    setVariables(prev => {
      const nextState = prev.filter(v => v.id !== variableId);
      debouncedSave(nextState);
      return nextState;
    });
    if (selectedVariable === variableId) {
      setSelectedVariable(null);
    }
    onChangesPending();
  }, [selectedVariable, debouncedSave, onChangesPending]);

  const addImpactRule = useCallback((variableId: string) => {
    const newRule: PricingImpactRule = {
      id: `rule-${Date.now()}`,
      serviceId: services[0]?.id || '',
      formula: 'linear',
      amount: 0
    };

    setVariables(prev => {
      const nextState = prev.map(v => 
        v.id === variableId 
          ? { ...v, impactRules: [...v.impactRules, newRule] }
          : v
      );
      debouncedSave(nextState);
      return nextState;
    });
    onChangesPending();
  }, [services, debouncedSave, onChangesPending]);

  const removeImpactRule = useCallback((variableId: string, ruleId: string) => {
    setVariables(prev => {
      const nextState = prev.map(v => 
        v.id === variableId 
          ? {
              ...v,
              impactRules: v.impactRules.filter(r => r.id !== ruleId)
            }
          : v
      );
      debouncedSave(nextState);
      return nextState;
    });
    onChangesPending();
  }, [debouncedSave, onChangesPending]);

  const VariableCard = useCallback(({ variable }: { variable: PricingVariable }) => {
    const isSelected = selectedVariable === variable.id;

    const getTagColor = (type: string) => {
      switch (type) {
        case 'number':
          return 'bg-blue-100 text-blue-800';
        case 'currency':
          return 'bg-green-100 text-green-800';
        case 'text':
          return 'bg-purple-100 text-purple-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    };

    return (
      <div className={`border-2 rounded-xl p-6 transition-colors ${
        isSelected ? 'border-[#43d18a] bg-[#43d18a]/5' : 'border-gray-200'
      }`}>
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Variable className="w-5 h-5 text-gray-400" />
              <ControlledInput
                type="text"
                value={variable.name}
                onChange={(value) => handleInputChange(variable.id, 'name', value as string)}
                className="text-lg font-medium text-gray-900 bg-transparent border-none p-0 focus:ring-0 w-full"
                placeholder="Variable Name"
              />
            </div>
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-gray-400" />
              <ControlledInput
                type="text"
                value={variable.tag}
                onChange={(value) => handleInputChange(variable.id, 'tag', value as string)}
                className="text-sm text-gray-500 bg-transparent border-none p-0 focus:ring-0 w-full"
                placeholder="variable_tag"
              />
            </div>
            <div className="mt-2 flex gap-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTagColor(variable.type)}`}>
                {variable.type}
              </span>
              {variable.description && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {variable.description.length > 30 
                    ? variable.description.substring(0, 30) + '...'
                    : variable.description}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedVariable(isSelected ? null : variable.id)}
              className="text-gray-400 hover:text-gray-600 px-3 py-1.5 rounded-md hover:bg-gray-100"
            >
              {isSelected ? 'Close' : 'Configure'}
            </button>
            <button
              onClick={() => removeVariable(variable.id)}
              className="p-2 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"
              title="Remove variable"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {isSelected && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={variable.description}
                  onChange={(e) => handleInputChange(variable.id, 'description', e.target.value)}
                  className="w-full rounded-lg border-2 border-gray-200 px-4 py-3 text-sm focus:border-[#43d18a] focus:ring focus:ring-[#43d18a]/20"
                  rows={2}
                  placeholder="Explain how this variable affects pricing"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Variable Type
                </label>
                <select
                  value={variable.type}
                  onChange={(e) => handleInputChange(variable.id, 'type', e.target.value)}
                  className="w-full rounded-lg border-2 border-gray-200 px-4 py-3 text-sm focus:border-[#43d18a] focus:ring focus:ring-[#43d18a]/20"
                >
                  <option value="number">Number</option>
                  <option value="currency">Currency</option>
                  <option value="text">Text</option>
                </select>
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-gray-900">Price Impact Rules</h4>
                <button
                  onClick={() => addImpactRule(variable.id)}
                  className="flex items-center px-3 py-1.5 text-sm font-medium text-[#43d18a] hover:bg-[#43d18a]/10 rounded-lg"
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  Add Rule
                </button>
              </div>

              <div className="space-y-4">
                {variable.impactRules.map(rule => (
                  <div key={rule.id} className="bg-gray-50 rounded-lg p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Affected Service
                        </label>
                        <select
                          value={rule.serviceId}
                          onChange={(e) => handleRuleChange(variable.id, rule.id, 'serviceId', e.target.value)}
                          className="w-full rounded-lg border-2 border-gray-200 px-4 py-3 text-sm focus:border-[#43d18a] focus:ring focus:ring-[#43d18a]/20"
                        >
                          {services.map(service => (
                            <option key={service.id} value={service.id}>
                              {service.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Formula Type
                        </label>
                        <select
                          value={rule.formula}
                          onChange={(e) => handleRuleChange(variable.id, rule.id, 'formula', e.target.value)}
                          className="w-full rounded-lg border-2 border-gray-200 px-4 py-3 text-sm focus:border-[#43d18a] focus:ring focus:ring-[#43d18a]/20"
                        >
                          <option value="linear">Linear (per unit)</option>
                          <option value="threshold">Threshold-based</option>
                          <option value="percentage">Percentage</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {rule.formula === 'percentage' ? 'Percentage' : 'Amount per Unit'}
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            {rule.formula === 'percentage' ? (
                              <Percent className="w-4 h-4 text-gray-400" />
                            ) : (
                              <DollarSign className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                          <ControlledInput
                            type="number"
                            value={rule.amount}
                            onChange={(value) => handleRuleChange(
                              variable.id,
                              rule.id,
                              'amount',
                              typeof value === 'string' ? parseFloat(value) : value
                            )}
                            className="pl-10"
                            min={0}
                            step={rule.formula === 'percentage' ? 0.1 : 1}
                          />
                        </div>
                      </div>

                      {rule.formula === 'linear' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Maximum Impact
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <DollarSign className="w-4 h-4 text-gray-400" />
                            </div>
                            <ControlledInput
                              type="number"
                              value={rule.maxValue || ''}
                              onChange={(value) => handleRuleChange(
                                variable.id,
                                rule.id,
                                'maxValue',
                                value ? parseFloat(value as string) : undefined
                              )}
                              className="pl-10"
                              min={0}
                              placeholder="No limit"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={() => removeImpactRule(variable.id, rule.id)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }, [
    selectedVariable,
    handleInputChange,
    handleRuleChange,
    addImpactRule,
    removeImpactRule,
    services,
    removeVariable
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Company Information Variables</h3>
        <button
          onClick={addVariable}
          className="flex items-center px-4 py-2 text-sm font-medium text-[#43d18a] hover:bg-[#43d18a]/10 rounded-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Variable
        </button>
      </div>

      {variables.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No variables configured yet.</p>
          <p className="text-sm text-gray-500 mt-1">
            Add variables to customize pricing based on company information.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {variables.map(variable => (
            <VariableCard key={variable.id} variable={variable} />
          ))}
        </div>
      )}
    </div>
  );
}