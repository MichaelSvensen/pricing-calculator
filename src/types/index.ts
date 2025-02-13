import { ReactNode } from 'react';

export type Service = 'annual-reports' | 'bookkeeping' | 'salary';
export type Industry = 
  | 'consulting' 
  | 'tech' 
  | 'ecommerce' 
  | 'retail' 
  | 'restaurant' 
  | 'construction' 
  | 'realestate' 
  | 'transportation' 
  | 'healthcare' 
  | 'financial' 
  | 'creative' 
  | 'farming';

export interface IndustryQuestion {
  id: string;
  question: string;
  description?: string;
  impact: {
    type: 'multiplier' | 'fixed';
    value: number;
  };
}

export interface IndustryOptions {
  [key: string]: boolean;
}

export interface IndustryConfig {
  baseMultiplier: number;
  maxMultiplier: number;
  label: string;
  description: string;
  questions: IndustryQuestion[];
}

export interface CalculatorFormData {
  employees: number;
  revenue: number;
  transactions: number;
  industry: Industry;
  industryOptions: IndustryOptions;
  selectedServices: Service[];
  isPremium: boolean;
}

export interface PricingVariable {
  id: string;
  name: string;
  type: 'number' | 'currency' | 'text';
  tag: string;
  description: string;
  impactRules: PricingImpactRule[];
}

export interface PricingImpactRule {
  id: string;
  serviceId: string;
  formula: 'linear' | 'threshold' | 'percentage';
  amount: number;
  minValue?: number;
  maxValue?: number;
  thresholds?: { value: number; amount: number }[];
}