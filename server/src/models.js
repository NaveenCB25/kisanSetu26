import mongoose from 'mongoose';

const { Schema, model } = mongoose;
const location = { state: String, district: String, taluk: String, village: String };
const userSchema = new Schema({
  name: { type: String, required: true, trim: true }, email: { type: String, trim: true, lowercase: true, sparse: true, unique: true },
  phone: { type: String, required: true, trim: true, unique: true }, password: { type: String, required: true, select: false },
  role: { type: String, enum: ['admin', 'staff', 'farmer'], default: 'farmer' }, status: { type: String, default: 'Active' },
  designation: String, location, fcmTokens: [{ token: String, updatedAt: { type: Date, default: Date.now } }]
}, { timestamps: true });
const mandiSchema = new Schema({ name: { type: String, required: true }, code: { type: String, unique: true, sparse: true }, ...location, active: { type: Boolean, default: true }, capacity: Number }, { timestamps: true });
const cropSchema = new Schema({ name: { type: String, required: true, unique: true }, code: { type: String, unique: true, sparse: true }, season: String, unit: { type: String, default: 'quintal' } }, { timestamps: true });
const mspRateSchema = new Schema({ crop: { type: Schema.Types.ObjectId, ref: 'Crop', required: true }, rate: { type: Number, required: true }, season: String, dailyQuotaPerFarmerQtl: Number, active: { type: Boolean, default: true } }, { timestamps: true });
const bookingSchema = new Schema({
  farmer: { type: Schema.Types.ObjectId, ref: 'User', required: true }, mandi: { type: Schema.Types.ObjectId, ref: 'Mandi', required: true }, crop: { type: Schema.Types.ObjectId, ref: 'Crop' },
  tokenNumber: { type: String, unique: true }, vehicleNumber: { type: String, required: true, uppercase: true }, vehicleType: String, estimatedQuantityQtl: { type: Number, required: true, min: 0.01 },
  scheduledDate: { type: Date, required: true }, scheduledSlot: { type: String, required: true }, location,
  status: { type: String, enum: ['PENDING', 'SCHEDULED', 'APPROVED', 'REJECTED', 'CANCELLED', 'IN_YARD', 'CALLED', 'AT_WEIGHBRIDGE', 'COMPLETED'], default: 'PENDING' },
  currentBay: String, rejectionReason: String, history: [{ status: String, note: String, by: { type: Schema.Types.ObjectId, ref: 'User' }, at: { type: Date, default: Date.now } }]
}, { timestamps: true });
const procurementSchema = new Schema({ booking: { type: Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true }, grossWeightKg: Number, tareWeightKg: Number, netWeightKg: Number, moisturePercent: Number, mspRate: Number, totalPayableAmount: Number, status: { type: String, default: 'COMPLETED' }, paymentStatus: { type: String, default: 'QUEUED' } }, { timestamps: true });
const notificationSchema = new Schema({ user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, title: String, body: String, type: String, booking: { type: Schema.Types.ObjectId, ref: 'Booking' }, readAt: Date }, { timestamps: true });
const paymentSchema = new Schema({ procurement: { type: Schema.Types.ObjectId, ref: 'Procurement' }, user: { type: Schema.Types.ObjectId, ref: 'User' }, amount: Number, status: { type: String, default: 'QUEUED' }, reference: String }, { timestamps: true });
export const User = model('User', userSchema); export const Mandi = model('Mandi', mandiSchema); export const Crop = model('Crop', cropSchema); export const MSPRate = model('MSPRate', mspRateSchema); export const Booking = model('Booking', bookingSchema); export const Procurement = model('Procurement', procurementSchema); export const Notification = model('Notification', notificationSchema); export const Payment = model('Payment', paymentSchema);
