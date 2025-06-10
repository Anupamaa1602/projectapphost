
// import React, { useEffect, useState } from 'react';                        //current working one  with badge and button disable for pay
// import {
//   Button, Card, CardActions, CardContent, Grid, Typography, Badge
// } from '@mui/material';
// import axiosInstance from '../axiosinterceptor';
// import { useNavigate } from 'react-router-dom';

// const Message = () => {
//   const [messages, setMessages] = useState([]);
//   const [highlightedMessages, setHighlightedMessages] = useState([]);
//   const navigate = useNavigate();

//   const token = localStorage.getItem('logintoken');
//   const role = localStorage.getItem('role');
//   const userEmail = token ? JSON.parse(atob(token.split('.')[1])).email : null;
//   const localStorageKey = `seenMessages_${userEmail}`;

//   useEffect(() => {
//     axiosInstance.get('http://localhost:3000/admin/messages')
//       .then(res => {
//         setMessages(res.data);

//         const seenDataRaw = localStorage.getItem(localStorageKey);
//         const seenData = seenDataRaw ? JSON.parse(seenDataRaw) : {};

//         const toHighlight = res.data
//           .filter(msg => {
//             const lastSeenUpdatedAt = seenData[msg._id];
//             return !lastSeenUpdatedAt || new Date(msg.updatedAt) > new Date(lastSeenUpdatedAt);
//           })
//           .map(msg => msg._id);

//         setHighlightedMessages(toHighlight);
//       })
//       .catch(() => alert('Failed to load messages'));
//   }, [localStorageKey]);

//   const clearHighlight = (id) => {
//     setHighlightedMessages(prev => prev.filter(mid => mid !== id));
//     const seenDataRaw = localStorage.getItem(localStorageKey);
//     const seenData = seenDataRaw ? JSON.parse(seenDataRaw) : {};
//     seenData[id] = new Date().toISOString();
//     localStorage.setItem(localStorageKey, JSON.stringify(seenData));
//   };

//   const handlePay = (id) => {
//     const message = messages.find(m => m._id === id);
//     if (!message) return;
//     clearHighlight(id);
//     navigate('/messages/make-payment', {
//       state: {
//         type: 'dues',
//         data: {
//           _id: message._id,
//           amount: message.amount,
//           title: message.title,
//            isPaid: message.isPaid,
//       paidBy: message.paidBy, //
//         },
//       },
//     });
//   };

//   const handleDelete = (id) => {
//     if (window.confirm('Are you sure you want to delete this message?')) {
//       axiosInstance.delete(`http://localhost:3000/admin/messages/delete/${id}`)
//         .then(() => {
//           alert('Message deleted');
//           setMessages(prev => prev.filter(m => m._id !== id));
//           clearHighlight(id);
//         })
//         .catch(() => alert('Failed to delete message'));
//     }
//   };

//   const handleUpdate = (msg) => {
//     clearHighlight(msg._id); // Mark as seen when updating
//     navigate(`/add-message/${msg._id}`, { state: { message: msg } });
//   };

//   const handleCardClick = (id) => {
//     clearHighlight(id);
//   };

//   return (
//     <div
//       style={{
//         backgroundImage: `url('https://img.freepik.com/free-photo/paper-background_53876-88628.jpg')`,
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//         minHeight: '100vh',
//         borderRadius: '10px',
//       }}
//     >
//       <div style={{ padding: 20 }}>
//         <Typography variant="h4" align="center" gutterBottom style={{ color: '#fff' }}>
//           Messages
//         </Typography>

//         <Grid container spacing={3}>
//           {messages.length === 0 ? (
//             <Typography style={{ color: '#fff' }}>No messages available.</Typography>
//           ) : (
//             messages.map(msg => {
//               const isHighlighted = highlightedMessages.includes(msg._id);

//               return (
//                 <Grid item xs={12} sm={6} md={4} key={msg._id}>
//                   <Badge
//                     color="error"
//                     variant="dot"
//                     // invisible={!isHighlighted}
//                     invisible={!isHighlighted || msg.isPaid}
//                     anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//                   >
//                     <Card
//                       onClick={() => handleCardClick(msg._id)}
//                       style={{
//                         backgroundColor: 'rgba(15, 15, 15, 0.7)',
//                         color: '#fff',
//                         borderRadius: '16px',
//                         boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
//                         padding: '16px',
//                         cursor: 'pointer',
//                       }}
//                     >
//                       <CardContent>
//                         <Typography variant="h6" style={{ color: '#f9a825' }}>
//                           {msg.title}
//                         </Typography>
//                         <Typography variant="body2" paragraph>{msg.content}</Typography>
//                         <Typography variant="body2" paragraph>Type :{msg.type}</Typography>

//                         <Typography variant="body2">
//                           {new Date(msg.createdAt).toLocaleString()}
//                         </Typography>
//                         <Typography variant="h6" style={{ color: '#f9a825' }}>
//                          Amount: {msg.amount} Rs
//                         </Typography>
//                       </CardContent>
//                       <CardActions>
//                         {/* <Button
//                           size="small"
//                           variant="contained"
//                           color="primary"
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             handlePay(msg._id);
//                           }}
//                         >
//                           Pay
//                         </Button> */}
//                         <Button
//                           variant="contained"
//                           color="success"
//                           disabled={msg.isPaid} // ✅ disables button if already paid
                          
//                           onClick={() => {
//                             navigate('/messages/make-payment', {
//                               state: {
//                                 type: 'dues',
//                                 data: msg,
//                               }
//                             });
//                           }}
//                         >
//                           {msg.isPaid ? 'Paid' : 'Pay'}
//                         </Button>
//                         {role === 'admin' && (
//                           <>
//                             <Button
//                               size="small"
//                               variant="contained"
//                               style={{ backgroundColor: 'rgb(92, 124, 156)' }}
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 handleUpdate(msg);
//                               }}
//                             >
//                               Update
//                             </Button>
//                             <Button
//                               size="small"
//                               variant="contained"
//                               color="error"
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 handleDelete(msg._id);
//                               }}
//                             >
//                               Delete
//                             </Button>
//                           </>
//                         )}
//                       </CardActions>
//                     </Card>
//                   </Badge>
//                 </Grid>
//               );
//             })
//           )}
//         </Grid>
//       </div>
//     </div>
//   );
// };

// export default Message;


// import React, { useEffect, useState } from 'react';            //  the working one
// import {
//   Button, Card, CardActions, CardContent, Grid, Typography, Badge
// } from '@mui/material';
// import axiosInstance from '../axiosinterceptor';
// import { useNavigate } from 'react-router-dom';

// const Message = () => {
//   const [messages, setMessages] = useState([]);
//   const [highlightedMessages, setHighlightedMessages] = useState([]);
//   const navigate = useNavigate();

//   const token = localStorage.getItem('logintoken');
//   const role = localStorage.getItem('role');
//   const userEmail = token ? JSON.parse(atob(token.split('.')[1])).email : null;
//   const localStorageKey = `seenMessages_${userEmail}`;

//   useEffect(() => {
//     axiosInstance.get('http://localhost:3000/admin/messages')
//       .then(res => {
//         setMessages(res.data);

//         const seenDataRaw = localStorage.getItem(localStorageKey);
//         const seenData = seenDataRaw ? JSON.parse(seenDataRaw) : {};

//         const toHighlight = res.data
//           .filter(msg => {
//             const lastSeenUpdatedAt = seenData[msg._id];
//             return !lastSeenUpdatedAt || new Date(msg.updatedAt) > new Date(lastSeenUpdatedAt);
//           })
//           .map(msg => msg._id);

//         setHighlightedMessages(toHighlight);
//       })
//       .catch(() => alert('Failed to load messages'));
//   }, [localStorageKey]);

//   const clearHighlight = (id) => {
//     setHighlightedMessages(prev => prev.filter(mid => mid !== id));
//     const seenDataRaw = localStorage.getItem(localStorageKey);
//     const seenData = seenDataRaw ? JSON.parse(seenDataRaw) : {};
//     seenData[id] = new Date().toISOString();
//     localStorage.setItem(localStorageKey, JSON.stringify(seenData));
//   };

//   const handleCardClick = (id) => {
//     clearHighlight(id);
//   };

//   const handleUpdate = (msg) => {
//     clearHighlight(msg._id);
//     navigate(`/add-message/${msg._id}`, { state: { message: msg } });
//   };

//   const handleDelete = (id) => {
//     if (window.confirm('Are you sure you want to delete this message?')) {
//       axiosInstance.delete(`http://localhost:3000/admin/messages/delete/${id}`)
//         .then(() => {
//           alert('Message deleted');
//           setMessages(prev => prev.filter(m => m._id !== id));
//           clearHighlight(id);
//         })
//         .catch(() => alert('Failed to delete message'));
//     }
//   };

//   return (
//     <div
//       style={{
//         backgroundImage: `url('https://img.freepik.com/free-photo/paper-background_53876-88628.jpg')`,
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//         minHeight: '100vh',
//         borderRadius: '10px',
//       }}
//     >
//       <div style={{ padding: 20 }}>
//         <Typography variant="h4" align="center" gutterBottom style={{ color: '#fff' }}>
//           Messages
//         </Typography>

//         <Grid container spacing={3}>
//           {messages.length === 0 ? (
//             <Typography style={{ color: '#fff' }}>No messages available.</Typography>
//           ) : (
//             messages.map(msg => {
//               const isHighlighted = highlightedMessages.includes(msg._id);
//               const isUserPaid = msg.isPaid && msg.paidBy === userEmail;

//               return (
//                 <Grid item xs={12} sm={6} md={4} key={msg._id}>
//                   <Badge
//                     color="error"
//                     variant="dot"
//                     invisible={!isHighlighted || isUserPaid}
//                     anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//                   >
//                     <Card
//                       onClick={() => handleCardClick(msg._id)}
//                       style={{
//                         backgroundColor: 'rgba(15, 15, 15, 0.7)',
//                         color: '#fff',
//                         borderRadius: '16px',
//                         boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
//                         padding: '16px',
//                         cursor: 'pointer',
//                       }}
//                     >
//                       <CardContent>
//                         <Typography variant="h6" style={{ color: '#f9a825' }}>
//                           {msg.title}
//                         </Typography>
//                         <Typography variant="body2" paragraph>{msg.content}</Typography>
//                         <Typography variant="body2" paragraph>Type: {msg.type}</Typography>
//                         <Typography variant="body2">
//                           {new Date(msg.createdAt).toLocaleString()}
//                         </Typography>
//                         <Typography variant="h6" style={{ color: '#f9a825' }}>
//                           Amount: {msg.amount} Rs
//                         </Typography>
//                       </CardContent>
//                       <CardActions>
//                         <Button
//                           variant="contained"
//                           color="success"
//                           disabled={isUserPaid}
//                           onClick={() => {
//                             clearHighlight(msg._id);
//                             navigate('/messages/make-payment', {
//                               state: {
//                                 type: 'dues',
//                                 data: msg,
//                               }
//                             });
//                           }}
//                         >
//                           {isUserPaid ? 'Paid' : 'Pay'}
//                         </Button>
//                         {role === 'admin' && (
//                           <>
//                             <Button
//                               size="small"
//                               variant="contained"
//                               style={{ backgroundColor: 'rgb(92, 124, 156)' }}
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 handleUpdate(msg);
//                               }}
//                             >
//                               Update
//                             </Button>
//                             <Button
//                               size="small"
//                               variant="contained"
//                               color="error"
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 handleDelete(msg._id);
//                               }}
//                             >
//                               Delete
//                             </Button>
//                           </>
//                         )}
//                       </CardActions>
//                     </Card>
//                   </Badge>
//                 </Grid>
//               );
//             })
//           )}
//         </Grid>
//       </div>
//     </div>
//   );
// };

// export default Message;




import React, { useEffect, useState } from 'react';                             //final one working
import {
  Button, Card, CardActions, CardContent, Grid, Typography, Badge
} from '@mui/material';
import axiosInstance from '../axiosinterceptor';
import { useNavigate } from 'react-router-dom';

const Message = () => {
  const [messages, setMessages] = useState([]);
  const [highlightedMessages, setHighlightedMessages] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem('logintoken');
  const role = localStorage.getItem('role');
  const userEmail = token ? JSON.parse(atob(token.split('.')[1])).email : null;
  const localStorageKey = `seenMessages_${userEmail}`;

  useEffect(() => {
    axiosInstance.get('/admin/messages')
      .then(res => {
        // Sort messages by updatedAt descending (latest first)
        const sortedMessages = res.data.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );
        setMessages(sortedMessages);

        const seenDataRaw = localStorage.getItem(localStorageKey);
        const seenData = seenDataRaw ? JSON.parse(seenDataRaw) : {};

        const toHighlight = sortedMessages
          .filter(msg => {
            const lastSeenUpdatedAt = seenData[msg._id];
            return !lastSeenUpdatedAt || new Date(msg.updatedAt) > new Date(lastSeenUpdatedAt);
          })
          .map(msg => msg._id);

        setHighlightedMessages(toHighlight);
      })
      .catch(() => alert('Failed to load messages'));
  }, [localStorageKey]);

  const clearHighlight = (id) => {
    setHighlightedMessages(prev => prev.filter(mid => mid !== id));
    const seenDataRaw = localStorage.getItem(localStorageKey);
    const seenData = seenDataRaw ? JSON.parse(seenDataRaw) : {};
    seenData[id] = new Date().toISOString();
    localStorage.setItem(localStorageKey, JSON.stringify(seenData));
  };

  const handleCardClick = (id) => {
    clearHighlight(id);
  };

  const handleUpdate = (msg) => {
    clearHighlight(msg._id);
    navigate(`/add-message/${msg._id}`, { state: { message: msg } });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      axiosInstance.delete(`/messages/delete/${id}`)
        .then(() => {
          alert('Message deleted');
          setMessages(prev => prev.filter(m => m._id !== id));
          clearHighlight(id);
        })
        .catch(() => alert('Failed to delete message'));
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url('https://img.freepik.com/free-photo/paper-background_53876-88628.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        borderRadius: '10px',
      }}
    >
      <div style={{ padding: 20 }}>
        <Typography variant="h4" align="center" gutterBottom style={{ color: '#fff' }}>
          Messages
        </Typography>

        <Grid container spacing={3}>
          {messages.length === 0 ? (
            <Typography style={{ color: '#fff' }}>No messages available.</Typography>
          ) : (
            messages.map(msg => {
              const isHighlighted = highlightedMessages.includes(msg._id);
              const isUserPaid = msg.isPaid && msg.paidBy === userEmail;

              return (
                <Grid item xs={12} sm={6} md={4} key={msg._id}>
                  <Badge
                    color="error"
                    variant="dot"
                    invisible={!isHighlighted}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  >
                    <Card
                      onClick={() => handleCardClick(msg._id)}
                      style={{
                        backgroundColor: 'rgba(15, 15, 15, 0.7)',
                        color: '#fff',
                        borderRadius: '16px',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
                        padding: '16px',
                        cursor: 'pointer',
                      }}
                    >
                      <CardContent>
                        <Typography variant="h6" style={{ color: '#f9a825' }}>
                          {msg.title}
                        </Typography>
                        <Typography variant="body2" paragraph>{msg.content}</Typography>
                        <Typography variant="body2" paragraph>Type: {msg.type}</Typography>
                        <Typography variant="body2">
                          {new Date(msg.createdAt).toLocaleString()}
                        </Typography>
                        <Typography variant="h6" style={{ color: '#f9a825' }}>
                          Amount: {msg.amount} Rs
                        </Typography>
                      </CardContent>
                      <CardActions>
                        {/* <Button
                          variant="contained"
                          color="success"
                          disabled={isUserPaid}
                          onClick={() => {
                            clearHighlight(msg._id);
                            navigate('/messages/make-payment', {
                              state: {
                                type: 'dues',
                                data: msg,
                              }
                            });
                          }}
                        >
                          {isUserPaid ? 'Paid' : 'Pay'}
                        </Button> */}

<Button
  variant="contained"
  color="success"
  disabled={isUserPaid}
  onClick={() => {
    clearHighlight(msg._id);
    navigate('/messages/make-payment', {
      state: {
        type: 'dues',
        data: msg,
      }
    });
  }}
  sx={{
    color: isUserPaid ? 'white' : 'inherit',
    '&.Mui-disabled': {
      color: 'white',             // Ensures white text when disabled
      backgroundColor: '#2e7d32'  // Optional: custom green if needed
    }
  }}
>
  {isUserPaid ? 'Paid' : 'Pay'}
</Button>


                        {role === 'admin' && (
                          <>
                            <Button
                              size="small"
                              variant="contained"
                              style={{ backgroundColor: 'rgb(92, 124, 156)' }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUpdate(msg);
                              }}
                            >
                              Update
                            </Button>
                            <Button
                              size="small"
                              variant="contained"
                              color="error"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(msg._id);
                              }}
                            >
                              Delete
                            </Button>
                          </>
                        )}
                      </CardActions>
                    </Card>
                  </Badge>
                </Grid>
              );
            })
          )}
        </Grid>
      </div>
    </div>
  );
};

export default Message;




