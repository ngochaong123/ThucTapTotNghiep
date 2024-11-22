import React, { useState, useEffect } from 'react';
import './borrowBooks.css';
import { Outlet, Link, useNavigate } from "react-router-dom";
import axios from 'axios';

import Magnifier from '../../../images/icon/magnifier.png';
import Plus from "../../../images/icon/plus.png";

interface BorrowBook {
  numberVotes: string;  // Giữ lại numberVotes như là ID
  member_code: string;
  name: string;
  book_code: string;
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
  const [categories, setCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [borrowBooks, setBorrowBooks] = useState<BorrowBook[]>([]);
  const [selectedBorrowBookId, setSelectedBorrowBookId] = useState<string | null>(null); // Giữ lại numberVotes

  const navigate = useNavigate();

  const handleEditBook = () => {
    if (selectedBorrowBookId) {
      const bookToEdit = borrowBooks.find((book) => book.numberVotes === selectedBorrowBookId);
  
      if (bookToEdit) {
        navigate(`/Menu/ChangeBorrowBooks?numberVotes=${bookToEdit.numberVotes}`, { state: { bookData: bookToEdit } });
      } else {
        alert('Không tìm thấy sách với ID đã chọn.');
      }
    } else {
      alert('Vui lòng chọn một phiếu mượn sách để chỉnh sửa.');
    }
  };

  const toggleFilterMenu = () => {
    setShowFilterMenu(prev => !prev);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const handleSelectBorrowBook = (id: string) => {
    // Chỉ cho phép chọn một checkbox tại một thời điểm
    setSelectedBorrowBookId(prevSelected => (prevSelected === id ? null : id));
  };

  const fetchBorrowedBooks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/BorrowBooks', {
        params: { category: selectedCategory },
      });
      setBorrowBooks(response.data);
    } catch (error) {
      console.error('Error fetching borrowed books:', error);
      alert('Lỗi khi tải danh sách sách mượn. Vui lòng thử lại sau.');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/categories');
      setCategories(response.data); // Cập nhật danh sách thể loại từ API
    } catch (error) {
      console.error('Error fetching categories:', error);
      alert('Lỗi khi tải danh sách thể loại. Vui lòng thử lại sau.');
    }
  };

  useEffect(() => {
    fetchCategories(); // Lấy danh sách thể loại khi component được render
  }, []);

  useEffect(() => {
    fetchBorrowedBooks(); // Lấy danh sách sách mượn khi thể loại thay đổi
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
          <h1 className='borrowBookstile'>Độc giả mượn sách</h1>
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
                  placeholder="Tìm kiếm độc giả..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <button className='borrowBooksEditborrowBooks' style={{width:'165px'}}>
            <div className='borrowBooksNameEdit'>Xác nhận trả sách</div>
          </button>

          <button
            className='borrowBooksEditborrowBooks'
            onClick={handleEditBook}
          >
            <div className='borrowBooksNameEdit'>Chỉnh sửa thông tin</div>
          </button>
        </div>

        <div className='FrameborrowBookstableContainer'>
          <div className="borrowBookstableContainer">
            <table className="memberTable">
              <thead>
                <tr>
                  <th></th>
                  <th>Mã Số phiếu</th>
                  <th>Tên độc giả</th>
                  <th>Tên sách</th>
                  <th>Hình ảnh</th>
                  <th>Thể loại</th>
                  <th>Số lượng</th>
                  <th>Ngày mượn sách</th>
                  <th>Ngày trả sách</th>
                </tr>
              </thead>
              <tbody>
                {filteredBorrowBooks.map(borrowBook => (
                  <tr key={borrowBook.numberVotes}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedBorrowBookId === borrowBook.numberVotes}
                        onChange={() => handleSelectBorrowBook(borrowBook.numberVotes)}
                      />
                    </td>
                    <td>{borrowBook.numberVotes}</td>
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
