const RESEND_API = "https://api.resend.com/emails";

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ success: false, error: "Server misconfigured - missing API key" });
  }

  const fromEmail = process.env.FROM_EMAIL || "Grace-electric@fastgrowth.top";
  const toEmails = (process.env.TO_EMAILS || "bret@schrader.co,graceelectric@hotmail.com").split(",").map(s => s.trim());

  const body = typeof req.body === "object" ? req.body : {};
  const {
    firstName = "", lastName = "", phone = "", email = "",
    zip = "", referral = "", message = "", appointment = "",
  } = body;

  const html = buildEmail(firstName, lastName, phone, email, zip, referral, message, appointment);

  try {
    const resendRes = await fetch(RESEND_API, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: toEmails,
        subject: `New Enquiry from ${firstName} ${lastName}`,
        html,
      }),
    });

    const resendData = await resendRes.json();

    if (!resendRes.ok) {
      console.error("Resend error:", resendData);
      return res.status(500).json({ success: false, error: resendData.error?.message || "Failed to send" });
    }

    return res.json({ success: true, message: "Enquiry sent successfully" });
  } catch (err) {
    console.error("Handler error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

function buildEmail(firstName, lastName, phone, email, zip, referral, message, appointment) {
  const labels = {
    firstName: "First Name", lastName: "Last Name", phone: "Phone Number",
    email: "Email Address", zip: "Zip Code", referral: "How Did You Hear About Us?",
    appointment: "Book An Appointment?", message: "Message",
  };

  const values = { firstName, lastName, phone, email, zip, referral, message, appointment };

  let html = EMAIL_TEMPLATE;
  for (const [key, label] of Object.entries(labels)) {
    html = html.replaceAll(`{{label_${key}}}`, label);
    html = html.replaceAll(`{{value_${key}}}`, values[key] || "\u2014");
  }
  return html;
}

const EMAIL_TEMPLATE = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Grace Electric \u2013 New Enquiry</title>
</head>
<body style="margin:0;padding:0;background-color:#FFFDF8;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#FFFDF8;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="700" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
          <tr>
            <td style="background:#1C1917;padding:48px 48px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;letter-spacing:-0.3px;">Grace Electric, LLC</h1>
              <p style="margin:4px 0 0;color:#A8A29E;font-size:15px;">New Customer Enquiry</p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px 48px;">
              <p style="margin:0 0 6px;color:#78716C;font-size:16px;">A new enquiry was submitted through the website. Details below:</p>
              <hr style="border:none;border-top:1px solid #E7E5E4;margin:20px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="padding:10px 0;"><strong style="color:#1C1917;font-size:16px;">{{label_firstName}}</strong></td><td style="padding:10px 0;text-align:right;color:#44403C;font-size:16px;">{{value_firstName}}</td></tr>
                <tr><td style="padding:10px 0;border-top:1px solid #F5F5F4;"><strong style="color:#1C1917;font-size:16px;">{{label_lastName}}</strong></td><td style="padding:10px 0;border-top:1px solid #F5F5F4;text-align:right;color:#44403C;font-size:16px;">{{value_lastName}}</td></tr>
                <tr><td style="padding:10px 0;border-top:1px solid #F5F5F4;"><strong style="color:#1C1917;font-size:16px;">{{label_phone}}</strong></td><td style="padding:10px 0;border-top:1px solid #F5F5F4;text-align:right;color:#44403C;font-size:16px;">{{value_phone}}</td></tr>
                <tr><td style="padding:10px 0;border-top:1px solid #F5F5F4;"><strong style="color:#1C1917;font-size:16px;">{{label_email}}</strong></td><td style="padding:10px 0;border-top:1px solid #F5F5F4;text-align:right;color:#44403C;font-size:16px;">{{value_email}}</td></tr>
                <tr><td style="padding:10px 0;border-top:1px solid #F5F5F4;"><strong style="color:#1C1917;font-size:16px;">{{label_zip}}</strong></td><td style="padding:10px 0;border-top:1px solid #F5F5F4;text-align:right;color:#44403C;font-size:16px;">{{value_zip}}</td></tr>
                <tr><td style="padding:10px 0;border-top:1px solid #F5F5F4;"><strong style="color:#1C1917;font-size:16px;">{{label_referral}}</strong></td><td style="padding:10px 0;border-top:1px solid #F5F5F4;text-align:right;color:#44403C;font-size:16px;">{{value_referral}}</td></tr>
                <tr><td style="padding:10px 0;border-top:1px solid #F5F5F4;"><strong style="color:#1C1917;font-size:16px;">{{label_appointment}}</strong></td><td style="padding:10px 0;border-top:1px solid #F5F5F4;text-align:right;color:#44403C;font-size:16px;">{{value_appointment}}</td></tr>
              </table>
              <hr style="border:none;border-top:1px solid #E7E5E4;margin:20px 0;">
              <p style="margin:0 0 8px;color:#1C1917;font-size:16px;font-weight:700;">Message</p>
              <p style="margin:0;color:#44403C;font-size:16px;line-height:1.6;background:#f8fafc;padding:20px;border-radius:8px;border-left:3px solid #F4B400;">{{value_message}}</p>
            </td>
          </tr>
          <tr>
            <td style="background:#f8fafc;padding:32px 48px;text-align:center;border-top:1px solid #E7E5E4;">
              <p style="margin:0 0 16px;color:#78716C;font-size:15px;font-style:italic;line-height:1.5;">"Quality electrical work isn't just about fixing wires, it's about powering the places where life happens."</p>
              <p style="margin:0;color:#A8A29E;font-size:14px;">Grace Electric, LLC &bull; Buckley, MI &bull; (231) 944-4519</p>
              <p style="margin:4px 0 0;color:#A8A29E;font-size:13px;">graceelectric@hotmail.com</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
