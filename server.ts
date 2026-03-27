import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.post('/api/send-otp', async (req, res) => {
    const { contact, otp, type } = req.body;

    if (!contact || !otp) {
      return res.status(400).json({ error: 'Contact and OTP are required' });
    }

    console.log(`[OTP SERVICE] Sending ${type} OTP ${otp} to ${contact}`);

    // Email OTP
    if (type === 'email' || contact.includes('@')) {
      const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;

      if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
        console.warn('[OTP SERVICE] SMTP not configured. OTP logged to console only.');
        return res.json({ 
          success: true, 
          message: 'OTP generated (Simulated: SMTP not configured)',
          simulated: true 
        });
      }

      try {
        const transporter = nodemailer.createTransport({
          host: SMTP_HOST,
          port: parseInt(SMTP_PORT || '587'),
          secure: SMTP_PORT === '465',
          auth: {
            user: SMTP_USER,
            pass: SMTP_PASS,
          },
        });

        await transporter.sendMail({
          from: SMTP_FROM || SMTP_USER,
          to: contact,
          subject: 'Your HealthVault Verification Code',
          text: `Your verification code is: ${otp}. This code will expire in 10 minutes.`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
              <h2 style="color: #0066ff; text-align: center;">HealthVault Verification</h2>
              <p>Hello,</p>
              <p>You requested a password reset for your HealthVault account. Please use the following 6-digit code to verify your identity:</p>
              <div style="background: #f0f7ff; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #0066ff; border-radius: 8px; margin: 20px 0;">
                ${otp}
              </div>
              <p>This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
              <p style="font-size: 12px; color: #666; text-align: center;">&copy; 2026 HealthVault. All rights reserved.</p>
            </div>
          `,
        });

        console.log(`[OTP SERVICE] Email sent successfully to ${contact}`);
        return res.json({ success: true, message: 'OTP sent to email' });
      } catch (error: any) {
        console.error('[OTP SERVICE] Error sending email:', error);
        return res.status(500).json({ error: 'Failed to send email OTP', details: error.message });
      }
    }

    // Phone OTP (SMS)
    if (type === 'phone' || /^\+?[1-9]\d{1,14}$/.test(contact)) {
      const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } = process.env;

      if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
        console.warn('[OTP SERVICE] Twilio not configured. OTP logged to console only.');
        return res.json({ 
          success: true, 
          message: 'OTP generated (Simulated: Twilio not configured)',
          simulated: true 
        });
      }

      // We'll use a dynamic import for twilio to avoid issues if not installed
      try {
        const twilio = (await import('twilio')).default;
        const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

        await client.messages.create({
          body: `Your HealthVault verification code is: ${otp}`,
          from: TWILIO_PHONE_NUMBER,
          to: contact,
        });

        console.log(`[OTP SERVICE] SMS sent successfully to ${contact}`);
        return res.json({ success: true, message: 'OTP sent via SMS' });
      } catch (error: any) {
        console.error('[OTP SERVICE] Error sending SMS:', error);
        return res.status(500).json({ error: 'Failed to send SMS OTP', details: error.message });
      }
    }

    return res.status(400).json({ error: 'Invalid contact format' });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
