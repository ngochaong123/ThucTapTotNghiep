import React, { useState, useEffect } from 'react';
import './User.css';

// icon
import DefaultAvatar from "../../images/icon/avatar.jpg";

export default function AddUser() {
  const [formValues, setFormValues] = useState({
    name: '',
    phone: '',
    email: '',
    memberCode: '',
    account: '', // Added account field (Tài khoản)
    avatar: '',
    country: '',
    age: '',
    password: '', // Added password field
  });
  
  const [countries, setCountries] = useState<string[]>([]); // State for storing the countries
  const [avatarPreview, setAvatarPreview] = useState<string>(DefaultAvatar);

  const isFormValid = formValues.name && formValues.phone && formValues.email && formValues.memberCode && formValues.account && formValues.password;

  useEffect(() => {
    // Fetch countries from the API when the component mounts
    fetch('https://restcountries.com/v3.1/all')
      .then((response) => response.json())
      .then((data) => {
        const countryNames = data.map((country: any) => country.name.common);
        setCountries(countryNames); // Set the country names in state
      })
      .catch((error) => console.error('Error fetching countries:', error));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleReset = () => {
    setFormValues({
      name: '',
      phone: '',
      email: '',
      memberCode: '',
      account: '', // Reset account field
      avatar: '',
      country: '',
      age: '',
      password: '', // Reset password field
    });
    setAvatarPreview(DefaultAvatar);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size < 1024 * 1024) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setFormValues({
        ...formValues,
        avatar: file.name,
      });
    } else {
      alert("Vui lòng chọn một ảnh nhỏ hơn 1MB!");
    }
  };

  const triggerFileInput = () => {
    document.getElementById("avatarInput")?.click();
  };

  return (
    <div className='FrameContanieraddUser'>
      <h1> Thông tin người dùng </h1>

      {/* Upload avatar */}
      <div className='uploadAvatarUser'>
        <div className='containeruploadAvatarUser'>
          <img src={avatarPreview} alt="Avatar Preview" />
          <div>
            <h2> Ảnh đại diện </h2>
            <div> Chấp nhận ảnh nhỏ hơn 1Mb </div>
          </div>
        </div>
        <button className='ButtonuploadImage' onClick={triggerFileInput}>Đăng lên</button>
        <input 
          id="avatarInput" 
          type="file" 
          accept="image/*" 
          style={{ display: 'none' }} 
          onChange={handleAvatarUpload} 
        />
      </div>

      {/* Info member */}
      <div className='containerUser'>
        <div className='containerUserRight'> 
          {/* Tên thành viên */}
          <div className='inputInfoUser'>
            <div>Tên thành viên</div>
            <input name="name" value={formValues.name} onChange={handleChange} placeholder='Tên thành viên' />
          </div>
          {/* Mã thành viên */}
          <div className='inputInfoUser'>
            <div>Mã thành viên</div>
            <input name="memberCode" value={formValues.memberCode} onChange={handleChange} placeholder='Mã thành viên' />
          </div>
           {/* Tài khoản */}
           <div className='inputInfoUser'>
            <div>Tài khoản</div>
            <input name="account" value={formValues.account} onChange={handleChange} placeholder='Tài khoản' />
          </div>
          {/* Độ tuổi */}
          <div className='inputInfoUser'>
            <div>Độ tuổi</div>
            <input name="age" value={formValues.age} onChange={handleChange} placeholder='Độ tuổi' />
          </div>
        </div>
        
        <div className='containerUserleft'>
          {/* Số điện thoại */}
          <div className='inputInfoUser'>
            <div>Số điện thoại</div>
            <input name="phone" value={formValues.phone} onChange={handleChange} placeholder='Số điện thoại' />
          </div>
          {/* Email */}
          <div className='inputInfoUser'>
            <div>Email</div>
            <input name="email" value={formValues.email} onChange={handleChange} placeholder='Email' />
          </div>
          {/* Mật khẩu */}
          <div className='inputInfoUser'>
            <div>Mật khẩu</div>
            <input type="password" name="password" value={formValues.password} onChange={handleChange} placeholder='Mật khẩu' />
          </div>
          {/* Quốc gia */}
          <div className='inputInfoUser'>
            <div>Quốc gia</div>
            <select name="country" value={formValues.country} onChange={handleChange}>
              <option value="">Chọn quốc gia</option>
              {countries.map((country, index) => (
                <option key={index} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className='ButtonAddUser'>
        <button 
          className='SaveButtonUser' 
          disabled={!isFormValid} // Disable if form is invalid
        > 
          Lưu 
        </button>
        <button className='ResetButtonUser' onClick={handleReset}> Đặt lại </button>
      </div>
    </div>
  );
}
