const express = require('express');
const path = require('path');
const fs = require('fs');
const { Resend } = require('resend');

const app = express();
const PORT = process.env.PORT || 3001;

const RESEND_API_KEY = 're_cw1wvd7h_2bgSiDJ6YXqh23HDqEJqUnCN';
const FROM_EMAIL = 'Grace-electric@fastgrowth.top';
const TO_EMAIL = 'bret@schrader.co';

const resend = new Resend(RESEND_API_KEY);

app.use(express.json());

app.use('/demo', express.static(path.join(__dirname, 'demo')));

app.post('/api/send-enquiry', async (req, res) => {
  try {
    const {
      firstName = '',
      lastName = '',
      phone = '',
      email = '',
      zip = '',
      referral = '',
      message = '',
      appointment = '',
    } = req.body;

    const templatePath = path.join(__dirname, 'demo', 'form-mail.html');
    let template = fs.readFileSync(templatePath, 'utf-8');

    const labels = {
      firstName: 'First Name',
      lastName: 'Last Name',
      phone: 'Phone Number',
      email: 'Email Address',
      zip: 'Zip Code',
      referral: 'How Did You Hear About Us?',
      appointment: 'Book An Appointment?',
      message: 'Message',
    };

    const values = { firstName, lastName, phone, email, zip, referral, message, appointment };

    for (const [key, label] of Object.entries(labels)) {
      template = template.replace(`{{label_${key}}}`, label);
      template = template.replace(`{{value_${key}}}`, values[key] || '—');
    }

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: `New Enquiry from ${firstName} ${lastName}`,
      html: template,
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ success: false, error: error.message });
    }

    console.log('Email sent:', data?.id);
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
