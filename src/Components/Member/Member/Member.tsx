import React, { useState, useEffect, useRef } from 'react';
import './Member.css';
import { Outlet, Link } from "react-router-dom";

// tải thư viện lịch
import DatePicker from 'react-datepicker'; // Importing the DatePicker component
import 'react-datepicker/dist/react-datepicker.css'; // Importing DatePicker styles

// icon imports
import Magnifier from '../../../images/icon/magnifier.png';
import Calendar from '../../../images/icon/calendar.png';
import ArrowDown from "../../../images/icon/ArrowDown.png";
import Plus from "../../../images/icon/plus.png";

// avatar
import Avatar from "../../../images/avatar.jpeg";

// Define a member type
interface Member {
  id: number;
  memberCode: string;
  name: string;
  email: string;
  phone: string;
  registrationDate: string;
  age: number;
  country: string;
}

export default function LibraryBooks() {
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null); // State to hold the selected date
  const [members, setMembers] = useState<Member[]>([
    { id: 1, memberCode: 'MEM001', name: 'John Doe', email: 'john@example.com', phone: '1234567890', registrationDate: '2024-01-15', age: 25, country: 'USA' },
    { id: 2, memberCode: 'MEM002', name: 'Jane Smith', email: 'jane@example.com', phone: '0987654321', registrationDate: '2024-01-20', age: 30, country: 'UK' },
    { id: 3, memberCode: 'MEM003', name: 'Alice Johnson', email: 'alice@example.com', phone: '1122334455', registrationDate: '2024-01-25', age: 28, country: 'Canada' },
    { id: 4, memberCode: 'MEM004', name: 'Bob Brown', email: 'bob@example.com', phone: '2233445566', registrationDate: '2024-02-01', age: 35, country: 'Australia' },
    { id: 5, memberCode: 'MEM005', name: 'Charlie White', email: 'charlie@example.com', phone: '3344556677', registrationDate: '2024-02-05', age: 22, country: 'France' },
    { id: 6, memberCode: 'MEM006', name: 'David Wilson', email: 'david@example.com', phone: '4455667788', registrationDate: '2024-02-10', age: 29, country: 'Germany' },
    { id: 7, memberCode: 'MEM007', name: 'Eva Green', email: 'eva@example.com', phone: '5566778899', registrationDate: '2024-02-15', age: 32, country: 'Italy' },
    { id: 8, memberCode: 'MEM008', name: 'Frank Harris', email: 'frank@example.com', phone: '6677889900', registrationDate: '2024-02-20', age: 27, country: 'Spain' },
    { id: 9, memberCode: 'MEM009', name: 'Grace Lee', email: 'grace@example.com', phone: '7788990011', registrationDate: '2024-02-25', age: 31, country: 'Japan' },
    { id: 10, memberCode: 'MEM010', name: 'Hank Miller', email: 'hank@example.com', phone: '8899001122', registrationDate: '2024-03-01', age: 40, country: 'South Korea' },
    { id: 11, memberCode: 'MEM011', name: 'Ivy Young', email: 'ivy@example.com', phone: '9900112233', registrationDate: '2024-03-05', age: 26, country: 'Brazil' },
    { id: 12, memberCode: 'MEM012', name: 'Jack Black', email: 'jack@example.com', phone: '1011121314', registrationDate: '2024-03-10', age: 36, country: 'Mexico' },
    { id: 13, memberCode: 'MEM013', name: 'Kelly White', email: 'kelly@example.com', phone: '1213141516', registrationDate: '2024-03-15', age: 38, country: 'Argentina' },
    { id: 14, memberCode: 'MEM014', name: 'Larry Green', email: 'larry@example.com', phone: '1314151617', registrationDate: '2024-03-20', age: 33, country: 'Russia' },
    { id: 15, memberCode: 'MEM015', name: 'Mona Blue', email: 'mona@example.com', phone: '1415161718', registrationDate: '2024-03-25', age: 23, country: 'India' },
    { id: 16, memberCode: 'MEM016', name: 'Nina Black', email: 'nina@example.com', phone: '1516171819', registrationDate: '2024-04-01', age: 24, country: 'China' },
    { id: 17, memberCode: 'MEM017', name: 'Oscar Red', email: 'oscar@example.com', phone: '1617181920', registrationDate: '2024-04-05', age: 37, country: 'South Africa' },
    { id: 18, memberCode: 'MEM018', name: 'Paul Gray', email: 'paul@example.com', phone: '1718192021', registrationDate: '2024-04-10', age: 28, country: 'Egypt' },
    { id: 19, memberCode: 'MEM019', name: 'Quinn Purple', email: 'quinn@example.com', phone: '1819202122', registrationDate: '2024-04-15', age: 41, country: 'Turkey' },
    { id: 20, memberCode: 'MEM020', name: 'Rita Yellow', email: 'rita@example.com', phone: '1920212223', registrationDate: '2024-04-20', age: 39, country: 'Vietnam' }
  ]);
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const filterRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

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

        {/* Flex container for options row */}
        <div className='MemberOptionsRow'>
          <div style={{ display: 'flex' }}>
            {/* Filter option */}
            <div className='ChooseMember'>
            <div className='MemberNameChoose'> Thời gian </div>
              <button className='MemberCalendar'>
                <div style={{ display: 'flex' }}>
                  <img src={Calendar} className='MembericonCalender' alt="Filter Icon" />
                  <div className='CalenderMember'>
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date: Date | null) => setSelectedDate(date)}
                      dateFormat="dd/MM/yyyy"
                      className='MemberDatePicker'
                      onFocus={(e) => e.target.blur()} // Remove focus outline
                    />
                  </div>                     
                </div>
                <img src={ArrowDown} className='MembericonPlus' alt="Arrow Down Icon" />
              </button>
              </div>

              {/* Search option */}
              <div>
                <div className='MemberNameSearch'> Tìm kiếm </div>
                <div className="MemberSearch">
                  <div className="MembersearchIcon">
                    <img src={Magnifier} alt="Search Icon" />
                  </div>
                  <input className="MemberSearchInput" type="text" placeholder="Tìm kiếm thành viên..." />
                </div>
              </div>
            </div>

            {/* Edit member button aligned to the right */}
            <Link to='/Menu/changeInfo' style={{ textDecoration: 'none' }}>
              <button className='MemberEditMember'>
                <div className='MemberNameEdit'> Chỉnh sửa thông tin </div>
              </button>
            </Link>
          </div>

        {/* Member Selection Table */}
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
                    <td>{member.memberCode}</td>
                    <td>
                      <div style={{display:'flex'}}>
                        <img src={Avatar} className='avatarAddmember'/>
                        <div className='nameAvatarAddmember'>
                          {member.name}
                        </div>
                      </div>
                    </td>
                    <td>{member.age}</td>
                    <td>{member.country}</td>
                    <td>{member.email}</td>
                    <td>{member.phone}</td>
                    <td>{member.registrationDate}</td>
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
