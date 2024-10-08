import React from 'react';
import ReactApexChart from 'react-apexcharts';

// Định nghĩa kiểu dữ liệu cho state
interface ChartState {
  series: Array<{
    name: string;
    data: number[];
  }>;
  options: {
    chart: {
      type: string;
      height: number;
    };
    plotOptions: {
      bar: {
        horizontal: boolean;
        columnWidth: string;
        endingShape: string;
      };
    };
    dataLabels: {
      enabled: boolean;
    };
    stroke: {
      show: boolean;
      width: number;
      colors: string[];
    };
    xaxis: {
      categories: string[];
    };
    yaxis: {
      title: {
        text: string;
      };
    };
    fill: {
      opacity: number;
    };
    tooltip: {
      y: {
        formatter: (val: number) => string;
      };
    };
  };
}

class revenueChart extends React.Component<{}, ChartState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      series: [{
        name: 'Doanh thu',
        data: [44, 55, 57, 56, 61, 58, 63, 60, 66,87,55,62]
      }, {
        name: 'Chi phí',
        data: [76, 85, 101, 98, 87, 105, 91, 114, 94,74,40,60]
      }],
      options: {
        chart: {
          type: 'bar',
          height: 350
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '55%',
            endingShape: 'rounded'
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent']
        },
        xaxis: {
          categories: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12']
        },
        yaxis: {
          title: {
            text: '$ (thousands)'
          }
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: (val: number) => {
              return "$ " + val + " thousands";
            }
          }
        }
      }
    };
  }

  render() {
    return (
      <div>
        <h2 style={{marginBottom:0}}> Doanh thu </h2>
        <div id="chart">
          <ReactApexChart 
            options={this.state.options} 
            series={this.state.series} 
            type="bar" 
            height={300} 
            width="710px"
          />
        </div>
      </div>
    );
  }
}

export default revenueChart;