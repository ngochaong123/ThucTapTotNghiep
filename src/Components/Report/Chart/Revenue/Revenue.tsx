import React from "react";
import ReactApexChart from "react-apexcharts";

// Định nghĩa giao diện cho trạng thái của component
interface ApexChartState {
  series: Array<{
    data: number[];
  }>;
  options: {
    chart: {
      type: string;
      height: number;
    };
    plotOptions: {
      bar: {
        borderRadius: number;
        borderRadiusApplication: string;
        horizontal: boolean;
      };
    };
    dataLabels: {
      enabled: boolean;
    };
    xaxis: {
      categories: string[];
    };
  };
}

class ApexChart extends React.Component<{}, ApexChartState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      series: [{
        data: [120, 95, 87, 150, 110, 130, 75, 90, 80, 60], // Dữ liệu số lượng sách theo từng thể loại
      }],
      options: {
        chart: {
          type: 'bar',
          height: 350,
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            borderRadiusApplication: 'end',
            horizontal: true,
          },
        },
        dataLabels: {
          enabled: false,
        },
        xaxis: {
          categories: [
            'Văn học', 'Khoa học', 'Lịch sử', 'Kỹ thuật', 
            'Y học', 'Toán học', 'Âm nhạc', 'Nghệ thuật', 'Kinh doanh', 'Triết học'
          ], // Các thể loại sách
        },
      },
    };
  }

  render() {
    return (
      <div>
        <h2 style={{marginBottom:0}}> Số lượng sách theo thể loại </h2>
        <div id="chart">
          <ReactApexChart 
            options={this.state.options} 
            series={this.state.series} 
            type="bar" 
            height={300}
          />
        </div>
        <div id="html-dist"></div>
      </div>
    );
  }
}

export default ApexChart;