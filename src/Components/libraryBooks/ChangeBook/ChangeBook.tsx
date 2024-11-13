import React, { useState, useEffect } from 'react';
import './ChangeBook.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
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

  const [isChanged, setIsChanged] = useState(false); 
  const [imagePreview, setImagePreview] = useState<string>(`http://localhost:5000${formValues.avatar}`);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value, type } = e.target;

    if (type === 'file') {
        const fileInput = e.target as HTMLInputElement;

        if (fileInput.files && fileInput.files.length > 0) {
            const file = fileInput.files[0];

            // Kiểm tra kích thước tệp
            if (file.size > 1 * 1024 * 1024) { // 1MB
                toast.error("Ảnh phải nhỏ hơn 1MB.");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result; // Lưu giá trị vào biến tạm

                setFormValues((prevValues) => ({
                    ...prevValues,
                    avatar: result as string,
                }));

                // Kiểm tra nếu result không phải là null
                if (typeof result === 'string') {
                    setImagePreview(result); // Cập nhật ảnh preview
                }
                setIsChanged(true);
            };
            reader.readAsDataURL(file);
        }
    } else {
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
        setIsChanged(true);
    }
};

  const handleDateChange = (date: Date | null) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      receiveDate: date,
    }));
    setIsChanged(true);
  };

  const triggerFileInput = () => {
    document.getElementById("avatarInput")?.click();
  };

  const receiveDate = formValues.receiveDate;


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Kiểm tra các trường dữ liệu cần thiết
    if (!formValues.book_name || !formValues.book_code || !formValues.author) {
      toast.error("Vui lòng điền tất cả các trường bắt buộc.");
      return;
    }
  
    if (!isChanged) {
      toast.info("Không có thay đổi nào để lưu.");
      return;
    }
  
    // Hiển thị hộp thoại xác nhận
    confirmAlert({
      title: 'Xác nhận cập nhật sách',
      message: 'Bạn có chắc chắn muốn cập nhật thông tin sách này không?',
      buttons: [
        {
          label: 'Hủy',
          onClick: () => {
            console.log("Cập nhật sách đã bị hủy.");
          }
        },
        {
          label: 'Xác nhận',
          onClick: async () => {
            const formData = new FormData();
            formData.append('book_name', formValues.book_name);
            formData.append('book_code', formValues.book_code);
            formData.append('author', formValues.author);
            formData.append('category', formValues.category);
            formData.append('quantity', formValues.quantity);
            formData.append('location', formValues.location);
            formData.append('language', formValues.language);
            
            if (receiveDate) {
              const newDate = new Date(receiveDate);
              newDate.setDate(newDate.getDate() + 1);
              formData.append('received_date', newDate.toISOString().split('T')[0]);
            }
  
            const avatarInput = document.getElementById("avatarInput") as HTMLInputElement;
            if (avatarInput.files && avatarInput.files[0]) {
              const file = avatarInput.files[0];
              
              // Tạo tên ảnh mới dựa trên mã sách và thời gian hiện tại
              const newFileName = `${formValues.book_code}_${Date.now()}_${file.name}`;
              
              // Thêm tên ảnh mới vào formData
              formData.append('image_link', file, newFileName);
            }
  
            try {
              const response = await axios.put(`http://localhost:5000/editBook/${formValues.book_code}`, formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              });
              toast.success(response.data.message);
              setIsChanged(false);
            } catch (error) {
              console.error("Lỗi cập nhật sách:", error);
              toast.error("Có lỗi xảy ra khi cập nhật thông tin sách.");
            }
          }
        }
      ]
    });
  };

  const DeleteBook = async () => {
    if (!formValues.book_code) {
      toast.error("Vui lòng chọn sách để xóa.");
      return;
    }

    // Hiển thị hộp thoại xác nhận
    confirmAlert({
      title: 'Xác nhận xóa sách',
      message: 'Bạn có chắc chắn muốn xóa sách này không?',
      buttons: [
        {
          label: 'Hủy',
          onClick: () => {
            console.log("Xóa sách đã bị hủy.");
          }
        },
        {
          label: 'Xác nhận',
          onClick: async () => {
            try {
              const response = await axios.delete(`http://localhost:5000/deleteBook/${formValues.book_code}`);
              toast.success(response.data.message);

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
              setImagePreview(DefaultAvatar);
              setIsChanged(false);
            } catch (error) {
              console.error("Error deleting book:", error);
              toast.error("Có lỗi xảy ra khi xóa sách.");
            }
          }
        }
      ]
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
              src={imagePreview} 
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
              </select>
            </div>
            <div className='inputInfoChangeBook'>
              <div>Ngày tiếp nhận</div>
              <DatePicker
                selected={formValues.receiveDate}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                placeholderText="Chọn ngày tiếp nhận"
                className='custom-datepicker'
                minDate={new Date()}
              />
            </div>
          </div>
        </div>

        <div className='ButtonChangeBook'>
          <button type='submit' className='SaveButtonBook'>Lưu</button>
          <button type='button' className='DeleteButtonBook' onClick={DeleteBook}>Hủy sách</button>
        </div>
      </form>
    </div>
  );
}
