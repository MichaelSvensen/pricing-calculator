import React, { useState } from 'react';
import { AlertCircle, Trash2, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { Industry, IndustryConfig, IndustryQuestion } from '../../types';
import { industryConfigs } from '../../config/industries';

interface IndustrySettingsProps {
  onChangesPending: () => void;
}

export function IndustrySettings({ onChangesPending }: IndustrySettingsProps) {
  const [editingIndustry, setEditingIndustry] = useState<string | null>(null);
  const [tempConfig, setTempConfig] = useState<IndustryConfig | null>(null);
  const [expandedQuestions, setExpandedQuestions] = useState<string[]>([]);

  const handleEdit = (industryKey: string) => {
    setEditingIndustry(industryKey);
    setTempConfig(industryConfigs[industryKey as Industry]);
    onChangesPending();
  };

  const handleSave = (industryKey: string) => {
    if (tempConfig) {
      Object.assign(industryConfigs[industryKey as Industry], tempConfig);
      setEditingIndustry(null);
      setTempConfig(null);
    }
  };

  const handleCancel = () => {
    setEditingIndustry(null);
    setTempConfig(null);
  };

  const toggleQuestions = (industryKey: string) => {
    setExpandedQuestions(prev => 
      prev.includes(industryKey)
        ? prev.filter(key => key !== industryKey)
        : [...prev, industryKey]
    );
  };

  const addQuestion = (industryKey: string) => {
    const newQuestion: IndustryQuestion = {
      id: `question-${Date.now()}`,
      question: '',
      description: '',
      impact: {
        type: 'multiplier',
        value: 1.1
      }
    };

    setTempConfig(prev => ({
      ...prev!,
      questions: [...(prev?.questions || []), newQuestion]
    }));
    onChangesPending();
  };

  const removeQuestion = (questionId: string) => {
    setTempConfig(prev => ({
      ...prev!,
      questions: prev!.questions.filter(q => q.id !== questionId)
    }));
    onChangesPending();
  };

  const updateQuestion = (questionId: string, updates: Partial<IndustryQuestion>) => {
    setTempConfig(prev => ({
      ...prev!,
      questions: prev!.questions.map(q => 
        q.id === questionId ? { ...q, ...updates } : q
      )
    }));
    onChangesPending();
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {Object.entries(industryConfigs).map(([industryKey, config]) => (
          <div key={industryKey} className="border rounded-lg p-4">
            {editingIndustry === industryKey ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Label</label>
                  <input
                    type="text"
                    value={tempConfig?.label}
                    onChange={(e) => {
                      setTempConfig(prev => ({ ...prev!, label: e.target.value }));
                      onChangesPending();
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#43d18a] focus:ring focus:ring-[#43d18a]/20"
                  />
                </div>

                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium text-gray-900">Industry Questions</h4>
                    <button
                      onClick={() => addQuestion(industryKey)}
                      className="flex items-center px-3 py-1.5 text-sm font-medium text-[#43d18a] hover:bg-[#43d18a]/10 rounded-md"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Question
                    </button>
                  </div>

                  <div className="space-y-4">
                    {tempConfig?.questions.map((question, index) => (
                      <div key={question.id} className="border rounded-lg p-4">
                        <div className="grid gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Question</label>
                            <input
                              type="text"
                              value={question.question}
                              onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#43d18a] focus:ring focus:ring-[#43d18a]/20"
                              placeholder="Enter your question"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <input
                              type="text"
                              value={question.description}
                              onChange={(e) => updateQuestion(question.id, { description: e.target.value })}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#43d18a] focus:ring focus:ring-[#43d18a]/20"
                              placeholder="Optional description"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Impact Type</label>
                              <select
                                value={question.impact.type}
                                onChange={(e) => updateQuestion(question.id, {
                                  impact: { ...question.impact, type: e.target.value as 'multiplier' | 'fixed' }
                                })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#43d18a] focus:ring focus:ring-[#43d18a]/20"
                              >
                                <option value="multiplier">Multiplier</option>
                                <option value="fixed">Fixed Amount</option>
                              </select>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Impact Value</label>
                              <input
                                type="number"
                                step={question.impact.type === 'multiplier' ? '0.05' : '100'}
                                value={question.impact.value}
                                onChange={(e) => updateQuestion(question.id, {
                                  impact: { ...question.impact, value: parseFloat(e.target.value) }
                                })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#43d18a] focus:ring focus:ring-[#43d18a]/20"
                              />
                            </div>
                          </div>

                          <button
                            onClick={() => removeQuestion(question.id)}
                            className="justify-self-end px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md"
                          >
                            Remove Question
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSave(industryKey)}
                    className="px-4 py-2 text-sm font-medium text-white bg-[#43d18a] hover:bg-[#43d18a]/90 rounded-md"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{config.label}</h3>
                    <p className="mt-1 text-sm text-gray-500">{config.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(industryKey)}
                      className="px-3 py-1.5 text-sm font-medium text-gray-900 hover:bg-gray-100 rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => toggleQuestions(industryKey)}
                      className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-md"
                    >
                      {expandedQuestions.includes(industryKey) ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {expandedQuestions.includes(industryKey) && config.questions.length > 0 && (
                  <div className="mt-4 space-y-3">
                    <h4 className="text-sm font-medium text-gray-700">Industry Questions</h4>
                    {config.questions.map((question) => (
                      <div key={question.id} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{question.question}</p>
                            {question.description && (
                              <p className="text-sm text-gray-500 mt-1">{question.description}</p>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            {question.impact.type === 'multiplier' ? (
                              <span>×{question.impact.value}</span>
                            ) : (
                              <span>+{question.impact.value} NOK</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}