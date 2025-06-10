

import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from '../components/CheckoutForm';

// const stripePromise = loadStripe('pk_test_51RVXWGP0OnPV991wNGaAZMVZ8i8kEpR5VRiv88qyFk773Wtap4O0F7edJv55mtBZu9iVopBcnCKoKa3at2nGt2ft009gHLkx4U');
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
const Payment = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default Payment;







// import React, { useState } from 'react';
// import axiosInstance from '../axiosinterceptor'; // Custom Axios with token interceptor
// import {
//   CardElement,
//   useStripe,
//   useElements,
//   Elements,
// } from '@stripe/react-stripe-js';
// import { loadStripe } from '@stripe/stripe-js';

// // ✅ Replace with your actual publishable key
// const stripePromise = loadStripe('pk_test_51RVXWGP0OnPV991wNGaAZMVZ8i8kEpR5VRiv88qyFk773Wtap4O0F7edJv55mtBZu9iVopBcnCKoKa3at2nGt2ft009gHLkx4U');

// const CheckoutForm = () => {
//   const stripe = useStripe();
//   const elements = useElements();
//   const [amount, setAmount] = useState(500); // Default: ₹5
//   const [message, setMessage] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handlePayment = async (e) => {
//     e.preventDefault();
//     setMessage('');
//     setLoading(true);

//     try {
//       const { data } = await axiosInstance.post('/payment/create-payment-intent', {
//         amount,
//       });

//       const result = await stripe.confirmCardPayment(data.clientSecret, {
//         payment_method: {
//           card: elements.getElement(CardElement),
//         },
//       });

//       if (result.error) {
//         setMessage(result.error.message);
//       } else if (result.paymentIntent.status === 'succeeded') {
//         setMessage('✅ Payment successful!');
//       }
//     } catch (err) {
//       console.error(err);
//       setMessage('❌ Payment failed. Please try again.');
//     }

//     setLoading(false);
//   };

//   return (
//     <form onSubmit={handlePayment} style={{ maxWidth: '400px', margin: 'auto' }}>
//       <h2>Make a Payment</h2>

//       <label>
//         Amount (₹):
//         <input
//           type="number"
//           value={amount}
//           onChange={(e) => setAmount(e.target.value)}
//           min="1"
//           required
//         />
//       </label>

//       <div style={{ margin: '20px 0' }}>
//         <CardElement />
//       </div>

//       <button type="submit" disabled={!stripe || loading}>
//         {loading ? 'Processing...' : 'Pay Now'}
//       </button>

//       {message && <p>{message}</p>}
//     </form>
//   );
// };

// const Payment = () => {
//   return (
//     <Elements stripe={stripePromise}>
//       <CheckoutForm />
//     </Elements>
//   );
// };

// export default Payment;







// import React, { useEffect, useState } from 'react';
// import {
//   CardElement,
//   useStripe,
//   useElements,
//   Elements,
// } from '@stripe/react-stripe-js';
// import { loadStripe } from '@stripe/stripe-js';
// import { useNavigate, useParams } from 'react-router-dom';
// import axiosInstance from '../axiosinterceptor';

// // ✅ Replace with your Stripe test public key
// const stripePromise = loadStripe('pk_test_51RVXWGP0OnPV991wNGaAZMVZ8i8kEpR5VRiv88qyFk773Wtap4O0F7edJv55mtBZu9iVopBcnCKoKa3at2nGt2ft009gHLkx4U');

// const CheckoutForm = () => {
//   const stripe = useStripe();
//   const elements = useElements();
//   const navigate = useNavigate();
//   const { eventId } = useParams();

//   const [event, setEvent] = useState(null);
//   const [message, setMessage] = useState('');
//   const [loading, setLoading] = useState(false);

//   // ✅ Fetch event details on load
//   useEffect(() => {
//     const fetchEvent = async () => {
//       try {
//         const res = await axiosInstance.get(`/admin/event/${eventId}`);
//         setEvent(res.data);
//       } catch (err) {
//         console.error('Error fetching event:', err);
//         setMessage('❌ Could not load event data.');
//       }
//     };

//     if (eventId) {
//       fetchEvent();
//     }
//   }, [eventId]);

//   const handlePayment = async (e) => {
//     e.preventDefault();
//     if (!stripe || !elements || !event) return;

//     setMessage('');
//     setLoading(true);

//     try {
//       // ✅ Create payment intent
//       const { data } = await axiosInstance.post('/create-payment-intent', {
//         amount: event.bookingRate,
//       });

//       const result = await stripe.confirmCardPayment(data.clientSecret, {
//         payment_method: {
//           card: elements.getElement(CardElement),
//         },
//       });

//       if (result.error) {
//         setMessage(`❌ ${result.error.message}`);
//       } else if (result.paymentIntent.status === 'succeeded') {
//         setMessage('✅ Payment successful! Redirecting...');
//         setTimeout(() => navigate('/events'), 2000);
//       }
//     } catch (err) {
//       console.error('Payment error:', err);
//       setMessage('❌ Payment failed. Please try again.');
//     }

//     setLoading(false);
//   };

//   if (!event) return <p>Loading event details...</p>;

//   return (
//     <form onSubmit={handlePayment} style={{ maxWidth: '400px', margin: 'auto' }}>
//       <h2>Make a Payment</h2>

//       <p><strong>Event:</strong> {event.name}</p>
//       <p><strong>Amount:</strong> ₹{event.bookingRate}</p>

//       <div style={{ margin: '20px 0' }}>
//         <CardElement />
//       </div>

//       <button type="submit" disabled={!stripe || loading}>
//         {loading ? 'Processing...' : 'Pay Now'}
//       </button>

//       {message && <p>{message}</p>}
//     </form>
//   );
// };

// const Payment = () => (
//   <Elements stripe={stripePromise}>
//     <CheckoutForm />
//   </Elements>
// );

// export default Payment;
