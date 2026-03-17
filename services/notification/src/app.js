const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.disable('x-powered-by');

const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:4200,http://localhost:8080').split(',');
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

const notificationSchema = new mongoose.Schema({
  type: String,
  paymentId: String,
  amount: Number,
  currency: String,
  status: String,
  description: String,
  items: [mongoose.Schema.Types.Mixed],
  createdAt: { type: String, default: () => new Date().toISOString() }
});

const Notification = mongoose.model('Notification', notificationSchema);

function formatNotification(doc) {
  const obj = typeof doc.toObject === 'function' ? doc.toObject() : { ...doc };
  obj.id = obj._id;
  delete obj._id;
  delete obj.__v;
  return obj;
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'UP', service: 'notification' });
});

app.post('/api/notifications', async (req, res, next) => {
  try {
    const { id: paymentId, amount, currency, status, description, items } = req.body;

    const notification = new Notification({
      type: 'payment',
      paymentId,
      amount,
      currency,
      status,
      description,
      items
    });

    await notification.save();
    console.log('[NOTIFICATION] Payment received - %s %s - %s', amount, currency, status);

    res.status(201).json(formatNotification(notification));
  } catch (err) {
    next(err);
  }
});

app.get('/api/notifications', async (req, res, next) => {
  try {
    const notifications = await Notification.find({}).lean();
    res.json(notifications.map(formatNotification));
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, _next) => {
  console.error('[ERROR]', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = { app, Notification, formatNotification };
