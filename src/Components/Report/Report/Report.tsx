import React from 'react';
import './Report.css';

// chart 
import ReaderTrends from '../Chart/LineChar/LineChart';
import Map from "../Chart/Map/Map";
import ForeignersReadBooks from "../Chart/ForeignersReadBooks/ForeignersReadBooks";
import QuantityBooksChart from "../Chart/quantityBooksChart/quantityBooksChart";
import RevenueChart from '../Chart/revenueChart/revenueChart';

// icon
import filterIcon from "../../../images/icon/filter-white.png";
import downloadIcon from "../../../images/icon/download.png";
import SortDown from "../../../images/icon/sort-down.png";
import SortUp from "../../../images/icon/sort-up.png";

// Define the type for the icons (for better TypeScript type checking)
interface ImageProps {
  src: string;
  alt: string;
  className?: string;
}

const Image: React.FC<ImageProps> = ({ src, alt, className }) => (
  <img src={src} alt={alt} className={className} />
);

const Report: React.FC = () => {
  return (
    <div style={{ marginBottom: '15px' }}>
      {/* Header */}
      <div className='headerReport'>
        <h1>Biểu đồ phân tích</h1>
        <div style={{ display: 'flex' }}>
          <button className='ButtonHeaderReport'>
            <Image src={filterIcon} alt="Filter" />
            <div>Bộ lọc</div>
          </button>

          <button className='ButtonHeaderReport'>
            <Image src={downloadIcon} alt="Download" />
            <div>Tải dữ liệu</div>
          </button>
        </div>
      </div>

      {/* Growth figures */}
      <div className='ContaniergrowthFigures'>
        {/* Doanh thu */}
        <div className='growthFigures'>
          <div className='NamegrowthFigures'>Doanh thu</div>
          <div className='growthFiguresData'>
            <h1>12345</h1>
            <div className='growthFiguresSort'>
              <Image src={SortUp} alt="Sort Up" className='ImgSortUp' />
              <div className='SortUp'>10%</div>
            </div>
          </div>
        </div>

        {/* Thành viên đăng ký */}
        <div className='growthFigures'>
          <div className='NamegrowthFigures'>Thành viên đăng ký</div>
          <div className='growthFiguresData'>
            <h1>12345</h1>
            <div className='growthFiguresSort'>
              <Image src={SortDown} alt="Sort Down" className='ImgSortDown' />
              <div className='SortDown'>10%</div>
            </div>
          </div>
        </div>

        {/* Thành viên đọc sách */}
        <div className='growthFigures'>
          <div className='NamegrowthFigures'>Thành viên đọc sách</div>
          <div className='growthFiguresData'>
            <h1>12345</h1>
            <div className='growthFiguresSort'>
              <Image src={SortUp} alt="Sort Up" className='ImgSortUp' />
              <div className='SortUp'>10%</div>
            </div>
          </div>
        </div>

        {/* Số lượng sách mới */}
        <div className='growthFigures'>
          <div className='NamegrowthFigures'>Số lượng sách mới</div>
          <div className='growthFiguresData'>
            <h1>12345</h1>
            <div className='growthFiguresSort'>
              <Image src={SortDown} alt="Sort Down" className='ImgSortDown' />
              <div className='SortDown'>10%</div>
            </div>
          </div>
        </div>

        {/* Thành viên mượn sách */}
        <div className='growthFigures' style={{ marginRight: 0 }}>
          <div className='NamegrowthFigures'>Mượn sách về nhà</div>
          <div className='growthFiguresData'>
            <h1>12345</h1>
            <div className='growthFiguresSort'>
              <Image src={SortUp} alt="Sort Up" className='ImgSortUp' />
              <div className='SortUp'>10%</div>
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
          <ForeignersReadBooks />
        </div>
        <div className='WorldMap'>
          <Map />
        </div>
        <div className='ReaderTrends'>
          <ReaderTrends />
        </div>
      </div>
    </div>
  );
}

export default Report;
