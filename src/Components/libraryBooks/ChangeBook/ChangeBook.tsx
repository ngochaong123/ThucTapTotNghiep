import React, { useState, useEffect } from 'react';
import './ChangeBook.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DefaultAvatar from '../../../images/icon/avatar.jpg';

const categories = [
  'Công nghệ thông tin',
  'Nông Lâm Ngư nghiệp',
  'Y Học - Sức Khỏe',
  'Triết Học - Lý Luận',
  'Lịch Sử - Quân Sự',
  'Phiêu Lưu - Mạo Hiểm'
];

const languages = [
  'Tiếng anh',
  'Tiếng việt'
];

interface FormValues {
  book_name: string;
  book_code: string;
  author: string;
  category: string;
  quantity: string;
  location: string;
  avatar: string;
  language: string;
  receiveDate: Date | null;
}

export default function ChangeBook() {
  const location = useLocation();
  const { state } = location;

  const [formValues, setFormValues] = useState<FormValues>({
    book_name: state?.book_name || '',
    book_code: state?.book_code || '',
    author: state?.author || '',
    category: state?.category || '',
    quantity: state?.quantity || '',
    location: state?.location || '',
    avatar: state?.image_link || '',
    language: state?.language || '',
    receiveDate: state?.received_date ? new Date(state.received_date) : null,
  });

  useEffect(() => {
    console.log("image: ", formValues.avatar);
  }, [formValues.avatar]);
  
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value, type } = e.target;
  
    if (type === 'file') {
      const fileInput = e.target as HTMLInputElement;
  
      if (fileInput.files && fileInput.files.length > 0) { // Kiểm tra nếu files không null và có ít nhất một file
        const file = fileInput.files[0];
        const reader = new FileReader();
  
        reader.onloadend = () => {
          setFormValues((prevValues) => ({
            ...prevValues,
            avatar: reader.result as string,
          }));
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
    }
  };  

  const triggerFileInput = () => {
    document.getElementById("avatarInput")?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('book_name', formValues.book_name);
    formData.append('book_code', formValues.book_code);
    formData.append('author', formValues.author);
    formData.append('category', formValues.category);
    formData.append('quantity', formValues.quantity);
    formData.append('location', formValues.location);
    formData.append('language', formValues.language);
    formData.append('received_date', formValues.receiveDate?.toISOString() || '');

    const avatarInput = document.getElementById("avatarInput") as HTMLInputElement;
    if (avatarInput.files && avatarInput.files[0]) {
      formData.append('avatar', avatarInput.files[0]);
    }

    try {
      const response = await axios.put(`http://localhost:5000/edit/${formValues.book_code}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success(response.data.message);
    } catch (error) {
      console.error("Error updating book:", error);
      toast.error("Có lỗi xảy ra khi cập nhật thông tin sách.");
    }
  };

  const handleReset = () => {
    setFormValues({
      book_name: '',
      book_code: '',
      author: '',
      category: '',
      quantity: '',
      location: '',
      avatar: '',
      language: '',
      receiveDate: null,
    });
  };

  return (
    <div className='FrameContanieraddBook'>
      <h1>Chỉnh sửa thông tin sách thư viện</h1>

      <ToastContainer />

      <form onSubmit={handleSubmit}>
        <div className='uploadAvatarChangeBook'>
          <div className='containeruploadAvatarChangeBook'>
            <img 
              src={`http://localhost:5000${formValues.avatar}`} 
              alt="Avatar Preview" 
              onError={(e) => {
                e.currentTarget.src = DefaultAvatar;
              }}
            />
            <div>
              <h2>Hình ảnh sách</h2>
              <div>Chấp nhận ảnh nhỏ hơn 1MB</div>
            </div>
          </div>
          <button className='ButtonuploadImageChangeBook' onClick={triggerFileInput} type="button">Đăng lên</button>
          <input
            id="avatarInput"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleChange} 
          />
        </div>

        <div className='containeraddBook'>
          <div className='containeraddBookLeft'>
            <div className='inputInfoChangeBook'>
              <div>Tên sách</div>
              <input name="book_name" value={formValues.book_name} placeholder='Tên sách' onChange={handleChange} />
            </div>
            <div className='inputInfoChangeBook'>
              <div>Mã sách</div>
              <input name="book_code" value={formValues.book_code} placeholder='Mã sách' onChange={handleChange} />
            </div>
            <div className='inputInfoChangeBook'>
              <div>Tác giả</div>
              <input name="author" value={formValues.author} placeholder='Tên tác giả' onChange={handleChange} />
            </div>
            <div className='inputInfoChangeBook'>
              <div>Ngôn ngữ</div>
              <select name="language" value={formValues.language} onChange={handleChange}>
                <option value="">Chọn ngôn ngữ</option>
                {languages.map((lang, index) => (
                  <option key={index} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
          </div>

          <div className='containeraddBookRight'>
            <div className='inputInfoChangeBook'>
              <div>Thể loại</div>
              <select name="category" value={formValues.category} onChange={handleChange}>
                <option value="">Chọn thể loại</option>
                {categories.map((cat, index) => (
                  <option key={index} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className='inputInfoChangeBook'>
              <div>Số lượng</div>
              <input name="quantity" value={formValues.quantity} placeholder='Số lượng' onChange={handleChange} />
            </div>
            <div className='inputInfoChangeBook'>
              <div>Vị trí sách</div>
              <select name="location" value={formValues.location} onChange={handleChange}>
                <option value="">Chọn vị trí</option>
                <option value="Khu A">Khu A</option>
                <option value="Khu B">Khu B</option>
                <option value="Khu C">Khu C</option>
                <option value="Khu D">Khu D</option>
                <option value="Khu E">Khu E</option>
                <option value="Khu F">Khu F</option>
              </select>
            </div>
            <div className='inputInfoChangeBook'>
              <div>Thời gian nhận</div>
              <DatePicker
                selected={formValues.receiveDate}
                onChange={(date) => setFormValues({ ...formValues, receiveDate: date })}
                dateFormat="dd/MM/yyyy"
                className='MemberDatePickerChangeBook'
                placeholderText='Thời gian'
              />
            </div>
          </div>
        </div>

        <div className='ButtonChangeBook'>
          <button type='submit' className='SaveButtonBook'>
            Lưu
          </button>
          <button type='button' className='ResetButtonBook' onClick={handleReset}>
            Xóa sách
          </button>
        </div>
      </form>
    </div>
  );
}
