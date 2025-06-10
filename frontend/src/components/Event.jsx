



import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosinterceptor';

const Event = () => {
  const [events, setEvents] = useState([]);
  const [highlightedEvents, setHighlightedEvents] = useState([]);
  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  const getSeenEvents = () => {
    try {
      return JSON.parse(localStorage.getItem('seenEvents') || '{}');
    } catch {
      return {};
    }
  };

  const saveSeenEvents = (seenEvents) => {
    localStorage.setItem('seenEvents', JSON.stringify(seenEvents));
  };

  const markEventAsSeen = (eventId) => {
    setHighlightedEvents(prev => prev.filter(id => id !== eventId));
    const seenEvents = getSeenEvents();
    const clickedEvent = events.find(e => e._id === eventId);
    if (clickedEvent) {
      seenEvents[eventId] = clickedEvent.updatedAt;
      saveSeenEvents(seenEvents);
    }
  };

  useEffect(() => {
    axiosInstance.get('/event')
      .then(res => {
        const fetchedEvents = res.data;
        setEvents(fetchedEvents);

        const seenEvents = getSeenEvents();
        const newOrUpdatedIds = fetchedEvents
          .filter(event => {
            const lastSeen = seenEvents[event._id];
            return !lastSeen || new Date(event.updatedAt) > new Date(lastSeen);
          })
          .map(event => event._id);

        setHighlightedEvents(newOrUpdatedIds);
      })
      .catch(() => alert('Failed to load events'));
  }, []);

  const handleCardClick = (id) => {
    markEventAsSeen(id);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      axiosInstance.delete(`/event/delete/${id}`)
        .then(() => {
          alert('Event deleted successfully');
          setEvents(prev => prev.filter(event => event._id !== id));
          setHighlightedEvents(prev => prev.filter(eventId => eventId !== id));
          const seenEvents = getSeenEvents();
          delete seenEvents[id];
          saveSeenEvents(seenEvents);
        })
        .catch(() => alert('Failed to delete event'));
    }
  };

  const handleUpdate = (event) => {
    navigate(`/add-event/${event._id}`, { state: { event } });
  };

  const handleBook = (event) => {
    markEventAsSeen(event._id); // clear badge
    navigate(`/book-event/${event._id}`, { state: { event } });
  };

  const formatAvailability = (event) => {
    const now = new Date();
    if (event.availability.toLowerCase() === 'available') {
      return (
        <Typography variant="body2" color="success.main">
          Available Now
        </Typography>
      );
    } else if (event.date) {
      const eventDate = new Date(event.date);
      if (eventDate > now) {
        return (
          <Typography variant="body2" color="warning.main">
            Available on {eventDate.toLocaleDateString()} at {event.time || 'TBD'}
          </Typography>
        );
      }
    }
    return (
      <Typography variant="body2" color="error.main">
        Unavailable
      </Typography>
    );
  };

  return (
    <div
      style={{
        backgroundImage: `url('https://img.freepik.com/free-photo/paper-background_53876-88628.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        borderRadius: '10px'
      }}
    >
      <div style={{ padding: 20 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Community Events
        </Typography>

        <Grid container spacing={3}>
          {events.length === 0 ? (
            <Typography style={{ color: '#fff' }}>No events available.</Typography>
          ) : (
            events.map(event => (
              <Grid item xs={12} sm={6} md={4} key={event._id}>
                <div
                  style={{ position: 'relative', display: 'inline-block', width: '100%' }}
                  onClick={() => handleCardClick(event._id)}
                >
                  {highlightedEvents.includes(event._id) && (
                    <span
                      style={{
                        position: 'absolute',
                        top: -6,
                        left: -6,
                        width: 12,
                        height: 12,
                        backgroundColor: 'red',
                        borderRadius: '50%',
                        zIndex: 10,
                      }}
                    />
                  )}

                  <Card
                    style={{
                      backgroundColor: 'rgba(15, 15, 15, 0.7)',
                      color: '#fff',
                      borderRadius: '16px',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
                      overflow: 'hidden',
                      width: '100%',
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="160"
                      image={event.image}
                      alt={event.name}
                      style={{ objectFit: 'cover' }}
                    />
                    <CardContent>
                      <Typography variant="h6" style={{ color: 'rgb(230, 128, 4)' }}>
                        {event.name}
                      </Typography>
                      <Typography variant="body2" color="white"> Location: {event.location}</Typography>
                      <Typography variant="body2" color="white"> Facility: {event.capacity}</Typography>
                      <Typography variant="body2" color="white"> Phone: {event.phoneNo}</Typography>
                      <Typography variant="body2" color="white"> Booking Rate: ₹{event.bookingRate} Per day</Typography>
                      {formatAvailability(event)}
                    </CardContent>

                    <CardActions>
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBook(event);
                        }}
                        disabled={event.availability.toLowerCase() !== 'available'}
                        sx={{ backgroundColor: 'rgb(92, 124, 156)' }}
                      >
                        Book
                      </Button>

                      {role === 'admin' && (
                        <>
                          <Button
                            size="small"
                            variant="contained"
                            style={{ backgroundColor: 'rgb(92, 124, 156)', color: '#fff' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdate(event);
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
                              handleDelete(event._id);
                            }}
                          >
                            Delete
                          </Button>
                        </>
                      )}
                    </CardActions>
                  </Card>
                </div>
              </Grid>
            ))
          )}
        </Grid>
      </div>
    </div>
  );
};

export default Event;
