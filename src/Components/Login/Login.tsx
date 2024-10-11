import React, { useState } from 'react';
import './Login.css';  // Importing your CSS
import Logo from '../../images/logo.jpg';
import { Outlet, useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import axios from 'axios'; // Import axios for making HTTP requests

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false); // State for "Remember Me"
  const [error, setError] = useState<string>(''); // State for error messages
  const navigate = useNavigate(); // Hook for navigation

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Gửi yêu cầu đăng nhập đến server
    try {
      const response = await axios.post('http://localhost:5000/login', {
        username,
        password,
      });

      // Nếu đăng nhập thành công
      if (response.status === 200) {
        console.log('Đăng nhập thành công:', response.data);
        // Bạn có thể lưu thông tin người dùng vào localStorage hoặc sessionStorage nếu cần
        if (rememberMe) {
          localStorage.setItem('user', JSON.stringify(response.data.user)); // Lưu thông tin người dùng
        }
        // Chuyển hướng đến trang Menu
        navigate('/Menu');
      }
    } catch (error: any) {
      // Xử lý lỗi nếu đăng nhập không thành công
      if (error.response && error.response.status === 401) {
        setError('Tên đăng nhập hoặc mật khẩu không đúng.');
      } else {
        setError('Đã xảy ra lỗi. Vui lòng thử lại sau.');
      }
      console.error('Đăng nhập không thành công:', error);
    }
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
          <h2 style={{ fontSize: "20px" }}>Đăng nhập tài khoản thư viện</h2>
          
          {error && <div className="error-message">{error}</div>} {/* Hiển thị thông báo lỗi */}

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

          <button type="submit">Đăng nhập</button> {/* Đưa nút Đăng nhập ra khỏi Link */}

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
