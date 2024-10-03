import React, { useState } from 'react';
import './addBorrowBooks.css';
import DatePicker from 'react-datepicker'; // Importing the DatePicker component
import 'react-datepicker/dist/react-datepicker.css'; // Importing DatePicker styles

// icon
import DefaultAvatar from "../../../images/icon/avatar.jpg";

export default function AddBorrowBooks() {
  const [formValues, setFormValues] = useState({
    name: '',
    phone: '',
    email: '',
    memberCode: '',
    avatar: '',
    country: '',
    age: '',
    borrowDate: '', // Ngày mượn sách
    returnDate: '', // Ngày trả sách
    bookTitle: '', // Tên sách
  });

  const [avatarPreview, setAvatarPreview] = useState<string>(DefaultAvatar);
  const [selectedBorrowDate, setSelectedBorrowDate] = useState<Date | null>(null);
  const [selectedReturnDate, setSelectedReturnDate] = useState<Date | null>(null);

  const isFormValid = formValues.name && formValues.phone && formValues.email && formValues.memberCode && formValues.bookTitle && selectedBorrowDate && selectedReturnDate && (selectedReturnDate > selectedBorrowDate);

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
      age: '',
      borrowDate: '', // Reset ngày mượn sách
      returnDate: '', // Reset ngày trả sách
      bookTitle: '', // Reset tên sách
    });
    setAvatarPreview(DefaultAvatar);
    setSelectedBorrowDate(null);
    setSelectedReturnDate(null);
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
    <div className='FrameContanieraddBorrowBooks'>
      <h1> Thành viên mượn sách </h1>

      {/* Upload avatar */}
      <div className='uploadAvataraddBorrowBooks'>
        <div className='containeruploadAvataraddBorrowBooks'>
          <img src={avatarPreview} alt="Avatar Preview" />
          <div>
            <h2> Ảnh đại diện </h2>
            <div> Chấp nhận ảnh nhỏ hơn 1Mb </div>
          </div>
        </div>
      </div>

      {/* Info member */}
      <div className='containeraddMemeber'>
        <div className='containeraddMemeberRight'> 
          {/* Tên thành viên */}
          <div className='inputInfoaddBorrowBooks'>
            <div>Tên thành viên </div>
            <input name="name" value={formValues.name} onChange={handleChange} placeholder='Tên thành viên' />
          </div>
          {/* Mã thành viên */}
          <div className='inputInfoaddBorrowBooks'>
            <div>Mã thành viên </div>
            <input name="memberCode" value={formValues.memberCode} onChange={handleChange} style={{ marginBottom: 0 }} placeholder='Mã thành viên' />
          </div>
          {/* Tên sách */}
          <div className='inputInfoaddBorrowBooks'>
            <div>Tên sách </div>
            <input name="bookTitle" value={formValues.bookTitle} onChange={handleChange} placeholder='Tên sách' />
          </div>
          {/* Độ tuổi */}
          <div className='inputInfoaddBorrowBooks'>
            <div>Tuổi </div>
            <input name="age" value={formValues.age} onChange={handleChange} placeholder='Tuổi' />
          </div>
        </div>
        
        <div className='containeraddMemeberleft'>
          {/* Số điện thoại */}
          <div className='inputInfoaddBorrowBooks'>
            <div>Số điện thoại </div>
            <input name="phone" value={formValues.phone} onChange={handleChange} placeholder='Số điện thoại' />
          </div>
          {/* Email */}
          <div className='inputInfoaddBorrowBooks'>
            <div>Email </div>
            <input name="email" value={formValues.email} onChange={handleChange} placeholder='Email' />
          </div>
          {/* Loại sách */}
          <div className='inputInfoaddBorrowBooks'>
            <div>Loại sách </div>
            <input name="bookType" onChange={handleChange} placeholder='Loại sách' />
          </div>
          {/* Ngày mượn sách */}
          <div className='inputInfoaddBorrowBooks'>
            <div>Ngày mượn sách </div>
            <DatePicker
              selected={selectedBorrowDate}
              onChange={(date: Date | null) => setSelectedBorrowDate(date)}
              dateFormat="dd/MM/yyyy"
              className='MemberDatePickerAddBorrowBooks'
              placeholderText='Ngày/Tháng/Năm'
            />
          </div>
        </div>
      </div>

      {/* Ngày trả sách */}
      <div className='bookReturnDate'>
        <div>Ngày trả sách </div>
        <DatePicker
          selected={selectedReturnDate}
          onChange={(date: Date | null) => setSelectedReturnDate(date)}
          dateFormat="dd/MM/yyyy"
          className='MemberDatePickerAddBorrowBooks'
          placeholderText='Ngày/Tháng/Năm'
        />
      </div>

      {/* Buttons */}
      <div className='ButtonAddaddBorrowBooks'>
        <button 
          className='SaveButtonaddBorrowBooks' 
          disabled={!isFormValid} // Disable if form is invalid
        > 
          Lưu 
        </button>
        <button className='ResetButtonaddBorrowBooks' onClick={handleReset}> Đặt lại </button>
      </div>
    </div>
  );
}
