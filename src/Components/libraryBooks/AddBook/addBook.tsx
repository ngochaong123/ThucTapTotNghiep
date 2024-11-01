import React, { useState } from 'react';
import './addBook.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DefaultAvatar from '../../../images/icon/avatar.jpg';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';


const categories = [
  'Công nghệ thông tin',
  'Nông lâm ngư nghiệp',
  'Y học - sức khỏe',
  'Triết học - lý luận',
  'Lịch sử - quân sự',
  'Phiêu mưu - mạo hiểm'
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

export default function AddBook() {
  const [formValues, setFormValues] = useState<FormValues>({
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

  const [avatarPreview, setAvatarPreview] = useState(DefaultAvatar);
  const isFormValid = formValues.book_name && formValues.book_code && formValues.author && formValues.category;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleDateChange = (date: Date | null) => {
    setFormValues({
      ...formValues,
      receiveDate: date,
    });
  };

  const handleReset = () => {
    // Hiển thị hộp thoại xác nhận trước khi thực hiện hành động
    confirmAlert({
      title: 'Xác nhận đặt lại',
      message: 'Bạn có chắc chắn muốn đặt lại tất cả các trường không?',
      buttons: [
        {
          label: 'Hủy',
          onClick: () => {
            console.log("Đặt lại đã bị hủy.");
          }
        },
        {
          label: 'Xác nhận',
          onClick: () => {
            // Đặt lại các giá trị form và ảnh xem trước
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
            setAvatarPreview(DefaultAvatar);
            console.log("Form đã được đặt lại.");
          }
        }
      ]
    });
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size < 1024 * 1024) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setAvatarPreview(reader.result as string);
        }
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

  const handleSubmit = async () => {
    // Hiển thị hộp thoại xác nhận trước khi thực hiện hành động
    confirmAlert({
      title: 'Xác nhận thêm sách',
      message: 'Bạn có chắc chắn muốn thêm sách này không?',
      buttons: [
        {
          label: 'Hủy',
          onClick: () => {
            console.log("Thêm sách đã bị hủy.");
          }
        },
        {
          label: 'Xác nhận',
          onClick: async () => {
            const formData = new FormData();
          
            // Kiểm tra tính hợp lệ của form
            if (!isFormValid) {
              toast.error('Vui lòng điền tất cả các trường bắt buộc!');
              return; // Không thực hiện tiếp nếu form không hợp lệ
            }
          
            formData.append('book_name', formValues.book_name);
            formData.append('book_code', formValues.book_code);
            formData.append('author', formValues.author);
            formData.append('category', formValues.category);
            formData.append('quantity', formValues.quantity);
            formData.append('location', formValues.location);
            formData.append('language', formValues.language);
            formData.append('received_date', formValues.receiveDate?.toISOString().split('T')[0] || '');
          
            const avatarInput = document.getElementById('avatarInput') as HTMLInputElement | null;
          
            try {
              // Chỉ thêm ảnh vào FormData nếu đã có ảnh được tải lên
              if (avatarInput && avatarInput.files && avatarInput.files.length > 0) {
                formData.append('image_link', avatarInput.files[0]);
              }
          
              const response = await axios.post('http://localhost:5000/addBook', formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              });
              
              console.log(response.data);
              toast.success('Lưu sách thành công!');
              handleReset(); // Đặt lại form nếu lưu thành công
            } catch (error) {
              console.error('Đã xảy ra lỗi khi lưu sách:', error);
              toast.error('Đã xảy ra lỗi, vui lòng thử lại!'); // Thông báo lỗi
            }
          }
        }
      ]
    });
  };
  
  return (
    <div className='FrameContanieraddBook'>
      <h1>Thêm Sách mới vào thư viện</h1>

      <ToastContainer />

      <div className='uploadAvatarAddBook'>
        <div className='containeruploadAvatarAddBook'>
          <img src={avatarPreview} alt="Avatar Preview" />
          <div>
            <h2>Tải lên ảnh bìa</h2>
            <div>Chấp nhận ảnh nhỏ hơn 1MB</div>
          </div>
        </div>
        <button className='ButtonuploadImageAddBook' onClick={triggerFileInput}>Đăng lên</button>
        <input
          id="avatarInput"
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleAvatarUpload}
        />
      </div>

      <div className='containeraddBook'>
        <div className='containeraddBookLeft'>
          <div className='inputInfoAddBook'>
            <div>Tên sách</div>
            <input name="book_name" value={formValues.book_name} onChange={handleChange} placeholder='Tên sách' />
          </div>
          <div className='inputInfoAddBook'>
            <div>Mã sách</div>
            <input name="book_code" value={formValues.book_code} onChange={handleChange} placeholder='Mã sách' />
          </div>
          <div className='inputInfoAddBook'>
            <div>Tác giả</div>
            <input name="author" value={formValues.author} onChange={handleChange} placeholder='Tên tác giả' />
          </div>
          <div className='inputInfoAddBooklanguage'>
            <div>Ngôn ngữ</div>
            <select name="language" value={formValues.language} onChange={handleChange}>
              <option value="">Chọn ngôn ngữ</option>
              <option value="Tiếng anh">Tiếng Anh</option>
              <option value="Tiếng việt">Tiếng Việt</option>
            </select>
          </div>
        </div>

        <div className='containeraddBookRight'>
          <div className='inputInfoAddBook'>
            <div>Thể loại</div>
            <select name="category" value={formValues.category} onChange={handleChange}>
              <option value="">Chọn thể loại</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className='inputInfoAddBook'>
            <div>Số lượng</div>
            <input name="quantity" value={formValues.quantity} onChange={handleChange} placeholder='Số lượng' />
          </div>
          <div className='inputInfoAddBook'>
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
          <div className='inputInfoAddBook'>
            <div>Thời gian nhận</div>
            <DatePicker
              selected={formValues.receiveDate}
              onChange={handleDateChange}
              dateFormat="dd/MM/yyyy"
              className='MemberDatePickerAddBook'
              placeholderText='Thời gian'
            />
          </div>
        </div>
      </div>

      <div className='ButtonAddBook'>
        <button
          className='SaveButtonBook'
          disabled={!isFormValid}
          onClick={handleSubmit}
        >
          Lưu
        </button>
        <button className='ResetButtonBook' onClick={handleReset}>
          Đặt lại
        </button>
      </div>
    </div>
  );
}
