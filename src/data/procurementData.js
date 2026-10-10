// KisanSetu — Smart Mandi Procurement and Queue Management Engine

export const configuredMandis = [
  {
    id: 'mandi-khanna',
    name: 'Khanna Central Grain Market',
    hindiName: 'खन्ना केंद्रीय अनाज मंडी (एशिया की सबसे बड़ी)',
    district: 'Ludhiana',
    state: 'Punjab',
    totalBays: 4,
    openBays: 3,
    dailyCapacityTrolleys: 600,
    currentQueueCount: 38,
    avgWaitMinutes: 28,
    procuringCrops: ['Wheat (गेहूं)', 'Basmati Paddy (धान)'],
    agency: 'PUNGRAIN / FCI',
    status: 'OPERATIONAL'
  },
  {
    id: 'mandi-karnal',
    name: 'Karnal Modern APMC Yard',
    hindiName: 'करनाल आधुनिक अनाज मंडी',
    district: 'Karnal',
    state: 'Haryana',
    totalBays: 3,
    openBays: 3,
    dailyCapacityTrolleys: 450,
    currentQueueCount: 22,
    avgWaitMinutes: 18,
    procuringCrops: ['Wheat (गेहूं)', 'Mustard (सरसों)'],
    agency: 'HAFED / FCI',
    status: 'OPERATIONAL'
  },
  {
    id: 'mandi-bharatpur',
    name: 'Bharatpur Krishi Upaj Mandi',
    hindiName: 'भरतपुर कृषि उपज मंडी',
    district: 'Bharatpur',
    state: 'Rajasthan',
    totalBays: 2,
    openBays: 2,
    dailyCapacityTrolleys: 300,
    currentQueueCount: 16,
    avgWaitMinutes: 15,
    procuringCrops: ['Mustard (सरसों / राई)', 'Wheat (गेहूं)'],
    agency: 'NAFED / RAJFED',
    status: 'OPERATIONAL'
  },
  {
    id: 'mandi-rajkot',
    name: 'Rajkot Marketing Yard',
    hindiName: 'राजकोट मार्केटिंग यार्ड (बेडी)',
    district: 'Rajkot',
    state: 'Gujarat',
    totalBays: 4,
    openBays: 3,
    dailyCapacityTrolleys: 500,
    currentQueueCount: 42,
    avgWaitMinutes: 32,
    procuringCrops: ['Cotton (कपास)', 'Groundnut (मूंगफली)'],
    agency: 'CCI / GUJCOT',
    status: 'CONGESTED'
  },
  {
    id: 'mandi-indore',
    name: 'Indore Devi Ahilya APMC Mandi',
    hindiName: 'इंदौर देवी अहिल्या कृषि मंडी',
    district: 'Indore',
    state: 'Madhya Pradesh',
    totalBays: 3,
    openBays: 2,
    dailyCapacityTrolleys: 480,
    currentQueueCount: 29,
    avgWaitMinutes: 24,
    procuringCrops: ['Wheat (गेहूं)', 'Soybean (सोयाबीन)'],
    agency: 'MP WLC / FCI',
    status: 'OPERATIONAL'
  }
];

export const officialMSPRates = [
  {
    id: 'crop-wheat',
    crop: 'Wheat (गेहूं)',
    cropKey: 'wheat',
    mspRate: 2275,
    unit: '₹ / Quintal',
    procurementAgency: 'Food Corporation of India (FCI) & State Agencies',
    season: 'Rabi 2026',
    faqToleranceMoisture: 'Max 12.0%',
    dailyQuotaPerFarmerQtl: 150
  },
  {
    id: 'crop-paddy',
    crop: 'Common Paddy / Rice (धान साधारण)',
    cropKey: 'paddy',
    mspRate: 2183,
    unit: '₹ / Quintal',
    procurementAgency: 'FCI / State Civil Supplies',
    season: 'Kharif / Rabi 2026',
    faqToleranceMoisture: 'Max 17.0%',
    dailyQuotaPerFarmerQtl: 200
  },
  {
    id: 'crop-mustard',
    crop: 'Mustard (सरसों / तोरिया)',
    cropKey: 'mustard',
    mspRate: 5650,
    unit: '₹ / Quintal',
    procurementAgency: 'NAFED (PSS Scheme)',
    season: 'Rabi 2026',
    faqToleranceMoisture: 'Max 8.0%',
    dailyQuotaPerFarmerQtl: 100
  },
  {
    id: 'crop-cotton',
    crop: 'Cotton Medium Staple (कपास)',
    cropKey: 'cotton',
    mspRate: 7020,
    unit: '₹ / Quintal',
    procurementAgency: 'Cotton Corporation of India (CCI)',
    season: 'Commercial 2026',
    faqToleranceMoisture: 'Max 8.0% - 12.0%',
    dailyQuotaPerFarmerQtl: 80
  },
  {
    id: 'crop-chana',
    crop: 'Gram / Chana (चना देसी)',
    cropKey: 'chana',
    mspRate: 5440,
    unit: '₹ / Quintal',
    procurementAgency: 'NAFED (Buffer Stock)',
    season: 'Rabi 2026',
    faqToleranceMoisture: 'Max 10.0%',
    dailyQuotaPerFarmerQtl: 120
  },
  {
    id: 'crop-maize',
    crop: 'Maize (मक्का पीला)',
    cropKey: 'maize',
    mspRate: 2090,
    unit: '₹ / Quintal',
    procurementAgency: 'FCI / NAFED',
    season: 'Kharif / Spring 2026',
    faqToleranceMoisture: 'Max 14.0%',
    dailyQuotaPerFarmerQtl: 180
  }
];

export const initialQueueTokens = [
  {
    id: 'tok-101',
    tokenNumber: 'KST-101',
    farmerName: 'Sardar Baldev Singh',
    farmerAadhaarLast4: '7823',
    phone: '+91 98765 43210',
    village: 'Samrala',
    district: 'Ludhiana',
    mandiId: 'mandi-khanna',
    mandiName: 'Khanna Central Grain Market',
    crop: 'Wheat (गेहूं)',
    estimatedQuantityQtl: 85,
    vehicleType: 'Tractor Trolley (Double Axle)',
    vehicleNumber: 'PB-10-CZ-4412',
    scheduledDate: '2026-10-10',
    scheduledSlot: '09:00 AM - 11:00 AM',
    status: 'AT_WEIGHBRIDGE', // SCHEDULED, IN_YARD, CALLED, AT_WEIGHBRIDGE, COMPLETED
    currentBay: 'Bay 1 (Gross Weighing)',
    gateCheckInTime: '09:18 AM',
    estimatedWaitMins: 0,
    priority: 'Normal'
  },
  {
    id: 'tok-102',
    tokenNumber: 'KST-102',
    farmerName: 'Gurpreet Singh Dhillon',
    farmerAadhaarLast4: '4190',
    phone: '+91 98144 56789',
    village: 'Nilokheri',
    district: 'Karnal',
    mandiId: 'mandi-karnal',
    mandiName: 'Karnal Modern APMC Yard',
    crop: 'Wheat (गेहूं)',
    estimatedQuantityQtl: 120,
    vehicleType: 'Tractor Trolley',
    vehicleNumber: 'HR-05-AL-9021',
    scheduledDate: '2026-10-10',
    scheduledSlot: '09:30 AM - 11:30 AM',
    status: 'CALLED',
    currentBay: 'Bay 2 (Assigned)',
    gateCheckInTime: '09:35 AM',
    estimatedWaitMins: 4,
    priority: 'Normal'
  },
  {
    id: 'tok-103',
    tokenNumber: 'KST-103',
    farmerName: 'Rameshwar Patil',
    farmerAadhaarLast4: '3341',
    phone: '+91 94231 87654',
    village: 'Pimpalgaon',
    district: 'Ludhiana',
    mandiId: 'mandi-khanna',
    mandiName: 'Khanna Central Grain Market',
    crop: 'Wheat (गेहूं)',
    estimatedQuantityQtl: 65,
    vehicleType: 'Tractor Trolley',
    vehicleNumber: 'PB-10-DX-1144',
    scheduledDate: '2026-10-10',
    scheduledSlot: '10:00 AM - 12:00 PM',
    status: 'IN_YARD',
    currentBay: null,
    gateCheckInTime: '09:50 AM',
    estimatedWaitMins: 12,
    priority: 'Normal'
  },
  {
    id: 'tok-104',
    tokenNumber: 'KST-104',
    farmerName: 'Choudhary Mahendra Patel',
    farmerAadhaarLast4: '8812',
    phone: '+91 98250 11223',
    village: 'Gondal',
    district: 'Rajkot',
    mandiId: 'mandi-rajkot',
    mandiName: 'Rajkot Marketing Yard',
    crop: 'Cotton (कपास)',
    estimatedQuantityQtl: 45,
    vehicleType: 'Mini Truck (Tata 407)',
    vehicleNumber: 'GJ-03-BT-7722',
    scheduledDate: '2026-10-10',
    scheduledSlot: '10:30 AM - 12:30 PM',
    status: 'IN_YARD',
    currentBay: null,
    gateCheckInTime: '10:10 AM',
    estimatedWaitMins: 22,
    priority: 'Normal'
  },
  {
    id: 'tok-105',
    tokenNumber: 'KST-105',
    farmerName: 'Dinesh Kushwaha',
    farmerAadhaarLast4: '9920',
    phone: '+91 97554 99887',
    village: 'Fatehabad',
    district: 'Bharatpur',
    mandiId: 'mandi-bharatpur',
    mandiName: 'Bharatpur Krishi Upaj Mandi',
    crop: 'Mustard (सरसों / तोरिया)',
    estimatedQuantityQtl: 55,
    vehicleType: 'Tractor Trolley',
    vehicleNumber: 'RJ-05-EA-3310',
    scheduledDate: '2026-10-10',
    scheduledSlot: '11:00 AM - 01:00 PM',
    status: 'SCHEDULED',
    currentBay: null,
    gateCheckInTime: null,
    estimatedWaitMins: 35,
    priority: 'Normal'
  },
  {
    id: 'tok-106',
    tokenNumber: 'KST-106',
    farmerName: 'Avtar Singh Sandhu',
    farmerAadhaarLast4: '1105',
    phone: '+91 98888 22334',
    village: 'Raikot',
    district: 'Ludhiana',
    mandiId: 'mandi-khanna',
    mandiName: 'Khanna Central Grain Market',
    crop: 'Wheat (गेहूं)',
    estimatedQuantityQtl: 110,
    vehicleType: 'Tractor Trolley',
    vehicleNumber: 'PB-10-FG-8821',
    scheduledDate: '2026-10-10',
    scheduledSlot: '11:30 AM - 01:30 PM',
    status: 'SCHEDULED',
    currentBay: null,
    gateCheckInTime: null,
    estimatedWaitMins: 45,
    priority: 'Normal'
  }
];

export const initialWeighmentReceipts = [
  {
    slipNumber: 'REC-2026-00841',
    tokenNumber: 'KST-098',
    farmerName: 'Manpreet Singh Brar',
    farmerAadhaarLast4: '5542',
    phone: '+91 98150 99112',
    mandiName: 'Khanna Central Grain Market',
    crop: 'Wheat (गेहूं)',
    vehicleNumber: 'PB-10-BX-1029',
    grossWeightKg: 13450,
    tareWeightKg: 3850,
    netWeightKg: 9600,
    netQuintals: 96.0,
    moisturePercent: 11.2,
    deductionQuintals: 0,
    finalPayableQuintals: 96.0,
    mspRate: 2275,
    totalPayableAmount: 218400,
    procurementAgency: 'PUNGRAIN / FCI',
    weighbridgeOperator: 'Officer R. S. Cheema (Bay 1)',
    timestamp: 'Today, 08:45 AM',
    paymentStatus: 'DBT Approved (PFMS Sent)',
    bankAccountEnding: '•••• 4821 (SBI Ludhiana Branch)',
    dbtReferenceId: 'DBT-PUN-2026-884920'
  },
  {
    slipNumber: 'REC-2026-00840',
    tokenNumber: 'KST-097',
    farmerName: 'Jaswinder Kumar',
    farmerAadhaarLast4: '6618',
    phone: '+91 97280 44556',
    mandiName: 'Karnal Modern APMC Yard',
    crop: 'Wheat (गेहूं)',
    vehicleNumber: 'HR-05-BC-7721',
    grossWeightKg: 10800,
    tareWeightKg: 3200,
    netWeightKg: 7600,
    netQuintals: 76.0,
    moisturePercent: 11.8,
    deductionQuintals: 0,
    finalPayableQuintals: 76.0,
    mspRate: 2275,
    totalPayableAmount: 172900,
    procurementAgency: 'HAFED / FCI',
    weighbridgeOperator: 'Inspector K. L. Sharma (Bay 2)',
    timestamp: 'Today, 08:15 AM',
    paymentStatus: 'Credited to Bank Account',
    bankAccountEnding: '•••• 1190 (PNB Karnal Main)',
    dbtReferenceId: 'DBT-HAR-2026-773192'
  }
];

export const bottleneckAnalytics = {
  gateVerificationAvgMins: 3.8,
  weighbridgeGrossTareAvgMins: 7.2,
  unloadingAndInspectionAvgMins: 14.5,
  dailyDistrictProcurementTargetTonnes: 12500,
  todayDistrictProcuredTonnes: 8420,
  totalFarmersProcessedToday: 412,
  totalDbtDisbursedTodayCrores: 19.15,
  activeTrolleysInAllMandis: 157
};

export const auditLogs = [
  { id: 'log-1', time: '09:42 AM', event: 'Weighbridge Bay 1: Gross Weight (13,450 kg) recorded for Token #KST-101 (PB-10-CZ-4412).' },
  { id: 'log-2', time: '09:35 AM', event: 'Token #KST-102 called to Weighbridge Bay 2 by Staff Operator.' },
  { id: 'log-3', time: '09:18 AM', event: 'Gate Entry Approved: QR Scan verified for Token #KST-101. Marked IN_YARD.' },
  { id: 'log-4', time: '08:45 AM', event: 'Digital Receipt #REC-2026-00841 issued for 96.0 Qtl Wheat. PFMS Payment initiated.' }
];

// Local Storage helpers
export const getStoredTokens = () => {
  try {
    const data = localStorage.getItem('kisansetu_queue_tokens');
    if (data) return JSON.parse(data);
  } catch {
    // fallback
  }
  return initialQueueTokens;
};

export const saveStoredTokens = (tokens) => {
  try {
    localStorage.setItem('kisansetu_queue_tokens', JSON.stringify(tokens));
  } catch {
    // fallback
  }
};

export const getStoredReceipts = () => {
  try {
    const data = localStorage.getItem('kisansetu_receipts');
    if (data) return JSON.parse(data);
  } catch {
    // fallback
  }
  return initialWeighmentReceipts;
};

export const saveStoredReceipts = (receipts) => {
  try {
    localStorage.setItem('kisansetu_receipts', JSON.stringify(receipts));
  } catch {
    // fallback
  }
};

export const getStoredMSP = () => {
  try {
    const data = localStorage.getItem('kisansetu_msp_rates');
    if (data) return JSON.parse(data);
  } catch {
    // fallback
  }
  return officialMSPRates;
};

export const saveStoredMSP = (mspList) => {
  try {
    localStorage.setItem('kisansetu_msp_rates', JSON.stringify(mspList));
  } catch {
    // fallback
  }
};
