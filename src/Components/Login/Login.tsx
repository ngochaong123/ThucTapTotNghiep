import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Login.css';  
import Logo from '../../images/logo.jpg';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false); // State cho "Remember Me"
  const [error, setError] = useState<string>(''); 
  const [showPassword, setShowPassword] = useState<boolean>(false); 
  const navigate = useNavigate(); 

  // Hàm kiểm tra tính hợp lệ của tên người dùng
  const isValidUsername = (username: string) => {
    const usernameRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])/;
    return usernameRegex.test(username);
  };

  // Hàm kiểm tra tính hợp lệ của mật khẩu
  const isValidPassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  // Hàm xử lý đăng nhập
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!isValidUsername(username) || !isValidPassword(password)) {
      alert("Tên người dùng hoặc mật khẩu không hợp lệ.");
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:5000/login', {
        username,
        password,
      });
  
      if (response.data.success) {  
        // Lưu thông tin vào localStorage nếu "Ghi nhớ tài khoản" được chọn
        if (rememberMe) {
          localStorage.setItem('username', username);
          localStorage.setItem('password', password); // Hoặc lưu token nếu có
        } else {
          localStorage.removeItem('username');
          localStorage.removeItem('password');
        }
        navigate('/menu');
      } else {
        console.log("Đăng nhập không thành công:", response.data);
        alert("Tên đăng nhập hoặc mật khẩu không đúng.");
      }
    } catch (error: any) {
      console.log("API Error:", error);
      alert('Đã xảy ra lỗi. Vui lòng thử lại sau.');
    }
  };

  // Đọc dữ liệu từ localStorage khi trang được load
  useEffect(() => {
    const savedUsername = localStorage.getItem('username');
    const savedPassword = localStorage.getItem('password');
    if (savedUsername) {
      setUsername(savedUsername);
    }
    if (savedPassword) {
      setPassword(savedPassword);
    }
    if (savedUsername && savedPassword) {
      setRememberMe(true); // Nếu có thông tin đăng nhập đã lưu, bật "Ghi nhớ tài khoản"
    }
  }, []);

  return (
    <div className="login-page">
      <div className="logo-container">
        <img src={Logo} className="logo" alt="Logo"/>
        <div className="NameLogoLogin">QUẢN LÝ THƯ VIỆN</div>
      </div>

      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2 style={{ fontSize: "20px" }}>Đăng nhập tài khoản thư viện</h2>

          {error && <p className="error-message">{error}</p>} 

          <div className="input-group-login">
            <label htmlFor="username">Tài khoản</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group-login">
            <label htmlFor="password">Mật khẩu</label>
            <div className="input-with-icon-login">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="password-icon-login"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <div className="flex-container">
            <label>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              Ghi nhớ tài khoản
            </label>
            <a href="/forgot-password" className="link">Quên mật khẩu?</a>
          </div>

          <button type="submit">Đăng nhập</button>

          <div className="links-container-Login">
            <div>Bạn đã có tài khoản chưa?</div>
            <a href="/register" className="link">Đăng ký tài khoản</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
