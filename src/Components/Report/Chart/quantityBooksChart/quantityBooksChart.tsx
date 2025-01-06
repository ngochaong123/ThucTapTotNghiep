import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

// Định nghĩa giao diện cho trạng thái của component
interface ApexChartState {
  quantity: number[];  // Chứa dữ liệu số lượng sách
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

const QuantityBooksChart: React.FC<{ year: number }> = ({ year }) => {
  const [chartData, setChartData] = useState<ApexChartState>({
    quantity: [],  // Mảng lưu số lượng sách
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
        categories: [],
      },
    },
  });

  useEffect(() => {
    // Fetch dữ liệu từ API với tham số year
    fetch(`http://localhost:5000/quantityBooksChart/${year}`)
      .then(response => response.json())
      .then(data => {
        const categories = data.map((item: { category: string }) => item.category);
        const quantity = data.map((item: { total_quantity: number }) => item.total_quantity);

        setChartData({
          quantity: quantity,  // Cập nhật dữ liệu số lượng sách
          options: {
            ...chartData.options,
            xaxis: {
              categories: categories,
            },
          },
        });
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [year]); // Chạy lại khi `year` thay đổi

  return (
    <div>
      <h2 style={{ marginBottom: 0 }}>Số lượng sách</h2>
      <div id="chart">
        <ReactApexChart
          options={chartData.options}
          series={[{ name: "Số lượng sách", data: chartData.quantity }]}
          type="bar"
          height={300}
        />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default QuantityBooksChart;
