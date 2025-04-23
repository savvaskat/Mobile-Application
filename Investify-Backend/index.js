const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const tradeRoutes = require('./routes/trades');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(authRoutes);
app.use(profileRoutes);
app.use(tradeRoutes);

mongoose.connect('mongodb://127.0.0.1:27017/investify', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
  // ADD YOUR IP ADDRESS BELOW
  console.log('Server running on http://192.168.X.X:3000');
});
