import React, { Component } from "react";
import './RegisteredMember.css';
import ReactApexChart from "react-apexcharts";

class ReaderTrends extends Component<{}, { options: any, series: any[] }> {
  constructor(props: {}) {
    super(props);

    this.state = {
      series: [
        {
          name: "Người đăng ký",
          data: Array(12).fill(0) // Khởi tạo với giá trị 0 cho mỗi tháng
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

  componentDidMount() {
    // Gọi API khi component được mount
    fetch('http://localhost:5000/registrationTrends')
      .then(response => response.json())
      .then(data => {
        // Cập nhật dữ liệu người đăng ký mỗi tháng
        const monthlyRegistrations = Array(12).fill(0);
        data.forEach((item: { month: number, registrations: number }) => {
          monthlyRegistrations[item.month - 1] = item.registrations;
        });

        this.setState({
          series: [
            {
              name: "Người đăng ký",
              data: monthlyRegistrations
            }
          ]
        });
      })
      .catch(error => console.error('Error fetching data:', error));
  }

  render() {
    return (
      <div>
        <h3 style={{ textAlign: 'center', marginBottom: '-10px' }}>Số lượng thành viên đăng ký</h3>
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
