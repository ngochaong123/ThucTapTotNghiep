import React, { useState } from 'react';
import './Login.css';  // Importing your CSS
import Logo from '../../images/logo.jpg';
import { Outlet, Link } from "react-router-dom";

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false); // State for "Remember Me"

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Logging in with', { username, password, rememberMe });
  };

  return (
    <div className="login-page">
      {/* Logo */}
      <div className="logo-container">
        <img src={Logo} className="logo"/>  {/* Logo image */}
        <div className="NameLogoLogin">QUẢN LÝ THƯ VIỆN</div>  {/* Logo name */}
      </div>

      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2 style={{
            fontSize:"20px"
          }}>Đăng nhập tài khoản thư viện</h2>
          
          <div className="input-group">
            <label htmlFor="username">Tài khoản</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Flex container for Remember Me and Forgot Password */}
          <div className="flex-container">
            <label>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)} // Toggle state
              />
              Ghi nhớ tài khoản
            </label>
            <a href="/forgot-password" className="link">Quên mật khẩu?</a>
          </div>
          <Link to="/Menu">
            <button type="submit">Đăng nhập</button>
          </Link>
          

          {/* Link for Register */}
          <div className="links-container-Login">
            <div> Bạn đã có tài khoản chưa?</div>
            <a href="/register" className="link">Đăng ký tài khoản</a>
          </div>
        </form>
      </div>
      <Outlet />
    </div>
  );
};

export default Login;
