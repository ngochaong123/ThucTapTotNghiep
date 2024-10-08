import React, { Component } from "react";
import './LineChart.css'
import ReactApexChart from "react-apexcharts"; // Correct import

class ReaderTrends extends Component<{}, { options: any, series: any[] }> {
  constructor(props: {}) {
    super(props);

    this.state = {
      series: [
        {
          name: "Thành viên đọc sách",
          data: [10, 41, 35, 51, 49, 62, 69, 91, 148,55,46,78]
        },
        {
          name: "Mượn sách về nhà", // New line for Laptops
          data: [23, 34, 44, 55, 43, 52, 68, 80, 120, 51, 49, 62]
        }
      ],
      options: {
        chart: {
          height: 350,
          type: 'line',
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'straight'
        },
        grid: {
          row: {
            colors: ['#f3f3f3', 'transparent'],
            opacity: 0.5
          },
        },
        xaxis: {
          categories: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
        }
      },
    };
  }

  render() {
    return (
      <div>
        <h3 style={{ textAlign: 'center',marginBottom:'-10px'}}>Xu hướng người đọc</h3>
        <div id="chart">
          <ReactApexChart 
            options={this.state.options} 
            series={this.state.series} 
            type="line" 
            width="400px"
            height="300px" 
          />
        </div>
        <div id="html-dist"></div>
      </div>
    );
  }
}

export default ReaderTrends;