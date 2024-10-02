import React, { useState, useEffect, useRef } from 'react';
import './libraryBooks.css';
import { Outlet, Link } from "react-router-dom";

// icon imports
import Magnifier from '../../../images/icon/magnifier.png';
import Filter from '../../../images/icon/filter.png';
import ArrowDown from "../../../images/icon/ArrowDown.png";
import Plus from "../../../images/icon/plus.png";
import Math from "../../../images/icon/math-book.png";
import literature from "../../../images/icon/literature.png";
import Biology from "../../../images/icon/biology.png";
import History from "../../../images/icon/history-book.png";
import Science from "../../../images/icon/science-book.png";

// avatar
import ImageBook from "../../../images/book/TuyetTacCuashakes.png";

// Define a book type
interface Book {
  id: number;
  maSach: string;
  title: string;
  author: string;
  quantity: number;
  publishDate: string;
  updatedDate: string;
  location: string;  // New field for book location
  receivedDate: string;  // New field for book received date
}

export default function LibraryBooks() {
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [books, setBooks] = useState<Book[]>([
    { id: 3, maSach: 'BOOK003', title: 'Pride and Prejudice', author: 'Jane Austen', quantity: 5, publishDate: '28/01/1813', updatedDate: '2024-06-05', location: 'C1', receivedDate: '13/06/2024' },
    { id: 4, maSach: 'BOOK004', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', quantity: 12, publishDate: '10/04/1925', updatedDate: '2024-06-06', location: 'A3', receivedDate: '14/06/2024' },
    { id: 5, maSach: 'BOOK005', title: 'Moby-Dick', author: 'Herman Melville', quantity: 6, publishDate: '18/10/1851', updatedDate: '2024-06-07', location: 'B1', receivedDate: '15/06/2024' },
    { id: 6, maSach: 'BOOK006', title: 'War and Peace', author: 'Leo Tolstoy', quantity: 4, publishDate: '09/01/1869', updatedDate: '2024-06-08', location: 'D2', receivedDate: '16/06/2024' },
    { id: 7, maSach: 'BOOK007', title: 'The Catcher in the Rye', author: 'J.D. Salinger', quantity: 9, publishDate: '16/07/1951', updatedDate: '2024-06-09', location: 'C2', receivedDate: '17/06/2024' },
    { id: 8, maSach: 'BOOK008', title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', quantity: 7, publishDate: '29/07/1954', updatedDate: '2024-06-10', location: 'E3', receivedDate: '18/06/2024' },
    { id: 9, maSach: 'BOOK009', title: 'The Hobbit', author: 'J.R.R. Tolkien', quantity: 10, publishDate: '21/09/1937', updatedDate: '2024-06-11', location: 'F1', receivedDate: '19/06/2024' },
    { id: 10, maSach: 'BOOK010', title: 'Crime and Punishment', author: 'Fyodor Dostoevsky', quantity: 8, publishDate: '01/01/1866', updatedDate: '2024-06-12', location: 'B3', receivedDate: '20/06/2024' },
    { id: 11, maSach: 'BOOK011', title: 'The Brothers Karamazov', author: 'Fyodor Dostoevsky', quantity: 5, publishDate: '01/01/1880', updatedDate: '2024-06-13', location: 'C3', receivedDate: '21/06/2024' },
    { id: 12, maSach: 'BOOK012', title: 'Brave New World', author: 'Aldous Huxley', quantity: 11, publishDate: '01/01/1932', updatedDate: '2024-06-14', location: 'D1', receivedDate: '22/06/2024' },
    { id: 13, maSach: 'BOOK013', title: 'The Grapes of Wrath', author: 'John Steinbeck', quantity: 6, publishDate: '14/04/1939', updatedDate: '2024-06-15', location: 'F2', receivedDate: '23/06/2024' },
    { id: 14, maSach: 'BOOK014', title: 'Jane Eyre', author: 'Charlotte Brontë', quantity: 9, publishDate: '16/10/1847', updatedDate: '2024-06-16', location: 'E1', receivedDate: '24/06/2024' },
    { id: 15, maSach: 'BOOK015', title: 'Wuthering Heights', author: 'Emily Brontë', quantity: 4, publishDate: '01/12/1847', updatedDate: '2024-06-17', location: 'B4', receivedDate: '25/06/2024' },
    { id: 16, maSach: 'BOOK016', title: 'Les Misérables', author: 'Victor Hugo', quantity: 7, publishDate: '01/01/1862', updatedDate: '2024-06-18', location: 'A2', receivedDate: '26/06/2024' },
    { id: 17, maSach: 'BOOK017', title: 'Don Quixote', author: 'Miguel de Cervantes', quantity: 3, publishDate: '01/01/1605', updatedDate: '2024-06-19', location: 'E2', receivedDate: '27/06/2024' },
    { id: 18, maSach: 'BOOK018', title: 'Ulysses', author: 'James Joyce', quantity: 10, publishDate: '02/02/1922', updatedDate: '2024-06-20', location: 'C4', receivedDate: '28/06/2024' },
    { id: 19, maSach: 'BOOK019', title: 'The Odyssey', author: 'Homer', quantity: 8, publishDate: '01/01/800 BC', updatedDate: '2024-06-21', location: 'D3', receivedDate: '29/06/2024' },
    { id: 20, maSach: 'BOOK020', title: 'Hamlet', author: 'William Shakespeare', quantity: 15, publishDate: '01/01/1600', updatedDate: '2024-06-22', location: 'A4', receivedDate: '30/06/2024' },
    { id: 21, maSach: 'BOOK021', title: 'A Tale of Two Cities', author: 'Charles Dickens', quantity: 7, publishDate: '01/01/1859', updatedDate: '2024-06-23', location: 'F3', receivedDate: '01/07/2024' },
    { id: 22, maSach: 'BOOK022', title: 'The Divine Comedy', author: 'Dante Alighieri', quantity: 5, publishDate: '01/01/1320', updatedDate: '2024-06-24', location: 'D4', receivedDate: '02/07/2024' }
  ]);
  const [selectedBooks, setSelectedBooks] = useState<number[]>([]);
  const filterRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

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

            {/* Search option */}
            <div>
              <div className='LibraryNameChooseBook'> Tìm kiếm </div>
              <div className="LibrarySearchBook">
                <div className="LibrarysearchIcon">
                  <img src={Magnifier} alt="Search Icon" />
                </div>
                <input className="LibrarySearchInput" type="text" placeholder="Tìm kiếm sách..." />
              </div>
            </div>
          </div>

          {/* edit book  */}
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
                  <th>Năm xuất bản</th>
                  <th>Ngày nhận sách</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedBooks.includes(book.id)}
                        onChange={(e) => handleSelectBook(e, book.id)}
                      />
                    </td>
                    <td>{book.maSach}</td>
                    <td>{book.title}</td>
                    <td>
                      <img src={ImageBook} alt="Book Image" className='LibraryImageBook' />
                    </td>
                    <td>{book.quantity}</td>
                    <td>{book.quantity}</td>
                    <td>{book.author}</td>
                    <td>{book.location}</td>
                    <td>{book.publishDate}</td>
                    <td>{book.receivedDate}</td>
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
