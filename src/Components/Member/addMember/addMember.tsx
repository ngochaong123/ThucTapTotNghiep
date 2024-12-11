import React, { useState } from 'react';
import './addMember.css';
import { useNavigate } from 'react-router-dom';
import DefaultAvatar from "../../../images/icon/avatar.jpg";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

interface FormValues {
  member_code: string;
  name: string;
  phone: string;
  email: string;
  avatar_link: string;
  gender: string;
  age: Number; 
}

export default function AddMember() {
  const [formValues, setFormValues] = useState<FormValues>({
    member_code: '',
    name: '',
    phone: '',
    email: '',
    avatar_link: '',
    gender: '',
    age: 0,
  });

  const [avatarPreview, setAvatarPreview] = useState<string>(DefaultAvatar);
  const navigate = useNavigate();

  const isFormValid = formValues.name && formValues.phone && formValues.email && formValues.member_code && formValues.age && !isNaN(Number(formValues.age)) && Number(formValues.age) <= 100;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'age') {
      // Chỉ cho phép nhập số và kiểm tra điều kiện tuổi
      if (value && (isNaN(Number(value)) || Number(value) > 100)) {
        toast.error("Vui lòng nhập tuổi hợp lệ dưới 100!");
        return;
      }
    }

    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleReset = () => {
    confirmAlert({
      title: 'Xác nhận đặt lại',
      message: 'Bạn có chắc chắn muốn đặt thông tin thêm độc giả không?',
      buttons: [
        {
          label: 'Hủy',
          onClick: () => console.log("Đặt lại đã bị hủy."),
        },
        {
          label: 'Xác nhận',
          onClick: () => {
            setFormValues({
              member_code: '',
              name: '',
              phone: '',
              email: '',
              avatar_link: '',
              gender: '',
              age: 0,
            });
            setAvatarPreview(DefaultAvatar);
            console.log("Form đã được đặt lại.");
          },
        },
      ],
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
  
    // Kiểm tra sự hợp lệ của form
    if (!isFormValid) {
      toast.error('Vui lòng điền tất cả các trường bắt buộc và đảm bảo tuổi dưới 100!');
      return;
    }
  
    // Kiểm tra số điện thoại (chỉ chứa số và độ dài hợp lý)
    const phoneRegex = /^[0-9]+$/;
    if (!phoneRegex.test(formValues.phone)) {
      toast.error('Số điện thoại không hợp lệ. Vui lòng nhập lại.');
      return;
    }

    // Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formValues.email)) {
      toast.error('Email không hợp lệ. Vui lòng nhập lại.');
      return;
    }

    // Kiểm tra xem ảnh đã được tải lên hay chưa
    const avatarInput = document.getElementById('avatarInput') as HTMLInputElement | null;
    if (!avatarInput || !avatarInput.files || avatarInput.files.length === 0) {
      toast.error('Vui lòng tải ảnh đại diện lên!');
      return;
    }
  
    formData.append('member_code', formValues.member_code);
    formData.append('name', formValues.name);
    formData.append('phone', formValues.phone);
    formData.append('email', formValues.email);
    formData.append('gender', formValues.gender);
    formData.append('age', formValues.age.toString());
  
    confirmAlert({
      title: 'Xác nhận thêm thành viên',
      message: 'Bạn có chắc chắn muốn thêm thành viên này không?',
      buttons: [
        {
          label: 'Hủy',
          onClick: () => console.log("Thêm thành viên đã bị hủy."),
        },
        {
          label: 'Xác nhận',
          onClick: async () => {
            try {
              if (avatarInput && avatarInput.files && avatarInput.files.length > 0) {
                formData.append('avatar_link', avatarInput.files[0]);
              }
  
              await axios.post('http://localhost:5000/addMember', formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              });
  
              toast.success('Lưu thành viên thành công!');
              setTimeout(() => {
                navigate('/menu/Member', { replace: true });
              }, 3000);
  
              setFormValues({
                member_code: '',
                name: '',
                phone: '',
                email: '',
                avatar_link: '',
                gender: '',
                age: 0,
              });
              setAvatarPreview(DefaultAvatar);
              console.log("Form đã được đặt lại.");
  
            } catch (error) {
              console.error('Đã xảy ra lỗi khi lưu thành viên:', error);
              toast.error('Đã xảy ra lỗi, vui lòng thử lại!');
            }
          },
        },
      ],
    });
  };
  
  return (
    <div className='FrameContanieraddMember'>
      <h1> Thêm thông tin độc giả </h1>
      <ToastContainer />

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

      <div className='containeraddMemeber'>
        <div className='containeraddMemeberRight'> 
          <div className='inputInfoMember'>
            <div>Tên độc giả </div>
            <input name="name" value={formValues.name} onChange={handleChange} placeholder='Tên độc giả' />
          </div>
          <div className='inputInfoMember'>
            <div>Mã độc giả </div>
            <input name="member_code" value={formValues.member_code} onChange={handleChange} placeholder='Mã độc giả' />
          </div>
          <div className='inputInfoMember'>
            <div>Tuổi </div>
            <input 
              name="age" 
              value={formValues.age.toString()} 
              onChange={handleChange} 
              placeholder='Tuổi' 
              type="number" 
              min="0" 
              max="100" 
            />
          </div>
        </div>
        
        <div className='containeraddMemeberleft'>
        <div className='inputInfoMember'>
          <div>Số điện thoại </div>
            <input 
              name="phone" 
              value={formValues.phone} 
              onChange={handleChange} 
              placeholder='Số điện thoại'
            />
          </div>

          <div className='inputInfoMember'>
            <div>Email </div>
            <input name="email" value={formValues.email} onChange={handleChange} placeholder='Email' />
          </div>
          <div className="inputInfoMember">
            <div>Giới tính</div>
            <select 
              name="gender" 
              value={formValues.gender} 
              onChange={handleChange}
            >
              <option value="">Chọn giới tính</option>
              {["Nam", "Nữ"].map((gender, index) => (
                <option key={index} value={gender}>
                  {gender}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

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
