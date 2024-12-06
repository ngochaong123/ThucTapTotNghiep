import React, { useState, useEffect } from 'react';
import './changeBorrowBooks.css';
import DatePicker from 'react-datepicker';
import { useNavigate } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DefaultAvatar from "../../../images/icon/avatar.jpg";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import axios from 'axios';

export default function ChangeBorrowBooks() {
  const location = useLocation();
  const { bookData } = location.state;
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState({
    borrowBooks_id: '',
    name: '',
    book_name: '',
    image_link: '',
    borrowDate: '',
    returnDate: '',
    quantity: '',
    category: '',
    member_code: '',
    book_code: '',
  });

  const [originalValues, setOriginalValues] = useState({});
  const [avatarPreview, setAvatarPreview] = useState<string>(DefaultAvatar);
  const [selectedBorrowDate, setSelectedBorrowDate] = useState<Date | null>(null);
  const [selectedReturnDate, setSelectedReturnDate] = useState<Date | null>(null);

  useEffect(() => {
    if (bookData) {
      const initialData = {
        borrowBooks_id: bookData.borrowBooks_id || '',
        name: bookData.name || '',
        member_code: bookData.member_code || '',
        image_link: bookData.image_link || '',
        book_code: bookData.book_code || '',
        quantity: bookData.quantity || '',
        category: bookData.category || '',
        book_name: bookData.book_name || '',
        borrowDate: bookData.borrowDate || '',
        returnDate: bookData.returnDate || '',
      };

      setFormValues(initialData);
      setOriginalValues(initialData);

      if (bookData.image_link) {
        setAvatarPreview(`http://localhost:5000${bookData.image_link}`);
      }

      if (bookData.borrowDate) {
        setSelectedBorrowDate(new Date(bookData.borrowDate));
      }
      if (bookData.returnDate) {
        setSelectedReturnDate(new Date(bookData.returnDate));
      }
    }
  }, [bookData]);

  // Hàm lấy thông tin thành viên
  const handleMemberCodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const member_code = e.target.value;
    setFormValues((prev) => ({ ...prev, member_code, name: '' })); // Đặt lại name về rỗng khi nhập mã mới
    if (member_code) {
      try {
        const response = await axios.get(`http://localhost:5000/getMemberByCode/${member_code}`);
        setFormValues((prev) => ({ ...prev, name: response.data.name }));
      } catch (error) {
        console.error("Không tìm thấy thành viên", error);
        setFormValues((prev) => ({ ...prev, name: '' })); // Đặt lại name về rỗng nếu không tìm thấy thành viên
      }
    }
  };  

  // Hàm lấy thông tin sách và cập nhật ảnh khi thay đổi mã sách
  const handleBookCodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const book_code = e.target.value;
    setFormValues((prev) => ({
      ...prev,
      book_code,
      book_name: '',
      category: '',
      image_link: '',
    })); // Đặt lại các giá trị liên quan về rỗng khi nhập mã mới
    setAvatarPreview(DefaultAvatar); // Đặt lại ảnh mặc định
  
    if (book_code) {
      try {
        const response = await axios.get(`http://localhost:5000/getBookByCode/${book_code}`);
        setFormValues((prev) => ({
          ...prev,
          book_name: response.data.book_name,
          category: response.data.category,
          image_link: response.data.image_link,
        }));
        if (response.data.image_link) {
          setAvatarPreview(`http://localhost:5000${response.data.image_link}`);
        }
      } catch (error) {
        console.error("Không tìm thấy sách", error);
        setFormValues((prev) => ({
          ...prev,
          book_name: '',
          category: '',
          image_link: '',
        })); // Đặt lại giá trị liên quan về rỗng nếu không tìm thấy sách
        setAvatarPreview(DefaultAvatar); // Đặt lại ảnh mặc định
      }
    }
  };  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const hasChanges = () => {
    return JSON.stringify(formValues) !== JSON.stringify(originalValues) ||
      (selectedBorrowDate && selectedBorrowDate.toISOString() !== (originalValues as any).borrowDate) ||
      (selectedReturnDate && selectedReturnDate.toISOString() !== (originalValues as any).returnDate);
  };

  const SaveWith = () => {
    // Kiểm tra nếu không có thay đổi
    if (!hasChanges()) {
      toast.info("Không có thông tin thay đổi.");
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
            // Kiểm tra các trường dữ liệu cần thiết
            if (!formValues.borrowBooks_id || !formValues.member_code || !formValues.book_code || !formValues.quantity || !selectedBorrowDate || !selectedReturnDate) {
              toast.error("Vui lòng điền đầy đủ thông tin.");
              return;
            }
  
            // Kiểm tra ngày trả sách phải lớn hơn ngày mượn
            if (selectedReturnDate <= selectedBorrowDate) {
              toast.error("Ngày trả sách phải lớn hơn ngày mượn.");
              return;
            }
  
            // Chuẩn bị dữ liệu gửi lên API
            const borrowBookData = {
              borrowBooks_id: formValues.borrowBooks_id,
              member_code: formValues.member_code,
              book_code: formValues.book_code,
              quantity: formValues.quantity,
              borrowDate: selectedBorrowDate?.toISOString().split('T')[0],
              returnDate: selectedReturnDate?.toISOString().split('T')[0],
            };

            try {
              const response = await axios.post('http://localhost:5000/ChangeBorrowBook', borrowBookData);
              if (response.status >= 200 && response.status < 300) {
                toast.success("Lưu thông tin mượn sách thành công!");

                // Trì hoãn 6 giây trước khi chuyển hướng
                setTimeout(() => {
                  navigate('/menu/borrowBooks', { replace: true });
                }, 3000); // 3000ms = 3 giây

                setOriginalValues(formValues);
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

  const handleDelete = async () => {
    // Kiểm tra nếu không có mã sách
    if (!formValues.borrowBooks_id) {
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
              const response = await axios.delete(`http://localhost:5000/deleteBorrowBook/${formValues.borrowBooks_id}`);
              toast.success(response.data.message);
  
              // Đặt lại các giá trị form và ảnh xem trước
              setFormValues({
                borrowBooks_id: '',
                name: '',
                member_code: '',
                image_link: '',
                book_code: '',
                quantity: '',
                category: '',
                book_name: '',
                borrowDate: '',
                returnDate: '',
              });
              setAvatarPreview(DefaultAvatar);

              // Trì hoãn 6 giây trước khi chuyển hướng
              setTimeout(() => {
                navigate('/menu/borrowBooks', { replace: true });
              }, 3000); // 3000ms = 3 giây

            } catch (error) {
              console.error("Lỗi hủy sách:", error);
              toast.error("Có lỗi xảy ra khi xóa sách.");
            }
          }
        }
      ]
    });
  };

  return (
    <div className='FrameContanierchangeBorrowBooks'>
      <h1> Chỉnh sửa độc giả mượn sách </h1>

      <div className='uploadAvatarchangeBorrowBooks'>
        <div className='containeruploadAvatarchangeBorrowBooks'>
          <img 
            src={avatarPreview} 
            alt="Avatar Preview" 
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
          <div className='inputInfochangeBorrowBooks'>
            <div>Mã sách </div>
            <input name="book_code" value={formValues.book_code} onChange={handleBookCodeChange} placeholder='Mã sách' />
          </div>
          <div className='inputInfochangeBorrowBooks'>
            <div>Mã độc giả</div>
            <input name="member_code" value={formValues.member_code} onChange={handleMemberCodeChange} placeholder='Mã độc giả' />
          </div>
          <div className='inputInfochangeBorrowBooks'>
            <div>Số lượng </div>
            <input name="quantity" value={formValues.quantity} onChange={handleChange} placeholder='Số lượng' />
          </div>
          <div className='inputInfochangeBorrowBooks'>
            <div>Ngày mượn sách </div>
            <DatePicker
              selected={selectedBorrowDate}
              onChange={(date: Date | null) => setSelectedBorrowDate(date)}
              dateFormat="dd/MM/yyyy"
              className='MemberDatePickerAddBorrowBooks'
              placeholderText='Ngày mượn sách'
              minDate={new Date()}
            />
          </div>
        </div>
        
        <div className='containeraddMemeberleft'>
          <div className='inputInfochangeBorrowBooks'>
            <div>Mã mượn sách</div>
            <input name="borrowBooks_id" value={formValues.borrowBooks_id} onChange={handleChange} placeholder='Mã số phiếu' />
          </div>
          <div className='inputInfochangeBorrowBooks'>
            <div>Tên độc giả</div>
            <span className="infoDisplay">{formValues.name || 'Tên độc giả'}</span>
          </div>
          <div className='inputInfochangeBorrowBooks'>
            <div>Thể loại</div>
            <span className="infoDisplay" style={{marginTop:'-4px', marginBottom:'-3px'}}>{formValues.category || 'Thể loại'}</span>
          </div>
          <div className='inputInfochangeBorrowBooks'>
            <div>Ngày trả sách </div>
            <DatePicker
              selected={selectedReturnDate}
              onChange={(date: Date | null) => setSelectedReturnDate(date)}
              dateFormat="dd/MM/yyyy"
              className='MemberDatePickerAddBorrowBooks'
              placeholderText='Ngày trả sách'
              minDate={selectedBorrowDate || new Date()}
            />
          </div>
        </div>
      </div>

      <div className='ButtonAddchangeBorrowBooks'>
        <button 
          className='SaveButtonchangeBorrowBooks' 
          onClick={SaveWith}
        > 
          Lưu 
        </button>
        <button className='ResetButtonchangeBorrowBooks' onClick={handleDelete}> Hủy mượn sách </button>
      </div>

      <ToastContainer />
    </div>
  );
}
