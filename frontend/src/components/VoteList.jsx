


import React, { useEffect, useState } from 'react';
import {
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import axiosInstance from '../axiosinterceptor';

const VoteList = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const role = localStorage.getItem('role'); // Get user role from localStorage

  useEffect(() => {
    const fetchVotes = async () => {
      try {
        const res = await axiosInstance.get('http://localhost:3000/admin/');
        setAnnouncements(res.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch vote list');
        setLoading(false);
      }
    };

    fetchVotes();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;

    try {
      await axiosInstance.delete(`http://localhost:3000/admin/announcement/${id}/votes`);
      setAnnouncements(prev => prev.filter(item => item._id !== id));
      alert('Announcement deleted successfully.');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  if (loading) {
    return <CircularProgress style={{ margin: '20px auto', display: 'block' }} />;
  }

  if (error) {
    return <Alert severity="error" style={{ margin: '20px' }}>{error}</Alert>;
  }

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Vote List (Admin Only)
      </Typography>

      <Grid container spacing={3}>
        {announcements.length === 0 && (
          <Typography>No announcements found.</Typography>
        )}

        {announcements.map((item) => (
          <Grid item xs={12} md={6} key={item._id}>
            <Card
              style={{
                backgroundColor: 'rgba(30, 30, 30, 0.8)',
                color: 'white',
                borderRadius: 16,
                boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                padding: 16,
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {item.title}
                </Typography>

                {item.votedUsers && item.votedUsers.length > 0 ? (
                  <ul style={{ paddingLeft: 20 }}>
                    {item.votedUsers.map((user, idx) => (
                      <li key={idx}>
                        <Typography variant="body2" style={{ color: '#ccc' }}>
                          {user.name
                            ? `${user.name} (${user.email})`
                            : user.email}{' '}
                          - {user.voteType}
                        </Typography>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Typography variant="body2" style={{ color: '#ccc' }}>
                    No votes yet
                  </Typography>
                )}

                {role === 'admin' && (
                  <button
                    onClick={() => handleDelete(item._id)}
                    style={{
                      marginTop: 10,
                      padding: '6px 12px',
                      backgroundColor: 'red',
                      color: 'white',
                      border: 'none',
                      borderRadius: 8,
                      cursor: 'pointer',
                    }}
                  >
                    Delete
                  </button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default VoteList;
