// src/components/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';

function Footer({user}) {
  const footerStyle = {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: '10px 0',
    backgroundColor: '#4caf50',
    color: 'white',
    position: 'fixed',
    bottom: '0',
    width: '100%',
  };

  return (
    <div style={footerStyle}>
      <div><Link to="/home">Home</Link></div>
      <div>Plans</div>
      <div><Link to="/view-health-profile">Profile</Link></div>
    </div>
  );
}

export default Footer;
