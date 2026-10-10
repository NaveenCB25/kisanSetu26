export const cropDiseases = [
  {
    id: 'dis-1',
    crop: 'Potato (आलू)',
    cropKey: 'potato',
    diseaseName: 'Late Blight (पिछेता झुलसा)',
    scientificName: 'Phytophthora infestans',
    severity: 'High (Immediate Action Required)',
    severityLevel: 'danger',
    confidenceScore: '96.4%',
    sampleImage: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80',
    symptoms: [
      'Water-soaked dark lesions appearing on leaf tips and margins',
      'White fluffy mildew fungal growth on the underside of leaves during humid mornings',
      'Rapid brown rot spreading down the petioles and stems causing plant collapse'
    ],
    favorableConditions: 'High relative humidity (> 85%) and temperature between 12°C - 20°C with persistent fog or dew.',
    organicRemedy: {
      treatment: 'Bordeaux Mixture & Bio-fungicide Spray',
      recipe: 'Spray 1% Bordeaux mixture (Copper Sulfate + Quicklime 1:1) or Trichoderma viride @ 5g per liter of water. Ensure thorough drenching of undersides of leaves.'
    },
    chemicalRemedy: {
      treatment: 'Systemic & Contact Fungicide Treatment',
      products: [
        'Cymoxanil 8% + Mancozeb 64% WP (Curzate) @ 600g per acre in 200L water',
        'OR Dimethomorph 50% WP @ 300g per acre mixed with Mancozeb 75% WP @ 400g per acre'
      ],
      waitingPeriod: '7 days before harvest'
    },
    preventionTips: [
      'Avoid overhead sprinkler irrigation late in the evening',
      'Select certified disease-free seed tubers (Kufri Pukhraj / Kufri Jyoti)',
      'Destroy and burn infected haulms before digging tubers'
    ]
  },
  {
    id: 'dis-2',
    crop: 'Wheat (गेहूं)',
    cropKey: 'wheat',
    diseaseName: 'Yellow / Stripe Rust (पीला रतुआ)',
    scientificName: 'Puccinia striiformis f. sp. tritici',
    severity: 'Critical (High Yield Loss Risk)',
    severityLevel: 'danger',
    confidenceScore: '94.8%',
    sampleImage: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
    symptoms: [
      'Bright yellow powder-like pustules arranged in narrow parallel stripes on leaf blades',
      'Yellow powder easily rubs off on fingers or white cloth when touched',
      'Premature leaf chlorosis and drying, resulting in shriveled grains'
    ],
    favorableConditions: 'Cool weather (10°C - 18°C) combined with high morning dew and overcast skies during January-February.',
    organicRemedy: {
      treatment: 'Cow Urine & Neem Formulation',
      recipe: 'Foliar spray of fermented cow urine (1:10 dilution in water) combined with cold-pressed Neem oil (1500 ppm @ 4ml/L) as a natural immune booster.'
    },
    chemicalRemedy: {
      treatment: 'Triazole Foliar Fungicide',
      products: [
        'Propiconazole 25% EC (Tilt / Bumper) @ 200ml per acre dissolved in 200 liters of water',
        'OR Tebuconazole 25.9% EC @ 200ml per acre at first appearance of yellow stripes'
      ],
      waitingPeriod: 'Do not spray within 15 days of grain maturity'
    },
    preventionTips: [
      'Sow resistant wheat varieties recommended for your agro-climatic zone (e.g., PBW 824, HD 3226, DBW 187)',
      'Regular scouting of north-facing borders and shaded field patches'
    ]
  },
  {
    id: 'dis-3',
    crop: 'Tomato (टमाटर)',
    cropKey: 'tomato',
    diseaseName: 'Tomato Leaf Curl Virus (पर्ण कुंचन रोग)',
    scientificName: 'ToLCV (Transmitted by Bemisia tabaci / Whitefly)',
    severity: 'Moderate to High',
    severityLevel: 'warning',
    confidenceScore: '92.1%',
    sampleImage: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
    symptoms: [
      'Upward and inward curling and crinkling of young leaflets',
      'Severe stunting of bushes with excessive bushy appearance and short internodes',
      'Thickened leathery leaves with reduced flower drop and very poor fruit setting'
    ],
    favorableConditions: 'Warm and dry seasons fostering rapid multiplication of whitefly vectors.',
    organicRemedy: {
      treatment: 'Vector Trapping & Bio-spray',
      recipe: 'Install yellow sticky traps (15 traps per acre) at canopy height. Spray 2% Neem Seed Kernel Extract (NSKE) or Beauveria bassiana @ 5g/liter.'
    },
    chemicalRemedy: {
      treatment: 'Systemic Vector Insecticide',
      products: [
        'Diafenthiuron 50% WP (Pegasus) @ 250g per acre',
        'OR Cyantraniliprole 10.26% OD (Benevia) @ 360ml per acre to control vector nymphs and adults'
      ],
      waitingPeriod: '3 days safe waiting interval'
    },
    preventionTips: [
      'Use 40-mesh insect-proof netting in nursery beds',
      'Remove and bury rogue viral infected seedlings immediately',
      'Maintain barrier crops like maize or sorghum around tomato plots'
    ]
  },
  {
    id: 'dis-4',
    crop: 'Cotton (कपास)',
    cropKey: 'cotton',
    diseaseName: 'Pink Bollworm Infestation (गुलाबी सुंडी)',
    scientificName: 'Pectinophora gossypiella',
    severity: 'High (Boll Quality & Lint Damage)',
    severityLevel: 'danger',
    confidenceScore: '95.2%',
    sampleImage: 'https://images.unsplash.com/photo-1594498653385-d5172c532c00?auto=format&fit=crop&w=600&q=80',
    symptoms: [
      'Rosette flowers with petals tied together that fail to open properly',
      'Small entrance holes on young green bolls that seal over quickly',
      'Discolored, rotted seeds and stained unpickable lint upon cutting open bolls'
    ],
    favorableConditions: 'Extended monsoon breaks, warm humid nights, and extended cotton cropping beyond 150 days.',
    organicRemedy: {
      treatment: 'Pheromone Trapping & Bio-Control',
      recipe: 'Install Pheromone traps with Gossyplure lures @ 8-10 traps per acre for mass trapping. Release Trichogramma bactrae egg parasitoids @ 60,000 per acre weekly.'
    },
    chemicalRemedy: {
      treatment: 'Targeted Larvicide Spray',
      products: [
        'Emamectin Benzoate 5% SG (Proclaim) @ 88-100g per acre in 200L water',
        'OR Chlorantraniliprole 18.5% SC (Coragen) @ 60ml per acre at ETL threshold'
      ],
      waitingPeriod: '14 days'
    },
    preventionTips: [
      'Terminate cotton crop by mid-January to break the pest cycle',
      'Avoid stacking cotton stalks in fields for household fuel',
      'Deep summer plowing to expose diapausing larvae to solar heat'
    ]
  },
  {
    id: 'dis-5',
    crop: 'Rice / Paddy (धान)',
    cropKey: 'rice',
    diseaseName: 'Rice Blast (झोंका / ब्लास्ट रोग)',
    scientificName: 'Magnaporthe oryzae',
    severity: 'High',
    severityLevel: 'danger',
    confidenceScore: '93.7%',
    sampleImage: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    symptoms: [
      'Spindle-shaped / diamond-shaped lesions with gray-white centers and dark brown borders on leaves',
      'Blackish necrosis at neck node of panicle (Neck Blast) causing drooping and chaffy empty grains',
      'Node infection turning black and breaking easily under wind stress'
    ],
    favorableConditions: 'Intermittent drizzles, high cloud cover, night temperatures around 20°C, and excessive urea fertilizer application.',
    organicRemedy: {
      treatment: 'Pseudomonas fluorescens Bio-Control',
      recipe: 'Foliar spray of Pseudomonas fluorescens @ 10g/liter or 2.5 kg/ha mixed with well-decomposed farmyard manure.'
    },
    chemicalRemedy: {
      treatment: 'Specialized Blasticide',
      products: [
        'Tricyclazole 75% WP (Baan / Beam) @ 120-150g per acre in 200L water',
        'OR Isoprothiolane 40% EC (Fujione) @ 300ml per acre'
      ],
      waitingPeriod: '21 days'
    },
    preventionTips: [
      'Avoid high doses of nitrogenous fertilizers (split urea into 3 balanced applications)',
      'Treat seeds with Carboxin 37.5% + Thiram 37.5% (Vitavax Power) @ 2.5g/kg before sowing'
    ]
  }
];
