import React, { useState } from 'react';
import './ChangeBook.css';
import DatePicker from 'react-datepicker'; // Import DatePicker
import 'react-datepicker/dist/react-datepicker.css'; // Import DatePicker styles

// icon
import DefaultAvatar from "../../../images/icon/avatar.jpg";

export default function AddBook() {
  const [formValues, setFormValues] = useState({
    name: '',
    phone: '',
    email: '',
    memberCode: '',
    avatar: '',
    country: '',
    age: '', 
    publishDate: null,  // Set as null for DatePicker
    receiveDate: null,  // Set as null for DatePicker
  });

  const [avatarPreview, setAvatarPreview] = useState<string>(DefaultAvatar);

  const isFormValid = formValues.name && formValues.phone && formValues.email && formValues.memberCode;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleDateChange = (date: Date | null, name: string) => {
    setFormValues({
      ...formValues,
      [name]: date,
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
    <div className='FrameContanierChangeBook'>
      <h1> Chỉnh sửa thông tin sách thư viện </h1>

      {/* Upload avatar */}
      <div className='uploadAvatarBook'>
        <div className='containeruploadAvatarBook'>
          <img src={avatarPreview} alt="Avatar Preview" />
          <div>
            <h2> Tên sách </h2>
            <div> Chấp nhận ảnh nhỏ hơn 1Mb </div>
          </div>
        </div>
        <button className='ButtonuploadImageBook' onClick={triggerFileInput}>Đăng lên</button>
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
          <div className='inputInfoBook'>
            <div>Tên Sách </div>
            <input name="name" value={formValues.name} onChange={handleChange} placeholder='Tên sách' />
          </div>
          {/* Địa chỉ */}
          <div className='inputInfoBook'>
            <div>Mã sách </div>
            <input name="memberCode" value={formValues.memberCode} onChange={handleChange} style={{ marginBottom: 0 }} placeholder='Mã sách' />
          </div>
          {/* Tác giả */}
          <div className='inputInfoBook'>
            <div>Tác giả </div>
            <input name="age" value={formValues.age} onChange={handleChange} placeholder='Tác giả' />
          </div>
          {/* Năm xuất bản */}
          <div className='inputInfoBook'>
            <div>Năm xuất bản </div>
            <DatePicker
              selected={formValues.publishDate}
              onChange={(date) => handleDateChange(date, 'publishDate')}
              dateFormat="dd/MM/yyyy"
              className='MemberDatePickerAddBook'
              placeholderText='Ngày/Tháng/Năm'
            />
          </div>
        </div>
        
        <div className='containerChangeBookleft'>
          {/* Thể loại sách */}
          <div className='inputInfoBook'>
            <div>Thể loại sách </div>
            <input name="phone" value={formValues.phone} onChange={handleChange}  placeholder='Thể loại sách' />
          </div>
          {/* Số lượng */}
          <div className='inputInfoBook'>
            <div>Số lượng </div>
            <input name="email" value={formValues.email} onChange={handleChange} placeholder='Số lượng' />
          </div>
          {/* Vị trí sách */}
          <div className='inputInfoBook'>
            <div>Vị trí sách </div>
            <input name="email" value={formValues.email} onChange={handleChange} placeholder='Vị trí sách' />
          </div>
          {/* Thời gian nhận sách */}
          <div className='inputInfoBook'>
            <div>Thời gian nhận sách </div>
            <DatePicker
              selected={formValues.receiveDate}
              onChange={(date) => handleDateChange(date, 'receiveDate')}
              dateFormat="dd/MM/yyyy"
              className='MemberDatePickerAddBook'
              placeholderText='Ngày/Tháng/Năm'
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className='ButtonAddBook'>
        <button 
          className='SaveButtonBook' 
          disabled={!isFormValid} // Disable if form is invalid
        > 
          Lưu 
        </button>
        <button className='ResetButtonBook' onClick={handleReset}> Đặt lại </button>
      </div>
    </div>
  );
}
