import React from "react";
import ReactApexChart from "react-apexcharts"; // Đảm bảo rằng điều này đã được nhập chính xác

// Định nghĩa một giao diện cho trạng thái của thành phần
interface ApexChartState {
  series: number[];
  options: {
    chart: {
      width: number;
      type: string;
    };
    labels: string[];
    responsive: Array<{
      breakpoint: number;
      options: {
        chart: {
          width: number;
        };
        legend: {
          position: string;
        };
      };
    }>;
  };
}

// Nếu bạn không truyền bất kỳ props nào, bạn có thể sử dụng một đối tượng rỗng cho props.
class ForeignersReadBooks extends React.Component<{}, ApexChartState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      series: [200, 150, 100, 80, 60], // Số lượng người đọc sách
      options: {
        chart: {
          width: 380,
          type: 'pie',
        },
        labels: ['Mỹ', 'Anh', 'Canada', 'Pháp', 'Úc'], // Các quốc gia
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        }],
      },
    };
  }

  render() {
    return (
      <div>
        {/* Thêm tiêu đề cho biểu đồ */}
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Người nước ngoài đọc sách</h2>
        
        <div id="chart">
          <ReactApexChart 
            options={this.state.options} 
            series={this.state.series} 
            type="pie" 
            width={350} 
          />
        </div>
        <div id="html-dist"></div>
      </div>
    );
  }
}

export default ForeignersReadBooks;