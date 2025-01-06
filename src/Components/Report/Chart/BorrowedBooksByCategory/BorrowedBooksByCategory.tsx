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

interface BorrowedBooksByCategoryProps {
  year: number; // Nhận năm từ component cha
}

const BorrowedBooksByCategory: React.FC<BorrowedBooksByCategoryProps> = ({ year }) => {
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
    if (year === 0) return; // Nếu chưa chọn năm, không gọi API

    // Gọi API để lấy số lượng sách mượn theo thể loại dựa trên năm
    fetch(`http://localhost:5000/borrowedBooksByCategory/${year}`)
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
  }, [year]); // Lắng nghe thay đổi của `year`

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
