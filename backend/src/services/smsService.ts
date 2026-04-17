import twilio from 'twilio';

// Format phone to E.164 (+91XXXXXXXXXX)
export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('91') && digits.length === 12) return `+${digits}`;
  if (digits.length === 10) return `+91${digits}`;
  return `+${digits}`;
}

export interface SmsResult {
  success: boolean;
  sid?: string;
  error?: string;
  phone: string;
  timestamp: Date;
}

export async function sendSms(phone: string, message: string): Promise<SmsResult> {
  const timestamp = new Date();
  const formattedPhone = formatPhone(phone);

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    console.error(`[SMS] Twilio credentials missing`);
    return { success: false, error: 'Twilio credentials not configured', phone: formattedPhone, timestamp };
  }

  try {
    const client = twilio(accountSid, authToken);
    const result = await client.messages.create({
      body: message,
      from: fromNumber,
      to: formattedPhone,
    });
    console.log(`[SMS] ✓ Sent to ${formattedPhone} | SID: ${result.sid} | ${timestamp.toISOString()}`);
    return { success: true, sid: result.sid, phone: formattedPhone, timestamp };
  } catch (err: any) {
    console.error(`[SMS] ✗ Failed to ${formattedPhone} | ${err.message} | ${timestamp.toISOString()}`);
    return { success: false, error: err.message, phone: formattedPhone, timestamp };
  }
}

// Message templates
export function getReminderMessage(name: string, expiryDate: Date, daysLeft: number): string {
  const dateStr = expiryDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  if (daysLeft === 7) return `Hi ${name}, your gym plan will expire on ${dateStr}. Renew soon to continue your training. 💪`;
  if (daysLeft === 2) return `Hi ${name}, your gym plan is expiring in 2 days on ${dateStr}. Please renew to keep your progress going! 🏋️`;
  return `Hi ${name}, your gym plan has expired today. Contact us to renew and continue your fitness journey. 🔥`;
}
