



import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../axiosinterceptor';

import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Alert,
  FormHelperText,
  CircularProgress,
} from '@mui/material';

const BookEvent = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [paymentMode, setPaymentMode] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [time, setTime] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const [touched, setTouched] = useState({
    paymentMode: false,
    startDate: false,
    endDate: false,
    time: false,
  });

  const isFormValid = paymentMode && startDate && endDate && time;

  useEffect(() => {
    axiosInstance.get(`/event/${id}`)
      .then(res => {
        setEvent(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load event details');
        setLoading(false);
      });
  }, [id]);

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  const calculateDays = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays > 0 ? diffDays : 0;
  };

  const totalDays = calculateDays();
  const totalAmount = event ? totalDays * event.bookingRate : 0;

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (!isFormValid || totalDays <= 0) return;

    navigate('/messages/make-payment', {
      state: {
        type: 'event',
        data: {
          _id: event._id,
          name: event.name,
          bookingRate: totalAmount,
          date: `${startDate} to ${endDate}`,
          time: time,
        },
      },
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: 450,
        mx: 'auto',
        mt: 5,
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: 'background.paper',
      }}
    >
      <Typography variant="h5" gutterBottom>Book Event</Typography>

      {event && (
        <>
          <Typography variant="subtitle1"><strong>Event:</strong> {event.name}</Typography>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            <strong>Base Rate:</strong> ₹{event.bookingRate} / day
          </Typography>
        </>
      )}

      <form onSubmit={handleProceedToPayment} noValidate>
        <FormControl fullWidth margin="normal" required error={touched.paymentMode && !paymentMode}>
          <InputLabel id="paymentMode-label">Payment Mode</InputLabel>
          <Select
            labelId="paymentMode-label"
            id="paymentMode"
            value={paymentMode}
            label="Payment Mode"
            onChange={(e) => setPaymentMode(e.target.value)}
            onBlur={() => handleBlur('paymentMode')}
          >
            <MenuItem value=""><em>Select payment mode</em></MenuItem>
            <MenuItem value="Card">Card</MenuItem>
          </Select>
          {touched.paymentMode && !paymentMode && (
            <FormHelperText>Payment mode is required</FormHelperText>
          )}
        </FormControl>

        <TextField
          label="Start Date"
          type="date"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          onBlur={() => handleBlur('startDate')}
          required
          error={touched.startDate && !startDate}
          helperText={touched.startDate && !startDate ? 'Start date is required' : ''}
        />

        <TextField
          label="End Date"
          type="date"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          onBlur={() => handleBlur('endDate')}
          required
          error={touched.endDate && !endDate}
          helperText={touched.endDate && !endDate ? 'End date is required' : ''}
        />

        <TextField
          label="Booking Time"
          type="time"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          value={time}
          onChange={(e) => setTime(e.target.value)}
          onBlur={() => handleBlur('time')}
          required
          error={touched.time && !time}
          helperText={touched.time && !time ? 'Time is required' : ''}
        />

        {totalDays > 0 && (
          <Typography sx={{ mt: 2, color: 'green' }}>
            Booking for <strong>{totalDays}</strong> day(s) - Total: ₹{totalAmount}
          </Typography>
        )}

        {totalDays === 0 && startDate && endDate && (
          <Typography sx={{ mt: 2, color: 'red' }}>
            End date must be after start date
          </Typography>
        )}

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={!isFormValid || totalDays <= 0}
          sx={{
            mt: 2,
            backgroundColor: 'rgb(92, 124, 156)',
            '&:hover': { backgroundColor: 'rgb(70, 100, 130)' },
          }}
        >
          Proceed to Payment
        </Button>
      </form>

      {error && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default BookEvent;


