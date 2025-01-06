import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Report.css';

// Chart imports
import RegisteredMember from '../Chart/RegisteredMember/RegisteredMember';
import BorrowedBooksByCategory from "../Chart/BorrowedBooksByCategory/BorrowedBooksByCategory";
import GenderRatio from "../Chart/genderRatio/genderRatio";
import QuantityBooksChart from "../Chart/quantityBooksChart/quantityBooksChart";
import OverduePenaltyChart from '../Chart/OverduePenaltyChart/OverduePenaltyChart';

// Icon imports
import downloadIcon from "../../../images/icon/download.png";
import Calendar from '../../../images/icon/calendarW.png';

interface ImageProps {
  src: string;
  alt: string;
  className?: string;
}

const Image: React.FC<ImageProps> = ({ src, alt, className }) => (
  <img src={src} alt={alt} className={className} />
);

const Report: React.FC = () => {
  const [newBooks, setNewBooks] = useState<number>(0);
  const [previousBooks, setPreviousBooks] = useState<number>(0);
  const [growthNewBooks, setGrowthNewBooks] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [resetKey, setResetKey] = useState(Date.now()); 
  
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
        responseType: 'blob',
      });
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'library_data.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
  
      toast.success('Tải file thành công!');
    } catch (error) {
      toast.error('Không thể tải file. Vui lòng thử lại!');
    }
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    setResetKey(Date.now()); // Cập nhật key khi người dùng chọn năm mới
  };

  useEffect(() => {
    // Nếu chưa chọn năm, gán năm hiện tại từ hệ thống
    if (!selectedDate) {
      setSelectedDate(new Date()); // Gán năm hiện tại từ hệ thống
    }
  }, [selectedDate]);

  return (
    <div style={{ marginBottom: '15px' }}>
      <div className='headerReport'>
        <h1>Báo cáo và thống kê</h1>
        <div style={{ display: 'flex' }}>
          <button className='ButtonHeaderReport'>
            <Image src={Calendar} alt="Chọn năm" />
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              dateFormat="yyyy"
              className="ReportDatePicker"
              placeholderText="Chọn năm"
              showYearPicker  // Hiển thị chỉ năm
            />
          </button>
          <button className='ButtonHeaderReport' onClick={handleDownloadExcel}>
            <Image src={downloadIcon} alt="Tải dữ liệu" />
            <div>Tải dữ liệu</div>
          </button>
        </div>
      </div>

      <div className='ContanerChartReport'>
        <div className='OverduePenaltyChart'>
          <OverduePenaltyChart key={resetKey} year={selectedDate?.getFullYear() || 0} />
        </div>
        <div className='quantityBooks'>
          <QuantityBooksChart key={resetKey} year={selectedDate?.getFullYear() || 0} />
        </div>
      </div>

      <div className='ContanerChartReport'>
        <div className='genderRatio'>
          <GenderRatio key={resetKey} year={selectedDate?.getFullYear() || 0} />
        </div>
        <div className='ReaderTrends'>
          <RegisteredMember key={resetKey} year={selectedDate?.getFullYear() || 0} />
        </div>
        <div className='BorrowedBooksByCategory'>
          <BorrowedBooksByCategory key={resetKey} year={selectedDate?.getFullYear() || 0} />
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Report;
