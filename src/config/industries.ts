import { Industry, IndustryConfig } from '../types';

export const industryConfigs: Record<Industry, IndustryConfig> = {
  farming: {
    baseMultiplier: 1.5,
    maxMultiplier: 2.0,
    label: "Farming / Agriculture",
    description: "Unique VAT schemes, seasonal fluctuations, grants/subsidies",
    questions: [
      {
        id: 'receives-subsidies',
        question: 'Do you receive government grants?',
        description: 'Affects subsidy accounting complexity',
        impact: {
          type: 'multiplier',
          value: 1.15
        }
      },
      {
        id: 'direct-sales',
        question: 'Do you sell products directly to consumers?',
        description: 'Affects VAT handling complexity',
        impact: {
          type: 'multiplier',
          value: 1.2
        }
      }
    ]
  },
  consulting: {
    baseMultiplier: 1.0,
    maxMultiplier: 1.2,
    label: "Consulting / Freelancers",
    description: "Low transaction volume, simple VAT, few employees",
    questions: [
      {
        id: 'fixed-price-contracts',
        question: 'Do you work with fixed-price contracts?',
        description: 'Affects revenue recognition and project accounting',
        impact: {
          type: 'multiplier',
          value: 1.1
        }
      },
      {
        id: 'international-clients',
        question: 'Do you have international clients?',
        description: 'Affects VAT handling and currency considerations',
        impact: {
          type: 'multiplier',
          value: 1.15
        }
      }
    ]
  },
  tech: {
    baseMultiplier: 1.2,
    maxMultiplier: 1.5,
    label: "Tech / SaaS",
    description: "Subscription revenue, investor reporting, reverse VAT",
    questions: [
      {
        id: 'has-stock-options',
        question: 'Do you offer stock options to employees?',
        description: 'Affects equity compensation accounting',
        impact: {
          type: 'multiplier',
          value: 1.2
        }
      },
      {
        id: 'has-investors',
        question: 'Do you have external investors?',
        description: 'Affects reporting requirements and complexity',
        impact: {
          type: 'multiplier',
          value: 1.15
        }
      }
    ]
  },
  ecommerce: {
    baseMultiplier: 1.3,
    maxMultiplier: 1.8,
    label: "E-commerce",
    description: "Online sales, inventory management, multiple payment methods",
    questions: [
      {
        id: 'sells-internationally',
        question: 'Do you sell to customers outside Norway?',
        description: 'Affects international VAT and customs handling',
        impact: {
          type: 'multiplier',
          value: 1.25
        }
      },
      {
        id: 'multiple-payment-providers',
        question: 'Do you use multiple payment providers?',
        description: 'Affects payment reconciliation complexity',
        impact: {
          type: 'multiplier',
          value: 1.15
        }
      }
    ]
  },
  retail: {
    baseMultiplier: 1.2,
    maxMultiplier: 1.6,
    label: "Retail",
    description: "Physical stores, inventory, POS systems",
    questions: [
      {
        id: 'sells-lottery-tobacco',
        question: 'Do you sell lottery tickets or tobacco products?',
        description: 'Affects special reporting requirements',
        impact: {
          type: 'multiplier',
          value: 1.2
        }
      },
      {
        id: 'has-loyalty-program',
        question: 'Do you have a customer loyalty program?',
        description: 'Affects revenue recognition and customer tracking',
        impact: {
          type: 'multiplier',
          value: 1.15
        }
      }
    ]
  },
  restaurant: {
    baseMultiplier: 1.4,
    maxMultiplier: 1.9,
    label: "Restaurant / Food Service",
    description: "Food service, employee tips, alcohol licensing",
    questions: [
      {
        id: 'serves-alcohol',
        question: 'Do you serve alcoholic beverages?',
        description: 'Affects licensing and inventory requirements',
        impact: {
          type: 'multiplier',
          value: 1.2
        }
      },
      {
        id: 'distributes-tips',
        question: 'Do you handle tip distribution to employees?',
        description: 'Affects payroll and tax reporting',
        impact: {
          type: 'multiplier',
          value: 1.15
        }
      }
    ]
  },
  construction: {
    baseMultiplier: 1.3,
    maxMultiplier: 1.7,
    label: "Construction",
    description: "Project accounting, subcontractors, progress billing",
    questions: [
      {
        id: 'has-subcontractors',
        question: 'Do you work with subcontractors?',
        description: 'Affects contractor management and reporting',
        impact: {
          type: 'multiplier',
          value: 1.2
        }
      },
      {
        id: 'multiple-projects',
        question: 'Do you handle multiple projects simultaneously?',
        description: 'Affects project accounting complexity',
        impact: {
          type: 'multiplier',
          value: 1.15
        }
      }
    ]
  },
  realestate: {
    baseMultiplier: 1.2,
    maxMultiplier: 1.5,
    label: "Real Estate",
    description: "Property management, tenant contracts, maintenance costs",
    questions: [
      {
        id: 'mixed-property-types',
        question: 'Do you manage different types of properties?',
        description: 'Affects property management complexity',
        impact: {
          type: 'multiplier',
          value: 1.15
        }
      },
      {
        id: 'has-long-term-tenants',
        question: 'Do you have long-term rental agreements?',
        description: 'Affects contract management and billing',
        impact: {
          type: 'multiplier',
          value: 1.1
        }
      }
    ]
  },
  transportation: {
    baseMultiplier: 1.3,
    maxMultiplier: 1.6,
    label: "Transportation / Logistics",
    description: "Fleet management, route optimization, fuel costs",
    questions: [
      {
        id: 'operates-fleet',
        question: 'Do you operate your own vehicle fleet?',
        description: 'Affects asset management and maintenance tracking',
        impact: {
          type: 'multiplier',
          value: 1.2
        }
      },
      {
        id: 'handles-international-freight',
        question: 'Do you handle international freight?',
        description: 'Affects customs and international regulations',
        impact: {
          type: 'multiplier',
          value: 1.25
        }
      }
    ]
  },
  healthcare: {
    baseMultiplier: 1.4,
    maxMultiplier: 1.8,
    label: "Healthcare",
    description: "Patient billing, insurance claims, compliance",
    questions: [
      {
        id: 'has-insurance-settlements',
        question: 'Do you handle insurance settlements?',
        description: 'Affects billing and claims processing',
        impact: {
          type: 'multiplier',
          value: 1.2
        }
      },
      {
        id: 'multiple-specialties',
        question: 'Do you offer multiple medical specialties?',
        description: 'Affects service coding and billing complexity',
        impact: {
          type: 'multiplier',
          value: 1.15
        }
      }
    ]
  },
  financial: {
    baseMultiplier: 1.5,
    maxMultiplier: 2.0,
    label: "Financial Services",
    description: "Complex regulations, client funds, reporting requirements",
    questions: [
      {
        id: 'has-finanstilsynet-reporting',
        question: 'Are you subject to Finanstilsynet reporting?',
        description: 'Affects regulatory compliance requirements',
        impact: {
          type: 'multiplier',
          value: 1.3
        }
      },
      {
        id: 'manages-client-funds',
        question: 'Do you manage client funds?',
        description: 'Affects trust accounting and compliance',
        impact: {
          type: 'multiplier',
          value: 1.25
        }
      }
    ]
  },
  creative: {
    baseMultiplier: 1.1,
    maxMultiplier: 1.4,
    label: "Creative / Agency",
    description: "Project billing, time tracking, client management",
    questions: [
      {
        id: 'has-retainer-clients',
        question: 'Do you work with retainer clients?',
        description: 'Affects recurring billing and contract management',
        impact: {
          type: 'multiplier',
          value: 1.1
        }
      },
      {
        id: 'works-internationally',
        question: 'Do you work with international clients?',
        description: 'Affects currency handling and VAT considerations',
        impact: {
          type: 'multiplier',
          value: 1.15
        }
      }
    ]
  }
};