import React, { useState, useEffect, useRef } from 'react';
import './libraryBooks.css';

// icon
import Magnifier from '../../images/icon/magnifier.png';
import Filter from '../../images/icon/filter.png';
import ArrowDown from "../../images/icon/ArrowDown.png";
import Plus from "../../images/icon/plus.png";
import Math from "../../images/icon/math-book.png"
import literature from "../../images/icon/literature.png"
import Biology from "../../images/icon/biology.png"
import History from "../../images/icon/history-book.png"
import Science from "../../images/icon/science-book.png"

// book
import Books from "../../images/book/TuyetTacCuashakes.png";

export default function LibraryBooks() {
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null); // Thêm ref cho button

  // Hàm để thay đổi trạng thái hiển thị của menu
  const toggleFilterMenu = () => {
    setShowFilterMenu((prev) => !prev);
  };

  // useEffect để xử lý việc ẩn menu khi người dùng click ra ngoài khung
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Kiểm tra nếu click ngoài filterRef và buttonRef thì tắt menu
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

  // Dữ liệu mẫu cho bảng
  const books = [
    { id: 1, name: 'Toán cao cấp', image: Books, quantity: 5, location: 'Kệ A1', author: 'Nguyễn Văn A', year: 2018 },
    { id: 2, name: 'Văn học hiện đại', image: Books, quantity: 2, location: 'Kệ B3', author: 'Trần Thị B', year: 2020 },
    { id: 3, name: 'Hóa học cơ bản', image: Books, quantity: 3, location: 'Kệ C2', author: 'Lê Văn C', year: 2019 },
    { id: 4, name: 'Lập trình Java', image: Books, quantity: 10, location: 'Kệ D5', author: 'Phạm Minh D', year: 2021 },
    { id: 5, name: 'Lịch sử Việt Nam', image: Books, quantity: 8, location: 'Kệ E3', author: 'Nguyễn Văn E', year: 2015 },
    { id: 6, name: 'Cấu trúc dữ liệu và giải thuật', image: Books, quantity: 6, location: 'Kệ F4', author: 'Hoàng Minh F', year: 2019 },
    { id: 7, name: 'Triết học Mác - Lênin', image: Books, quantity: 4, location: 'Kệ G2', author: 'Lê Văn G', year: 2016 },
    { id: 8, name: 'Vật lý đại cương', image: Books, quantity: 7, location: 'Kệ H3', author: 'Trần Thị H', year: 2017 },
    { id: 9, name: 'Giải tích 1', image: Books, quantity: 5, location: 'Kệ I1', author: 'Nguyễn Hoàng I', year: 2022 },
    { id: 10, name: 'Phân tích thiết kế hệ thống', image: Books, quantity: 9, location: 'Kệ J4', author: 'Phạm Thị J', year: 2018 },
    { id: 11, name: 'Quản lý dự án', image: Books, quantity: 3, location: 'Kệ K5', author: 'Nguyễn Minh K', year: 2020 },
    { id: 12, name: 'Tối ưu hóa trong kỹ thuật', image: Books, quantity: 4, location: 'Kệ L6', author: 'Lê Thị L', year: 2021 },
  ];

  return (
    <div>
      <div className='LibraryBooksCurrentInformation'>
        {/* tile */}
        <div className='LibraryBooksheaderBook'>
          <h1 className='LibraryBookstileBook'> Sách thư viện </h1>
          {/* add menber */}
          <button className='LibraryBooksAddlibrary'>
            <div style={{display:'flex'}}>
            <img src={Plus} className='LibraryBooksiconFilter' alt="Filter Icon" />
              <div className='LibraryBooksNameiconFilter'> Thêm Sách mới </div>
            </div>
          </button>
          
        </div>
        
        {/* option */}
        <div className='LibraryBooksChooseBook'>
          <div>
            <div className='LibraryBooksNameChooseBook'> Thể loại </div>
            <div 
              className='LibraryBooksContanierFilter'
              ref={filterRef}  // Gắn reference vào khu vực menu
            >
              <button
                className='LibraryBooksFilter'
                onClick={toggleFilterMenu}  // Hiển thị menu khi nhấn vào
                ref={buttonRef}  // Gắn reference vào button
              >
                <div style={{display:'flex'}}>
                  <img src={Filter} className='LibraryBooksiconFilter' alt="Filter Icon" />
                  <div className='LibraryBooksNameiconFilter'> Thể loại </div>
                </div>
                <img src={ArrowDown} className='LibraryBooksiconFilter' alt="Filter Icon" />
              </button>

              {/* Menu "Thể loại" sẽ hiện hoặc ẩn dựa trên trạng thái của state */}
              {showFilterMenu && (
                <div className='LibraryBooksOptionFilter'>
                  <ul>
                    <img src={Math} />
                    <div>Toán</div>
                  </ul>
                  <ul>
                    <img src={literature} />
                    <div>Văn học</div>
                  </ul>
                  <ul>
                    <img src={Biology} />
                    <div>Sinh học</div>
                  </ul>
                  <ul>
                    <img src={History} />
                    <div>Lịch sử</div>
                  </ul>
                  <ul>
                    <img src={Science} />
                    <div>Khoa học</div>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* search */}
          <div>
            <div className='LibraryBooksNameChooseBook'> Tìm kiếm </div>
            <div className="LibraryBooksSearchBook">
              <div className="LibraryBookssearchIcon">
                <img src={Magnifier} alt="Search Icon" />
              </div>
              <input className="LibraryBooksSearchInput" type="text" placeholder="Tìm kiếm sách..." />
            </div>
          </div>
           
        </div>
      </div>

      <div className="LibraryBookscontainer-table">
          <table className="LibraryBooksbook-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên sách</th>
                <th>Hình ảnh</th>
                <th>Số lượng</th>
                <th>Vị trí</th>
                <th>Tác giả</th>
                <th>Năm xuất bản</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book, index) => (
                <tr key={book.id}>
                  <td>{index + 1}</td> {/* STT là thứ tự từ 1 */}
                  <td>{book.name}</td>
                  <td><img src={book.image} alt={book.name} className="LibraryBooksBookImage" /></td>
                  <td>{book.quantity}</td>
                  <td>{book.location}</td>
                  <td>{book.author}</td>
                  <td>{book.year}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </div>
  );
}
