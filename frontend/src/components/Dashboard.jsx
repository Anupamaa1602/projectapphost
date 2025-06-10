
import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
  Badge,
} from '@mui/material';
import axiosInstance from '../axiosinterceptor';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [highlightedAnnouncements, setHighlightedAnnouncements] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem('logintoken');
  const role = localStorage.getItem('role');
  const userEmail = token ? JSON.parse(atob(token.split('.')[1])).email : null;
  const localStorageKey = `seenAnnouncements_${userEmail}`;

  useEffect(() => {
    axiosInstance.get('/admin/')
      .then(res => {
        setAnnouncements(res.data);

        const seenDataRaw = localStorage.getItem(localStorageKey);
        const seenData = seenDataRaw ? JSON.parse(seenDataRaw) : {};

        const toHighlight = res.data
          .filter(a => {
            const lastSeenUpdatedAt = seenData[a._id];
            return !lastSeenUpdatedAt || new Date(a.updatedAt) > new Date(lastSeenUpdatedAt);
          })
          .map(a => a._id);

        setHighlightedAnnouncements(toHighlight);
      })
      .catch(() => alert('Failed to load announcements'));
  }, [localStorageKey]);

  const clearHighlight = (id) => {
    setHighlightedAnnouncements(prev => prev.filter(aid => aid !== id));
    const seenDataRaw = localStorage.getItem(localStorageKey);
    const seenData = seenDataRaw ? JSON.parse(seenDataRaw) : {};
    seenData[id] = new Date().toISOString();
    localStorage.setItem(localStorageKey, JSON.stringify(seenData));
  };

  const handleVote = (id, voteType) => {
    if (!id || id.length !== 24) {
      alert('Invalid announcement ID');
      return;
    }

    axiosInstance.post(`/admin/vote/${id}`, { voteType })
      .then(res => {
        alert(res.data.message);
        setAnnouncements(prev => prev.map(a => {
          if (a._id === id) {
            return {
              ...a,
              likes: res.data.likes,
              dislikes: res.data.dislikes,
              votedUsers: [
                ...(Array.isArray(a.votedUsers) ? a.votedUsers : []),
                {
                  email: userEmail,
                  voteType,
                  updatedAtSnapshot: a.updatedAt
                }
              ],
            };
          }
          return a;
        }));
        clearHighlight(id);
      })
      .catch(err => {
        console.error('Vote Error:', err.response?.data || err.message);
        alert(err.response?.data?.message || 'Failed to vote');
      });
  };

  const handleUpdate = (announcement) => {
    clearHighlight(announcement._id);
    setAnnouncements(prev => prev.map(a => {
      if (a._id === announcement._id) {
        return {
          ...a,
          votedUsers: a.votedUsers.filter(v => v.email !== userEmail)
        };
      }
      return a;
    }));
    navigate(`/add-announcement/${announcement._id}`, { state: { announcement } });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      axiosInstance.delete(`/admin/delete/${id}`)
        .then(() => {
          alert('Announcement deleted');
          setAnnouncements(prev => prev.filter(a => a._id !== id));
          clearHighlight(id);
        })
        .catch(() => alert('Failed to delete announcement'));
    }
  };

  const handleCardClick = (id) => {
    clearHighlight(id);
  };

  return (
    <div
      style={{
        backgroundImage: `url('https://img.freepik.com/free-photo/paper-background_53876-88628.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        borderRadius: '10px',
        padding: 20,
      }}
    >
      <Typography variant="h4" align="center" gutterBottom style={{ color: '#fff' }}>
        Announcements Dashboard
      </Typography>

      {announcements.length === 0 ? (
        <Typography style={{ color: '#fff' }}>No announcements available.</Typography>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px',
          }}
        >
          {announcements.map((announcement) => {
            const isHighlighted = highlightedAnnouncements.includes(announcement._id);
            const userVote = Array.isArray(announcement.votedUsers)
              ? announcement.votedUsers.find(
                  (v) =>
                    v.email === userEmail &&
                    v.updatedAtSnapshot &&
                    new Date(v.updatedAtSnapshot).getTime() === new Date(announcement.updatedAt).getTime()
                )
              : null;

            return (
              <Badge
                key={announcement._id}
                color="error"
                variant="dot"
                invisible={!isHighlighted}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <Card
                  onClick={() => handleCardClick(announcement._id)}
                  style={{
                    backgroundColor: 'rgba(15, 15, 15, 0.7)',
                    color: '#fff',
                    borderRadius: '16px',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '320px',
                    width: '100%',
                  }}
                >
                  <CardContent style={{ flexGrow: 1, overflowY: 'auto' }}>
                    <Typography variant="h6" style={{ color: '#f9a825' }}>
                      {announcement.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 4,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {announcement.message}
                    </Typography>
                    <Typography variant="body2">
                      {new Date(announcement.createdAt).toLocaleString()}
                    </Typography>
                    <Typography variant="body2">
                      Likes: {announcement.likes} | Dislikes: {announcement.dislikes}
                    </Typography>
                  </CardContent>

                  {/* <CardActions>
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px',
                        justifyContent: 'center',
                        width: '100%',
                      }}
                    >
                      <Button
                        size="small"
                        variant={userVote?.voteType === 'like' ? 'contained' : 'outlined'}
                        color="primary"
                        disabled={!!userVote}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVote(announcement._id, 'like');
                        }}
                      >
                        👍 Like
                      </Button>
                      <Button
                        size="small"
                        variant={userVote?.voteType === 'dislike' ? 'contained' : 'outlined'}
                        color="error"
                        disabled={!!userVote}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVote(announcement._id, 'dislike');
                        }}
                      >
                        👎 Dislike
                      </Button>
                      {role === 'admin' && (
                        <>
                          <Button
                            size="small"
                            variant="contained"
                            style={{ backgroundColor: 'rgb(92, 124, 156)' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdate(announcement);
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
                              handleDelete(announcement._id);
                            }}
                          >
                            Delete
                          </Button>
                        </>
                      )}
                    </div>
                  </CardActions> */}
                  <CardActions>
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      width: '100%',
    }}
  >
    {/* Like/Dislike row */}
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '8px',
        flexWrap: 'wrap',
      }}
    >
      {/* <Button
        size="small"
        variant={userVote?.voteType === 'like' ? 'contained' : 'outlined'}
        color="primary"
        disabled={!!userVote}
        onClick={(e) => {
          e.stopPropagation();
          handleVote(announcement._id, 'like');
        }}
      >
        👍 Like
      </Button>
      <Button
        size="small"
        variant={userVote?.voteType === 'dislike' ? 'contained' : 'outlined'}
        color="error"
        backgroundColor="red"
        disabled={!!userVote}
        onClick={(e) => {
          e.stopPropagation();
          handleVote(announcement._id, 'dislike');
        }}
      >
        👎 Dislike
      </Button> */}
<Button
  size="small"
  onClick={(e) => {
    e.stopPropagation();
    handleVote(announcement._id, 'like');
  }}
  disabled={!!userVote}
  sx={{
    backgroundColor: userVote?.voteType === 'like' ? '#1565c0' : '#90caf9', // dark blue if voted, light blue otherwise
    color: 'black',
    border: '1px solid #1565c0',
    '&:hover': {
      backgroundColor: '#1565c0',
    },
  }}
>
  👍 Like
</Button>

<Button
  size="small"
  onClick={(e) => {
    e.stopPropagation();
    handleVote(announcement._id, 'dislike');
  }}
  disabled={!!userVote}
  sx={{
    backgroundColor: userVote?.voteType === 'dislike' ? '#c62828' : '#ef9a9a', // dark red if voted, light red otherwise
    color: 'black',
    border: '1px solid #c62828',
    '&:hover': {
      backgroundColor: '#c62828',
    },
  }}
>
  👎 Dislike
</Button>


      
    </div>

    {/* Update/Delete row (only for admin) */}
    {role === 'admin' && (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          flexWrap: 'wrap',
        }}
      >
        <Button
          size="small"
          variant="contained"
          style={{ backgroundColor: 'rgb(92, 124, 156)' }}
          onClick={(e) => {
            e.stopPropagation();
            handleUpdate(announcement);
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
            handleDelete(announcement._id);
          }}
        >
          Delete
        </Button>
      </div>
    )}
  </div>
</CardActions>

                </Card>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dashboard;





// src/components/Dashboard.jsx
// import React, { useEffect, useState, useCallback } from 'react';
// import {
//   Button, Card, CardActions, CardContent, Grid, Typography, Badge
// } from '@mui/material';
// import axiosInstance from '../axiosinterceptor'; // Ensure this is correctly configured
// import { useNavigate } from 'react-router-dom';

// const Dashboard = () => {
//   const [announcements, setAnnouncements] = useState([]);
//   const [highlightedAnnouncements, setHighlightedAnnouncements] = useState([]);
//   const navigate = useNavigate();

//   const token = localStorage.getItem('logintoken');
//   const role = localStorage.getItem('role');
//   // Decode user email from token payload; ensures consistent user identifier
//   const userEmail = token ? JSON.parse(atob(token.split('.')[1])).email : null;
//   const localStorageKey = `seenAnnouncements_${userEmail}`;

//   // Memoize clearHighlight to prevent unnecessary re-renders
//   const clearHighlight = useCallback((id) => {
//     setHighlightedAnnouncements(prev => prev.filter(aid => aid !== id));
//     const seenDataRaw = localStorage.getItem(localStorageKey);
//     const seenData = seenDataRaw ? JSON.parse(seenDataRaw) : {};

//     // Find the announcement in the current state to get its updatedAt timestamp
//     const announcementToUpdate = announcements.find(a => a._id === id);
//     if (announcementToUpdate) {
//       seenData[id] = announcementToUpdate.updatedAt; // Store the *exact* updatedAt from the fetched data
//     } else {
//       // Fallback: if for some reason announcement is not in state, use current time
//       seenData[id] = new Date().toISOString();
//     }
//     localStorage.setItem(localStorageKey, JSON.stringify(seenData));
//   }, [localStorageKey, announcements]); // Include 'announcements' as a dependency

//   // Memoize fetchAnnouncements for better useEffect management
//   const fetchAnnouncements = useCallback(async () => {
//     try {
//       const res = await axiosInstance.get('http://localhost:3000/admin/'); // Your GET announcements endpoint
//       setAnnouncements(res.data);

//       const seenDataRaw = localStorage.getItem(localStorageKey);
//       const seenData = seenDataRaw ? JSON.parse(seenDataRaw) : {};

//       const toHighlight = res.data
//         .filter(a => {
//           const lastSeenUpdatedAt = seenData[a._id];
//           // Highlight if no record, or if announcement's updatedAt is newer than last seen
//           return !lastSeenUpdatedAt || new Date(a.updatedAt) > new Date(lastSeenUpdatedAt);
//         })
//         .map(a => a._id);

//       setHighlightedAnnouncements(toHighlight);
//     } catch (error) {
//       console.error('Failed to load announcements:', error);
//       alert('Failed to load announcements');
//     }
//   }, [localStorageKey]); // Dependencies for useCallback

//   // Fetch announcements on component mount
//   useEffect(() => {
//     fetchAnnouncements();
//   }, [fetchAnnouncements]); // Depend on the memoized fetchAnnouncements

//   const handleVote = async (id, voteType) => {
//     if (!id || id.length !== 24) { // Basic ID validation
//       alert('Invalid announcement ID');
//       return;
//     }

//     try {
//       const res = await axiosInstance.post(`http://localhost:3000/admin/vote/${id}`, { voteType });
//       alert(res.data.message);

//       // Optimistically update the state after a successful vote
//       setAnnouncements(prev => prev.map(a => {
//         if (a._id === id) {
//           // Find the current announcement data from the state before updating
//           const currentAnnouncement = announcements.find(ann => ann._id === id);
//           const currentUpdatedAt = currentAnnouncement ? currentAnnouncement.updatedAt : new Date().toISOString();

//           return {
//             ...a,
//             likes: res.data.likes,
//             dislikes: res.data.dislikes,
//             votedUsers: [
//               // Filter out any existing vote by this user (if any, though backend prevents double vote)
//               ...(Array.isArray(a.votedUsers) ? a.votedUsers.filter(v => v.email !== userEmail) : []),
//               {
//                 email: userEmail,
//                 voteType,
//                 votedAt: new Date().toISOString(),
//                 // This is crucial: use the announcement's `updatedAt` at the moment of voting
//                 updatedAtSnapshot: currentUpdatedAt
//               }
//             ],
//           };
//         }
//         return a;
//       }));
//       clearHighlight(id); // Clear highlight after successful vote
//     } catch (err) {
//       console.error('Vote Error:', err.response?.data || err.message);
//       alert(err.response?.data?.message || 'Failed to vote');
//     }
//   };

//   const handleUpdate = (announcement) => {
//     setAnnouncements(prev => prev.map(a => {
//       if (a._id === announcement._id) {
//         return {
//           ...a,
//           votedUsers: a.votedUsers.filter(v => v.email !== userEmail) // Remove user's previous vote
//         };
//       }
//       return a;
//     }));

//     clearHighlight(announcement._id); // Mark as seen (or pending update notification removal)
//     navigate(`/add-announcement/${announcement._id}`, { state: { announcement } });
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this ?')) {
//       try {
//         await axiosInstance.delete(`http://localhost:3000/admin/delete/${id}`); // Your DELETE endpoint
//         alert('Announcement deleted');
//         setAnnouncements(prev => prev.filter(a => a._id !== id)); // Remove from state
//         clearHighlight(id); // Clear any highlight
//       } catch (error) {
//         console.error('Delete Error:', error);
//         alert('Failed to delete announcement');
//       }
//     }
//   };

//   // When card is clicked, mark it as seen (clears the highlight badge)
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
//           Announcements Dashboard
//         </Typography>

//         <Grid container spacing={3}>
//           {announcements.length === 0 ? (
//             <Typography style={{ color: '#fff', marginLeft: '20px' }}>No announcements available.</Typography>
//           ) : (
//             announcements.map(announcement => {
//               const isHighlighted = highlightedAnnouncements.includes(announcement._id);

//               // Determine if the current user has voted on THIS SPECIFIC VERSION of the announcement
//               const userVote = Array.isArray(announcement.votedUsers)
//                 ? announcement.votedUsers.find(v =>
//                     v.email === userEmail &&
//                     v.updatedAtSnapshot && // Ensure the snapshot exists
//                     // Compare the vote's recorded `updatedAtSnapshot` with the announcement's current `updatedAt`
//                     new Date(v.updatedAtSnapshot).getTime() === new Date(announcement.updatedAt).getTime()
//                   )
//                 : null;

//               return (
//                 <Grid item xs={12} sm={6} md={4} key={announcement._id}>
//                   <Badge
//                     color="error"
//                     variant="dot"
//                     invisible={!isHighlighted}
//                     anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//                   >
//                     <Card
//                       onClick={() => handleCardClick(announcement._id)}
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
//                           {announcement.title}
//                         </Typography>
//                         <Typography variant="body2" paragraph>{announcement.message}</Typography>
//                         <Typography variant="body2">
//                           Created: {new Date(announcement.createdAt).toLocaleString()}
//                         </Typography>
//                         {announcement.createdAt !== announcement.updatedAt && (
//                            <Typography variant="body2">
//                              Last Updated: {new Date(announcement.updatedAt).toLocaleString()}
//                            </Typography>
//                         )}
//                         <Typography variant="body2">
//                           Likes: {announcement.likes} | Dislikes: {announcement.dislikes}
//                         </Typography>
//                       </CardContent>
//                       <CardActions>
//                         <Button
//                           size="small"
//                           variant={userVote?.voteType === 'like' ? 'contained' : 'outlined'}
//                           color="primary"
//                           // Disable if userVote exists (meaning user has voted on this exact version)
//                           disabled={!!userVote}
//                           onClick={(e) => { e.stopPropagation(); handleVote(announcement._id, 'like'); }}
//                         >
//                           👍 Like
//                         </Button>
//                         <Button
//                           size="small"
//                           variant={userVote?.voteType === 'dislike' ? 'contained' : 'outlined'}
//                           color="error"
//                           // Disable if userVote exists
//                           disabled={!!userVote}
//                           onClick={(e) => { e.stopPropagation(); handleVote(announcement._id, 'dislike'); }}
//                         >
//                           👎 Dislike
//                         </Button>

//                         {role === 'admin' && ( // Only show admin buttons if user role is 'admin'
//                           <>
//                             <Button
//                               size="small"
//                               variant="contained"
//                               style={{ backgroundColor: 'rgb(92, 124, 156)' }}
//                               onClick={(e) => { e.stopPropagation(); handleUpdate(announcement); }}
//                             >
//                               Update
//                             </Button>
//                             <Button
//                               size="small"
//                               variant="contained"
//                               color="error"
//                               onClick={(e) => { e.stopPropagation(); handleDelete(announcement._id); }}
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

// export default Dashboard;


// import React, { useEffect, useState } from 'react';                         //last edited
// import {
//   Button, Card, CardActions, CardContent, Grid, Typography, Badge
// } from '@mui/material';
// import axiosInstance from '../axiosinterceptor';
// import { useNavigate, useLocation } from 'react-router-dom';

// const Dashboard = () => {
//   const [announcements, setAnnouncements] = useState([]);
//   const [highlightedAnnouncements, setHighlightedAnnouncements] = useState([]);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const token = localStorage.getItem('logintoken');
//   const role = localStorage.getItem('role');
//   const userEmail = token ? JSON.parse(atob(token.split('.')[1])).email : null;
//   const localStorageKey = `seenAnnouncements_${userEmail}`;
//   const updatedAnnouncement = location.state?.updatedAnnouncement;

//   useEffect(() => {
//     axiosInstance.get('http://localhost:3000/admin/')
//       .then(res => {
//         let announcementList = res.data;

//         // Replace updated announcement if it exists
//         if (updatedAnnouncement) {
//           announcementList = announcementList.map(a =>
//             a._id === updatedAnnouncement._id ? updatedAnnouncement : a
//           );
//         }

//         setAnnouncements(announcementList);

//         const seenDataRaw = localStorage.getItem(localStorageKey);
//         const seenData = seenDataRaw ? JSON.parse(seenDataRaw) : {};

//         const toHighlight = announcementList
//           .filter(a => {
//             const lastSeenUpdatedAt = seenData[a._id];
//             return !lastSeenUpdatedAt || new Date(a.updatedAt) > new Date(lastSeenUpdatedAt);
//           })
//           .map(a => a._id);

//         setHighlightedAnnouncements(toHighlight);
//       })
//       .catch(() => alert('Failed to load announcements'));
//   }, [localStorageKey, updatedAnnouncement]);

//   const clearHighlight = (id) => {
//     setHighlightedAnnouncements(prev => prev.filter(aid => aid !== id));
//     const seenDataRaw = localStorage.getItem(localStorageKey);
//     const seenData = seenDataRaw ? JSON.parse(seenDataRaw) : {};
//     seenData[id] = new Date().toISOString();
//     localStorage.setItem(localStorageKey, JSON.stringify(seenData));
//   };

//   // const handleVote = (id, voteType) => {
//   //   axiosInstance.post(`http://localhost:3000/admin/vote/${id}`, { voteType })
//   //     .then(res => {
//   //       alert(res.data.message);
//   //       setAnnouncements(prev => prev.map(a => {
//   //         if (a._id === id) {
//   //           return {
//   //             ...a,
//   //             likes: res.data.likes,
//   //             dislikes: res.data.dislikes,
//   //             votedUsers: [...a.votedUsers, {
//   //               email: userEmail,
//   //               voteType,
//   //               updatedAtSnapshot: a.updatedAt
//   //             }],
//   //           };
//   //         }
//   //         return a;
//   //       }));
//   //       clearHighlight(id);
//   //     })
//   //     .catch(() => alert('Failed to vote'));
//   // };
// const handleVote = (id, voteType) => {
//   axiosInstance.post(`http://localhost:3000/admin/vote/${id}`, { voteType })
//     .then(res => {
//       alert(res.data.message);
//       const updatedAnnouncement = res.data.announcement;
//       setAnnouncements(prev => prev.map(a => a._id === id ? updatedAnnouncement : a));
//       clearHighlight(id);
//     })
//     .catch(err => {
//       if (err.response && err.response.data?.message) {
//         alert(err.response.data.message);
//       } else {
//         alert('Failed to vote');
//       }
//     });
// };

//   const handleUpdate = (announcement) => {
//     clearHighlight(announcement._id);
//     navigate(`/add-announcement/${announcement._id}`, { state: { announcement } });
//   };

//   const handleDelete = (id) => {
//     if (window.confirm('Are you sure you want to delete this announcement?')) {
//       axiosInstance.delete(`http://localhost:3000/admin/delete/${id}`)
//         .then(() => {
//           alert('Announcement deleted');
//           setAnnouncements(prev => prev.filter(a => a._id !== id));
//           clearHighlight(id);
//         })
//         .catch(() => alert('Failed to delete announcement'));
//     }
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
//           Announcements Dashboard
//         </Typography>

//         <Grid container spacing={3}>
//           {announcements.length === 0 ? (
//             <Typography style={{ color: '#fff' }}>No announcements available.</Typography>
//           ) : (
//             announcements.map(announcement => {
//               const isHighlighted = highlightedAnnouncements.includes(announcement._id);
//               // const userVote = announcement.votedUsers.find(v =>
//               //   v.email === userEmail &&
//               //   new Date(v.updatedAtSnapshot).getTime() === new Date(announcement.updatedAt).getTime()
//               // );
// const userVote = announcement.votedUsers.find(v => v.email === userEmail);

//               return (
//                 <Grid item xs={12} sm={6} md={4} key={announcement._id}>
//                   <Badge
//                     color="error"
//                     variant="dot"
//                     invisible={!isHighlighted}
//                     anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//                   >
//                     <Card
//                       onClick={() => handleCardClick(announcement._id)}
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
//                           {announcement.title}
//                         </Typography>
//                         <Typography variant="body2" paragraph>{announcement.message}</Typography>
//                         <Typography variant="body2">
//                           {new Date(announcement.createdAt).toLocaleString()}
//                         </Typography>
//                         <Typography variant="body2">
//                           Likes: {announcement.likes} | Dislikes: {announcement.dislikes}
//                         </Typography>
//                       </CardContent>
//                       <CardActions>
//                         <Button
//                           size="small"
//                           variant={userVote?.voteType === 'like' ? 'contained' : 'outlined'}
//                           color="primary"
//                           disabled={!!userVote}
//                           onClick={(e) => { e.stopPropagation(); handleVote(announcement._id, 'like'); }}
//                         >
//                           👍 Like
//                         </Button>
//                         <Button
//                           size="small"
//                           variant={userVote?.voteType === 'dislike' ? 'contained' : 'outlined'}
//                           color="error"
//                           disabled={!!userVote}
//                           onClick={(e) => { e.stopPropagation(); handleVote(announcement._id, 'dislike'); }}
//                         >
//                           👎 Dislike
//                         </Button>

//                         {role === 'admin' && (
//                           <>
//                             <Button
//                               size="small"
//                               variant="contained"
//                               style={{ backgroundColor: 'rgb(92, 124, 156)' }}
//                               onClick={(e) => { e.stopPropagation(); handleUpdate(announcement); }}
//                             >
//                               Update
//                             </Button>
//                             <Button
//                               size="small"
//                               variant="contained"
//                               color="error"
//                               onClick={(e) => { e.stopPropagation(); handleDelete(announcement._id); }}
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

// export default Dashboard;


// import React, { useEffect, useState } from 'react';
// import {
//   Button, Card, CardActions, CardContent, Grid, Typography, Badge
// } from '@mui/material';
// import axiosInstance from '../axiosinterceptor';
// import { useNavigate, useLocation } from 'react-router-dom';

// const Dashboard = () => {
//   const [announcements, setAnnouncements] = useState([]);
//   const [highlightedAnnouncements, setHighlightedAnnouncements] = useState([]);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const token = localStorage.getItem('logintoken');
//   const role = localStorage.getItem('role');
//   const userEmail = token ? JSON.parse(atob(token.split('.')[1])).email : null;
//   const localStorageKey = `seenAnnouncements_${userEmail}`;
//   const updatedAnnouncement = location.state?.updatedAnnouncement;

//   useEffect(() => {
//     axiosInstance.get('http://localhost:3000/admin/')
//       .then(res => {
//         let announcementList = res.data;

//         if (updatedAnnouncement) {
//           announcementList = announcementList.map(a =>
//             a._id === updatedAnnouncement._id ? updatedAnnouncement : a
//           );
//         }

//         setAnnouncements(announcementList);

//         const seenDataRaw = localStorage.getItem(localStorageKey);
//         const seenData = seenDataRaw ? JSON.parse(seenDataRaw) : {};

//         const toHighlight = announcementList
//           .filter(a => {
//             const lastSeenUpdatedAt = seenData[a._id];
//             return !lastSeenUpdatedAt || new Date(a.updatedAt) > new Date(lastSeenUpdatedAt);
//           })
//           .map(a => a._id);

//         setHighlightedAnnouncements(toHighlight);
//       })
//       .catch(() => alert('Failed to load announcements'));
//   }, [localStorageKey, updatedAnnouncement]);

//   const clearHighlight = (id) => {
//     setHighlightedAnnouncements(prev => prev.filter(aid => aid !== id));
//     const seenDataRaw = localStorage.getItem(localStorageKey);
//     const seenData = seenDataRaw ? JSON.parse(seenDataRaw) : {};
//     seenData[id] = new Date().toISOString();
//     localStorage.setItem(localStorageKey, JSON.stringify(seenData));
//   };

//   const handleVote = (id, voteType) => {
//     axiosInstance.post(`http://localhost:3000/admin/vote/${id}`, { voteType })
//       .then(res => {
//         alert(res.data.message);
//         const updatedAnnouncement = res.data.announcement;
//         setAnnouncements(prev => prev.map(a => a._id === id ? updatedAnnouncement : a));
//         clearHighlight(id);
//       })
//       .catch(err => {
//         if (err.response?.data?.message) {
//           alert(err.response.data.message);
//         } else {
//           alert('Failed to vote');
//         }
//       });
//   };

//   const handleUpdate = (announcement) => {
//     clearHighlight(announcement._id);
//     navigate(`/add-announcement/${announcement._id}`, { state: { announcement } });
//   };

//   const handleDelete = (id) => {
//     if (window.confirm('Are you sure you want to delete this announcement?')) {
//       axiosInstance.delete(`http://localhost:3000/admin/delete/${id}`)
//         .then(() => {
//           alert('Announcement deleted');
//           setAnnouncements(prev => prev.filter(a => a._id !== id));
//           clearHighlight(id);
//         })
//         .catch(() => alert('Failed to delete announcement'));
//     }
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
//           Announcements Dashboard
//         </Typography>

//         <Grid container spacing={3}>
//           {announcements.length === 0 ? (
//             <Typography style={{ color: '#fff' }}>No announcements available.</Typography>
//           ) : (
//             announcements.map(announcement => {
//               const isHighlighted = highlightedAnnouncements.includes(announcement._id);
//               const userVote = announcement.votedUsers.find(v => v.email === userEmail);

//               return (
//                 <Grid item xs={12} sm={6} md={4} key={announcement._id}>
//                   <Badge
//                     color="error"
//                     variant="dot"
//                     invisible={!isHighlighted}
//                     anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//                   >
//                     <Card
//                       onClick={() => handleCardClick(announcement._id)}
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
//                           {announcement.title}
//                         </Typography>
//                         <Typography variant="body2" paragraph>{announcement.message}</Typography>
//                         <Typography variant="body2">
//                           {new Date(announcement.createdAt).toLocaleString()}
//                         </Typography>
//                         <Typography variant="body2">
//                           Likes: {announcement.likes} | Dislikes: {announcement.dislikes}
//                         </Typography>
//                       </CardContent>
//                       <CardActions>
//                         <Button
//                           size="small"
//                           variant={userVote?.voteType === 'like' ? 'contained' : 'outlined'}
//                           color="primary"
//                           disabled={!!userVote}
//                           onClick={(e) => { e.stopPropagation(); handleVote(announcement._id, 'like'); }}
//                         >
//                           👍 Like
//                         </Button>
//                         <Button
//                           size="small"
//                           variant={userVote?.voteType === 'dislike' ? 'contained' : 'outlined'}
//                           color="error"
//                           disabled={!!userVote}
//                           onClick={(e) => { e.stopPropagation(); handleVote(announcement._id, 'dislike'); }}
//                         >
//                           👎 Dislike
//                         </Button>

//                         {role === 'admin' && (
//                           <>
//                             <Button
//                               size="small"
//                               variant="contained"
//                               style={{ backgroundColor: 'rgb(92, 124, 156)' }}
//                               onClick={(e) => { e.stopPropagation(); handleUpdate(announcement); }}
//                             >
//                               Update
//                             </Button>
//                             <Button
//                               size="small"
//                               variant="contained"
//                               color="error"
//                               onClick={(e) => { e.stopPropagation(); handleDelete(announcement._id); }}
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

// export default Dashboard;






// import React, { useEffect, useState } from 'react';
// import axiosInstance from '../axiosinterceptor';
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   Button,
//   Grid,
//   Snackbar,
//   Alert,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
// } from '@mui/material';

// const Dashboard = () => {
//   const [announcements, setAnnouncements] = useState([]);
//   const [message, setMessage] = useState('');
//   const [severity, setSeverity] = useState('success');
//   const [openSnackbar, setOpenSnackbar] = useState(false);
//   const [userRole, setUserRole] = useState('');
//   const [editDialogOpen, setEditDialogOpen] = useState(false);
//   const [editAnnouncement, setEditAnnouncement] = useState({ title: '', message: '', _id: '' });

//   useEffect(() => {
//     fetchAnnouncements();
//     decodeUser();
//   }, []);

//   const decodeUser = () => {
//     const token = localStorage.getItem('token');
//     if (!token) return;
//     try {
//       const payload = JSON.parse(atob(token.split('.')[1]));
//       setUserRole(payload.role);
//     } catch (err) {
//       console.error('Invalid token');
//     }
//   };

//   const fetchAnnouncements = async () => {
//     try {
//       const response = await axiosInstance.get('http://localhost:3000/admin/');
//       setAnnouncements(response.data);
//     } catch (error) {
//       console.error('Error fetching announcements:', error);
//     }
//   };

//   const handleVote = async (id, voteType) => {
//     try {
//       const res = await axiosInstance.post(`http://localhost:3000/admin/vote/${id}`, { voteType });
//       setMessage(res.data.message);
//       setSeverity('success');
//       setOpenSnackbar(true);
//       fetchAnnouncements();
//     } catch (error) {
//       setMessage(error.response?.data?.message || 'Voting failed');
//       setSeverity('error');
//       setOpenSnackbar(true);
//     }
//   };

//   const hasVoted = (announcement) => {
//     const token = localStorage.getItem('token');
//     if (!token) return true;
//     const payload = JSON.parse(atob(token.split('.')[1]));
//     const userEmail = payload.email;

//     return announcement.votedUsers?.some(
//       (vote) =>
//         vote.email === userEmail &&
//         vote.updatedAtSnapshot &&
//         new Date(vote.updatedAtSnapshot).getTime() === new Date(announcement.updatedAt).getTime()
//     );
//   };

//   const handleDelete = async (id) => {
//     try {
//       await axiosInstance.delete(`/api/announcements/${id}`);
//       setMessage('Announcement deleted successfully');
//       setSeverity('success');
//       setOpenSnackbar(true);
//       fetchAnnouncements();
//     } catch (error) {
//       setMessage('Failed to delete announcement');
//       setSeverity('error');
//       setOpenSnackbar(true);
//     }
//   };

//   const handleEditOpen = (announcement) => {
//     setEditAnnouncement(announcement);
//     setEditDialogOpen(true);
//   };

//   const handleEditSave = async () => {
//     try {
//       await axiosInstance.put(`/api/announcements/${editAnnouncement._id}`, {
//         title: editAnnouncement.title,
//         message: editAnnouncement.message,
//       });
//       setMessage('Announcement updated');
//       setSeverity('success');
//       setOpenSnackbar(true);
//       setEditDialogOpen(false);
//       fetchAnnouncements();
//     } catch (err) {
//       setMessage('Update failed');
//       setSeverity('error');
//       setOpenSnackbar(true);
//     }
//   };

//   return (
//     <Box sx={{ p: 3 }}>
//       <Typography variant="h4" gutterBottom>
//         Announcements
//       </Typography>

//       <Grid container spacing={3}>
//         {announcements.map((announcement) => (
//           <Grid item xs={12} md={6} key={announcement._id}>
//             <Card sx={{ p: 2 }}>
//               <CardContent>
//                 <Typography variant="h6">{announcement.title}</Typography>

//                 <Typography variant="body2" sx={{ mb: 2 }}>
//                   {announcement.message}
//                 </Typography>

//                 <Typography variant="body2" sx={{ mb: 1 }}>
//                   Likes: {announcement.likes} | Dislikes: {announcement.dislikes}
//                 </Typography>

//                 <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
//                   <Button
//                     variant="contained"
//                     color="primary"
//                     onClick={() => handleVote(announcement._id, 'like')}
//                     disabled={hasVoted(announcement)}
//                   >
//                     Like
//                   </Button>
//                   <Button
//                     variant="contained"
//                     color="error"
//                     onClick={() => handleVote(announcement._id, 'dislike')}
//                     disabled={hasVoted(announcement)}
//                   >
//                     Dislike
//                   </Button>

//                   {userRole === 'admin' && (
//                     <>
//                       <Button
//                         variant="outlined"
//                         color="secondary"
//                         onClick={() => handleEditOpen(announcement)}
//                       >
//                         Edit
//                       </Button>
//                       <Button
//                         variant="outlined"
//                         color="error"
//                         onClick={() => handleDelete(announcement._id)}
//                       >
//                         Delete
//                       </Button>
//                     </>
//                   )}
//                 </Box>
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>

//       {/* Edit Dialog */}
//       <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
//         <DialogTitle>Edit Announcement</DialogTitle>
//         <DialogContent>
//           <TextField
//             margin="dense"
//             label="Title"
//             fullWidth
//             value={editAnnouncement.title}
//             onChange={(e) => setEditAnnouncement({ ...editAnnouncement, title: e.target.value })}
//           />
//           <TextField
//             margin="dense"
//             label="Message"
//             fullWidth
//             multiline
//             minRows={3}
//             value={editAnnouncement.message}
//             onChange={(e) =>
//               setEditAnnouncement({ ...editAnnouncement, message: e.target.value })
//             }
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
//           <Button onClick={handleEditSave} variant="contained">
//             Save
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Snackbar */}
//       <Snackbar
//         open={openSnackbar}
//         autoHideDuration={4000}
//         onClose={() => setOpenSnackbar(false)}
//       >
//         <Alert
//           severity={severity}
//           onClose={() => setOpenSnackbar(false)}
//           sx={{ width: '100%' }}
//         >
//           {message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default Dashboard;




// import React, { useEffect, useState } from 'react';
// import axiosInstance from '../axiosinterceptor'; // Adjust this path if needed

// const Dashboard = () => {
//   const [announcements, setAnnouncements] = useState([]);
//   const [alertMsg, setAlertMsg] = useState('');
//   const [alertType, setAlertType] = useState('info');

//   const user = JSON.parse(localStorage.getItem('user'));

//   const fetchAnnouncements = async () => {
//     try {
//       const res = await axiosInstance.get('http://localhost:3000/admin/');
//       setAnnouncements(res.data);
//     } catch (err) {
//       showAlert('Failed to load announcements', 'error');
//     }
//   };

//   const handleVote = async (id, voteType) => {
//     try {
//       const res = await axiosInstance.post(`http://localhost:3000/admin/vote/${id}`, { voteType });
//       showAlert(res.data.message, 'success');
//       fetchAnnouncements();
//     } catch (err) {
//       const msg = err.response?.data?.message || 'Vote failed';
//       showAlert(msg, 'error');
//     }
//   };

//   const showAlert = (message, type = 'info') => {
//     setAlertMsg(message);
//     setAlertType(type);
//     setTimeout(() => setAlertMsg(''), 3000);
//   };

//   useEffect(() => {
//     fetchAnnouncements();
//   }, []);

//   return (
//     <div style={styles.container}>
//       <h2>Announcements</h2>
//       {alertMsg && <div style={{ ...styles.alert, ...styles[alertType] }}>{alertMsg}</div>}

//       <div style={styles.grid}>
//         {announcements.map((announcement) => (
//           <div key={announcement._id} style={styles.card}>
//             <h3>{announcement.title}</h3>
//             <p style={styles.timestamp}>
//               {new Date(announcement.createdAt).toLocaleString()}
//             </p>
//             <p>{announcement.message}</p>

//             <div style={styles.actions}>
//               <button onClick={() => handleVote(announcement._id, 'like')} style={styles.voteBtn}>
//                 👍 Like
//               </button>
//               <span>{announcement.likes}</span>

//               <button onClick={() => handleVote(announcement._id, 'dislike')} style={styles.voteBtn}>
//                 👎 Dislike
//               </button>
//               <span>{announcement.dislikes}</span>

//               {user?.role === 'admin' && (
//                 <>
//                   <button style={{ ...styles.btn, ...styles.editBtn }}>Edit</button>
//                   <button style={{ ...styles.btn, ...styles.deleteBtn }}>Delete</button>
//                 </>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     padding: '2rem',
//     maxWidth: '1000px',
//     margin: 'auto',
//   },
//   grid: {
//     display: 'grid',
//     gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
//     gap: '1.5rem',
//   },
//   card: {
//     border: '1px solid #ccc',
//     borderRadius: '8px',
//     padding: '1rem',
//     backgroundColor: '#f9f9f9',
//   },
//   timestamp: {
//     fontSize: '0.85rem',
//     color: '#666',
//     marginBottom: '0.5rem',
//   },
//   actions: {
//     marginTop: '1rem',
//     display: 'flex',
//     alignItems: 'center',
//     gap: '0.5rem',
//     flexWrap: 'wrap',
//   },
//   voteBtn: {
//     padding: '6px 10px',
//     cursor: 'pointer',
//     borderRadius: '4px',
//     backgroundColor: '#e0e0e0',
//     border: '1px solid #bbb',
//   },
//   btn: {
//     padding: '6px 10px',
//     borderRadius: '4px',
//     cursor: 'pointer',
//     border: 'none',
//     fontWeight: 'bold',
//   },
//   editBtn: {
//     backgroundColor: '#007bff',
//     color: '#fff',
//   },
//   deleteBtn: {
//     backgroundColor: '#dc3545',
//     color: '#fff',
//   },
//   alert: {
//     padding: '10px',
//     marginBottom: '15px',
//     borderRadius: '5px',
//     fontWeight: 'bold',
//   },
//   success: { backgroundColor: '#d4edda', color: '#155724' },
//   error: { backgroundColor: '#f8d7da', color: '#721c24' },
//   info: { backgroundColor: '#cce5ff', color: '#004085' },
// };

// export default Dashboard;






// import React, { useEffect, useState } from 'react';                  // the recent one 
// import { Button, Card, CardActions, CardContent, Grid, Typography, Badge } from '@mui/material';
// import axiosInstance from '../axiosinterceptor';
// import { useNavigate } from 'react-router-dom';

// const Dashboard = () => {
//   const [announcements, setAnnouncements] = useState([]);
//   const [highlightedAnnouncements, setHighlightedAnnouncements] = useState([]);
//   const navigate = useNavigate();

//   const token = localStorage.getItem('logintoken');
//   const role = localStorage.getItem('role');
//   const userEmail = token ? JSON.parse(atob(token.split('.')[1])).email : null;

//   useEffect(() => {
//     axiosInstance.get('http://localhost:3000/admin/')
//       .then(res => {
//         setAnnouncements(res.data);
//         // Highlight all fetched announcements initially
//         const allIds = res.data.map(a => a._id);
//         setHighlightedAnnouncements(allIds);
//       })
//       .catch(() => alert('Failed to load announcements'));
//   }, []);

//   // Clear highlight for an announcement
//   const clearHighlight = (id) => {
//     setHighlightedAnnouncements(prev => prev.filter(aid => aid !== id));
//   };

//   const handleVote = (id, voteType) => {
//     axiosInstance.post(`http://localhost:3000/admin/vote/${id}`, { voteType })
//       .then(res => {
//         alert(res.data.message);
//         setAnnouncements(prev => prev.map(a => {
//           if (a._id === id) {
//             return {
//               ...a,
//               likes: res.data.likes,
//               dislikes: res.data.dislikes,
//               votedUsers: [...a.votedUsers, { email: userEmail, voteType }],
//             };
//           }
//           return a;
//         }));
//         clearHighlight(id); // Remove badge after voting
//       })
//       .catch(() => alert('Failed to vote'));
//   };

//   const handleUpdate = (announcement) => {
//     clearHighlight(announcement._id); // Clear badge on update click
//     navigate(`/add-announcement/${announcement._id}`, { state: { announcement } });
//   };

//   const handleDelete = (id) => {
//     if (window.confirm('Are you sure you want to delete this announcement?')) {
//       axiosInstance.delete(`http://localhost:3000/admin/delete/${id}`)
//         .then(() => {
//           alert('Announcement deleted');
//           setAnnouncements(prev => prev.filter(a => a._id !== id));
//           clearHighlight(id);
//         })
//         .catch(() => alert('Failed to delete announcement'));
//     }
//   };

//   return (
//     <div
//       style={{
//         backgroundImage: `url('https://img.freepik.com/free-photo/paper-background_53876-88628.jpg')`,
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//         minHeight: '100vh',
//         borderRadius: "10px",
//       }}
//     >
//       <div style={{ padding: 20, borderRadius: 10 }}>
//         <Typography variant="h4" align="center" gutterBottom style={{ color: '#fff' }}>
//           Announcements Dashboard
//         </Typography>

//         <Grid container spacing={3}>
//           {announcements.length === 0 ? (
//             <Typography style={{ color: '#fff' }}>No announcements available.</Typography>
//           ) : (
//             announcements.map(announcement => {
//               const userVote = announcement.votedUsers.find(v => v.email === userEmail);
//               const isHighlighted = highlightedAnnouncements.includes(announcement._id);

//               return (
//                 <Grid item xs={12} sm={6} md={4} key={announcement._id}>
//                   <Badge
//                     color="error"
//                     variant="dot"
//                     invisible={!isHighlighted}
//                     overlap="rectangular"
//                     anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//                   >
//                     <Card
//                       style={{
//                         backgroundColor: 'rgba(15, 15, 15, 0.7)',
//                         color: '#fff',
//                         borderRadius: '16px',
//                         boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
//                         padding: '16px',
//                         position: 'relative',
//                       }}
//                     >
//                       <CardContent>
//                         <Typography variant="h6" style={{ color: '#f9a825' }}>
//                           {announcement.title}
//                         </Typography>
//                         <Typography variant="body2" paragraph>
//                           {announcement.message}
//                         </Typography>
//                         <Typography variant="body2">
//                           {new Date(announcement.createdAt).toLocaleString()}
//                         </Typography>
//                         <Typography variant="body2">
//                           Likes: {announcement.likes} | Dislikes: {announcement.dislikes}
//                         </Typography>
//                       </CardContent>
//                       <CardActions>
//                         <Button
//                           size="small"
//                           variant={userVote?.voteType === 'like' ? 'contained' : 'outlined'}
//                           color="primary"
//                           disabled={!!userVote}
//                           onClick={() => handleVote(announcement._id, 'like')}
//                         >
//                           👍 Like
//                         </Button>
//                         <Button
//                           size="small"
//                           variant={userVote?.voteType === 'dislike' ? 'contained' : 'outlined'}
//                           color="error"
//                           disabled={!!userVote}
//                           onClick={() => handleVote(announcement._id, 'dislike')}
//                         >
//                           👎 Dislike
//                         </Button>

//                         {role === 'admin' && (
//                           <>
//                             <Button
//                               size="small"
//                               variant="contained"
//                               style={{ backgroundColor: 'rgb(92, 124, 156)', color: '' }}
//                               onClick={() => handleUpdate(announcement)}
//                             >
//                               Update
//                             </Button>
//                             <Button
//                               size="small"
//                               variant="contained"
//                               color="error"
//                               onClick={() => handleDelete(announcement._id)}
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

// export default Dashboard;

// import React, { useEffect, useState } from 'react';                 // the one with badge working
// import { Button, Card, CardActions, CardContent, Grid, Typography, Badge } from '@mui/material';
// import axiosInstance from '../axiosinterceptor';
// import { useNavigate } from 'react-router-dom';

// const Dashboard = () => {
//   const [announcements, setAnnouncements] = useState([]);
//   const [highlightedAnnouncements, setHighlightedAnnouncements] = useState([]);
//   const navigate = useNavigate();

//   const token = localStorage.getItem('logintoken');
//   const role = localStorage.getItem('role');
//   const userEmail = token ? JSON.parse(atob(token.split('.')[1])).email : null;

//   // Key in localStorage to track seen announcements per user
//   const localStorageKey = `seenAnnouncements_${userEmail}`;

//   useEffect(() => {
//     axiosInstance.get('http://localhost:3000/admin/')
//       .then(res => {
//         setAnnouncements(res.data);

//         // Load seen announcements info from localStorage
//         const seenDataRaw = localStorage.getItem(localStorageKey);
//         const seenData = seenDataRaw ? JSON.parse(seenDataRaw) : {};

//         // Calculate which announcements are new or updated compared to last seen
//         const toHighlight = res.data
//           .filter(a => {
//             const lastSeenUpdatedAt = seenData[a._id];
//             // Show badge if never seen or updated since last seen
//             return !lastSeenUpdatedAt || new Date(a.updatedAt) > new Date(lastSeenUpdatedAt);
//           })
//           .map(a => a._id);

//         setHighlightedAnnouncements(toHighlight);
//       })
//       .catch(() => alert('Failed to load announcements'));
//   }, [localStorageKey]);

//   // Clear highlight and update localStorage for a given announcement ID
//   const clearHighlight = (id) => {
//     setHighlightedAnnouncements(prev => prev.filter(aid => aid !== id));

//     // Update last seen timestamp in localStorage for this announcement
//     const seenDataRaw = localStorage.getItem(localStorageKey);
//     const seenData = seenDataRaw ? JSON.parse(seenDataRaw) : {};
//     seenData[id] = new Date().toISOString();
//     localStorage.setItem(localStorageKey, JSON.stringify(seenData));
//   };

//   const handleVote = (id, voteType) => {
//     axiosInstance.post(`http://localhost:3000/admin/vote/${id}`, { voteType })
//       .then(res => {
//         alert(res.data.message);
//         setAnnouncements(prev => prev.map(a => {
//           if (a._id === id) {
//             return {
//               ...a,
//               likes: res.data.likes,
//               dislikes: res.data.dislikes,
//               votedUsers: [...a.votedUsers, { email: userEmail, voteType }],
//             };
//           }
//           return a;
//         }));
//         clearHighlight(id); // Remove badge after voting
//       })
//       .catch(() => alert('Failed to vote'));
//   };

//   const handleUpdate = (announcement) => {
//     clearHighlight(announcement._id); // Clear badge on update click
//     navigate(`/add-announcement/${announcement._id}`, { state: { announcement } });
//   };

//   const handleDelete = (id) => {
//     if (window.confirm('Are you sure you want to delete this announcement?')) {
//       axiosInstance.delete(`http://localhost:3000/admin/delete/${id}`)
//         .then(() => {
//           alert('Announcement deleted');
//           setAnnouncements(prev => prev.filter(a => a._id !== id));
//           clearHighlight(id);
//         })
//         .catch(() => alert('Failed to delete announcement'));
//     }
//   };

//   // Optional: Clear badge when user clicks the card (views the announcement)
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
//         borderRadius: "10px",
//       }}
//     >
//       <div style={{ padding: 20, borderRadius: 10 }}>
//         <Typography variant="h4" align="center" gutterBottom style={{ color: '#fff' }}>
//           Announcements Dashboard
//         </Typography>

//         <Grid container spacing={3}>
//           {announcements.length === 0 ? (
//             <Typography style={{ color: '#fff' }}>No announcements available.</Typography>
//           ) : (
//             announcements.map(announcement => {
//               const userVote = announcement.votedUsers.find(v => v.email === userEmail);
//               const isHighlighted = highlightedAnnouncements.includes(announcement._id);

//               return (
//                 <Grid item xs={12} sm={6} md={4} key={announcement._id}>
//                   <Badge
//                     color="error"
//                     variant="dot"
//                     invisible={!isHighlighted}
//                     overlap="rectangular"
//                     anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//                   >
//                     <Card
//                       style={{
//                         backgroundColor: 'rgba(15, 15, 15, 0.7)',
//                         color: '#fff',
//                         borderRadius: '16px',
//                         boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
//                         padding: '16px',
//                         position: 'relative',
//                         cursor: 'pointer',
//                       }}
//                       onClick={() => handleCardClick(announcement._id)}
//                     >
//                       <CardContent>
//                         <Typography variant="h6" style={{ color: '#f9a825' }}>
//                           {announcement.title}
//                         </Typography>
//                         <Typography variant="body2" paragraph>
//                           {announcement.message}
//                         </Typography>
//                         <Typography variant="body2">
//                           {new Date(announcement.createdAt).toLocaleString()}
//                         </Typography>
//                         <Typography variant="body2">
//                           Likes: {announcement.likes} | Dislikes: {announcement.dislikes}
//                         </Typography>
//                       </CardContent>
//                       <CardActions>
//                         <Button
//                           size="small"
//                           variant={userVote?.voteType === 'like' ? 'contained' : 'outlined'}
//                           color="primary"
//                           disabled={!!userVote}
//                           onClick={(e) => { e.stopPropagation(); handleVote(announcement._id, 'like'); }}
//                         >
//                           👍 Like
//                         </Button>
//                         <Button
//                           size="small"
//                           variant={userVote?.voteType === 'dislike' ? 'contained' : 'outlined'}
//                           color="error"
//                           disabled={!!userVote}
//                           onClick={(e) => { e.stopPropagation(); handleVote(announcement._id, 'dislike'); }}
//                         >
//                           👎 Dislike
//                         </Button>

//                         {role === 'admin' && (
//                           <>
//                             <Button
//                               size="small"
//                               variant="contained"
//                               style={{ backgroundColor: 'rgb(92, 124, 156)', color: '' }}
//                               onClick={(e) => { e.stopPropagation(); handleUpdate(announcement); }}
//                             >
//                               Update
//                             </Button>
//                             <Button
//                               size="small"
//                               variant="contained"
//                               color="error"
//                               onClick={(e) => { e.stopPropagation(); handleDelete(announcement._id); }}
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

// export default Dashboard;

// import React, { useEffect, useState } from 'react';                              // last edited
// import { Button, Card, CardActions, CardContent, Grid, Typography, Badge } from '@mui/material';
// import axiosInstance from '../axiosinterceptor';
// import { useNavigate } from 'react-router-dom';

// const Dashboard = () => {
//   const [announcements, setAnnouncements] = useState([]);
//   const [highlightedAnnouncements, setHighlightedAnnouncements] = useState([]);
//   const navigate = useNavigate();

//   const token = localStorage.getItem('logintoken');
//   const role = localStorage.getItem('role');
//   const userEmail = token ? JSON.parse(atob(token.split('.')[1])).email : null;

//   // Key in localStorage to track seen announcements per user
//   const localStorageKey = `seenAnnouncements_${userEmail}`;

//   useEffect(() => {
//     axiosInstance.get('http://localhost:3000/admin/')
//       .then(res => {
//         setAnnouncements(res.data);

//         // Load seen announcements info from localStorage
//         const seenDataRaw = localStorage.getItem(localStorageKey);
//         const seenData = seenDataRaw ? JSON.parse(seenDataRaw) : {};

//         // Calculate which announcements are new or updated compared to last seen
//         const toHighlight = res.data
//           .filter(a => {
//             const lastSeenUpdatedAt = seenData[a._id];
//             // Show badge if never seen or updated since last seen
//             return !lastSeenUpdatedAt || new Date(a.updatedAt) > new Date(lastSeenUpdatedAt);
//           })
//           .map(a => a._id);

//         setHighlightedAnnouncements(toHighlight);
//       })
//       .catch(() => alert('Failed to load announcements'));
//   }, [localStorageKey]);

//   // Clear highlight and update localStorage for a given announcement ID
//   const clearHighlight = (id) => {
//     setHighlightedAnnouncements(prev => prev.filter(aid => aid !== id));

//     // Update last seen timestamp in localStorage for this announcement
//     const seenDataRaw = localStorage.getItem(localStorageKey);
//     const seenData = seenDataRaw ? JSON.parse(seenDataRaw) : {};
//     seenData[id] = new Date().toISOString();
//     localStorage.setItem(localStorageKey, JSON.stringify(seenData));
//   };

//   const handleVote = (id, voteType) => {
//     axiosInstance.post(`http://localhost:3000/admin/vote/${id}`, { voteType })
//       .then(res => {
//         alert(res.data.message);
//         setAnnouncements(prev => prev.map(a => {
//           if (a._id === id) {
//             return {
//               ...a,
//               likes: res.data.likes,
//               dislikes: res.data.dislikes,
//               votedUsers: [...a.votedUsers, { email: userEmail, voteType, updatedAtSnapshot: a.updatedAt }],
//             };
//           }
//           return a;
//         }));
//         clearHighlight(id); // Remove badge after voting
//       })
//       .catch(() => alert('Failed to vote'));
//   };

//   const handleUpdate = (announcement) => {
//     clearHighlight(announcement._id); // Clear badge on update click

//     // Remove current user's vote on this announcement to enable voting buttons again
//     setAnnouncements(prev => prev.map(a => {
//       if (a._id === announcement._id) {
//         return {
//           ...a,
//           votedUsers: a.votedUsers.filter(v => v.email !== userEmail)
//         };
//       }
//       return a;
//     }));

//     navigate(`/add-announcement/${announcement._id}`, { state: { announcement } });
//   };

//   const handleDelete = (id) => {
//     if (window.confirm('Are you sure you want to delete this announcement?')) {
//       axiosInstance.delete(`http://localhost:3000/admin/delete/${id}`)
//         .then(() => {
//           alert('Announcement deleted');
//           setAnnouncements(prev => prev.filter(a => a._id !== id));
//           clearHighlight(id);
//         })
//         .catch(() => alert('Failed to delete announcement'));
//     }
//   };

//   // Optional: Clear badge when user clicks the card (views the announcement)
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
//         borderRadius: "10px",
//       }}
//     >
//       <div style={{ padding: 20, borderRadius: 10 }}>
//         <Typography variant="h4" align="center" gutterBottom style={{ color: '#fff' }}>
//           Announcements Dashboard
//         </Typography>

//         <Grid container spacing={3}>
//           {announcements.length === 0 ? (
//             <Typography style={{ color: '#fff' }}>No announcements available.</Typography>
//           ) : (
//             announcements.map(announcement => {
//               const isHighlighted = highlightedAnnouncements.includes(announcement._id);

//               // Check if user voted on current version by comparing updatedAtSnapshot and updatedAt
//               const userVote = announcement.votedUsers.find(v =>
//                 v.email === userEmail &&
//                 v.updatedAtSnapshot &&
//                 new Date(v.updatedAtSnapshot).getTime() === new Date(announcement.updatedAt).getTime()
//               );

//               return (
//                 <Grid item xs={12} sm={6} md={4} key={announcement._id}>
//                   <Badge
//                     color="error"
//                     variant="dot"
//                     invisible={!isHighlighted}
//                     overlap="rectangular"
//                     anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//                   >
//                     <Card
//                       style={{
//                         backgroundColor: 'rgba(15, 15, 15, 0.7)',
//                         color: '#fff',
//                         borderRadius: '16px',
//                         boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
//                         padding: '16px',
//                         position: 'relative',
//                         cursor: 'pointer',
//                       }}
//                       onClick={() => handleCardClick(announcement._id)}
//                     >
//                       <CardContent>
//                         <Typography variant="h6" style={{ color: '#f9a825' }}>
//                           {announcement.title}
//                         </Typography>
//                         <Typography variant="body2" paragraph>
//                           {announcement.message}
//                         </Typography>
//                         <Typography variant="body2">
//                           {new Date(announcement.createdAt).toLocaleString()}
//                         </Typography>
//                         <Typography variant="body2">
//                           Likes: {announcement.likes} | Dislikes: {announcement.dislikes}
//                         </Typography>
//                       </CardContent>
//                       <CardActions>
//                         <Button
//                           size="small"
//                           variant={userVote?.voteType === 'like' ? 'contained' : 'outlined'}
//                           color="primary"
//                           disabled={!!userVote}
//                           onClick={(e) => { e.stopPropagation(); handleVote(announcement._id, 'like'); }}
//                         >
//                           👍 Like
//                         </Button>
//                         <Button
//                           size="small"
//                           variant={userVote?.voteType === 'dislike' ? 'contained' : 'outlined'}
//                           color="error"
//                           disabled={!!userVote}
//                           onClick={(e) => { e.stopPropagation(); handleVote(announcement._id, 'dislike'); }}
//                         >
//                           👎 Dislike
//                         </Button>

//                         {role === 'admin' && (
//                           <>
//                             <Button
//                               size="small"
//                               variant="contained"
//                               style={{ backgroundColor: 'rgb(92, 124, 156)' }}
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 handleUpdate(announcement);
//                               }}
//                             >
//                               Update
//                             </Button>
//                             <Button
//                               size="small"
//                               variant="contained"
//                               color="error"
//                               onClick={(e) => { e.stopPropagation(); handleDelete(announcement._id); }}
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

// export default Dashboard;


// import React, { useEffect, useState } from 'react';
// import {
//   Button, Card, CardActions, CardContent, Grid, Typography, Badge
// } from '@mui/material';
// import axiosInstance from '../axiosinterceptor';
// import { useNavigate } from 'react-router-dom';

// const Dashboard = () => {
//   const [announcements, setAnnouncements] = useState([]);
//   const [highlightedAnnouncements, setHighlightedAnnouncements] = useState([]);
//   const navigate = useNavigate();

//   const token = localStorage.getItem('logintoken');
//   const role = localStorage.getItem('role');
//   const userEmail = token ? JSON.parse(atob(token.split('.')[1])).email : null;

//   const localStorageKey = `seenAnnouncements_${userEmail}`;

//   useEffect(() => {
//     axiosInstance.get('http://localhost:3000/admin/')
//       .then(res => {
//         setAnnouncements(res.data);

//         const seenDataRaw = localStorage.getItem(localStorageKey);
//         const seenData = seenDataRaw ? JSON.parse(seenDataRaw) : {};

//         const toHighlight = res.data
//           .filter(a => {
//             const lastSeenUpdatedAt = seenData[a._id];
//             return !lastSeenUpdatedAt || new Date(a.updatedAt) > new Date(lastSeenUpdatedAt);
//           })
//           .map(a => a._id);

//         setHighlightedAnnouncements(toHighlight);
//       })
//       .catch(() => alert('Failed to load announcements'));
//   }, [localStorageKey]);

//   const clearHighlight = (id) => {
//     setHighlightedAnnouncements(prev => prev.filter(aid => aid !== id));

//     const seenDataRaw = localStorage.getItem(localStorageKey);
//     const seenData = seenDataRaw ? JSON.parse(seenDataRaw) : {};
//     seenData[id] = new Date().toISOString();
//     localStorage.setItem(localStorageKey, JSON.stringify(seenData));
//   };
// const handleVote = async (announcementId, voteType) => {
//   try {
//     const res = await axiosInstance.post(`http://localhost:3000/admin/vote/${announcementId}`, { voteType });

//     // Update the specific announcement in state
//     setAnnouncements(prev =>
//       prev.map(announcement =>
//         announcement._id === announcementId
//           ? {
//               ...announcement,
//               likes: voteType === 'like' ? announcement.likes + 1 : announcement.likes,
//               dislikes: voteType === 'dislike' ? announcement.dislikes + 1 : announcement.dislikes,
//               votedUsers: [
//                 ...(announcement.votedUsers || []),
//                 {
//                   email: userEmail,
//                   voteType,
//                   votedAt: new Date().toISOString() // match backend time format
//                 }
//               ]
//             }
//           : announcement
//       )
//     );
//   } catch (err) {
//     alert(err.response?.data?.message || 'Vote failed');
//   }
// };






//   // const handleVote = (id, voteType) => {
//   //   axiosInstance.post(`http://localhost:3000/admin/vote/${id}`, { voteType })
//   //     .then(res => {
//   //       alert(res.data.message);
//   //       setAnnouncements(prev => prev.map(a => {
//   //         if (a._id === id) {
//   //           return {
//   //             ...a,
//   //             likes: res.data.likes,
//   //             dislikes: res.data.dislikes,
//   //             votedUsers: [
//   //               ...a.votedUsers,
//   //               {
//   //                 email: userEmail,
//   //                 voteType,
//   //                 votedAt: new Date().toISOString()
//   //               }
//   //             ]
//   //           };
//   //         }
//   //         return a;
//   //       }));
//   //       clearHighlight(id);
//   //     })
//   //     .catch(err => alert(err.response?.data?.message || 'Failed to vote'));
//   // };






//   // const handleUpdate = (announcement) => {
//   //   clearHighlight(announcement._id);
//   //   navigate(`/add-announcement/${announcement._id}`, { state: { announcement } });
//   // };
//   const handleUpdate = (announcement) => {
//   clearHighlight(announcement._id);
//   navigate(`/add-announcement/${announcement._id}`, {
//     state: { announcement, returnToDashboard: true }
//   });
// };

//   const handleDelete = (id) => {
//     if (window.confirm('Are you sure you want to delete this announcement?')) {
//       axiosInstance.delete(`http://localhost:3000/admin/delete/${id}`)
//         .then(() => {
//           alert('Announcement deleted');
//           setAnnouncements(prev => prev.filter(a => a._id !== id));
//           clearHighlight(id);
//         })
//         .catch(() => alert('Failed to delete announcement'));
//     }
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
//         borderRadius: "10px",
//       }}
//     >
//       <div style={{ padding: 20, borderRadius: 10 }}>
//         <Typography variant="h4" align="center" gutterBottom style={{ color: '#fff' }}>
//           Announcements Dashboard
//         </Typography>

//         <Grid container spacing={3}>
//           {announcements.length === 0 ? (
//             <Typography style={{ color: '#fff' }}>No announcements available.</Typography>
//           ) : (
//             announcements.map(announcement => {
//               const isHighlighted = highlightedAnnouncements.includes(announcement._id);

//               // ✅ Disable voting if user has already voted, regardless of updatedAt
//               // const userVote = announcement.votedUsers.find(v => v.email === userEmail);
// const userVote = announcement.votedUsers?.find(v =>
//   v.email === userEmail &&
//   new Date(v.votedAt).getTime() >= new Date(announcement.updatedAt).getTime()
// );

//               return (
//                 <Grid item xs={12} sm={6} md={4} key={announcement._id}>
//                   <Badge
//                     color="error"
//                     variant="dot"
//                     invisible={!isHighlighted}
//                     overlap="rectangular"
//                     anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//                   >
//                     <Card
//                       style={{
//                         backgroundColor: 'rgba(15, 15, 15, 0.7)',
//                         color: '#fff',
//                         borderRadius: '16px',
//                         boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
//                         padding: '16px',
//                         position: 'relative',
//                         cursor: 'pointer',
//                       }}
//                       onClick={() => handleCardClick(announcement._id)}
//                     >
//                       <CardContent>
//                         <Typography variant="h6" style={{ color: '#f9a825' }}>
//                           {announcement.title}
//                         </Typography>
//                         <Typography variant="body2" paragraph>
//                           {announcement.message}
//                         </Typography>
//                         <Typography variant="body2">
//                           {new Date(announcement.createdAt).toLocaleString()}
//                         </Typography>
//                         <Typography variant="body2">
//                           Likes: {announcement.likes} | Dislikes: {announcement.dislikes}
//                         </Typography>
//                       </CardContent>
//                       <CardActions>
//                         {/* <Button
//                           size="small"
//                           variant={userVote?.voteType === 'like' ? 'contained' : 'outlined'}
//                           color="primary"
//                           disabled={!!userVote}
//                           onClick={(e) => { e.stopPropagation(); handleVote(announcement._id, 'like'); }}
//                         >
//                           👍 Like
//                         </Button>
//                         <Button
//                           size="small"
//                           variant={userVote?.voteType === 'dislike' ? 'contained' : 'outlined'}
//                           color="error"
//                           disabled={!!userVote}
//                           onClick={(e) => { e.stopPropagation(); handleVote(announcement._id, 'dislike'); }}
//                         >
//                           👎 Dislike
//                         </Button> */}
// <Button
//   size="small"
//   variant={userVote?.voteType === 'like' ? 'contained' : 'outlined'}
//   color="primary"
//   disabled={!!userVote}
//   onClick={(e) => { e.stopPropagation(); handleVote(announcement._id, 'like'); }}
// >
//   👍 Like
// </Button>
// <Button
//   size="small"
//   variant={userVote?.voteType === 'dislike' ? 'contained' : 'outlined'}
//   color="error"
//   disabled={!!userVote}
//   onClick={(e) => { e.stopPropagation(); handleVote(announcement._id, 'dislike'); }}
// >
//   👎 Dislike
// </Button>

//                         {role === 'admin' && (
//                           <>
//                             <Button
//                               size="small"
//                               variant="contained"
//                               style={{ backgroundColor: 'rgb(92, 124, 156)' }}
//                               onClick={(e) => { e.stopPropagation(); handleUpdate(announcement); }}
//                             >
//                               Update
//                             </Button>
//                             <Button
//                               size="small"
//                               variant="contained"
//                               color="error"
//                               onClick={(e) => { e.stopPropagation(); handleDelete(announcement._id); }}
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

// export default Dashboard;

// import React, { useEffect, useState } from 'react';               last one
// import {
//   Button, Card, CardActions, CardContent, Grid, Typography, Badge
// } from '@mui/material';
// import axiosInstance from '../axiosinterceptor';
// import { useNavigate } from 'react-router-dom';

// const Dashboard = () => {
//   const [announcements, setAnnouncements] = useState([]);
//   const [highlightedAnnouncements, setHighlightedAnnouncements] = useState([]);
//   const navigate = useNavigate();

//   const token = localStorage.getItem('logintoken');
//   const role = localStorage.getItem('role');
//   const userEmail = token ? JSON.parse(atob(token.split('.')[1])).email : null;

//   const localStorageKey = `seenAnnouncements_${userEmail}`;

//   useEffect(() => {
//     axiosInstance.get('http://localhost:3000/admin/')
//       .then(res => {
//         setAnnouncements(res.data);

//         const seenDataRaw = localStorage.getItem(localStorageKey);
//         const seenData = seenDataRaw ? JSON.parse(seenDataRaw) : {};

//         const toHighlight = res.data
//           .filter(a => {
//             const lastSeenUpdatedAt = seenData[a._id];
//             return !lastSeenUpdatedAt || new Date(a.updatedAt) > new Date(lastSeenUpdatedAt);
//           })
//           .map(a => a._id);

//         setHighlightedAnnouncements(toHighlight);
//       })
//       .catch(() => alert('Failed to load announcements'));
//   }, [localStorageKey]);

//   const clearHighlight = (id) => {
//     setHighlightedAnnouncements(prev => prev.filter(aid => aid !== id));

//     const seenDataRaw = localStorage.getItem(localStorageKey);
//     const seenData = seenDataRaw ? JSON.parse(seenDataRaw) : {};
//     seenData[id] = new Date().toISOString();
//     localStorage.setItem(localStorageKey, JSON.stringify(seenData));
//   };

//   // const handleVote = async (announcementId, voteType) => {
//   //   try {
//   //     // Find the announcement to get current vote state
//   //     const announcement = announcements.find(a => a._id === announcementId);
//   //     if (!announcement) return;

//   //     // Find if user has already voted
//   //     const existingVoteIndex = announcement.votedUsers?.findIndex(v => v.email === userEmail);

//   //     let updatedLikes = announcement.likes;
//   //     let updatedDislikes = announcement.dislikes;
//   //     let updatedVotedUsers = announcement.votedUsers ? [...announcement.votedUsers] : [];

//   //     if (existingVoteIndex !== -1) {
//   //       // User has voted before - check if voteType is different
//   //       const oldVoteType = updatedVotedUsers[existingVoteIndex].voteType;

//   //       if (oldVoteType === voteType) {
//   //         alert(`You already voted ${voteType}`);
//   //         return;
//   //       } else {
//   //         // Update likes/dislikes counts accordingly
//   //         if (oldVoteType === 'like') updatedLikes -= 1;
//   //         else if (oldVoteType === 'dislike') updatedDislikes -= 1;

//   //         if (voteType === 'like') updatedLikes += 1;
//   //         else if (voteType === 'dislike') updatedDislikes += 1;

//   //         // Replace the old vote with new vote
//   //         updatedVotedUsers[existingVoteIndex] = {
//   //           email: userEmail,
//   //           voteType,
//   //           votedAt: new Date().toISOString(),
//   //         };
//   //       }
//   //     } else {
//   //       // No previous vote, add new vote
//   //       if (voteType === 'like') updatedLikes += 1;
//   //       else if (voteType === 'dislike') updatedDislikes += 1;

//   //       updatedVotedUsers.push({
//   //         email: userEmail,
//   //         voteType,
//   //         votedAt: new Date().toISOString(),
//   //       });
//   //     }

//   //     // Call backend to register the vote
//   //     await axiosInstance.post(`http://localhost:3000/admin/vote/${announcementId}`, { voteType });

//   //     // Update state locally
//   //     setAnnouncements(prev =>
//   //       prev.map(a =>
//   //         a._id === announcementId
//   //           ? {
//   //               ...a,
//   //               likes: updatedLikes,
//   //               dislikes: updatedDislikes,
//   //               votedUsers: updatedVotedUsers,
//   //             }
//   //           : a
//   //       )
//   //     );

//   //      clearHighlight(announcementId);
//   //   } catch (err) {
//   //     alert(err.response?.data?.message || 'Vote failed');
//   //   }
//   // };


// const handleVote = async (announcementId, voteType) => {
//   try {
//     const announcement = announcements.find(a => a._id === announcementId);
//     if (!announcement) return;

//     const existingVoteIndex = announcement.votedUsers?.findIndex(v => v.email === userEmail);

//     let updatedLikes = announcement.likes;
//     let updatedDislikes = announcement.dislikes;
//     let updatedVotedUsers = announcement.votedUsers ? [...announcement.votedUsers] : [];

//     if (existingVoteIndex !== -1) {
//       const lastVote = updatedVotedUsers[existingVoteIndex];
//       const lastVoteTime = new Date(lastVote.votedAt);
//       const announcementUpdateTime = new Date(announcement.updatedAt);

//       if (lastVoteTime >= announcementUpdateTime) {
//         // User already voted on current announcement version
//         if (lastVote.voteType === voteType) {
//           alert(`You already voted ${voteType}`);
//           return;
//         } else {
//           // User wants to change vote type on the current version
//           if (lastVote.voteType === 'like') updatedLikes -= 1;
//           else if (lastVote.voteType === 'dislike') updatedDislikes -= 1;

//           if (voteType === 'like') updatedLikes += 1;
//           else if (voteType === 'dislike') updatedDislikes += 1;

//           // Update the vote entry with new voteType and votedAt
//           updatedVotedUsers[existingVoteIndex] = {
//             email: userEmail,
//             voteType,
//             votedAt: new Date().toISOString(),
//           };
//         }
//       } else {
//         // Announcement was updated after last vote, allow fresh vote
//         if (voteType === 'like') updatedLikes += 1;
//         else if (voteType === 'dislike') updatedDislikes += 1;

//         // Replace old vote with new vote
//         updatedVotedUsers[existingVoteIndex] = {
//           email: userEmail,
//           voteType,
//           votedAt: new Date().toISOString(),
//         };
//       }
//     } else {
//       // No previous vote, add new vote
//       if (voteType === 'like') updatedLikes += 1;
//       else if (voteType === 'dislike') updatedDislikes += 1;

//       updatedVotedUsers.push({
//         email: userEmail,
//         voteType,
//         votedAt: new Date().toISOString(),
//       });
//     }

//     // Call backend to register the vote
//     await axiosInstance.post(`http://localhost:3000/admin/vote/${announcementId}`, { voteType });

//     // Update state locally with new counts and vote list
//     setAnnouncements(prev =>
//       prev.map(a =>
//         a._id === announcementId
//           ? {
//               ...a,
//               likes: updatedLikes,
//               dislikes: updatedDislikes,
//               votedUsers: updatedVotedUsers,
//             }
//           : a
//       )
//     );

//     // Clear highlight badge after vote
//     clearHighlight(announcementId);

//   } catch (err) {
//     alert(err.response?.data?.message || 'Vote failed');
//   }
// };



//   const handleUpdate = (announcement) => {
//     clearHighlight(announcement._id);
//     navigate(`/add-announcement/${announcement._id}`, {
//       state: { announcement, returnToDashboard: true }
//     });
//   };

//   const handleDelete = (id) => {
//     if (window.confirm('Are you sure you want to delete this announcement?')) {
//       axiosInstance.delete(`http://localhost:3000/admin/delete/${id}`)
//         .then(() => {
//           alert('Announcement deleted');
//           setAnnouncements(prev => prev.filter(a => a._id !== id));
//           clearHighlight(id);
//         })
//         .catch(() => alert('Failed to delete announcement'));
//     }
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
//         borderRadius: "10px",
//       }}
//     >
//       <div style={{ padding: 20, borderRadius: 10 }}>
//         <Typography variant="h4" align="center" gutterBottom style={{ color: '#fff' }}>
//           Announcements Dashboard
//         </Typography>

//         <Grid container spacing={3}>
//           {announcements.length === 0 ? (
//             <Typography style={{ color: '#fff' }}>No announcements available.</Typography>
//           ) : (
//             announcements.map(announcement => {
//               const isHighlighted = highlightedAnnouncements.includes(announcement._id);

//               // const userVote = announcement.votedUsers?.find(v =>
//               //   v.email === userEmail &&
//               //   new Date(v.votedAt).getTime() >= new Date(announcement.updatedAt).getTime()
//               // );
// const userVote = announcement.votedUsers?.find(v =>
//   v.email === userEmail &&
//   v.updatedAtSnapshot &&
//   new Date(v.updatedAtSnapshot).getTime() === new Date(announcement.updatedAt).getTime()
// );
//               return (
//                 <Grid item xs={12} sm={6} md={4} key={announcement._id}>
//                   <Badge
//                     color="error"
//                     variant="dot"
//                     invisible={!isHighlighted}
//                     overlap="rectangular"
//                     anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//                   >
//                     <Card
//                       style={{
//                         backgroundColor: 'rgba(15, 15, 15, 0.7)',
//                         color: '#fff',
//                         borderRadius: '16px',
//                         boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
//                         padding: '16px',
//                         position: 'relative',
//                         cursor: 'pointer',
//                       }}
//                       onClick={() => handleCardClick(announcement._id)}
//                     >
//                       <CardContent>
//                         <Typography variant="h6" style={{ color: '#f9a825' }}>
//                           {announcement.title}
//                         </Typography>
//                         <Typography variant="body2" paragraph>
//                           {announcement.message}
//                         </Typography>
//                         <Typography variant="body2">
//                           {new Date(announcement.createdAt).toLocaleString()}
//                         </Typography>
//                         <Typography variant="body2">
//                           Likes: {announcement.likes} | Dislikes: {announcement.dislikes}
//                         </Typography>
//                       </CardContent>
//                       <CardActions>
//                         <Button
//                           size="small"
//                           variant={userVote?.voteType === 'like' ? 'contained' : 'outlined'}
//                           color="primary"
//                           disabled={Boolean(userVote)}
//                           onClick={(e) => { e.stopPropagation(); handleVote(announcement._id, 'like'); }}
//                         >
//                           👍 Like
//                         </Button>
//                         <Button
//                           size="small"
//                           variant={userVote?.voteType === 'dislike' ? 'contained' : 'outlined'}
//                           color="error"
//                           disabled={Boolean(userVote)}
//                           onClick={(e) => { e.stopPropagation(); handleVote(announcement._id, 'dislike'); }}
//                         >
//                           👎 Dislike
//                         </Button>

//                         {role === 'admin' && (
//                           <>
//                             <Button
//                               size="small"
//                               variant="contained"
//                               style={{ backgroundColor: 'rgb(92, 124, 156)' }}
                             
//                               onClick={(e) => { e.stopPropagation(); handleUpdate(announcement); }}
//                             >
//                               Update
//                             </Button>
//                             <Button
//                               size="small"
//                               variant="contained"
//                               color="error"
//                               onClick={(e) => { e.stopPropagation(); handleDelete(announcement._id); }}
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

// export default Dashboard;





// import React, { useEffect } from 'react';
// import {
//   Typography,
//   Grid,
//   Card,
//   CardContent,
//   CardActions,
//   Button,
//   Badge,
// } from '@mui/material';
// import { useNavigate, useLocation } from 'react-router-dom';
// import axiosInstance from '../axiosinterceptor'; // Adjust path as needed

// const Dashboard = ({ announcements, setAnnouncements, highlightedAnnouncements, clearHighlight, handleVote, userEmail, role }) => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   // 🔁 Replace updated announcement in list
//   useEffect(() => {
//     if (location.state?.updatedAnnouncement) {
//       const updated = location.state.updatedAnnouncement;
//       setAnnouncements(prev =>
//         prev.map(a => (a._id === updated._id ? updated : a))
//       );
//       // Remove the state after applying it once
//       window.history.replaceState({}, document.title);
//     }
//   }, [location.state, setAnnouncements]);

//   const handleUpdate = (announcement) => {
//     clearHighlight(announcement._id);
//     navigate(`/add-announcement/${announcement._id}`, {
//       state: { announcement, returnToDashboard: true }
//     });
//   };

//   const handleDelete = (id) => {
//     if (window.confirm('Are you sure you want to delete this announcement?')) {
//       axiosInstance.delete(`http://localhost:3000/admin/delete/${id}`)
//         .then(() => {
//           alert('Announcement deleted');
//           setAnnouncements(prev => prev.filter(a => a._id !== id));
//           clearHighlight(id);
//         })
//         .catch(() => alert('Failed to delete announcement'));
//     }
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
//         borderRadius: "10px",
//         padding: 20,
//       }}
//     >
//       <Typography variant="h4" align="center" gutterBottom style={{ color: '#fff' }}>
//         Announcements Dashboard
//       </Typography>

//       <Grid container spacing={3}>
//         {!announcements ||announcements.length === 0 ? (
//           <Typography style={{ color: '#fff' }}>No announcements available.</Typography>
//         ) : (
//           announcements.map(announcement => {
//             const isHighlighted = highlightedAnnouncements.includes(announcement._id);

//             // ✅ Voting disabled only if voted on this updated version
//             const userVote = announcement.votedUsers.find(v => v.email === userEmail);
//             const hasVotedThisVersion = announcement.votedUsers.some(
//               v =>
//                 v.email === userEmail &&
//                 new Date(v.votedAt).getTime() >= new Date(announcement.updatedAt).getTime()
//             );

//             return (
//               <Grid item xs={12} sm={6} md={4} key={announcement._id}>
//                 <Badge
//                   color="error"
//                   variant="dot"
//                   invisible={!isHighlighted}
//                   overlap="rectangular"
//                   anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//                 >
//                   <Card
//                     style={{
//                       backgroundColor: 'rgba(15, 15, 15, 0.7)',
//                       color: '#fff',
//                       borderRadius: '16px',
//                       boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
//                       padding: '16px',
//                       position: 'relative',
//                       cursor: 'pointer',
//                     }}
//                     onClick={() => handleCardClick(announcement._id)}
//                   >
//                     <CardContent>
//                       <Typography variant="h6" style={{ color: '#f9a825' }}>
//                         {announcement.title}
//                       </Typography>
//                       <Typography variant="body2" paragraph>
//                         {announcement.message}
//                       </Typography>
//                       <Typography variant="body2">
//                         {new Date(announcement.createdAt).toLocaleString()}
//                       </Typography>
//                       <Typography variant="body2">
//                         Likes: {announcement.likes} | Dislikes: {announcement.dislikes}
//                       </Typography>
//                     </CardContent>

//                     <CardActions>
//                       <Button
//                         size="small"
//                         variant={userVote?.voteType === 'like' ? 'contained' : 'outlined'}
//                         color="primary"
//                         disabled={hasVotedThisVersion}
//                         onClick={(e) => { e.stopPropagation(); handleVote(announcement._id, 'like'); }}
//                       >
//                         👍 Like
//                       </Button>
//                       <Button
//                         size="small"
//                         variant={userVote?.voteType === 'dislike' ? 'contained' : 'outlined'}
//                         color="error"
//                         disabled={hasVotedThisVersion}
//                         onClick={(e) => { e.stopPropagation(); handleVote(announcement._id, 'dislike'); }}
//                       >
//                         👎 Dislike
//                       </Button>

//                       {role === 'admin' && (
//                         <>
//                           <Button
//                             size="small"
//                             variant="contained"
//                             style={{ backgroundColor: 'rgb(92, 124, 156)' }}
//                             onClick={(e) => { e.stopPropagation(); handleUpdate(announcement); }}
//                           >
//                             Update
//                           </Button>
//                           <Button
//                             size="small"
//                             variant="contained"
//                             color="error"
//                             onClick={(e) => { e.stopPropagation(); handleDelete(announcement._id); }}
//                           >
//                             Delete
//                           </Button>
//                         </>
//                       )}
//                     </CardActions>
//                   </Card>
//                 </Badge>
//               </Grid>
//             );
//           })
//         )}
//       </Grid>
//     </div>
//   );
// };

// export default Dashboard;


// import React, { useState, useEffect } from 'react';  // the working one
// import {
//   Box,
//   Typography,
//   Paper,
//   Button,
//   CircularProgress,
//   Alert,
//   TextField,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
// } from '@mui/material';
// import axiosInstance from '../axiosinterceptor';

// const Dashboard = () => {
//   const [announcements, setAnnouncements] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   // For update dialog
//   const [openEditDialog, setOpenEditDialog] = useState(false);
//   const [currentAnnouncement, setCurrentAnnouncement] = useState(null);
//   const [editTitle, setEditTitle] = useState('');
//   const [editMessage, setEditMessage] = useState('');
//   const [updateLoading, setUpdateLoading] = useState(false);

//   useEffect(() => {
//     const fetchAnnouncements = async () => {
//       setLoading(true);
//       try {
//         const res = await axiosInstance.get('http://localhost:3000/admin/');
//         setAnnouncements(res.data);
//         setError('');
//       } catch (err) {
//         console.error('Failed to fetch announcements:', err);
//         setError('Failed to fetch announcements');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAnnouncements();
//   }, []);

//   const handleVote = async (id, voteType) => {
//     try {
//       const res = await axiosInstance.post(`http://localhost:3000/admin/vote/${id}`, { voteType });
//       const updatedAnnouncement = res.data.updatedAnnouncement;

//       setAnnouncements((prev) =>
//         prev.map((ann) => (ann._id === id ? updatedAnnouncement : ann))
//       );
//     } catch (err) {
//       console.error('Failed to vote:', err);
//       alert(err.response?.data?.message || 'Voting failed');
//     }
//   };

//   // Open edit dialog and set current announcement data
//   const handleOpenEdit = (announcement) => {
//     setCurrentAnnouncement(announcement);
//     setEditTitle(announcement.title);
//     setEditMessage(announcement.message);
//     setOpenEditDialog(true);
//   };

//   // Close edit dialog
//   const handleCloseEdit = () => {
//     setOpenEditDialog(false);
//     setCurrentAnnouncement(null);
//   };

//   // Submit update announcement
//   const handleUpdateAnnouncement = async () => {
//     if (!editTitle.trim() || !editMessage.trim()) {
//       alert('Title and message cannot be empty');
//       return;
//     }
//     setUpdateLoading(true);
//     try {
//       const res = await axiosInstance.put(
//         `http://localhost:3000/admin/edit/${currentAnnouncement._id}`,
//         {
//           title: editTitle,
//           message: editMessage,
//         }
//       );

//       // Update announcements state with new data
//       setAnnouncements((prev) =>
//         prev.map((ann) => (ann._id === currentAnnouncement._id ? res.data.announcement : ann))
//       );
//       handleCloseEdit();
//     } catch (err) {
//       console.error('Failed to update announcement:', err);
//       alert(err.response?.data?.message || 'Update failed');
//     } finally {
//       setUpdateLoading(false);
//     }
//   };

//   // Delete announcement
//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this announcement?')) return;

//     try {
//       await axiosInstance.delete(`http://localhost:3000/admin/delete/${id}`);
//       setAnnouncements((prev) => prev.filter((ann) => ann._id !== id));
//     } catch (err) {
//       console.error('Failed to delete announcement:', err);
//       alert(err.response?.data?.message || 'Delete failed');
//     }
//   };

//   if (loading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4, p: 2 }}>
//       <Typography variant="h4" gutterBottom>
//         Announcements
//       </Typography>

//       {error && (
//         <Alert severity="error" sx={{ mb: 2 }}>
//           {error}
//         </Alert>
//       )}

//       {announcements.length === 0 ? (
//         <Typography>No announcements available.</Typography>
//       ) : (
//         announcements.map((ann) => (
//           <Paper key={ann._id} elevation={3} sx={{ p: 2, mb: 3 }}>
//             <Typography variant="h6">{ann.title}</Typography>
//             <Typography variant="body1" sx={{ mb: 1 }}>
//               {ann.message}
//             </Typography>
//             <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//               Likes: {ann.likes} | Dislikes: {ann.dislikes}
//             </Typography>

//             <Box sx={{ mb: 2 }}>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={() => handleVote(ann._id, 'like')}
//                 sx={{ mr: 1 }}
//               >
//                 Like
//               </Button>
//               <Button
//                 variant="outlined"
//                 color="error"
//                 onClick={() => handleVote(ann._id, 'dislike')}
//               >
//                 Dislike
//               </Button>
//             </Box>

//             {/* Update & Delete buttons */}
//             <Box>
//               <Button
//                 variant="outlined"
//                 color="secondary"
//                 onClick={() => handleOpenEdit(ann)}
//                 sx={{ mr: 1 }}
//               >
//                 Update
//               </Button>
//               <Button
//                 variant="contained"
//                 color="error"
//                 onClick={() => handleDelete(ann._id)}
//               >
//                 Delete
//               </Button>
//             </Box>
//           </Paper>
//         ))
//       )}

//       {/* Edit Announcement Dialog */}
//       <Dialog open={openEditDialog} onClose={handleCloseEdit} maxWidth="sm" fullWidth>
//         <DialogTitle>Edit Announcement</DialogTitle>
//         <DialogContent>
//           <TextField
//             autoFocus
//             margin="dense"
//             label="Title"
//             fullWidth
//             value={editTitle}
//             onChange={(e) => setEditTitle(e.target.value)}
//           />
//           <TextField
//             margin="dense"
//             label="Message"
//             fullWidth
//             multiline
//             minRows={3}
//             value={editMessage}
//             onChange={(e) => setEditMessage(e.target.value)}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseEdit}>Cancel</Button>
//           <Button onClick={handleUpdateAnnouncement} disabled={updateLoading}>
//             {updateLoading ? 'Updating...' : 'Update'}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default Dashboard;
// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Typography,
//   Card,
//   CardContent,
//   CardActions,
//   Button,
//   CircularProgress,
//   Alert,
//   TextField,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
// } from '@mui/material';
// import { jwtDecode } from 'jwt-decode'; // ✅ Correct import for Vite
// import axiosInstance from '../axiosinterceptor';

// const Dashboard = () => {
//   const [announcements, setAnnouncements] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [userEmail, setUserEmail] = useState('');

//   // For update dialog
//   const [openEditDialog, setOpenEditDialog] = useState(false);
//   const [currentAnnouncement, setCurrentAnnouncement] = useState(null);
//   const [editTitle, setEditTitle] = useState('');
//   const [editMessage, setEditMessage] = useState('');
//   const [updateLoading, setUpdateLoading] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem('logintoken');
//     if (token) {
//       try {
//         const decoded = jwtDecode(token);
//         setUserEmail(decoded.email.toLowerCase());
//       } catch (err) {
//         console.error('Invalid token:', err);
//       }
//     }
//   }, []);

//   useEffect(() => {
//     const fetchAnnouncements = async () => {
//       setLoading(true);
//       try {
//         const res = await axiosInstance.get('http://localhost:3000/admin/');
//         setAnnouncements(res.data);
//         setError('');
//       } catch (err) {
//         console.error('Failed to fetch announcements:', err);
//         setError('Failed to fetch announcements');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAnnouncements();
//   }, []);

//   // const hasUserVoted = (announcement) => {
//   //   const voteRecord = announcement.votedUsers.find(
//   //     (v) => v.email.toLowerCase() === userEmail
//   //   );
//   //   if (!voteRecord) return false;
//   //   const voteDate = new Date(voteRecord.votedAt);
//   //   const updatedDate = new Date(announcement.updatedAt || announcement.createdAt);
//   //   return voteDate >= updatedDate;
//   // };
// const hasUserVoted = (announcement) => {
//   if (!userEmail || !announcement.votedUsers) return false;

//   const voteRecord = announcement.votedUsers.find(
//     (v) => v.email.toLowerCase() === userEmail
//   );

//   if (!voteRecord) return false;

//   const voteDate = new Date(voteRecord.votedAt);
//   const updatedDate = new Date(announcement.updatedAt || announcement.createdAt);

//   return voteDate >= updatedDate;
// };


//   const handleVote = async (id, voteType) => {
//     try {
//       const res = await axiosInstance.post(`http://localhost:3000/admin/vote/${id}`, {
//         voteType,
//       });
//       const updatedAnnouncement = res.data.updatedAnnouncement;

//       setAnnouncements((prev) =>
//         prev.map((ann) => (ann._id === id ? updatedAnnouncement : ann))
//       );
//     } catch (err) {
//       console.error('Failed to vote:', err);
//       alert(err.response?.data?.message || 'Voting failed');
//     }
//   };

//   const handleOpenEdit = (announcement) => {
//     setCurrentAnnouncement(announcement);
//     setEditTitle(announcement.title);
//     setEditMessage(announcement.message);
//     setOpenEditDialog(true);
//   };

//   const handleCloseEdit = () => {
//     setOpenEditDialog(false);
//     setCurrentAnnouncement(null);
//   };

//   const handleUpdateAnnouncement = async () => {
//     if (!editTitle.trim() || !editMessage.trim()) {
//       alert('Title and message cannot be empty');
//       return;
//     }
//     setUpdateLoading(true);
//     try {
//       const res = await axiosInstance.put(
//         `http://localhost:3000/admin/edit/${currentAnnouncement._id}`,
//         {
//           title: editTitle,
//           message: editMessage,
//         }
//       );

//       setAnnouncements((prev) =>
//         prev.map((ann) =>
//           ann._id === currentAnnouncement._id ? res.data.announcement : ann
//         )
//       );
//       handleCloseEdit();
//     } catch (err) {
//       console.error('Failed to update announcement:', err);
//       alert(err.response?.data?.message || 'Update failed');
//     } finally {
//       setUpdateLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this announcement?')) return;

//     try {
//       await axiosInstance.delete(`http://localhost:3000/admin/delete/${id}`);
//       setAnnouncements((prev) => prev.filter((ann) => ann._id !== id));
//     } catch (err) {
//       console.error('Failed to delete announcement:', err);
//       alert(err.response?.data?.message || 'Delete failed');
//     }
//   };

//   if (loading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

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
//       <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4, p: 2 }}>
//         <Typography variant="h4" gutterBottom>
//           Announcements
//         </Typography>

//         {error && (
//           <Alert severity="error" sx={{ mb: 2 }}>
//             {error}
//           </Alert>
//         )}

//         {announcements.length === 0 ? (
//           <Typography>No announcements available.</Typography>
//         ) : (
//           announcements.map((ann) => {
//             const voted = hasUserVoted(ann);
//             return (
//               <Card
//                 key={ann._id}
//                 sx={{
//                   mb: 3,
//                   backgroundColor: 'rgba(15, 15, 15, 0.8)',
//                   color: '#fff',
//                   borderRadius: 3,
//                   boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
//                 }}
//               >
//                 <CardContent>
//                   <Typography
//                     variant="h6"
//                     sx={{ color: 'rgb(230, 128, 4)', mb: 1 }}
//                   >
//                     {ann.title}
//                   </Typography>
//                   <Typography variant="body1" sx={{ mb: 1 }}>
//                     {ann.message}
//                   </Typography>
//                   <Typography
//                     variant="body2"
//                     sx={{ mb: 2, color: '#ddd' }}
//                   >
//                     Likes: {ann.likes} | Dislikes: {ann.dislikes}
//                   </Typography>
//                 </CardContent>

//                 <CardActions sx={{ px: 2, pb: 2 }}>
//                   <Button
//                     variant="contained"
//                     color="primary"
//                     onClick={() => handleVote(ann._id, 'like')}
//                     disabled={voted}
//                     sx={{ mr: 1 }}
//                   >
//                     Like
//                   </Button>
//                   <Button
//                     variant="outlined"
//                     color="error"
//                     onClick={() => handleVote(ann._id, 'dislike')}
//                     disabled={voted}
//                     sx={{ mr: 3 }}
//                   >
//                     Dislike
//                   </Button>

//                   <Button
//                     variant="outlined"
//                     color="secondary"
//                     onClick={() => handleOpenEdit(ann)}
//                     sx={{ mr: 1 }}
//                   >
//                     Update
//                   </Button>
//                   <Button
//                     variant="contained"
//                     color="error"
//                     onClick={() => handleDelete(ann._id)}
//                   >
//                     Delete
//                   </Button>
//                 </CardActions>
//               </Card>
//             );
//           })
//         )}

//         {/* Edit Announcement Dialog */}
//         <Dialog open={openEditDialog} onClose={handleCloseEdit} maxWidth="sm" fullWidth>
//           <DialogTitle>Edit Announcement</DialogTitle>
//           <DialogContent>
//             <TextField
//               autoFocus
//               margin="dense"
//               label="Title"
//               fullWidth
//               value={editTitle}
//               onChange={(e) => setEditTitle(e.target.value)}
//             />
//             <TextField
//               margin="dense"
//               label="Message"
//               fullWidth
//               multiline
//               minRows={3}
//               value={editMessage}
//               onChange={(e) => setEditMessage(e.target.value)}
//             />
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleCloseEdit}>Cancel</Button>
//             <Button onClick={handleUpdateAnnouncement} disabled={updateLoading}>
//               {updateLoading ? 'Updating...' : 'Update'}
//             </Button>
//           </DialogActions>
//         </Dialog>
//       </Box>
//     </div>
//   );
// };

// export default Dashboard;




// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Typography,
//   Card,
//   CardContent,
//   CardActions,
//   Button,
//   CircularProgress,
//   Alert,
//   TextField,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
// } from '@mui/material';
// import axiosInstance from '../axiosinterceptor';
// import jwtDecode from 'jwt-decode';

// const Dashboard = () => {
//   const [announcements, setAnnouncements] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const [userEmail, setUserEmail] = useState(null);

//   // For update dialog
//   const [openEditDialog, setOpenEditDialog] = useState(false);
//   const [currentAnnouncement, setCurrentAnnouncement] = useState(null);
//   const [editTitle, setEditTitle] = useState('');
//   const [editMessage, setEditMessage] = useState('');
//   const [updateLoading, setUpdateLoading] = useState(false);

//   // Get email from token
//   useEffect(() => {
//     const token = localStorage.getItem('logintoken');
//     if (token) {
//       try {
//         const decoded = jwtDecode(token);
//         setUserEmail(decoded.email.toLowerCase());
//       } catch (err) {
//         console.error('Invalid token');
//       }
//     }
//   }, []);

//   useEffect(() => {
//     const fetchAnnouncements = async () => {
//       setLoading(true);
//       try {
//         const res = await axiosInstance.get('http://localhost:3000/admin/');
//         setAnnouncements(res.data);
//         setError('');
//       } catch (err) {
//         console.error('Failed to fetch announcements:', err);
//         setError('Failed to fetch announcements');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAnnouncements();
//   }, []);

//   const hasVotedAfterUpdate = (announcement) => {
//     if (!userEmail) return false;
//     const updatedDate = new Date(announcement.updatedAt || announcement.createdAt);
//     const vote = announcement.votedUsers.find(
//       (v) => v.email.toLowerCase() === userEmail && new Date(v.votedAt) >= updatedDate
//     );
//     return !!vote;
//   };

//   const userVoteType = (announcement) => {
//     const updatedDate = new Date(announcement.updatedAt || announcement.createdAt);
//     const vote = announcement.votedUsers.find(
//       (v) => v.email.toLowerCase() === userEmail && new Date(v.votedAt) >= updatedDate
//     );
//     return vote?.voteType;
//   };

//   const handleVote = async (id, voteType) => {
//     try {
//       const res = await axiosInstance.post(`http://localhost:3000/admin/vote/${id}`, { voteType });
//       const updatedAnnouncement = res.data.updatedAnnouncement;

//       setAnnouncements((prev) =>
//         prev.map((ann) => (ann._id === id ? updatedAnnouncement : ann))
//       );
//     } catch (err) {
//       console.error('Failed to vote:', err);
//       alert(err.response?.data?.message || 'Voting failed');
//     }
//   };

//   // Open edit dialog
//   const handleOpenEdit = (announcement) => {
//     setCurrentAnnouncement(announcement);
//     setEditTitle(announcement.title);
//     setEditMessage(announcement.message);
//     setOpenEditDialog(true);
//   };

//   const handleCloseEdit = () => {
//     setOpenEditDialog(false);
//     setCurrentAnnouncement(null);
//   };

//   const handleUpdateAnnouncement = async () => {
//     if (!editTitle.trim() || !editMessage.trim()) {
//       alert('Title and message cannot be empty');
//       return;
//     }
//     setUpdateLoading(true);
//     try {
//       const res = await axiosInstance.put(
//         `http://localhost:3000/admin/edit/${currentAnnouncement._id}`,
//         {
//           title: editTitle,
//           message: editMessage,
//         }
//       );
//       setAnnouncements((prev) =>
//         prev.map((ann) =>
//           ann._id === currentAnnouncement._id ? res.data.announcement : ann
//         )
//       );
//       handleCloseEdit();
//     } catch (err) {
//       console.error('Failed to update announcement:', err);
//       alert(err.response?.data?.message || 'Update failed');
//     } finally {
//       setUpdateLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this announcement?')) return;

//     try {
//       await axiosInstance.delete(`http://localhost:3000/admin/delete/${id}`);
//       setAnnouncements((prev) => prev.filter((ann) => ann._id !== id));
//     } catch (err) {
//       console.error('Failed to delete announcement:', err);
//       alert(err.response?.data?.message || 'Delete failed');
//     }
//   };

//   if (loading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <div
//       style={{
//         backgroundImage: `url('https://img.freepik.com/free-photo/paper-background_53876-88628.jpg')`,
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//         minHeight: '100vh',
//         borderRadius: '10px'
//       }}
//     >
//       <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4, p: 2 }}>
//         <Typography variant="h4" gutterBottom>
//           Announcements
//         </Typography>

//         {error && (
//           <Alert severity="error" sx={{ mb: 2 }}>
//             {error}
//           </Alert>
//         )}

//         {announcements.length === 0 ? (
//           <Typography>No announcements available.</Typography>
//         ) : (
//           announcements.map((ann) => {
//             const hasVoted = hasVotedAfterUpdate(ann);
//             const voteType = userVoteType(ann);

//             return (
//               <Card
//                 key={ann._id}
//                 sx={{
//                   mb: 3,
//                   backgroundColor: 'rgba(15, 15, 15, 0.8)',
//                   color: '#fff',
//                   borderRadius: 3,
//                   boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
//                 }}
//               >
//                 <CardContent>
//                   <Typography variant="h6" sx={{ color: 'rgb(230, 128, 4)', mb: 1 }}>
//                     {ann.title}
//                   </Typography>
//                   <Typography variant="body1" sx={{ mb: 1 }}>
//                     {ann.message}
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary" sx={{ mb: 2, color: '#ddd' }}>
//                     Likes: {ann.likes} | Dislikes: {ann.dislikes}
//                   </Typography>
//                 </CardContent>

//                 <CardActions sx={{ px: 2, pb: 2 }}>
//                   <Button
//                     variant={voteType === 'like' ? 'contained' : 'outlined'}
//                     color="primary"
//                     onClick={() => handleVote(ann._id, 'like')}
//                     disabled={hasVoted}
//                     sx={{ mr: 1 }}
//                   >
//                     Like
//                   </Button>
//                   <Button
//                     variant={voteType === 'dislike' ? 'contained' : 'outlined'}
//                     color="error"
//                     onClick={() => handleVote(ann._id, 'dislike')}
//                     disabled={hasVoted}
//                     sx={{ mr: 3 }}
//                   >
//                     Dislike
//                   </Button>

//                   <Button
//                     variant="outlined"
//                     color="secondary"
//                     onClick={() => handleOpenEdit(ann)}
//                     sx={{ mr: 1 }}
//                   >
//                     Update
//                   </Button>
//                   <Button
//                     variant="contained"
//                     color="error"
//                     onClick={() => handleDelete(ann._id)}
//                   >
//                     Delete
//                   </Button>
//                 </CardActions>
//               </Card>
//             );
//           })
//         )}

//         {/* Edit Announcement Dialog */}
//         <Dialog open={openEditDialog} onClose={handleCloseEdit} maxWidth="sm" fullWidth>
//           <DialogTitle>Edit Announcement</DialogTitle>
//           <DialogContent>
//             <TextField
//               autoFocus
//               margin="dense"
//               label="Title"
//               fullWidth
//               value={editTitle}
//               onChange={(e) => setEditTitle(e.target.value)}
//             />
//             <TextField
//               margin="dense"
//               label="Message"
//               fullWidth
//               multiline
//               minRows={3}
//               value={editMessage}
//               onChange={(e) => setEditMessage(e.target.value)}
//             />
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleCloseEdit}>Cancel</Button>
//             <Button onClick={handleUpdateAnnouncement} disabled={updateLoading}>
//               {updateLoading ? 'Updating...' : 'Update'}
//             </Button>
//           </DialogActions>
//         </Dialog>
//       </Box>
//     </div>
//   );
// };

// export default Dashboard;

// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Typography,
//   Card,
//   CardContent,
//   CardActions,
//   Button,
//   CircularProgress,
//   Alert,
//   TextField,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
// } from '@mui/material';
// import axiosInstance from '../axiosinterceptor';

// const Dashboard = () => {
//   const [announcements, setAnnouncements] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const isAdmin = localStorage.getItem('role') === 'admin';

//   // Edit Dialog
//   const [openEditDialog, setOpenEditDialog] = useState(false);
//   const [currentAnnouncement, setCurrentAnnouncement] = useState(null);
//   const [editTitle, setEditTitle] = useState('');
//   const [editMessage, setEditMessage] = useState('');
//   const [updateLoading, setUpdateLoading] = useState(false);

//   useEffect(() => {
//     const fetchAnnouncements = async () => {
//       setLoading(true);
//       try {
//         const res = await axiosInstance.get('http://localhost:3000/admin/');
//         setAnnouncements(res.data);
//       } catch (err) {
//         setError('Failed to load announcements');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAnnouncements();
//   }, []);

//   const handleVote = async (id, voteType) => {
//     try {
//       const res = await axiosInstance.post(`http://localhost:3000/admin/vote/${id}`, { voteType });
//       const updated = res.data.updatedAnnouncement;
//       setAnnouncements((prev) =>
//         prev.map((a) => (a._id === id ? updated : a))
//       );
//     } catch (err) {
//       alert(err.response?.data?.message || 'Vote failed');
//     }
//   };

//   const handleOpenEdit = (announcement) => {
//     setCurrentAnnouncement(announcement);
//     setEditTitle(announcement.title);
//     setEditMessage(announcement.message);
//     setOpenEditDialog(true);
//   };

//   const handleCloseEdit = () => {
//     setOpenEditDialog(false);
//     setCurrentAnnouncement(null);
//   };

//   const handleUpdateAnnouncement = async () => {
//     if (!editTitle.trim() || !editMessage.trim()) {
//       alert('Title and message required.');
//       return;
//     }

//     setUpdateLoading(true);
//     try {
//       const res = await axiosInstance.put(
//         `http://localhost:3000/admin/edit/${currentAnnouncement._id}`,
//         {
//           title: editTitle,
//           message: editMessage,
//         }
//       );
//       setAnnouncements((prev) =>
//         prev.map((a) =>
//           a._id === currentAnnouncement._id ? res.data.announcement : a
//         )
//       );
//       handleCloseEdit();
//     } catch (err) {
//       alert(err.response?.data?.message || 'Update failed');
//     } finally {
//       setUpdateLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this announcement?')) return;

//     try {
//       await axiosInstance.delete(`http://localhost:3000/admin/delete/${id}`);
//       setAnnouncements((prev) => prev.filter((a) => a._id !== id));
//     } catch (err) {
//       alert(err.response?.data?.message || 'Delete failed');
//     }
//   };

//   if (loading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ p: 3 }}>
//       <Typography variant="h4" gutterBottom>
//         Announcement Dashboard
//       </Typography>
//       {error && <Alert severity="error">{error}</Alert>}

//       {announcements.map((a) => (
//         <Card key={a._id} sx={{ mb: 3 }}>
//           <CardContent>
//             <Typography variant="h6">{a.title}</Typography>
//             <Typography>{a.message}</Typography>
//             <Typography variant="caption" color="textSecondary">
//               Likes: {a.likes} | Dislikes: {a.dislikes}
//             </Typography>
//           </CardContent>
//           <CardActions>
//             <Button onClick={() => handleVote(a._id, 'like')} variant="outlined" color="primary">
//               Like
//             </Button>
//             <Button onClick={() => handleVote(a._id, 'dislike')} variant="outlined" color="error">
//               Dislike
//             </Button>

//             {isAdmin && (
//               <>
//                 <Button onClick={() => handleOpenEdit(a)} variant="outlined" color="secondary">
//                   Edit
//                 </Button>
//                 <Button onClick={() => handleDelete(a._id)} variant="outlined" color="warning">
//                   Delete
//                 </Button>
//               </>
//             )}
//           </CardActions>
//         </Card>
//       ))}

//       {/* Edit Dialog */}
//       <Dialog open={openEditDialog} onClose={handleCloseEdit}>
//         <DialogTitle>Edit Announcement</DialogTitle>
//         <DialogContent>
//           <TextField
//             autoFocus
//             margin="dense"
//             label="Title"
//             fullWidth
//             value={editTitle}
//             onChange={(e) => setEditTitle(e.target.value)}
//           />
//           <TextField
//             margin="dense"
//             label="Message"
//             fullWidth
//             multiline
//             rows={3}
//             value={editMessage}
//             onChange={(e) => setEditMessage(e.target.value)}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseEdit}>Cancel</Button>
//           <Button onClick={handleUpdateAnnouncement} disabled={updateLoading}>
//             {updateLoading ? 'Updating...' : 'Update'}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default Dashboard;


// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Typography,
//   Card,
//   CardContent,
//   CardActions,
//   Button,
//   CircularProgress,
//   Alert,
//   TextField,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
// } from '@mui/material';
// import axiosInstance from '../axiosinterceptor';
// import { useNotification } from '../components/NotificationContext'; // import context

// const Dashboard = () => {
//   const [announcements, setAnnouncements] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const [openEditDialog, setOpenEditDialog] = useState(false);
//   const [currentAnnouncement, setCurrentAnnouncement] = useState(null);
//   const [editTitle, setEditTitle] = useState('');
//   const [editMessage, setEditMessage] = useState('');
//   const [updateLoading, setUpdateLoading] = useState(false);

//   const {
//     userBadge,
//     clearAnnouncementChange
//   } = useNotification();

//   const role = localStorage.getItem('role') || 'user'; // default to user

//   useEffect(() => {
//     const fetchAnnouncements = async () => {
//       setLoading(true);
//       try {
//         const res = await axiosInstance.get('http://localhost:3000/admin/');
//         setAnnouncements(res.data);
//         setError('');
//       } catch (err) {
//         console.error('Failed to fetch announcements:', err);
//         setError('Failed to fetch announcements');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAnnouncements();
//     clearAnnouncementChange(role); // clear badge when loaded
//   }, [clearAnnouncementChange, role]);

//   const handleVote = async (id, voteType) => {
//     try {
//       const res = await axiosInstance.post(`http://localhost:3000/admin/vote/${id}`, { voteType });
//       const updatedAnnouncement = res.data.updatedAnnouncement;

//       setAnnouncements((prev) =>
//         prev.map((ann) => (ann._id === id ? updatedAnnouncement : ann))
//       );
//     } catch (err) {
//       console.error('Failed to vote:', err);
//       alert(err.response?.data?.message || 'Voting failed');
//     }
//   };

//   const handleOpenEdit = (announcement) => {
//     setCurrentAnnouncement(announcement);
//     setEditTitle(announcement.title);
//     setEditMessage(announcement.message);
//     setOpenEditDialog(true);
//   };

//   const handleCloseEdit = () => {
//     setOpenEditDialog(false);
//     setCurrentAnnouncement(null);
//   };

//   const handleUpdateAnnouncement = async () => {
//     if (!editTitle.trim() || !editMessage.trim()) {
//       alert('Title and message cannot be empty');
//       return;
//     }
//     setUpdateLoading(true);
//     try {
//       const res = await axiosInstance.put(
//         `http://localhost:3000/admin/edit/${currentAnnouncement._id}`,
//         {
//           title: editTitle,
//           message: editMessage,
//         }
//       );

//       setAnnouncements((prev) =>
//         prev.map((ann) => (ann._id === currentAnnouncement._id ? res.data.announcement : ann))
//       );
//       handleCloseEdit();
//     } catch (err) {
//       console.error('Failed to update announcement:', err);
//       alert(err.response?.data?.message || 'Update failed');
//     } finally {
//       setUpdateLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this announcement?')) return;

//     try {
//       await axiosInstance.delete(`http://localhost:3000/admin/delete/${id}`);
//       setAnnouncements((prev) => prev.filter((ann) => ann._id !== id));
//     } catch (err) {
//       console.error('Failed to delete announcement:', err);
//       alert(err.response?.data?.message || 'Delete failed');
//     }
//   };

//   if (loading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <div
//       style={{
//         backgroundImage: `url('https://img.freepik.com/free-photo/paper-background_53876-88628.jpg')`,
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//         minHeight: '100vh',
//         borderRadius: '10px'
//       }}
//     >
//       <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4, p: 2 }}>
//         <Typography variant="h4" gutterBottom>
//           Announcements
//         </Typography>

//         {error && (
//           <Alert severity="error" sx={{ mb: 2 }}>
//             {error}
//           </Alert>
//         )}

//         {announcements.length === 0 ? (
//           <Typography>No announcements available.</Typography>
//         ) : (
//           announcements.map((ann) => (
//             <Card
//               key={ann._id}
//               sx={{
//                 mb: 3,
//                 backgroundColor: 'rgba(15, 15, 15, 0.8)',
//                 color: '#fff',
//                 borderRadius: 3,
//                 boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
//                 position: 'relative',
//               }}
//             >
//               {/* New Badge */}
//               {userBadge.announcement && (
//                 <Box
//                   sx={{
//                     position: 'absolute',
//                     top: 10,
//                     right: 10,
//                     backgroundColor: 'red',
//                     color: 'white',
//                     px: 1.5,
//                     py: 0.5,
//                     borderRadius: '8px',
//                     fontSize: '0.75rem',
//                     fontWeight: 'bold',
//                   }}
//                 >
//                   New
//                 </Box>
//               )}

//               <CardContent>
//                 <Typography variant="h6" sx={{ color: 'rgb(230, 128, 4)', mb: 1 }}>
//                   {ann.title}
//                 </Typography>
//                 <Typography variant="body1" sx={{ mb: 1 }}>
//                   {ann.message}
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary" sx={{ mb: 2, color: '#ddd' }}>
//                   Likes: {ann.likes} | Dislikes: {ann.dislikes}
//                 </Typography>
//               </CardContent>

//               <CardActions sx={{ px: 2, pb: 2 }}>
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   onClick={() => handleVote(ann._id, 'like')}
//                   sx={{ mr: 1 }}
//                 >
//                   Like
//                 </Button>
//                 <Button
//                   variant="outlined"
//                   color="error"
//                   onClick={() => handleVote(ann._id, 'dislike')}
//                   sx={{ mr: 3 }}
//                 >
//                   Dislike
//                 </Button>
//                 <Button
//                   variant="outlined"
//                   color="secondary"
//                   onClick={() => handleOpenEdit(ann)}
//                   sx={{ mr: 1 }}
//                 >
//                   Update
//                 </Button>
//                 <Button
//                   variant="contained"
//                   color="error"
//                   onClick={() => handleDelete(ann._id)}
//                 >
//                   Delete
//                 </Button>
//               </CardActions>
//             </Card>
//           ))
//         )}

//         {/* Edit Dialog */}
//         <Dialog open={openEditDialog} onClose={handleCloseEdit} maxWidth="sm" fullWidth>
//           <DialogTitle>Edit Announcement</DialogTitle>
//           <DialogContent>
//             <TextField
//               autoFocus
//               margin="dense"
//               label="Title"
//               fullWidth
//               value={editTitle}
//               onChange={(e) => setEditTitle(e.target.value)}
//             />
//             <TextField
//               margin="dense"
//               label="Message"
//               fullWidth
//               multiline
//               minRows={3}
//               value={editMessage}
//               onChange={(e) => setEditMessage(e.target.value)}
//             />
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleCloseEdit}>Cancel</Button>
//             <Button onClick={handleUpdateAnnouncement} disabled={updateLoading}>
//               {updateLoading ? 'Updating...' : 'Update'}
//             </Button>
//           </DialogActions>
//         </Dialog>
//       </Box>
//     </div>
//   );
// };

// export default Dashboard;


// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Typography,
//   Card,
//   CardContent,
//   CardActions,
//   Button,
//   CircularProgress,
//   Alert,
//   TextField,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
// } from '@mui/material';
// import axiosInstance from '../axiosinterceptor';
// import { useNotification } from '../components/NotificationContext';

// const Dashboard = () => {
//   const [announcements, setAnnouncements] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [cleared, setCleared] = useState(false); // prevent infinite loop

//   const [openEditDialog, setOpenEditDialog] = useState(false);
//   const [currentAnnouncement, setCurrentAnnouncement] = useState(null);
//   const [editTitle, setEditTitle] = useState('');
//   const [editMessage, setEditMessage] = useState('');
//   const [updateLoading, setUpdateLoading] = useState(false);

//   const { clearAnnouncementChange } = useNotification();
//   const role = localStorage.getItem('role');

//   useEffect(() => {
//     const fetchAnnouncements = async () => {
//       setLoading(true);
//       try {
//         const res = await axiosInstance.get('http://localhost:3000/admin/');
//         setAnnouncements(res.data);
//         setError('');
//       } catch (err) {
//         console.error('Failed to fetch announcements:', err);
//         setError('Failed to fetch announcements');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAnnouncements();
//   }, []);

//   useEffect(() => {
//     if (!cleared) {
//       clearAnnouncementChange(role);
//       setCleared(true);
//     }
//   }, [cleared, role]); // safe to omit clearAnnouncementChange if it's stable

//   const handleVote = async (id, voteType) => {
//     try {
//       const res = await axiosInstance.post(`http://localhost:3000/admin/vote/${id}`, { voteType });
//       const updatedAnnouncement = res.data.updatedAnnouncement;
//       setAnnouncements((prev) =>
//         prev.map((ann) => (ann._id === id ? updatedAnnouncement : ann))
//       );
//     } catch (err) {
//       console.error('Failed to vote:', err);
//       alert(err.response?.data?.message || 'Voting failed');
//     }
//   };

//   const handleOpenEdit = (announcement) => {
//     setCurrentAnnouncement(announcement);
//     setEditTitle(announcement.title);
//     setEditMessage(announcement.message);
//     setOpenEditDialog(true);
//   };

//   const handleCloseEdit = () => {
//     setOpenEditDialog(false);
//     setCurrentAnnouncement(null);
//   };

//   const handleUpdateAnnouncement = async () => {
//     if (!editTitle.trim() || !editMessage.trim()) {
//       alert('Title and message cannot be empty');
//       return;
//     }
//     setUpdateLoading(true);
//     try {
//       const res = await axiosInstance.put(
//         `http://localhost:3000/admin/edit/${currentAnnouncement._id}`,
//         {
//           title: editTitle,
//           message: editMessage,
//         }
//       );
//       setAnnouncements((prev) =>
//         prev.map((ann) => (ann._id === currentAnnouncement._id ? res.data.announcement : ann))
//       );
//       handleCloseEdit();
//     } catch (err) {
//       console.error('Failed to update announcement:', err);
//       alert(err.response?.data?.message || 'Update failed');
//     } finally {
//       setUpdateLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this announcement?')) return;
//     try {
//       await axiosInstance.delete(`http://localhost:3000/admin/delete/${id}`);
//       setAnnouncements((prev) => prev.filter((ann) => ann._id !== id));
//     } catch (err) {
//       console.error('Failed to delete announcement:', err);
//       alert(err.response?.data?.message || 'Delete failed');
//     }
//   };

//   if (loading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

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
//       <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4, p: 2 }}>
//         <Typography variant="h4" gutterBottom>
//           Announcements
//         </Typography>

//         {error && (
//           <Alert severity="error" sx={{ mb: 2 }}>
//             {error}
//           </Alert>
//         )}

//         {announcements.length === 0 ? (
//           <Typography>No announcements available.</Typography>
//         ) : (
//           announcements.map((ann) => (
//             <Card
//               key={ann._id}
//               sx={{
//                 mb: 3,
//                 backgroundColor: 'rgba(15, 15, 15, 0.8)',
//                 color: '#fff',
//                 borderRadius: 3,
//                 boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
//               }}
//             >
//               <CardContent>
//                 <Typography variant="h6" sx={{ color: 'rgb(230, 128, 4)', mb: 1 }}>
//                   {ann.title}
//                 </Typography>
//                 <Typography variant="body1" sx={{ mb: 1 }}>
//                   {ann.message}
//                 </Typography>
//                 <Typography variant="body2" sx={{ mb: 2, color: '#ddd' }}>
//                   Likes: {ann.likes} | Dislikes: {ann.dislikes}
//                 </Typography>
//               </CardContent>

//               <CardActions sx={{ px: 2, pb: 2 }}>
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   onClick={() => handleVote(ann._id, 'like')}
//                   sx={{ mr: 1 }}
//                 >
//                   Like
//                 </Button>
//                 <Button
//                   variant="outlined"
//                   color="error"
//                   onClick={() => handleVote(ann._id, 'dislike')}
//                   sx={{ mr: 3 }}
//                 >
//                   Dislike
//                 </Button>

//                 <Button
//                   variant="outlined"
//                   color="secondary"
//                   onClick={() => handleOpenEdit(ann)}
//                   sx={{ mr: 1 }}
//                 >
//                   Update
//                 </Button>
//                 <Button variant="contained" color="error" onClick={() => handleDelete(ann._id)}>
//                   Delete
//                 </Button>
//               </CardActions>
//             </Card>
//           ))
//         )}

//         {/* Edit Dialog */}
//         <Dialog open={openEditDialog} onClose={handleCloseEdit} maxWidth="sm" fullWidth>
//           <DialogTitle>Edit Announcement</DialogTitle>
//           <DialogContent>
//             <TextField
//               autoFocus
//               margin="dense"
//               label="Title"
//               fullWidth
//               value={editTitle}
//               onChange={(e) => setEditTitle(e.target.value)}
//             />
//             <TextField
//               margin="dense"
//               label="Message"
//               fullWidth
//               multiline
//               minRows={3}
//               value={editMessage}
//               onChange={(e) => setEditMessage(e.target.value)}
//             />
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleCloseEdit}>Cancel</Button>
//             <Button onClick={handleUpdateAnnouncement} disabled={updateLoading}>
//               {updateLoading ? 'Updating...' : 'Update'}
//             </Button>
//           </DialogActions>
//         </Dialog>
//       </Box>
//     </div>
//   );
// };

// export default Dashboard;




// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Typography,
//   Card,
//   CardContent,
//   CardActions,
//   Button,
//   CircularProgress,
//   Alert,
//   TextField,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
// } from '@mui/material';
// import axiosInstance from '../axiosinterceptor';
// import { useNotification } from '../components/NotificationContext';

// const Dashboard = () => {
//   const [announcements, setAnnouncements] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [cleared, setCleared] = useState(false); // <- fix for infinite loop

//   const [openEditDialog, setOpenEditDialog] = useState(false);
//   const [currentAnnouncement, setCurrentAnnouncement] = useState(null);
//   const [editTitle, setEditTitle] = useState('');
//   const [editMessage, setEditMessage] = useState('');
//   const [updateLoading, setUpdateLoading] = useState(false);

//   const { clearAnnouncementChange } = useNotification();
//   const role = localStorage.getItem('role');

//   useEffect(() => {
//     const fetchAnnouncements = async () => {
//       setLoading(true);
//       try {
//         const res = await axiosInstance.get('http://localhost:3000/admin/');
//         setAnnouncements(res.data);
//         setError('');
//       } catch (err) {
//         console.error('Failed to fetch announcements:', err);
//         setError('Failed to fetch announcements');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAnnouncements();
//   }, []);

//   // Safe call to clearAnnouncementChange
//   useEffect(() => {
//     if (!cleared) {
//       clearAnnouncementChange(role);
//       setCleared(true);
//     }
//   }, [cleared, role]);

//   const handleVote = async (id, voteType) => {
//     try {
//       const res = await axiosInstance.post(`http://localhost:3000/admin/vote/${id}`, { voteType });
//       const updatedAnnouncement = res.data.updatedAnnouncement;

//       setAnnouncements((prev) =>
//         prev.map((ann) => (ann._id === id ? updatedAnnouncement : ann))
//       );
//     } catch (err) {
//       console.error('Failed to vote:', err);
//       alert(err.response?.data?.message || 'Voting failed');
//     }
//   };

//   const handleOpenEdit = (announcement) => {
//     setCurrentAnnouncement(announcement);
//     setEditTitle(announcement.title);
//     setEditMessage(announcement.message);
//     setOpenEditDialog(true);
//   };

//   const handleCloseEdit = () => {
//     setOpenEditDialog(false);
//     setCurrentAnnouncement(null);
//   };

//   const handleUpdateAnnouncement = async () => {
//     if (!editTitle.trim() || !editMessage.trim()) {
//       alert('Title and message cannot be empty');
//       return;
//     }
//     setUpdateLoading(true);
//     try {
//       const res = await axiosInstance.put(
//         `http://localhost:3000/admin/edit/${currentAnnouncement._id}`,
//         {
//           title: editTitle,
//           message: editMessage,
//         }
//       );

//       setAnnouncements((prev) =>
//         prev.map((ann) =>
//           ann._id === currentAnnouncement._id ? res.data.announcement : ann
//         )
//       );
//       handleCloseEdit();
//     } catch (err) {
//       console.error('Failed to update announcement:', err);
//       alert(err.response?.data?.message || 'Update failed');
//     } finally {
//       setUpdateLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this announcement?')) return;

//     try {
//       await axiosInstance.delete(`http://localhost:3000/admin/delete/${id}`);
//       setAnnouncements((prev) => prev.filter((ann) => ann._id !== id));
//     } catch (err) {
//       console.error('Failed to delete announcement:', err);
//       alert(err.response?.data?.message || 'Delete failed');
//     }
//   };

//   if (loading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

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
//       <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4, p: 2 }}>
//         <Typography variant="h4" gutterBottom>
//           Announcements
//         </Typography>

//         {error && (
//           <Alert severity="error" sx={{ mb: 2 }}>
//             {error}
//           </Alert>
//         )}

//         {announcements.length === 0 ? (
//           <Typography>No announcements available.</Typography>
//         ) : (
//           announcements.map((ann) => (
//             <Card
//               key={ann._id}
//               sx={{
//                 mb: 3,
//                 backgroundColor: 'rgba(15, 15, 15, 0.8)',
//                 color: '#fff',
//                 borderRadius: 3,
//                 boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
//               }}
//             >
//               <CardContent>
//                 <Typography variant="h6" sx={{ color: 'rgb(230, 128, 4)', mb: 1 }}>
//                   {ann.title}
//                 </Typography>
//                 <Typography variant="body1" sx={{ mb: 1 }}>
//                   {ann.message}
//                 </Typography>
//                 <Typography variant="body2" sx={{ mb: 2, color: '#ddd' }}>
//                   Likes: {ann.likes} | Dislikes: {ann.dislikes}
//                 </Typography>
//               </CardContent>

//               <CardActions sx={{ px: 2, pb: 2 }}>
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   onClick={() => handleVote(ann._id, 'like')}
//                   sx={{ mr: 1 }}
//                 >
//                   Like
//                 </Button>
//                 <Button
//                   variant="outlined"
//                   color="error"
//                   onClick={() => handleVote(ann._id, 'dislike')}
//                   sx={{ mr: 3 }}
//                 >
//                   Dislike
//                 </Button>
//                 <Button
//                   variant="outlined"
//                   color="secondary"
//                   onClick={() => handleOpenEdit(ann)}
//                   sx={{ mr: 1 }}
//                 >
//                   Update
//                 </Button>
//                 <Button
//                   variant="contained"
//                   color="error"
//                   onClick={() => handleDelete(ann._id)}
//                 >
//                   Delete
//                 </Button>
//               </CardActions>
//             </Card>
//           ))
//         )}

//         <Dialog open={openEditDialog} onClose={handleCloseEdit} maxWidth="sm" fullWidth>
//           <DialogTitle>Edit Announcement</DialogTitle>
//           <DialogContent>
//             <TextField
//               autoFocus
//               margin="dense"
//               label="Title"
//               fullWidth
//               value={editTitle}
//               onChange={(e) => setEditTitle(e.target.value)}
//             />
//             <TextField
//               margin="dense"
//               label="Message"
//               fullWidth
//               multiline
//               minRows={3}
//               value={editMessage}
//               onChange={(e) => setEditMessage(e.target.value)}
//             />
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleCloseEdit}>Cancel</Button>
//             <Button onClick={handleUpdateAnnouncement} disabled={updateLoading}>
//               {updateLoading ? 'Updating...' : 'Update'}
//             </Button>
//           </DialogActions>
//         </Dialog>
//       </Box>
//     </div>
//   );
// };

// export default Dashboard;
// import React, { useEffect, useState } from 'react';
// import {
//   Button,
//   Card,
//   CardActions,
//   CardContent,
//   Grid,
//   Typography,
// } from '@mui/material';
// import axiosInstance from '../axiosinterceptor';
// import { useNavigate } from 'react-router-dom';

// const Dashboard = () => {
//   const [announcements, setAnnouncements] = useState([]);
//   const navigate = useNavigate();

//   const token = localStorage.getItem('logintoken');
//   const role = localStorage.getItem('role');
//   const userEmail = token ? JSON.parse(atob(token.split('.')[1])).email : null;

//   useEffect(() => {
//     axiosInstance
//       .get('http://localhost:3000/admin/')
//       .then((res) => setAnnouncements(res.data))
//       .catch(() => alert('Failed to load announcements'));
//   }, []);

//   const hasVotedAfterUpdate = (announcement) => {
//     const updatedDate = new Date(announcement.updatedAt || announcement.createdAt);
//     const vote = announcement.votedUsers.find(
//       (v) => v.email === userEmail && new Date(v.votedAt) >= updatedDate
//     );
//     return !!vote;
//   };

//   const getUserVoteType = (announcement) => {
//     const updatedDate = new Date(announcement.updatedAt || announcement.createdAt);
//     const vote = announcement.votedUsers.find(
//       (v) => v.email === userEmail && new Date(v.votedAt) >= updatedDate
//     );
//     return vote?.voteType;
//   };

//   const handleVote = (id, voteType) => {
//     axiosInstance
//       .post(`http://localhost:3000/admin/vote/${id}`, { voteType })
//       .then((res) => {
//         alert(res.data.message);
//         const updated = res.data.updatedAnnouncement;
//         setAnnouncements((prev) =>
//           prev.map((a) => (a._id === id ? updated : a))
//         );
//       })
//       .catch((err) =>
//         alert(err?.response?.data?.message || 'Failed to vote')
//       );
//   };

//   const handleUpdate = (announcement) => {
//     navigate(`/add-announcement/${announcement._id}`, {
//       state: { announcement },
//     });
//   };

//   const handleDelete = (id) => {
//     if (window.confirm('Are you sure you want to delete this announcement?')) {
//       axiosInstance
//         .delete(`http://localhost:3000/admin/delete/${id}`)
//         .then(() => {
//           alert('Announcement deleted');
//           setAnnouncements((prev) => prev.filter((a) => a._id !== id));
//         })
//         .catch(() => alert('Failed to delete announcement'));
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
//       <div style={{ padding: 20, borderRadius: 10 }}>
//         <Typography
//           variant="h4"
//           align="center"
//           gutterBottom
//           style={{ color: '#fff' }}
//         >
//           Announcements Dashboard
//         </Typography>

//         <Grid container spacing={3}>
//           {announcements.length === 0 ? (
//             <Typography style={{ color: '#fff' }}>
//               No announcements available.
//             </Typography>
//           ) : (
//             announcements.map((announcement) => {
//               const hasVoted = hasVotedAfterUpdate(announcement);
//               const userVoteType = getUserVoteType(announcement);

//               return (
//                 <Grid item xs={12} sm={6} md={4} key={announcement._id}>
//                   <Card
//                     style={{
//                       backgroundColor: 'rgba(15, 15, 15, 0.7)',
//                       color: '#fff',
//                       borderRadius: '16px',
//                       boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
//                       padding: '16px',
//                     }}
//                   >
//                     <CardContent>
//                       <Typography variant="h6" style={{ color: '#f9a825' }}>
//                         {announcement.title}
//                       </Typography>
//                       <Typography variant="body2" paragraph>
//                         {announcement.message}
//                       </Typography>
//                       <Typography variant="body2">
//                         {new Date(
//                           announcement.updatedAt || announcement.createdAt
//                         ).toLocaleString()}
//                       </Typography>
//                       <Typography variant="body2">
//                         Likes: {announcement.likes} | Dislikes:{' '}
//                         {announcement.dislikes}
//                       </Typography>
//                     </CardContent>
//                     <CardActions>
//                       <Button
//                         size="small"
//                         variant={
//                           userVoteType === 'like' ? 'contained' : 'outlined'
//                         }
//                         color="primary"
//                         disabled={hasVoted}
//                         onClick={() => handleVote(announcement._id, 'like')}
//                       >
//                         👍 Like
//                       </Button>
//                       <Button
//                         size="small"
//                         variant={
//                           userVoteType === 'dislike' ? 'contained' : 'outlined'
//                         }
//                         color="error"
//                         disabled={hasVoted}
//                         onClick={() => handleVote(announcement._id, 'dislike')}
//                       >
//                         👎 Dislike
//                       </Button>

//                       {role === 'admin' && (
//                         <>
//                           <Button
//                             size="small"
//                             variant="contained"
//                             style={{
//                               backgroundColor: 'rgb(92, 124, 156)',
//                             }}
//                             onClick={() => handleUpdate(announcement)}
//                           >
//                             Update
//                           </Button>
//                           <Button
//                             size="small"
//                             variant="contained"
//                             color="error"
//                             onClick={() => handleDelete(announcement._id)}
//                           >
//                             Delete
//                           </Button>
//                         </>
//                       )}
//                     </CardActions>
//                   </Card>
//                 </Grid>
//               );
//             })
//           )}
//         </Grid>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


