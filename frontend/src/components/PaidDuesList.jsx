// import React, { useEffect, useState } from 'react';
// import {
//   Typography,
//   Card,
//   CardContent,
//   Grid,
//   CircularProgress,
//   Alert,
// } from '@mui/material';
// import axiosInstance from '../axiosinterceptor';

// const PaidDuesList = () => {
//   const [paidUsers, setPaidUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   const role = localStorage.getItem('role');

//   useEffect(() => {
//     const fetchPaidDues = async () => {
//       try {
//         const res = await axiosInstance.get('/admin/paid-dues-details'); // 👈 Ensure this route is protected by `verifyToken` and admin check
//         setPaidUsers(res.data);
//         setLoading(false);
//       } catch (err) {
//         setError(err.response?.data?.message || 'Failed to fetch paid dues');
//         setLoading(false);
//       }
//     };

//     if (role === 'admin') {
//       fetchPaidDues();
//     } else {
//       setError('Access denied. Admins only.');
//       setLoading(false);
//     }
//   }, [role]);

//   if (loading) {
//     return <CircularProgress style={{ margin: '20px auto', display: 'block' }} />;
//   }

//   if (error) {
//     return <Alert severity="error" style={{ margin: '20px' }}>{error}</Alert>;
//   }

//   return (
//     <div style={{ padding: 20 }}>
//       <Typography variant="h4" align="center" gutterBottom>
//         Paid Dues List (Admin Only)
//       </Typography>

//       <Grid container spacing={3}>
//         {paidUsers.length === 0 ? (
//           <Typography>No paid dues found.</Typography>
//         ) : (
//           paidUsers.map((user, idx) => (
//             <Grid item xs={12} md={6} key={idx}>
//               <Card
//                 style={{
//                   backgroundColor: 'rgba(30, 30, 30, 0.8)',
//                   color: 'white',
//                   borderRadius: 16,
//                   boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
//                   padding: 16,
//                 }}
//               >
//                 <CardContent>
//                   <Typography variant="h6" gutterBottom>
//                     {user.name} ({user.email})
//                   </Typography>

//                   {user.payments.map((pay, i) => (
//                     <Typography
//                       key={i}
//                       variant="body2"
//                       style={{ color: '#ccc', marginBottom: 6 }}
//                     >
//                       • <strong>{pay.title}</strong> — ₹{pay.amount} on{' '}
//                       {new Date(pay.paymentDate).toLocaleDateString()}
//                     </Typography>
//                   ))}
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))
//         )}
//       </Grid>
//     </div>
//   );
// };

// export default PaidDuesList;





import React, { useEffect, useState } from 'react';
import {
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
  Button
} from '@mui/material';
import axiosInstance from '../axiosinterceptor';

const PaidDuesList = () => {
  const [paidList, setPaidList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const role = localStorage.getItem('role');

  useEffect(() => {
    const fetchPaidDues = async () => {
      try {
        const res = await axiosInstance.get('/admin/paid-dues-details');
        setPaidList(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch paid dues list');
      } finally {
        setLoading(false);
      }
    };

    fetchPaidDues();
  }, []);

  const handleRemoveFromList = (userEmail, title) => {
    setPaidList(prev =>
      prev
        .map(user =>
          user.email === userEmail
            ? {
                ...user,
                payments: user.payments.filter(p => p.title !== title),
              }
            : user
        )
        .filter(user => user.payments.length > 0)
    );
  };

  if (loading) {
    return <CircularProgress style={{ margin: '20px auto', display: 'block' }} />;
  }

  if (error) {
    return <Alert severity="error" style={{ margin: 20 }}>{error}</Alert>;
  }

  if (role !== 'admin') {
    return (
      <Alert severity="warning" style={{ margin: 20 }}>
        Access Denied. Only admins can view this page.
      </Alert>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Paid Dues List (Admin Only)
      </Typography>

      <Grid container spacing={3}>
        {paidList.length === 0 ? (
          <Typography>No paid dues records found.</Typography>
        ) : (
          paidList.map((user, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card
                style={{
                  backgroundColor: 'rgba(40, 40, 40, 0.9)',
                  color: 'white',
                  borderRadius: 16,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                  padding: 16,
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {user.name} ({user.email})
                  </Typography>
                  <ul style={{ paddingLeft: 20 }}>
                    {user.payments.map((payment, idx) => (
                      <li key={idx}>
                        <Typography variant="body2" style={{ color: '#ccc' }}>
                          {payment.title} — ₹{payment.amount} on{' '}
                          {new Date(payment.paymentDate).toLocaleDateString()}
                        </Typography>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          style={{ marginTop: 5 }}
                          onClick={() => handleRemoveFromList(user.email, payment.title)}
                        >
                          Remove
                        </Button>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </div>
  );
};

export default PaidDuesList;
