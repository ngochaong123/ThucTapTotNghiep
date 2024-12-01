import React, { useState, useEffect } from 'react';
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
import returnBook from "../../images/icon/towel.png";

export default function Menu() {
  const [activeMenu, setActiveMenu] = useState<string>("LibraryBook"); // Explicit type for activeMenu
  const navigate = useNavigate();

  // Load active menu from localStorage when the component mounts
  useEffect(() => {
    const savedMenu = localStorage.getItem('activeMenu');
    if (savedMenu) {
      setActiveMenu(savedMenu);
    }
  }, []);

  // Handle menu click
  const handleMenuClick = (menu: string) => {
    setActiveMenu(menu);
    localStorage.setItem('activeMenu', menu); // Save the menu state to localStorage
  };

  // Handle logout action
  const handleLogout = () => {
    confirmAlert({
      title: 'Xác nhận đăng xuất',
      message: 'Bạn có chắc chắn muốn đăng xuất không?',
      buttons: [
        {
          label: 'Hủy',
          onClick: () => {}
        },
        {
          label: 'Xác nhận',
          onClick: () => {
            // Perform necessary logout actions, like removing token or user info
            navigate('/Login');
          }
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
          onClick={() => handleMenuClick("LibraryBook")}
        >
          <div className="vertical-bar"></div>
          <img src={Book} alt="Book Icon" className='IconOption' />
          <div className='NameOptionIcon'>Sách thư viện</div>
        </Link>

        <Link
          to="Member"
          className={`ButtonMenu ${activeMenu === "Member" ? "activeMenu" : ""}`}
          onClick={() => handleMenuClick("Member")}
        >
          <div className="vertical-bar"></div>
          <img src={Group} alt="Group Icon" className='IconOption' />
          <div className='NameOptionIcon'>Độc giả</div>
        </Link>

        <Link
          to="borrowBooks"
          className={`ButtonMenu ${activeMenu === "borrowBooks" ? "activeMenu" : ""}`}
          onClick={() => handleMenuClick("borrowBooks")}
        >
          <div className="vertical-bar"></div>
          <img src={borrowBooks} alt="Borrow Books Icon" className='IconOption' />
          <div className='NameOptionIcon'>Mượn sách</div>
        </Link>

        <Link
          to="ReturnBooks"
          className={`ButtonMenu ${activeMenu === "returnBook" ? "activeMenu" : ""}`}
          onClick={() => handleMenuClick("returnBook")}
        >
          <div className="vertical-bar"></div>
          <img src={returnBook} alt="Borrow Books Icon" className='IconOption' />
          <div className='NameOptionIcon'>Trả sách</div>
        </Link>

        <Link
          to="Report"
          className={`ButtonMenu ${activeMenu === "Report" ? "activeMenu" : ""}`}
          onClick={() => handleMenuClick("Report")}
        >
          <div className="vertical-bar"></div>
          <img src={Report} alt="Report Icon" className='IconOption' />
          <div className='NameOptionIcon'>Báo cáo</div>
        </Link>

        <Link
          to="User"
          className={`ButtonMenu ${activeMenu === "User" ? "activeMenu" : ""}`}
          onClick={() => handleMenuClick("User")}
        >
          <div className="vertical-bar"></div>
          <img src={User} alt="User Icon" className='IconOption' />
          <div className='NameOptionIcon'>Tài khoản cá nhân</div>
        </Link>

        <div
          className={`ButtonloginOut`}
          onClick={handleLogout}  // Call handleLogout when clicked
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
