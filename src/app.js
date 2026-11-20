const express = require('express');
const { SERVICES, calculateQuote, findService } = require('./pricing');

const app = express();
app.use(express.json());

let quotes = [];
let nextId = 1;

function resetStore() {
  quotes = [];
  nextId = 1;
}

function validateQuoteRequest(body = {}) {
  const errors = [];
  if (typeof body.customerName !== 'string' || body.customerName.trim() === '') {
    errors.push('customerName is required');
  }
  if (!findService(body.serviceId)) {
    errors.push('serviceId must be one of: ' + SERVICES.map((s) => s.id).join(', '));
  }
  if (!Number.isFinite(body.squareFeet) || body.squareFeet <= 0) {
    errors.push('squareFeet must be a positive number');
  }
  return errors;
}

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/services', (req, res) => {
  res.json(SERVICES);
});

app.post('/quotes', (req, res) => {
  const errors = validateQuoteRequest(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  try {
    const { serviceId, squareFeet } = req.body;
    const result = calculateQuote(serviceId, squareFeet);
    const quote = {
      id: nextId++,
      customerName: req.body.customerName.trim(),
      ...result,
      createdAt: new Date().toISOString(),
    };
    quotes.push(quote);
    return res.status(201).json(quote);
  } catch (err) {
    return res.status(400).json({ errors: [err.message] });
  }
});

app.get('/quotes/:id', (req, res) => {
  const quote = quotes.find((q) => q.id === Number(req.params.id));
  if (!quote) {
    return res.status(404).json({ error: 'Quote not found' });
  }
  return res.json(quote);
});

module.exports = { app, resetStore };