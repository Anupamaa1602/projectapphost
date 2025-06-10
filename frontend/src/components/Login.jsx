

import React, { useState } from 'react';
import {
  TextField,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Alert,
  Backdrop,
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
 import './Log.css'

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }

    if (!password || password.length < 6) {
      return 'Password must be at least 6 characters long';
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const validationError = validateForm();
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }

    try {
      const response = await axios.post('/api/auth/login', {
        email,
        password,
      });

      const { token, role } = response.data;

      localStorage.setItem('logintoken', token);
      localStorage.setItem('role', role);

      navigate('/dashboard');
    } catch (error) {
      if (error.response?.data?.message) {
        setErrorMsg(error.response.data.message);
      } else {
        setErrorMsg('Login failed. Please try again.');
      }
    }
  };

  return (
    <div>
      <div className="side">
  <div className="image-container">
    <img
      src="https://img.freepik.com/free-photo/remote-office-3d-rendering-concept-illustration_23-2151876124.jpg?ga=GA1.1.1656260117.1742485094&semt=ais_hybrid&w=740"
      alt="no image"
      className="background-image"
    />
    <div className="overlay-text">
      <h1 style={{fontSize:"60px"}}>Welcome Back!</h1>
      <p>Manage your community events and announcements efficiently.</p>
    </div>
  </div>
</div>
    <div className='log'>
      <div className="login-background">
    <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '80vh', }}>
      <Grid item xs={11} sm={8} md={5} lg={4}>
        <Card  className='bgclr' style={{borderRadius:"16px",border:"1px solid rgba(255, 255, 255, 0.18)",marginRight:"1px"}}
         sx={{
    background: 'rgba(253, 181, 86, 0.2)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
  }}>
          <CardHeader title="Login" style={{ textAlign: 'center', color: 'white' }} />
          <CardContent>
            {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                color="white"
                type="email"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                                 InputLabelProps={{
    style: { color: "#F5F5DC" }
  }}

              />
              <TextField
                fullWidth
                label="Password"
                variant="outlined"
                color="#FFDAB9"
                type="password"
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                 InputLabelProps={{
    style: { color: "#F5F5DC" }
  }}
              />

              <Button
                fullWidth
                variant="contained"
                color="black"
                type="submit"
                sx={{ mt: 2,background:"#FFDAB9" }}
              >
                Login
              </Button>
            </form>

            {/* <Grid container justifyContent="flex-end" sx={{ mt: 1 }}>
              <Grid item>
                <Link to="/signup" style={{ textDecoration: 'none', color: 'white' }}>
                  Don't have an account? Sign Up
                </Link><br></br>
                                <Link to="/forgot-password" style={{ textDecoration: 'none', color: 'white' }}>
                  forgot password
                </Link>

              </Grid>
            </Grid> */}
            <Grid container justifyContent="space-between" sx={{ mt: 1 }}>
  <Grid item>
    <Link to="/forgot-password" style={{ textDecoration: 'none', color: 'white' }}>
      Forgot password?
    </Link>
  </Grid>
  <Grid item>
    <Link to="/signup" style={{ textDecoration: 'none', color: 'white' }}>
      Don't have an account? Sign Up
    </Link>
  </Grid>
</Grid>

          </CardContent>
        </Card>
      </Grid>
    </Grid>
    </div>
    </div>
    </div>
  );
};

export default Login;


