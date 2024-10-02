import React, { useState, useEffect } from 'react';
import './ChangeBook.css';
import DatePicker from 'react-datepicker'; // Import DatePicker
import 'react-datepicker/dist/react-datepicker.css'; // Import styles for DatePicker

// icon
import DefaultAvatar from "../../../images/icon/avatar.jpg";

export default function ChangeBook() {
  const [formValues, setFormValues] = useState({
    name: '',
    phone: '',
    email: '',
    memberCode: '',
    avatar: '',
    country: '',
    age: '', 
    publishDate: null, 
    receiveDate: null,
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

  const handleDateChange = (date: Date | null, fieldName: string) => {
    setFormValues({
      ...formValues,
      [fieldName]: date,
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
      age: '',
      publishDate: null,
      receiveDate: null,
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
    <div className='FrameContanieraddChangeBook'>
      <h1> Thay đổi thông tin sách </h1>

      {/* Upload avatar */}
      <div className='uploadAvatarChangeBook'>
        <div className='containeruploadAvatarChangeBook'>
          <img src={avatarPreview} alt="Avatar Preview" />
          <div>
            <h2> Tên sách </h2>
            <div> Chấp nhận ảnh nhỏ hơn 1Mb </div>
          </div>
        </div>
        <button className='ButtonuploadImageChangeBook' onClick={triggerFileInput}>Đăng lên</button>
        <input 
          id="avatarInput" 
          type="file" 
          accept="image/*" 
          style={{ display: 'none' }} 
          onChange={handleAvatarUpload} 
        />
      </div>

      {/* Info member */}
      <div className='containerChangeBook'>
        <div className='containerChangeBookRight'> 
          {/* Tên thành viên */}
          <div className='inputInfoChangeBook'>
            <div>Tên Sách </div>
            <input name="name" value={formValues.name} onChange={handleChange} />
          </div>
          {/* Địa chỉ */}
          <div className='inputInfoChangeBook'>
            <div>Mã sách </div>
            <input name="memberCode" value={formValues.memberCode} onChange={handleChange} style={{ marginBottom: 0 }}/>
          </div>
          {/* Tác giả */}
          <div className='inputInfoChangeBook'>
            <div>Tác giả </div>
            <input name="age" value={formValues.age} onChange={handleChange} />
          </div>
          {/* Năm xuất bản */}
          <div className='inputInfoChangeBook'>
            <div>Năm xuất bản </div>
            <DatePicker
              selected={formValues.publishDate}
              onChange={(date) => handleDateChange(date, 'publishDate')}
              dateFormat="dd/MM/yyyy"
            />
          </div>
        </div>
        
        <div className='containerChangeBookleft'>
          {/* Thể loại sách */}
          <div className='inputInfoChangeBook'>
            <div>Thể loại sách </div>
            <input name="phone" value={formValues.phone} onChange={handleChange} />
          </div>
          {/* Số lượng */}
          <div className='inputInfoChangeBook'>
            <div>Số lượng </div>
            <input name="email" value={formValues.email} onChange={handleChange} />
          </div>
          {/* Vị trí sách */}
          <div className='inputInfoChangeBook'>
            <div>Vị trí sách </div>
            <input name="email" value={formValues.email} onChange={handleChange} />
          </div>
          {/* Thời gian nhận sách */}
          <div className='inputInfoChangeBook'>
            <div>Thời gian nhận sách </div>
            <DatePicker
              selected={formValues.receiveDate}
              onChange={(date) => handleDateChange(date, 'receiveDate')}
              dateFormat="dd/MM/yyyy"
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className='ButtonAddChangeBook'>
        <button 
          className='SaveButtonChangeBook' 
          disabled={!isFormValid} // Disable if form is invalid
        > 
          Lưu 
        </button>
        <button className='ResetButtonChangeBook' onClick={handleReset}> Đặt lại </button>
      </div>
    </div>
  );
}
