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

// Image component for better type checking and reuse
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
  const [borrowedBooks, setBorrowedBooks] = useState<number>(0);
  const [growth, setGrowth] = useState<number>(0);

  // Fetch data functions
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

  // UseEffect for fetching data
  useEffect(() => {
    fetchRevenue();
    fetchMemberCount();
    fetchNewBooks();
    fetchBorrowedBooks();
  }, []);

  // Calculate growth percentage for new books
  useEffect(() => {
    if (previousBooks > 0) {
      const growth = ((newBooks - previousBooks) / previousBooks) * 100;
      setGrowthNewBooks(growth);
    } else {
      setGrowthNewBooks(0);
    }
  }, [newBooks, previousBooks]);

  return (
    <div style={{ marginBottom: '15px' }}>
      {/* Header */}
      <div className='headerReport'>
        <h1>Biểu đồ phân tích</h1>
        <div style={{ display: 'flex' }}>
          <button className='ButtonHeaderReport'>
            <Image src={downloadIcon} alt="Download" />
            <div>Tải dữ liệu</div>
          </button>
        </div>
      </div>

      {/* Growth figures */}
      <div className='ContaniergrowthFigures'>
        {/* Revenue */}
        <div className='growthFigures'>
        <div className='NamegrowthFigures'>Doanh thu</div>
          <div className='growthFiguresData'>
              <h1>{revenue.toLocaleString()}</h1>
              <div className='growthFiguresSort'>
                  {growthRevenue >= 0 ? (
                      <Image src={SortUp} alt="Sort Up" className='ImgSortUp' />
                  ) : (
                      <Image src={SortDown} alt="Sort Down" className='ImgSortDown' />
                  )}
                  <div className={growthRevenue >= 0 ? 'SortUp' : 'SortDown'}>
                      {growthRevenue >= 0 ? `${growthRevenue}%` : `-${Math.abs(growthRevenue)}%`}
                  </div>
              </div>
          </div>
        </div>

        {/* Lợi nhuận */}
        <div className='growthFigures'>
        <div className='NamegrowthFigures'>Lợi nhuận</div>
            <div className='growthFiguresData'>
                <h1>{borrowedBooks}</h1>
                <div className='growthFiguresSort'>
                    <Image src={SortUp} alt="Sort Up" className='ImgSortUp' />
                    <div className='SortUp'>{growth}%</div>
                </div>
            </div>
        </div>

        {/* Registered Members */}
        <div className='growthFigures'>
          <div className='NamegrowthFigures'>Thành viên đăng ký</div>
          <div className='growthFiguresData'>
            <h1>{memberCount}</h1>
            <div className='growthFiguresSort'>
              {growthMember >= 0 ? (
                <Image src={SortUp} alt="Sort Up" className='ImgSortUp' />
              ) : (
                <Image src={SortDown} alt="Sort Down" className='ImgSortDown' />
              )}
              <div className={growthMember >= 0 ? 'SortUp' : 'SortDown'}>
                {growthMember >= 0 ? `${growthMember}%` : `-${Math.abs(growthMember)}%`}
              </div>
            </div>
          </div>
        </div>

        {/* New Books */}
        <div className='growthFigures'>
          <div className='NamegrowthFigures'>Số lượng sách mới</div>
          <div className='growthFiguresData'>
            <h1>{newBooks}</h1>
            <div className='growthFiguresSort'>
              {growthNewBooks >= 0 ? (
                <Image src={SortUp} alt="Sort Up" className='ImgSortUp' />
              ) : (
                <Image src={SortDown} alt="Sort Down" className='ImgSortDown' />
              )}
              <div className={growthNewBooks >= 0 ? 'SortUp' : 'SortDown'}>
                {growthNewBooks >= 0 ? `${growthNewBooks.toFixed(2)}%` : `-${Math.abs(growthNewBooks).toFixed(2)}%`}
              </div>
            </div>
          </div>
        </div>

        {/* Borrowed Books */}
        <div className='growthFigures' style={{ marginRight: 0 }}>
          <div className='NamegrowthFigures'>Thành viên mượn sách</div>
          <div className='growthFiguresData'>
            <h1>{borrowedBooks}</h1>
            <div className='growthFiguresSort'>
              {growth >= 0 ? (
                <Image src={SortUp} alt="Sort Up" className='ImgSortUp' />
              ) : (
                <Image src={SortDown} alt="Sort Down" className='ImgSortDown' />
              )}
              <div className={growth >= 0 ? 'SortUp' : 'SortDown'}>
                {growth >= 0 ? `${growth}%` : `-${Math.abs(growth)}%`}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Charts */}
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
