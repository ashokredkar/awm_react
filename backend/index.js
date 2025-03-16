// index.js - Backend server with improved Stripe integration
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : 'http://localhost:3000',
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from React app if in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// Debug route to test API connectivity
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// API Routes
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { lineItems, success_url, cancel_url } = req.body;
    
    // Validate URLs
    if (!success_url || !cancel_url || 
        !success_url.startsWith('http') || 
        !cancel_url.startsWith('http')) {
      return res.status(400).json({ 
        error: 'Invalid URLs provided. URLs must be absolute with http/https protocol.' 
      });
    }
    
    // Validate lineItems
    if (!lineItems || !Array.isArray(lineItems) || lineItems.length === 0) {
      return res.status(400).json({ 
        error: 'No line items provided or invalid format.' 
      });
    }
    
    console.log('Creating checkout session with line items:', JSON.stringify(lineItems, null, 2));
    
    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url,
      cancel_url,
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['US', 'AU', 'IN'], // Add countries as needed
      }
    });

    console.log('Checkout session created:', session.id);
    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Stripe session creation error:', error);
    console.error('Error details:', {
      message: error.message,
      type: error.type,
      param: error.param,
      code: error.code
    });
    res.status(500).json({ error: error.message });
  }
});

// Webhook to handle Stripe events (optional but recommended)
app.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log(`Payment successful for session: ${session.id}`);
    // Here you would typically update your database
  }

  res.status(200).json({ received: true });
});

// Serve React app for any other routes in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});