import React, { useState, useEffect } from 'react';
import './addBorrowBooks.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DefaultAvatar from "../../../images/icon/avatar.jpg";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

export default function AddBorrowBooks() {
  const [formValues, setFormValues] = useState({
    borrowBooks_id: '',
    name: '',
    book_code: '',
    quantity: '',
    member_code: '',
    image_link: '',
    borrowDate: '', 
    returnDate: '',
    book_name: '',
    category: '', 
  });

  const [imagePreview, setImagePreview] = useState<string>(DefaultAvatar); 
  const [selectedBorrowDate, setSelectedBorrowDate] = useState<Date | null>(null);
  const [selectedReturnDate, setSelectedReturnDate] = useState<Date | null>(null);
  const navigate = useNavigate();

  // Cập nhật ảnh xem trước khi có image_link
  useEffect(() => {
    setImagePreview(formValues.image_link ? `http://localhost:5000${formValues.image_link}` : DefaultAvatar);
  }, [formValues.image_link]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  // Lấy thông tin thành viên từ mã thành viên
  const handleMemberCodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const member_code = e.target.value;
    setFormValues((prev) => ({ ...prev, member_code, name: '' })); // Reset tên độc giả
    if (member_code) {
      try {
        const { data } = await axios.get(`http://localhost:5000/getMemberByCode/${member_code}`);
        setFormValues((prev) => ({ ...prev, name: data.name }));
      } catch (error) {
        console.error("Không tìm thấy thành viên", error);
        setFormValues((prev) => ({ ...prev, name: '' })); // Xóa giá trị tên độc giả
      }
    }
  };

  // Lấy thông tin sách từ mã sách
  const handleBookCodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const book_code = e.target.value;
    setFormValues((prev) => ({ ...prev, book_code, book_name: '', category: '', image_link: '' })); // Reset thông tin sách
    if (book_code) {
      try {
        const { data } = await axios.get(`http://localhost:5000/getBookByCode/${book_code}`);
        setFormValues((prev) => ({
          ...prev,
          book_name: data.book_name,
          category: data.category,
          image_link: data.image_link,
        }));
      } catch (error) {
        console.error("Không tìm thấy sách", error);
        setFormValues((prev) => ({ ...prev, book_name: '', category: '', image_link: '' })); // Xóa thông tin sách
      }
    }
  };

  const handleReset = () => {
    confirmAlert({
      title: 'Xác nhận',
      message: 'Bạn có chắc chắn muốn đặt lại thông tin mượn sách?',
      buttons: [
        {
          label: 'Hủy'
        },
        {
          label: 'Xác nhận',
          onClick: () => {
            setFormValues({
              borrowBooks_id : '',
              name: '',
              book_code: '',
              quantity: '',
              member_code: '',
              image_link: '',
              borrowDate: '', 
              returnDate: '',
              book_name: '',
              category: '', 
            });
            setImagePreview(DefaultAvatar); 
            setSelectedBorrowDate(null);
            setSelectedReturnDate(null);
          }
        }
      ]
    });
  }; 

  // Lưu thông tin mượn sách
  const handleSave = () => {
    // Kiểm tra nếu không có thay đổi
    if (!selectedBorrowDate || !selectedReturnDate || !formValues.member_code || !formValues.book_code || !formValues.quantity) {
      toast.error("Vui lòng điền đầy đủ thông tin.");
      return;
    }
  
    // Xác nhận trước khi lưu
    confirmAlert({
      title: 'Xác nhận lưu',
      message: 'Bạn có chắc chắn muốn lưu thông tin này?',
      buttons: [
        {
          label: 'Hủy',
          onClick: () => toast.info("Hành động lưu đã bị hủy.")
        },
        {
          label: 'Xác nhận',
          onClick: async () => {
            // Kiểm tra ngày trả sách phải lớn hơn ngày mượn
            if (selectedReturnDate <= selectedBorrowDate) {
              toast.error("Ngày trả sách phải lớn hơn ngày mượn.");
              return;
            }
  
            // Chuẩn bị dữ liệu gửi lên API
            const borrowData = {
              borrowBooks_id : formValues.borrowBooks_id,
              member_code: formValues.member_code,
              book_code: formValues.book_code,
              quantity: formValues.quantity,
              borrowDate: selectedBorrowDate?.toISOString().split('T')[0],
              returnDate: selectedReturnDate?.toISOString().split('T')[0]
            };
  
            try {
              const response = await axios.post('http://localhost:5000/addborrowBook', borrowData);
              if (response.status >= 200 && response.status < 300) {
                toast.success("Lưu thông tin mượn sách thành công");

                setTimeout(() => {
                  navigate('/menu/borrowBooks', { replace: true });
                }, 6000); // 6000ms = 6 giây

              } else {
                toast.error("Đã xảy ra lỗi khi lưu thông tin.");
              }
            } catch (error) {
              console.error("Lỗi khi gửi yêu cầu:", error);
              const errorMessage = axios.isAxiosError(error) && error.response?.data?.error
                ? error.response.data.error
                : "Không thể lưu thông tin mượn sách.";
              toast.error(errorMessage);
            }
          }
        }
      ]
    });
  };  

  return (
    <div className='FrameContanieraddBorrowBooks'>
      <h1>Thêm thông tin độc giả mượn sách </h1>
      <ToastContainer />

      <div className='uploadAvataraddBorrowBooks'>
        <div className='containeruploadAvataraddBorrowBooks'>
          <img 
            src={imagePreview} 
            alt="Book Cover" 
            onError={(e) => {
              e.currentTarget.src = DefaultAvatar;
            }}
          />
          <div>
            {formValues.book_name ? (
              <h3>{formValues.book_name}</h3>
            ) : (
              <h2>Ảnh cuốn sách</h2>
            )}
            <div>Chấp nhận ảnh nhỏ hơn 1Mb</div>
          </div>
        </div>
      </div>

      <div className='containeraddMemeber'>
        <div className='containeraddMemeberRight'> 
          <div className='inputInfoaddBorrowBooks'>
            <div>Mã sách </div>
            <input name="book_code" value={formValues.book_code} onChange={handleBookCodeChange} placeholder='Mã sách' />
          </div>
          <div className='inputInfoaddBorrowBooks'>
            <div>Mã độc giả </div>
            <input name="member_code" value={formValues.member_code} onChange={handleMemberCodeChange} placeholder='Mã độc giả' />
          </div>
          <div className='inputInfoaddBorrowBooks'>
            <div>Số lượng </div>
            <input name="quantity" value={formValues.quantity} onChange={handleChange} placeholder='Số lượng' />
          </div>
          <div className='inputInfoaddBorrowBooks'>
            <div>Ngày mượn sách </div>
            <DatePicker
              selected={selectedBorrowDate}
              onChange={(date) => setSelectedBorrowDate(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText='Ngày mượn sách'
            />
          </div>
        </div>
        
        <div className='containeraddMemeberleft'>
          <div className='inputInfoaddBorrowBooks'>
            <div>Mã mượn sách </div>
            <input name="borrowBooks_id" value={formValues.borrowBooks_id} onChange={handleChange} placeholder='Mã số phiếu' />
          </div>
          <div className='inputInfoaddBorrowBooks'>
            <div>Tên độc giả</div>
            <span className="infoDisplay">{formValues.name || 'Tên độc giả'}</span>
          </div>
          <div className='inputInfoaddBorrowBooks'>
            <div>Thể loại</div>
            <span className="infoDisplay" style={{marginTop:'-4px', marginBottom:'-3px'}}>{formValues.category || 'Thể loại'}</span>
          </div>
          <div className='inputInfoaddBorrowBooks'>
            <div>Ngày trả sách </div>
            <DatePicker
              selected={selectedReturnDate}
              onChange={(date) => setSelectedReturnDate(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText='Ngày trả sách'
            />
          </div>
        </div>
      </div>
      
      <div className='ButtonAddaddBorrowBooks'>
        <button className='SaveButtonaddBorrowBooks' onClick={handleSave}> Lưu </button>
        <button className='ResetButtonaddBorrowBooks' onClick={handleReset}> Đặt lại </button>
      </div>
    </div>
  );
}
