import React, { useState, useEffect, useRef } from 'react';
import './Member.css';
import { Outlet, Link, useNavigate } from "react-router-dom";
import axios from 'axios';
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

export default function LibraryMembers() {
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const filterRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const navigate = useNavigate();

  // Fetch members data from API
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/Members');
        setMembers(response.data);
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };
    fetchMembers();
  }, []);

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

  const toggleFilterMenu = () => {
    setShowFilterMenu((prev) => !prev);
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
      const formattedDate = date.toISOString().split('T')[0];
      const response = await axios.get(`http://localhost:5000/Members?registrationDate=${formattedDate}`);
      setMembers(response.data);
    } catch (error) {
      console.error('Error fetching members by date:', error);
    }
  };

  const fetchMembersByKeyword = async (keyword: string) => {
    try {
      const response = await axios.get(`http://localhost:5000/searchMembers?keyword=${keyword}`);
      setMembers(response.data);
    } catch (error) {
      console.error('Error fetching members by keyword:', error);
    }
  };

  const handleEditMember = () => {
    if (selectedMembers.length === 0) {
      alert('Vui lòng chọn ít nhất một thành viên trước khi chỉnh sửa!');
    } else {
      // Lấy thông tin thành viên đầu tiên trong danh sách đã chọn
      const selectedMember = members.find(member => member.id === selectedMembers[0]);
      if (selectedMember) {
        // Điều hướng tới trang chỉnh sửa với thông tin thành viên
        navigate(`/Menu/changeMemberInfor?id=${selectedMember.id}`, { state: selectedMember });
      }
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
                        setSelectedDate(date);
                        if (date) {
                          fetchMembersByDate(date);
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
                    setSearchKeyword(e.target.value);
                    fetchMembersByKeyword(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>

          <button className='MemberEditMember' onClick={handleEditMember}>
            <div className='MemberNameEdit'> Chỉnh sửa thông tin </div>
          </button>
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
                      checked={selectedMembers.length === members.length && members.length > 0}
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
                      <div style={{ display: 'flex' }}>
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
