import React, { Component } from "react";
import './LineChart.css'
import ReactApexChart from "react-apexcharts"; // Correct import

class ApexChart extends Component<{}, { options: any, series: any[] }> {
  constructor(props: {}) {
    super(props);

    this.state = {
      series: [
        {
          name: "Thành viên đọc sách",
          data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
        },
        {
          name: "Số lượng người đọc", // New line for Laptops
          data: [23, 34, 44, 55, 43, 52, 68, 80, 120]
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
        title: {
          text: 'Xu hướng thành viên',
          align: 'left'
        },
        grid: {
          row: {
            colors: ['#f3f3f3', 'transparent'],
            opacity: 0.5
          },
        },
        xaxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        }
      },
    };
  }

  render() {
    return (
      <div>
        <div id="chart">
          <ReactApexChart 
            options={this.state.options} 
            series={this.state.series} 
            type="line" 
            width="710px"
            height="300px" 
          />
        </div>
        <div id="html-dist"></div>
      </div>
    );
  }
}

export default ApexChart;