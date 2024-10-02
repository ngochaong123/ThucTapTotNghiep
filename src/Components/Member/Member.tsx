import React, { useState, useEffect, useRef } from 'react';
import './Member.css';
import { Outlet, Link } from "react-router-dom";

// icon imports
import Magnifier from '../../images/icon/magnifier.png';
import Calendar from '../../images/icon/calendar.png';
import ArrowDown from "../../images/icon/ArrowDown.png";
import Plus from "../../images/icon/plus.png";
import Math from "../../images/icon/math-book.png";
import literature from "../../images/icon/literature.png";
import Biology from "../../images/icon/biology.png";
import History from "../../images/icon/history-book.png";
import Science from "../../images/icon/science-book.png";


// Define a member type
interface Member {
  id: number;
  memberCode:string;
  name: string;
  email: string;
  phone: string;
  registrationDate: string;
  username: string;
  password: string;
}

export default function LibraryBooks() {
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [members, setMembers] = useState<Member[]>([
    { id: 1, memberCode: 'MEM001', name: 'John Doe', email: 'john@example.com', phone: '1234567890', registrationDate: '2024-01-15', username: 'johndoe', password: '********' },
    { id: 2, memberCode: 'MEM002', name: 'Jane Smith', email: 'jane@example.com', phone: '0987654321', registrationDate: '2024-01-20', username: 'janesmith', password: '********' },
    { id: 3, memberCode: 'MEM003', name: 'Alice Johnson', email: 'alice@example.com', phone: '1122334455', registrationDate: '2024-01-25', username: 'alicejohnson', password: '********' },
    { id: 4, memberCode: 'MEM004', name: 'Bob Brown', email: 'bob@example.com', phone: '2233445566', registrationDate: '2024-02-01', username: 'bobbrown', password: '********' },
    { id: 5, memberCode: 'MEM005', name: 'Charlie White', email: 'charlie@example.com', phone: '3344556677', registrationDate: '2024-02-05', username: 'charliewhite', password: '********' },
    { id: 6, memberCode: 'MEM006', name: 'David Wilson', email: 'david@example.com', phone: '4455667788', registrationDate: '2024-02-10', username: 'davidwilson', password: '********' },
    { id: 7, memberCode: 'MEM007', name: 'Eva Green', email: 'eva@example.com', phone: '5566778899', registrationDate: '2024-02-15', username: 'evagreen', password: '********' },
    { id: 8, memberCode: 'MEM008', name: 'Frank Harris', email: 'frank@example.com', phone: '6677889900', registrationDate: '2024-02-20', username: 'frankharris', password: '********' },
    { id: 9, memberCode: 'MEM009', name: 'Grace Lee', email: 'grace@example.com', phone: '7788990011', registrationDate: '2024-02-25', username: 'gracelee', password: '********' },
    { id: 10, memberCode: 'MEM010', name: 'Hank Miller', email: 'hank@example.com', phone: '8899001122', registrationDate: '2024-03-01', username: 'hankmiller', password: '********' },
    { id: 11, memberCode: 'MEM011', name: 'Ivy Young', email: 'ivy@example.com', phone: '9900112233', registrationDate: '2024-03-05', username: 'ivyyoung', password: '********' },
    { id: 12, memberCode: 'MEM012', name: 'Jack Black', email: 'jack@example.com', phone: '1011121314', registrationDate: '2024-03-10', username: 'jackblack', password: '********' },
    { id: 13, memberCode: 'MEM013', name: 'Kelly White', email: 'kelly@example.com', phone: '1213141516', registrationDate: '2024-03-15', username: 'kellywhite', password: '********' },
    { id: 14, memberCode: 'MEM014', name: 'Larry Green', email: 'larry@example.com', phone: '1314151617', registrationDate: '2024-03-20', username: 'larrygreen', password: '********' },
    { id: 15, memberCode: 'MEM015', name: 'Mona Blue', email: 'mona@example.com', phone: '1415161718', registrationDate: '2024-03-25', username: 'monablue', password: '********' },
    { id: 16, memberCode: 'MEM016', name: 'Nina Black', email: 'nina@example.com', phone: '1516171819', registrationDate: '2024-04-01', username: 'ninablack', password: '********' },
    { id: 17, memberCode: 'MEM017', name: 'Oscar Red', email: 'oscar@example.com', phone: '1617181920', registrationDate: '2024-04-05', username: 'oscarred', password: '********' },
    { id: 18, memberCode: 'MEM018', name: 'Paul Gray', email: 'paul@example.com', phone: '1718192021', registrationDate: '2024-04-10', username: 'paulgray', password: '********' },
    { id: 19, memberCode: 'MEM019', name: 'Quinn Purple', email: 'quinn@example.com', phone: '1819202122', registrationDate: '2024-04-15', username: 'quinnpurple', password: '********' },
    { id: 20, memberCode: 'MEM020', name: 'Rita Yellow', email: 'rita@example.com', phone: '1920212223', registrationDate: '2024-04-20', username: 'ritayellow', password: '********' }
    
  ]);
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const filterRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleFilterMenu = () => {
    setShowFilterMenu((prev) => !prev);
  };

  // Update type of 'e' to be a React.ChangeEvent<HTMLInputElement>
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedMembers(members.map((member) => member.id));
    } else {
      setSelectedMembers([]);
    }
  };

  // Update type of 'e' to be a React.ChangeEvent<HTMLInputElement>
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
          <h1 className='MembertileBook'> Dữ liệu thành viên </h1>
          <Link to='/Menu/AddMember' style={{ textDecoration: 'none' }}>
            <button className='MemberAddMember' >
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
            <div className='ChooseBook'>
              <div>
                <div className='MemberNameChooseBook'> Thời gian </div>
                <div className='MemberContanierFilter' ref={filterRef}>
                  <button
                    className='MemberFilter'
                    onClick={toggleFilterMenu}
                    ref={buttonRef}
                  >
                    <div style={{ display: 'flex' }}>
                      <img src={Calendar} className='MembericonFilter' alt="Filter Icon" />
                      <div className='MemberNameiconFilter'> Thời gian </div>
                    </div>
                    <img src={ArrowDown} className='MembericonFilter' alt="Arrow Down Icon" />
                  </button>

                  {showFilterMenu && (
                    <div className='MemberOptionFilter'>
                      <ul>
                        <img src={Math} alt="Math Icon" />
                        <div>Toán</div>
                      </ul>
                      <ul>
                        <img src={literature} alt="Literature Icon" />
                        <div>Văn học</div>
                      </ul>
                      <ul>
                        <img src={Biology} alt="Biology Icon" />
                        <div>Sinh học</div>
                      </ul>
                      <ul>
                        <img src={History} alt="History Icon" />
                        <div>Lịch sử</div>
                      </ul>
                      <ul>
                        <img src={Science} alt="Science Icon" />
                        <div>Khoa học</div>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Search option */}
            <div>
              <div className='MemberNameChooseBook'> Tìm kiếm </div>
              <div className="MemberSearchBook">
                <div className="MembersearchIcon">
                  <img src={Magnifier} alt="Search Icon" />
                </div>
                <input className="MemberSearchInput" type="text" placeholder="Tìm kiếm thành viên..." />
              </div>
            </div>
          </div>
        
          {/* Edit member button aligned to the right */}
          <button className='MemberEditMember'>
            <div className='MemberNameiconFilter'> Chỉnh sửa thông tin </div>
          </button>
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
                  <th>Email</th>
                  <th>Số điện thoại</th>
                  <th>Ngày đăng ký</th>
                  <th>Tài khoản</th>
                  <th>Mật khẩu</th>
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
                    <td>{member.memberCode}</td> {/* Hiển thị Mã thành viên */}
                    <td>{member.name}</td>
                    <td>{member.email}</td>
                    <td>{member.phone}</td>
                    <td>{member.registrationDate}</td>
                    <td>{member.username}</td>
                    <td>{member.password}</td>
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
