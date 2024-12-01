import React, { useState, useEffect } from 'react';
import './returnBooks.css';
import axios from 'axios';
import Magnifier from '../../images/icon/magnifier.png';

interface ReturnBooks {
  returnBook_id: string;
  member_code: string;
  name: string;
  book_code: string;
  book_name: string;
  quantity: number;
  image_link: string;
  avatar_link: string;
  borrowDate: string;
  returnDate: string;
  PenaltyFees: number;
  Status: string;
}

export default function ReturnBooks() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReturnBookId, setSelectedReturnBookId] = useState<string | null>(null);
  const [returnBooks, setReturnBooks] = useState<ReturnBooks[]>([]);  // Store all return books
  const [filteredReturnBooks, setFilteredReturnBooks] = useState<ReturnBooks[]>([]); // Store filtered books
  const [statuses, setStatuses] = useState<string[]>([]); // Lưu danh sách trạng thái
  const [selectedStatus, setSelectedStatus] = useState<string>(''); // Trạng thái đã chọn

  // Lấy danh sách trạng thái từ API
  useEffect(() => {
    axios.get('http://localhost:5000/getStatuses')
      .then(response => {
        // Trích xuất mảng trạng thái từ API
        const statusList = response.data.map((item: { Status: string }) => item.Status);
        setStatuses(statusList);
      })
      .catch(error => {
        console.error('Error fetching statuses:', error);
      });
  }, []);

  // Lấy danh sách sách trả từ API
  useEffect(() => {
    axios.get('http://localhost:5000/getAllreturnBooks')
      .then(response => {
        setReturnBooks(response.data);
        setFilteredReturnBooks(response.data);  // Set initial filtered books as all return books
      })
      .catch(error => {
        console.error('Error fetching return books:', error);
      });
  }, []);

  // Tìm kiếm sách theo tên
  useEffect(() => {
    if (searchTerm) {
      const filteredBooks = returnBooks.filter(book =>
        book.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        book.book_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.returnBook_id.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredReturnBooks(filteredBooks);
    } else {
      setFilteredReturnBooks(returnBooks);
    }
  }, [searchTerm, returnBooks]);
  

  // Lọc sách theo trạng thái
  useEffect(() => {
    if (selectedStatus) {
      const filteredByStatus = returnBooks.filter(book => 
        book.Status.toLowerCase().includes(selectedStatus.toLowerCase())
      );
      setFilteredReturnBooks(filteredByStatus);
    } else {
      setFilteredReturnBooks(returnBooks);
    }
  }, [selectedStatus, returnBooks]);

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(event.target.value);
  };

  const handleSelectReturnBook = (id: string) => {
    setSelectedReturnBookId(prevSelected => (prevSelected === id ? null : id));
  };

  return (
    <div>
      <div className='ReturnBooksCurrentInformation'>
        <div className='ReturnBooksheaderReturnBooks'>
          <h1 className='ReturnBookstile'>Trả sách</h1>
            <button className='ReturnBooksAddReturnBooks'>
              <div className='ReturnBooksNameiconFilter'>Phí nộp trể</div>
            </button>
        </div>

        <div className='ReturnBooksOptionsRow'>
          <div style={{ display: 'flex' }}>
            <div className='ChooseReturnBooks'>
              <div className='ReturnBooksNameChoose'>Trạng thái</div>
              <div className='CategoryReturnBooks'>
                <select
                  name="category"
                  value={selectedStatus}
                  onChange={handleCategoryChange}
                  className="ReturnBooksstatuses"
                >
                  <option value="">Chọn trạng thái</option>
                  {statuses.map((status, index) => (
                    <option key={index} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <div className='ReturnBooksNameSearch'>Tìm kiếm</div>
              <div className="ReturnBooksSearch">
                <div className="ReturnBookssearchIcon">
                  <img src={Magnifier} alt="Search Icon" />
                </div>
                <input
                  className="ReturnBooksSearchInput"
                  type="text"
                  placeholder="Tìm kiếm độc giả..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          <button className='ReturnBooksEditReturnBooks'>
            <div className='ReturnBooksNameEdit'>Xác nhận trả sách</div>
          </button>
        </div>

        <div className='FrameReturnBookstableContainer'>
          <div className="ReturnBookstableContainer">
            <table className="memberTable">
              <thead>
                <tr>
                  <th></th>
                  <th>Mã trả sách</th>
                  <th>Tên độc giả</th>
                  <th>Tên sách</th>
                  <th>Hình ảnh</th>
                  <th>Số lượng</th>
                  <th>Ngày mượn sách</th>
                  <th>Ngày trả sách</th>
                  <th>Phí phạt</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {filteredReturnBooks.map(returnBook => (
                  <tr key={returnBook.returnBook_id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedReturnBookId === returnBook.returnBook_id} 
                        onChange={() => handleSelectReturnBook(returnBook.returnBook_id)}
                      />
                    </td>
                    <td>{returnBook.returnBook_id}</td>
                    <td>
                      <div style={{ display: 'flex' }}>
                        <img src={`http://localhost:5000${returnBook.avatar_link}`} className='avatarReturnBooks' alt="Avatar" />
                        <div className='nameAvatarAddmember'>{returnBook.name}</div>
                      </div>
                    </td>
                    <td>{returnBook.book_name}</td>
                    <td>
                      <img src={`http://localhost:5000${returnBook.image_link}`} alt="Book" style={{ width: '50px', height: '70px' }} />
                    </td>
                    <td>{returnBook.quantity}</td>
                    <td>{new Date(returnBook.borrowDate).toLocaleDateString('vi-VN')}</td>
                    <td>{new Date(returnBook.returnDate).toLocaleDateString('vi-VN')}</td>
                    <td>{returnBook.PenaltyFees}</td>
                    <td>{returnBook.Status}</td>
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
