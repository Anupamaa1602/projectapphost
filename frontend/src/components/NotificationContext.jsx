
// import React, { createContext, useContext, useState } from 'react';

// const NotificationContext = createContext();

// export const NotificationProvider = ({ children }) => {
//   const [announcementChanged, setAnnouncementChanged] = useState(false);
//   const [eventChanged, setEventChanged] = useState(false);
//   const [messageChanged, setMessageChanged] = useState(false);

  
//   const notifyAnnouncementChange = () => setAnnouncementChanged(true);
//   const notifyEventChange = () => setEventChanged(true);
//   const notifyMessageChange = () => setMessageChanged(true);

  
//   const clearAnnouncementChange = () => setAnnouncementChanged(false);
//   const clearEventChange = () => setEventChanged(false);
//   const clearMessageChange = () => setMessageChanged(false);

//   return (
//     <NotificationContext.Provider
//       value={{
//         announcementChanged,
//         eventChanged,
//         messageChanged,
//         notifyAnnouncementChange,
//         notifyEventChange,
//         notifyMessageChange,
//         clearAnnouncementChange,
//         clearEventChange,
//         clearMessageChange,
//       }}
//     >
//       {children}
//     </NotificationContext.Provider>
//   );
// };

// export const useNotification = () => useContext(NotificationContext);


import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  // Separate notification flags for admin and user
  const [adminBadge, setAdminBadge] = useState({
    announcement: false,
    event: false,
    message: false,
  });

  const [userBadge, setUserBadge] = useState({
    announcement: false,
    event: false,
    message: false,
  });

  // Call this when an item is added/updated
  const notifyAnnouncementChange = () => {
    setAdminBadge(prev => ({ ...prev, announcement: true }));
    setUserBadge(prev => ({ ...prev, announcement: true }));
  };

  const notifyEventChange = () => {
    setAdminBadge(prev => ({ ...prev, event: true }));
    setUserBadge(prev => ({ ...prev, event: true }));
  };

  const notifyMessageChange = () => {
    setAdminBadge(prev => ({ ...prev, message: true }));
    setUserBadge(prev => ({ ...prev, message: true }));
  };

  // Clear badge only for current role
  const clearAnnouncementChange = (role) => {
    if (role === 'admin') {
      setAdminBadge(prev => ({ ...prev, announcement: false }));
    } else {
      setUserBadge(prev => ({ ...prev, announcement: false }));
    }
  };

  const clearEventChange = (role) => {
    if (role === 'admin') {
      setAdminBadge(prev => ({ ...prev, event: false }));
    } else {
      setUserBadge(prev => ({ ...prev, event: false }));
    }
  };

  const clearMessageChange = (role) => {
    if (role === 'admin') {
      setAdminBadge(prev => ({ ...prev, message: false }));
    } else {
      setUserBadge(prev => ({ ...prev, message: false }));
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        adminBadge,
        userBadge,
        notifyAnnouncementChange,
        notifyEventChange,
        notifyMessageChange,
        clearAnnouncementChange,
        clearEventChange,
        clearMessageChange,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
