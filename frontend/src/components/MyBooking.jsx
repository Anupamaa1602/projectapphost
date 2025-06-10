// import React, { useEffect, useState } from 'react';
// import axiosInstance from '../axiosinterceptor';
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   CircularProgress,
//   Grid,
//   Alert
// } from '@mui/material';

// const MyBooking = () => {
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchMyBookings = async () => {
//       try {
//         const { data } = await axiosInstance.get('http://localhost:3000/event/bookings/user/me');
//         setBookings(data);
//       } catch (err) {
//         console.error('Error fetching bookings:', err);
//         // Show either backend message or a generic error
//         const msg = err.response?.data?.message || 'Failed to load bookings.';
//         setError(msg);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMyBookings();
//   }, []);

//   if (loading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
//         <Alert severity="error">{error}</Alert>
//       </Box>
//     );
//   }

//   if (bookings.length === 0) {
//     return (
//       <Box sx={{ textAlign: 'center', mt: 6 }}>
//         <Typography variant="h6">You have no bookings yet.</Typography>
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ p: 2 }}>
//       <Typography variant="h4" gutterBottom>
//         My Bookings
//       </Typography>

//       <Grid container spacing={2}>
//         {bookings.map((b) => (
//           <Grid item xs={12} md={6} lg={4} key={b._id}>
//             <Card variant="outlined">
//               <CardContent>
//                 <Typography variant="h6">{b.eventName}</Typography>
//                 <Typography>
//                   Rate: ₹{b.bookingRate}
//                 </Typography>
//                 <Typography>
//                   Payment Mode: {b.paymentMode}
//                 </Typography>
//                 <Typography>
//                   Status: {b.paymentStatus}
//                 </Typography>
//                 {b.createdAt && (
//                   <Typography variant="caption" color="textSecondary">
//                     Booked on: {new Date(b.createdAt).toLocaleString()}
//                   </Typography>
//                 )}
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>
//     </Box>
//   );
// };

// export default MyBooking;




// import React, { useEffect, useState } from 'react';                            //final working one
// import axiosInstance from '../axiosinterceptor';
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   CircularProgress,
//   Grid,
//   Alert,
//   Button,
//   Snackbar
// } from '@mui/material';

// const MyBooking = () => {
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [snackbar, setSnackbar] = useState({ open: false, message: '' });

//   useEffect(() => {
//     fetchMyBookings();
//   }, []);

//   const fetchMyBookings = async () => {
//     setLoading(true);
//     try {
//       const { data } = await axiosInstance.get('http://localhost:3000/event/bookings/user/me');
//       setBookings(data);
//     } catch (err) {
//       console.error('Error fetching bookings:', err);
//       const msg = err.response?.data?.message || 'Failed to load bookings.';
//       setError(msg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCancel = async (bookingId) => {
//     const confirm = window.confirm('Are you sure you want to cancel this booking?');
//     if (!confirm) return;

//     try {
//       await axiosInstance.delete(`http://localhost:3000/event/bookings/${bookingId}`);
//       setSnackbar({ open: true, message: 'Booking cancelled successfully' });
//       // Refresh list
//       setBookings((prev) => prev.filter((b) => b._id !== bookingId));
//     } catch (err) {
//       console.error('Cancel error:', err);
//       const msg = err.response?.data?.message || 'Failed to cancel booking.';
//       setSnackbar({ open: true, message: msg });
//     }
//   };

//   return (
//     <Box sx={{ p: 2 }}>
//       <Typography variant="h4" gutterBottom>
//         My Bookings
//       </Typography>

//       {loading ? (
//         <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
//           <CircularProgress />
//         </Box>
//       ) : error ? (
//         <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
//           <Alert severity="error">{error}</Alert>
//         </Box>
//       ) : bookings.length === 0 ? (
//         <Box sx={{ textAlign: 'center', mt: 6 }}>
//           <Typography variant="h6">You have no bookings yet.</Typography>
//         </Box>
//       ) : (
//         <Grid container spacing={2}>
//           {bookings.map((b) => (
//             <Grid item xs={12} md={6} lg={4} key={b._id}>
//               <Card variant="outlined">
//                 <CardContent>
//                   <Typography variant="h6">{b.eventName}</Typography>
//                   <Typography>Rate: ₹{b.bookingRate}</Typography>
//                   {/* <Typography>Payment Mode: {b.paymentMode}</Typography> */}
//                   <Typography>Status: {b.paymentStatus}</Typography>
//                   {b.createdAt && (
//                     <Typography variant="caption" color="textSecondary">
//                       Booked on: {new Date(b.createdAt).toLocaleString()}
//                     </Typography>
                    
//                   )}
//                   <Box mt={2}>
//                     <Button
//                       variant="contained"
//                       color="error"
//                       onClick={() => handleCancel(b._id)}
//                     >
//                       Cancel Booking
//                     </Button>
                    
//                   </Box>
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       )}

//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={4000}
//         onClose={() => setSnackbar({ open: false, message: '' })}
//         message={snackbar.message}
//       />
//     </Box>
//   );
// };

// export default MyBooking;



import React, { useEffect, useState } from 'react';                         // th final one working
import axiosInstance from '../axiosinterceptor';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Grid,
  Alert,
  Button,
  Snackbar,
  Dialog, // Added for custom confirmation
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import * as Tone from 'tone';

const MyBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [openConfirm, setOpenConfirm] = useState(false); // State for custom confirmation dialog
  const [bookingToCancelId, setBookingToCancelId] = useState(null); // Store ID of booking to cancel

  useEffect(() => {
    fetchMyBookings();
  }, []);

  // Function to fetch user's bookings from the backend
  const fetchMyBookings = async () => {
    setLoading(true); // Set loading state to true
    try {
      // Make a GET request to retrieve bookings for the current user
      const { data } = await axiosInstance.get('/event/bookings/user/me');
      setBookings(data); // Update bookings state with fetched data
    } catch (err) {
      console.error('Error fetching bookings:', err);
      // Construct an error message from the response, or a generic one
      const msg = err.response?.data?.message || 'Failed to load bookings.';
      setError(msg); // Set error state
    } finally {
      setLoading(false); // Set loading state to false, regardless of success or error
    }
  };

  // Handles opening the custom confirmation dialog
  const handleOpenConfirm = (bookingId) => {
    setBookingToCancelId(bookingId); // Store the ID of the booking to be cancelled
    setOpenConfirm(true); // Open the confirmation dialog
  };

  // Handles closing the custom confirmation dialog
  const handleCloseConfirm = () => {
    setOpenConfirm(false); // Close the confirmation dialog
    setBookingToCancelId(null); // Clear the stored booking ID
  };

  // Handles the actual cancellation process after confirmation
  const handleConfirmCancel = async () => {
    handleCloseConfirm(); // Close the confirmation dialog immediately

    if (!bookingToCancelId) return; // If no ID is set, do nothing

    try {
      // Make a DELETE request to cancel the booking
      await axiosInstance.delete(`/event/bookings/${bookingToCancelId}`);
      
      // Show the first success message in the Snackbar
      setSnackbar({ open: true, message: 'Booking cancelled successfully' });
      
      // Update the bookings list by filtering out the cancelled booking
      setBookings((prev) => prev.filter((b) => b._id !== bookingToCancelId));

      // After a short delay, show the second message regarding refund policy
      // This creates the effect of two sequential "pop-ups"
      setTimeout(() => {
        setSnackbar({ open: true, message: 'Refund is not available for cancellations.' });
      }, 2500); // Display the second message 2.5 seconds after the first
      
    } catch (err) {
      console.error('Cancel error:', err);
      // Construct an error message for cancellation failure
      const msg = err.response?.data?.message || 'Failed to cancel booking.';
      setSnackbar({ open: true, message: msg }); // Show error message in Snackbar
    }
  };

  return (
    <Box sx={{ p: 2,  minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4, color: '#333' }}>
        My Bookings
      </Typography>

      {loading ? (
        // Show loading spinner while data is being fetched
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        // Show error alert if there's an error fetching bookings
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      ) : bookings.length === 0 ? (
        // Show message if no bookings are found
        <Box sx={{ textAlign: 'center', mt: 6, p: 3, border: '1px solid #ccc', borderRadius: '8px', background: '#fff' }}>
          <Typography variant="h6" color="textSecondary">You have no bookings yet.</Typography>
          <Typography variant="body2" color="textSecondary" mt={1}>Start exploring events and make a booking!</Typography>
        </Box>
      ) : (
        // Display bookings in a responsive grid
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {bookings.map((b) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={b._id}>
              <Card
                variant="elevation"
                sx={{
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h6" component="div" sx={{ mb: 1, color: '#0056b3', fontWeight: 'bold' }}>
                    {b.eventName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Rate: ₹{b.bookingRate}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Status: <Box component="span" sx={{ fontWeight: 'bold', color: b.paymentStatus === 'Paid' ? 'success.main' : 'warning.main' }}>{b.paymentStatus}</Box>
                  </Typography>
                  {b.createdAt && (
                    <Typography variant="caption" color="text.secondary">
                      Booked on: {new Date(b.createdAt).toLocaleString()}
                    </Typography>
                  )}
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleOpenConfirm(b._id)} // Use custom confirmation
                      sx={{ borderRadius: '8px', px: 3, py: 1 }}
                    >
                      Cancel Booking
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Custom Confirmation Dialog */}
      <Dialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">Confirm Cancellation</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            Are you sure you want to cancel this booking? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm} color="primary">
            No, Keep Booking
          </Button>
          <Button onClick={handleConfirmCancel} color="error" autoFocus>
            Yes, Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for showing success/error messages */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000} // Snackbar will disappear after 4 seconds
        onClose={() => setSnackbar({ open: false, message: '' })}
        message={snackbar.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} // Position the snackbar
      />
    </Box>
  );
};

export default MyBooking;


// import React, { useEffect, useState } from 'react';
// import axiosInstance from '../axiosinterceptor';
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   CircularProgress,
//   Grid,
//   Alert,
//   Button,
//   Snackbar,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle
// } from '@mui/material';

// const MyBooking = () => {
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [snackbar, setSnackbar] = useState({ open: false, message: '' });
//   const [openConfirm, setOpenConfirm] = useState(false);
//   const [bookingToCancelId, setBookingToCancelId] = useState(null);

//   useEffect(() => {
//     fetchMyBookings();
//   }, []);

//   const fetchMyBookings = async () => {
//     setLoading(true);
//     try {
//       const { data } = await axiosInstance.get('http://localhost:3000/event/bookings/user/me');
//       setBookings(data);
//     } catch (err) {
//       console.error('Error fetching bookings:', err);
//       const msg = err.response?.data?.message || 'Failed to load bookings.';
//       setError(msg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleOpenConfirm = (bookingId) => {
//     setBookingToCancelId(bookingId);
//     setOpenConfirm(true);
//   };

//   const handleCloseConfirm = () => {
//     setOpenConfirm(false);
//     setBookingToCancelId(null);
//   };

//   const handleConfirmCancel = async () => {
//     handleCloseConfirm();
//     if (!bookingToCancelId) return;

//     try {
//       await axiosInstance.delete(`http://localhost:3000/event/bookings/${bookingToCancelId}`);
//       setSnackbar({ open: true, message: 'Booking cancelled successfully' });
//       setBookings((prev) => prev.filter((b) => b._id !== bookingToCancelId));

//       setTimeout(() => {
//         setSnackbar({ open: true, message: 'Refund is not available for cancellations.' });
//       }, 2500);
//     } catch (err) {
//       console.error('Cancel error:', err);
//       const msg = err.response?.data?.message || 'Failed to cancel booking.';
//       setSnackbar({ open: true, message: msg });
//     }
//   };

//   return (
//     <Box sx={{ p: 2, minHeight: '100vh' }}>
//       <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4, color: '#333' }}>
//         My Bookings
//       </Typography>

//       {loading ? (
//         <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
//           <CircularProgress />
//         </Box>
//       ) : error ? (
//         <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
//           <Alert severity="error">{error}</Alert>
//         </Box>
//       ) : bookings.length === 0 ? (
//         <Box sx={{ textAlign: 'center', mt: 6, p: 3, border: '1px solid #ccc', borderRadius: '8px', background: '#fff' }}>
//           <Typography variant="h6" color="textSecondary">You have no bookings yet.</Typography>
//           <Typography variant="body2" color="textSecondary" mt={1}>Start exploring events and make a booking!</Typography>
//         </Box>
//       ) : (
//         <Grid container spacing={3} sx={{ mt: 2 }}>
//           {bookings.map((b) => (
//             <Grid item xs={12} sm={6} md={4} lg={3} key={b._id}>
//               <Card
//                 variant="elevation"
//                 sx={{
//                   borderRadius: '12px',
//                   boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
//                   transition: 'transform 0.2s ease-in-out',
//                   '&:hover': {
//                     transform: 'translateY(-5px)',
//                     boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
//                   },
//                 }}
//               >
//                 <CardContent>
//                   <Typography variant="h6" component="div" sx={{ mb: 1, color: '#0056b3', fontWeight: 'bold' }}>
//                     {b.eventName}
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     Rate: ₹{b.bookingRate}
//                   </Typography>

//                   <Typography variant="body2" color="text.secondary">
//                     Status:{' '}
//                     <Box component="span" sx={{ fontWeight: 'bold', color: b.paymentStatus === 'Paid' ? 'success.main' : 'warning.main' }}>
//                       {b.paymentStatus}
//                     </Box>
//                   </Typography>
//                   {b.createdAt && (
//                     <Typography variant="caption" color="text.secondary">
//                       Booked on: {new Date(b.createdAt).toLocaleString()}
//                     </Typography>
//                   )}
//                   <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
//                     <Button
//                       variant="contained"
//                       color="error"
//                       onClick={() => handleOpenConfirm(b._id)}
//                       sx={{ borderRadius: '8px', px: 3, py: 1 }}
//                     >
//                       Cancel Booking
//                     </Button>
//                   </Box>
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       )}

//       <Dialog open={openConfirm} onClose={handleCloseConfirm}>
//         <DialogTitle>Confirm Cancellation</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             Are you sure you want to cancel this booking? This action cannot be undone.
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseConfirm} color="primary">
//             No, Keep Booking
//           </Button>
//           <Button onClick={handleConfirmCancel} color="error" autoFocus>
//             Yes, Cancel
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={4000}
//         onClose={() => setSnackbar({ open: false, message: '' })}
//         message={snackbar.message}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
//       />
//     </Box>
//   );
// };

// export default MyBooking;
