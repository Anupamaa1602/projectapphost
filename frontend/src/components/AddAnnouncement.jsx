
import React, { useEffect, useState } from 'react';                       // tis the final one
import {
  Button,
  Container,
  TextField,
  Typography,
  Paper,
} from '@mui/material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../axiosinterceptor';
import { useNotification } from './NotificationContext'; //  Import notification hook

const AddAnnouncement = () => {
  const { id } = useParams(); 
  const { state } = useLocation(); 
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const { notifyAnnouncementChange } = useNotification(); //   context is imported

  useEffect(() => {
    if (id && state?.announcement) {
      setTitle(state.announcement.title);
      setMessage(state.announcement.message);
    }
  }, [id, state]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const announcement = {
      title,
      message,
      // createdAt: new Date(),
      ...(id ? {} : { createdAt: new Date() })
    };

    if (id) {
      // Update
      axiosInstance
        .put(`/admin/edit/${id}`, announcement)
        .then(() => {
          alert('Announcement updated');
          notifyAnnouncementChange(true); //  red dot is visible on the navbar items
          // navigate('/dashboard');
          navigate('/dashboard', { replace: true }); 
        })
        .catch(() => alert('Failed to update'));
    } else {
      // Add
      axiosInstance
        .post('/admin/add', announcement)
        .then(() => {
          alert('Announcement added');
          notifyAnnouncementChange(true); // 
          navigate('/dashboard');
        })
        .catch(() => alert('Failed to add'));
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 3, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          {id ? 'Update Announcement' : 'Add Announcement'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Title"
            margin="normal"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="Message"
            margin="normal"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            multiline
            rows={4}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ backgroundColor: 'rgb(92, 124, 156)' }}
          >
            {id ? 'Update' : 'Submit'}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default AddAnnouncement;



// import React, { useEffect, useState } from 'react';                //current one
// import {
//   Button,
//   Container,
//   TextField,
//   Typography,
//   Paper,
// } from '@mui/material';
// import { useLocation, useNavigate, useParams } from 'react-router-dom';
// import axiosInstance from '../axiosinterceptor';
// import { useNotification } from './NotificationContext'; // Import notification hook

// const AddAnnouncement = () => {
//   const { id } = useParams();
//   const { state } = useLocation();
//   const navigate = useNavigate();

//   const [title, setTitle] = useState('');
//   const [message, setMessage] = useState('');

//   const { notifyAnnouncementChange } = useNotification(); // Use context

//   useEffect(() => {
//     if (id && state?.announcement) {
//       setTitle(state.announcement.title);
//       setMessage(state.announcement.message);
//     }
//   }, [id, state]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const announcement = {
//       title,
//       message,
//       ...(id ? {} : { createdAt: new Date() })
//     };

//     try {
//       if (id) {
//         // 🔄 Update
//         const res = await axiosInstance.put(`http://localhost:3000/admin/edit/${id}`, announcement);
//         alert('Announcement updated');
//         notifyAnnouncementChange(true);
//         // ⏪ Return updated announcement to Dashboard via state
//         navigate('/dashboard', { replace: true, state: { updatedAnnouncement: res.data.updatedAnnouncement } });
//       } else {
//         // ➕ Add
//         await axiosInstance.post('http://localhost:3000/admin/add', announcement);
//         alert('Announcement added');
//         notifyAnnouncementChange(true);
//         navigate('/dashboard');
//       }
//     } catch (err) {
//       alert(id ? 'Failed to update' : 'Failed to add');
//     }
//   };

//   return (
//     <Container maxWidth="sm">
//       <Paper elevation={3} sx={{ padding: 3, mt: 4 }}>
//         <Typography variant="h5" gutterBottom>
//           {id ? 'Update Announcement' : 'Add Announcement'}
//         </Typography>
//         <form onSubmit={handleSubmit}>
//           <TextField
//             fullWidth
//             label="Title"
//             margin="normal"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             required
//           />
//           <TextField
//             fullWidth
//             label="Message"
//             margin="normal"
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             required
//             multiline
//             rows={4}
//           />
//           <Button
//             type="submit"
//             variant="contained"
//             color="primary"
//             style={{ backgroundColor: 'rgb(92, 124, 156)' }}
//           >
//             {id ? 'Update' : 'Submit'}
//           </Button>
//         </form>
//       </Paper>
//     </Container>
//   );
// };

// export default AddAnnouncement;




// import React, { useEffect, useState } from 'react';
// import { TextField, Button, Typography, Paper } from '@mui/material';
// import { useLocation, useNavigate, useParams } from 'react-router-dom';
// import axiosInstance from '../axiosinterceptor';

// const AddAnnouncement = () => {
//   const [title, setTitle] = useState('');
//   const [message, setMessage] = useState('');
//   const { id } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (location.state?.announcement) {
//       const { title, message } = location.state.announcement;
//       setTitle(title);
//       setMessage(message);
//     }
//   }, [location.state]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const announcement = {
//       title,
//       message,
//       ...(id ? {} : { createdAt: new Date() })
//     };

//     try {
//       if (id) {
//         // 🔄 Update announcement
//         const res = await axiosInstance.put(`http://localhost:3000/admin/edit/${id}`, announcement);
//         alert('Announcement updated');
//         navigate('/dashboard', { replace: true, state: { updatedAnnouncement: res.data.updatedAnnouncement } });
//       } else {
//         // ➕ Add new
//         await axiosInstance.post('http://localhost:3000/admin/add', announcement);
//         alert('Announcement added');
//         navigate('/dashboard');
//       }
//     } catch (err) {
//       alert(id ? 'Failed to update' : 'Failed to add');
//     }
//   };

//   return (
//     <Paper elevation={3} style={{ padding: 20, maxWidth: 600, margin: 'auto', marginTop: 40 }}>
//       <Typography variant="h5" gutterBottom>
//         {id ? 'Update Announcement' : 'Add New Announcement'}
//       </Typography>
//       <form onSubmit={handleSubmit}>
//         <TextField
//           fullWidth
//           label="Title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           margin="normal"
//           required
//         />
//         <TextField
//           fullWidth
//           multiline
//           rows={4}
//           label="Message"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           margin="normal"
//           required
//         />
//         <Button type="submit" variant="contained" color="primary">
//           {id ? 'Update' : 'Add'}
//         </Button>
//       </form>
//     </Paper>
//   );
// };

// export default AddAnnouncement;
