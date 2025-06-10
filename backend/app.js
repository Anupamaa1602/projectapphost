// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// require('dotenv').config();
// require('./db/connection');

// const adminroutes=require('./routes/adminRoutes')
// const eventroutes=require('./routes/eventRoutes')
// const loginroutes=require('./routes/loginRoutes')
// const app = express();

// app.use(express.json());
// app.use(cors());

// app.use('/admin',adminroutes)
// app.use('/event',eventroutes)
// app.use('/log',loginroutes)
// const PORT = 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// const Stripe = require('stripe');
const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const adminroutes=require('./routes/adminRoutes')
const eventroutes=require('./routes/eventRoutes')
require ('dotenv').config()
require('./db/connection')
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(cors());
app.use(express.json());


app.use('/auth', authRoutes);
app.use('/admin',adminroutes);
app.use('/event',eventroutes)

app.use('/', paymentRoutes);




const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
