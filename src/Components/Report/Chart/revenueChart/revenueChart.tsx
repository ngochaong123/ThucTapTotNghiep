import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

interface ChartDataItem {
  month: string;
  revenue: number;
  expenses: number;
}

interface ChartSeries {
  name: string;
  data: number[];
}

interface ChartOptions {
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
}

interface ChartState {
  series: ChartSeries[];
  options: ChartOptions;
}

const RevenueChart: React.FC = () => {
  const [chartData, setChartData] = useState<ChartState>({
    series: [
      { name: 'Doanh thu', data: [] },
      { name: 'Chi phí', data: [] },
    ],
    options: {
      chart: { type: 'bar', height: 350 },
      plotOptions: { bar: { horizontal: false, columnWidth: '55%', endingShape: 'rounded' } },
      dataLabels: { enabled: false },
      stroke: { show: true, width: 2, colors: ['transparent'] },
      xaxis: { categories: [] },
      yaxis: { title: { text: 'VND' } },
      fill: { opacity: 1 },
      tooltip: {
        y: {
          formatter: (val: number) => {
            // Định dạng số theo đồng Việt Nam (VND)
            const VND = new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
            });

            // Trả về số tiền theo định dạng VND
            return VND.format(val);
          }
        }
      },
    },
  });

  useEffect(() => {
    fetch('http://localhost:5000/revenueChart')
      .then(response => response.json())
      .then((data: ChartDataItem[]) => {
        if (data && data.length > 0) {
          // Lấy tháng, doanh thu và chi phí
          const months = data.map((item) => item.month);
          const revenue = data.map((item) => item.revenue);
          const expenses = data.map((item) => item.expenses);

          setChartData({
            series: [
              { name: 'Doanh thu', data: revenue },
              { name: 'Chi phí', data: expenses },
            ],
            options: {
              ...chartData.options,
              xaxis: {
                ...chartData.options.xaxis,
                categories: months, // Chỉ hiển thị tháng
              },
            },
          });
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []); // Chỉ chạy một lần khi component mount

  return (
    <div>
      <h2 style={{ marginBottom: 0 }}>Doanh thu</h2>
      <div id="chart">
        <ReactApexChart 
          options={chartData.options} 
          series={chartData.series} 
          type="bar" 
          height={300} 
          width="750px"
        />
      </div>
    </div>
  );
};

export default RevenueChart;