const { onRequest, onCall, HttpsError } = require("firebase-functions/https");
const nodemailer = require('nodemailer');
const cors = require('cors')({ origin: ['https://daruimrenastere.ro', 'https://daruim-renastere.web.app', 'http://localhost:5000'] });
const admin = require('firebase-admin');
admin.initializeApp();

const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.eu',
  port: 465,
  secure: true,
  auth: {
    user: 'contact@daruimrenastere.ro',
    pass: process.env.EMAIL_PASSWORD,
  },
});

async function verifyTurnstile(token) {
  try {
    const verifyResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET,
        response: token
      }),
    });

    const verification = await verifyResponse.json();
    return verification.success;
  } catch (err) {
    console.error('Eroare verificare Turnstile:', err);
    return false;
  }
}

exports.sendContactEmail = onRequest({ secrets: ['EMAIL_PASSWORD', 'TURNSTILE_SECRET'] }, (req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Metoda nu este permisă' });
    }

    const { name, email, phone, hasDoTerraAccount, message, turnstile} = req.body;

    const isHuman = await verifyTurnstile(turnstile);
    if (!isHuman) {
      return res.status(400).json({ error: 'Verificare Turnstile eșuată' });
    }

    if (!name || !email || !hasDoTerraAccount || !message || !turnstile) {
      return res.status(400).json({ error: 'Toate câmpurile sunt obligatorii' });
    }

    const mailOptions = {
      from: 'contact@daruimrenastere.ro',
      to: 'contact@daruimrenastere.ro',
      replyTo: email,
      subject: `Mesaj nou de la ${name}`,
      text: `Nume: ${name}\nE-mail: ${email}\nTelefon: ${phone || 'Nu a fost furnizat'}\nAre cont doTERRA: ${hasDoTerraAccount === 'yes' ? 'Da' : 'Nu'}\nMesaj: ${message}`,
      html: `
        <h2>Mesaj nou de la ${name}</h2>
        <p><strong>E-mail:</strong> ${email}</p>
        <p><strong>Telefon:</strong> ${phone || 'Nu a fost furnizat'}</p>
        <p><strong>Are cont doTERRA:</strong> ${hasDoTerraAccount === 'yes' ? 'Da' : 'Nu'}</p>
        <p><strong>Mesaj:</strong> ${message}</p>
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

exports.sendSamplesEmail = onRequest({ secrets: ['EMAIL_PASSWORD', 'TURNSTILE_SECRET'] }, (req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Metoda nu este permisă' });
    }

    const { name, email, phone, city, turnstile } = req.body;

    const isHuman = await verifyTurnstile(turnstile);
    if (!isHuman) {
      return res.status(400).json({ error: 'Verificare Turnstile eșuată' });
    }

    if (!name || !email || !phone || !city || !turnstile) {
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

// Funcție temporară pentru a seta adminul
// exports.setInitialAdmin = onRequest(async (req, res) => {
//   const email = 'sitedaruimrenastere@gmail.com';
//   try {
//     const user = await admin.auth().getUserByEmail(email);
//     await admin.auth().setCustomUserClaims(user.uid, { admin: true });
//     res.status(200).send(`Utilizatorul ${email} a fost setat ca admin.`);
//   } catch (error) {
//     res.status(500).send(`Eroare: ${error.message}`);
//   }
// });

exports.setAdminRole = onCall(async (data, context) => {
  // Verifică dacă cel care face cererea este autentificat și are rol de admin
  if (!context.auth) {
    throw new HttpsError('unauthenticated', 'Trebuie să fii autentificat.');
  }

  if (!context.auth.token.admin) {
    throw new HttpsError('permission-denied', 'Doar adminii pot seta alți admini.');
  }

  const email = data.email;
  if (!email) {
    throw new HttpsError('invalid-argument', 'Email-ul este obligatoriu.');
  }

  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    return { message: `Utilizatorul ${email} a fost setat ca admin.` };
  } catch (error) {
    throw new HttpsError('internal', `Eroare la setarea rolului de admin: ${error.message}`);
  }
});