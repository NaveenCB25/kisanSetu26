export const weatherData = {
  location: {
    city: 'Ludhiana / Karnal Agri Belt',
    region: 'North India Plains',
    station: 'Agro-Met Automated Station',
    elevation: '247m ASL'
  },
  current: {
    temp: 29,
    condition: 'Partly Sunny & Dry',
    humidity: 48, // percentage
    windSpeed: 8, // km/h
    windDirection: 'North-West (NW)',
    rainProbability: 5, // percentage
    uvIndex: 6,
    dewPoint: '16°C',
    soilMoisture: 'Optimal (62%)'
  },
  agroAdvisory: {
    severity: 'favorable', // 'warning', 'favorable', 'danger'
    title: 'Ideal Window for Foliar Spray & Harvesting',
    description: 'Current wind speeds under 10 km/h with dry canopy. Excellent time for nutrient sprays, pesticide applications, and mechanical threshing. No rain threat for next 72 hours.',
    sprayStatus: 'Highly Recommended (Low Drift Risk)',
    irrigationAdvice: 'Irrigate evening hours only to minimize evaporation losses.'
  },
  forecast: [
    {
      day: 'Today',
      date: 'Sat, 10 Oct',
      maxTemp: 31,
      minTemp: 19,
      condition: 'Sunny',
      rainProb: 0,
      icon: 'sun',
      wind: '8 km/h'
    },
    {
      day: 'Sunday',
      date: '11 Oct',
      maxTemp: 32,
      minTemp: 20,
      condition: 'Clear Sky',
      rainProb: 5,
      icon: 'sun',
      wind: '9 km/h'
    },
    {
      day: 'Monday',
      date: '12 Oct',
      maxTemp: 30,
      minTemp: 18,
      condition: 'Partly Cloudy',
      rainProb: 15,
      icon: 'cloud',
      wind: '12 km/h'
    },
    {
      day: 'Tuesday',
      date: '13 Oct',
      maxTemp: 28,
      minTemp: 17,
      condition: 'Light Breezy Shower',
      rainProb: 40,
      icon: 'cloud-rain',
      wind: '18 km/h'
    },
    {
      day: 'Wednesday',
      date: '14 Oct',
      maxTemp: 27,
      minTemp: 16,
      condition: 'Clear & Fresh',
      rainProb: 10,
      icon: 'sun',
      wind: '11 km/h'
    }
  ],
  hourly: [
    { time: '06:00', temp: 20, rain: 0, wind: '5 km/h' },
    { time: '09:00', temp: 24, rain: 0, wind: '7 km/h' },
    { time: '12:00', temp: 29, rain: 0, wind: '8 km/h' },
    { time: '15:00', temp: 31, rain: 5, wind: '10 km/h' },
    { time: '18:00', temp: 26, rain: 0, wind: '6 km/h' },
    { time: '21:00', temp: 22, rain: 0, wind: '4 km/h' }
  ]
};
