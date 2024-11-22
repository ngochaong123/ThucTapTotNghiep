import React, { useState, useEffect } from 'react';
import './changeInfor.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DefaultAvatar from "../../../images/icon/avatar.jpg";
import { useLocation } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

export default function AddMember() {
  const location = useLocation();
  const memberData = location.state;
  
  const [formValues, setFormValues] = useState({
    member_code: memberData ? memberData.member_code : '',
    name: memberData ? memberData.name : '',
    phone: memberData ? memberData.phone : '',
    email: memberData ? memberData.email : '',
    avatar_link: memberData ? memberData.avatar_link : '',
    country: memberData ? memberData.country : '',
    age: memberData ? memberData.age : '',
  });

  const [countries, setCountries] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string>(`http://localhost:5000${formValues.avatar_link}`);
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all')
      .then((response) => response.json())
      .then((data) => {
        const countryNames = data.map((country: any) => country.name.common);
        setCountries(countryNames);
      })
      .catch((error) => console.error('Error fetching countries:', error));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value, type } = e.target;

    if (type === 'file') {
      const fileInput = e.target as HTMLInputElement;

      if (fileInput.files && fileInput.files.length > 0) {
        const file = fileInput.files[0];

        if (file.size > 1 * 1024 * 1024) {
          toast.error("Ảnh phải nhỏ hơn 1MB.");
          return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result;

          setFormValues((prevValues) => ({
            ...prevValues,
            avatar_link: result as string,
          }));

          if (typeof result === 'string') {
            setImagePreview(result);
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

  const DeleteMember = async () => {
    if (!formValues.member_code) {
      toast.error("Vui lòng chọn thành viên để xóa.");
      return;
    }
  
    // Hiển thị hộp thoại xác nhận với react-confirm-alert
    confirmAlert({
      title: 'Xác nhận xóa thành viên',
      message: 'Bạn có chắc chắn muốn xóa thành viên này không?',
      buttons: [
        {
          label: 'Hủy',
          onClick: () => {
            console.log("Xóa thành viên đã bị hủy.");
          }
        },
        {
          label: 'Xác nhận',
          onClick: async () => {
            try {
              const response = await axios.delete(`http://localhost:5000/deleteMember/${formValues.member_code}`);
              toast.success(response.data.message);
  
              // Đặt lại các giá trị form và ảnh xem trước
              setFormValues({
                member_code: '',
                name: '',
                phone: '',
                email: '',
                avatar_link: '',
                country: '',
                age: '',
              });
              setImagePreview(DefaultAvatar);
              setIsChanged(false); 
            } catch (error) {
              console.error("lỗi xóa thành viên", error);
              toast.error("Có lỗi xảy ra khi xóa thành viên.");
            }
          }
        }
      ]
    });
  };

  const triggerFileInput = () => {
    document.getElementById("avatarInput")?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!formValues.name || !formValues.phone || !formValues.email || !formValues.member_code) {
      toast.error("Vui lòng điền tất cả các trường bắt buộc.");
      return;
    }
  
    if (!isChanged) {
      toast.info("Không có thay đổi nào để lưu.");
      return;
    }
  
    // Hiển thị hộp thoại xác nhận với react-confirm-alert
    confirmAlert({
      title: 'Xác nhận lưu thay đổi',
      message: 'Bạn có chắc chắn muốn lưu các thay đổi này không?',
      buttons: [
        {
          label: 'Hủy',
          onClick: () => {
            console.log("Lưu thay đổi đã bị hủy.");
          }
        },
        {
          label: 'Xác nhận',
          onClick: async () => {
            const formData = new FormData();
            formData.append('name', formValues.name);
            formData.append('member_code', formValues.member_code);
            formData.append('phone', formValues.phone);
            formData.append('email', formValues.email);
            formData.append('country', formValues.country);
            formData.append('age', formValues.age);
  
            const avatarInput = document.getElementById("avatarInput") as HTMLInputElement;
            if (avatarInput.files && avatarInput.files[0]) {
              const file = avatarInput.files[0];
              const newFileName = `${formValues.member_code}_${Date.now()}_${file.name}`;
              formData.append('avatar_link', file, newFileName);
            }
  
            console.log("Form Data:", formValues);
  
            try {
              const response = await axios.put(`http://localhost:5000/editMember/${formValues.member_code}`, formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              });
              toast.success(response.data.message);
              setIsChanged(false);
            } catch (error) {
              console.error("Lỗi cập nhật thành viên:", error);
              toast.error("Có lỗi xảy ra khi thêm thành viên.");
            }
          }
        }
      ]
    });
  };

  return (
    <div className='FrameContanierChangeMember'>
      <h1> Chỉnh sửa thông tin độc giả </h1>

      <div className='uploadAvatarMember'>
        <div className='containeruploadAvatarMember'>
          <img src={imagePreview} 
            alt="Avatar Preview" 
            onError={(e) => {
              e.currentTarget.src = DefaultAvatar;
            }}
          />
          <div>
            <h2> Ảnh đại diện </h2>
            <div> Chấp nhận ảnh nhỏ hơn 1Mb </div>
          </div>
        </div>
        <button className='ButtonuploadImage' onClick={triggerFileInput}>Đăng lên</button>
        <input 
          id="avatarInput" 
          type="file" 
          accept="image/*" 
          style={{ display: 'none' }} 
          onChange={handleChange} 
        />
      </div>

      <div className='containeraddMemeber'>
        <div className='containeraddMemeberRight'> 
          <div className='inputInfoMember'>
            <div>Tên độc giả </div>
            <input name="name" value={formValues.name} onChange={handleChange} placeholder='Tên độc giả' />
          </div>
          <div className='inputInfoMember'>
            <div>Mã độc giả</div>
            <input name="member_code" value={formValues.member_code} onChange={handleChange} style={{ marginBottom: 0 }} placeholder='Mã độc giả' />
          </div>
          <div className='inputInfoMember'>
            <div>Tuổi </div>
            <input name="age" value={formValues.age} onChange={handleChange} style={{ marginBottom: 0 }} placeholder='Tuổi' />
          </div>
        </div>
        
        <div className='containeraddMemeberleft'>
          <div className='inputInfoMember'>
            <div>Số điện thoại </div>
            <input name="phone" value={formValues.phone} onChange={handleChange} placeholder='Số điện thoại' />
          </div>
          <div className='inputInfoMember'>
            <div>Email </div>
            <input name="email" value={formValues.email} onChange={handleChange} placeholder='Email' />
          </div>
          <div className='inputInfoMember'>
            <div>Quốc gia </div>
            <select name="country" value={formValues.country} onChange={handleChange}>
              <option value="">Chọn quốc gia</option>
              {countries.map((country, index) => (
                <option key={index} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className='ButtonAddMember'>
        <button className='SaveButtonMember' onClick={handleSubmit}> Lưu </button>
        <button className='DeleteButtonChangeMember' onClick={DeleteMember}> Xóa thành viên </button>
      </div>

      <ToastContainer />
    </div>
  );
}
