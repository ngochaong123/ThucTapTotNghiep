import React, { useState } from 'react';
import './Register.css'; // Import your CSS file
import Logo from '../../images/logo.jpg';

const Register: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false); // New state for checkbox

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) {
      alert("Bạn cần chấp nhận các điều khoản và điều kiện!");
      return;
    }
    // Handle registration logic here
    console.log('Registering with', { username, email, password });
  };

  return (
    <div className="register-page">
      <div className="logo-container-register">
        <img src={Logo} className="logo-register-page" /> {/* Changed 'image' to 'img' */}
        <div className="NameLogoRegister">QUẢN LÝ THƯ VIỆN</div>
      </div>

      <div className="register-container">
        <form className="register-form" onSubmit={handleSubmit}>
          <h2 style={{ fontSize: "20px" }}>Đăng ký tài khoản thư viện</h2>

          <div className="input-group">
            <label htmlFor="username">Tên người dùng</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
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
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="confirm-password">Xác nhận mật khẩu</label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
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
              <a href="/Register" className="link"> Điều khoản và Điều kiện</a>
            </label>
          </div>

          <button type="submit">Đăng ký</button>

        </form>
        <div className="links-container-register">
            <div> Bạn đã có tài khoản thư viện? </div>
            <a href="/Login" className="link">Đăng nhập</a>
        </div>
      </div>
    </div>
  );
};

export default Register;
