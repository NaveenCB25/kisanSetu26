export const initialMarketplaceListings = [
  {
    id: 'crop-101',
    farmerName: 'Sardar Baldev Singh',
    phone: '+91 98765 43210',
    village: 'Samrala, Ludhiana',
    state: 'Punjab',
    cropName: 'Sharbati Wheat (शरबती गेहूं)',
    category: 'Grains',
    variety: 'C-306 Traditional Sharbati',
    quantity: 85,
    unit: 'Quintals',
    pricePerQuintal: 2550,
    mandiBenchmark: 2380,
    grade: 'Grade A+ (Premium Luster)',
    isOrganic: true,
    harvestDate: 'April 2026',
    moisturePercent: '10.5%',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
    description: 'Clean golden grains grown with organic farmyard manure, single-sifted, moisture < 11%, zero pesticide residue.',
    bidsCount: 4,
    highestBid: 2520,
    status: 'Available'
  },
  {
    id: 'crop-102',
    farmerName: 'Rameshwar Patil',
    phone: '+91 94231 87654',
    village: 'Pimpalgaon, Nashik',
    state: 'Maharashtra',
    cropName: 'Red Onion (लाल प्याज)',
    category: 'Vegetables',
    variety: 'Garwa / Gavran Red',
    quantity: 140,
    unit: 'Quintals',
    pricePerQuintal: 2350,
    mandiBenchmark: 2250,
    grade: 'Grade A (50mm+ Size)',
    isOrganic: false,
    harvestDate: 'Fresh Harvest',
    moisturePercent: '12%',
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80',
    description: 'Dry cured skin, long storage potential (up to 4 months), perfect for wholesale stockists and export traders.',
    bidsCount: 7,
    highestBid: 2300,
    status: 'Available'
  },
  {
    id: 'crop-103',
    farmerName: 'Choudhary Mahendra Patel',
    phone: '+91 98250 11223',
    village: 'Gondal, Rajkot',
    state: 'Gujarat',
    cropName: 'Organic Cotton (कपास - Shankar 6)',
    category: 'Cash Crops',
    variety: 'Bt Cotton Long Staple (29mm)',
    quantity: 60,
    unit: 'Quintals',
    pricePerQuintal: 7450,
    mandiBenchmark: 7320,
    grade: 'Grade A+ (High Ginning)',
    isOrganic: false,
    harvestDate: 'Current Picking',
    moisturePercent: '8.2%',
    image: 'https://images.unsplash.com/photo-1594498653385-d5172c532c00?auto=format&fit=crop&w=600&q=80',
    description: 'First picking bolls, bright white fiber, minimum trash content (< 2.5%), ideal for spinning mills directly.',
    bidsCount: 3,
    highestBid: 7400,
    status: 'Available'
  },
  {
    id: 'crop-104',
    farmerName: 'Gurpreet Singh Dhillon',
    phone: '+91 98144 56789',
    village: 'Nilokheri, Karnal',
    state: 'Haryana',
    cropName: '1121 Pusa Basmati Paddy (बासमती धान)',
    category: 'Grains',
    variety: 'Pusa Basmati 1121 (Golden)',
    quantity: 210,
    unit: 'Quintals',
    pricePerQuintal: 4350,
    mandiBenchmark: 4250,
    grade: 'Export Grade Extra Long',
    isOrganic: false,
    harvestDate: 'Harvest Ready',
    moisturePercent: '13.0%',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    description: 'Unmatched 8.4mm raw grain length, highly aromatic, farm-stored in dry tarpaulin sheds, direct trailer load delivery.',
    bidsCount: 9,
    highestBid: 4320,
    status: 'Available'
  },
  {
    id: 'crop-105',
    farmerName: 'Dinesh Kushwaha',
    phone: '+91 97554 99887',
    village: 'Shamshabad, Agra',
    state: 'Uttar Pradesh',
    cropName: 'Table Potato (आलू पुखराज)',
    category: 'Vegetables',
    variety: 'Kufri Pukhraj White',
    quantity: 320,
    unit: 'Quintals',
    pricePerQuintal: 1580,
    mandiBenchmark: 1540,
    grade: 'Grade A (Uniform 45mm+)',
    isOrganic: false,
    harvestDate: 'Current Digging',
    moisturePercent: '78%',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80',
    description: 'Firm unblemished tubers, zero hollow heart, bagged in fresh 50kg jute sacks ready for dispatch.',
    bidsCount: 5,
    highestBid: 1550,
    status: 'Available'
  },
  {
    id: 'crop-106',
    farmerName: 'Rajendra Solanki',
    phone: '+91 94066 33445',
    village: 'Depalpur, Indore',
    state: 'Madhya Pradesh',
    cropName: 'Yellow Soybean (सोयाबीन JS 9560)',
    category: 'Oilseeds',
    variety: 'JS 95-60 High Oil Content',
    quantity: 110,
    unit: 'Quintals',
    pricePerQuintal: 4720,
    mandiBenchmark: 4680,
    grade: 'Grade A (Clean & Bold)',
    isOrganic: false,
    harvestDate: 'Threshed Dry',
    moisturePercent: '9.8%',
    image: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=600&q=80',
    description: 'Oil content > 19.5%, mechanically fan-cleaned, zero mud pebbles, ideal for solvent extraction plants.',
    bidsCount: 2,
    highestBid: 4700,
    status: 'Available'
  }
];

export const getStoredMarketplace = () => {
  try {
    const data = localStorage.getItem('kisansetu_marketplace');
    if (data) {
      return JSON.parse(data);
    }
  } catch {
    // fallback
  }
  return initialMarketplaceListings;
};

export const saveMarketplace = (items) => {
  try {
    localStorage.setItem('kisansetu_marketplace', JSON.stringify(items));
  } catch {
    // ignore
  }
};
