import React, { useState, useEffect, useRef } from 'react';
import './borrowBooks.css';
import { Outlet, Link } from "react-router-dom";
import DatePicker from 'react-datepicker'; 

import Magnifier from '../../../images/icon/magnifier.png';
import Calendar from '../../../images/icon/calendar.png';
import ArrowDown from "../../../images/icon/ArrowDown.png";
import Plus from "../../../images/icon/plus.png";

// avatar user
import Avatar from "../../../images/avatar.jpeg";

// image book
import ImageBook from "../../../images/book/TuyetTacCuashakes.png";

interface BorrowBook {
  id: number;
  memberCode: string;
  name: string;
  email: string;
  phone: string;
  registrationDate: string;
  age: number;
  country: string;
  bookType: string; // New field
  bookName: string; // New field
  quantity: number; // New field
  borrowDate: string; // New field
  returnDate: string; // New field
}

export default function LibraryBooks() {
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null); 
  const [members, setBorrowBooks] = useState<BorrowBook[]>([
    { id: 1, memberCode: 'MEM001', name: 'John Doe', email: 'john@example.com', phone: '1234567890', registrationDate: '2024-01-15', age: 25, country: 'USA', bookType: 'Fiction', bookName: 'The Great Gatsby', quantity: 1, borrowDate: '2024-10-01', returnDate: '2024-10-15' },
    { id: 2, memberCode: 'MEM002', name: 'Jane Smith', email: 'jane@example.com', phone: '0987654321', registrationDate: '2024-01-20', age: 30, country: 'UK', bookType: 'Non-Fiction', bookName: 'Sapiens', quantity: 1, borrowDate: '2024-10-02', returnDate: '2024-10-16' },
    { id: 3, memberCode: 'MEM003', name: 'Alice Johnson', email: 'alice@example.com', phone: '1122334455', registrationDate: '2024-01-25', age: 28, country: 'Canada', bookType: 'Fiction', bookName: '1984', quantity: 2, borrowDate: '2024-10-03', returnDate: '2024-10-17' },
    { id: 4, memberCode: 'MEM004', name: 'Bob Brown', email: 'bob@example.com', phone: '2233445566', registrationDate: '2024-02-01', age: 35, country: 'Australia', bookType: 'Science', bookName: 'Brief Answers to the Big Questions', quantity: 1, borrowDate: '2024-10-04', returnDate: '2024-10-18' },
    { id: 5, memberCode: 'MEM005', name: 'Charlie White', email: 'charlie@example.com', phone: '3344556677', registrationDate: '2024-02-05', age: 22, country: 'France', bookType: 'Fiction', bookName: 'The Catcher in the Rye', quantity: 3, borrowDate: '2024-10-05', returnDate: '2024-10-19' },
    { id: 6, memberCode: 'MEM006', name: 'David Black', email: 'david@example.com', phone: '4455667788', registrationDate: '2024-02-10', age: 40, country: 'Germany', bookType: 'Biography', bookName: 'The Diary of a Young Girl', quantity: 1, borrowDate: '2024-10-06', returnDate: '2024-10-20' },
    { id: 7, memberCode: 'MEM007', name: 'Eva Green', email: 'eva@example.com', phone: '5566778899', registrationDate: '2024-02-15', age: 27, country: 'Spain', bookType: 'History', bookName: 'Guns, Germs, and Steel', quantity: 2, borrowDate: '2024-10-07', returnDate: '2024-10-21' },
    { id: 8, memberCode: 'MEM008', name: 'Frank Wilson', email: 'frank@example.com', phone: '6677889900', registrationDate: '2024-02-20', age: 32, country: 'Italy', bookType: 'Fiction', bookName: 'To Kill a Mockingbird', quantity: 1, borrowDate: '2024-10-08', returnDate: '2024-10-22' },
    { id: 9, memberCode: 'MEM009', name: 'Grace Lee', email: 'grace@example.com', phone: '7788990011', registrationDate: '2024-02-25', age: 29, country: 'South Korea', bookType: 'Mystery', bookName: 'The Girl with the Dragon Tattoo', quantity: 1, borrowDate: '2024-10-09', returnDate: '2024-10-23' },
    { id: 10, memberCode: 'MEM010', name: 'Henry Moore', email: 'henry@example.com', phone: '8899001122', registrationDate: '2024-03-01', age: 31, country: 'Japan', bookType: 'Science Fiction', bookName: 'Dune', quantity: 1, borrowDate: '2024-10-10', returnDate: '2024-10-24' },
    { id: 11, memberCode: 'MEM011', name: 'Isabella King', email: 'isabella@example.com', phone: '9900112233', registrationDate: '2024-03-05', age: 24, country: 'India', bookType: 'Romance', bookName: 'Pride and Prejudice', quantity: 2, borrowDate: '2024-10-11', returnDate: '2024-10-25' },
    { id: 12, memberCode: 'MEM012', name: 'Jack Taylor', email: 'jack@example.com', phone: '1011121314', registrationDate: '2024-03-10', age: 26, country: 'Brazil', bookType: 'Thriller', bookName: 'Gone Girl', quantity: 1, borrowDate: '2024-10-12', returnDate: '2024-10-26' },
    { id: 13, memberCode: 'MEM013', name: 'Kate Harris', email: 'kate@example.com', phone: '1112131415', registrationDate: '2024-03-15', age: 33, country: 'Russia', bookType: 'Horror', bookName: 'It', quantity: 2, borrowDate: '2024-10-13', returnDate: '2024-10-27' },
    { id: 14, memberCode: 'MEM014', name: 'Leo Adams', email: 'leo@example.com', phone: '1213141516', registrationDate: '2024-03-20', age: 29, country: 'Mexico', bookType: 'Fiction', bookName: 'The Alchemist', quantity: 1, borrowDate: '2024-10-14', returnDate: '2024-10-28' },
    { id: 15, memberCode: 'MEM015', name: 'Mia Clark', email: 'mia@example.com', phone: '1314151617', registrationDate: '2024-03-25', age: 30, country: 'Argentina', bookType: 'Non-Fiction', bookName: 'Educated', quantity: 1, borrowDate: '2024-10-15', returnDate: '2024-10-29' },
    { id: 16, memberCode: 'MEM016', name: 'Noah Scott', email: 'noah@example.com', phone: '1415161718', registrationDate: '2024-04-01', age: 23, country: 'Nigeria', bookType: 'Fantasy', bookName: 'Harry Potter and the Sorcerer\'s Stone', quantity: 3, borrowDate: '2024-10-16', returnDate: '2024-10-30' },
    { id: 17, memberCode: 'MEM017', name: 'Olivia Lee', email: 'olivia@example.com', phone: '1516171819', registrationDate: '2024-04-05', age: 26, country: 'Philippines', bookType: 'Young Adult', bookName: 'The Fault in Our Stars', quantity: 2, borrowDate: '2024-10-17', returnDate: '2024-10-31' },
    { id: 18, memberCode: 'MEM018', name: 'Paul Walker', email: 'paul@example.com', phone: '1617181920', registrationDate: '2024-04-10', age: 31, country: 'Singapore', bookType: 'Self-Help', bookName: 'The Power of Habit', quantity: 1, borrowDate: '2024-10-18', returnDate: '2024-11-01' },
    { id: 19, memberCode: 'MEM019', name: 'Quinn Brown', email: 'quinn@example.com', phone: '1718192021', registrationDate: '2024-04-15', age: 22, country: 'Vietnam', bookType: 'Graphic Novel', bookName: 'Maus', quantity: 1, borrowDate: '2024-10-19', returnDate: '2024-11-02' },
    { id: 20, memberCode: 'MEM020', name: 'Riley Davis', email: 'riley@example.com', phone: '1819202122', registrationDate: '2024-04-20', age: 34, country: 'South Africa', bookType: 'Memoir', bookName: 'Becoming', quantity: 1, borrowDate: '2024-10-20', returnDate: '2024-11-03' },
  ]);

  const [selectedBorrowBooks, setSelectedBorrowBooks] = useState<number[]>([]);
  const filterRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleFilterMenu = () => {
    setShowFilterMenu((prev) => !prev);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedBorrowBooks(members.map((member) => member.id));
    } else {
      setSelectedBorrowBooks([]);
    }
  };

  const handleSelectBorrowBooks = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    if (e.target.checked) {
      setSelectedBorrowBooks([...selectedBorrowBooks, id]);
    } else {
      setSelectedBorrowBooks(selectedBorrowBooks.filter((memberId) => memberId !== id));
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
      <div className='borrowBooksCurrentInformation'>
        <div className='borrowBooksheaderborrowBooks'>
          <h1 className='borrowBookstile'> Thành viên mượn sách </h1>
          <Link to='/Menu/AddBorrowBooks' style={{ textDecoration: 'none' }}>
            <button className='borrowBooksAddborrowBooks'>
              <div style={{ display: 'flex' }}>
                <img src={Plus} className='borrowBooksiconFilter' alt="Add borrowBooks Icon" />
                <div className='borrowBooksNameiconFilter'> Mượn sách </div>
              </div>
            </button>
          </Link>
        </div>

        <div className='borrowBooksOptionsRow'>
          <div style={{ display: 'flex' }}>
            <div className='ChooseborrowBooks'>
              <div className='borrowBooksNameChoose'> Thời gian </div>
              <button className='borrowBooksCalendar'>
                <div style={{ display: 'flex' }}>
                  <img src={Calendar} className='borrowBooksiconCalender' alt="Filter Icon" />
                  <div className='CalenderborrowBooks'>
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date: Date | null) => setSelectedDate(date)}
                      dateFormat="dd/MM/yyyy"
                      className='borrowBooksDatePicker'
                      placeholderText='Thời gian'
                      onFocus={(e) => e.target.blur()} // Remove focus outline
                    />
                  </div>
                </div>
                <img src={ArrowDown} className='borrowBooksiconPlus' alt="Arrow Down Icon" />
              </button>
            </div>

            <div>
              <div className='borrowBooksNameSearch'> Tìm kiếm </div>
              <div className="borrowBooksSearch">
                <div className="borrowBookssearchIcon">
                  <img src={Magnifier} alt="Search Icon" />
                </div>
                <input className="borrowBooksSearchInput" type="text" placeholder="Tìm kiếm thành viên..." />
              </div>
            </div>
          </div>

          <Link to='/Menu/ChangeBorrowBooks' style={{ textDecoration: 'none' }}>
            <button className='borrowBooksEditborrowBooks'>
              <div className='borrowBooksNameEdit'> Chỉnh sửa thông tin </div>
            </button>
          </Link>
        </div>

        <div className='FrameborrowBookstableContainer'>
          <div className="borrowBookstableContainer">
            <table className="memberTable">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={selectedBorrowBooks.length === members.length}
                    />
                  </th>
                  <th>Mã thành viên</th>
                  <th>Tên thành viên</th>
                  <th>Loại sách</th>
                  <th>Hình ảnh</th>
                  <th>Tên sách</th>
                  <th>Số lượng</th>
                  <th>Ngày mượn sách</th>
                  <th>Ngày trả sách</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedBorrowBooks.includes(member.id)}
                        onChange={(e) => handleSelectBorrowBooks(e, member.id)}
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
                    <td>{member.bookType}</td>
                    <td>
                      <img src={ImageBook} alt="Member Avatar" style={{ width: '50px', height: '50px' }} />
                    </td>
                    <td>{member.bookName}</td>
                    <td>{member.quantity}</td>
                    <td>{member.borrowDate}</td>
                    <td>{member.returnDate}</td>
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
