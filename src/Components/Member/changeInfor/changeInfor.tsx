import React, { useState, useEffect } from 'react';
import './changeInfor.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DefaultAvatar from "../../../images/icon/avatar.jpg";
import { useLocation } from 'react-router-dom';

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

  const handleReset = () => {
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
      handleReset();
    } catch (error) {
      console.error("Error adding member:", error);
      toast.error("Có lỗi xảy ra khi thêm thành viên.");
    }
  };

  return (
    <div className='FrameContanierChangeMember'>
      <h1> Chỉnh sửa thông tin thành viên </h1>

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
            <div>Tên thành viên </div>
            <input name="name" value={formValues.name} onChange={handleChange} placeholder='Tên thành viên' />
          </div>
          <div className='inputInfoMember'>
            <div>Mã thành viên </div>
            <input name="member_code" value={formValues.member_code} onChange={handleChange} style={{ marginBottom: 0 }} placeholder='Mã thành viên' />
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
        <button className='SaveButtonMember' onClick={handleSubmit} > Lưu </button>
        <button className='ResetButtonChangeMember' onClick={handleReset}> Đặt lại </button>
      </div>

      <ToastContainer />
    </div>
  );
}
