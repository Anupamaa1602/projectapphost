

import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import AddAnnouncement from './components/AddAnnouncement';
import PrivateRoutes from './components/PrivateRoutes';
import Main from './components/Main';
import Event from './components/Event'; // ✅ Import Event component
import AddEvent from './components/AddEvent';
import './App.css';
import HomePage from './components/HomePage';
import BookEvent from './components/BookEvent';
import MyBooking from './components/MyBooking';
import Message from './components/Message';
import AddMessage from './components/AddMessages';
import Payment from './components/Payment';
import VoteList from './components/VoteList';
import ResetPassword from './components/ResetPassword';
import ForgotPassword from './components/ForgotPassword';
import CheckoutForm from './components/CheckoutForm';
import PaidDuesList from './components/PaidDuesList';
const App = () => {
  return (

    <Routes>
      {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
  <Route path="/forgot-password" element={<ForgotPassword />} />
      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoutes>
            <Main child={<Dashboard />} />
          </PrivateRoutes>
        }
      />

      <Route
        path="/events"
        element={
          <PrivateRoutes>
            <Main child={<Event />} />
          </PrivateRoutes>
        }
      />
      <Route
        path="/book-event/:id"
        element={
          <PrivateRoutes>
            <Main child={<BookEvent />} />  
          </PrivateRoutes>
        }
      />
<Route
  path="/mybookings"
  element={
    <PrivateRoutes>
      <Main child={<MyBooking />} />
    </PrivateRoutes>
  }
/>


      <Route
        path="/add-announcement"
        element={
          <PrivateRoutes allowedRole="admin">
            <Main child={<AddAnnouncement />} />
          </PrivateRoutes>
        }
      />

      <Route
        path="/add-announcement/:id"
        element={
          <PrivateRoutes allowedRole="admin">
            <Main child={<AddAnnouncement />} />
          </PrivateRoutes>
        }
      />

<Route
  path="/vote-list"
  element={
    <PrivateRoutes allowedRole="admin">
      <Main child={<VoteList />} />
    </PrivateRoutes>
  }
/>
  
      
      <Route
        path="/add-event"
        element={
          <PrivateRoutes allowedRole="admin">
            <Main child={<AddEvent/>} />
          </PrivateRoutes>
        }
      />
      <Route
        path="/add-event/:id"
        element={
          <PrivateRoutes allowedRole="admin">
            <Main child={<AddEvent />} />
          </PrivateRoutes>
        }
      />
       <Route
        path="/messages"
        element={
          <PrivateRoutes >
            <Main child={<Message />} /> 
          </PrivateRoutes>
        }
      />
      <Route
        path="/add-message"
        element={
          <PrivateRoutes allowedRole="admin">
            <Main child={<AddMessage />} />
          </PrivateRoutes>
        }
      />
      <Route
        path="/add-message/:id"
        element={
          <PrivateRoutes allowedRole="admin">
            <Main child={<AddMessage />} />
          </PrivateRoutes>
        }
      />
      <Route
        path="messages/make-payment"
        element={
          <PrivateRoutes >
            <Main child={<Payment />} />
          </PrivateRoutes>
        }
      />
        
      <Route
        path="/messages/make-payment"
        element={
          <PrivateRoutes >
            <Main child={<CheckoutForm />} />
          </PrivateRoutes>
        }
      />
//dueslist
      <Route
        path="/paidlist"
        element={
          <PrivateRoutes >
            <Main child={<PaidDuesList />} />
          </PrivateRoutes>
        }
      />



    </Routes>
  );
};

export default App;

