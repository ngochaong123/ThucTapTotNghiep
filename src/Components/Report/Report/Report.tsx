import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer  } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Report.css';

// Chart imports
import RegisteredMember from '../Chart/RegisteredMember/RegisteredMember';
import BorrowedBooksByCategory from "../Chart/BorrowedBooksByCategory/BorrowedBooksByCategory";
import GenderRatio from "../Chart/genderRatio/genderRatio";
import QuantityBooksChart from "../Chart/quantityBooksChart/quantityBooksChart";
import OverduePenaltyChart from '../Chart/OverduePenaltyChart/OverduePenaltyChart';

// Icon imports
import downloadIcon from "../../../images/icon/download.png";

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
  
      console.log('File downloaded successfully!'); // Kiểm tra log này
      toast.success('Tải file thành công!');
    } catch (error) {
      console.error('Error downloading the file:', error);
      toast.error('Không thể tải file. Vui lòng thử lại!');
    }
  };

  return (
    <div style={{ marginBottom: '15px' }}>
      <div className='headerReport'>
        <h1>Báo cáo và thống kê</h1>
        <button className='ButtonHeaderReport' onClick={handleDownloadExcel}>
          <Image src={downloadIcon} alt="Download" />
          <div>Tải dữ liệu</div>
        </button>
      </div>

      <div className='ContanerChartReport'>
        <div className='OverduePenaltyChart'>
          <OverduePenaltyChart />
        </div>
        <div className='quantityBooks'>
          <QuantityBooksChart />
        </div>
      </div>

      <div className='ContanerChartReport'>
        <div className='genderRatio'>
          <GenderRatio />
        </div>
        <div className='ReaderTrends'>
          <RegisteredMember />
        </div>
        <div className='BorrowedBooksByCategory'>
          <BorrowedBooksByCategory />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Report;
