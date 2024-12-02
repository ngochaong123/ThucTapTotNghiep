import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

interface ApexChartState {
  series: number[]; // Dữ liệu số lượng thành viên
  options: {
    chart: {
      width: number;
      type: string;
    };
    labels: string[]; // Nhãn (giới tính)
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

const GenderRatioChart: React.FC = () => {
  const [chartData, setChartData] = useState<ApexChartState>({
    series: [], // Số lượng thành viên
    options: {
      chart: {
        width: 400,
        type: "pie",
      },
      labels: [], // Các nhãn (giới tính)
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 300,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  });

  useEffect(() => {
    // Fetch dữ liệu từ API
    fetch("http://localhost:5000/genderRatio")
      .then((response) => response.json())
      .then((data) => {
        const genders = ["Nam", "Nữ"]; // Giới tính: Nam, Nữ
        const membersCount = [data.male.count, data.female.count]; // Số lượng từng giới tính

        setChartData({
          series: membersCount, // Dữ liệu cho biểu đồ
          options: {
            ...chartData.options,
            labels: genders, // Gán nhãn giới tính
          },
        });
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []); // Chạy khi component mount

  return (
    <div>
      <h2 style={{ textAlign: "center", marginBottom: "30px", marginTop:"30px"}}>
        Tỷ lệ giới tính độc giả đăng ký
      </h2>
      <div id="chart">
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="pie"
          width={320}
        />
      </div>
    </div>
  );
};

export default GenderRatioChart;
