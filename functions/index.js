const { onRequest } = require("firebase-functions/https");
const nodemailer = require('nodemailer');
const cors = require('cors')({ origin: ['https://daruimrenastere.ro', 'https://daruim-renastere.web.app', 'http://localhost:5000'] });

const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.eu',
  port: 465,
  secure: true,
  auth: {
    user: 'contact@daruimrenastere.ro',
    pass: process.env.EMAIL_PASSWORD,
  },
});

exports.sendSamplesEmail = onRequest({ secrets: ['EMAIL_PASSWORD', 'TURNSTILE_SECRET'] }, (req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Metoda nu este permisă' });
    }

    const { name, email, phone, city, turnstile } = req.body;

    if (!turnstile) {
      return res.status(400).json({ error: 'Verificare Turnstile lipsă' });
    }

    const verifyResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET,
        response: turnstile
      }),
    });

    const verification = await verifyResponse.json();

    if (!verification.success) {
      return res.status(400).json({ error: 'Verificare Turnstile eșuată' });
    }

    if (!name || !email || !phone || !city) {
      return res.status(400).json({ error: 'Toate câmpurile sunt obligatorii' });
    }

    const mailOptions = {
      from: 'contact@daruimrenastere.ro',
      to: 'contact@daruimrenastere.ro',
      replyTo: email,
      subject: `Cerere mostre de la ${name}`,
      text: `Nume: ${name}\nE-mail: ${email}\nTelefon: ${phone}\nLocalitate: ${city}`,
      html: `
        <h2>Cerere nouă pentru mostre</h2>
        <p><strong>Nume:</strong> ${name}</p>
        <p><strong>E-mail:</strong> ${email}</p>
        <p><strong>Telefon:</strong> ${phone}</p>
        <p><strong>Localitate:</strong> ${city}</p>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'Mesaj trimis cu succes!' });
    } catch (error) {
      console.error('Eroare la trimiterea e-mailului:', error);
      res.status(500).json({ error: 'Eroare la trimiterea e-mailului', details: error.message });
    }
  });
});