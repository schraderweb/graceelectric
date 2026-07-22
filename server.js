const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || 'Grace-electric@fastgrowth.top';
const TO_EMAIL = process.env.TO_EMAIL || 'bret@schrader.co';
const RESEND_API = 'https://api.resend.com/emails';

app.use(express.json());

app.use('/demo', express.static(path.join(__dirname, 'demo')));

app.post('/api/send-enquiry', async (req, res) => {
  try {
    const {
      firstName = '', lastName = '', phone = '', email = '',
      zip = '', referral = '', message = '', appointment = '',
    } = req.body || {};

    const labels = {
      firstName: 'First Name', lastName: 'Last Name', phone: 'Phone Number',
      email: 'Email Address', zip: 'Zip Code', referral: 'How Did You Hear About Us?',
      appointment: 'Book An Appointment?', message: 'Message',
    };

    const values = { firstName, lastName, phone, email, zip, referral, message, appointment };

    const templatePath = path.join(__dirname, 'demo', 'form-mail.html');
    const fs = require('fs');
    let html = fs.readFileSync(templatePath, 'utf-8');

    for (const [key, label] of Object.entries(labels)) {
      html = html.replaceAll(`{{label_${key}}}`, label);
      html = html.replaceAll(`{{value_${key}}}`, values[key] || '\u2014');
    }

    const resendRes = await fetch(RESEND_API, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: TO_EMAIL,
        subject: `New Enquiry from ${firstName} ${lastName}`,
        html,
      }),
    });

    const resendData = await resendRes.json();

    if (!resendRes.ok) {
      console.error('Resend error:', resendData);
      return res.status(500).json({ success: false, error: resendData.error?.message || 'Failed to send' });
    }

    console.log('Email sent:', resendData?.id);
    return res.json({ success: true, message: 'Enquiry sent successfully' });
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Static files: http://localhost:${PORT}/demo/`);
  console.log(`API: http://localhost:${PORT}/api/send-enquiry`);
});
