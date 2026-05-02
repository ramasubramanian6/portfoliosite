const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTP = async (to, otp, name) => {
  try {
    const info = await transporter.sendMail({
      from: `"Rama's Friend Vault" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Your OTP Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; background: #0f172a; color: #e2e8f0; padding: 40px; border-radius: 12px;">
          <h1 style="color: #3b82f6; margin-bottom: 8px;">Friend Vault 🔐</h1>
          <p style="color: #94a3b8;">Hi <strong style="color:#fff">${name}</strong>,</p>
          <p>Your One-Time Password (OTP) to verify your email:</p>
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
    throw err; // Re-throw so the route returns a proper 500
  }
};

const sendEmergencyAlert = async (friendName, senderName, senderEmail, location = null, message = null) => {
  try {
    // Build location section
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

    // Build message section
    let messageSection = '';
    if (message && message.trim()) {
      messageSection = `
        <div style="background: #1e293b; border-left: 4px solid #3b82f6; border-radius: 4px; padding: 16px; margin: 16px 0;">
          <p style="color: #3b82f6; font-weight: bold; margin: 0 0 8px;">💬 MESSAGE FROM USER</p>
          <p style="margin: 0; font-size: 14px; line-height: 1.6;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
        </div>`;
    }

    const info = await transporter.sendMail({
      from: `"Friend Vault Emergency" <${process.env.EMAIL_USER}>`,
      to: process.env.OWNER_EMAIL || process.env.EMAIL_USER,
      subject: `🚨 EMERGENCY ALERT — ${friendName} needs help!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #0f172a; color: #e2e8f0; padding: 40px; border-radius: 12px; border: 2px solid #ef4444;">
          <h1 style="color: #ef4444; margin-top:0;">🚨 EMERGENCY ALERT</h1>
          <p style="font-size: 18px;">Your friend <strong style="color:#fff; font-size: 22px;">${friendName}</strong> may be in an emergency situation!</p>
          <div style="background: #1e293b; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <p style="margin:6px 0;"><strong>Friend:</strong> ${friendName}</p>
            <p style="margin:6px 0;"><strong>Alert sent by:</strong> ${senderName}</p>
            <p style="margin:6px 0;"><strong>User email:</strong> ${senderEmail}</p>
            <p style="margin:6px 0;"><strong>Time:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
          </div>
          ${locationSection}
          ${messageSection}
          <p style="color: #ef4444; font-weight: bold; font-size: 16px;">Please contact them immediately!</p>
          <hr style="border-color: #1e293b; margin: 24px 0;" />
          <p style="color: #475569; font-size: 12px;">Friend Vault Emergency System by Rama Subramanian</p>
        </div>
      `,
    });
    console.log('✅ Emergency alert sent:', info.messageId);
  } catch (err) {
    console.error('❌ Failed to send emergency alert:');
    console.error('   Code:', err.code);
    console.error('   Message:', err.message);
    console.error('   Response:', err.response);
    throw err;
  }
};

module.exports = { sendOTP, sendEmergencyAlert };
