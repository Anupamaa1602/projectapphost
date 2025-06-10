// import React from "react";
// import { Box, Typography, Card, CardContent, Grid, Container, Button } from "@mui/material";
// import { Link } from "react-router-dom"; // Make sure React Router is set up

// const HomePage = () => {
//   return (
//     <Box
//       minHeight="100vh"
//       display="flex"
//       flexDirection="column"
//       justifyContent="space-between"
//     //   bgcolor="#f5f5f5"
// sx={{
//     backgroundImage: `url('https://img.freepik.com/free-photo/remote-office-3d-rendering-concept-illustration_23-2151876124.jpg?ga=GA1.1.1656260117.1742485094&semt=ais_hybrid&w=740')`,
//     backgroundSize: 'cover',
//     backgroundPosition: 'center',
//     backgroundRepeat: 'no-repeat',
//     borderRadius:"20px"
//   }}
//     >
//       {/* Center Heading */}
//       <Box textAlign="center" mt={8} >
        
//         <Typography variant="h3" fontWeight="bold" gutterBottom color="rgb(248, 248, 193)">
//           Welcome to Your Residential Portal
//         </Typography>
//         <Typography variant="subtitle1" color="rgb(248, 248, 193)" mb={3} fontSize="30px">
//           Manage your community with ease
//         </Typography>
//         <Typography variant="subtitle1" color="rgb(248, 248, 193)" mb={3}>
//           To explore more,Please login or signup
//         </Typography>

        
//         <Button
//           variant="contained"
//           color="grey"
//           component={Link}
//           to="/login"
//           sx={{ textTransform: "none" ,color:"white"}}
//         >
//           Login
//         </Button>
//       </Box>

      
//       <Box bgcolor="#fff" py={4} mt={4}>
//         <Container>
//           <Grid container spacing={4} justifyContent="center" sx={{backgroundColor:"beige"}}>
//             <Grid item xs={12} sm={6} md={4}>
//               <Card elevation={3} sx={{backgroundColor:"beige"}}>
//                 <CardContent>
//                   <Typography variant="h6" fontWeight="bold">
//                     Events
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     View and book upcoming events in your society.
//                   </Typography>
//                 </CardContent>
//               </Card>
//             </Grid>

//             <Grid item xs={12} sm={6} md={4}>
//               <Card elevation={3} sx={{backgroundColor:"beige"}}>
//                 <CardContent>
//                   <Typography variant="h6" fontWeight="bold">
//                     Announcements
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     Stay updated with the latest news and notices.
//                   </Typography>
//                 </CardContent>
//               </Card>
//             </Grid>

//             <Grid item xs={12} sm={6} md={4}>
//               <Card elevation={3} sx={{backgroundColor:"beige"}}>
//                 <CardContent>
//                   <Typography variant="h6" fontWeight="bold">
//                     Payments
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     Pay maintenance fees and view payment history.
//                   </Typography>
//                 </CardContent>
//               </Card>
//             </Grid>
//           </Grid>
//         </Container>
//       </Box>
//     </Box>
//   );
// };

// export default HomePage;


// import React from "react";
// import {
//   Box,
//   Typography,
//   Card,
//   CardContent,
//   Grid,
//   Container,
//   Button,
//   Divider,
// } from "@mui/material";
// import { Link } from "react-router-dom";

// const HomePage = () => {
//   const features = [
//     {
//       title: "Events",
//       desc: "Discover and book society events with ease.",
//     },
//     {
//       title: "Announcements",
//       desc: "Receive timely updates and community notices.",
//     },
//     {
//       title: "Payments",
//       desc: "Securely pay maintenance and check dues.",
//     },
//   ];

//   return (
//     <Box
//       minHeight="100vh"
//       display="flex"
//       flexDirection="column"
//       sx={{
//         backgroundImage: `url('https://img.freepik.com/free-photo/remote-office-3d-rendering-concept-illustration_23-2151876124.jpg?ga=GA1.1.1656260117.1742485094&semt=ais_hybrid&w=740')`,
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//         backgroundRepeat: "no-repeat",
//         borderRadius: "20px",
//       }}
//     >
//       {/* Hero Section */}
//       <Box textAlign="center" mt={10} mb={6} px={2}>
//         <Typography variant="h3" fontWeight="bold" gutterBottom color="rgb(248, 248, 193)">
//           Welcome to Your Residential Portal
//         </Typography>
//         <Typography variant="h6" color="rgb(248, 248, 193)" mb={2}>
//           One-stop platform to manage your residential community efficiently
//         </Typography>
//         <Typography variant="body1" color="rgb(248, 248, 193)" mb={4}>
//           Stay connected, informed, and in control – all from one place!
//         </Typography>
//         <Button
//           variant="contained"
//           color="secondary"
//           component={Link}
//           to="/login"
//           sx={{ textTransform: "none", color: "white", px: 4,backgroundColor:"transparent" }}
//         >
//           Login / Sign Up
//         </Button>
//       </Box>

//       {/* Features Section */}
//       <Box bgcolor="rgb(248, 248, 193)" py={6}>
//         <Container>
//           <Typography variant="h4" fontWeight="bold" align="center" mb={4} style={{color:"darkblue"}}>
//             Core Features
//           </Typography>
//           <Grid container spacing={3} justifyContent="center" >
//             {features.map((feature, index) => (
//               <Grid item xs={12} sm={6} md={4} key={index}>
//                 <Card elevation={2} sx={{ height: "100%" ,backgroundColor:"rgb(221, 210, 255)"}}>
//                   <CardContent sx={{ p: 2 }}>
//                     <Typography variant="h6" fontWeight="bold" mb={1}>
//                       {feature.title}
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       {feature.desc}
//                     </Typography>
//                   </CardContent>
//                 </Card>
//               </Grid>
//             ))}
//           </Grid>
//         </Container>
//       </Box>

//       {/* Divider */}
//       <Divider />

//       {/* Footer Section */}
//       <Box bgcolor="#222" color="#fff" py={4} textAlign="center">
//         <Container>
//           <Typography variant="body1" gutterBottom>
//             &copy; {new Date().getFullYear()} Residential Portal. All rights reserved.
//           </Typography>
//           <Typography variant="body2">
//             Need help? Contact support at <b>support@residenceapp.com</b>
//           </Typography>
//         </Container>
//       </Box>
//     </Box>
//   );
// };

// export default HomePage;

import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Container,
  Button,
  Divider,
} from "@mui/material";
import { Link } from "react-router-dom";

const HomePage = () => {
  const features = [
    {
      title: "Events",
      desc: "Discover and book society events with ease.",
    },
    {
      title: "Announcements",
      desc: "Receive timely updates and community notices.",
    },
    {
      title: "Payments",
      desc: "Securely pay maintenance and check dues.",
    },
  ];

  return (
    <Box
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      sx={{
        backgroundImage: `url('https://img.freepik.com/free-photo/remote-office-3d-rendering-concept-illustration_23-2151876124.jpg?ga=GA1.1.1656260117.1742485094&semt=ais_hybrid&w=740')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        borderRadius: "20px",
        animation: "fadeIn 1.2s ease-in-out",
      }}
    >
      {/* Hero Section */}
      <Box textAlign="center" mt={10} mb={6} px={2}>
        <Typography variant="h3" fontWeight="bold" gutterBottom color="rgb(248, 248, 193)">
          Welcome to Your Residential Portal
        </Typography>
        <Typography variant="h6" color="rgb(248, 248, 193)" mb={2}>
          One-stop platform to manage your residential community efficiently
        </Typography>
        <Typography variant="body1" color="rgb(248, 248, 193)" mb={4}>
          Stay connected, informed, and in control – all from one place!
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          component={Link}
          to="/login"
          sx={{
            textTransform: "none",
            color: "white",
            px: 4,
            backgroundColor: "transparent",
            border: "1px solid white",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          Login / Sign Up
        </Button>
      </Box>

      {/* Features Section */}
      <Box bgcolor="rgb(248, 248, 193)" py={6}>
        <Container>
          <Typography
            variant="h4"
            fontWeight="bold"
            align="center"
            mb={4}
            sx={{ color: "darkblue" }}
          >
            Core Features
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  elevation={2}
                  sx={{
                    height: "100%",
                    backgroundColor: "rgb(221, 210, 255)",
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="h6" fontWeight="bold" mb={1}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Divider */}
      <Divider />

      {/* Footer Section */}
      <Box bgcolor="#222" color="#fff" py={4} textAlign="center">
        <Container>
          <Typography variant="body1" gutterBottom>
            &copy; {new Date().getFullYear()} Residential Portal. All rights reserved.
          </Typography>
          <Typography variant="body2">
            Need help? Contact support at <b>support@residenceapp.com</b>
          </Typography>
        </Container>
      </Box>

      {/* Animation Keyframes */}
      <style>{`
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Box>
  );
};

export default HomePage;
