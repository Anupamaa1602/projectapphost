import React from 'react';
import Nav from './Nav';

const Main = ({ child }) => {
  return (
    <div>
      <Nav />
      <div style={{ padding: '20px' }}>
        {child}
      </div>
    </div>
  );
};

export default Main;
