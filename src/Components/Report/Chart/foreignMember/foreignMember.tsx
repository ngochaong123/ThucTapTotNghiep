import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts"; // Đảm bảo rằng điều này đã được nhập chính xác

interface ApexChartState {
  series: number[];  // Dữ liệu số lượng thành viên
  options: {
    chart: {
      width: number;
      type: string;
    };
    labels: string[];  // Các quốc gia
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
    }> ;
  };
}

const ForeignMember: React.FC = () => {
  const [chartData, setChartData] = useState<ApexChartState>({
    series: [], 
    options: {
      chart: {
        width: 400,
        type: 'pie',
      },
      labels: [],  // Các quốc gia sẽ được điền sau khi fetch dữ liệu
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 300,
          },
          legend: {
            position: 'bottom',
          },
        },
      }],
    },
  });

  useEffect(() => {
    // Fetch dữ liệu từ API
    fetch('http://localhost:5000/foreignMemberChart')
      .then(response => response.json())
      .then(data => {
        const countries = data.map((item: { country: string }) => item.country);
        const membersCount = data.map((item: { total_members: number }) => item.total_members);

        setChartData({
          series: membersCount,  // Cập nhật số lượng thành viên
          options: {
            ...chartData.options,
            labels: countries,  // Cập nhật các quốc gia
          },
        });
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);  // Chạy 1 lần khi component mount

  return (
    <div>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Độc giả người nước ngoài</h2>
      <div id="chart">
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="pie"
          width={370}
        />
      </div>
    </div>
  );
};

export default ForeignMember;
