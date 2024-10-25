import React, { useState, useEffect, useRef } from 'react';
import './Member.css';
import { Outlet, Link } from "react-router-dom";
import DatePicker from 'react-datepicker'; 
import 'react-datepicker/dist/react-datepicker.css'; 

import Magnifier from '../../../images/icon/magnifier.png';
import Calendar from '../../../images/icon/calendar.png';
import ArrowDown from "../../../images/icon/ArrowDown.png";
import Plus from "../../../images/icon/plus.png";

interface Member {
  id: number;
  member_code: string;
  name: string;
  email: string;
  phone: string;
  avatar_link: string; 
  registration_date: string;
  age: number;
  country: string;
}

export default function LibraryBooks() {
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const filterRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch('http://localhost:5000/getAllMembers'); // Ensure your API URL is correct
        const data = await response.json();
        setMembers(data);
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };

    fetchMembers();
  }, []);

  const toggleFilterMenu = () => {
    setShowFilterMenu((prev) => !prev);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedMembers(members.map((member) => member.id));
    } else {
      setSelectedMembers([]);
    }
  };

  const handleSelectMember = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    if (e.target.checked) {
      setSelectedMembers([...selectedMembers, id]);
    } else {
      setSelectedMembers(selectedMembers.filter((memberId) => memberId !== id));
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowFilterMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const fetchMembersByDate = async (date: Date) => {
    try {
      const formattedDate = date.toISOString().split('T')[0]; // Định dạng lại ngày thành YYYY-MM-DD
      console.log("day: ",formattedDate);
      const response = await fetch(`http://localhost:5000/getAllMembers?registrationDate=${formattedDate}`);
      const data = await response.json();
      setMembers(data); // Cập nhật danh sách thành viên với dữ liệu đã lọc
    } catch (error) {
      console.error('Error fetching members by date:', error);
    }
  };  

  const fetchMembersByKeyword = async (keyword: string) => {
    try {
      const response = await fetch(`http://localhost:5000/searchMembers?keyword=${keyword}`);
      const data = await response.json();
      setMembers(data); // Cập nhật danh sách thành viên với kết quả tìm kiếm
    } catch (error) {
      console.error('Error fetching members by keyword:', error);
    }
  };  

  return (
    <div>
      <div className='MemberCurrentInformation'>
        <div className='MemberheaderMember'>
          <h1 className='Membertile'> Dữ liệu thành viên </h1>
          <Link to='/Menu/AddMember' style={{ textDecoration: 'none' }}>
            <button className='MemberAddMember'>
              <div style={{ display: 'flex' }}>
                <img src={Plus} className='MembericonFilter' alt="Add Member Icon" />
                <div className='MemberNameiconFilter'> Thêm Thành viên mới </div>
              </div>
            </button>
          </Link>
        </div>

        <div className='MemberOptionsRow'>
          <div style={{ display: 'flex' }}>
            <div className='ChooseMember'>
              <div className='MemberNameChoose'> Thời gian </div>
              <button className='MemberCalendar'>
                <div style={{ display: 'flex' }}>
                  <img src={Calendar} className='MembericonCalender' alt="Filter Icon" />
                  <div className='CalenderMember'>
                   <DatePicker
                      selected={selectedDate}
                      onChange={(date: Date | null) => {
                        setSelectedDate(date); // Cập nhật state với ngày đã chọn
                        if (date) {
                          fetchMembersByDate(date); // Gọi hàm lọc dữ liệu theo ngày
                        }
                      }}
                      dateFormat="dd/MM/yyyy"
                      className='MemberDatePicker'
                      placeholderText='Thời gian'
                      onFocus={(e) => e.target.blur()}
                    />
                  </div>                     
                </div>
                <img src={ArrowDown} className='MembericonPlus' alt="Arrow Down Icon" />
              </button>
            </div>

            <div>
              <div className='MemberNameSearch'> Tìm kiếm </div>
              <div className="MemberSearch">
                <div className="MembersearchIcon">
                  <img src={Magnifier} alt="Search Icon" />
                </div>
                <input
                  className="MemberSearchInput"
                  type="text"
                  placeholder="Tìm kiếm thành viên..."
                  value={searchKeyword}
                  onChange={(e) => {
                    setSearchKeyword(e.target.value); // Cập nhật state với từ khóa tìm kiếm
                    fetchMembersByKeyword(e.target.value); // Gọi hàm tìm kiếm thành viên
                  }}
                />
              </div>
            </div>
          </div>

          <Link to='/Menu/changeMemberInfor' style={{ textDecoration: 'none' }}>
            <button className='MemberEditMember'>
              <div className='MemberNameEdit'> Chỉnh sửa thông tin </div>
            </button>
          </Link>
        </div>

        <div className='FrameMembertableContainer'>
          <div className="MembertableContainer">
            <table className="memberTable">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={selectedMembers.length === members.length}
                    />
                  </th>
                  <th>Mã thành viên</th>
                  <th>Tên thành viên</th>
                  <th>Tuổi</th>
                  <th>Quốc gia</th>
                  <th>Email</th>
                  <th>Số điện thoại</th>
                  <th>Ngày đăng ký</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedMembers.includes(member.id)}
                        onChange={(e) => handleSelectMember(e, member.id)}
                      />
                    </td>
                    <td>{member.member_code}</td>
                    <td>
                      <div style={{display:'flex'}}>
                        <img src={`http://localhost:5000${member.avatar_link}`} className='avatarAddmember' alt="Avatar" />
                        <div className='nameAvatarAddmember'>{member.name}</div>
                      </div>
                    </td>
                    <td>{member.age}</td>
                    <td>{member.country}</td>
                    <td>{member.email}</td>
                    <td>{member.phone}</td>
                    <td>{new Date(member.registration_date).toLocaleDateString('vi-VN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
