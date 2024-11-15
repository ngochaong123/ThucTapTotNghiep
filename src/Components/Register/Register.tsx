import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './Register.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Logo from '../../images/logo.jpg';

const Register: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  // Kiểm tra tính hợp lệ của tên người dùng
  const isValidUsername = (username: string) => {
    const usernameRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])/;
    return usernameRegex.test(username);
  };

  // Kiểm tra tính hợp lệ của mật khẩu
  const isValidPassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  // Xử lý sự kiện khi người dùng nhấn nút đăng ký
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Kiểm tra các điều kiện đầu vào
    if (!isValidUsername(username)) {
      toast.error('Tên người dùng không hợp lệ.');
      return;
    }
    if (!isValidPassword(password)) {
      toast.error('Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp.');
      return;
    }
    if (!acceptedTerms) {
      toast.error('Bạn phải chấp nhận các điều khoản.');
      return;
    }

    try {
      // Gửi yêu cầu đăng ký đến server
      const response = await axios.post("http://localhost:5000/Register", {
        username: username,
        email: email,
        password: password,
      });

      // Kiểm tra kết quả trả về từ server
      if (response.status === 201) {
        toast.success(response.data.message);
        console.log("Response Status:", response.status);
        setTimeout(() => navigate('/login'), 3000); // Điều hướng đến trang đăng nhập sau khi đăng ký thành công
      } else {
        toast.error(response.data.message || "Đăng ký thất bại!");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("Lỗi kết nối server!"); // Hiển thị thông báo lỗi nếu không kết nối được với server
    }
  }; 

  return (
    <div className="register-page">
      <ToastContainer />
      <div className="logo-container-register">
        <img src={Logo} className="logo-register-page" alt="Logo" />
        <div className="NameLogoRegister">QUẢN LÝ THƯ VIỆN</div>
      </div>

      <div className="register-container">
        <form className="register-form" onSubmit={handleSubmit}>
          <h2 style={{ fontSize: "20px" }}>Đăng ký tài khoản thư viện</h2>

          {error && <p className="error-message">{error}</p>}

          <div className="input-group" style={{ width: "332px" }}>
            <label htmlFor="username">Tên người dùng</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group" style={{ width: "332px" }}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Mật khẩu</label>
            <div className="input-with-icon">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="password-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="confirm-password">Xác nhận mật khẩu</label>
            <div className="input-with-icon">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <span
                className="password-icon"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <div className="links-container-register">
            <label>
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                required
              />
              Tôi chấp nhận các
              <a href="/terms" className="link"> Điều khoản và Điều kiện</a>
            </label>
          </div>

          <button type="submit">Đăng ký</button>
        </form>

        <div className="links-container-register">
          <div> Bạn đã có tài khoản thư viện? </div>
          <a href="/login" className="link">Đăng nhập</a>
        </div>
      </div>
    </div>
  );
};

export default Register;
