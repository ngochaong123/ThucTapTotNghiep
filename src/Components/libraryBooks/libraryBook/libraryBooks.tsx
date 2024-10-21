import React, { useState, useEffect, useRef } from 'react';
import './libraryBooks.css';
import { Outlet, Link,useNavigate  } from "react-router-dom";
import axios from 'axios';

// icon imports
import Magnifier from '../../../images/icon/magnifier.png';
import Plus from "../../../images/icon/plus.png";

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
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate(); 

  // Fetch books data from API
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/Book');
        setBooks(response.data);
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
      setBooks(response.data);
    } catch (error) {
      console.error('Error searching books:', error);
    }
  };

  useEffect(() => {
    if (keyword) {
      searchBooks(keyword);
    }
  }, [keyword]);

  const handleCategoryChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = e.target.value;
    setSelectedCategory(category);

    if (category) {
      try {
        const response = await axios.get(`http://localhost:5000/Book?category=${encodeURIComponent(category)}`);
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books by category:', error);
      }
    } else {
      const response = await axios.get('http://localhost:5000/Book');
      setBooks(response.data);
    }
  };

  const categories = [
    'Công nghệ thông tin',
    'Nông Lâm Ngư Nghiệp',
    'Y Học - Sức Khỏe',
    'Triết Học - Lý Luận',
    'Lịch Sử - Quân Sự',
    'Phiêu Lưu - Mạo Hiểm'
  ];

  const handleEditBook = () => {
    if (selectedBooks.length === 1) {
      const selectedBook = books.find((book) => book.id === selectedBooks[0]);
      if (selectedBook) {
        // Điều hướng đến trang chỉnh sửa với thông tin sách
        navigate(`/Menu/changeBookInfor?id=${selectedBook.id}`, { state: selectedBook }); // Sử dụng navigate để điều hướng và truyền state
      }
    } else {
      alert('Vui lòng chọn chính xác một sách để chỉnh sửa.');
    }
  };

  return (
    <div>
      <div className='LibraryCurrentInformation'>
        <div className='LibraryheaderLibrary'>
          <h1 className='LibrarytileBook'> Sách thư viện </h1>
          <Link to='/Menu/AddBook' style={{ textDecoration: 'none' }}>
            <button className='LibraryAddLibrary'>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src={Plus} className='LibraryiconFilter' alt="Add Library Icon" />
                <div className='LibraryNameiconFilter'> Thêm sách mới </div>
              </div>
            </button>
          </Link>
        </div>

        {/* Flex container for options row */}
        <div className='LibraryOptionsRow'>
          <div style={{ display: 'flex'}}>
            {/* Chọn thể loại */}
            <div className='CategoryBook'>
              <div className="CategoryLabel">Thể loại</div>
              <div className="LibraryCategoryWrapper"> {/* Wrapper cho select */}
                <select
                  name="category"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  className="LibraryCategorySelect"
                >
                  <option value="" >Chọn thể loại</option>
                  {categories.map((cat, index) => (
                    <option key={index} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tìm kiếm */}
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
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Chỉnh sửa sách */}
          <button className='LibraryEditbrary' onClick={handleEditBook}>
            <div className='LibraryNameEdit'> Chỉnh sửa thông tin </div>
          </button>
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
                        <img src={`http://localhost:5000${book.image_link}`} className='LibraryImageBook' alt={book.book_name} />
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
