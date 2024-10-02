import React from 'react';
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
  return (
    <div className='containerMenu'>
      {/* Sidebar menu */}
      <div className='SibarMenu'>
        {/* Logo menu */}
        <div className='LogoMenu'>
          <img src={LogoMenu} alt="Logo" className='Logo' />
          <h1 style={{color:'white'}}>Thư viện</h1>
        </div>
        
        {/* Menu items with Links to different routes */}
        <Link to="LibraryBook" className='ButtonMenu'>
          <img src={Book} alt="Book Icon" className='IconOption' />
          <div className='NameOptionIcon'>Sách thư viện</div>
        </Link>

        <Link to="Member" className='ButtonMenu'>
          <img src={Group} alt="Group Icon" className='IconOption' />
          <div className='NameOptionIcon'>Thành viên</div>
        </Link>

        <Link to="Member" className='ButtonMenu'>
          <img src={borrowBooks} alt="Group Icon" className='IconOption' />
          <div className='NameOptionIcon'>Mượn sách</div>
        </Link>

        <Link to="Report" className='ButtonMenu'>
          <img src={Report} alt="Report Icon" className='IconOption' />
          <div className='NameOptionIcon'>Báo cáo</div>
        </Link>

        <Link to="User" className='ButtonMenu'>
          <img src={User} alt="User Icon" className='IconOption' />
          <div className='NameOptionIcon'>Người dùng</div>
        </Link>

        <Link to="/Login" className='ButtonloginOut'>
          <img src={loginOut} alt="Logout Icon" className='IconOption' />
          <div className='NameOptionIcon'>Đăng xuất</div>
        </Link>
      </div>

      {/* Main content area */}
      <div className='OptionSidebar'>

        {/* Outlet to display nested routes */}
        <div className='ShowOption'>
          <Outlet />
          
        </div>
        
      </div>
    </div>
  );
}
