import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

interface ApexChartState {
  series: number[]; // Số lượng sách mượn
  options: {
    chart: {
      width: number;
      type: string;
    };
    labels: string[]; // Các thể loại sách
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

const BorrowedBooksByCategory: React.FC = () => {
  const [chartData, setChartData] = useState<ApexChartState>({
    series: [],
    options: {
      chart: {
        width: 380,
        type: 'pie',
      },
      labels: [], // Các thể loại sẽ được điền sau khi fetch dữ liệu
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
    // Gọi API để lấy số lượng sách mượn theo thể loại
    fetch('http://localhost:5000/borrowedBooksByCategory')
      .then(response => response.json())
      .then(data => {
        const categories = data.map((item: { category: string }) => item.category);
        const borrowedCounts = data.map((item: { total_borrowed: string }) => Number(item.total_borrowed));

        setChartData({
          series: borrowedCounts, // Cập nhật số lượng sách mượn
          options: {
            ...chartData.options,
            labels: categories, // Cập nhật thể loại sách
          },
        });
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []); // Chạy 1 lần khi component mount

  return (
    <div>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Sách mượn theo thể loại</h2>
      <div id="chart">
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="pie"
          width={400}
        />
      </div>
    </div>
  );
};

export default BorrowedBooksByCategory;
