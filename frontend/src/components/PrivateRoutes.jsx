// import React from 'react';
// import { Navigate } from 'react-router-dom';

// const PrivateRoutes = ({ children }) => {
//   const token = localStorage.getItem('logintoken');
//   return token ? children : <Navigate to="/login" />;
// };

// export default PrivateRoutes;



import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoutes = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('logintoken');
  const role = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" />; // or redirect elsewhere
  }

  return children;
};

export default PrivateRoutes;
