
// export default CheckoutForm;

// import React, { useState } from 'react';            //working
// import {
//   CardElement,
//   useStripe,
//   useElements
// } from '@stripe/react-stripe-js';
// import axiosInstance from '../axiosinterceptor';

// const CheckoutForm = ({ type }) => {
//   const stripe = useStripe();
//   const elements = useElements();

//   const [amount, setAmount] = useState(5);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');

//   const isAuthenticated = !!localStorage.getItem('token');

//   const handlePayment = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage('');

//     try {
//       const { data } = await axiosInstance.post('/create-payment-intent', {
//         amount: amount * 100,
//       });

//       const result = await stripe.confirmCardPayment(data.clientSecret, {
//         payment_method: {
//           card: elements.getElement(CardElement),
//         },
//       });

//       if (result.error) {
//         setMessage(`❌ ${result.error.message}`);
//       } else if (result.paymentIntent.status === 'succeeded') {
//         setMessage('✅ Payment successful!');

//         if (type === 'event') {
//           alert('🎉 Event booked successfully!');
//         } else if (type === 'dues') {
//           alert('💰 Dues cleared successfully!');
//         }
//       }
//     } catch (err) {
//       console.error(err);
//       setMessage('❌ Payment failed. Please try again.');
//     }

//     setLoading(false);
//   };

//   if (!isAuthenticated) {
//     return (
//       <div style={{ textAlign: 'center', marginTop: '100px' }}>
//         <h2>No payments available</h2>
//         <p>Please login to view or make payments.</p>
//       </div>
//     );
//   }

//   return (
//     <form onSubmit={handlePayment} style={{ maxWidth: 400, margin: 'auto' }}>
//       <h2>Make a Payment</h2>

//       <label>
//         Amount (USD):
//         <input
//           type="number"
//           min="1"
//           value={amount}
//           onChange={(e) => setAmount(e.target.value)}
//           required
//         />
//       </label>

//       <div style={{ margin: '20px 0' }}>
//         <CardElement />
//       </div>

//       <button type="submit" disabled={!stripe || loading}>
//         {loading ? 'Processing...' : 'Pay Now'}
//       </button>

//       {message && <p style={{ marginTop: '10px' }}>{message}</p>}
//     </form>
//   );
// };

// export default CheckoutForm;








// import React, { useState } from 'react';                               //  final one the working one
// import {
//   CardElement,
//   useStripe,
//   useElements
// } from '@stripe/react-stripe-js';
// import axiosInstance from '../axiosinterceptor';
// import { useNavigate } from 'react-router-dom';

// const CheckoutForm = () => {
//   const stripe = useStripe();
//   const elements = useElements();
//   const navigate = useNavigate();

//   const [amount, setAmount] = useState(5);
//   const [type, setType] = useState('event');
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');

//   const isAuthenticated = !!localStorage.getItem('token');

//   const handlePayment = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage('');

//     try {
//       // 1. Create payment intent
//       const { data } = await axiosInstance.post('/create-payment-intent', {
//         amount: amount * 100,
//       });

//       // 2. Confirm payment
//       const result = await stripe.confirmCardPayment(data.clientSecret, {
//         payment_method: {
//           card: elements.getElement(CardElement),
//         },
//       });

//       if (result.error) {
//         setMessage(`❌ ${result.error.message}`);
//       } else if (result.paymentIntent.status === 'succeeded') {
//         // 3. Alert user and redirect
//         if (type === 'event') {
//           alert('✅ Event booked successfully!');
//           navigate('/events');
//         } else if (type === 'dues') {
//           alert('✅ Dues cleared successfully!');
//           navigate('/messages');
//         }
//       }
//     } catch (err) {
//       console.error(err);
//       setMessage('❌ Payment failed. Please try again.');
//     }

//     setLoading(false);
//   };

//   if (!isAuthenticated) {
//     return (
//       <div style={{ textAlign: 'center', marginTop: '100px' }}>
//         <h2>No payments available</h2>
//         <p>Please login to view or make payments.</p>
//       </div>
//     );
//   }

//   return (
//     <form onSubmit={handlePayment} style={{ maxWidth: 400, margin: 'auto' }}>
//       <h2>Make a Payment</h2>

//       <label>
//         Select Payment Type:
//         <select
//           value={type}
//           onChange={(e) => setType(e.target.value)}
//           required
//         >
//           <option value="event">Event</option>
//           <option value="dues">Dues</option>
//         </select>
//       </label>

//       <br /><br />

//       <label>
//         Amount (USD):
//         <input
//           type="number"
//           min="1"
//           value={amount}
//           onChange={(e) => setAmount(e.target.value)}
//           required
//         />
//       </label>

//       <div style={{ margin: '20px 0' }}>
//         <CardElement />
//       </div>

//       <button type="submit" disabled={!stripe || loading}>
//         {loading ? 'Processing...' : 'Pay Now'}
//       </button>

//       {message && <p style={{ marginTop: '10px' }}>{message}</p>}
//     </form>
//   );
// };

// export default CheckoutForm;

// import React, { useState, useEffect } from 'react';        // this is the last one working
// import {
//   CardElement,
//   useStripe,
//   useElements
// } from '@stripe/react-stripe-js';
// import axiosInstance from '../axiosinterceptor';
// import { useNavigate, useLocation } from 'react-router-dom';

// const CheckoutForm = () => {
//   const stripe = useStripe();
//   const elements = useElements();
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Extract type and data from location.state
//   const { state } = location || {};
//   const type = state?.type;              // 'event' or 'dues'
//   const data = state?.data || {};        // event or message object passed from previous page

//   const [amount, setAmount] = useState(0);
//   const [title, setTitle] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');
// const [date, setDate] = useState('');
// const [time, setTime] = useState('');

//   useEffect(() => {
//     if (!type || !data) {
//       setMessage('❌ Missing payment type or payment data.');
//       return;
//     }

//     // Set amount and title based on payment type
//     if (type === 'event') {
//       setAmount(data.bookingRate || 0);
//       setTitle(data.name || 'Event Payment');
//     } else if (type === 'dues') {
//       setAmount(data.amount || 0);
//       setTitle(data.title || 'Dues Payment');
//     }
//   }, [type, data]);

//   const handlePayment = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage('');

//     try {
//       if (!stripe || !elements) {
//         setMessage('Stripe has not loaded yet.');
//         setLoading(false);
//         return;
//       }

//       // Create payment intent on server with amount in cents
//       const { data: paymentData } = await axiosInstance.post('/create-payment-intent', {
//         amount: Math.round(amount * 100),
//       });

//       // Confirm card payment
//       const result = await stripe.confirmCardPayment(paymentData.clientSecret, {
//         payment_method: {
//           card: elements.getElement(CardElement),
//         },
//       });

//       if (result.error) {
//         setMessage(`❌ ${result.error.message}`);
//       } else if (result.paymentIntent.status === 'succeeded') {
//         // Payment success: call backend routes based on type

//         if (type === 'event') {
//           // Save booking info
//           await axiosInstance.post('event/bookings', {
//             // eventId: data._id,
//             eventName: data.name,
//             bookingRate:data.bookingRate,
//             paymentMode: 'UPI',
//             // date: data.date || '',  // you may want to pass these from previous page
//             // time: data.time || '',
//             userEmail: JSON.parse(atob(localStorage.getItem('logintoken').split('.')[1])).email,
//             eventId:data._id,
//             date,
//             time
            
//             // paymentStatus: 'completed',
//           });
//           alert('✅ Event booked successfully!');
//           navigate('/events');
//         } else if (type === 'dues') {
//           // Update message (dues) as paid
//           await axiosInstance.put(`/admin/messages/${data._id}/pay`, {
//             isPaid: true,
//             paymentDate: new Date().toISOString(),
//             paymentAmount: amount,
//             paymentMethod: 'Card',
//             userEmail: JSON.parse(atob(localStorage.getItem('logintoken').split('.')[1])).email,
//           });
//           alert('✅ Dues cleared successfully!');
//           navigate('/messages');
//         }
//       }
//     } catch (err) {
//       console.error(err);
//       setMessage('❌ Payment failed. Please try again.');
//     }

//     setLoading(false);
//   };

//   if (!type || !data) {
//     return (
//       <div style={{ textAlign: 'center', marginTop: 100 }}>
//         <h2>Invalid payment request</h2>
//         <p>Payment type or data missing.</p>
//       </div>
//     );
//   }

//   return (
//     <form onSubmit={handlePayment} style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
//       <h2>Pay for: {title}</h2>

//       <p><strong>Amount: </strong>{typeof amount === 'number' ? amount.toFixed(2) : '0.00'}</p>

//       <div style={{ margin: '20px 0' }}>
//         <CardElement />
//       </div>

//       <button type="submit" disabled={!stripe || loading} style={{ width: '100%', padding: '10px' }}>
//         {loading ? 'Processing...' : 'Pay Now'}
//       </button>

//       {message && <p style={{ marginTop: 10, color: 'red' }}>{message}</p>}
//     </form>
//   );
// };

// export default CheckoutForm;

// import React, { useState, useEffect } from 'react';                           // the one that work for event and dues payment
// import {
//   CardElement,
//   useStripe,
//   useElements
// } from '@stripe/react-stripe-js';
// import axiosInstance from '../axiosinterceptor';
// import { useNavigate, useLocation } from 'react-router-dom';
// import './CheckoutForm.css'; 

// const CheckoutForm = () => {
//   const stripe = useStripe();
//   const elements = useElements();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const { state } = location || {};
//   const type = state?.type;
//   const data = state?.data || {};

//   const [amount, setAmount] = useState(0);
//   const [title, setTitle] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');
//   const [date, setDate] = useState('');
//   const [time, setTime] = useState('');

//   useEffect(() => {
//     if (!type || !data) {
//       setMessage('❌ Missing payment type or data.');
//       return;
//     }

//     if (type === 'event') {
//       setAmount(data.bookingRate || 0);
//       setTitle(data.name || 'Event Payment');
//     } else if (type === 'dues') {
//       setAmount(data.amount || 0);
//       setTitle(data.title || 'Dues Payment');
//     }
//   }, [type, data]);

//   const handlePayment = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage('');

//     try {
//       if (!stripe || !elements) {
//         setMessage('Stripe has not loaded yet.');
//         setLoading(false);
//         return;
//       }

//       const { data: paymentData } = await axiosInstance.post('/create-payment-intent', {
//         amount: Math.round(amount * 100),
//       });

//       const result = await stripe.confirmCardPayment(paymentData.clientSecret, {
//         payment_method: {
//           card: elements.getElement(CardElement),
//         },
//       });

//       if (result.error) {
//         setMessage(`❌ ${result.error.message}`);
//       } else if (result.paymentIntent.status === 'succeeded') {
//         if (type === 'event') {
//           await axiosInstance.post('event/bookings', {
//             eventName: data.name,
//             bookingRate: data.bookingRate,
//             paymentMode: 'UPI',
//             userEmail: JSON.parse(atob(localStorage.getItem('logintoken').split('.')[1])).email,
//             eventId: data._id,
//             date,
//             time
//           });
//           alert('✅ Event booked successfully!');
//           navigate('/mybookings');
//         } else if (type === 'dues') {
//           await axiosInstance.put(`/admin/messages/${data._id}/pay`, {
//             isPaid: true,
//             paymentDate: new Date().toISOString(),
//             paymentAmount: amount,
//             paymentMethod: 'Card',
//             userEmail: JSON.parse(atob(localStorage.getItem('logintoken').split('.')[1])).email,
//               paidBy: userId,
//           });
//           alert('✅ Dues cleared successfully!');
//           navigate('/messages');
//         }
//       }
//     } catch (err) {
//       console.error(err);
//       setMessage('❌ Payment failed. Please try again.');
//     }

//     setLoading(false);
//   };

//   if (!type || !data) {
//     return (
//       <div className="checkout-container">
//         <h2>Invalid payment request</h2>
//         <p>Payment type or data missing.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="checkout-container">
//       <form onSubmit={handlePayment} className="checkout-card">
//         <h2>Pay for: {title}</h2>
//         <p className="amount-display"><strong>Amount:</strong> ₹{amount.toFixed(2)}</p>
//         <div className="card-element-wrapper">
//           <CardElement />
//         </div>
//         <button type="submit" disabled={!stripe || loading} className="pay-button">
//           {loading ? 'Processing...' : 'Pay Now'}
//         </button>
//         {message && <p className="error-message">{message}</p>}
//       </form>
//     </div>
//   );
// };

// export default CheckoutForm;



import React, { useState, useEffect } from 'react';
import {
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import axiosInstance from '../axiosinterceptor';
import { useNavigate, useLocation } from 'react-router-dom';
import './CheckoutForm.css';

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const location = useLocation();

  const { state } = location || {};
  const type = state?.type;
  const data = state?.data || {};

  const [amount, setAmount] = useState(0);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [hasPaid, setHasPaid] = useState(false);

  useEffect(() => {
    if (!type || !data) {
      setMessage('❌ Missing payment type or data.');
      return;
    }

    try {
      const tokenPayload = JSON.parse(atob(localStorage.getItem('logintoken').split('.')[1]));
      const userEmail = tokenPayload?.email;

      if (type === 'event') {
        setAmount(data.bookingRate || 0);
        setTitle(data.name || 'Event Payment');
      } else if (type === 'dues') {
        setAmount(data.amount || 0);
        setTitle(data.title || 'Dues Payment');

        // ✅ Disable Pay button only if this user has already paid
        if (data.isPaid && data.paidBy === userEmail) {
          setHasPaid(true);
        }
      }
    } catch (err) {
      console.error('Token decode error:', err);
      setMessage('❌ Failed to decode user token.');
    }
  }, [type, data]);

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (!stripe || !elements) {
        setMessage('Stripe has not loaded yet.');
        setLoading(false);
        return;
      }

      const { data: paymentData } = await axiosInstance.post('/create-payment-intent', {
        amount: Math.round(amount * 100),
      });

      const result = await stripe.confirmCardPayment(paymentData.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      const tokenPayload = JSON.parse(atob(localStorage.getItem('logintoken').split('.')[1]));
      const userEmail = tokenPayload.email;

      if (result.error) {
        setMessage(`❌ ${result.error.message}`);
      } else if (result.paymentIntent.status === 'succeeded') {
        if (type === 'event') {
          await axiosInstance.post('/event/bookings', {
            eventName: data.name,
            bookingRate: data.bookingRate,
            paymentMode: 'UPI',
            userEmail,
            eventId: data._id,
            date,
            time
          });
          alert('✅ Event booked successfully!');
          navigate('/mybookings');
        } else if (type === 'dues') {
          await axiosInstance.put(`/admin/messages/${data._id}/pay`, {
            isPaid: true,
            paymentDate: new Date().toISOString(),
            paymentAmount: amount,
            paymentMethod: 'Card',
            paidBy: userEmail,
          });
          alert('✅ Dues cleared successfully!');
          navigate('/messages');
        }
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Payment failed. Please try again.');
    }

    setLoading(false);
  };

  if (!type || !data) {
    return (
      <div className="checkout-container">
        <h2>Invalid payment request</h2>
        <p>Payment type or data missing.</p>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <form onSubmit={handlePayment} className="checkout-card">
        <h2>Pay for: {title}</h2>
        <p className="amount-display"><strong>Amount:</strong> ₹{amount.toFixed(2)}</p>
        <div className="card-element-wrapper">
          <CardElement />
        </div>
        <button
          type="submit"
          disabled={!stripe || loading || hasPaid}
          className="pay-button"
        >
          {hasPaid ? 'Already Paid' : (loading ? 'Processing...' : 'Pay Now')}
        </button>
        {message && <p className="error-message">{message}</p>}
      </form>
    </div>
  );
};

export default CheckoutForm;







