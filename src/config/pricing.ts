export const globalPricing = {
  salary: {
    baseRate: 650,
    perEmployeeRate: 250,
    label: "Salary & Payroll",
    description: "Monthly payroll processing and reporting",
    driver: {
      type: 'employees',
      label: 'Employees',
      description: 'Number of employees on payroll'
    }
  },
  bookkeeping: {
    baseRate: 2000,
    perTransactionRate: 12,
    label: "Bookkeeping",
    description: "Daily transaction processing and reconciliation",
    driver: {
      type: 'transactions',
      label: 'Transactions',
      description: 'Average monthly transactions'
    }
  },
  annualReports: {
    tiers: [
      { maxRevenue: 2, price: 5000 },
      { maxRevenue: 5, price: 6000 },
      { maxRevenue: 10, price: 8000 },
      { maxRevenue: 20, price: 10000 },
      { maxRevenue: 50, price: 12000 },
      { maxRevenue: Infinity, price: 15000 }
    ],
    label: "Annual Reports",
    description: "Year-end reporting and tax returns",
    driver: {
      type: 'revenue',
      label: 'Annual Revenue',
      description: 'Annual revenue in million NOK'
    }
  },
  premium: {
    monthlyPrice: 5000,
    label: "Silfer Premium",
    description: "Priority support and dedicated account manager",
    features: [
      "Priority Support 24/7",
      "Dedicated Account Manager",
      "Quarterly Business Review",
      "Custom Report Templates",
      "Advanced Analytics Dashboard"
    ]
  }
};