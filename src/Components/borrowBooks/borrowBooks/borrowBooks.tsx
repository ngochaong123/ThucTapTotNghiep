import React, { useState, useEffect } from 'react';
import './borrowBooks.css';
import { Outlet, Link } from "react-router-dom";
import axios from 'axios';

import Magnifier from '../../../images/icon/magnifier.png';
import Plus from "../../../images/icon/plus.png";

interface BorrowBook {
  member_code: string;
  name: string;
  category: string;
  book_name: string;
  quantity: number;
  image_link: string;
  avatar_link: string;
  borrowDate: string;
  returnDate: string;
}

export default function LibraryBooks() {
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>(''); 
  const [searchTerm, setSearchTerm] = useState('');
  const [borrowBooks, setBorrowBooks] = useState<BorrowBook[]>([]);
  const [selectedBorrowBook, setSelectedBorrowBook] = useState<string | null>(null);

  const categories = [
    'Công nghệ thông tin',
    'Nông lâm ngư nghiệp',
    'Y Học - sức khỏe',
    'Triết học - lý luận',
    'Lịch sử - quân sự',
    'Phiêu mưu - mạo hiểm'
  ];

  const toggleFilterMenu = () => {
    setShowFilterMenu(prev => !prev);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const handleSelectBorrowBook = (memberCode: string) => {
    setSelectedBorrowBook(prevSelected => (prevSelected === memberCode ? null : memberCode));
  };

  const fetchBorrowedBooks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/BorrowdBooks', {
        params: { category: selectedCategory },
      });
      setBorrowBooks(response.data);
    } catch (error) {
      console.error('Error fetching borrowed books:', error);
      alert('Lỗi khi tải danh sách sách mượn. Vui lòng thử lại sau.');
    }
  };

  useEffect(() => {
    fetchBorrowedBooks();
  }, [selectedCategory]);

  const filteredBorrowBooks = borrowBooks.filter(borrowBook =>
    borrowBook.member_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    borrowBook.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    borrowBook.book_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className='borrowBooksCurrentInformation'>
        <div className='borrowBooksheaderborrowBooks'>
          <h1 className='borrowBookstile'>Thành viên mượn sách</h1>
          <Link to='/Menu/AddBorrowBooks' style={{ textDecoration: 'none' }}>
            <button className='borrowBooksAddborrowBooks'>
              <div style={{ display: 'flex' }}>
                <img src={Plus} className='borrowBooksiconFilter' alt="Add borrowBooks Icon" />
                <div className='borrowBooksNameiconFilter'>Mượn sách</div>
              </div>
            </button>
          </Link>
        </div>

        <div className='borrowBooksOptionsRow'>
          <div style={{ display: 'flex' }}>
            <div className='ChooseborrowBooks'>
              <div className='borrowBooksNameChoose'>Thể loại</div>
              <div className='CategoryborrowBooks'>
                <select
                  name="category"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  className="LibraryCategorySelect"
                >
                  <option value="">Chọn thể loại</option>
                  {categories.map((cat, index) => (
                    <option key={index} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <div className='borrowBooksNameSearch'>Tìm kiếm</div>
              <div className="borrowBooksSearch">
                <div className="borrowBookssearchIcon">
                  <img src={Magnifier} alt="Search Icon" />
                </div>
                <input
                  className="borrowBooksSearchInput"
                  type="text"
                  placeholder="Tìm kiếm người mượn..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <Link to='/Menu/ChangeBorrowBooks' style={{ textDecoration: 'none' }}>
            <button className='borrowBooksEditborrowBooks'>
              <div className='borrowBooksNameEdit'>Chỉnh sửa thông tin</div>
            </button>
          </Link>
        </div>

        <div className='FrameborrowBookstableContainer'>
          <div className="borrowBookstableContainer">
            <table className="memberTable">
              <thead>
                <tr>
                  <th></th>
                  <th>Mã thành viên</th>
                  <th>Tên thành viên</th>
                  <th>Tên sách</th>
                  <th>Hình ảnh</th>
                  <th>Loại sách</th>
                  <th>Số lượng</th>
                  <th>Ngày mượn sách</th>
                  <th>Ngày trả sách</th>
                </tr>
              </thead>
              <tbody>
                {filteredBorrowBooks.map(borrowBook => (
                  <tr key={borrowBook.member_code}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedBorrowBook === borrowBook.member_code}
                        onChange={() => handleSelectBorrowBook(borrowBook.member_code)}
                      />
                    </td>
                    <td>{borrowBook.member_code}</td>
                    <td>
                      <div style={{ display: 'flex' }}>
                        <img src={`http://localhost:5000${borrowBook.avatar_link}`} className='avatarborrowBooks' alt="Avatar" />
                        <div className='nameAvatarAddmember'>{borrowBook.name}</div>
                      </div>
                    </td>
                    <td>{borrowBook.book_name}</td>
                    <td>
                      <img src={`http://localhost:5000${borrowBook.image_link}`} alt="Book" style={{ width: '50px', height: '70px' }} />
                    </td>
                    <td>{borrowBook.category}</td>
                    <td>{borrowBook.quantity}</td>
                    <td>{new Date(borrowBook.borrowDate).toLocaleDateString('vi-VN')}</td>
                    <td>{new Date(borrowBook.returnDate).toLocaleDateString('vi-VN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
