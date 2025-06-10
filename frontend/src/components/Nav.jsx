
// import React, { useState } from 'react';
// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   Button,
//   Menu,
//   MenuItem,
//   Box,
//   Badge,
// } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
// import { useNotification } from '../components/NotificationContext';

// const Nav = () => {
//   const {
//     announcementChanged,
//     eventChanged,
//     messageChanged,
//     clearAnnouncementChange,
//     clearEventChange,
//     clearMessageChange,
//   } = useNotification();

//   const navigate = useNavigate();
//   const [announcementAnchor, setAnnouncementAnchor] = useState(null);
//   const [eventAnchor, setEventAnchor] = useState(null);
//   const [messageAnchor, setMessageAnchor] = useState(null);

//   const token = localStorage.getItem('logintoken');
//   let role = null;

//   if (token) {
//     try {
//       const payload = JSON.parse(atob(token.split('.')[1]));
//       role = payload.role;
//     } catch (err) {
//       console.error('Invalid token format');
//     }
//   }

//   const handleMenu = (event, setter, clearFunc) => {
//     setter(event.currentTarget);
//     if (clearFunc) clearFunc(); 
//   };

//   const handleMenuClose = (route, anchorSetter) => {
//     anchorSetter(null);
//     if (route) navigate(route);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('logintoken');
//     localStorage.removeItem('role');
//     navigate('/');
//   };

//   return (
//     <AppBar position="static" sx={{ backgroundColor: 'rgb(92, 124, 156)' }}>
//       <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
//         <Typography
//           variant="h6"
//           onClick={() => navigate('/dashboard')}
//           sx={{ cursor: 'pointer' }}
//         >
//           <img
//             src="https://cdn-icons-png.freepik.com/256/9783/9783880.png?ga=GA1.1.1656260117.1742485094&semt=ais_incoming"
//             alt=""
//             style={{ width: '50px' }}
//           />{' '}
//           Residential App
//         </Typography>

//         {token && (
//           <Box sx={{ display: 'flex', gap: 2 }}>
//             {/* Announcements */}
//             <Button
//               color="inherit"
//               onClick={(e) => handleMenu(e, setAnnouncementAnchor, clearAnnouncementChange)}
//             >
//               <Badge color="error" variant="dot" invisible={!announcementChanged}>
//                 Announcements
//               </Badge>
//             </Button>
//             <Menu
//               anchorEl={announcementAnchor}
//               open={Boolean(announcementAnchor)}
//               onClose={() => setAnnouncementAnchor(null)}
//             >
//               <MenuItem onClick={() => handleMenuClose('/dashboard', setAnnouncementAnchor)}>Dashboard</MenuItem>
//               {role === 'admin' && (
//                 <MenuItem onClick={() => handleMenuClose('/add-announcement', setAnnouncementAnchor)}>
//                   Add Announcement
//                 </MenuItem>
//               )}
//             </Menu>

//             {/* Events */}
//             <Button
//               color="inherit"
//               onClick={(e) => handleMenu(e, setEventAnchor, clearEventChange)}
//             >
//               <Badge color="error" variant="dot" invisible={!eventChanged}>
//                 Events
//               </Badge>
//             </Button>
//             <Menu
//               anchorEl={eventAnchor}
//               open={Boolean(eventAnchor)}
//               onClose={() => setEventAnchor(null)}
//             >
//               <MenuItem onClick={() => handleMenuClose('/events', setEventAnchor)}>Event List</MenuItem>
//               <MenuItem onClick={() => handleMenuClose('/mybookings', setEventAnchor)}>My Bookings</MenuItem>
//               {role === 'admin' && (
//                 <MenuItem onClick={() => handleMenuClose('/add-event', setEventAnchor)}>
//                   Add Event
//                 </MenuItem>
//               )}
//             </Menu>

//             {/* Messages (Dues) */}
//             <Button
//               color="inherit"
//               onClick={(e) => handleMenu(e, setMessageAnchor, clearMessageChange)}
//             >
//               <Badge color="error" variant="dot" invisible={!messageChanged}>
//                 Dues
//               </Badge>
//             </Button>
//             <Menu
//               anchorEl={messageAnchor}
//               open={Boolean(messageAnchor)}
//               onClose={() => setMessageAnchor(null)}
//             >
//               <MenuItem onClick={() => handleMenuClose('/messages', setMessageAnchor)}>Inbox</MenuItem>
//               {role === 'admin' && (
//                 <MenuItem onClick={() => handleMenuClose('/add-message', setMessageAnchor)}>
//                   Add Message
//                 </MenuItem>
//               )}
//             </Menu>

//             <Button color="inherit" onClick={handleLogout}>
//               Logout
//             </Button>
//           </Box>
//         )}

//         {!token && (
//           <Box>
//             <Button color="inherit" onClick={() => navigate('/')}>
//               Login
//             </Button>
//             <Button color="inherit" onClick={() => navigate('/signup')}>
//               Sign Up
//             </Button>
//           </Box>
//         )}
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default Nav;


// import React, { useState } from 'react';                                  //the one that perfectly works
// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   Button,
//   Menu,
//   MenuItem,
//   Box,
//   Badge,
// } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
// import { useNotification } from '../components/NotificationContext';

// const Nav = () => {
//   const navigate = useNavigate();
//   const [announcementAnchor, setAnnouncementAnchor] = useState(null);
//   const [eventAnchor, setEventAnchor] = useState(null);
//   const [messageAnchor, setMessageAnchor] = useState(null);

//   const token = localStorage.getItem('logintoken');
//   let role = null;

//   if (token) {
//     try {
//       const payload = JSON.parse(atob(token.split('.')[1]));
//       role = payload.role;
//     } catch (err) {
//       console.error('Invalid token format');
//     }
//   }

//   const {
//     adminBadge,
//     userBadge,
//     clearAnnouncementChange,
//     clearEventChange,
//     clearMessageChange,
//   } = useNotification();

//   // Choose badge visibility based on role
//   const badgeVisibility = {
//     announcement: role === 'admin' ? adminBadge.announcement : userBadge.announcement,
//     event: role === 'admin' ? adminBadge.event : userBadge.event,
//     message: role === 'admin' ? adminBadge.message : userBadge.message,
//   };

//   // Clear badge only for current role
//   const handleMenu = (event, setter, clearFunc) => {
//     setter(event.currentTarget);
//     if (role && clearFunc) clearFunc(role);
//   };

//   const handleMenuClose = (route, anchorSetter) => {
//     anchorSetter(null);
//     if (route) navigate(route);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('logintoken');
//     localStorage.removeItem('role');
//     navigate('/');
//   };

//   return (
//     <AppBar position="static" sx={{ backgroundColor: 'rgb(92, 124, 156)' }}>
//       <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
//         <Typography
//           variant="h6"
//           onClick={() => navigate('/dashboard')}
//           sx={{ cursor: 'pointer',fontSize:"40px",fontFamily: 'german',color:" rgba(250, 246, 169, 0.89)"  }}
//         >
//           <img
//             src=""
//             alt=""
//             style={{ width: '50px' }}
//           />{' '}
//           {/* Residential App */}
//           <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: '700',color:'	rgb(238, 197, 65)' }}>R</span>
//   esidential App
//         </Typography>

//         {token && (
//           <Box sx={{ display: 'flex', gap: 2 ,color:' rgba(255, 250, 156, 0.89)'}}>
//             {/* Announcements */}
//             <Button
//               color="inherit"
//               onClick={(e) => handleMenu(e, setAnnouncementAnchor, clearAnnouncementChange)}
//             >
              
//                 Announcements
              
//             </Button>
//             <Menu
//               anchorEl={announcementAnchor}
//               open={Boolean(announcementAnchor)}
//               onClose={() => setAnnouncementAnchor(null)}
//             >
//               <MenuItem onClick={() => handleMenuClose('/dashboard', setAnnouncementAnchor)}>
//                 Dashboard
//               </MenuItem>
//               {role === 'admin' && (
//                 <MenuItem onClick={() => handleMenuClose('/add-announcement', setAnnouncementAnchor)}>
//                   Add Announcement
//                 </MenuItem>
//               )}
//                             {role === 'admin' && (
//                 <MenuItem onClick={() => handleMenuClose('/vote-list', setAnnouncementAnchor)}>
//                   VoteList
//                 </MenuItem>
//               )}

//             </Menu>

//             {/* Events */}
//             <Button
//               color="inherit"
//               onClick={(e) => handleMenu(e, setEventAnchor, clearEventChange)}
//             >
            
//                 Events
              
//             </Button>
//             <Menu
//               anchorEl={eventAnchor}
//               open={Boolean(eventAnchor)}
//               onClose={() => setEventAnchor(null)}
//             >
//               <MenuItem onClick={() => handleMenuClose('/events', setEventAnchor)}>
//                 Event List
//               </MenuItem>
//               <MenuItem onClick={() => handleMenuClose('/mybookings', setEventAnchor)}>
//                 My Bookings
//               </MenuItem>
//               {role === 'admin' && (
//                 <MenuItem onClick={() => handleMenuClose('/add-event', setEventAnchor)}>
//                   Add Event
//                 </MenuItem>
//               )}
//             </Menu>

//             {/* Messages / Dues */}
//             <Button
//               color="inherit"
//               onClick={(e) => handleMenu(e, setMessageAnchor, clearMessageChange)}
//             >
//               <Badge color="error" variant="dot" invisible={!badgeVisibility.message}>
//                 Dues
//               </Badge>
//             </Button>
//             <Menu
//               anchorEl={messageAnchor}
//               open={Boolean(messageAnchor)}
//               onClose={() => setMessageAnchor(null)}
//             >
//               <MenuItem onClick={() => handleMenuClose('/messages', setMessageAnchor)}>
//                 Inbox
//               </MenuItem>
//               {role === 'admin' && (
//                 <MenuItem onClick={() => handleMenuClose('/add-message', setMessageAnchor)}>
//                   Add Message
//                 </MenuItem>
//               )}

//                             {role === 'admin' && (
//                 <MenuItem onClick={() => handleMenuClose('/paidlist', setMessageAnchor)}>
//                   Paid List
//                 </MenuItem>
//               )}

//             </Menu>

//             <Button color="inherit" onClick={handleLogout}>
//               Logout
//             </Button>
//           </Box>
//         )}

//         {!token && (
//           <Box>
//             <Button color="inherit" onClick={() => navigate('/')}>
//               Login
//             </Button>
//             <Button color="inherit" onClick={() => navigate('/signup')}>
//               Sign Up
//             </Button>
//           </Box>
//         )}
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default Nav;




import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  Box,
  Badge,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../components/NotificationContext';

const Nav = () => {
  const navigate = useNavigate();
  const [announcementAnchor, setAnnouncementAnchor] = useState(null);
  const [eventAnchor, setEventAnchor] = useState(null);
  const [messageAnchor, setMessageAnchor] = useState(null);

  const token = localStorage.getItem('logintoken');
  let role = null;

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      role = payload.role;
    } catch (err) {
      console.error('Invalid token format');
    }
  }

  const {
    adminBadge,
    userBadge,
    clearAnnouncementChange,
    clearEventChange,
    clearMessageChange,
  } = useNotification();

  // Choose badge visibility based on role
  const badgeVisibility = {
    announcement: role === 'admin' ? adminBadge.announcement : userBadge.announcement,
    event: role === 'admin' ? adminBadge.event : userBadge.event,
    message: role === 'admin' ? adminBadge.message : userBadge.message,
  };

  // Clear badge only for current role
  const handleMenu = (event, setter, clearFunc) => {
    setter(event.currentTarget);
    if (role && clearFunc) clearFunc(role);
  };

  const handleMenuClose = (route, anchorSetter) => {
    anchorSetter(null);
    if (route) navigate(route);
  };

  const handleLogout = () => {
    localStorage.removeItem('logintoken');
    localStorage.removeItem('role');
    navigate('/');
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: 'rgb(92, 124, 156)' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography
          variant="h6"
          onClick={() => navigate('/dashboard')}
          sx={{ cursor: 'pointer', fontSize: "40px", fontFamily: 'german', color: "rgba(250, 246, 169, 0.89)" }}
        >
          <img
            src=""
            alt=""
            style={{ width: '50px' }}
          />{' '}
          {/* Residential App */}
          <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: '700', color: 'rgb(238, 197, 65)' }}>R</span>
          esidential App
        </Typography>

        {token && (
          <Box sx={{ display: 'flex', gap: 2, color: 'rgba(255, 250, 156, 0.89)' }}>
            {/* Announcements */}
            <Badge color="error" variant="dot" invisible={!badgeVisibility.announcement}>
              <Button
                color="inherit"
                onClick={(e) => handleMenu(e, setAnnouncementAnchor, clearAnnouncementChange)}
              >
                Announcements
              </Button>
            </Badge>
            <Menu
              anchorEl={announcementAnchor}
              open={Boolean(announcementAnchor)}
              onClose={() => setAnnouncementAnchor(null)}
            >
              <MenuItem onClick={() => handleMenuClose('/dashboard', setAnnouncementAnchor)}>
                Dashboard
              </MenuItem>
              {role === 'admin' && (
                <MenuItem onClick={() => handleMenuClose('/add-announcement', setAnnouncementAnchor)}>
                  Add Announcement
                </MenuItem>
              )}
              {role === 'admin' && (
                <MenuItem onClick={() => handleMenuClose('/vote-list', setAnnouncementAnchor)}>
                  VoteList
                </MenuItem>
              )}
            </Menu>

            {/* Events */}
            <Badge color="error" variant="dot" invisible={!badgeVisibility.event}>
              <Button
                color="inherit"
                onClick={(e) => handleMenu(e, setEventAnchor, clearEventChange)}
              >
                Events
              </Button>
            </Badge>
            <Menu
              anchorEl={eventAnchor}
              open={Boolean(eventAnchor)}
              onClose={() => setEventAnchor(null)}
            >
              <MenuItem onClick={() => handleMenuClose('/events', setEventAnchor)}>
                Event List
              </MenuItem>
              <MenuItem onClick={() => handleMenuClose('/mybookings', setEventAnchor)}>
                My Bookings
              </MenuItem>
              {role === 'admin' && (
                <MenuItem onClick={() => handleMenuClose('/add-event', setEventAnchor)}>
                  Add Event
                </MenuItem>
              )}
            </Menu>

            {/* Messages / Dues */}
            <Badge color="error" variant="dot" invisible={!badgeVisibility.message}>
              <Button
                color="inherit"
                onClick={(e) => handleMenu(e, setMessageAnchor, clearMessageChange)}
              >
                Dues
              </Button>
            </Badge>
            <Menu
              anchorEl={messageAnchor}
              open={Boolean(messageAnchor)}
              onClose={() => setMessageAnchor(null)}
            >
              <MenuItem onClick={() => handleMenuClose('/messages', setMessageAnchor)}>
                Dues
              </MenuItem>
              {role === 'admin' && (
                <MenuItem onClick={() => handleMenuClose('/add-message', setMessageAnchor)}>
                  Add Dues
                </MenuItem>
              )}
              {role === 'admin' && (
                <MenuItem onClick={() => handleMenuClose('/paidlist', setMessageAnchor)}>
                  Paid List
                </MenuItem>
              )}
            </Menu>

            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        )}

        {!token && (
          <Box>
            <Button color="inherit" onClick={() => navigate('/')}>
              Login
            </Button>
            <Button color="inherit" onClick={() => navigate('/signup')}>
              Sign Up
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Nav;
