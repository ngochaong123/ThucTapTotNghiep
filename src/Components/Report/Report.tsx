import React from 'react'
import './Report.css';

// chart 
import LineChart from './Char/LineChart';

// icon
import fitler from "../../images/icon/filter-white.png"
import download from "../../images/icon/download.png"
import SortDown from "../../images/icon/sort-down.png"
import SortUp from "../../images/icon/sort-up.png"


export default function Report() {
  return (
    <div>
      {/* header */}
      <div className='headerReport'>
        <h1> Biều đồ phân tích </h1>
        <div style={{display:'flex'}}>

          <button className='ButtonHeaderReport'> 
            <img src={fitler} />
            <div>Bộ lộc </div>
          </button>

          <button className='ButtonHeaderReport'> 
            <img src={download} />  
            <div>Tải dữ liệu</div>
          </button>

        </div>
      </div>

      {/* growth figures */}
      <div className='ContaniergrowthFigures'>
        {/* Số lượng người đọc */}
        <div className='growthFigures'>
          <div className='NamegrowthFigures'>Doanh thu </div>
          <div className='growthFiguresData'>
            <h1> 12345 </h1>
            <div className='growthFiguresSort'>
              <img src={SortUp} className='ImgSortUp' />
              <div className='SortUp'> 10% </div>
            </div>
          </div>
        </div>

        {/* Thành viên đăng ký */}
        <div className='growthFigures'>
          <div className='NamegrowthFigures'>Thành viên đăng ký </div>
          <div className='growthFiguresData'>
            <h1> 12345 </h1>
            <div className='growthFiguresSort'>
              <img src={SortDown} className='ImgSortDown'/>
              <div className='SortDown'> 10% </div>
            </div>
          </div>
        </div>

        {/* Thành viên đọc sách */}
        <div className='growthFigures'>
          <div className='NamegrowthFigures'>Thành viên đọc sách</div>
          <div className='growthFiguresData'>
            <h1> 12345 </h1>
            <div className='growthFiguresSort'>
              <img src={SortUp} className='ImgSortUp' />
              <div className='SortUp'> 10% </div>
            </div>
          </div>
        </div>

        {/* Số lượng sách mới */}
        <div className='growthFigures'>
          <div className='NamegrowthFigures'>Số lượng sách mới </div>
          <div className='growthFiguresData'>
            <h1> 12345 </h1>
            <div className='growthFiguresSort'>
              <img src={SortDown} className='ImgSortDown'/>
              <div className='SortDown'> 10% </div>
            </div>
          </div>
        </div>

        {/* Thành viên mượn sách */}
        <div className='growthFigures' style={{marginRight:0}}>
          <div className='NamegrowthFigures'>Mượn sách về nhà </div>
          <div className='growthFiguresData'>
            <h1> 12345 </h1>
            <div className='growthFiguresSort'>
              <img src={SortUp} className='ImgSortUp' />
              <div className='SortUp'> 10% </div>
            </div>
          </div>
        </div>
      </div>

      {/* chart */}
      <div className='ContanerChartReport'>
        <div className='LineChart'>
          <LineChart />
        </div>
        
      </div>

    </div>
  )
}
