// import React, { useState } from 'react';
// import {
//   TextField,
//   Button,
//   Card,
//   CardContent,
//   CardHeader,
//   Grid,
//   Alert,
//   CircularProgress,
// } from '@mui/material';
// import axiosInstance from '../axiosinterceptor';

// const ForgotPassword = () => {
//   const [email, setEmail] = useState('');
//   const [statusMsg, setStatusMsg] = useState('');
//   const [errorMsg, setErrorMsg] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setStatusMsg('');
//     setErrorMsg('');

//     if (!email) {
//       setErrorMsg('Please enter your email');
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await axiosInstance.post('http://localhost:3000/auth/forgot-password', { email });

//       // Show reset token for dev/testing (backend sends token in response)
//       setStatusMsg(`Reset token generated! Your token (dev only): ${response.data.token}`);
//     } catch (error) {
//       if (error.response?.data?.message) {
//         setErrorMsg(error.response.data.message);
//       } else {
//         setErrorMsg('Failed to generate reset token. Please try again.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
//       <Grid item xs={11} sm={8} md={5} lg={4}>
//         <Card
//           sx={{
//             background: 'rgba(253, 181, 86, 0.2)',
//             backdropFilter: 'blur(10px)',
//             WebkitBackdropFilter: 'blur(10px)',
//             borderRadius: '16px',
//             boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
//             border: '1px solid rgba(255, 255, 255, 0.18)',
//           }}
//         >
//           <CardHeader title="Forgot Password" style={{ textAlign: 'center', color: 'white' }} />
//           <CardContent>
//             {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}
//             {statusMsg && <Alert severity="success" sx={{ mb: 2 }}>{statusMsg}</Alert>}

//             <form onSubmit={handleSubmit}>
//               <TextField
//                 fullWidth
//                 label="Email"
//                 variant="outlined"
//                 type="email"
//                 margin="normal"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 InputLabelProps={{ style: { color: '#F5F5DC' } }}
//               />

//               <Button
//                 fullWidth
//                 variant="contained"
//                 type="submit"
//                 sx={{ mt: 2, background: '#FFDAB9' }}
//                 disabled={loading}
//               >
//                 {loading ? <CircularProgress size={24} color="inherit" /> : 'Send Reset Token'}
//               </Button>
//             </form>
//           </CardContent>
//         </Card>
//       </Grid>
//     </Grid>
//   );
// };

// export default ForgotPassword;



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
import { useNavigate } from 'react-router-dom';
// import axiosInstance from '../axiosinterceptor';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email) {
      setErrorMsg('Please enter your email');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('/api/auth/forgot-password', { email });

      const token = response.data.token;

      if (token) {
        // Automatically navigate to the reset password page with the token
        navigate(`/reset-password/${token}`);
      } else {
        setErrorMsg('Token not received. Please check your backend.');
      }
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Failed to generate reset token.');
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
          <CardHeader title="Forgot Password" style={{ textAlign: 'center', color: 'white' }} />
          <CardContent>
            {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                type="email"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Send '}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
    </div>
  );
};

export default ForgotPassword;
