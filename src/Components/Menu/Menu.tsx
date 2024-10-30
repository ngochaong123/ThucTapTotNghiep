import React, { useState } from 'react';
import './Menu.css';
import LogoMenu from '../../images/logo.jpg';
import { Outlet, Link } from "react-router-dom";

// Icons
import Book from "../../images/icon/book.png";
import Group from "../../images/icon/group.png";
import Report from "../../images/icon/report.png";
import User from "../../images/icon/user.png";
import loginOut from "../../images/icon/loginOut.png";
import borrowBooks from "../../images/icon/borrow-book.png";

export default function Menu() {
  const [activeMenu, setActiveMenu] = useState("LibraryBook");

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

        <Link
          to="/Login"
          className={`ButtonloginOut ${activeMenu === "Login" ? "activeMenu" : ""}`}
          onClick={() => setActiveMenu("Login")}
        >
          <div className="vertical-bar"></div>
          <img src={loginOut} alt="Logout Icon" className='IconOption' />
          <div className='NameOptionIcon'>Đăng xuất</div>
        </Link>
      </div>

      <div className='OptionSidebar'>
        <div className='ShowOption'>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
