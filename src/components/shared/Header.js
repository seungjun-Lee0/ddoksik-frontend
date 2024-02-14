import React from 'react';
import { Link } from 'react-router-dom';

function Header({ user, onLogout }) {
  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#4caf50',
    color: 'white',
    fontSize: '20px',
  };

  return (
    <div style={headerStyle}>
      <div><Link to="/home">DietApp</Link></div>
      <div>
        {user ? (
          // Use button for logout to call the onLogout function
          <button onClick={onLogout}>Logout</button>
        ) : (
          // Use Link to navigate without reloading the page
          <Link to="/login" style={{ color: 'inherit' }}>Login</Link>
        )}
      </div>
    </div>
  );
}

export default Header;
