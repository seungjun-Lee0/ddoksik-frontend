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

  const toggleDarkMode = () => {
    const isDarkMode = document.body.classList.toggle("dark-mode");
    // 클래스 토글 후, 현재 다크 모드가 활성화되었는지 확인하여 그에 따라 'true' 또는 'false'를 저장합니다.
    localStorage.setItem("darkMode", isDarkMode ? "true" : "false");
    window.location.reload();
  };
      
  return (
    <div className="header">
      <a href="/home" className='custom-link'>
        <div className="logo">
          <img src='logo.png'/>
          <span>
          DDokSik.
          </span>
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
