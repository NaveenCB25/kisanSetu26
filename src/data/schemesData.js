export const governmentSchemes = [
  {
    id: 'scheme-1',
    name: 'PM-Kisan Samman Nidhi (पीएम किसान सम्मान निधि)',
    category: 'Direct Income Support',
    benefit: '₹6,000 per year (in 3 equal installments of ₹2,000)',
    description: 'Direct cash transfer scheme for all landholding farmer families across India to supplement their agricultural and domestic financial needs.',
    eligibility: {
      minLand: 0.1, // Acres
      maxLand: 999, // All landholding farmers
      farmerType: ['Marginal', 'Small', 'Medium', 'Large'],
      keyRequirements: 'Land records in applicant name, Aadhaar linked active bank account with e-KYC completed.'
    },
    subsidyPercent: '100% Cash Benefit',
    portalUrl: 'https://pmkisan.gov.in',
    helpline: '155261 / 011-24300606',
    documentsRequired: ['Aadhaar Card', 'Land Khatauni / 7/12 Extract', 'Bank Passbook Copy', 'Active Mobile Number']
  },
  {
    id: 'scheme-2',
    name: 'PM KUSUM Solar Pump Scheme (प्रधानमंत्री कुसुम योजना)',
    category: 'Solar Irrigation & Energy',
    benefit: 'Up to 60% Govt Subsidy on Off-grid Solar Water Pumps',
    description: 'De-dieselization of agriculture by supporting farmers to install 3 HP to 10 HP solar water pumps. Central Govt 30% + State Govt 30% + 30% Bank Loan, farmer pays only 10% upfront.',
    eligibility: {
      minLand: 0.5,
      maxLand: 999,
      farmerType: ['Marginal', 'Small', 'Medium', 'Large'],
      keyRequirements: 'Must have agricultural land with an existing borewell or open water source and no electric connection (Component B) or grid-connected (Component C).'
    },
    subsidyPercent: '60% - 90% Total Subsidy',
    portalUrl: 'https://pmkusum.mnre.gov.in',
    helpline: '1800-180-3333',
    documentsRequired: ['Aadhaar Card', 'Land Possession Certificate', 'Water Source Verification Certificate', 'Bank Account Details']
  },
  {
    id: 'scheme-3',
    name: 'PM Fasal Bima Yojana - PMFBY (प्रधानमंत्री फसल बीमा योजना)',
    category: 'Crop Insurance',
    benefit: 'Comprehensive risk insurance against unseasonal rain, floods, pest attacks and drought',
    description: 'Extremely affordable farmer premium: Only 2% for Kharif crops, 1.5% for Rabi crops, and 5% for commercial/horticultural crops. Balance premium paid jointly by Central and State Governments.',
    eligibility: {
      minLand: 0.1,
      maxLand: 999,
      farmerType: ['Marginal', 'Small', 'Medium', 'Large'],
      keyRequirements: 'All farmers growing notified crops in notified areas including sharecroppers and tenant farmers.'
    },
    subsidyPercent: '95%+ Premium Subsidy',
    portalUrl: 'https://pmfby.gov.in',
    helpline: '1800-180-1551 (Kisan Call Centre)',
    documentsRequired: ['Land Record (RoR / Khasra)', 'Sowing Certificate / Declaration', 'Bank Account details', 'ID Proof']
  },
  {
    id: 'scheme-4',
    name: 'Kisan Credit Card - KCC (किसान क्रेडिट कार्ड)',
    category: 'Subsidized Agri Loans',
    benefit: 'Short-term crop loan up to ₹3,00,000 at effective 4% interest rate per annum',
    description: 'Interest subvention of 2% and additional 3% incentive for prompt repayment makes the effective interest rate only 4% p.a., without collateral up to ₹1.6 Lakh.',
    eligibility: {
      minLand: 0.2,
      maxLand: 999,
      farmerType: ['Marginal', 'Small', 'Medium', 'Large'],
      keyRequirements: 'Owner cultivators, tenant farmers, oral lessees, and Self Help Groups (SHGs) of farmers.'
    },
    subsidyPercent: '3% Prompt Repayment Rebate',
    portalUrl: 'https://www.myscheme.gov.in/schemes/kcc',
    helpline: '1800-11-2211 / Nearest Bank Branch',
    documentsRequired: ['Duly filled application form', 'Identity and address proof', 'Land cultivation proof', 'No-dues certificate']
  },
  {
    id: 'scheme-5',
    name: 'SMAM - Farm Mechanization Subsidy (कृषि यंत्रीकरण उप-मिशन)',
    category: 'Machinery Subsidy',
    benefit: '40% to 50% Subsidy on Tractors, Rotavators, Power Tillers and Combine Harvesters',
    description: 'Financial assistance for procurement of modern agricultural machinery and equipment, with enhanced 50% subsidy for women, SC, ST, and small/marginal farmers.',
    eligibility: {
      minLand: 0.5,
      maxLand: 50,
      farmerType: ['Marginal', 'Small', 'Medium'],
      keyRequirements: 'Farmer must not have availed machinery subsidy for the same equipment category in the previous 5-7 years.'
    },
    subsidyPercent: '40% - 50% Subsidy',
    portalUrl: 'https://agrimachinery.nic.in',
    helpline: '1800-180-1551',
    documentsRequired: ['Aadhaar Card', 'Land Record Khatauni', 'Bank Passbook', 'Caste Certificate (if applicable)', 'Quotation from Authorized Dealer']
  },
  {
    id: 'scheme-6',
    name: 'Per Drop More Crop - PMKSY (प्रति बूंद अधिक फसल - सूक्ष्म सिंचाई)',
    category: 'Micro-Irrigation',
    benefit: 'Up to 55% Subsidy for Small/Marginal farmers on Drip & Sprinkler Systems',
    description: 'Promotes water-use efficiency through micro-irrigation technologies. Saves 40-50% water while boosting crop yields by 20-30% and reducing weed growth.',
    eligibility: {
      minLand: 0.2,
      maxLand: 12.5,
      farmerType: ['Marginal', 'Small', 'Medium'],
      keyRequirements: 'Access to verified water source (borewell, pond, canal lift).'
    },
    subsidyPercent: '45% - 55% Subsidy',
    portalUrl: 'https://pmksy.gov.in',
    helpline: '1800-180-1551',
    documentsRequired: ['Land 7/12 extract', 'Water source verification', 'Soil test report', 'Bank Passbook', 'Aadhaar']
  }
];
