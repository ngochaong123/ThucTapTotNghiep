import React, { useState, useEffect } from 'react';
import './addMember.css';
import { useNavigate } from 'react-router-dom';
import DefaultAvatar from "../../../images/icon/avatar.jpg";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

export default function AddMember() {
  const [formValues, setFormValues] = useState({
    member_code: '',
    name: '',
    phone: '',
    email: '',
    avatar_link: '',
    country: '',
    age: '',
  });
  
  const [countries, setCountries] = useState<string[]>([]);
  const [avatarPreview, setAvatarPreview] = useState<string>(DefaultAvatar);
  const navigate = useNavigate();

  const isFormValid = formValues.name && formValues.phone && formValues.email && formValues.member_code;

  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all')
      .then((response) => response.json())
      .then((data) => {
        const countryNames = data.map((country: any) => country.name.common);
        setCountries(countryNames);
      })
      .catch((error) => console.error('Error fetching countries:', error));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
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
              member_code: '',
              name: '',
              phone: '',
              email: '',
              avatar_link: '',
              country: '',
              age: '',
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
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setFormValues({
        ...formValues,
        avatar_link: file.name,
      });
    } else {
      toast.error("Vui lòng chọn một ảnh nhỏ hơn 1MB!");
    }
  };

  const triggerFileInput = () => {
    document.getElementById("avatarInput")?.click();
  };

  const handleSubmit = async () => {
    const formData = new FormData();
  
    if (!isFormValid) {
      toast.error('Vui lòng điền tất cả các trường bắt buộc!');
      return;
    }
  
    formData.append('member_code', formValues.member_code);
    formData.append('name', formValues.name);
    formData.append('phone', formValues.phone);
    formData.append('email', formValues.email);
    formData.append('country', formValues.country);
    formData.append('age', formValues.age);
  
    const avatarInput = document.getElementById('avatarInput') as HTMLInputElement | null;
  
    // Hiển thị hộp thoại xác nhận
    confirmAlert({
      title: 'Xác nhận thêm thành viên',
      message: 'Bạn có chắc chắn muốn thêm thành viên này không?',
      buttons: [
        {
          label: 'Hủy',
          onClick: () => {
            console.log("Thêm thành viên đã bị hủy.");
          }
        },
        {
          label: 'Xác nhận',
          onClick: async () => {
            try {
              if (avatarInput && avatarInput.files && avatarInput.files.length > 0) {
                formData.append('avatar_link', avatarInput.files[0]);
              }
  
              const response = await axios.post('http://localhost:5000/addMember', formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              });
              toast.success('Lưu thành viên thành công!');

              // Trì hoãn 6 giây trước khi chuyển hướng
              setTimeout(() => {
                navigate('/menu/Member', { replace: true });
              }, 6000); // 6000ms = 6 giây

              handleReset();
            } catch (error) {
              console.error('Đã xảy ra lỗi khi lưu thành viên:', error);
              toast.error('Đã xảy ra lỗi, vui lòng thử lại!');
            }
          }
        }
      ]
    });
  };

  return (
    <div className='FrameContanieraddMember'>
      <h1> Thêm thông tin độc giả </h1>
      <ToastContainer /> {/* Thêm ToastContainer ở đây */}

      {/* Upload avatar */}
      <div className='uploadAvatarMember'>
        <div className='containeruploadAvatarMember'>
          <img src={avatarPreview} alt="Avatar Preview" />
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
          onChange={handleAvatarUpload} 
        />
      </div>

      {/* Info member */}
      <div className='containeraddMemeber'>
        <div className='containeraddMemeberRight'> 
          {/* Tên thành viên */}
          <div className='inputInfoMember'>
            <div>Tên độc giả </div>
            <input name="name" value={formValues.name} onChange={handleChange} placeholder='Tên độc giả' />
          </div>
          {/* Mã thành viên */}
          <div className='inputInfoMember'>
            <div>Mã độc giả </div>
            <input name="member_code" value={formValues.member_code} onChange={handleChange} style={{ marginBottom: 0 }} placeholder='Mã độc giả' />
          </div>
          {/* Độ tuổi */}
          <div className='inputInfoMember'>
            <div>Độ tuổi </div>
            <input name="age" value={formValues.age} onChange={handleChange} placeholder='Độ tuổi' />
          </div>
        </div>
        
        <div className='containeraddMemeberleft'>
          {/* Số điện thoại */}
          <div className='inputInfoMember'>
            <div>Số điện thoại </div>
            <input name="phone" value={formValues.phone} onChange={handleChange} placeholder='Số điện thoại' />
          </div>
          {/* Email */}
          <div className='inputInfoMember'>
            <div>Email </div>
            <input name="email" value={formValues.email} onChange={handleChange} placeholder='Email' />
          </div>
          {/* Quốc gia */}
          <div className='inputInfoMember'>
            <div>Quốc gia </div>
            <select name="country" value={formValues.country} onChange={handleChange} >
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

      {/* Buttons */}
      <div className='ButtonAddMember'>
        <button 
          className='SaveButtonMember' 
          disabled={!isFormValid} 
          onClick={handleSubmit}
        > 
          Lưu 
        </button>
        <button className='ResetButtonAddMember' onClick={handleReset}> Đặt lại </button>
      </div>
    </div>
  );
}
