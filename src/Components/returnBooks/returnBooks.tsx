import React, { useState, useEffect } from 'react';
import './returnBooks.css';
import axios from 'axios';
import Magnifier from '../../images/icon/magnifier.png';
import PenaltyModal from './PenaltyModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

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
  Fee: number;
  latePaymDate: number;
  Status: string;
}

export default function ReturnBooks() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReturnBookId, setSelectedReturnBookId] = useState<string | null>(null);
  const [returnBooks, setReturnBooks] = useState<ReturnBooks[]>([]);  // Store all return books
  const [filteredReturnBooks, setFilteredReturnBooks] = useState<ReturnBooks[]>([]); // Store filtered books
  const [statuses, setStatuses] = useState<string[]>([]); // Lưu danh sách trạng thái
  const [selectedStatus, setSelectedStatus] = useState<string>(''); // Trạng thái đã chọn
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [penalties, setPenalties] = useState<{ returnBook_id: string, totalPenalty: number }[]>([]);
  const [selectedFee, setSelectedFee] = useState<number>(0);

  useEffect(() => {
    const fetchFee = async () => {
      try {
        const response = await axios.get('http://localhost:5000/getUniqueFee');
  
        if (response.data?.length > 0) {
          console.log('Fee từ API:', response.data[0].Fee);
          setSelectedFee(response.data[0].Fee); // Cập nhật giá trị Fee đầu tiên vào state
        } else {
          console.warn('Không có phí trả sách nào được tìm thấy.');
        }
      } catch (err) {
        console.error('Lỗi khi gọi API:', err);
      }
    };
  
    fetchFee();
  }, []);  

  const handleAddPenaltyClick = () => {
    setIsModalOpen(true);  // Mở modal khi nhấn nút "Phí nộp trể"
  };

  const handleSavePenalty = (updatedBooks: { returnBook_id: string, totalPenalty: number }[]) => {
    setPenalties(updatedBooks);  // Lưu danh sách phí phạt vào state của component cha
    console.log('Danh sách phí phạt đã lưu:', updatedBooks);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);  // Đóng modal khi hủy hoặc sau khi lưu
  };

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

  const handleReturnBook = async () => {
    if (!selectedReturnBookId) {
      toast.warn('Vui lòng chọn sách để trả.', { position: 'top-right' });
      return;
    }
  
    // Hiển thị hộp thoại xác nhận trước khi thực hiện trả sách
    confirmAlert({
      title: 'Xác nhận trả sách',
      message: 'Bạn có chắc chắn muốn trả sách này?',
      buttons: [
        {
          label: 'Hủy',
          onClick: () => toast.info('Hủy trả sách.', { position: 'top-right' })
        },
        {
          label: 'Xác nhận',
          onClick: async () => {
            try {
              const response = await axios.delete(`http://localhost:5000/returnBooks/${selectedReturnBookId}`);
              if (response.status === 200) {
                toast.success('Đã trả sách thành công!', { position: 'top-right' });
  
                // Cập nhật lại danh sách sách sau khi trả
                setReturnBooks(prevBooks => prevBooks.filter(book => book.returnBook_id !== selectedReturnBookId));
                setFilteredReturnBooks(prevBooks => prevBooks.filter(book => book.returnBook_id !== selectedReturnBookId));
                setSelectedReturnBookId(null);
              }
            } catch (error: unknown) {
              console.error('Lỗi khi trả sách:', error);
  
              if (axios.isAxiosError(error)) {
                // Nếu lỗi là từ Axios
                if (error.response?.status === 404) {
                  toast.error('Không tìm thấy bản ghi sách cần trả.', { position: 'top-right' });
                } else {
                  toast.error('Có lỗi xảy ra từ phía server. Vui lòng thử lại sau.', { position: 'top-right' });
                }
              } else {
                // Lỗi không phải từ Axios
                toast.error('Không thể kết nối tới server. Vui lòng kiểm tra kết nối mạng.', { position: 'top-right' });
              }
            }
          }
        }
      ]
    });
  };  

  return (
    <div>
      <div className='ReturnBooksCurrentInformation'>
      <ToastContainer />
        <div className='ReturnBooksheaderReturnBooks'>
          <h1 className='ReturnBookstile'>Trả sách</h1>
          <button className='ReturnBooksAddReturnBooks'  onClick={handleAddPenaltyClick}>
            <div className='ReturnBooksNameiconFilter'>Chỉnh sửa phí nộp</div>
          </button>
          <PenaltyModal
            isOpen={isModalOpen}           // Điều kiện modal mở
            onRequestClose={handleCloseModal} // Hàm đóng modal
            onSave={handleSavePenalty}      // Hàm lưu phí phạt (truyền qua prop)
          />
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
            <div>
              <div className="ReturnBooksNameSearch">Mức phí phạt</div>
              <span className="ReturnBooksSearch" style={{width:'250px'}}>
                {selectedFee > 0 
                  ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedFee) 
                  : 'Mức phí phạt'}
              </span>
            </div>
          </div>
          <button className='ReturnBooksEditReturnBooks' onClick={handleReturnBook}>
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
                  <th>Số ngày trả trễ</th>
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
                    <td>{returnBook.latePaymDate}</td>
                    <td>
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(returnBook.PenaltyFees)}
                    </td>
                    <td className={returnBook.Status === "Đang mượn" ? "status-green" : "status-red"}>
                      {returnBook.Status}
                    </td>
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
