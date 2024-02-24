import React, { useContext, useEffect } from 'react';
import { AccountContext } from '../../Context/Account'

function Header({ user }) {
  const { logout } = useContext(AccountContext);

  useEffect(() => {
    const header = document.querySelector(".header");

    if (header) {
      const handleScroll = (e) => {
        e.target.scrollTop > 30
          ? header.classList.add("header-shadow")
          : header.classList.remove("header-shadow");
      };

      document.body.addEventListener("scroll", handleScroll);

      // 컴포넌트 언마운트 시 이벤트 리스너 제거
      return () => document.body.removeEventListener("scroll", handleScroll);
    }
  }, []); // 빈 배열을 전달하여 컴포넌트 마운트 시에만 실행되도록 함

  // React 방식으로 dark mode 토글 함수 정의
  const toggleDarkMode = () => {
    document.body.classList.toggle("dark-mode");
  };
      
  return (
    <div className="header">
      <a href="/home" className='custom-link'>
        <div className="logo">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path xmlns="http://www.w3.org/2000/svg" d="M512 503.5H381.7a48 48 0 01-45.3-32.1L265 268.1l-9-25.5 2.7-124.6L338.2 8.5l23.5 67.1L512 503.5z" fill="#0473ff" data-original="#28b446" />
          <path xmlns="http://www.w3.org/2000/svg" fill="#0473ff" data-original="#219b38" d="M361.7 75.6L265 268.1l-9-25.5 2.7-124.6L338.2 8.5z" />
          <path xmlns="http://www.w3.org/2000/svg" d="M338.2 8.5l-82.2 234-80.4 228.9a48 48 0 01-45.3 32.1H0l173.8-495h164.4z" fill="#0473ff" data-original="#518ef8" />
          </svg>
          DDokSik.
        </div>
     </a>
     {/* <div className="header-menu">
      <a href="#" className="active">Find Job</a>
      <a href="#">Company Review</a>
      <a href="#">Find Salaries</a>
     </div> */}
     <div className="user-settings">
      <div className="dark-light" onClick={toggleDarkMode}>
       <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></svg>
      </div>
      <div className="user-menu">
       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-square">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /></svg>
      </div>
      {user ? (
          // Use button for logout to call the onLogout function
          <div>
            <button onClick={logout} className='header-button'>Logout</button>
            {/* <img className="user-profile" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%283%29+%281%29.png" alt="" />
            <div className="user-name">Suhayel Nasim</div> */}
          </div>
        ) : (
          // Use Link to navigate without reloading the page
          <a href='/login'><button className='header-button'>Login</button></a>
        )}
      
     </div>
    </div>
    
  );
}

export default Header;
