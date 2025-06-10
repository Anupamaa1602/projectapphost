


import React, { useEffect, useState } from 'react';
import {
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../axiosinterceptor';
import { useNotification } from './NotificationContext'; // Import notification hook

const messageTypes = ['Maintenance', 'Charity', 'Event', 'General'];

const AddMessage = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: '',
    amount: '', // <-- added amount field here
  });

  const { notifyMessageChange } = useNotification(); // Destructure from context

  useEffect(() => {
    if (id && state?.message) {
      const { title, content, type, amount } = state.message;
      setFormData({ title, content, type, amount: amount || '' }); // initialize amount if exists
    }
  }, [id, state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // You can optionally validate amount for numeric input if needed
    if (!formData.title || !formData.content || !formData.type) {
      alert('Please fill all required fields');
      return;
    }

    try {
      if (id) {
        // Update existing message
        await axiosInstance.put(
          `/admin/messages/edit/${id}`,
          formData
        );
        alert('Message updated successfully!');
        notifyMessageChange(); // Notify update
      } else {
        // Add new message
        await axiosInstance.post('/admin/messages/add', formData);
        alert('Message added successfully!');
        notifyMessageChange(); // Notify addition
      }
      navigate('/messages');
    } catch (err) {
      alert('Failed to save message. ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 3, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          {id ? 'Update Message' : 'Add Message'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            name="title"
            label="Title"
            margin="normal"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            name="content"
            label="Content"
            margin="normal"
            value={formData.content}
            onChange={handleChange}
            required
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="type-label">Type</InputLabel>
            <Select
              labelId="type-label"
              name="type"
              value={formData.type}
              label="Type"
              onChange={handleChange}
            >
              {messageTypes.map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* New Amount input */}
          <TextField
            fullWidth
            name="amount"
            label="Amount"
            margin="normal"
            value={formData.amount}
            onChange={handleChange}
            type="string"
            inputProps={{ min: 0, step: '0.01' }}
            helperText="Enter amount if applicable (optional)"
          />

          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            {id ? 'Update Message' : 'Add Message'}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default AddMessage;
