import React, { useState, useEffect, ChangeEvent } from 'react';
import './User.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 
import DefaultAvatar from "../../images/icon/avatar.jpg";

export default function User() { 
  const [formValues, setFormValues] = useState({
    full_name: '',
    phone_number: '',
    email: '',
    user_code: '',
    username: '', 
    avatar_user: '',
    country: '',
    age: '',
    password: '', 
  });
  
  const [initialFormValues, setInitialFormValues] = useState(formValues);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [countries, setCountries] = useState<string[]>([]);
  const [avatarPreview, setAvatarPreview] = useState<string>(DefaultAvatar);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState(false);

  // Regular expression for password validation
  const isValidPassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/getUser`);
        if (!response.ok) throw new Error('Không thể lấy dữ liệu người dùng');
        
        const userData = await response.json();
        setFormValues(userData);
        setInitialFormValues(userData);
        setAvatarPreview(`http://localhost:5000${userData.avatar_user}`);

      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    setIsFormValid(
      !!(formValues.full_name && formValues.phone_number && formValues.email &&
         formValues.user_code && formValues.username && formValues.password)
    );
  }, [formValues]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3/all');
        const data = await response.json();
        const countryNames = data.map((country: { name: { common: string } }) => country.name.common);
        setCountries(countryNames);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };
    fetchCountries();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSaveConfirmation = () => {
    confirmAlert({
      title: 'Xác nhận lưu',
      message: 'Bạn có chắc chắn muốn lưu thông tin không?',
      buttons: [
        {
          label: 'Hủy'
        },
        {
          label: 'Xác nhận',
          onClick: handleSaveUserData
        }
      ]
    });
  };

  const handleSaveUserData = async () => {
    // Kiểm tra xem mật khẩu có hợp lệ trước khi lưu
    if (!isValidPassword(formValues.password)) {
        toast.error('Mật khẩu không hợp lệ! Nó phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.');
        return;
    }

    // Kiểm tra xem có sự thay đổi nào trong thông tin khác ngoài ảnh đại diện không
    const isFormChanged = JSON.stringify(formValues) !== JSON.stringify(initialFormValues);
    
    if (!isFormChanged && !avatarFile) {
        toast.info('Không có sự thay đổi nào để lưu.'); 
        return;
    }

    try {
        const formData = new FormData();
        
        // Thêm thông tin người dùng vào formData
        formData.append('user_code', formValues.user_code);
        formData.append('username', formValues.username);
        formData.append('full_name', formValues.full_name);
        formData.append('password', formValues.password);
        formData.append('email', formValues.email);
        formData.append('age', formValues.age);
        formData.append('phone_number', formValues.phone_number);
        formData.append('country', formValues.country);
        
        // Thêm ảnh đại diện nếu có
        if (avatarFile) {
            formData.append('avatar_user', avatarFile);
        }

        const response = await fetch(`http://localhost:5000/editUser`, {
            method: 'PUT',
            body: formData
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Không thể cập nhật thông tin người dùng: ${errorMessage}`);
        }

        const result = await response.json();
        toast.success('Thông tin đã được lưu thành công!');
        console.log('Thông tin đã được lưu:', result.message);
        setInitialFormValues(formValues);
    } catch (error) {
        console.error('Error updating user data:', error);
        toast.error('Lưu thông tin thất bại!');
    }
};


  const handleAvatarUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size < 1024 * 1024) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      alert("Vui lòng chọn một ảnh nhỏ hơn 1MB!");
    }
  };

  const triggerFileInput = () => {
    document.getElementById("avatarInput")?.click();
  };

  const handleResetConfirmation = () => {
    confirmAlert({
      title: 'Xác nhận đặt lại',
      message: 'Bạn có chắc chắn muốn đặt lại thông tin không?',
      buttons: [
        {
          label: 'Hủy'
        },
        {
          label: 'Xác nhận',
          onClick: resetFormValues
        }
      ]
    });
  };
  
  const resetFormValues = () => {
    setFormValues({
      full_name: '',
      phone_number: '',
      email: '',
      user_code: '',
      username: '', 
      avatar_user: '',
      country: '',
      age: '',
      password: '', 
    });
    setAvatarPreview(DefaultAvatar);
    setAvatarFile(null);
  };

  return (
    <div className='FrameContanieraddUser'>
      <ToastContainer />
      <h1> Thông tin người dùng </h1>
      <div className='uploadAvatarUser'>
        <div className='containeruploadAvatarUser'>
          <img 
            src={avatarPreview} 
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
          onChange={handleAvatarUpload} 
        />
      </div>

      <div className='containerUser'>
        <div className='containerUserRight'> 
          <div className='inputInfoUser'>
            <div>Tên Người dùng</div>
            <input name="full_name" value={formValues.full_name} onChange={handleChange} placeholder='Tên thành viên' />
          </div>
          <div className='inputInfoUser'>
            <div>Căn cước công đân </div>
            <input name="user_code" value={formValues.user_code} onChange={handleChange} placeholder='Căn cước công đân' />
          </div>
          <div className='inputInfoUser'>
            <div>Tài khoản</div>
            <input name="username" value={formValues.username} onChange={handleChange} placeholder='Tài khoản' />
          </div>
          <div className='inputInfoUser'>
            <div>Độ tuổi</div>
            <input name="age" value={formValues.age} onChange={handleChange} placeholder='Độ tuổi' />
          </div>
        </div>
        
        <div className='containerUserleft'>
          <div className='inputInfoUser'>
            <div>Số điện thoại</div>
            <input name="phone_number" value={formValues.phone_number} onChange={handleChange} placeholder='Số điện thoại' />
          </div>
          <div className='inputInfoUser'>
            <div>Email</div>
            <input name="email" value={formValues.email} onChange={handleChange} placeholder='Email' />
          </div>
          <div className='inputInfoUser'>
            <div>Mật khẩu</div>
            <div className="inputPasswordUser">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formValues.password}
                onChange={handleChange}
                placeholder='Mật khẩu'
                style={{width:'300px'}}
              />
              <span onClick={() => setShowPassword(!showPassword)} className="icon-password">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <div className='inputInfoUser' style={{marginTop:'-10px'}}>
            <div>Quốc gia</div>
            <select name="country" value={formValues.country} onChange={handleChange}>
              <option value="">Chọn quốc gia</option>
              {countries.map((country, index) => (
                <option key={index} value={country}>{country}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="ButtonAddUser">
        <button className='SaveButtonUser' onClick={handleSaveConfirmation} > Lưu </button>
        <button className='ResetButtonUser' onClick={handleResetConfirmation}> Đặt lại </button>
      </div>
    </div>
  );
}
