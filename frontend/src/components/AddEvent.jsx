

import React, { useEffect, useState } from 'react';
import {
  Button,
  Container,
  TextField,
  Typography,
  Paper,
} from '@mui/material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../axiosinterceptor';
import { useNotification } from '../components/NotificationContext';

const AddEvent = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { notifyEventChange } = useNotification();

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    capacity: '',
    phoneNo: '',
    availability: '',
    date: '',
    time: '',
    image: '',
    bookingRate: ''
  });

  // 🔒 Protect against unauthorized access after logout
  useEffect(() => {
    const token = localStorage.getItem('logintoken');
    if (!token) {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    if (id && state?.event) {
      const {
        name, location, capacity, phoneNo,
        availability, date, time, image, bookingRate
      } = state.event;
      setFormData({
        name,
        location,
        capacity,
        phoneNo,
        availability,
        date: date ? new Date(date).toISOString().split('T')[0] : '',
        time,
        image,
        bookingRate
      });
    }
  }, [id, state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      phoneNo: parseInt(formData.phoneNo),
    };

    const clearSeenEvents = () => {
      localStorage.removeItem('seenEventIds');
      notifyEventChange();
    };

    if (id) {
      axiosInstance
        .put(`/event/edit/${id}`, payload)
        .then(() => {
          alert('Event updated successfully!');
          clearSeenEvents();
          navigate('/events');
        })
        .catch(() => alert('Failed to update event'));
    } else {
      axiosInstance
        .post('/event/add', payload)
        .then(() => {
          alert('Event added successfully!');
          clearSeenEvents();
          navigate('/events');
        })
        .catch(() => alert('Failed to add event'));
    }
  };

  return (
    <Container maxWidth="sm"  style={{height:"18rem"}}>
      <Paper elevation={3} sx={{ padding: 3, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          {id ? 'Update Event' : 'Add Event'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField fullWidth name="name" label="Event Name" margin="normal" value={formData.name} onChange={handleChange} required />
          <TextField fullWidth name="location" label="Location" margin="normal" value={formData.location} onChange={handleChange} required />
          <TextField fullWidth name="capacity" label="Facility" margin="normal" value={formData.capacity} onChange={handleChange} required />
          <TextField fullWidth name="phoneNo" label="Phone Number" type="number" margin="normal" value={formData.phoneNo} onChange={handleChange} required />
          <TextField fullWidth name="availability" label="Availability" margin="normal" value={formData.availability} onChange={handleChange} required />
          <TextField fullWidth name="date" label="Date" type="date" margin="normal" value={formData.date} onChange={handleChange} InputLabelProps={{ shrink: true }} required />
          <TextField fullWidth name="time" label="Time" type="time" margin="normal" value={formData.time} onChange={handleChange} InputLabelProps={{ shrink: true }} required />
          <TextField fullWidth name="bookingRate" label="Booking Rate" type="number" margin="normal" value={formData.bookingRate} onChange={handleChange} InputLabelProps={{ shrink: true }} required />
          <TextField fullWidth name="image" label="Image URL" margin="normal" value={formData.image} onChange={handleChange} required />
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            {id ? 'Update Event' : 'Add Event'}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default AddEvent;






// import React, { useEffect, useState } from 'react';
// import {
//   Button,
//   Container,
//   TextField,
//   Typography,
//   Paper,
//   FormHelperText,
// } from '@mui/material';
// import { useLocation, useNavigate, useParams } from 'react-router-dom';
// import axiosInstance from '../axiosinterceptor';
// import { useNotification } from '../components/NotificationContext';

// const AddEvent = () => {
//   const { id } = useParams();
//   const { state } = useLocation();
//   const navigate = useNavigate();
//   const { notifyEventChange } = useNotification();

//   const [formData, setFormData] = useState({
//     name: '',
//     location: '',
//     capacity: '',
//     phoneNo: '',
//     availability: '',
//     date: '',
//     time: '',
//     image: '',
//     bookingRate: ''
//   });

//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     if (id && state?.event) {
//       const { name, location, capacity, phoneNo, availability, date, time, image, bookingRate } = state.event;
//       setFormData({
//         name,
//         location,
//         capacity,
//         phoneNo: phoneNo.toString(),
//         availability,
//         date: date ? new Date(date).toISOString().split('T')[0] : '',
//         time,
//         image,
//         bookingRate
//       });
//     }
//   }, [id, state]);

//   const validate = () => {
//     const newErrors = {};
//     if (!formData.name.trim()) newErrors.name = 'Event name is required';
//     if (!formData.location.trim()) newErrors.location = 'Location is required';
//     if (!formData.capacity.trim()) newErrors.capacity = 'Facility is required';
//     if (!formData.phoneNo.trim()) newErrors.phoneNo = 'Phone number is required';
//     else if (!/^\d{10}$/.test(formData.phoneNo)) newErrors.phoneNo = 'Phone number must be exactly 10 digits';
//     if (!formData.availability.trim()) newErrors.availability = 'Availability is required';
//     if (!formData.date.trim()) newErrors.date = 'Date is required';
//     if (!formData.time.trim()) newErrors.time = 'Time is required';
//     // if (!formData.bookingRate.trim()) newErrors.bookingRate = 'Booking rate is required';
//     if (!formData.image.trim()) newErrors.image = 'Image URL is required';

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));

//     // Clear error when valid
//     setErrors(prev => ({ ...prev, [name]: '' }));
//   };

//   const handlePhoneChange = (e) => {
//     const value = e.target.value;
//     if (/^\d{0,10}$/.test(value)) {
//       setFormData(prev => ({ ...prev, phoneNo: value }));
//       if (value.length === 10) {
//         setErrors(prev => ({ ...prev, phoneNo: '' }));
//       }
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!validate()) return;

//     const payload = {
//       ...formData,
//       phoneNo: parseInt(formData.phoneNo),
//     };

//     const clearSeenEvents = () => {
//       localStorage.removeItem('seenEventIds');
//       notifyEventChange();
//     };

//     const request = id
//       ? axiosInstance.put(`http://localhost:3000/event/edit/${id}`, payload)
//       : axiosInstance.post('http://localhost:3000/event/add', payload);

//     request
//       .then(() => {
//         clearSeenEvents();
//         navigate('/events');
//       })
//       .catch(() => alert('Failed to save event'));
//   };

//   return (
//     <Container maxWidth="sm">
//       <Paper elevation={3} sx={{ padding: 3, mt: 4 }}>
//         <Typography variant="h5" gutterBottom>
//           {id ? 'Update Event' : 'Add Event'}
//         </Typography>
//         <form onSubmit={handleSubmit}>
//           {[
//             { name: 'name', label: 'Event Name' },
//             { name: 'location', label: 'Location' },
//             { name: 'capacity', label: 'Facility' },
//             { name: 'availability', label: 'Availability' },
//             { name: 'date', label: 'Date', type: 'date', shrink: true },
//             { name: 'time', label: 'Time', type: 'time', shrink: true },
//             { name: 'bookingRate', label: 'Booking Rate', type: 'number' },
//             { name: 'image', label: 'Image URL' }
//           ].map(({ name, label, type = 'text', shrink }) => (
//             <div key={name}>
//               <TextField
//                 fullWidth
//                 name={name}
//                 label={label}
//                 type={type}
//                 margin="normal"
//                 value={formData[name]}
//                 onChange={handleChange}
//                 InputLabelProps={shrink ? { shrink: true } : undefined}
//                 error={!!errors[name]}
//                 required
//               />
//               {errors[name] && (
//                 <FormHelperText error sx={{ ml: 1 }}>{errors[name]}</FormHelperText>
//               )}
//             </div>
//           ))}

//           <TextField
//             fullWidth
//             name="phoneNo"
//             label="Phone Number"
//             type="tel"
//             margin="normal"
//             value={formData.phoneNo}
//             onChange={handlePhoneChange}
//             error={!!errors.phoneNo}
//             required
//           />
//           {errors.phoneNo && (
//             <FormHelperText error sx={{ ml: 1 }}>{errors.phoneNo}</FormHelperText>
//           )}

//           <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
//             {id ? 'Update Event' : 'Add Event'}
//           </Button>
//         </form>
//       </Paper>
//     </Container>
//   );
// };

// export default AddEvent;
