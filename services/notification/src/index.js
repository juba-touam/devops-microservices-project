const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/notification_db';

app.use(cors());
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

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.get('/api/health', (req, res) => {
  res.json({ status: 'UP', service: 'notification' });
});

app.post('/api/notifications', async (req, res) => {
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
  console.log(`[NOTIFICATION] Payment ${paymentId} - ${amount} ${currency} - ${status}`);

  const result = notification.toObject();
  result.id = result._id;
  delete result._id;
  delete result.__v;

  res.status(201).json(result);
});

app.get('/api/notifications', async (req, res) => {
  const notifications = await Notification.find({}).lean();
  const result = notifications.map(n => {
    n.id = n._id;
    delete n._id;
    delete n.__v;
    return n;
  });
  res.json(result);
});

app.listen(PORT, () => {
  console.log(`Notification service running on port ${PORT}`);
});
