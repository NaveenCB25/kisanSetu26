import admin from 'firebase-admin';
import { User } from './models.js';

let enabled = false;
if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
  admin.initializeApp({ credential: admin.credential.cert({ projectId: process.env.FIREBASE_PROJECT_ID, clientEmail: process.env.FIREBASE_CLIENT_EMAIL, privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') }) });
  enabled = true;
}
export async function sendPush(userId, payload) {
  if (!enabled) return { skipped: true };
  const user = await User.findById(userId).select('fcmTokens'); const tokens = user?.fcmTokens?.map((item) => item.token) || [];
  if (!tokens.length) return { skipped: true };
  const result = await admin.messaging().sendEachForMulticast({ tokens, notification: { title: payload.title, body: payload.body }, data: { type: payload.type || 'system', bookingId: String(payload.booking || '') } });
  const invalid = result.responses.flatMap((response, index) => !response.success && ['messaging/registration-token-not-registered', 'messaging/invalid-registration-token'].includes(response.error?.code) ? [tokens[index]] : []);
  if (invalid.length) await User.updateOne({ _id: userId }, { $pull: { fcmTokens: { token: { $in: invalid } } } });
  return result;
}
