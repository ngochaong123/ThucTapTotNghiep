import React, { useState } from 'react';
import './Menu.css';
import LogoMenu from '../../images/logo.jpg';
import { Outlet, Link, useNavigate } from "react-router-dom";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

// Icons
import Book from "../../images/icon/book.png";
import Group from "../../images/icon/group.png";
import Report from "../../images/icon/report.png";
import User from "../../images/icon/user.png";
import loginOut from "../../images/icon/loginOut.png";
import borrowBooks from "../../images/icon/borrow-book.png";

export default function Menu() {
  const [activeMenu, setActiveMenu] = useState("LibraryBook");
  const navigate = useNavigate();

  const handleLogout = () => {
    confirmAlert({
      title: 'Xác nhận đăng xuất',
      message: 'Bạn có chắc chắn muốn đăng xuất không?',
      buttons: [
        {
          label: 'Có',
          onClick: () => {
            // Thực hiện các hành động cần thiết khi đăng xuất, ví dụ xóa token hoặc thông tin người dùng
            // Sau đó điều hướng về trang đăng nhập
            navigate('/Login');
          }
        },
        {
          label: 'Không',
          onClick: () => {}
        }
      ]
    });
  };

  return (
    <div className='containerMenu'>
      <div className='SibarMenu'>
        <div className='LogoMenu'>
          <img src={LogoMenu} alt="Logo" className='Logo' />
          <h1 style={{ color: 'white' }}>Thư viện</h1>
        </div>

        <Link
          to="LibraryBook"
          className={`ButtonMenu ${activeMenu === "LibraryBook" ? "activeMenu" : ""}`}
          onClick={() => setActiveMenu("LibraryBook")}
        >
          <div className="vertical-bar"></div>
          <img src={Book} alt="Book Icon" className='IconOption' />
          <div className='NameOptionIcon'>Sách thư viện</div>
        </Link>

        <Link
          to="Member"
          className={`ButtonMenu ${activeMenu === "Member" ? "activeMenu" : ""}`}
          onClick={() => setActiveMenu("Member")}
        >
          <div className="vertical-bar"></div>
          <img src={Group} alt="Group Icon" className='IconOption' />
          <div className='NameOptionIcon'>Thành viên</div>
        </Link>

        <Link
          to="borrowBooks"
          className={`ButtonMenu ${activeMenu === "borrowBooks" ? "activeMenu" : ""}`}
          onClick={() => setActiveMenu("borrowBooks")}
        >
          <div className="vertical-bar"></div>
          <img src={borrowBooks} alt="Borrow Books Icon" className='IconOption' />
          <div className='NameOptionIcon'>Mượn sách</div>
        </Link>

        <Link
          to="Report"
          className={`ButtonMenu ${activeMenu === "Report" ? "activeMenu" : ""}`}
          onClick={() => setActiveMenu("Report")}
        >
          <div className="vertical-bar"></div>
          <img src={Report} alt="Report Icon" className='IconOption' />
          <div className='NameOptionIcon'>Báo cáo</div>
        </Link>

        <Link
          to="User"
          className={`ButtonMenu ${activeMenu === "User" ? "activeMenu" : ""}`}
          onClick={() => setActiveMenu("User")}
        >
          <div className="vertical-bar"></div>
          <img src={User} alt="User Icon" className='IconOption' />
          <div className='NameOptionIcon'>Người dùng</div>
        </Link>

        <div
          className={`ButtonloginOut`}
          onClick={handleLogout}  // Gọi hàm handleLogout khi nhấn
        >
          <div className="vertical-bar"></div>
          <img src={loginOut} alt="Logout Icon" className='IconOption' />
          <div className='NameOptionIcon'>Đăng xuất</div>
        </div>
      </div>

      <div className='OptionSidebar'>
        <div className='ShowOption'>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
