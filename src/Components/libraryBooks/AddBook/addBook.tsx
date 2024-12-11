import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './addBook.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DefaultAvatar from '../../../images/icon/avatar.jpg';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

interface FormValues {
  book_name: string;
  book_code: string;
  author: string;
  category: string;
  quantity: number;
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
    quantity: 0,
    location: '',
    avatar: '',
    language: '',
    receiveDate: null,
  });

  const [avatarPreview, setAvatarPreview] = useState(DefaultAvatar);
  const [categories, setCategories] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const navigate = useNavigate();
  
  const isFormValid = formValues.book_name && formValues.book_code && formValues.author && formValues.category;

  useEffect(() => {
    // Gọi API để lấy thể loại sách
    axios.get('http://localhost:5000/categories')
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error('Lỗi khi lấy thể loại:', error);
        toast.error('Lỗi khi tải thể loại sách.');
      });

    // Gọi API để lấy ngôn ngữ
    axios.get('http://localhost:5000/language')
      .then(response => {
        setLanguages(response.data);
      })
      .catch(error => {
        console.error('Lỗi khi lấy ngôn ngữ:', error);
        toast.error('Lỗi khi tải ngôn ngữ.');
      });

    // Gọi API để lấy vị trí sách
    axios.get('http://localhost:5000/location')
      .then(response => {
        setLocations(response.data);
      })
      .catch(error => {
        console.error('Lỗi khi lấy vị trí:', error);
        toast.error('Lỗi khi tải vị trí sách.');
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleDateChange = (date: Date | null) => {
    const currentDate = new Date();
    // Xóa phần giờ, phút, giây của currentDate để so sánh chỉ phần ngày
    currentDate.setHours(0, 0, 0, 0);
  
    if (date) {
      // Xóa phần giờ, phút, giây của date để so sánh chỉ phần ngày
      const selectedDate = new Date(date);
      selectedDate.setHours(0, 0, 0, 0);
  
      if (selectedDate >= currentDate) {
        setFormValues({
          ...formValues,
          receiveDate: date,
        });
      } else {
        toast.error("Ngày nhận sách phải lớn hơn hoặc bằng ngày hiện tại!");
      }
    }
  };  

  const handleReset = () => {
    confirmAlert({
      title: 'Xác nhận đặt lại',
      message: 'Bạn có chắc chắn muốn đặt lại thông tin thêm sách? ',
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
            setFormValues({
              book_name: '',
              book_code: '',
              author: '',
              category: '',
              quantity: 0,
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
  
            if (!isFormValid) {
              toast.error('Vui lòng điền tất cả các trường bắt buộc!');
              return;
            }

            const quantityRegex = /^[1-9][0-9]*$/;
            if (!quantityRegex.test(formValues.quantity.toString())) {
              toast.error('Số lượng sách không hợp lệ. Vui lòng nhập số nguyên dương.');
              return;
            }
  
            const avatarInput = document.getElementById('avatarInput') as HTMLInputElement | null;
            if (!avatarInput || !avatarInput.files || avatarInput.files.length === 0) {
              toast.error('Vui lòng thêm ảnh sách!');
              return;
            }
  
            formData.append('book_name', formValues.book_name);
            formData.append('book_code', formValues.book_code);
            formData.append('author', formValues.author);
            formData.append('category', formValues.category);
            formData.append('quantity', formValues.quantity.toString());
            formData.append('location', formValues.location);
            formData.append('language', formValues.language);
            formData.append('received_date', formValues.receiveDate?.toISOString().split('T')[0] || '');
            formData.append('image_link', avatarInput.files[0]);
  
            try {
              const response = await axios.post('http://localhost:5000/addBook', formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              });
  
              toast.success('Lưu sách thành công!');
  
              // Trì hoãn 3 giây trước khi chuyển hướng
              setTimeout(() => {
                navigate('/menu/LibraryBook', { replace: true });
              }, 3000);
            } catch (error) {
              console.error('Đã xảy ra lỗi khi lưu sách:', error);
              toast.error('Đã xảy ra lỗi, vui lòng thử lại!');
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
      
      {/* Phần upload avatar */}
      <div className='uploadAvatarAddBook'>
        <div className='containeruploadAvatarAddBook'>
          <img src={avatarPreview} alt="Avatar Preview" />
          <div className='containeraddBook'>
            <div className='containeraddBookLeft'>
              <div className='inputInfoAddBook'>
                <div>Tên sách</div>
                <input name="book_name" value={formValues.book_name} onChange={handleChange} placeholder='Tên sách' />
              </div>
              <div className='inputInfoAddBook' style={{marginTop:'2px'}}>
                <div>Mã sách</div>
                <input name="book_code" value={formValues.book_code} onChange={handleChange} placeholder='Mã sách' />
              </div>
              <div className='inputInfoAddBook' style={{marginTop:'3px'}}>
                <div>Tác giả</div>
                <input name="author" value={formValues.author} onChange={handleChange} placeholder='Tên tác giả' />
              </div>
              <div className='inputInfoAddBook' style={{marginTop:'0px'}}>
                <div>Ngày hệ thống nhận sách</div>
                <DatePicker
                  selected={formValues.receiveDate}
                  onChange={handleDateChange}
                  dateFormat="dd/MM/yyyy"
                  className='MemberDatePickerAddBook'
                  placeholderText='Thời gian'
                  minDate={new Date()}  // Chỉ cho phép chọn ngày từ hôm nay trở đi
                />
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
                <div>Vị trí</div>
                  <select name="location" value={formValues.location} onChange={handleChange}>
                    <option value="">Chọn vị trí</option>
                    {locations.map((loc, index) => (
                      <option key={index} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
              <div className='inputInfoAddBook'>
                <div>Ngôn ngữ</div>
                  <select name="language" value={formValues.language} onChange={handleChange}>
                    <option value="">Chọn ngôn ngữ</option>
                    {languages.map((lang, index) => (
                      <option key={index} value={lang}>{lang}</option>
                    ))}
                  </select> 
              </div>
            </div>
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
      
      <div className='ButtonAddBook'>
        <button
          className='btnAddBookSave'
          disabled={!isFormValid}
          onClick={handleSubmit}
        >
          Lưu
        </button>
        <button className='btnAddBookReset' onClick={handleReset}>
          Đặt lại
        </button>
      </div>
    </div>
  );
}
