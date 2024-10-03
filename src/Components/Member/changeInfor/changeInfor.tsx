import React, { useState, useEffect } from 'react';
import './changeInfor.css';

// icon
import DefaultAvatar from "../../../images/icon/avatar.jpg";

export default function AddMember() {
  const [formValues, setFormValues] = useState({
    name: '',
    phone: '',
    email: '',
    memberCode: '',
    avatar: '',
    country: '',
    age: '', // Changed from "language" to "age"
  });
  
  const [countries, setCountries] = useState<string[]>([]); // State for storing the countries
  const [avatarPreview, setAvatarPreview] = useState<string>(DefaultAvatar);

  const isFormValid = formValues.name && formValues.phone && formValues.email && formValues.memberCode;

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
      avatar: '',
      country: '',
      age: '', // Reset the age field as well
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
    <div className='FrameContanierChangeMember'>
      <h1> Chỉnh sửa thông tin thành viên </h1>

      {/* Upload avatar */}
      <div className='uploadAvatarMember'>
        <div className='containeruploadAvatarMember'>
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
      <div className='containeraddMemeber'>
        <div className='containeraddMemeberRight'> 
          {/* Tên thành viên */}
          <div className='inputInfoMember'>
            <div>Tên thành viên </div>
            <input name="name" value={formValues.name} onChange={handleChange} placeholder='Tên thành viên' />
          </div>
          {/* Địa chỉ */}
          <div className='inputInfoMember'>
            <div>Mã thành viên </div>
            <input name="memberCode" value={formValues.memberCode} onChange={handleChange} style={{ marginBottom: 0 }} placeholder='Mã thành viên' />
          </div>
          {/* Độ tuổi */}
          <div className='inputInfoMember'>
            <div>Độ tuổi </div>
            <input name="age" value={formValues.age} onChange={handleChange} placeholder='Độ tuổi' />
          </div>
        </div>
        
        <div className='containeraddMemeberleft'>
          {/* Số điện thoại */}
          <div className='inputInfoMember'>
            <div>Số điện thoại </div>
            <input name="phone" value={formValues.phone} onChange={handleChange} placeholder='Số điện thoại' />
          </div>
          {/* Email */}
          <div className='inputInfoMember'>
            <div>Email </div>
            <input name="email" value={formValues.email} onChange={handleChange} placeholder='Email' />
          </div>
          {/* Quốc gia */}
          <div className='inputInfoMember'>
            <div>Quốc gia </div>
            <select name="country" value={formValues.country} onChange={handleChange} >
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
      <div className='ButtonAddMember'>
        <button 
          className='SaveButtonMember' 
          disabled={!isFormValid} // Disable if form is invalid
        > 
          Lưu 
        </button>
        <button className='ResetButtonMember' onClick={handleReset}> Đặt lại </button>
      </div>
    </div>
  );
}
