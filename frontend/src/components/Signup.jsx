


import React, { useState } from 'react';
import {
  TextField,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Alert,
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name.trim()) {
      return 'Name is required';
    }

    if (!email || !emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }

    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }

    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const validationError = validateForm();
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }

    try {
      const response = await axios.post('/api/auth/register', {
        name,
        email,
        password,
        confirmPassword,
      });

      setSuccessMsg('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  const inputStyles = {
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "black" },
      "&:hover fieldset": { borderColor: "black" },
      "&.Mui-focused fieldset": { borderColor: "black" },
    },
  };

  const labelStyles = { color: "#F5F5DC" };

  return (
    <div>
      <div className="side">
        <div className="image-container">
          <img
            src="https://img.freepik.com/free-photo/remote-office-3d-rendering-concept-illustration_23-2151876124.jpg?ga=GA1.1.1656260117.1742485094&semt=ais_hybrid&w=740"
            alt="no image"
            className="background-image"
          />
        </div>
      </div>

      <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
        <Grid item xs={11} sm={8} md={5} lg={4}>
          <Card
            style={{ borderRadius: "16px", border: "1px solid rgba(255, 255, 255, 0.18)", width: "500px", marginRight: "500px" }}
            sx={{
              background: 'rgba(253, 181, 86, 0.2)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
            }}
          >
            <CardHeader title="Sign Up" style={{ textAlign: 'center', color: 'white' }} />
            <CardContent>
              {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}
              {successMsg && <Alert severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>}

              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Name"
                  variant="outlined"
                  margin="normal"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  InputLabelProps={{ style: labelStyles }}
                  sx={inputStyles}
                />

                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  variant="outlined"
                  margin="normal"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  InputLabelProps={{ style: labelStyles }}
                  sx={inputStyles}
                />

                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  variant="outlined"
                  margin="normal"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputLabelProps={{ style: labelStyles }}
                  sx={inputStyles}
                />

                <TextField
                  fullWidth
                  label="Confirm Password"
                  type="password"
                  variant="outlined"
                  margin="normal"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  InputLabelProps={{ style: labelStyles }}
                  sx={inputStyles}
                />

                <Button
                  fullWidth
                  variant="contained"
                  color="white"
                  type="submit"
                  sx={{ mt: 2, background: "#FFDAB9", color: "brown" }}
                >
                  Sign Up
                </Button>
              </form>

              <Grid container justifyContent="flex-end" sx={{ mt: 1 }}>
                <Grid item>
                  <Link to="/login" style={{ textDecoration: 'none', color: 'white' }}>
                    Already have an account? Login
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

export default Signup;
