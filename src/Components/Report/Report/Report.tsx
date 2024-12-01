import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Report.css';

// Chart imports
import RegisteredMember from '../Chart/RegisteredMember/RegisteredMember';
import BorrowedBooksByCategory from "../Chart/BorrowedBooksByCategory/BorrowedBooksByCategory";
import ForeignMember from "../Chart/foreignMember/foreignMember";
import QuantityBooksChart from "../Chart/quantityBooksChart/quantityBooksChart";
import RevenueChart from '../Chart/revenueChart/revenueChart';

// Icon imports
import downloadIcon from "../../../images/icon/download.png";
import SortDown from "../../../images/icon/sort-down.png";
import SortUp from "../../../images/icon/sort-up.png";

interface ImageProps {
  src: string;
  alt: string;
  className?: string;
}

const Image: React.FC<ImageProps> = ({ src, alt, className }) => (
  <img src={src} alt={alt} className={className} />
);

const Report: React.FC = () => {
  const [revenue, setRevenue] = useState<number>(0);
  const [growthRevenue, setGrowthRevenue] = useState<number>(0);
  const [memberCount, setMemberCount] = useState<number>(0);
  const [growthMember, setGrowthMember] = useState<number>(0);
  const [newBooks, setNewBooks] = useState<number>(0);
  const [previousBooks, setPreviousBooks] = useState<number>(0);
  const [growthNewBooks, setGrowthNewBooks] = useState<number>(0);
  const [profit, setProfit] = useState<number>(0);
  const [growthProfit, setGrowthProfit] = useState<number>(0);
  const [borrowedBooks, setBorrowedBooks] = useState<number>(0);
  const [growth, setGrowth] = useState<number>(0);

  const fetchRevenue = async () => {
    try {
      const response = await axios.get('http://localhost:5000/revenueGrowth');
      setRevenue(response.data.revenue);
      setGrowthRevenue(parseFloat(response.data.growth) || 0);
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    }
  };

  const fetchMemberCount = async () => {
    try {
      const response = await axios.get('http://localhost:5000/memberRegistrationGrowth');
      setMemberCount(response.data.registrations);
      setGrowthMember(parseFloat(response.data.growth) || 0);
    } catch (error) {
      console.error('Error fetching member data:', error);
    }
  };

  const fetchNewBooks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/bookCountByMonth');
      setNewBooks(response.data.currentMonthBooks);
      setPreviousBooks(response.data.previousMonthBooks || 0);
    } catch (error) {
      console.error('Error fetching new books data:', error);
    }
  };

  const fetchBorrowedBooks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/memberBorrowGrowth');
      setBorrowedBooks(response.data.membersThisMonth);
      setGrowth(parseFloat(response.data.growth) || 0);
    } catch (error) {
      console.error('Error fetching borrowed books growth data:', error);
    }
  };

  const fetchProfit = async () => {
    try {
      const response = await axios.get('http://localhost:5000/profitGrowth');
      setProfit(response.data.profit);
      setGrowthProfit(parseFloat(response.data.growth) || 0);
    } catch (error) {
      console.error('Error fetching profit data:', error);
    }
  };

  useEffect(() => {
    fetchRevenue();
    fetchMemberCount();
    fetchNewBooks();
    fetchBorrowedBooks();
    fetchProfit();
  }, []);

  useEffect(() => {
    if (previousBooks > 0) {
      const growth = ((newBooks - previousBooks) / previousBooks) * 100;
      setGrowthNewBooks(growth);
    } else {
      setGrowthNewBooks(0);
    }
  }, [newBooks, previousBooks]);

  const handleDownloadExcel = async () => {
    try {
      const response = await axios.get('http://localhost:5000/downloadExcel', {
        responseType: 'blob', // Định dạng blob để tải file
      });
  
      // Tạo URL từ blob và kích hoạt tải file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'library_data.xlsx'); // Tên file tải về
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading the file:', error);
      alert('Không thể tải file. Vui lòng thử lại!');
    }
  };

  return (
    <div style={{ marginBottom: '15px' }}>
      <div className='headerReport'>
        <h1>Biểu đồ phân tích</h1>
        <div style={{ display: 'flex' }}>
          <button className='ButtonHeaderReport' >
            <div>Lọc theo tháng</div>
          </button>
          <button className='ButtonHeaderReport' >
          <div>Lọc theo năm</div>
          </button>
          <button className='ButtonHeaderReport' onClick={handleDownloadExcel}>
            <Image src={downloadIcon} alt="Download" />
            <div>Tải dữ liệu</div>
          </button>
        </div>
      </div>

      <div className='ContaniergrowthFigures'>
        {/* Doanh thu */}
        <div className='growthFigures'>
          <div className='NamegrowthFigures'>Số tiền phạt</div>
          <div className='growthFiguresData'>
            <h1>{revenue.toLocaleString()}</h1>
            <div className='growthFiguresSort' style={{ marginLeft: '-5px' }}>
              {growthRevenue >= 0 ? (
                <Image src={SortUp} alt="Sort Up" className='ImgSortUp'/>
              ) : (
                <Image src={SortDown} alt="Sort Down" className='ImgSortDown'/>
              )}
              <div className={growthRevenue >= 0 ? 'SortUp' : 'SortDown'}>
                {Math.abs(growthRevenue).toFixed(2)}% {/* Lấy giá trị tuyệt đối và làm tròn 2 chữ số */}
              </div>
            </div>
          </div>
        </div>

        {/* Lợi nhuận */}
        <div className='growthFigures'>
          <div className='NamegrowthFigures'>Độc giả trả trể sách</div>
          <div className='growthFiguresData'>
            <h1>{profit.toLocaleString()}</h1>
            <div className='growthFiguresSort' style={{ marginLeft: '-5px' }}>
              {profit >= 0 ? (
                <Image src={SortUp} alt="Sort Up" className='ImgSortUp'/>
              ) : (
                <Image src={SortDown} alt="Sort Down" className='ImgSortDown'/>
              )}
              <div className={profit >= 0 ? 'SortUp' : 'SortDown'}>
                {Math.abs(growthProfit).toFixed(2)}% {/* Lấy giá trị tuyệt đối và làm tròn 2 chữ số */}
              </div>
            </div>
          </div>
        </div>

        {/* Độc giả đăng ký */}
        <div className='growthFigures'>
          <div className='NamegrowthFigures'>Độc giả đăng ký</div>
          <div className='growthFiguresData'>
            <h1>{memberCount}</h1>
            <div className='growthFiguresSort'>
              {growthMember >= 0 ? (
                <Image src={SortUp} alt="Sort Up" className='ImgSortUp'/>
              ) : (
                <Image src={SortDown} alt="Sort Down" className='ImgSortDown'/>
              )}
              <div className={growthMember >= 0 ? 'SortUp' : 'SortDown'}>
                {Math.abs(growthMember).toFixed(2)}% {/* Lấy giá trị tuyệt đối và làm tròn 2 chữ số */}
              </div>
            </div>
          </div>
        </div>

        {/* Số lượng sách mới */}
        <div className='growthFigures'>
          <div className='NamegrowthFigures'>Số lượng sách mới</div>
          <div className='growthFiguresData'>
            <h1>{newBooks}</h1>
            <div className='growthFiguresSort'>
              {growthNewBooks >= 0 ? (
                <Image src={SortUp} alt="Sort Up" className='ImgSortUp'/>
              ) : (
                <Image src={SortDown} alt="Sort Down" className='ImgSortDown'/>
              )}
              <div className={growthNewBooks >= 0 ? 'SortUp' : 'SortDown'}>
                {Math.abs(growthNewBooks).toFixed(2)}% {/* Lấy giá trị tuyệt đối và làm tròn 2 chữ số */}
              </div>
            </div>
          </div>
        </div>

        {/* Thành viên mượn sách */}
        <div className='growthFigures' style={{ marginRight: 0 }}>
          <div className='NamegrowthFigures'>Độc giả mượn sách</div>
          <div className='growthFiguresData'>
            <h1>{borrowedBooks}</h1>
            <div className='growthFiguresSort'>
              {growth >= 0 ? (
                <Image src={SortUp} alt="Sort Up" className='ImgSortUp'/>
              ) : (
                <Image src={SortDown} alt="Sort Down" className='ImgSortDown'/>
              )}
              <div className={growth >= 0 ? 'SortUp' : 'SortDown'}>
                {Math.abs(growth).toFixed(2)}% {/* Lấy giá trị tuyệt đối và làm tròn 2 chữ số */}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='ContanerChartReport'>
        <div className='ChartRevenue'>
          <RevenueChart />
        </div>
        <div className='quantityBooks'>
          <QuantityBooksChart />
        </div>
      </div>

      <div className='ContanerChartReport'>
        <div className='ForeignersReadBooks'>
          <ForeignMember />
        </div>
        <div className='ReaderTrends'>
          <RegisteredMember />
        </div>
        <div className='BorrowedBooksByCategory'>
          <BorrowedBooksByCategory />
        </div>
      </div>
    </div>
  );
};

export default Report;
