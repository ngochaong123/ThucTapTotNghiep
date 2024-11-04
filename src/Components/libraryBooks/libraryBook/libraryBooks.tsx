import React, { useState, useEffect, useRef } from 'react';
import './libraryBooks.css';
import { Outlet, Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import Magnifier from '../../../images/icon/magnifier.png';
import Plus from '../../../images/icon/plus.png';

interface Book {
  book_code: string;
  book_name: string;
  author: string;
  quantity: number;
  category: string;
  language: string;
  location: string;
  received_date: string;
  image_link: string;
}

export default function LibraryBooks() {
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [keyword, setKeyword] = useState(''); 
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate();

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

  const handleSelectBook = (bookCode: string) => {
    setSelectedBook(selectedBook === bookCode ? null : bookCode);
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
    'Nông lâm ngư nghiệp',
    'Y Học - sức khỏe',
    'Triết học - lý luận',
    'Lịch sử - quân sự',
    'Phiêu mưu - mạo hiểm'
  ]; 

  const handleEditBook = () => {
    if (selectedBook) {
      const bookToEdit = books.find((book) => book.book_code === selectedBook);
      if (bookToEdit) {
        navigate(`/menu/changeBookInfor?book_code=${bookToEdit.book_code}`, { state: bookToEdit });
      }
    } else {
      alert('Vui lòng chọn một quốn sách để chỉnh sửa thông tin.');
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

        <div className='LibraryOptionsRow'>
          <div style={{ display: 'flex'}}>
            <div className='CategoryBook'>
              <div className="CategoryLabel">Thể loại</div>
              <div className="LibraryCategoryWrapper">
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

          <button className='LibraryEditbrary' onClick={handleEditBook}>
            <div className='LibraryNameEdit'> Chỉnh sửa thông tin </div>
          </button>
        </div>

        <div className='FrameLibrarytableContainer'>
          <div className="LibrarytableContainer">
            <table className="memberTable">
              <thead>
                <tr>
                  <th></th>
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
                    <tr key={book.book_code}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedBook === book.book_code}
                          onChange={() => handleSelectBook(book.book_code)}
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
