const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN || 'my_verify_token';

// Health
app.get('/', (req, res) => res.send('WhatsApp webhook running'));

// Verification endpoint called by Meta during webhook setup
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('Webhook verified');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Receive messages/events
app.post('/webhook', (req, res) => {
  console.log('Webhook event:', JSON.stringify(req.body).slice(0,2000));
  // Always respond 200 quickly
  res.sendStatus(200);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Server listening on', port));
