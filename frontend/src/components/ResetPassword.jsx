import React, { useState } from 'react';
import {
  TextField,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useParams, Link, useNavigate } from 'react-router-dom';
// import axiosInstance from '../axiosinterceptor';
import axios from 'axios';

const ResetPassword = () => {
  const { token } = useParams(); // from URL like /reset-password/:token
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setStatus('');

    if (newPassword.length < 6) {
      setStatus('Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatus('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('/api/auth/reset-password', {
        token,
        newPassword,
        confirmPassword,
      });

      setStatus(response.data.message || 'Password reset successful! Redirecting to login...');
      
      setTimeout(() => {
        navigate('/login');
      }, 3000); // redirect after 3 seconds
    } catch (error) {
      setStatus(error.response?.data?.message || 'Failed to reset password. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
        style={{backgroundImage: `url('https://img.freepik.com/free-photo/remote-office-3d-rendering-concept-illustration_23-2151876124.jpg?ga=GA1.1.1656260117.1742485094&semt=ais_hybrid&w=740')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    borderRadius:"20px"}}

    >
    <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
      <Grid item xs={11} sm={8} md={5} lg={4}>
        <Card
          sx={{
            background: 'rgba(253, 181, 86, 0.2)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
          }}
        >
          <CardHeader title="Reset Password" style={{ textAlign: 'center', color: 'white' }} />
          <CardContent>
            {status && (
              <Alert severity={status.toLowerCase().includes('successful') ? 'success' : 'error'} sx={{ mb: 2 }}>
                {status}
              </Alert>
            )}

            <form onSubmit={handleReset}>
              <TextField
                fullWidth
                label="New Password"
                variant="outlined"
                type="password"
                margin="normal"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                InputLabelProps={{ style: { color: '#F5F5DC' } }}
              />
              <TextField
                fullWidth
                label="Confirm New Password"
                variant="outlined"
                type="password"
                margin="normal"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                InputLabelProps={{ style: { color: '#F5F5DC' } }}
              />

              <Button
                fullWidth
                variant="contained"
                type="submit"
                sx={{ mt: 2, background: '#FFDAB9' }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Reset Password'}
              </Button>
            </form>

            <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
              <Grid item>
                <Link to="/login" style={{ textDecoration: 'none', color: 'white' }}>
                  Back to Login
                </Link>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
    </div>
  );
};

export default ResetPassword;
