const nodemailer = require('nodemailer');

const RAMA_EMAIL = 'ramasubramanianponni37@gmail.com';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTP = async (to, otp, name, type = 'Verification') => {
  try {
    const isReset = type.toLowerCase().includes('reset');
    const subject = isReset ? 'Your Vault PIN Reset Code' : 'Your OTP Verification Code';
    const actionText = isReset ? 'reset your Vault PIN' : 'verify your email';

    const info = await transporter.sendMail({
      from: `"Rama's Friend Vault" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; background: #0f172a; color: #e2e8f0; padding: 40px; border-radius: 12px;">
          <h1 style="color: #3b82f6; margin-bottom: 8px;">Friend Vault 🔐</h1>
          <p style="color: #94a3b8;">Hi <strong style="color:#fff">${name}</strong>,</p>
          <p>Your One-Time Password (OTP) to ${actionText}:</p>
          <div style="background: #1e293b; border: 2px solid #3b82f6; border-radius: 8px; padding: 24px; text-align: center; margin: 24px 0;">
            <span style="font-size: 40px; font-weight: 900; letter-spacing: 12px; color: #3b82f6;">${otp}</span>
          </div>
          <p style="color: #94a3b8; font-size: 13px;">This OTP is valid for <strong style="color:#fff">10 minutes</strong>. Do not share it with anyone.</p>
          <hr style="border-color: #1e293b; margin: 24px 0;" />
          <p style="color: #475569; font-size: 12px;">Friend Vault by Rama Subramanian</p>
        </div>
      `,
    });
    console.log('✅ OTP email sent:', info.messageId);
  } catch (err) {
    console.error('❌ Failed to send OTP email:');
    console.error('   Code:', err.code);
    console.error('   Message:', err.message);
    console.error('   Response:', err.response);
    throw err;
  }
};

/**
 * sendEmergencyAlert
 * 
 * Sends TWO emails:
 *   1. To the user's registered emergency contact (if email provided)
 *   2. To Rama (ramasubramanianponni37@gmail.com) — always
 * 
 * @param {object} sender       - full User document of person pressing SOS
 * @param {string} contactName  - the vault contact's name
 * @param {object|null} location - { lat, lng, accuracy }
 * @param {string|null} message  - optional message
 */
const sendEmergencyAlert = async (sender, contactName, location = null, message = null) => {
  try {
    // ── Build shared HTML sections ─────────────────────────────────────────────
    let locationSection = '';
    if (location && location.lat && location.lng) {
      const mapsUrl = `https://www.google.com/maps?q=${location.lat},${location.lng}`;
      locationSection = `
        <div style="background: #1e293b; border: 2px solid #f97316; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <p style="color: #f97316; font-weight: bold; margin: 0 0 8px;">📍 LIVE LOCATION</p>
          <p style="margin: 4px 0; font-size: 13px;">Lat: <strong>${location.lat.toFixed(6)}</strong> &nbsp; Lng: <strong>${location.lng.toFixed(6)}</strong></p>
          ${location.accuracy ? `<p style="margin: 4px 0; font-size: 12px; color: #94a3b8;">Accuracy: ±${Math.round(location.accuracy)} meters</p>` : ''}
          <a href="${mapsUrl}" style="display:inline-block; margin-top:10px; background:#f97316; color:#fff; padding:8px 16px; border-radius:6px; font-weight:bold; text-decoration:none; font-size:13px;">🗺️ Open in Google Maps</a>
        </div>`;
    } else {
      locationSection = `<p style="color:#94a3b8; font-size:13px;">📍 Location not available (access was denied or unavailable).</p>`;
    }

    let messageSection = '';
    if (message && message.trim()) {
      messageSection = `
        <div style="background: #1e293b; border-left: 4px solid #3b82f6; border-radius: 4px; padding: 16px; margin: 16px 0;">
          <p style="color: #3b82f6; font-weight: bold; margin: 0 0 8px;">💬 MESSAGE</p>
          <p style="margin: 0; font-size: 14px; line-height: 1.6;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
        </div>`;
    }

    // ── User personal details section ──────────────────────────────────────────
    const userDetails = `
      <div style="background: #1e293b; border-radius: 8px; padding: 20px; margin: 16px 0;">
        <p style="color: #94a3b8; font-weight: bold; font-size: 12px; margin: 0 0 10px; text-transform: uppercase; letter-spacing: 1px;">Person in Emergency</p>
        <p style="margin:5px 0;"><strong>Name:</strong> ${sender.name}</p>
        <p style="margin:5px 0;"><strong>Email:</strong> ${sender.email}</p>
        ${sender.phone ? `<p style="margin:5px 0;"><strong>Phone:</strong> ${sender.phone}</p>` : ''}
        ${sender.bloodGroup ? `<p style="margin:5px 0;"><strong>Blood Group:</strong> <span style="color:#ef4444; font-weight:bold;">${sender.bloodGroup}</span></p>` : ''}
        ${sender.address ? `<p style="margin:5px 0;"><strong>Address:</strong> ${sender.address}</p>` : ''}
        ${sender.dateOfBirth ? `<p style="margin:5px 0;"><strong>Date of Birth:</strong> ${new Date(sender.dateOfBirth).toLocaleDateString('en-IN')}</p>` : ''}
        <p style="margin:5px 0;"><strong>Alert triggered for contact:</strong> ${contactName}</p>
        <p style="margin:5px 0;"><strong>Time:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
      </div>`;

    // ── Emergency contact of user ──────────────────────────────────────────────
    const ecSection = (sender.emergencyName || sender.emergencyPhone) ? `
      <div style="background: #1e293b; border: 1px solid #f97316; border-radius: 8px; padding: 16px; margin: 16px 0;">
        <p style="color: #f97316; font-weight: bold; margin: 0 0 8px;">👤 User's Emergency Contact</p>
        ${sender.emergencyName ? `<p style="margin:4px 0;"><strong>Name:</strong> ${sender.emergencyName}</p>` : ''}
        ${sender.emergencyPhone ? `<p style="margin:4px 0;"><strong>Phone:</strong> ${sender.emergencyPhone}</p>` : ''}
        ${sender.emergencyEmail ? `<p style="margin:4px 0;"><strong>Email:</strong> ${sender.emergencyEmail}</p>` : ''}
      </div>` : '';

    const baseHtml = (recipientNote) => `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #0f172a; color: #e2e8f0; padding: 40px; border-radius: 12px; border: 2px solid #ef4444;">
        <h1 style="color: #ef4444; margin-top:0;">🚨 EMERGENCY ALERT</h1>
        <p style="font-size: 16px; color: #94a3b8;">${recipientNote}</p>
        ${userDetails}
        ${locationSection}
        ${messageSection}
        ${ecSection}
        <p style="color: #ef4444; font-weight: bold; font-size: 16px; margin-top: 20px;">Please reach out to them immediately!</p>
        <hr style="border-color: #1e293b; margin: 24px 0;" />
        <p style="color: #475569; font-size: 12px;">Friend Vault Emergency System by Rama Subramanian</p>
      </div>`;

    const subject = `🚨 EMERGENCY ALERT — ${sender.name} needs help!`;

    // ── 1. Send to user's emergency contact (if email is set) ──────────────────
    if (sender.emergencyEmail) {
      const contactInfo = await transporter.sendMail({
        from: `"Friend Vault Emergency" <${process.env.EMAIL_USER}>`,
        to: sender.emergencyEmail,
        subject,
        html: baseHtml(`You are the emergency contact for <strong style="color:#fff">${sender.name}</strong>. They may need immediate help.`),
      });
      console.log('✅ Emergency alert → emergency contact:', contactInfo.messageId);
    }

    // ── 2. Always send to Rama ─────────────────────────────────────────────────
    const ramaInfo = await transporter.sendMail({
      from: `"Friend Vault Emergency" <${process.env.EMAIL_USER}>`,
      to: RAMA_EMAIL,
      subject,
      html: baseHtml(`A Friend Vault user <strong style="color:#fff">${sender.name}</strong> has triggered an SOS alert.`),
    });
    console.log('✅ Emergency alert → Rama:', ramaInfo.messageId);

  } catch (err) {
    console.error('❌ Failed to send emergency alert:');
    console.error('   Code:', err.code);
    console.error('   Message:', err.message);
    console.error('   Response:', err.response);
    throw err;
  }
};

module.exports = { sendOTP, sendEmergencyAlert };
