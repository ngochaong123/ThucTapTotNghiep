import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate để điều hướng
import axios from 'axios'; // Import axios để gửi yêu cầu API
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import icon từ react-icons
import './Register.css'; // Import CSS file
import Logo from '../../images/logo.jpg';

const Register: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false); // State cho checkbox điều khoản
  const [error, setError] = useState<string>(''); // State để xử lý lỗi
  const [showPassword, setShowPassword] = useState<boolean>(false); // State để quản lý hiển thị mật khẩu
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false); // State quản lý hiển thị xác nhận mật khẩu
  const navigate = useNavigate(); // Khai báo useNavigate để điều hướng

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Kiểm tra tính hợp lệ của tên người dùng
    if (!isValidUsername(username)) {
      alert("Tên người dùng phải bao gồm cả chữ và số.");
      return;
    }

    // Kiểm tra tính hợp lệ của mật khẩu
    if (!isValidPassword(password)) {
      alert("Mật khẩu phải bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.");
      return;
    }

    // Kiểm tra nếu mật khẩu và xác nhận mật khẩu không trùng khớp
    if (password !== confirmPassword) {
      alert("Mật khẩu và xác nhận mật khẩu không trùng khớp!");
      return;
    }

    // Kiểm tra nếu người dùng chưa chấp nhận các điều khoản
    if (!acceptedTerms) {
      alert("Bạn cần chấp nhận các điều khoản và điều kiện!");
      return;
    }

    try {
      // Gửi yêu cầu đăng ký tới backend
      const response = await axios.post('http://localhost:5000/register', {
        username,
        email,
        password,
      });

      if (response.data.success) {
        alert("Đăng ký thành công!");
        // Điều hướng tới trang đăng nhập sau khi đăng ký thành công
        navigate('/login');
      } else {
        setError("Đăng ký thất bại! Vui lòng thử lại.");
      }
    } catch (err) {
      setError("Đã xảy ra lỗi khi đăng ký.");
      console.error(err);
    }
  };

  return (
    <div className="register-page">
      <div className="logo-container-register">
        <img src={Logo} className="logo-register-page" alt="Logo" />
        <div className="NameLogoRegister">QUẢN LÝ THƯ VIỆN</div>
      </div>

      <div className="register-container">
        <form className="register-form" onSubmit={handleSubmit}>
          <h2 style={{ fontSize: "20px" }}>Đăng ký tài khoản thư viện</h2>

          {error && <p className="error-message">{error}</p>} {/* Hiển thị lỗi nếu có */}

          <div className="input-group" style={{width:"332px"}}>
            <label htmlFor="username">Tên người dùng</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group" style={{width:"332px"}}>
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
