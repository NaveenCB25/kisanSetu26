import { Mandi, Crop } from './models.js';

const mandis = [
  ['mandi-khanna', 'Khanna Central Grain Market', 'Punjab', 'Ludhiana', 'Khanna'],
  ['mandi-karnal', 'Karnal Modern APMC Yard', 'Haryana', 'Karnal', 'Karnal'],
  ['mandi-bharatpur', 'Bharatpur Krishi Upaj Mandi', 'Rajasthan', 'Bharatpur', 'Bharatpur'],
  ['mandi-rajkot', 'Rajkot Marketing Yard', 'Gujarat', 'Rajkot', 'Rajkot'],
  ['mandi-indore', 'Indore Devi Ahilya APMC Mandi', 'Madhya Pradesh', 'Indore', 'Indore'],
  ['mandi-harihara', 'APMC Harihara', 'Karnataka', 'Davanagere', 'Harihar'],
];

const crops = [
  ['crop-wheat', 'Wheat'], ['crop-paddy', 'Common Paddy / Rice'], ['crop-mustard', 'Mustard'],
  ['crop-cotton', 'Cotton Medium Staple'], ['crop-chana', 'Gram / Chana'], ['crop-maize', 'Maize'],
];

export async function seedReferenceData() {
  await Promise.all(mandis.map(([code, name, state, district, taluk]) => Mandi.updateOne(
    { code }, { $setOnInsert: { code, name, state, district, taluk, active: true } }, { upsert: true },
  )));
  await Promise.all(crops.map(([code, name]) => Crop.updateOne(
    { code }, { $setOnInsert: { code, name } }, { upsert: true },
  )));
}
