import React from "react";
import ReactApexChart from "react-apexcharts"; // Ensure this is correctly imported

// Define an interface for the component's state
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

// If you're not passing any props, you can use an empty object for props.
class PieChart extends React.Component<{}, ApexChartState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      series: [44, 55, 13, 43, 22],
      options: {
        chart: {
          width: 380,
          type: 'pie',
        },
        labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }]
      },
    };
  }

  render() {
    return (
      <div>
        {/* Thêm tiêu đề cho biểu đồ */}
        <h2 style={{ textAlign: 'left' }}>Biểu Đồ Tròn của Các Đội</h2>
        <div id="chart">
          <ReactApexChart 
            options={this.state.options} 
            series={this.state.series} 
            type="pie" 
            width={380} 
          />
        </div>
        <div id="html-dist"></div>
      </div>
    );
  }
}

export default PieChart;
