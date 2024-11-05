import React, { useState } from 'react';
import './changeBorrowBooks.css';
import DatePicker from 'react-datepicker'; // Importing the DatePicker component
import 'react-datepicker/dist/react-datepicker.css'; // Importing DatePicker styles

// icon
import DefaultAvatar from "../../../images/icon/avatar.jpg";

export default function AddBorrowBooks() {
  const categories = [
    'Công nghệ thông tin',
    'Nông lâm ngư nghiệp',
    'Y học - sức khỏe',
    'Triết học - lý luận',
    'Lịch sử - quân sự',
    'Phiêu mưu - mạo hiểm'
  ];

  const [formValues, setFormValues] = useState({
    name: '',
    book_code: '',
    quantity: '',
    memberCode: '',
    avatar: '',
    country: '',
    borrowDate: '', 
    returnDate: '',
    book_name: '',
    bookType: ''
  });

  const [avatarPreview, setAvatarPreview] = useState<string>(DefaultAvatar);
  const [selectedBorrowDate, setSelectedBorrowDate] = useState<Date | null>(null);
  const [selectedReturnDate, setSelectedReturnDate] = useState<Date | null>(null);

  const isFormValid = formValues.name && formValues.book_code && formValues.quantity && formValues.memberCode && formValues.book_name && selectedBorrowDate && selectedReturnDate && (selectedReturnDate > selectedBorrowDate);

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
      book_code: '',
      quantity: '',
      memberCode: '',
      avatar: '',
      country: '',
      borrowDate: '', 
      returnDate: '',
      book_name: '',
      bookType: ''
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
    <div className='FrameContanierchangeBorrowBooks'>
      <h1> Chỉnh sửa thông tin mượn sách </h1>

      {/* Upload avatar */}
      <div className='uploadAvatarchangeBorrowBooks'>
        <div className='containeruploadAvatarchangeBorrowBooks'>
          <img src={avatarPreview} alt="Avatar Preview" />
          <div>
            <h2> Ảnh cuốn sách </h2>
            <div> Chấp nhận ảnh nhỏ hơn 1Mb </div>
          </div>
        </div>
      </div>

      {/* Info member */}
      <div className='containeraddMemeber'>
        <div className='containeraddMemeberRight'> 
          {/* Mã thành viên */}
          <div className='inputInfochangeBorrowBooks'>
            <div>Mã thành viên </div>
            <input name="memberCode" value={formValues.memberCode} onChange={handleChange} style={{ marginBottom: 0 }} placeholder='Mã thành viên' />
          </div>
          {/* Mã sách */}
          <div className='inputInfochangeBorrowBooks'>
            <div>Mã sách </div>
            <input name="book_code" value={formValues.book_code} onChange={handleChange} placeholder='Mã sách' />
          </div>
          {/* Email */}
          <div className='inputInfochangeBorrowBooks'>
            <div>Số lượng </div>
            <input name="quantity" value={formValues.quantity} onChange={handleChange} placeholder='Số lượng' />
          </div>
          {/* Ngày trả sách */}
          <div className='inputInfochangeBorrowBooks'>
            <div>Ngày trả sách </div>
            <DatePicker
              selected={selectedReturnDate}
              onChange={(date: Date | null) => setSelectedReturnDate(date)}
              dateFormat="dd/MM/yyyy"
              className='MemberDatePickerAddBorrowBooks'
              placeholderText='Ngày trả sách'
            />
          </div>
        </div>
        
        <div className='containeraddMemeberleft'>
          {/* Tên thành viên */}
          <div className='inputInfochangeBorrowBooks'>
            <div>Tên thành viên</div>
            <span className="infoDisplay">{formValues.name || 'Tên thành viên'}</span>
          </div>
          {/* Tên sách */}
          <div className='inputInfochangeBorrowBooks'>
            <div>Tên sách</div>
            <span className="infoDisplay" style={{marginTop:'-4px', marginBottom:'-3px'}}>{formValues.book_name || 'Tên sách'}</span>
          </div>
          {/* Loại sách */}
          <div className='inputInfochangeBorrowBooks'>
            <div>Loại sách</div>
            <select name="bookType" value={formValues.bookType} onChange={handleChange} className="LibraryCategorySelect">
              <option value="">Chọn thể loại</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          {/* Ngày mượn sách */}
          <div className='inputInfochangeBorrowBooks'>
            <div>Ngày mượn sách </div>
            <DatePicker
              selected={selectedBorrowDate}
              onChange={(date: Date | null) => setSelectedBorrowDate(date)}
              dateFormat="dd/MM/yyyy"
              className='MemberDatePickerAddBorrowBooks'
              placeholderText='Ngày mượn sách'
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className='ButtonAddchangeBorrowBooks'>
        <button 
          className='SaveButtonchangeBorrowBooks' 
          disabled={!isFormValid} // Disable if form is invalid
        > 
          Lưu 
        </button>
        <button className='ResetButtonchangeBorrowBooks' onClick={handleReset}> Xóa </button>
      </div>
    </div>
  );
}
