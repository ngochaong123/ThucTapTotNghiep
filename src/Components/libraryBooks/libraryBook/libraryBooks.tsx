import React, { useState, useEffect, useRef } from 'react';
import './libraryBooks.css';
import { Outlet, Link } from "react-router-dom";
import axios from 'axios';

// icon imports
import Magnifier from '../../../images/icon/magnifier.png';
import Filter from '../../../images/icon/filter.png';
import ArrowDown from "../../../images/icon/ArrowDown.png";
import Plus from "../../../images/icon/plus.png";

import Teachnology from "../../../images/icon/informatics-book.png";
import Biology from "../../../images/icon/biology-book.png";
import Medicine from "../../../images/icon/health-book.png";
import History from "../../../images/icon/history-book.png";
import Philosophy from "../../../images/icon/book-philosophy.png";
import Adventure from "../../../images/icon/Adventure.png";

// Define a book type
interface Book {
  id: number;
  book_code: string;
  book_name: string;
  author: string;
  quantity: number;
  category: string;
  language: string;
  location: string;
  received_date: string;
  image_link: string; // Field for book image URL
}

export default function LibraryBooks() {
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBooks, setSelectedBooks] = useState<number[]>([]);
  const filterRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [keyword, setKeyword] = useState(''); 

  // Fetch books data from API
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/Book'); // Call your API here
        setBooks(response.data); // Update the books state with data from API
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []);

  const toggleFilterMenu = () => {
    setShowFilterMenu((prev) => !prev);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedBooks(books.map((book) => book.id));
    } else {
      setSelectedBooks([]);
    }
  };

  const handleSelectBook = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    if (e.target.checked) {
      setSelectedBooks([...selectedBooks, id]);
    } else {
      setSelectedBooks(selectedBooks.filter((bookId) => bookId !== id));
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

  // Hàm tìm kiếm sách từ API
  const searchBooks = async (keyword: string) => {
    try {
      const response = await axios.get(`http://localhost:5000/search?keyword=${keyword}`);
      setBooks(response.data); // Cập nhật danh sách sách
    } catch (error) {
      console.error('Error searching books:', error);
    }
  };

  // Gọi API tìm kiếm khi từ khóa thay đổi
  useEffect(() => {
    if (keyword) {
      searchBooks(keyword);
    }
  }, [keyword]);

  const handleCategoryClick = (category : string) => {
    // Gọi API để lấy danh sách sách theo thể loại
    fetch(`http://localhost:5000/Book?category=${encodeURIComponent(category)}`)
      .then(response => response.json())
      .then(data => {
        setBooks(data); // Cập nhật danh sách sách
        setShowFilterMenu(false); // Đóng menu sau khi chọn
      })
      .catch(error => {
        console.error('Error fetching books by category:', error);
      });
  };  

  return (
    <div>
      <div className='LibraryCurrentInformation'>
        <div className='LibraryheaderLibrary'>
          <h1 className='LibrarytileBook'> Sách thư viện </h1>
          <Link to='/Menu/AddBook' style={{ textDecoration: 'none' }}>
            <button className='LibraryAddLibrary'>
              <div style={{ display: 'flex' }}>
                <img src={Plus} className='LibraryiconFilter' alt="Add Library Icon" />
                <div className='LibraryNameiconFilter'> Thêm sách mới </div>
              </div>
            </button>
          </Link>
        </div>

        {/* Flex container for options row */}
        <div className='LibraryOptionsRow'>
          <div style={{ display: 'flex' }}>
            {/* Filter option */}
            <div className='ChooseBook'>
              <div className='LibraryNameChooseBook'> Thể loại </div>
              <div className='LibraryContanierFilter' ref={filterRef}>
                <button
                  className='LibraryFilter'
                  onClick={toggleFilterMenu}
                  ref={buttonRef}
                >
                  <div style={{ display: 'flex' }}>
                    <img src={Filter} className='LibraryiconFilter' alt="Filter Icon" />
                    <div className='LibraryNameiconFilter'> Thể loại </div>
                  </div>
                  <img src={ArrowDown} className='LibraryiconFilter' alt="Arrow Down Icon" />
                </button>

                {showFilterMenu && (
                  <div className='LibraryOptionFilter'>
                    <ul onClick={() => handleCategoryClick('Công nghệ thông tin')}>
                      <img src={Teachnology} alt="Teachnology Icon" />
                      <div>Công nghệ thông tin</div>
                    </ul>
                    <ul onClick={() => handleCategoryClick('Nông Lâm Ngư')}>
                      <img src={Biology} alt="Biology Icon" />
                      <div>Nông Lâm Ngư nghiệp</div>
                    </ul>
                    <ul onClick={() => handleCategoryClick('Y Học - Sức Khỏe')}>
                      <img src={Medicine} alt="Medicine Icon" />
                      <div>Y Học - Sức Khỏe</div>
                    </ul>
                    <ul onClick={() => handleCategoryClick('Triết Học - Lý Luận')}>
                      <img src={Philosophy} alt="Philosophy Icon" />
                      <div>Triết Học - Lý Luận</div>
                    </ul>
                    <ul onClick={() => handleCategoryClick('Lịch Sử - Quân Sự')}>
                      <img src={History} alt="History Icon" />
                      <div>Lịch Sử - Quân Sự</div>
                    </ul>
                    <ul onClick={() => handleCategoryClick('Phiêu Lưu - Mạo Hiểm')}>
                      <img src={Adventure} alt="Adventure Icon" />
                      <div>Phiêu Lưu - Mạo Hiểm</div>
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Search option */}
            <div>
              <div className='LibraryNameChooseBook'> Tìm kiếm </div>
              <div className="LibrarySearchBook">
                <div className="LibrarysearchIcon">
                  <img src={Magnifier} alt="Search Icon" />
                </div>
                <input
                  className="LibrarySearchInput"
                  type="text"
                  placeholder="Tìm kiếm sách..."
                  value={keyword} // Liên kết state với input
                  onChange={(e) => setKeyword(e.target.value)} // Cập nhật từ khóa tìm kiếm
                />
              </div>
            </div>
          </div>

          {/* Edit book  */}
          <Link to='/Menu/changeBookInfor' style={{ textDecoration: 'none' }}>
            <button className='LibraryEditbrary'>
              <div className='LibraryNameDelete'> Chỉnh sửa thông tin </div>
            </button>
          </Link>
        </div>

        {/* Library Selection Table */}
        <div className='FrameLibrarytableContainer'>
          <div className="LibrarytableContainer">
            <table className="memberTable">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={selectedBooks.length === books.length}
                    />
                  </th>
                  <th>Mã sách</th>
                  <th>Tên sách</th>
                  <th>Hình ảnh</th>
                  <th>Số lượng</th>
                  <th>Thể loại</th>
                  <th>Tác giả</th>
                  <th>Vị trí sách</th>
                  <th>Ngôn ngữ</th>
                  <th>Ngày nhận sách</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => {
                  return (
                    <tr key={book.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedBooks.includes(book.id)}
                          onChange={(e) => handleSelectBook(e, book.id)}
                        />
                      </td>
                      <td>{book.book_code}</td>
                      <td>{book.book_name}</td>
                      <td>
                        <img src={`http://localhost:5000${book.image_link}`} className='LibraryImageBook' />
                      </td>
                      <td>{book.quantity}</td>
                      <td>{book.category}</td>
                      <td>{book.author}</td>
                      <td>{book.location}</td>
                      <td>{book.language}</td>
                      <td>{new Date(book.received_date).toLocaleDateString('vi-VN')}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  );
}